"use client";
import { useState, useEffect } from "react";
import KovaNav       from "@/components/kova/KovaNav";
import KovaFooter    from "@/components/kova/KovaFooter";
import KovaCheckbox  from "@/components/kova/KovaCheckbox";
import KovaStepShell from "@/components/kova/KovaStepShell";
import KovaLogo      from "@/components/kova/KovaLogo";
import { OFFERS } from "@/lib/config";
import { track } from "@/lib/plausible";
import { useConsent } from "@/app/components/ConsentContext";
import { getStoredUtms } from "@/lib/utmTracking";
import { PROFILE_VALIDATIONS } from "@/lib/profileValidations";

const TOTAL = 6;

function formatPieceForSentence(piece) {
  const map = {
    "Salon": "votre salon",
    "Chambre": "votre chambre",
    "Cuisine / salle à manger": "votre cuisine",
    "Entrée": "votre entrée",
    "Salle de bain": "votre salle de bain",
  };
  return map[piece] || "votre pièce";
}

const GateCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: "2px" }}>
    <path d="M3 8.5L6 11.5L13 4.5" stroke="#3D6B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SCORING = {
  1: {
    "Les couleurs":                      { sature: 2 },
    "La lumière naturelle":              { chaud: 1, epure: 1, neutre_col: 1 },
    "L'organisation et la clarté":       { froid: 1, epure: 2, neutre_col: 1 },
    "Les matières et textures":          { chaud: 2, charge: 1, neutre_col: 1 },
    "Les objets et la déco personnelle": { chaud: 1, charge: 2, tonique: 2 },
  },
  2: {
    A: { chaud: 2, epure: 2, neutre_col: 2 },
    B: { froid: 2, epure: 2, neutre_col: 2 },
    C: { chaud: 2, charge: 2, tonique: 2 },
    D: { epure: 1, sature: 3 },
    E: { charge: 2, tonique: 2 },
    F: { chaud: 1, charge: 2, sature: 3 },
  },
  3: {
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
    axes: "Doux · Épuré · Naturel",
    palette: [{ color: "#E8E0D5", name: "sable doux" }, { color: "#A89880", name: "lin naturel" }, { color: "#6B5D4F", name: "bois chaud" }],
    text: "Les intérieurs qui vous attirent ont toujours quelque chose en commun : du bois clair, du lin, de la lumière naturelle, peu d'objets mais bien choisis. Pas froid, pas clinique. Juste aéré et chaleureux en même temps. C'est un équilibre qui semble simple et qui ne l'est pas. Un élément de trop et la pièce perd ce souffle qui la rendait belle.",
    actions: {
      "Salon": [
        "Posez un tapis en jute ou laine, tout s'organise autour.",
        "Remplacez votre plafonnier par deux lampes : une au sol, une sur table.",
        "Un plaid en lin sur le canapé, une seule couleur neutre.",
      ],
      "Chambre": [
        "Libérez toutes les surfaces, un seul objet décoratif par meuble.",
        "Investissez dans du linge de lit en lin lavé, c'est la matière qui définit ce style.",
        "Cachez tout ce qui est pratique : chargeurs, piles de livres, vêtements.",
      ],
      "Cuisine / salle à manger": [
        "Unifiez votre vaisselle visible, même couleur, même matière, céramique mate.",
        "Une suspension en bois ou rotin au-dessus de la table, pas de plafonnier nu.",
        "Trois objets maximum sur le plan de travail, groupés, le reste disparaît.",
      ],
      "Entrée": [
        "Un porte-manteau en bois clair fixé au mur, pas de meuble encombrant au sol.",
        "Un petit tapis naturel, même étroit, il donne une intention à l'espace.",
        "Un miroir simple, sans cadre surchargé.",
      ],
      "Salle de bain": [
        "Tout ce qui est sur la tablette disparaît dans un panier en rotin fermé.",
        "Des serviettes en coton épais, un seul coloris naturel : blanc cassé, sable ou lin.",
        "Une plante résistante à l'humidité, pothos ou fougère, ça suffit à changer l'ambiance.",
      ],
    },
  },
  "chaud|charge|neutre": {
    name: "Naturel affirmé",
    axes: "Chaleureux · Texturé · Organique",
    palette: [{ color: "#C4A882", name: "lin affirmé" }, { color: "#8B6F47", name: "bois brut" }, { color: "#E8D5B7", name: "sable clair" }],
    text: "Vous aimez les matières qu'on a envie de toucher. Le rotin un peu rugueux, le bois qu'on n'a pas trop poncé, le lin épais qui tombe bien. Vos intérieurs de référence ont une texture, une densité, quelque chose qui ressemble à une vie installée. Rien ne sort d'un catalogue et pourtant tout va ensemble.",
    actions: {
      "Salon": [
        "Superposez deux tapis de matières différentes, jute au sol, laine par-dessus.",
        "Groupez vos objets par trois sur chaque surface, jamais un seul isolé.",
        "Un plaid en laine épaisse ou coton brut, quelque chose qu'on a envie de toucher.",
      ],
      "Chambre": [
        "Une tête de lit en rotin ou bois brut, c'est la pièce qui pose tout le reste.",
        "Superposez les matières sur le lit : lin, coton, laine, dans les mêmes tons.",
        "Un tapis en laine épaisse au pied du lit, le premier contact au sol le matin compte.",
      ],
      "Cuisine / salle à manger": [
        "Exposez vos ustensiles en bois et métal non traité, ils font partie de la déco.",
        "Une table en bois massif non laqué si vous en changez, c'est l'investissement central.",
        "Des herbes aromatiques sur le rebord de fenêtre, en céramique non émaillée.",
      ],
      "Entrée": [
        "Un meuble en bois brut, même petit, une surface pour poser, un tiroir pour ranger.",
        "Un miroir avec cadre en rotin ou bois naturel, le cadre compte autant que le miroir.",
        "Un panier en osier au sol pour les chaussures, pratique et dans le style.",
      ],
      "Salle de bain": [
        "Remplacez vos contenants plastique par des flacons en verre ou pots en céramique.",
        "Un tabouret en teck ou bambou, il sert et il se voit.",
        "Une planche en bois pour vos serviettes plutôt qu'un porte-serviettes chromé.",
      ],
    },
  },
  "neutre|epure|neutre": {
    name: "Japonais minimaliste",
    axes: "Neutre · Épuré · Serein",
    palette: [{ color: "#E8E4DC", name: "washi" }, { color: "#C4B8A0", name: "pierre douce" }, { color: "#4A4A48", name: "encre" }],
    text: "Vous êtes attirée par les intérieurs où le vide fait partie de la composition. Peu de meubles, peu de couleurs, peu d'objets, mais chacun parfaitement à sa place. Ce style demande une discipline que la plupart des gens trouvent difficile à tenir : savoir quoi enlever est toujours plus dur que savoir quoi ajouter.",
    actions: {
      "Salon": [
        "Videz une surface entière, remettez un seul objet choisi avec soin. Recommencez partout.",
        "Cachez tous les câbles et équipements techniques, c'est la première étape.",
        "Des rideaux en lin non doublé jusqu'au plafond, ils filtrent sans arrêter la lumière.",
      ],
      "Chambre": [
        "Retirez tout ce qui est sous le lit, le sol dégagé agrandit visuellement.",
        "Table de nuit : une lampe, un livre. Rien d'autre.",
        "Deux couleurs maximum dans toute la pièce, blanc cassé et une teinte sourde.",
      ],
      "Cuisine / salle à manger": [
        "Rangez tout ce qui est sur le plan de travail, tout, y compris la machine à café.",
        "Une vaisselle simple, sans motif, en céramique mate, un seul coloris.",
        "Une seule plante grande dans un cache-pot sobre, pas de collection.",
      ],
      "Entrée": [
        "Un crochet, un miroir, un tapis. Pas un élément de plus.",
        "Les chaussures rangées et invisibles depuis la porte, c'est non négociable.",
        "Pas de meuble si l'espace est petit, un crochet mural suffit et libère le sol.",
      ],
      "Salle de bain": [
        "Bord de lavabo vide. Un savon dans un flacon sobre, rien d'autre à vue.",
        "Tous vos contenants identiques sur une étagère, l'uniformité crée le calme.",
        "Une planche en teck au sol devant la douche, simple et dans le style.",
      ],
    },
  },
  "froid|epure|neutre": {
    name: "Contemporain sobre",
    axes: "Net · Épuré · Neutre",
    palette: [{ color: "#E2E2E0", name: "gris perle" }, { color: "#9B9B97", name: "béton" }, { color: "#3D3D3A", name: "anthracite" }],
    text: "Vos références sont nettes, maîtrisées, sans fioriture. Béton, métal brossé, bois foncé, palette de gris et de blancs cassés. Rien ne déborde, rien ne crie. C'est un style qui donne une impression d'évidence alors qu'il repose sur des proportions très précises. Un mauvais choix de matière et tout semble froid plutôt que sobre.",
    actions: {
      "Salon": [
        "Trois teintes maximum dans toute la pièce, tenez-vous y sans exception.",
        "Un grand miroir sans cadre ou à cadre métal fin, il structure et agrandit.",
        "Remplacez les petits objets disparates par une seule pièce forte et bien choisie.",
      ],
      "Chambre": [
        "Une tête de lit rembourrée en tissu uni, gris ou écru, pas de bois ni de rotin.",
        "Linge de lit en deux couleurs : une dominante claire, un accent foncé.",
        "Une lampe de chevet géométrique en métal mat, c'est le détail qui signe ce style.",
      ],
      "Cuisine / salle à manger": [
        "Des chaises ou tabourets identiques, la répétition crée l'ordre.",
        "Une suspension architecturale au-dessus de la table, un seul élément graphique fort.",
        "Plan de travail entièrement dégagé, le contemporain sobre ne supporte pas le fouillis visible.",
      ],
      "Entrée": [
        "Une console fine en métal ou bois laqué, des lignes nettes, pas de panier ni de rotin.",
        "Un miroir rectangulaire vertical, cadre métal fin ou sans cadre, centré sur le mur.",
        "Un seul objet sur la console, choisi pour sa forme, pas de bouquet ni d'accumulation.",
      ],
      "Salle de bain": [
        "Tous vos contenants pareils : même forme, même matière, blanc mat ou noir mat.",
        "Une plante dans un pot en béton ou céramique mate sans motif, une seule.",
        "Un porte-serviettes en métal brossé, ce détail change tout dans ce style.",
      ],
    },
  },
  "chaud|epure|tonique": {
    name: "Terracotta vivant",
    axes: "Chaleureux · Épuré · Tonique",
    palette: [{ color: "#C4623A", name: "terracotta" }, { color: "#E8A87C", name: "abricot chaud" }, { color: "#F5EFE4", name: "crème" }],
    text: "Ocre, terracotta, argile, sable chaud : vous revenez toujours à ces couleurs sans forcément savoir les nommer. Ce sont des teintes qui réchauffent une pièce dès qu'on les pose, qui s'associent naturellement avec le bois brut et la céramique non émaillée. Un intérieur solaire, ancré, qui sent le voyage sans chercher à le citer.",
    actions: {
      "Salon": [
        "Peignez un seul mur en terracotta, les autres restent blancs ou crème.",
        "Des pots en terre cuite non émaillée à différentes hauteurs, au sol et sur les meubles.",
        "Un tapis à motifs géométriques dans les tons chauds : ocre, brique, sable.",
      ],
      "Chambre": [
        "Du linge de lit dans les tons terre : terracotta, ocre doux, sable, un coloris suffit.",
        "Une lampe de chevet en céramique mate dans un ton chaud, c'est le détail qui ancre le style.",
        "Un textile mural au-dessus du lit plutôt qu'un cadre, macramé ou tissage.",
      ],
      "Cuisine / salle à manger": [
        "De la vaisselle en grès dans les tons chauds : ocre, brique, vert kaki.",
        "Des bougies en cire naturelle dans des bougeoirs en terre cuite sur la table.",
        "Un vase en argile non émaillée avec quelques branches sèches, sobre et dans le style.",
      ],
      "Entrée": [
        "Peignez l'entrée en terracotta ou ocre, c'est une petite surface, le bon endroit pour oser.",
        "Un miroir avec cadre en rotin ou bois teinté chaud.",
        "Un pot en terre cuite avec une plante graphique, sansevieria ou cactus.",
      ],
      "Salle de bain": [
        "Des serviettes dans les tons chauds : terracotta, moutarde ou sable.",
        "Des bougies en cire d'abeille dans des bougeoirs en céramique brute.",
        "Un tapis de bain en coton épais dans un ton naturel chaud, pas de blanc ni de gris.",
      ],
    },
  },
  "chaud|charge|tonique": {
    name: "Vintage cuivré",
    axes: "Chaleureux · Affirmé · Tonique",
    palette: [{ color: "#B8612A", name: "cuivre" }, { color: "#E8C97A", name: "laiton" }, { color: "#2E4A3A", name: "vert bouteille" }],
    text: "Laiton, velours côtelé, bois foncé qui a vécu, miroirs avec un peu d'usure aux bords : vous reconnaissez ces détails partout où vous allez. Vos intérieurs de référence ont du caractère, parfois même un peu d'excès assumé. Ce ne sont pas des pièces décorées, ce sont des pièces habitées depuis longtemps.",
    actions: {
      "Salon": [
        "Cherchez une lampe en laiton ou cuivre, c'est la pièce signature du style.",
        "Associez velours et bois foncé sur le même meuble ou dans la même zone.",
        "Visitez les brocantes pour une pièce unique : miroir biseauté, plateau laiton, vase ambré.",
      ],
      "Chambre": [
        "Du linge de lit en velours côtelé ou satin mat dans un ton profond : bordeaux, vert bouteille, prune.",
        "Une applique ou lampe en laiton de chaque côté du lit, symétrique et affirmé.",
        "Un miroir ancien avec un peu d'usure aux bords, ça se trouve en brocante pour rien.",
      ],
      "Cuisine / salle à manger": [
        "Des couverts en laiton ou métal doré, ils changent complètement l'ambiance d'une table.",
        "Des verres en verre ambré ou fumé, quelques-uns suffisent pour le style.",
        "Une suspension en métal cuivré au-dessus de la table, c'est l'investissement central.",
      ],
      "Entrée": [
        "Une patère ou crochet en laiton fixé au mur, pas de porte-manteau générique.",
        "Un miroir avec cadre en métal doré ou bois foncé, l'entrée doit avoir du caractère.",
        "Un petit meuble ancien repeint en vert bouteille ou bleu nuit, récupéré et personnalisé.",
      ],
      "Salle de bain": [
        "Remplacez vos accessoires chromés par du doré brossé si vous le pouvez.",
        "Des bougies dans des bougeoirs en laiton ou cuivre.",
        "Un flacon de savon en verre ambré sur le lavabo, le détail fait toute la différence.",
      ],
    },
  },
  "neutre|epure|tonique": {
    name: "Vert nature",
    axes: "Neutre · Épuré · Végétal",
    palette: [{ color: "#3D6B52", name: "sauge profond" }, { color: "#6B9E7A", name: "vert sauge" }, { color: "#E8D5B7", name: "sable" }],
    text: "Le vert est votre couleur de fond, celle vers laquelle vous revenez sans vous poser la question. Sauge, forêt, olive, eucalyptus : ces teintes vous apaisent et vous ancrent en même temps. Vos intérieurs idéaux ont des plantes, du lin, du bois clair, et cette impression qu'on respire différemment dès qu'on entre.",
    actions: {
      "Salon": [
        "Peignez un mur ou une boiserie en vert sauge, l'impact est immédiat.",
        "Regroupez toutes vos plantes dans un seul coin généreux plutôt que dispersées partout.",
        "Du lin naturel en rideau ou plaid pour réchauffer le vert.",
      ],
      "Chambre": [
        "Du linge de lit en lin lavé dans les tons verts : sauge clair, eucalyptus, kaki doux.",
        "Une tête de lit en rotin naturel, elle s'associe parfaitement avec le vert.",
        "Une plante grande au sol dans un angle, ficus, monstera ou palmier d'intérieur.",
      ],
      "Cuisine / salle à manger": [
        "De la vaisselle en grès dans les tons verts ou naturels, c'est ce qui lie la table au style.",
        "Des herbes aromatiques en pot sur le rebord de fenêtre, en céramique mate verte.",
        "Une suspension en rotin ou osier, elle apporte la chaleur que le vert seul n'a pas.",
      ],
      "Entrée": [
        "Peignez l'entrée en vert profond, forêt ou bouteille, l'effet cocon commence là.",
        "Une plante graphique dès l'entrée, elle annonce l'ambiance du reste.",
        "Un miroir avec cadre en rotin ou bois naturel non teinté.",
      ],
      "Salle de bain": [
        "Des serviettes en coton ou lin dans les tons naturels : kaki, sauge, écru.",
        "Une ou deux plantes résistantes à l'humidité, fougère, pothos ou aloe vera.",
        "Des contenants en céramique mate verte ou naturelle pour vos produits du quotidien.",
      ],
    },
  },
  "froid|charge|tonique": {
    name: "Bleu nuit doux",
    axes: "Sobre · Affirmé · Tonique",
    palette: [{ color: "#2C4A6E", name: "bleu nuit" }, { color: "#E8D5B7", name: "sable chaud" }, { color: "#8BA5C4", name: "bleu ciel" }],
    text: "Vous aimez les intérieurs enveloppants, ceux où les murs semblent se rapprocher doucement pour créer quelque chose de protégé. Bleu nuit, vert bouteille, prune, ardoise : ces couleurs profondes vous attirent même si elles vous font un peu peur. Elles donnent à une pièce une présence que les tons clairs n'ont pas.",
    actions: {
      "Salon": [
        "Commencez par des coussins bleu nuit sur votre canapé, c'est le test à moindre risque.",
        "Associez le bleu foncé avec du rotin ou bois clair pour l'équilibre.",
        "Un abat-jour bleu nuit sur une lampe existante, l'effet est immédiat et réversible.",
      ],
      "Chambre": [
        "Peignez un seul mur derrière la tête de lit en bleu nuit ou vert bouteille.",
        "Du linge de lit dans les tons profonds : bleu nuit, prune, ardoise, avec du blanc cassé.",
        "Une lampe de chevet en laiton ou céramique mate, elle réchauffe les tons foncés.",
      ],
      "Cuisine / salle à manger": [
        "Des chaises ou une banquette en velours bleu nuit autour d'une table en bois clair.",
        "Une vaisselle dans les tons bleus ou gris profonds, en céramique artisanale.",
        "Une suspension en métal noir ou doré, elle tient tête aux couleurs profondes.",
      ],
      "Entrée": [
        "Peignez l'entrée entière en bleu nuit, plafond compris si le volume le permet.",
        "Un miroir doré ou en laiton, le contraste avec le bleu profond est parfait.",
        "Un tapis à motifs géométriques dans les tons bleus et sable.",
      ],
      "Salle de bain": [
        "Peignez les murs en bleu canard ou bleu nuit, c'est la pièce idéale pour oser.",
        "Des serviettes en coton épais blanc cassé ou écru, le contraste est élégant.",
        "Des accessoires en laiton : porte-serviettes, flacon de savon, miroir à cadre doré.",
      ],
    },
  },
  "chaud|charge|sature": {
    name: "Rétro pop 70s",
    axes: "Chaleureux · Affirmé · Saturé",
    palette: [{ color: "#D4622A", name: "orange brûlé" }, { color: "#E8C440", name: "moutarde" }, { color: "#8B3A2A", name: "brique" }],
    text: "Moutarde, brique, orange brûlé, formes rondes et pieds fuselés : vous avez un oeil pour les pièces des années 70 et leurs héritiers contemporains. Vos intérieurs de référence sont chaleureux, un peu chargés, avec des couleurs qui s'assument. Il y a toujours un objet inattendu qui donne le ton, et c'est souvent ce que vous repérez en premier.",
    actions: {
      "Salon": [
        "Cherchez un fauteuil aux formes rondes en velours moutarde ou brique, c'est la pièce centrale.",
        "Un tapis à motifs géométriques 70s, c'est lui qui pose le style dans toute la pièce.",
        "Limitez-vous à trois couleurs : une dominante, une secondaire, une accent, pas plus.",
      ],
      "Chambre": [
        "Une tête de lit aux formes rondes ou rembourrée en velours dans un ton chaud.",
        "Du linge de lit en velours côtelé moutarde ou satin brique, assumé jusqu'au bout.",
        "Une lampe champignon ou globe en verre ambré sur la table de nuit, typiquement 70s.",
      ],
      "Cuisine / salle à manger": [
        "Des chaises tulipe ou tabourets aux formes rondes, l'époque s'exprime dans les formes.",
        "Une suspension globe ou en métal laqué dans un ton chaud au-dessus de la table.",
        "De la vaisselle colorée, un seul coloris par service, moutarde ou orange brûlé.",
      ],
      "Entrée": [
        "Un miroir aux formes rondes avec cadre en rotin ou métal doré.",
        "Un porte-manteau vintage en bois courbé ou métal laqué, récupéré en brocante.",
        "Un sol en damier noir et blanc si vous refaites l'entrée, c'est le détail qui fait tout.",
      ],
      "Salle de bain": [
        "Un rideau de douche à motifs géométriques dans les tons 70s, c'est la pièce la plus facile à changer.",
        "Des serviettes en coton épais dans un coloris franc : moutarde, orange ou brique.",
        "Des accessoires en métal doré ou céramique colorée, pas de chrome.",
      ],
    },
  },
  "neutre|charge|sature": {
    name: "Jungle urbaine",
    axes: "Neutre · Affirmé · Végétal",
    palette: [{ color: "#2E4A3A", name: "vert forêt" }, { color: "#8B6F47", name: "terre" }, { color: "#C4623A", name: "terracotta" }],
    text: "Vos plantes ne sont pas un accessoire, elles structurent la pièce. Pothos qui débordent, figuiers au sol, étagères entièrement dédiées au vert : vous visualisez votre appartement comme un espace vivant, qui change avec les saisons, qui demande de l'attention. Les matières qui vont avec ce style sont brutes et organiques : terre cuite, osier, bois non traité.",
    actions: {
      "Salon": [
        "Installez des étagères murales uniquement dédiées aux plantes, pas de livres ni d'objets mélangés.",
        "Mélangez les tailles : une grande plante au sol, des moyennes sur meubles, des petites suspendues.",
        "Unifiez vos cache-pots en terre cuite non émaillée, pas de mélange de matières.",
      ],
      "Chambre": [
        "Une grande plante au sol dans l'angle le plus lumineux, ficus ou monstera.",
        "Des suspensions de plantes retombantes près de la fenêtre, pothos ou lierre.",
        "Du linge de lit en lin naturel dans les tons organiques : écru, sable, vert kaki.",
      ],
      "Cuisine / salle à manger": [
        "Une étagère murale uniquement pour les plantes et herbes aromatiques près de la fenêtre.",
        "Des cache-pots en terre cuite ou céramique brute, jamais en plastique visible.",
        "Des plantes suspendues au plafond si la hauteur le permet, ampel ou pothos.",
      ],
      "Entrée": [
        "Une plante grande dès l'entrée, elle annonce le style avant même qu'on entre dans le salon.",
        "Un miroir avec cadre en rotin ou bambou, dans le registre naturel.",
        "Un sol en matière naturelle si vous le refaites : tomettes, carreaux de ciment ou parquet brut.",
      ],
      "Salle de bain": [
        "Des plantes résistantes à l'humidité partout où il y a de la lumière : fougères, pothos, calathéas.",
        "Des contenants en bambou ou rotin pour vos produits, pas de plastique visible.",
        "Un tabouret en teck au sol, pratique et dans le registre naturel du style.",
      ],
    },
  },
  "neutre|epure|sature": {
    name: "Coloré assumé",
    axes: "Neutre · Épuré · Vibrant",
    palette: [{ color: "#4A7CB5", name: "bleu Klein" }, { color: "#E8C440", name: "jaune soleil" }, { color: "#C4623A", name: "orange" }],
    text: "Un mur bleu Klein, un canapé jaune soleil, des coussins qui clashent et qui fonctionnent quand même : vous êtes attirée par les intérieurs qui font un choix de couleur fort et qui l'assument jusqu'au bout. Pas de neutralité par défaut. La couleur comme point de départ, pas comme touche finale.",
    actions: {
      "Salon": [
        "Choisissez une couleur forte et construisez tout autour, pas trois à la fois.",
        "Testez avec un mur peint, c'est réversible et l'impact est immédiat.",
        "Gardez le sol et les grandes surfaces neutres pour laisser respirer la couleur.",
      ],
      "Chambre": [
        "Peignez le plafond dans une couleur, c'est le geste le plus inattendu et le plus efficace.",
        "Du linge de lit dans un coloris franc assumé, pas de motifs, juste la couleur.",
        "Un seul meuble de couleur contrastée, une commode laquée ou une table de nuit peinte.",
      ],
      "Cuisine / salle à manger": [
        "Des chaises dépareillées mais dans des couleurs qui se répondent, c'est le principe du style.",
        "De la vaisselle dans des coloris francs, chaque pièce différente mais dans la même famille.",
        "Un mur en carreaux de couleur si vous refaites : zellige vert, bleu Klein ou jaune soleil.",
      ],
      "Entrée": [
        "Osez une couleur très forte dans l'entrée, c'est un petit espace, c'est là qu'on prend des risques.",
        "Un sol peint en damier ou une couleur unie franche si vous le refaites.",
        "Des crochets ou patères colorées, pas de métal générique.",
      ],
      "Salle de bain": [
        "Carrelage de couleur ou carreaux de ciment colorés, la salle de bain supporte les couleurs fortes.",
        "Des serviettes dans des coloris complémentaires à votre couleur dominante.",
        "Des accessoires en céramique colorée, chaque détail compte dans ce style.",
      ],
    },
  },
  "froid|charge|sature": {
    name: "Maximalist dopamine",
    axes: "Sobre · Affirmé · Saturé",
    palette: [{ color: "#C44B8A", name: "rose vif" }, { color: "#4A7CB5", name: "bleu électrique" }, { color: "#E8C440", name: "jaune" }],
    text: "Trop n'est pas un mot qui vous fait peur. Vous aimez les intérieurs denses, saturés, où chaque surface raconte quelque chose et où les couleurs se répondent d'un bout à l'autre de la pièce. Ce n'est pas du désordre, c'est une composition qui demande de la cohérence justement parce qu'elle prend des risques.",
    actions: {
      "Salon": [
        "Créez des zones thématiques, chaque coin a sa propre palette cohérente entre elle.",
        "Multipliez les cadres au mur mais alignez-les sur un axe horizontal commun.",
        "Assumez le tapis coloré et chargé, c'est lui qui unit tout le reste.",
      ],
      "Chambre": [
        "Papier peint sur un mur, le plus graphique et chargé que vous osez, c'est la pièce pour ça.",
        "Accumulez les coussins sans vous limiter, couleurs, motifs et matières différentes.",
        "Une suspension en verre coloré ou métal laqué vif, pas de blanc ni de beige.",
      ],
      "Cuisine / salle à manger": [
        "Mélangez les chaises autour de la table, formes et couleurs différentes, c'est assumé.",
        "Une vaisselle graphique et colorée, chaque pièce peut être différente.",
        "Des étagères ouvertes chargées d'objets, organisées par couleur pour tenir visuellement.",
      ],
      "Entrée": [
        "Une galerie de cadres dès l'entrée, du sol au plafond, serrés et assumés.",
        "Un sol en carreaux de ciment colorés ou un papier peint fort, l'entrée donne le ton.",
        "Des crochets et patères décoratives, pas de porte-manteau fonctionnel et discret.",
      ],
      "Salle de bain": [
        "Du carrelage coloré du sol au plafond, c'est la pièce la plus petite donc la plus facile à assumer.",
        "Des miroirs multiples en formes et tailles différentes sur le même mur.",
        "Des accessoires qui clashent volontairement, c'est le principe du style.",
      ],
    },
  },
};

