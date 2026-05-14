"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";

const TOTAL = 7;

const SCORING = {
  2: {
    "Les couleurs":                      { sature: 2 },
    "La lumière naturelle":              { chaud: 1, epure: 1, neutre_col: 1 },
    "L'organisation et la clarté":       { froid: 1, epure: 2, neutre_col: 1 },
    "Les matières et textures":          { chaud: 2, charge: 1, neutre_col: 1 },
    "Les objets et la déco personnelle": { chaud: 1, charge: 2, tonique: 2 },
  },
  3: {
    A: { chaud: 2, epure: 2, neutre_col: 2 },
    B: { froid: 2, epure: 2, neutre_col: 2 },
    C: { chaud: 2, charge: 2, tonique: 2 },
    D: { epure: 1, sature: 3 },
    E: { charge: 2, tonique: 2 },
    F: { chaud: 1, charge: 2, sature: 3 },
  },
  4: {
    "Tons naturels":        { chaud: 2, neutre_col: 2 },
    "Doux et pastel":       { froid: 1, epure: 1, tonique: 2 },
    "Contrasté noir/blanc": { froid: 2, epure: 2, neutre_col: 1 },
    "Couleurs franches":    { epure: 1, sature: 3 },
    "Profond et cosy":      { chaud: 2, charge: 1, tonique: 2 },
  },
};

