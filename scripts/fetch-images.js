'use strict';
/**
 * Descarga UNA SOLA VEZ las imágenes alusivas a cada tema del banco de
 * preguntas y las guarda en public/img/, junto a un manifest.json que
 * mapea tema -> ruta local. El servidor (server.js) lee ese manifiesto
 * y sirve las imágenes desde disco, sin hacer ninguna solicitud a
 * internet durante el evento en vivo.
 *
 * Uso:
 *   node scripts/fetch-images.js
 *   (o)  npm run fetch-images
 *
 * Variables de entorno opcionales:
 *   PIXABAY_KEY  -> si se define, se intenta primero con Pixabay
 *                   (suele dar fotos más relevantes); si falta o no
 *                   encuentra nada, se usa la miniatura de Wikipedia
 *                   en español como respaldo.
 *
 * El script es reanudable: si se corre varias veces, no repite la
 * descarga de un tema que ya tenga archivo local, así que se puede
 * ejecutar de nuevo sin generar solicitudes de más para completar los
 * temas que hayan fallado por timeout o falta de imagen.
 */

const fs = require('fs');
const path = require('path');
const { QUESTIONS } = require('../questions');

const PIXABAY_KEY = process.env.PIXABAY_KEY || '';
const IMG_DIR = path.join(__dirname, '..', 'public', 'img');
const MANIFEST_PATH = path.join(IMG_DIR, 'manifest.json');
const DELAY_MS = 350; // pausa entre solicitudes para no saturar las APIs gratuitas

function slugify(topic) {
  return topic
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function findImageUrl(topic) {
  const term = topic.replace(/_/g, ' ').replace(/\(.*?\)/g, '').trim();

  if (PIXABAY_KEY) {
    try {
      const r = await fetch(
        'https://pixabay.com/api/?key=' + encodeURIComponent(PIXABAY_KEY) +
        '&q=' + encodeURIComponent(term) +
        '&lang=es&image_type=photo&orientation=horizontal&safesearch=true&per_page=3'
      );
      if (r.ok) {
        const d = await r.json();
        if (d.hits && d.hits.length) return d.hits[0].webformatURL;
      }
    } catch (e) { /* se intenta con Wikipedia a continuación */ }
  }

  try {
    const r = await fetch(
      'https://es.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(topic),
      { headers: { 'User-Agent': 'JNTC-Quiz/1.0 (descarga offline)' } }
    );
    if (r.ok) {
      const d = await r.json();
      if (d.thumbnail && d.thumbnail.source) return d.thumbnail.source.replace(/\/\d+px-/, '/800px-');
      if (d.originalimage && d.originalimage.source) return d.originalimage.source;
    }
  } catch (e) { /* sin imagen disponible */ }

  return null;
}

async function downloadToFile(url, destPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

async function main() {
  fs.mkdirSync(IMG_DIR, { recursive: true });

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  }

  const topics = [...new Set(QUESTIONS.map((q) => q.topic))];
  console.log('Temas únicos a procesar: ' + topics.length);

  let done = 0, skipped = 0, failed = 0;

  for (const topic of topics) {
    const slug = slugify(topic);
    const localRel = '/img/' + slug + '.jpg';
    const localAbs = path.join(IMG_DIR, slug + '.jpg');

    if (manifest[topic] && fs.existsSync(localAbs)) {
      skipped++;
      continue; // ya está descargada de una corrida anterior: no se repite la solicitud
    }

    try {
      const url = await findImageUrl(topic);
      if (!url) {
        failed++;
        console.warn('Sin imagen disponible para: ' + topic);
        continue;
      }
      await downloadToFile(url, localAbs);
      manifest[topic] = localRel;
      done++;
      console.log('OK   ' + topic + ' -> ' + localRel);
    } catch (e) {
      failed++;
      console.warn('Error con "' + topic + '": ' + e.message);
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    await sleep(DELAY_MS);
  }

  console.log('');
  console.log('Listo. Nuevas: ' + done + ' | ya existentes: ' + skipped + ' | fallidas: ' + failed);
  console.log('Manifiesto: ' + MANIFEST_PATH);
  if (failed > 0) {
    console.log('Puedes volver a correr "npm run fetch-images" para reintentar solo los temas fallidos.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
