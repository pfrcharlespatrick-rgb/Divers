/* Les conditions du jour, et le moteur qui en tire une mouche.
 *
 * ⚠ D'OÙ VIENNENT CES RÈGLES. Pas de la fiche de Patrick Blanchet : son PDF est
 * l'impression d'une page interactive, les boutons de conditions n'y ont pas
 * survécu, et la table qui les reliait aux patrons n'y figure nulle part. Ces
 * règles sont donc les principes généraux de la pêche à la mouche — la
 * silhouette prime quand la lumière baisse, on descend en taille quand l'eau
 * est basse et claire, on descend en profondeur quand rien ne monte. Ce sont
 * des principes, pas des certitudes, et l'application le dit à l'écran.
 *
 * Le moteur ne note QUE ce que la photo montre : famille, teinte, taille,
 * volume, nage. Il ne prétend jamais reconnaître un patron.
 */

const LIEUX = {
  rapide: {
    libelle: 'Rivière rapide',
    desc: "Courant vif, eau brisée. Le poisson voit peu et décide vite : il faut qu'il repère la mouche.",
    poids: { volume:{ etoffe:3, moyen:1 }, taille:{ grosse:2, moyenne:1 }, famille:{ bomber:2, seche:1, noyee:1 } },
    conseils: [
      "Lancez en travers ou légèrement en aval, laissez la mouche balayer le courant jusque sous vous, puis attendez deux secondes avant de relancer : beaucoup de touches viennent à la fin du balayage.",
      "Pêchez les veines de raccord — la ligne entre le courant vif et l'eau calme. C'est là que le poisson se tient sans se fatiguer."
    ]
  },
  calme: {
    libelle: 'Rivière calme',
    desc: "Fosse lente, surface lisse. Le poisson a tout son temps pour examiner la mouche, et vous voir.",
    poids: { volume:{ degarni:3, moyen:1 }, taille:{ petite:2, moyenne:1 }, famille:{ seche:2, noyee:2, terrestre:1 } },
    conseils: [
      "Approchez par l'aval et restez bas. En eau lisse, c'est votre silhouette qui fait fuir, pas la mouche.",
      "Allongez le bas de ligne et posez plus loin que vous ne le feriez en courant. Une mouche qui arrive avant la ligne double vos chances."
    ]
  },
  lac: {
    libelle: 'Lac',
    desc: "Eau dormante. Aucun courant n'anime la mouche : c'est votre récupération qui lui donne vie.",
    poids: { famille:{ streamer:3, terrestre:1, seche:1 }, nage:{ fond:2, surface:1 } },
    conseils: [
      "Comptez après le poser — cinq, dix, quinze secondes — et changez de compte à chaque lancer jusqu'à trouver la profondeur où ça répond.",
      "Cherchez les cassures : bordure d'herbiers, arrivée de ruisseau, tombant. Un lac est vide à 90 %, tout se joue sur les bordures."
    ]
  }
};

const CIELS = {
  soleil: {
    libelle: 'Grand soleil',
    poids: { teinte:{ naturel:3, clair:2, sombre:-1, vive:-1 }, volume:{ degarni:2 }, taille:{ petite:2, moyenne:1 } },
    conseils: ["Par grand soleil, surveillez votre ombre : ne la laissez jamais tomber sur la fosse. Pêchez face au soleil plutôt que dos à lui."]
  },
  voile: {
    libelle: 'Voilé',
    poids: { teinte:{ naturel:2, clair:1, vive:1 } },
    conseils: ["Ciel voilé : la lumière est douce et régulière. C'est le moment où le plus grand nombre de montages fonctionnent — pas d'excuse dans le choix, tout se joue à la présentation."]
  },
  nuageux: {
    libelle: 'Nuageux',
    poids: { teinte:{ sombre:2, vive:2, naturel:1 }, volume:{ etoffe:1 } },
    conseils: ["Sous un ciel gris, le poisson voit la mouche par en dessous, à contre-jour. Une silhouette dense se découpe mieux qu'une teinte juste."]
  },
  pluie: {
    libelle: 'Pluie',
    poids: { teinte:{ vive:3, sombre:2 }, volume:{ etoffe:2 }, taille:{ grosse:1 } },
    conseils: ["La pluie brouille la surface : le poisson perd en acuité et gagne en audace. C'est le moment d'oser une teinte vive et un montage plus gros."]
  },
  sombre: {
    libelle: 'Aube ou brunante',
    poids: { teinte:{ sombre:3, vive:1, clair:-1 }, volume:{ etoffe:2 }, taille:{ grosse:2 } },
    conseils: ["Peu de lumière : le poisson ne voit plus qu'une silhouette contre le ciel. Le noir se découpe mieux que le clair — c'est contre-intuitif et c'est pourtant ainsi."]
  }
};