const PROFILES = {
  "chaud|epure|neutre": {
    name: "Scandinave chaleureux",
    axes: "Chaleureux · Épuré · Naturel",
    palette: [{ color: "#E8E0D5", name: "sable doux" }, { color: "#A89880", name: "lin naturel" }, { color: "#6B5D4F", name: "bois chaud" }],
    text: "Votre style, c'est la chaleur sans le désordre. Vous cherchez un intérieur qui respire — où chaque objet a sa place et où on se sent immédiatement bien. Vous nous avez dit que [Q5] : c'est exactement là qu'on intervient. Parce que créer un intérieur 'beige mais pas ennuyeux' demande de vraies décisions — sur les matières, les proportions, la lumière. Vous vouliez [Q7] : on sait exactement comment y arriver.",
    actions: ["Misez sur un tapis en jute ou laine pour ancrer la pièce.", "Remplacez vos abat-jours par des modèles en lin ou rotin.", "Ajoutez une plante verte dans un cache-pot en céramique mate."],
  },
  "chaud|charge|neutre": {
    name: "Naturel affirmé",
    axes: "Chaleureux · Affirmé · Naturel",
    palette: [{ color: "#C4A882", name: "lin affirmé" }, { color: "#8B6F47", name: "bois brut" }, { color: "#E8D5B7", name: "sable clair" }],
    text: "Vous aimez les intérieurs qui ont une âme — où les matières se touchent, où rien ne semble sorti d'un catalogue. Lin, rotin, bois brut : ce sont vos mots. Vous nous avez dit que [Q5] — et c'est souvent ce qui arrive quand on accumule de belles choses sans fil conducteur. Votre profil, c'est justement ça : trouver le lien qui fait que tout va ensemble. Vous vouliez [Q7] : on a la direction.",
    actions: ["Superposez deux tapis de matières différentes (jute + laine).", "Groupez vos objets par 3 sur une étagère — jamais seuls.", "Choisissez du bois non traité ou huilé plutôt que laqué."],
  },
  "neutre|epure|neutre": {
    name: "Japonais minimaliste",
    axes: "Neutre · Épuré · Naturel",
    palette: [{ color: "#E8E4DC", name: "washi" }, { color: "#C4B8A0", name: "pierre douce" }, { color: "#4A4A48", name: "encre" }],
    text: "Vous croyez que le vide est aussi important que ce qu'on pose. Que moins il y a d'objets, plus chacun compte. Vous nous avez dit que [Q5] : c'est le paradoxe du minimalisme — savoir quoi enlever est plus difficile que savoir quoi ajouter. Votre profil, c'est l'art de choisir ce qui reste. Vous vouliez [Q7] : on va construire ça ensemble, pièce par pièce.",
    actions: ["Videz une surface entière — gardez un seul objet dessus.", "Cachez tous les câbles et rangements visibles en priorité.", "Optez pour des rideaux jusqu'au plafond en lin non doublé."],
  },
  "froid|epure|neutre": {
    name: "Contemporain sobre",
    axes: "Sobre · Épuré · Neutre",
    palette: [{ color: "#E2E2E0", name: "gris perle" }, { color: "#9B9B97", name: "béton" }, { color: "#3D3D3A", name: "anthracite" }],
    text: "Vous aimez les intérieurs propres, nets, sans fioriture. Pas froid — juste maîtrisé. Vous nous avez dit que [Q5] : c'est souvent ce qui arrive quand on cherche l'épure sans savoir où poser les curseurs. Votre profil, c'est la précision : les bonnes proportions, les bonnes matières, les bons contrastes — rien de plus. Vous vouliez [Q7] : on a le plan.",
    actions: ["Réduisez votre palette à 3 teintes max — et tenez-vous y.", "Investissez dans un grand miroir sans cadre pour agrandir l'espace.", "Remplacez les petits objets disparates par une seule pièce forte."],
  },
  "chaud|epure|tonique": {
    name: "Terracotta vivant",
    axes: "Chaleureux · Épuré · Tonique",
    palette: [{ color: "#C4623A", name: "terracotta" }, { color: "#E8A87C", name: "abricot chaud" }, { color: "#F5EFE4", name: "crème" }],
    text: "Votre intérieur idéal, c'est comme un voyage — chaleureux, solaire, ancré dans les matières de la terre. Ocre, terracotta, argile : vous y êtes sensible sans forcément savoir le nommer. Vous nous avez dit que [Q5] — et justement, les couleurs chaudes pardonnent beaucoup quand elles sont bien dosées. Vous vouliez [Q7] : c'est tout à fait accessible, et on va vous montrer comment.",
    actions: ["Peignez un seul mur en terracotta — les autres restent blancs.", "Ajoutez des pots en terre cuite non émaillée à différentes hauteurs.", "Cherchez un tapis à motifs géométriques dans les tons ocre/rouge."],
  },
  "chaud|charge|tonique": {
    name: "Vintage cuivré",
    axes: "Chaleureux · Affirmé · Tonique",
    palette: [{ color: "#B8612A", name: "cuivre" }, { color: "#E8C97A", name: "laiton" }, { color: "#2E4A3A", name: "vert bouteille" }],
    text: "Vous aimez les choses qui ont une histoire — les matières qui vieillissent bien, les pièces qu'on ne trouve pas dans les grandes enseignes. Cuivre, velours, bois foncé : votre intérieur doit avoir du caractère. Vous nous avez dit que [Q5] : c'est souvent ce qui arrive quand on mélange des pièces de caractère sans savoir les faire dialoguer. Vous vouliez [Q7] : on sait exactement quelle direction prendre.",
    actions: ["Cherchez une lampe en laiton ou cuivre — c'est la pièce signature du style.", "Associez velours et bois foncé sur le même meuble ou la même zone.", "Visitez les vide-greniers pour une pièce unique — un miroir, un plateau, un vase."],
  },
  "neutre|epure|tonique": {
    name: "Vert nature",
    axes: "Neutre · Épuré · Végétal",
    palette: [{ color: "#3D6B52", name: "sauge profond" }, { color: "#6B9E7A", name: "vert sauge" }, { color: "#E8D5B7", name: "sable" }],
    text: "Votre intérieur idéal, c'est un endroit où on respire — au sens propre. Le vert vous apaise, les plantes vous ancrent, les matières naturelles vous ressourcent. Vous nous avez dit que [Q5] : c'est exactement ce qu'on règle avec une palette cohérente autour du végétal. Vous vouliez [Q7] : c'est le point de départ parfait.",
    actions: ["Peignez un mur ou une boiserie en vert sauge — l'impact est immédiat.", "Regroupez vos plantes en un seul coin généreux plutôt que dispersées.", "Ajoutez du lin naturel en rideau ou plaid pour réchauffer le vert."],
  },
  "froid|charge|tonique": {
    name: "Bleu nuit doux",
    axes: "Sobre · Affirmé · Tonique",
    palette: [{ color: "#2C4A6E", name: "bleu nuit" }, { color: "#E8D5B7", name: "sable chaud" }, { color: "#8BA5C4", name: "bleu ciel" }],
    text: "Vous aimez les intérieurs profonds, enveloppants — ceux où on se sent protégé dès qu'on ferme la porte. Le bleu nuit, le vert bouteille, les tons sourds : vous y revenez toujours. Vous nous avez dit que [Q5] — et les couleurs profondes intimident souvent avant d'être apprivoisées. Votre profil, c'est l'intérieur cocon. Vous vouliez [Q7] : on sait y aller.",
    actions: ["Commencez par des coussins bleu nuit — c'est le test à moindre risque.", "Associez le bleu foncé avec du rotin ou du bois clair pour l'équilibre.", "Optez pour un abat-jour bleu sur une lampe existante — effet immédiat."],
  },
  "chaud|charge|sature": {
    name: "Rétro pop 70s",
    axes: "Chaleureux · Affirmé · Saturé",
    palette: [{ color: "#D4622A", name: "orange brûlé" }, { color: "#E8C440", name: "moutarde" }, { color: "#8B3A2A", name: "brique" }],
    text: "Votre intérieur a du caractère — et vous ne voulez pas d'un espace qui ressemble à tous les autres. Moutarde, brun, ocre vif, formes rondes : vous avez l'œil pour les détails qui font la différence. Vous nous avez dit que [Q5] : c'est normal, ce style demande un vrai fil conducteur pour ne pas basculer dans le fouillis. Vous vouliez [Q7] : on va vous aider à l'assumer pleinement.",
    actions: ["Cherchez un fauteuil aux formes rondes en velours moutarde ou brique.", "Ajoutez un tapis à motifs géométriques 70s — c'est la pièce qui pose le style.", "Limitez-vous à 3 couleurs max : une dominante, une secondaire, une accent."],
  },
  "neutre|charge|sature": {
    name: "Jungle urbaine",
    axes: "Neutre · Affirmé · Végétal",
    palette: [{ color: "#2E4A3A", name: "vert forêt" }, { color: "#8B6F47", name: "terre" }, { color: "#C4623A", name: "terracotta" }],
    text: "Chez vous, le végétal n'est pas une touche décorative — c'est le sujet principal. Vous voulez entrer dans votre appartement comme dans un jardin intérieur. Vous nous avez dit que [Q5] — et c'est vrai que densifier sans créer de désordre visuel demande de la méthode. Votre profil, c'est la nature habitée. Vous vouliez [Q7] : on a exactement la direction.",
    actions: ["Installez des étagères murales uniquement dédiées aux plantes.", "Mélangez les tailles : une grande plante au sol, des moyennes sur meubles, des petites suspendues.", "Unifiez vos cache-pots : terre cuite non émaillée pour toutes les plantes."],
  },
  "neutre|epure|sature": {
    name: "Coloré assumé",
    axes: "Neutre · Épuré · Coloré",
    palette: [{ color: "#4A7CB5", name: "bleu Klein" }, { color: "#E8C440", name: "jaune soleil" }, { color: "#C4623A", name: "orange" }],
    text: "Vous aimez la couleur franche — pas timide, pas en petite touche. Un mur vert canard, un canapé jaune, un mur bleu Klein : vous y pensez mais vous n'osez pas encore. Vous nous avez dit que [Q5] : c'est exactement la peur qui bloque la plupart des gens devant la couleur. Votre profil, c'est l'intérieur graphique et affirmé. Vous vouliez [Q7] : on sait comment y aller sans regretter.",
    actions: ["Choisissez UNE couleur forte et construisez tout autour — pas trois à la fois.", "Testez avec un mur peint : c'est réversible et l'impact est immédiat.", "Gardez le sol et les grandes surfaces neutres pour laisser respirer la couleur."],
  },
  "froid|charge|sature": {
    name: "Maximalist dopamine",
    axes: "Sobre · Affirmé · Saturé",
    palette: [{ color: "#C44B8A", name: "rose vif" }, { color: "#4A7CB5", name: "bleu électrique" }, { color: "#E8C440", name: "jaune" }],
    text: "Votre intérieur, c'est une déclaration. Vous aimez que chaque pièce raconte quelque chose — que les couleurs, les formes et les objets cohabitent avec énergie. Vous nous avez dit que [Q5] : c'est le défi du maximalisme — l'harmonie dans l'abondance ne s'improvise pas. Votre profil, c'est l'intérieur assumé jusqu'au bout. Vous vouliez [Q7] : on va vous donner le cadre pour que tout tienne ensemble.",
    actions: ["Créez des zones thématiques : chaque coin a sa propre palette cohérente.", "Multipliez les cadres au mur — mais alignez-les sur un axe horizontal commun.", "Assumez le tapis coloré : c'est lui qui unit tout le reste."],
  },
};

