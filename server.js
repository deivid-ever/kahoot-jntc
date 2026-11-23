'use strict';

const path = require('path');
const http = require('http');
const crypto = require('crypto');
const express = require('express');
const { Server } = require('socket.io');
const { CATEGORIES, QUESTIONS } = require('./questions');

const PORT = process.env.PORT || 3000;
const MOD_PASS = process.env.MOD_PASS || 'JNTC2026';
const READY_MS = 3000;
const READING_MS = 3500;
const PUBLIC_DIR = path.join(__dirname, 'public');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { pingInterval: 10000, pingTimeout: 20000 });

app.disable('x-powered-by');

// Keep-alive: los clientes (proyector y moderador) llaman a /ping cada 4 minutos
app.get('/ping', (req, res) => res.status(200).send('pong'));
app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'index.html')));
app.get('/moderador', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'moderador.html')));
app.get('/jugar', (req, res) => res.sendFile(path.join(PUBLIC_DIR, 'buzzer.html')));
app.use(express.static(PUBLIC_DIR, { index: false }));

/* ------------------------------ Estado del juego ------------------------------ */

const game = {
  phase: 'LOBBY',
  pin: newPin(),
  players: new Map(),
  settings: { from: 1, to: 20, time: 20, random: false },
  order: [],
  pos: -1,
  timer: null,
  token: 0,
  phaseEndsAt: 0,
  phaseMs: 0,
  qStart: 0,
  counts: [0, 0, 0, 0],
  closeFor: null
};

function newPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function cleanName(n) {
  return String(n || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 20);
}
function currentQ() {
  return game.pos >= 0 && game.pos < game.order.length ? QUESTIONS[game.order[game.pos]] : null;
}
function ranking() {
  return [...game.players.values()].sort((a, b) => b.score - a.score || a.joined - b.joined);
}

function setPhase(phase, ms) {
  game.phase = phase;
  game.token++;
  clearTimeout(game.timer);
  game.timer = null;
  game.phaseMs = ms || 0;
  game.phaseEndsAt = ms ? Date.now() + ms : 0;
}
function schedule(ms, fn) {
  const t = game.token;
  game.timer = setTimeout(() => {
    if (t !== game.token) return;
    fn();
  }, ms);
}

/* ------------------------------ Flujo de la partida ------------------------------ */

function startGame(cfg) {
  const N = QUESTIONS.length;
  cfg = cfg || {};
  const from = clamp(parseInt(cfg.from, 10) || 1, 1, N);
  let to = clamp(parseInt(cfg.to, 10) || 20, 1, N);
  if (to < from) to = from;
  const time = clamp(parseInt(cfg.time, 10) || 20, 5, 120);
  const random = !!cfg.random;
  game.settings = { from, to, time, random };
  game.order = [];
  for (let i = from - 1; i < to; i++) game.order.push(i);
  if (random) {
    for (let i = game.order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [game.order[i], game.order[j]] = [game.order[j], game.order[i]];
    }
  }
  game.pos = -1;
  for (const p of game.players.values()) {
    p.score = 0;
    p.streak = 0;
    p.answer = null;
    p.last = null;
  }
  nextQuestion();
}

function nextQuestion() {
  game.pos++;
  if (game.pos >= game.order.length) return showPodium();
  for (const p of game.players.values()) {
    p.answer = null;
    p.last = null;
  }
  setPhase('GET_READY', READY_MS);
  schedule(READY_MS, () => {
    setPhase('READING', READING_MS);
    schedule(READING_MS, startAnswering);
    broadcast();
  });
  broadcast();
}

function startAnswering() {
  const total = game.settings.time * 1000;
  setPhase('ANSWERING', total);
  game.qStart = Date.now();
  game.closeFor = null;
  schedule(total, endQuestion);
  broadcast();
}

function endQuestion() {
  if (game.phase !== 'ANSWERING') return;
  const q = currentQ();
  const total = game.settings.time * 1000;
  game.counts = [0, 0, 0, 0];
  for (const p of game.players.values()) {
    const a = p.answer;
    if (a) game.counts[a.choice]++;
    if (a && q && a.choice === q.a) {
      p.streak++;
      const elapsed = clamp(a.elapsed, 0, total);
      const speed = Math.round((1 - (elapsed / total) / 2) * 1000);
      const bonus = p.streak >= 2 ? Math.min(500, (p.streak - 1) * 100) : 0;
      const pts = speed + bonus;
      p.score += pts;
      p.last = { answered: true, correct: true, points: pts, choice: a.choice };
    } else {
      p.streak = 0;
      p.last = { answered: !!a, correct: false, points: 0, choice: a ? a.choice : null };
    }
  }
  // Sin temporizadores: espera al moderador
  setPhase('QUESTION_RESULT', 0);
  broadcast();
}