const EAUX = {
  basse: {
    libelle: 'Basse et claire',
    poids: { taille:{ petite:3, moyenne:1, grosse:-2 }, volume:{ degarni:3, moyen:1, etoffe:-1 } },
    conseils: ["Eau basse : descendez d'une taille et affinez la pointe. La discrétion viendra autant du fil que de la mouche."]
  },
  normale: {
    libelle: 'Normale',
    poids: { taille:{ moyenne:2, petite:1, grosse:1 } },
    conseils: []
  },
  haute: {
    libelle: 'Haute',
    poids: { taille:{ grosse:3, moyenne:1, petite:-2 }, volume:{ etoffe:2 } },
    conseils: ["Eau haute : le poisson quitte le fort courant pour les bordures et les contre-courants. Pêchez près du bord, souvent plus près que vous ne croyez."]
  },
  teintee: {
    libelle: 'Teintée ou sale',
    poids: { teinte:{ sombre:3, vive:2, clair:-2 }, taille:{ grosse:2 }, volume:{ etoffe:2 } },
    conseils: ["En eau teintée, la silhouette prime sur la couleur : gros et sombre se voit de plus loin qu'élégant et juste. Ralentissez aussi la dérive, le poisson a moins de temps pour décider."]
  }
};

const ACTIVITES = {
  gobe: {
    libelle: 'Ça gobe',
    poids: { nage:{ surface:4, 'entre-deux':1, fond:-2 } },
    conseils: ["Posez un mètre en amont du gobage, jamais dessus, et laissez dériver sans tirer. Un poisson qui monte refuse presque toujours une mouche qui traîne."]
  },
  rien: {
    libelle: 'Rien en surface',
    poids: { nage:{ fond:2, 'entre-deux':2, surface:-1 } },
    conseils: ["Rien en surface ne veut pas dire rien : le poisson est là, plus bas. Descendez avant de changer de mouche."]
  }
};

/* Conseils propres à la famille retenue — comment pêcher CE montage-là. */
const CONSEILS_FAMILLE = {
  bomber: "Un Bomber se pêche en dérive, ou en le faisant travailler par petites tractions pour qu'il laisse un sillage. Le saumon monte souvent dessus deux ou trois fois avant de le prendre : ne ferrez pas au premier refus, laissez-le revenir.",
  streamer: "Ramenez par saccades irrégulières, avec des pauses. C'est la pause qui déclenche l'attaque, pas la traction. Variez la vitesse jusqu'à ce qu'une réponse vienne.",
  seche: "Dérive libre, sans la moindre traction de la ligne. Récupérez le mou au fur et à mesure pour rester en contact sans tirer.",
  noyee: "Lancez en travers, laissez le courant tendre la soie et balayer la mouche en arc. Suivez de la canne, sans forcer.",
  terrestre: "Le long des berges, sous les branches, contre les herbes. Un terrestre tombe à l'eau du bord — c'est là qu'il doit arriver, avec un petit « ploc » assumé."
};