function computeProfile(answers) {
  const s = { chaud: 0, froid: 0, epure: 0, charge: 0, neutre_col: 0, tonique: 0, sature: 0 };

  const q2 = answers[2];
  if (q2 && SCORING[2][q2]) Object.entries(SCORING[2][q2]).forEach(([k, v]) => { s[k] += v; });

  const q3 = answers[3] || [];
  q3.forEach(photo => {
    if (SCORING[3][photo]) Object.entries(SCORING[3][photo]).forEach(([k, v]) => { s[k] += v * 2; });
  });

  const q4 = answers[4];
  if (q4 && SCORING[4][q4]) Object.entries(SCORING[4][q4]).forEach(([k, v]) => { s[k] += v; });

  const chaleur = s.chaud > s.froid ? "chaud" : s.froid > s.chaud ? "froid" : "neutre";
  const structure = s.charge > s.epure ? "charge" : "epure";
  const maxCol = Math.max(s.neutre_col, s.tonique, s.sature);
  const couleur =
    maxCol === 0 || (s.neutre_col >= s.tonique && s.neutre_col >= s.sature) ? "neutre"
    : s.sature >= s.tonique ? "sature" : "tonique";

  return PROFILES[`${chaleur}|${structure}|${couleur}`] || PROFILES["neutre|epure|neutre"];
}

