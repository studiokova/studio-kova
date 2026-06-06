/**
 * Remplace la table GSUB de chaque police TTF par un GSUB 1.0 minimal vide.
 * Résultat : aucune substitution de glyphes (ligatures, alternates…).
 * Tables cmap / glyf / hmtx inchangées → accents et € non affectés.
 * Les fichiers d'origine restent intacts ; les sorties sont *-clean.ttf.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// GSUB 1.0 minimal : 0 scripts, 0 features, 0 lookups (16 octets)
const EMPTY_GSUB = Buffer.alloc(16);
EMPTY_GSUB.writeUInt16BE(1,  0);   // majorVersion = 1
EMPTY_GSUB.writeUInt16BE(0,  2);   // minorVersion = 0
EMPTY_GSUB.writeUInt16BE(10, 4);   // ScriptListOffset  → octet 10
EMPTY_GSUB.writeUInt16BE(12, 6);   // FeatureListOffset → octet 12
EMPTY_GSUB.writeUInt16BE(14, 8);   // LookupListOffset  → octet 14
EMPTY_GSUB.writeUInt16BE(0, 10);   // ScriptList  : count = 0
EMPTY_GSUB.writeUInt16BE(0, 12);   // FeatureList : count = 0
EMPTY_GSUB.writeUInt16BE(0, 14);   // LookupList  : count = 0

function tableChecksum(buf, offset, length) {
  let sum = 0;
  const aligned = (length + 3) & ~3;
  for (let i = 0; i < aligned; i += 4) {
    let word = 0;
    for (let b = 0; b < 4; b++) {
      const pos = offset + i + b;
      word = ((word << 8) | (pos < buf.length ? buf[pos] : 0)) >>> 0;
    }
    sum = (sum + word) >>> 0;
  }
  return sum;
}

function processFont(src, dst) {
  const buf = Buffer.from(fs.readFileSync(src));
  const numTables = buf.readUInt16BE(4);
  let patched = false;

  for (let i = 0; i < numTables; i++) {
    const dir = 12 + i * 16;
    if (buf.toString('ascii', dir, dir + 4) !== 'GSUB') continue;

    const tableOffset = buf.readUInt32BE(dir + 8);
    const tableLength = buf.readUInt32BE(dir + 12);

    // Écrase les données GSUB par le GSUB vide
    EMPTY_GSUB.copy(buf, tableOffset);
    // Zéroe les octets restants (ancienne table)
    if (tableLength > EMPTY_GSUB.length) {
      buf.fill(0, tableOffset + EMPTY_GSUB.length, tableOffset + tableLength);
    }

    // Recalcule le checksum de la table dans le répertoire
    buf.writeUInt32BE(tableChecksum(buf, tableOffset, tableLength), dir + 4);

    console.log(`  GSUB : ${tableLength} octets → table vide (${EMPTY_GSUB.length} octets effectifs)`);
    patched = true;
    break;
  }

  if (!patched) console.log('  Pas de table GSUB trouvée');
  fs.writeFileSync(dst, buf);
}

const FONT_DIR = path.join(__dirname, '..', 'public', 'fonts');
const FONTS = [
  'DMSans',
  'DMSans-Italic',
  'PlayfairDisplay',
  'PlayfairDisplay-Italic',
];

for (const name of FONTS) {
  const src = path.join(FONT_DIR, `${name}.ttf`);
  const dst = path.join(FONT_DIR, `${name}-clean.ttf`);
  process.stdout.write(`${name}.ttf ... `);
  processFont(src, dst);
  console.log(`→ ${name}-clean.ttf`);
}

console.log('\nTerminé. Vérification :');
for (const name of FONTS) {
  const orig = fs.statSync(path.join(FONT_DIR, `${name}.ttf`)).size;
  const clean = fs.statSync(path.join(FONT_DIR, `${name}-clean.ttf`)).size;
  console.log(`  ${name}: ${orig} → ${clean} octets (delta ${clean - orig})`);
}