function showPodium() {
  setPhase('PODIUM', 0);
  broadcast();
}

function resetToLobby() {
  setPhase('LOBBY', 0);
  game.pos = -1;
  game.order = [];
  game.counts = [0, 0, 0, 0];
  for (const p of game.players.values()) {
    p.score = 0;
    p.streak = 0;
    p.answer = null;
    p.last = null;
  }
  broadcast();
}

function nextStep() {
  switch (game.phase) {
    case 'ANSWERING':
      endQuestion();
      break;
    case 'QUESTION_RESULT':
      setPhase('LEADERBOARD', 0);
      broadcast();
      break;
    case 'LEADERBOARD':
      if (game.pos >= game.order.length - 1) showPodium();
      else nextQuestion();
      break;
    case 'PODIUM':
      resetToLobby();
      break;
    default:
      break; // GET_READY / READING / LOBBY: no hace nada
  }
}

function allAnswered() {
  const online = [...game.players.values()].filter(p => p.online);
  return online.length > 0 && online.every(p => p.answer);
}

// Cierre automático: 400 ms después de que respondan todos los conectados
function checkAllAnswered() {
  if (game.phase !== 'ANSWERING' || game.closeFor === game.token) return;
  if (!allAnswered()) return;
  game.closeFor = game.token;
  const t = game.token;
  setTimeout(() => {
    if (t !== game.token || game.phase !== 'ANSWERING') return;
    if (allAnswered()) endQuestion();
    else game.closeFor = null;
  }, 400);
}

/* ------------------------------ Estados enviados a los clientes ------------------------------ */

function basePublic() {
  const q = currentQ();
  const ph = game.phase;
  const all = [...game.players.values()];
  const s = {
    phase: ph,
    pin: game.pin,
    serverNow: Date.now(),
    phaseEndsAt: game.phaseEndsAt,
    phaseMs: game.phaseMs,
    online: all.filter(p => p.online).length,
    total: all.length,
    answered: all.filter(p => p.answer).length,
    qNum: game.pos + 1,
    qTotal: game.order.length,
    timeTotal: game.settings.time
  };
  if (q && ph !== 'LOBBY' && ph !== 'PODIUM') {
    s.category = { key: q.c, label: CATEGORIES[q.c] };
    if (ph !== 'GET_READY') s.text = q.q;
    if (ph === 'ANSWERING' || ph === 'QUESTION_RESULT' || ph === 'LEADERBOARD') s.options = q.o;
    // La respuesta correcta NUNCA se envía mientras se está votando
    if (ph === 'QUESTION_RESULT' || ph === 'LEADERBOARD') {
      s.correct = q.a;
      s.counts = game.counts;
    }
  }
  if (ph === 'LEADERBOARD') {
    s.top5 = ranking().slice(0, 5).map((p, i) => ({ rank: i + 1, name: p.name, score: p.score, streak: p.streak }));
  }
  if (ph === 'PODIUM') {
    s.podium = ranking().slice(0, 3).map((p, i) => ({ rank: i + 1, name: p.name, score: p.score }));
  }
  return s;
}

function meOf(p, rk) {
  const idx = rk.indexOf(p);
  const ahead = idx > 0 ? rk[idx - 1] : null;
  return {
    id: p.id,
    name: p.name,
    score: p.score,
    streak: p.streak,
    answered: !!p.answer,
    choice: p.answer ? p.answer.choice : null,
    last: p.last,
    rank: idx + 1,
    behind: ahead ? { name: ahead.name, diff: ahead.score - p.score } : null,
    players: rk.length
  };
}

function modState(base, rk) {
  const q = currentQ();
  const show = q && game.phase !== 'LOBBY' && game.phase !== 'PODIUM';
  return Object.assign({}, base, {
    settings: game.settings,
    maxQuestions: QUESTIONS.length,
    modq: show ? { num: game.pos + 1, category: CATEGORIES[q.c], text: q.q, options: q.o, correct: q.a } : null,
    players: rk.map(p => ({
      id: p.id, name: p.name, score: p.score, streak: p.streak, online: p.online, answered: !!p.answer
    }))
  });
}