/* Quand le coffre n'a pas ce que les conditions réclament. */
const COMPENSATIONS = {
  'taille:petite': "Votre coffre n'a rien de vraiment petit pour ces conditions. Prenez le montage le plus dégarni, allongez le bas de ligne et descendez d'un diamètre à la pointe : la discrétion viendra du fil.",
  'taille:grosse': "Rien de vraiment gros dans le coffre. Compensez en pêchant plus lentement et plus près du poisson : une petite mouche vue de près vaut une grosse vue de loin.",
  'teinte:sombre': "Pas de montage franchement sombre à sortir. Prenez le plus dense et le plus mat que vous ayez, et pêchez-le plus lentement : la silhouette compte plus que la teinte exacte.",
  'teinte:vive': "Rien de vif dans le coffre pour réveiller le poisson. Jouez sur le mouvement à la place : une animation plus marquée attire autant qu'une couleur.",
  'teinte:naturel': "Pas de teinte discrète disponible. Prenez la plus terne de vos mouches et posez-la plus loin de vous.",
  'nage:fond': "Rien qui plonge vraiment. Mouillez bien la mouche avant de lancer, envoyez plus en amont, et laissez-la couler ligne détendue avant de tendre. Un plomb sur la pointe finit le travail si vous en avez un.",
  'nage:surface': "Rien de conçu pour flotter dans ce que réclament ces conditions. Graissez la mouche la plus étoffée que vous ayez et pêchez-la en tête de courant, là où l'eau la soutient.",
  'volume:degarni': "Tout est plutôt étoffé chez vous. Vous pouvez dégarnir une mouche sur place : quelques coups de ciseaux dans le hackle du dessous suffisent à la faire poser plus bas et plus discrètement.",
  'volume:etoffe': "Rien de bien volumineux. Faites du volume autrement : pêchez en tête de courant, où l'eau brisée grossit tout ce qui passe."
};

const TRAITS = ['famille', 'teinte', 'taille', 'volume', 'nage'];

/* Note chaque mouche du coffre selon les quatre registres choisis. */
function noter(mouche, choix) {
  const registres = [LIEUX[choix.lieu], CIELS[choix.ciel], EAUX[choix.eau], ACTIVITES[choix.activite]];
  let total = 0;
  const pour = [];
  const contre = [];

  for (const r of registres) {
    for (const trait of TRAITS) {
      const table = r.poids[trait];
      if (!table) continue;
      const p = table[mouche[trait]];
      if (p === undefined) continue;
      total += p;
      if (p >= 2) pour.push(trait);
      else if (p < 0) contre.push(trait);
    }
  }
  return { total, pour: [...new Set(pour)], contre: [...new Set(contre)] };
}

/* Le profil que les conditions réclament, trait par trait. */
function profilIdeal(choix) {
  const registres = [LIEUX[choix.lieu], CIELS[choix.ciel], EAUX[choix.eau], ACTIVITES[choix.activite]];
  const ideal = {};
  for (const trait of TRAITS) {
    const cumul = {};
    for (const r of registres) {
      for (const [valeur, p] of Object.entries(r.poids[trait] || {})) {
        cumul[valeur] = (cumul[valeur] || 0) + p;
      }
    }
    const entrees = Object.entries(cumul).filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1]);
    if (entrees.length) ideal[trait] = entrees[0][0];
  }
  return ideal;
}

/* Le classement du jour, plus ce qui manque au coffre. */
function conseilDuJour(choix, disponibles) {
  const classees = disponibles
    .map((m) => ({ m, ...noter(m, choix) }))
    .sort((a, b) => b.total - a.total || a.m.id.localeCompare(b.m.id));

  const ideal = profilIdeal(choix);
  const manques = [];
  // Un trait manque si AUCUNE des cinq premières ne le porte : le coffre ne
  // sait pas répondre à cette exigence-là aujourd'hui.
  const tete = classees.slice(0, 5).map((c) => c.m);
  for (const [trait, valeur] of Object.entries(ideal)) {
    if (trait === 'famille') continue;
    if (!tete.some((m) => m[trait] === valeur)) {
      const cle = `${trait}:${valeur}`;
      if (COMPENSATIONS[cle]) manques.push({ trait, valeur, texte: COMPENSATIONS[cle] });
    }
  }

  const conseils = [
    ...LIEUX[choix.lieu].conseils,
    ...CIELS[choix.ciel].conseils,
    ...EAUX[choix.eau].conseils,
    ...ACTIVITES[choix.activite].conseils
  ];

  return { classees, ideal, manques, conseils };
}
