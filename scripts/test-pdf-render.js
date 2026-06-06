'use strict';

const React   = require('react');
const { Document, Page, Text, View, Font, renderToFile } = require('@react-pdf/renderer');
const path    = require('path');

const FONT_DIR = path.join(__dirname, '..', 'public', 'fonts');

Font.register({
  family: 'DMSans',
  fonts: [
    { src: path.join(FONT_DIR, 'DMSans-clean.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'DMSans-Italic-clean.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: path.join(FONT_DIR, 'DMSans-clean.ttf'), fontWeight: 700 },
  ],
});
Font.register({
  family: 'Playfair',
  fonts: [
    { src: path.join(FONT_DIR, 'PlayfairDisplay-clean.ttf'), fontWeight: 400 },
    { src: path.join(FONT_DIR, 'PlayfairDisplay-Italic-clean.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const e = React.createElement;

const row = (bullet, text) => e(View, { style: { flexDirection: 'row', marginBottom: 6 } },
  e(Text, { style: { color: '#B8612A', fontSize: 13, marginRight: 8, marginTop: -1 } }, '•'),
  e(Text, { style: { fontSize: 10, color: '#2E4A3A', flex: 1, lineHeight: 1.6 } }, text)
);

const section = (label, ...children) => e(View, { style: { marginBottom: 16 } },
  e(Text, { style: { fontSize: 8, fontWeight: 700, color: '#B8612A', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 } }, label),
  ...children
);

const doc = e(Document, null,
  e(Page, { size: 'A4', style: { backgroundColor: '#F5EFE4', fontFamily: 'DMSans', padding: 40, paddingBottom: 60 } },

    // Ligatures fi / fl / ff / ffi / ffl
    section('Ligatures DMSans (doivent être complètes)',
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        'ficus — conflit — enfin — suffisamment — afficher — difficile — officiel'),
    ),

    // Premières lettres disparues (T, G, O)
    section('Premières lettres (T, G, O doivent apparaître)',
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        'Terracotta — Grège — On retire — Greige — Ocre — Taupe'),
    ),

    // Accents français
    section('Accents français',
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        'étagère — château — façade — crème — hêtre — piqûre — œil'),
    ),

    // Symbole €
    section('Symbole monétaire',
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        'Budget : 500-1 500 € — coût estimé : 200 €/m²'),
    ),

    // Après puces
    section('Après puces (première lettre)',
      row('•', 'On retire le ficus du salon.'),
      row('•', 'Grège suffisamment lumineux pour ce coloris.'),
      row('•', 'Terracotta en accent mural, 2 m².'),
      row('•', 'Conflit de matières résolu avec le lin.'),
      row('•', 'Enfin une cohérence entre sol et plafond.'),
    ),

    // DMSans italic
    section('DMSans italique',
      e(Text, { style: { fontSize: 10, fontStyle: 'italic', color: '#888780', marginBottom: 4 } },
        'ficus, Grège, Terracotta, suffisamment, conflit, On retire'),
    ),

    // Playfair italic (titres, phrase-clé)
    section('Playfair italic (titres & phrase-clé)',
      e(Text, { style: { fontSize: 22, fontFamily: 'Playfair', fontStyle: 'italic', color: '#2E4A3A', marginBottom: 8 } },
        'Neutre — Grège & Terracotta'),
      e(Text, { style: { fontSize: 13, fontFamily: 'Playfair', fontStyle: 'italic', color: '#F5EFE4', backgroundColor: '#2E4A3A', padding: 12, borderRadius: 8 } },
        'On retire le superflu, enfin. Grège, Terracotta, suffisamment de lumière.'),
    ),

    // Chiffres et typographie mixte
    section('Chiffres & mixte',
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        '01 Repeindre les murs — 02 Changer le canapé — 03 Ajouter des coussins'),
      e(Text, { style: { fontSize: 10, color: '#2E4A3A', marginBottom: 4 } },
        'entre 800 € et 1 500 € — surface : 15 m²'),
    ),
  )
);

const outPath = path.join(__dirname, '..', 'test-output.pdf');

renderToFile(doc, outPath)
  .then(() => console.log('PDF généré :', outPath))
  .catch(err => { console.error('Erreur :', err.message); process.exit(1); });