function broadcast() {
  const base = basePublic();
  const rk = ranking();
  const list = [...game.players.values()]
    .sort((a, b) => a.joined - b.joined)
    .map(p => ({ id: p.id, name: p.name, online: p.online }));
  io.to('display').emit('state', Object.assign({}, base, { players: list }));
  for (const p of game.players.values()) {
    if (p.socketId) io.to(p.socketId).emit('state', Object.assign({}, base, { me: meOf(p, rk) }));
  }
  io.to('mod').emit('moderatorState', modState(base, rk));
}

let softTimer = null;
function softBroadcast() {
  if (softTimer) return;
  softTimer = setTimeout(() => {
    softTimer = null;
    broadcast();
  }, 150);
}

/* ------------------------------ Sockets ------------------------------ */

io.on('connection', socket => {
  socket.on('watch', () => {
    socket.join('display');
    broadcast();
  });

  socket.on('modAuth', (pass, cb) => {
    if (typeof cb !== 'function') cb = () => {};
    if (String(pass || '') === MOD_PASS) {
      socket.data.mod = true;
      socket.join('mod');
      cb({ ok: true });
      broadcast();
    } else {
      cb({ ok: false });
    }
  });

  socket.on('join', (data, cb) => {
    if (typeof cb !== 'function') cb = () => {};
    data = data || {};
    const name = cleanName(data.name);
    let p = data.playerId ? game.players.get(String(data.playerId)) : null;
    if (!p) {
      if (String(data.pin || '') !== game.pin) return cb({ ok: false, error: 'PIN incorrecto' });
      if (!name) return cb({ ok: false, error: 'Escribe un apodo o nombre de equipo' });
      const dup = [...game.players.values()].find(x => x.name.toLowerCase() === name.toLowerCase());
      if (dup) {
        if (dup.online) return cb({ ok: false, error: 'Ese apodo ya está en uso, elige otro' });
        p = dup; // retoma a un jugador desconectado con el mismo apodo
      } else {
        p = {
          id: crypto.randomBytes(6).toString('hex'),
          name,
          score: 0,
          streak: 0,
          online: true,
          socketId: null,
          answer: null,
          last: null,
          joined: Date.now()
        };
        game.players.set(p.id, p);
      }
    }
    p.socketId = socket.id;
    p.online = true;
    socket.data.playerId = p.id;
    cb({ ok: true, playerId: p.id, name: p.name });
    broadcast();
  });

  socket.on('answer', (choice, cb) => {
    if (typeof cb !== 'function') cb = () => {};
    const p = game.players.get(socket.data.playerId);
    if (!p) return cb({ ok: false, error: 'No estás en la partida' });
    if (game.phase !== 'ANSWERING') return cb({ ok: false, error: 'Fuera de tiempo' });
    if (p.answer) return cb({ ok: false, error: 'Ya respondiste' });
    choice = parseInt(choice, 10);
    if (!(choice >= 0 && choice <= 3)) return cb({ ok: false, error: 'Opción inválida' });
    const elapsed = Date.now() - game.qStart;
    if (elapsed > game.settings.time * 1000 + 500) return cb({ ok: false, error: 'Fuera de tiempo' });
    p.answer = { choice, elapsed };
    cb({ ok: true });
    softBroadcast();
    checkAllAnswered();
  });

  // --- Eventos exclusivos del moderador ---
  socket.on('mod:start', cfg => {
    if (!socket.data.mod || game.phase !== 'LOBBY') return;
    startGame(cfg);
  });
  socket.on('mod:next', () => {
    if (!socket.data.mod) return;
    nextStep();
  });
  socket.on('mod:kick', id => {
    if (!socket.data.mod) return;
    const p = game.players.get(String(id));
    if (!p) return;
    if (p.socketId) io.to(p.socketId).emit('kicked');
    game.players.delete(p.id);
    broadcast();
    checkAllAnswered();
  });
  socket.on('mod:reset', () => {
    if (!socket.data.mod) return;
    resetToLobby();
  });

  socket.on('disconnect', () => {
    const p = game.players.get(socket.data.playerId);
    if (p && p.socketId === socket.id) {
      p.online = false;
      p.socketId = null;
    }
    broadcast();
    checkAllAnswered();
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Kahoot JNTC escuchando en el puerto ' + PORT);
  console.log('PIN de la sala: ' + game.pin);
});