function computeProfile(answers) {
  const s = { chaud: 0, froid: 0, epure: 0, charge: 0, neutre_col: 0, tonique: 0, sature: 0 };

  const q1 = answers[1];
  if (q1 && SCORING[1][q1]) Object.entries(SCORING[1][q1]).forEach(([k, v]) => { s[k] += v; });

  const q2 = answers[2] || [];
  q2.forEach(photo => {
    if (SCORING[2][photo]) Object.entries(SCORING[2][photo]).forEach(([k, v]) => { s[k] += v * 2; });
  });

  const q3 = answers[3];
  if (q3 && SCORING[3][q3]) Object.entries(SCORING[3][q3]).forEach(([k, v]) => { s[k] += v; });

  const chaleur = s.chaud > s.froid ? "chaud" : s.froid > s.chaud ? "froid" : "neutre";
  const structure = s.charge > s.epure ? "charge" : "epure";
  const maxCol = Math.max(s.neutre_col, s.tonique, s.sature);
  const couleur =
    maxCol === 0 || (s.neutre_col >= s.tonique && s.neutre_col >= s.sature) ? "neutre"
    : s.sature >= s.tonique ? "sature" : "tonique";

  return PROFILES[`${chaleur}|${structure}|${couleur}`] || PROFILES["neutre|epure|neutre"];
}