const Logo = () => (
  <svg viewBox="-14 -14 28 28" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect transform="translate(0,-8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#B8612A"/>
    <rect transform="translate(8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#2E4A3A"/>
    <rect transform="translate(-8,0) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#E8C97A"/>
    <rect transform="translate(0,8) rotate(45)" x="-4" y="-4" width="8" height="8" rx="1.5" fill="#6B9E7A"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7l3.5 3.5L12 3.5" stroke="#3D6B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("quiz"); // quiz | loading | result
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    if (phase === "loading") {
      const t = setTimeout(() => setPhase("result"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const isStepReady = () => {
    if (step === 3) return (answers[3] || []).length > 0;
    if (step === 7) return (answers[7] || "").trim().length > 0;
    return answers[step] != null;
  };

  const goNext = () => {
    if (step < TOTAL) setStep(s => s + 1);
    else setPhase("loading");
  };

  const setAnswer = (q, val) => setAnswers(prev => ({ ...prev, [q]: val }));

  const togglePhoto = (val) => {
    setAnswers(prev => {
      const cur = prev[3] || [];
      if (cur.includes(val)) return { ...prev, 3: cur.filter(x => x !== val) };
      if (cur.length >= 2) return { ...prev, 3: [cur[1], val] };
      return { ...prev, 3: [...cur, val] };
    });
  };

  const submitEmail = async () => {
    if (!email || !email.includes("@")) return;
    setEmailStatus("loading");
    const processedText = profile.text
      .replace("[Q5]", q5Text)
      .replace("[Q7]", `"${q7Text}"`)
      .replace(/ — /g, " : ");
    const processedActions = profile.actions.map(a => a.replace(/ — /g, ", "));
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          offre: "quiz",
          attributes: {
            PROFIL: profile?.name || "",
            PIECE: answers[1] || "",
            ATTRAIT: answers[2] || "",
            PHOTOS: (answers[3] || []).join(", "),
            PALETTE: answers[4] || "",
            BLOCAGE: answers[5] || "",
            BUDGET: answers[6] || "",
            AMBIANCE: answers[7] || "",
          },
          profile: {
            name: profile.name,
            axes: profile.axes,
            palette: profile.palette,
            text: processedText,
            actions: processedActions,
          },
          budget: answers[6] || "",
        }),
      });
      setEmailStatus((await res.json()).success ? "success" : "error");
    } catch {
      setEmailStatus("error");
    }
  };

  const profile = phase === "result" ? computeProfile(answers) : null;

  const ctaLabel = () => {
    const b = answers[6];
    if (b === "Moins de 200€") return "Découvrir l'offre gratuite →";
    if (b === "200-500€") return "Je transforme ma pièce, 69€ →";
    return "Je vous confie mon intérieur, à partir de 299€ →";
  };

  const ctaHref = () => {
    const b = answers[6];
    if (b === "200-500€") return "/analyse";
    if (b === "500-1500€" || b === "Plus de 1500€") return "/surmesure";
    return "/";
  };

  const q5Text = answers[5] || "je ne sais pas par où commencer";
  const q7Text = answers[7] || "un intérieur qui vous ressemble";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body { background: #F5EFE4; font-family: "DM Sans", sans-serif; color: #2E4A3A; -webkit-font-smoothing: antialiased; }

        .qz-progress { position: fixed; top: 56px; left: 0; right: 0; height: 3px; background: #D3D1C7; z-index: 99; }
        .qz-fill { height: 100%; background: #3D6B52; transition: width 0.4s ease; }

        .qz-viewport { position: fixed; top: 59px; left: 0; right: 0; bottom: 0; overflow: hidden; }
        .qz-slider { display: flex; height: 100%; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .qz-screen { min-width: 100vw; width: 100vw; height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 40px 24px 120px; }
        .qz-inner { width: 100%; max-width: 600px; }

        .qz-qlabel { font-size: 11px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.14em; color: #888780; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .qz-badge { background: #E8C97A; color: #2E4A3A; padding: 2px 8px; border-radius: 20px; font-size: 11px; text-transform: none; letter-spacing: 0; }
        .qz-qtitle { font-family: "DM Sans", sans-serif; font-weight: 500; font-style: normal; font-size: 20px; line-height: 1.35; color: #2E4A3A; margin-bottom: 28px; }

        .qz-options { display: flex; flex-direction: column; gap: 12px; }
        .qz-opt { width: 100%; text-align: left; padding: 15px 18px; border: 0.5px solid #D3D1C7; border-radius: 12px; background: white; color: #2E4A3A; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 400; cursor: pointer; transition: border-color 0.18s, background 0.18s; display: flex; align-items: center; gap: 12px; }
        .qz-opt:hover { border-color: #3D6B52; background: rgba(61,107,82,0.04); }
        .qz-opt.sel { border: 2px solid #3D6B52; background: rgba(61,107,82,0.07); }
        .qz-circle { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid #D3D1C7; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.18s, background 0.18s; }
        .qz-opt.sel .qz-circle { border-color: #3D6B52; background: #3D6B52; }
        .qz-dot { width: 6px; height: 6px; border-radius: 50%; background: white; display: none; }
        .qz-opt.sel .qz-dot { display: block; }

        .qz-hint { font-size: 13px; color: #888780; margin-bottom: 16px; }
        .qz-photos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .qz-photo { position: relative; cursor: pointer; border-radius: 12px; overflow: hidden; border: 2.5px solid transparent; transition: border-color 0.18s; aspect-ratio: 1; }
        .qz-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .qz-photo-lbl { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.55)); color: white; font-size: 13px; font-weight: 500; }
        .qz-photo-chk { position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.18s; }
        .qz-photo.sel { border-color: #3D6B52; }
        .qz-photo.sel .qz-photo-chk { opacity: 1; }

        .qz-textarea { width: 100%; padding: 16px; border: 1.5px solid #D3D1C7; border-radius: 12px; background: white; font-family: "DM Sans", sans-serif; font-size: 15px; color: #2E4A3A; resize: none; height: 100px; outline: none; transition: border-color 0.18s; display: block; }
        .qz-textarea:focus { border-color: #3D6B52; }
        .qz-charcount { text-align: right; font-size: 12px; color: #888780; margin-top: 6px; margin-bottom: 16px; }
        .qz-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .qz-chip { padding: 8px 14px; border: 1.5px solid #D3D1C7; border-radius: 20px; font-size: 13px; color: #2E4A3A; cursor: pointer; background: white; font-family: "DM Sans", sans-serif; transition: border-color 0.18s, background 0.18s; }
        .qz-chip:hover { border-color: #3D6B52; background: #f9f6f0; }

        .qz-next { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 16px 40px; background: #B8612A; color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; white-space: nowrap; z-index: 50; box-shadow: 0 4px 20px rgba(184,97,42,0.3); transition: background 0.2s, color 0.2s, box-shadow 0.15s; }
        .qz-next:disabled { background: #D3D1C7; color: #888780; cursor: not-allowed; box-shadow: none; transform: translateX(-50%); }
        .qz-next:not(:disabled):hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 6px 24px rgba(184,97,42,0.4); }

        .qz-loading { position: fixed; inset: 0; background: #F5EFE4; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; z-index: 200; }
        .qz-loading-text { font-family: "Playfair Display", serif; font-style: italic; font-size: 24px; color: #2E4A3A; }
        .qz-spinner { width: 48px; height: 48px; border: 3px solid #D3D1C7; border-top-color: #3D6B52; border-radius: 50%; animation: qzspin 0.9s linear infinite; }
        @keyframes qzspin { to { transform: rotate(360deg); } }

        .qz-result { position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: #F5EFE4; overflow-y: auto; z-index: 50; }
        .qz-result-inner { max-width: 640px; margin: 0 auto; padding: 40px 24px 80px; }
        .qz-result-name { font-family: "Playfair Display", serif; font-style: italic; font-size: clamp(30px, 5.5vw, 44px); color: #2E4A3A; line-height: 1.15; margin-bottom: 10px; }
        .qz-result-axes { font-size: 14px; color: #888780; font-weight: 500; letter-spacing: 0.08em; margin-bottom: 32px; }
        .qz-palette { display: flex; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
        .qz-swatch { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .qz-swatch-dot { width: 64px; height: 64px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.08); }
        .qz-swatch-name { font-size: 12px; color: #888780; text-align: center; max-width: 70px; line-height: 1.3; }
        .qz-result-text { font-size: 16px; line-height: 1.75; color: #2E4A3A; margin-bottom: 32px; }
        .qz-actions-title { font-family: "Playfair Display", serif; font-size: 20px; color: #2E4A3A; margin-bottom: 16px; }
        .qz-actions-list { padding-left: 20px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
        .qz-actions-list li { font-size: 15px; line-height: 1.6; color: #2E4A3A; }
        .qz-email-box { background: #2E4A3A; border-radius: 16px; padding: 28px; margin-bottom: 24px; }
        .qz-email-label { font-size: 15px; font-weight: 500; color: #F5EFE4; margin-bottom: 16px; display: block; }
        .qz-email-in { width: 100%; padding: 14px; background: #F5EFE4; border: none; border-radius: 8px; font-family: "DM Sans", sans-serif; font-size: 14px; color: #2E4A3A; outline: none; display: block; margin-bottom: 10px; }
        .qz-email-in::placeholder { color: #888780; }
        .qz-email-btn { width: 100%; padding: 14px; background: #B8612A; color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; display: block; transition: opacity 0.18s; }
        .qz-email-btn:hover { opacity: 0.9; }
        .qz-email-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .qz-email-ok { font-size: 14px; color: #E8C97A; margin-top: 4px; display: block; }
        .qz-email-err { font-size: 13px; color: #ffb3a0; margin-top: 10px; display: block; }
        .qz-cta { display: block; width: 100%; padding: 18px 24px; background: #2E4A3A; color: white; border: none; border-radius: 50px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; text-align: center; text-decoration: none; transition: opacity 0.18s, transform 0.15s; }
        .qz-cta:hover { opacity: 0.9; transform: translateY(-2px); }

        @media (max-width: 480px) {
          .qz-screen { padding: 28px 16px 110px; }
          .qz-email-row { flex-direction: column; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      {phase !== "loading" && <Nav showBack={true} />}

      {/* ─── PROGRESS ─── */}
      {phase === "quiz" && (
        <div className="qz-progress">
          <div className="qz-fill" style={{ width: `${((step - 1) / TOTAL) * 100}%` }} />
        </div>
      )}

      {/* ─── QUESTIONS ─── */}
      {phase === "quiz" && (
        <>
          <div className="qz-viewport">
            <div className="qz-slider" style={{ transform: `translateX(-${(step - 1) * 100}vw)` }}>

              {/* Q1 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 1 / 7 <span className="qz-badge">2 minutes</span></div>
                  <h2 className="qz-qtitle">Quelle pièce vous pose le plus problème en ce moment&nbsp;?</h2>
                  <div className="qz-options">
                    {["Salon", "Chambre", "Cuisine / salle à manger", "Entrée", "Salle de bain"].map(v => (
                      <button key={v} className={`qz-opt${answers[1] === v ? " sel" : ""}`} onClick={() => setAnswer(1, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q2 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 2 / 7</div>
                  <h2 className="qz-qtitle">Quand vous entrez dans un beau salon, qu'est-ce qui vous attire en premier&nbsp;?</h2>
                  <div className="qz-options">
                    {["Les couleurs", "La lumière naturelle", "L'organisation et la clarté", "Les matières et textures", "Les objets et la déco personnelle"].map(v => (
                      <button key={v} className={`qz-opt${answers[2] === v ? " sel" : ""}`} onClick={() => setAnswer(2, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q3 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 3 / 7</div>
                  <h2 className="qz-qtitle">Laquelle de ces ambiances vous donne le plus envie de rester&nbsp;?</h2>
                  <p className="qz-hint">Choisissez jusqu'à 2 ambiances.</p>
                  <div className="qz-photos">
                    {[
                      { v: "A", label: "Naturel & lumière" },
                      { v: "B", label: "Épuré contemporain" },
                      { v: "C", label: "Cosy & chargé" },
                      { v: "D", label: "Couleur affirmée" },
                      { v: "E", label: "Végétal & vivant" },
                      { v: "F", label: "Pop & éclectique" },
                    ].map(({ v, label }) => (
                      <div key={v} className={`qz-photo${(answers[3] || []).includes(v) ? " sel" : ""}`} onClick={() => togglePhoto(v)}>
                        <img src={`/${v}.jpg`} alt={label} loading="lazy" />
                        <div className="qz-photo-lbl">{label}</div>
                        <div className="qz-photo-chk"><CheckIcon /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q4 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 4 / 7</div>
                  <h2 className="qz-qtitle">Votre palette idéale se situe plutôt où&nbsp;?</h2>
                  <div className="qz-options">
                    {[
                      { v: "Tons naturels",        label: "Tons naturels (lin, rotin, sable)" },
                      { v: "Doux et pastel",       label: "Doux et pastel" },
                      { v: "Contrasté noir/blanc", label: "Contrasté noir / blanc" },
                      { v: "Couleurs franches",    label: "Couleurs franches assumées" },
                      { v: "Profond et cosy",      label: "Profond et cosy (kaki, terracotta, ocre)" },
                    ].map(({ v, label }) => (
                      <button key={v} className={`qz-opt${answers[4] === v ? " sel" : ""}`} onClick={() => setAnswer(4, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q5 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 5 / 7</div>
                  <h2 className="qz-qtitle">Ce qui vous bloque le plus en ce moment&nbsp;?</h2>
                  <div className="qz-options">
                    {[
                      { v: "je ne sais pas par où commencer",               label: "Je ne sais pas par où commencer" },
                      { v: "j'aime plein de choses mais rien ne va ensemble", label: "J'aime plein de choses mais rien ne va ensemble" },
                      { v: "je ne sais pas quoi changer sans tout refaire",  label: "Je ne sais pas quoi changer sans tout refaire" },
                      { v: "mon budget est limité",                          label: "Mon budget est limité" },
                      { v: "j'ai peur de faire des erreurs",                 label: "J'ai peur de faire des erreurs" },
                    ].map(({ v, label }) => (
                      <button key={v} className={`qz-opt${answers[5] === v ? " sel" : ""}`} onClick={() => setAnswer(5, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q6 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 6 / 7</div>
                  <h2 className="qz-qtitle">Votre budget pour transformer cette pièce&nbsp;?</h2>
                  <div className="qz-options">
                    {[
                      { v: "Moins de 200€",  label: "Moins de 200€" },
                      { v: "200-500€",       label: "Entre 200€ et 500€" },
                      { v: "500-1500€",      label: "Entre 500€ et 1 500€" },
                      { v: "Plus de 1500€",  label: "Plus de 1 500€" },
                    ].map(({ v, label }) => (
                      <button key={v} className={`qz-opt${answers[6] === v ? " sel" : ""}`} onClick={() => setAnswer(6, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q7 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <div className="qz-qlabel">Question 7 / 7</div>
                  <h2 className="qz-qtitle">En une phrase, l'ambiance que vous voulez créer chez vous&nbsp;?</h2>
                  <textarea
                    className="qz-textarea"
                    maxLength={100}
                    placeholder="Décrivez l'ambiance idéale..."
                    value={answers[7] || ""}
                    onChange={e => setAnswer(7, e.target.value)}
                  />
                  <div className="qz-charcount">{(answers[7] || "").length} / 100</div>
                  <div className="qz-chips">
                    {["Cozy et lumineux", "Épuré mais chaleureux", "Nature et textures"].map(t => (
                      <button key={t} className="qz-chip" onClick={() => setAnswer(7, t)}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button className="qz-next" disabled={!isStepReady()} onClick={goNext}>
            {step === TOTAL ? "Voir mon profil →" : "Suivant →"}
          </button>
        </>
      )}

      {/* ─── LOADING ─── */}
      {phase === "loading" && (
        <div className="qz-loading">
          <Logo />
          <div className="qz-spinner" />
          <p className="qz-loading-text">On prépare votre profil...</p>
        </div>
      )}

      {/* ─── RESULT ─── */}
      {phase === "result" && profile && (
        <div className="qz-result">
          <div className="qz-result-inner">
            <h1 className="qz-result-name">{profile.name}</h1>
            <p className="qz-result-axes">{profile.axes}</p>
            <div className="qz-palette">
              {profile.palette.map(p => (
                <div key={p.name} className="qz-swatch">
                  <div className="qz-swatch-dot" style={{ background: p.color }} />
                  <span className="qz-swatch-name">{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
                </div>
              ))}
            </div>
            <p className="qz-result-text">
              {profile.text.replace("[Q5]", q5Text).replace("[Q7]", `"${q7Text}"`).replace(/ — /g, " : ")}
            </p>
            <div>
              <h3 className="qz-actions-title">Vos 3 premières actions</h3>
              <ol className="qz-actions-list">
                {profile.actions.map((a, i) => <li key={i}>{a.replace(/ — /g, ", ")}</li>)}
              </ol>
            </div>
            <div className="qz-email-box">
              {emailStatus === "success" ? (
                <span className="qz-email-ok">✓ C'est noté, on vous envoie tout ça dans la minute.</span>
              ) : (
                <>
                  <span className="qz-email-label">Votre profil arrive par email</span>
                  <input
                    type="email"
                    className="qz-email-in"
                    placeholder="votre@email.fr"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="qz-email-btn" onClick={submitEmail} disabled={emailStatus === "loading"}>
                    {emailStatus === "loading" ? "Envoi..." : "Recevoir mon profil →"}
                  </button>
                  {emailStatus === "error" && <span className="qz-email-err">Une erreur s'est produite, réessayez.</span>}
                </>
              )}
            </div>
            <a href={ctaHref()} className="qz-cta">{ctaLabel()}</a>
          </div>
        </div>
      )}
    </>
  );
}