const CheckIcon = () => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7l3.5 3.5L12 3.5" stroke="#3D6B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Quiz() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("quiz"); // quiz | gate | loading | result
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [gateError, setGateError] = useState("");
  const { consent } = useConsent();

  useEffect(() => {
    const ref = document.referrer;
    const source = !ref ? "direct" : ref.includes("studiokova.fr") ? "homepage" : "other";
    track("Quiz Started", { source });
  }, []);

  useEffect(() => {
    if (phase === "loading") {
      const t = setTimeout(() => setPhase("result"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "result") return;
    const p = computeProfile(answers);
    track("Quiz Result Shown", {
      profile: p.name,
      budget_range: answers[6] || "",
      room: answers[4] || "",
    });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const isStepReady = () => {
    if (step === 2) return (answers[2] || []).length > 0;
    return answers[step] != null;
  };

  const goNext = () => {
    const answerVal = step === 2
      ? (answers[2] || []).join(", ")
      : String(answers[step] ?? "");
    track("Quiz Step Completed", { step, answer: answerVal });
    if (step < TOTAL) setStep(s => s + 1);
    else {
      const p = computeProfile(answers);
      setProfile(p);
      track("Quiz Gate Shown", {
        profile: p.name,
        budget_range: answers[6] || "",
        room: answers[4] || "",
      });
      setPhase("gate");
    }
  };

  const setAnswer = (q, val) => setAnswers(prev => ({ ...prev, [q]: val }));

  const togglePhoto = (val) => {
    setAnswers(prev => {
      const cur = prev[2] || [];
      if (cur.includes(val)) return { ...prev, 2: cur.filter(x => x !== val) };
      if (cur.length >= 2) return { ...prev, 2: [cur[1], val] };
      return { ...prev, 2: [...cur, val] };
    });
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submitGate = () => {
    if (!EMAIL_REGEX.test(email)) {
      setGateError("Adresse email invalide");
      return;
    }
    setGateError("");
    setPhase("result"); // profil déjà calculé au gate - pas besoin du loader
    submitEmail();
  };

  const submitEmail = async () => {
    if (!email || !EMAIL_REGEX.test(email) || !profile) return;
    setEmailStatus("loading");

    let eventId = null;
    const utms = getStoredUtms();
    if (consent === 'accepted') {
      eventId = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: 'Quiz Studio Kova',
          content_category: profile.name,
          ...utms,
        }, { eventID: eventId });
      }
    }

    const actions = profile.actions[answers[4]] || profile.actions["Salon"];
    const processedActions = actions.map(a => a);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          offre: "quiz",
          meta_event_id: eventId, // null when no consent → CAPI Lead not triggered
          utms,
          attributes: {
            PROFIL: profile?.name || "",
            PIECE: answers[4] || "",
            ATTRAIT: answers[1] || "",
            PHOTOS: (answers[2] || []).join(", "),
            PALETTE: answers[3] || "",
            BLOCAGE: answers[5] || "",
            BUDGET: answers[6] || "",
          },
          profile: {
            name: profile.name,
            axes: profile.axes,
            palette: profile.palette,
            text: profile.text,
            actions: processedActions,
          },
          budget: answers[6] || "",
        }),
      });
      const result = await res.json();
      const status = result.success ? "success" : "error";
      setEmailStatus(status);
      if (status === "success") {
        track("Quiz Email Submitted", { profile: profile?.name || "", marketing_consent: marketingConsent });
        fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            style_name: profile.name,
            ambiance_cible: profile.axes.split(" · "),
            couleurs_aimees: profile.palette.map(p => p.name),
            couleurs_evitees: [],
            matieres_preferees: [],
            references_visuelles: answers[2] || [],
            marketing_consent: marketingConsent,
          }),
        }).catch(err => console.error("[quiz] sauvegarde profil:", err?.message));
      }
    } catch {
      setEmailStatus("error");
    }
  };

  const ctaLabel = () => {
    const b = answers[6];
    if (b === "500-1500€" || b === "Plus de 1500€") return `Je vous confie mon intérieur, ${OFFERS.surmesure.display} →`;
    return `Je transforme ma pièce, ${OFFERS.analyse.display} →`;
  };

  const ctaHref = () => {
    const b = answers[6];
    if (b === "500-1500€" || b === "Plus de 1500€") return "/surmesure";
    return "/analyse";
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        body { background: var(--craie, #F5EFE4); font-family: "DM Sans", sans-serif; color: var(--sauge-fonce, #2E4A3A); -webkit-font-smoothing: antialiased; }

        .qz-viewport { position: fixed; top: 115px; left: 0; right: 0; bottom: 0; overflow: hidden; }
        .qz-slider { display: flex; height: 100%; transition: transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .qz-screen { min-width: 100vw; width: 100vw; height: 100%; overflow-y: auto; display: flex; flex-direction: column; align-items: center; padding: 32px 24px 120px; }
        .qz-inner { width: 100%; max-width: 600px; }

        .qz-step-title { font-family: "Playfair Display", serif; font-style: italic; font-size: 28px; color: var(--sauge-fonce, #2E4A3A); margin-bottom: 28px; line-height: 1.2; }
        .qz-sub { font-size: 14px; color: var(--gris, #888780); line-height: 1.6; margin-bottom: 20px; margin-top: -16px; }

        .qz-options { display: flex; flex-direction: column; gap: 12px; }
        .qz-opt { width: 100%; text-align: left; padding: 15px 18px; border: 0.5px solid var(--gris-clair, #D3D1C7); border-radius: 12px; background: white; color: var(--sauge-fonce, #2E4A3A); font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 400; cursor: pointer; transition: border-color 0.18s, background 0.18s; display: flex; align-items: center; gap: 12px; }
        .qz-opt:hover { border-color: var(--sauge-med, #3D6B52); background: rgba(61,107,82,0.04); }
        .qz-opt.sel { border: 2px solid var(--sauge-med, #3D6B52); background: rgba(61,107,82,0.07); }
        .qz-circle { width: 20px; height: 20px; border-radius: 50%; border: 1.5px solid var(--gris-clair, #D3D1C7); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.18s, background 0.18s; }
        .qz-opt.sel .qz-circle { border-color: var(--sauge-med, #3D6B52); background: var(--sauge-med, #3D6B52); }
        .qz-dot { width: 6px; height: 6px; border-radius: 50%; background: white; display: none; }
        .qz-opt.sel .qz-dot { display: block; }

        .qz-photos { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .qz-photo { position: relative; cursor: pointer; border-radius: 12px; overflow: hidden; border: 2.5px solid transparent; transition: border-color 0.18s; aspect-ratio: 1; }
        .qz-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .qz-photo-lbl { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.55)); color: white; font-size: 13px; font-weight: 500; }
        .qz-photo-chk { position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.18s; }
        .qz-photo.sel { border-color: var(--sauge-med, #3D6B52); }
        .qz-photo.sel .qz-photo-chk { opacity: 1; }

        .qz-next { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 16px 40px; background: var(--cuivre, #B8612A); color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; white-space: nowrap; z-index: 50; box-shadow: 0 4px 20px rgba(184,97,42,0.3); transition: background 0.2s, color 0.2s, box-shadow 0.15s; }
        .qz-next:disabled { background: var(--gris-clair, #D3D1C7); color: var(--gris, #888780); cursor: not-allowed; box-shadow: none; transform: translateX(-50%); }
        .qz-next:not(:disabled):hover { transform: translateX(-50%) translateY(-2px); box-shadow: 0 6px 24px rgba(184,97,42,0.4); }

        .qz-loading { position: fixed; inset: 0; background: var(--craie, #F5EFE4); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; z-index: 200; }
        .qz-loading-text { font-family: "Playfair Display", serif; font-style: italic; font-size: 24px; color: var(--sauge-fonce, #2E4A3A); }
        .qz-spinner { width: 48px; height: 48px; border: 3px solid var(--gris-clair, #D3D1C7); border-top-color: var(--sauge-med, #3D6B52); border-radius: 50%; animation: qzspin 0.9s linear infinite; }
        @keyframes qzspin { to { transform: rotate(360deg); } }

        .qz-result { position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: var(--craie, #F5EFE4); overflow-y: auto; z-index: 50; }
        .qz-result-inner { max-width: 640px; margin: 0 auto; padding: 40px 24px 36px; }
        .qz-result-name { font-family: "Playfair Display", serif; font-style: italic; font-size: clamp(30px, 5.5vw, 44px); color: var(--sauge-fonce, #2E4A3A); line-height: 1.15; margin-bottom: 10px; }
        .qz-result-axes { font-size: 14px; color: var(--gris, #888780); font-weight: 500; letter-spacing: 0.08em; margin-bottom: 32px; }
        .qz-palette { display: flex; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
        .qz-swatch { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .qz-swatch-dot { width: 64px; height: 64px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.08); }
        .qz-swatch-name { font-size: 12px; color: var(--gris, #888780); text-align: center; max-width: 70px; line-height: 1.3; }
        .qz-result-text { font-size: 16px; line-height: 1.75; color: var(--sauge-fonce, #2E4A3A); margin-bottom: 32px; }
        .qz-actions-title { font-family: "Playfair Display", serif; font-size: 20px; color: var(--sauge-fonce, #2E4A3A); margin-bottom: 16px; }
        .qz-actions-list { padding-left: 20px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
        .qz-actions-list li { font-size: 15px; line-height: 1.6; color: var(--sauge-fonce, #2E4A3A); }
        .qz-email-box { background: var(--sauge-fonce, #2E4A3A); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
        .qz-email-label { font-size: 15px; font-weight: 500; color: var(--craie, #F5EFE4); margin-bottom: 16px; display: block; }
        .qz-email-in { width: 100%; padding: 14px; background: var(--craie, #F5EFE4); border: none; border-radius: 8px; font-family: "DM Sans", sans-serif; font-size: 14px; color: var(--sauge-fonce, #2E4A3A); outline: none; display: block; margin-bottom: 10px; }
        .qz-email-in::placeholder { color: var(--gris, #888780); }
        .qz-email-btn { width: 100%; padding: 14px; background: var(--cuivre, #B8612A); color: white; border: none; border-radius: 999px; font-family: "DM Sans", sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; display: block; transition: opacity 0.18s; }
        .qz-email-btn:hover { opacity: 0.9; }
        .qz-email-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .qz-email-ok { font-size: 14px; color: var(--ocre, #E8C97A); margin-top: 4px; display: block; }
        .qz-email-err { font-size: 13px; color: #ffb3a0; margin-top: 10px; display: block; }
        .qz-cta { display: block; width: 100%; padding: 18px 24px; background: var(--sauge-fonce, #2E4A3A); color: white; border: none; border-radius: 50px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; text-align: center; text-decoration: none; transition: opacity 0.18s, transform 0.15s; }
        .qz-cta:hover { opacity: 0.9; transform: translateY(-2px); }

        .qz-gate { position: fixed; top: 56px; left: 0; right: 0; bottom: 0; background: var(--craie, #F5EFE4); overflow-y: auto; z-index: 50; }
        .qz-gate-inner { width: 100%; max-width: 600px; margin: 0 auto; padding: 40px 24px 80px; }
        .qz-gate-preview { margin-bottom: 20px; }
        .qz-gate-blur-wrap { position: relative; margin-bottom: 0; max-height: 90px; overflow: hidden; padding: 10px 0 6px 12px; }
        .qz-gate-blurred { filter: blur(6px); user-select: none; pointer-events: none; }
        .qz-gate-blur-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(245,239,228,0.05) 0%, var(--craie, #F5EFE4) 72%); }
        .qz-gate-sub { font-size: 16px; color: var(--gris, #888780); margin-bottom: 20px; }
        .qz-gate-in { width: 100%; padding: 16px; border: 1.5px solid var(--gris-clair, #D3D1C7); border-radius: 8px; background: white; font-family: "DM Sans", sans-serif; font-size: 16px; color: var(--sauge-fonce, #2E4A3A); outline: none; display: block; margin-bottom: 12px; transition: border-color 0.18s; }
        .qz-gate-in:focus { border-color: var(--sauge-med, #3D6B52); }
        .qz-gate-in::placeholder { color: var(--gris, #888780); }
        .qz-gate-in.err { border-color: #c0392b; }
        .qz-gate-error { font-size: 13px; color: #c0392b; display: block; margin-bottom: 10px; }
        .qz-gate-consent { margin-bottom: 16px; }
        .qz-gate-btn { width: 100%; padding: 16px; background: var(--cuivre, #B8612A); color: white; border: none; border-radius: 10px; font-family: "DM Sans", sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: opacity 0.18s, transform 0.15s; }
        .qz-gate-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .qz-gate-validation { font-family: "Playfair Display", serif; font-style: italic; font-size: 16px; line-height: 1.5; color: var(--sauge-fonce, #2E4A3A); margin: 0 0 22px 0; }
        .qz-gate-benefits { background: rgba(255,255,255,0.5); border-radius: 12px; padding: 16px; margin-bottom: 18px; }
        .qz-gate-benefits-label { font-size: 11px; font-weight: 500; color: var(--cuivre, #B8612A); text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 12px 0; }
        .qz-gate-benefits-list { list-style: none; padding: 0; margin: 0; }
        .qz-gate-benefits-list li { font-size: 13px; color: var(--sauge-fonce, #2E4A3A); line-height: 1.5; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
        .qz-gate-benefits-list li:last-child { margin-bottom: 0; }
        .qz-gate-privacy { font-size: 11px; color: var(--sauge-fonce, #2E4A3A); opacity: 0.5; text-align: center; margin: 12px 0 0 0; }

        @media (max-width: 480px) {
          .qz-screen { padding: 24px 16px 110px; }
        }
      `}</style>

      {/* ─── GATE ─── */}
      {phase === "gate" && profile && (
        <>
          <KovaNav full />
          <div className="qz-gate">
            <div className="qz-gate-inner">
              {/* Aperçu du profil - nom + axes visibles, reste flouté */}
              <div className="qz-gate-preview">
                <h1 className="qz-result-name">{profile.name}</h1>
                <p className="qz-result-axes" style={{ marginBottom: "24px" }}>{profile.axes}</p>
                <div className="qz-gate-blur-wrap">
                  <div className="qz-gate-blurred">
                    <div className="qz-palette">
                      {profile.palette.map(p => (
                        <div key={p.name} className="qz-swatch">
                          <div className="qz-swatch-dot" style={{ background: p.color }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="qz-gate-blur-overlay" />
                </div>
              </div>

              {/* Phrase de validation du profil */}
              <p className="qz-gate-validation">
                {PROFILE_VALIDATIONS[profile.name]}
              </p>

              {/* Bénéfices email */}
              <div className="qz-gate-benefits">
                <p className="qz-gate-benefits-label">La suite par email</p>
                <ul className="qz-gate-benefits-list">
                  <li><GateCheckIcon /> Votre palette détaillée avec codes</li>
                  <li><GateCheckIcon /> 3 actions concrètes pour {formatPieceForSentence(answers[4])}</li>
                  <li><GateCheckIcon /> Les matières à privilégier</li>
                </ul>
              </div>

              {/* Formulaire */}
              <input
                type="email"
                className={`qz-gate-in${gateError ? " err" : ""}`}
                placeholder="votre@email.fr"
                value={email}
                onChange={e => { setEmail(e.target.value); setGateError(""); }}
                onKeyDown={e => e.key === "Enter" && submitGate()}
                autoFocus
              />
              {gateError && <span className="qz-gate-error">{gateError}</span>}
              <div className="qz-gate-consent">
                <KovaCheckbox
                  id="gate-marketing-consent"
                  checked={marketingConsent}
                  onChange={e => setMarketingConsent(e.target.checked)}
                >
                  Je veux bien recevoir vos prochains conseils déco. Désinscription en 1 clic.
                </KovaCheckbox>
              </div>
              <button className="qz-gate-btn" onClick={submitGate}>
                Recevoir ma palette →
              </button>
              <p className="qz-gate-privacy">Pas de spam. Vos données restent privées.</p>
            </div>
            <KovaFooter />
          </div>
        </>
      )}

      {/* ─── LOADING ─── */}
      {phase === "loading" && (
        <div className="qz-loading">
          <KovaLogo />
          <div className="qz-spinner" />
          <p className="qz-loading-text">On prépare votre profil...</p>
        </div>
      )}

      {/* ─── QUESTIONS ─── */}
      {phase === "quiz" && (
        <KovaStepShell
          offerLabel="JE TROUVE MON STYLE"
          currentStep={step}
          totalSteps={6}
        >
          <div className="qz-viewport">
            <div className="qz-slider" style={{ transform: `translateX(-${(step - 1) * 100}vw)` }}>

              {/* Q1 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <h1 className="qz-step-title">Quand vous entrez dans un beau salon, qu'est-ce qui vous attire en premier&nbsp;?</h1>
                  <div className="qz-options">
                    {["Les couleurs", "La lumière naturelle", "L'organisation et la clarté", "Les matières et textures", "Les objets et la déco personnelle"].map(v => (
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
                  <h1 className="qz-step-title">Laquelle de ces ambiances vous donne le plus envie de rester&nbsp;?</h1>
                  <p className="qz-sub">Choisissez jusqu'à 2 ambiances.</p>
                  <div className="qz-photos">
                    {[
                      { v: "A", label: "Naturel & lumière" },
                      { v: "B", label: "Épuré contemporain" },
                      { v: "C", label: "Cosy & chargé" },
                      { v: "D", label: "Couleur affirmée" },
                      { v: "E", label: "Végétal & vivant" },
                      { v: "F", label: "Pop & éclectique" },
                    ].map(({ v, label }) => (
                      <div key={v} className={`qz-photo${(answers[2] || []).includes(v) ? " sel" : ""}`} onClick={() => togglePhoto(v)}>
                        <img src={`/images/quiz/${v}.webp`} alt={label} loading="lazy" />
                        <div className="qz-photo-lbl">{label}</div>
                        <div className="qz-photo-chk"><CheckIcon /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q3 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <h1 className="qz-step-title">Votre palette idéale se situe plutôt où&nbsp;?</h1>
                  <div className="qz-options">
                    {[
                      { v: "Tons naturels",        label: "Tons naturels (lin, rotin, sable)" },
                      { v: "Doux et pastel",       label: "Doux et pastel" },
                      { v: "Contrasté noir/blanc", label: "Contrasté noir / blanc" },
                      { v: "Couleurs franches",    label: "Couleurs franches assumées" },
                      { v: "Profond et cosy",      label: "Profond et cosy (kaki, terracotta, ocre)" },
                    ].map(({ v, label }) => (
                      <button key={v} className={`qz-opt${answers[3] === v ? " sel" : ""}`} onClick={() => setAnswer(3, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q4 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <h1 className="qz-step-title">Quelle pièce vous pose le plus problème en ce moment&nbsp;?</h1>
                  <div className="qz-options">
                    {["Salon", "Chambre", "Cuisine / salle à manger", "Entrée", "Salle de bain"].map(v => (
                      <button key={v} className={`qz-opt${answers[4] === v ? " sel" : ""}`} onClick={() => setAnswer(4, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Q5 */}
              <div className="qz-screen">
                <div className="qz-inner">
                  <h1 className="qz-step-title">Ce qui vous bloque le plus en ce moment&nbsp;?</h1>
                  <div className="qz-options">
                    {[
                      { v: "je ne sais pas par où commencer",                label: "Je ne sais pas par où commencer" },
                      { v: "j'aime plein de choses mais rien ne va ensemble", label: "J'aime plein de choses mais rien ne va ensemble" },
                      { v: "je ne sais pas quoi changer sans tout refaire",   label: "Je ne sais pas quoi changer sans tout refaire" },
                      { v: "mon budget est limité",                           label: "Mon budget est limité" },
                      { v: "j'ai peur de faire des erreurs",                  label: "J'ai peur de faire des erreurs" },
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
                  <h1 className="qz-step-title">Votre budget pour transformer cette pièce&nbsp;?</h1>
                  <div className="qz-options">
                    {[
                      { v: "Moins de 200€", label: "Moins de 200€" },
                      { v: "200-500€",      label: "Entre 200€ et 500€" },
                      { v: "500-1500€",     label: "Entre 500€ et 1 500€" },
                      { v: "Plus de 1500€", label: "Plus de 1 500€" },
                    ].map(({ v, label }) => (
                      <button key={v} className={`qz-opt${answers[6] === v ? " sel" : ""}`} onClick={() => setAnswer(6, v)}>
                        <span className="qz-circle"><span className="qz-dot" /></span>{label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <button className="qz-next" disabled={!isStepReady()} onClick={goNext}>
            {step === TOTAL ? "Voir mon profil →" : "Suivant →"}
          </button>
        </KovaStepShell>
      )}

      {/* ─── RESULT ─── */}
      {phase === "result" && profile && (
        <>
          <KovaNav full />
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
              <p className="qz-result-text">{profile.text}</p>
              <div>
                <h3 className="qz-actions-title">Vos 3 premières actions</h3>
                <ol className="qz-actions-list">
                  {(profile.actions[answers[4]] || profile.actions["Salon"]).map((a, i) => <li key={i}>{a}</li>)}
                </ol>
              </div>
              <a
                href={ctaHref()}
                className="qz-cta"
                onClick={() => track("Quiz CTA Clicked", { destination: ctaHref() === "/surmesure" ? "premium" : "analysis" })}
              >{ctaLabel()}</a>
            </div>
            <KovaFooter />
          </div>
        </>
      )}
    </>
  );
}
