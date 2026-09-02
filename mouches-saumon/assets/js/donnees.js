/* Données de « Choisir sa mouche à saumon ».
 *
 * SOURCE UNIQUE : la fiche PDF « Choisir sa mouche à saumon », d'après la fiche
 * plastifiée de Patrick Blanchet. Les champs `origine`, `toilette`, `hamecon`,
 * `reserve` et `note` reprennent le texte de la fiche, sans ajout.
 *
 * Les champs `profil` et `teinte` sont DÉDUITS de la toilette écrite : ce sont
 * des relectures du texte ci-dessus, pas des informations supplémentaires. Quand
 * la fiche ne donne pas de toilette, ils restent vides — l'application n'invente
 * rien pour combler le trou.
 */

/* Teintes des matériaux, pour le profil coloré. */
const T = {
  argent: '#c6cbd2',
  argentClair: '#dfe3e8',
  or: '#c9a227',
  noir: '#17181c',
  vertFluo: '#3ddc6a',
  vert: '#1a7f3f',
  vertPhoque: '#2f6b3a',
  jauneCitron: '#f0e04a',
  jaune: '#f0c419',
  jauneOr: '#d9a520',
  orange: '#f2761b',
  orangeFluo: '#ff6a13',
  orangeVif: '#e8590c',
  rouge: '#cf2b2b',
  bleu: '#1d4ed8',
  bleuVif: '#2f80ed',
  gris: '#9aa0a6',
  grisCendre: '#a9a39c',
  brun: '#7a4a22',
  paon: '#1f3b33',
  faisan: '#e08b1e',
  renard: '#b8a894',
  grizzly: '#8a8a8a',
  creme: '#d9c9a8',
  pintade: '#5b6167',
  melee: '#8a7a5c'
};

/* b(couleur, libellé) — une bande du profil coloré. */
const b = (c, l) => ({ c, l });

const MOUCHES = [
  {
    nom: 'Black Bear (green butt)',
    origine: 'Classique nord-américaine',
    toilette: "Ferret de tinsel ovale argent, plumet de floche vert fluorescent, corps de floche noire côtelé d'argent, collerette noire, aile de poil d'ours noir.",
    hamecon: [2, 10],
    reserve: null,
    teinte: 'sombre',
    profil: [b(T.argent, 'ferret argent'), b(T.vertFluo, 'plumet vert fluo'), b(T.noir, 'corps noir côtelé argent'), b(T.noir, 'collerette noire'), b(T.noir, "aile d'ours noir")]
  },
  {
    nom: 'Black Dose',
    origine: 'Écossaise, adoptée partout au Québec',
    toilette: "Ferret argent, plumet jaune citron, queue de crête de faisan doré rehaussée de barbes rouges, corps de floche noire côtelé d'argent, aile de sabre de paon surmontée de fins poils d'ours noir, collerette noire.",
    hamecon: [2, 10],
    reserve: null,
    verifiee: true,
    teinte: 'sombre',
    profil: [b(T.argent, 'ferret argent'), b(T.jauneCitron, 'plumet jaune citron'), b(T.faisan, 'queue de faisan doré'), b(T.rouge, 'barbes rouges'), b(T.noir, 'corps noir côtelé argent'), b(T.paon, 'aile de sabre de paon'), b(T.noir, "poils d'ours noir")]
  },
  {
    nom: 'Blue Charm',
    origine: 'Écossaise, rivière Dee',
    toilette: "Ferret argent et floche jaune, queue de crête de faisan doré, corps de floche noire côtelé d'argent, collerette bleu vif, aile d'écureuil gris ou de dinde mouchetée.",
    hamecon: [4, 10],
    reserve: null,
    teinte: 'sombre',
    profil: [b(T.argent, 'ferret argent'), b(T.jaune, 'floche jaune'), b(T.faisan, 'queue de faisan doré'), b(T.noir, 'corps noir côtelé argent'), b(T.bleuVif, 'collerette bleu vif'), b(T.gris, "aile d'écureuil gris")]
  },
  {
    nom: 'Cerf noir',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    note: "Le nom désigne un montage à poil de cerf teint noir. Les recettes publiées diffèrent d'une région à l'autre ; aucune version ne fait autorité.",
    teinte: null,
    profil: null
  },
  {
    nom: 'Green Highlander',
    origine: 'Écossaise, redoutable en Gaspésie',
    toilette: "Ferret argent et floche jaune, queue de crête de faisan doré, plumet de herl noir, corps jaune d'or à l'arrière et vert phoque à l'avant, côtes argent, collerette verte puis jaune, aile mêlée à dominante verte.",
    hamecon: [2, 8],
    reserve: null,
    teinte: 'vive',
    profil: [b(T.argent, 'ferret argent'), b(T.jaune, 'floche jaune'), b(T.faisan, 'queue de faisan doré'), b(T.paon, 'plumet de herl noir'), b(T.jauneOr, "corps jaune d'or (arrière)"), b(T.vertPhoque, 'corps vert phoque (avant)'), b(T.vert, 'collerette verte puis jaune'), b(T.vert, 'aile à dominante verte')]
  },
  {
    nom: 'Hot Orange',
    origine: 'Favorite des rivières gaspésiennes',
    toilette: "Corps de floche orange fluorescent côtelé de tinsel ovale, collerette orange vif, aile de poil brun ou d'écureuil.",
    hamecon: [4, 10],
    reserve: 'courant',
    teinte: 'vive',
    profil: [b(T.orangeFluo, 'corps orange fluorescent'), b(T.argent, 'côtes de tinsel ovale'), b(T.orangeVif, 'collerette orange vif'), b(T.brun, 'aile de poil brun')]
  },
  {
    nom: 'Pelletier',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Rusty Rat',
    origine: 'Série des Rat, Restigouche',
    toilette: "Ferret d'or, queue de fibres de paon, corps mi-arrière de floche jaune citron et mi-avant de herl de paon, voile de floche jaune courant jusqu'à la queue, côtes d'or, aile de renard argenté, collerette grizzly, tête rouge.",
    hamecon: [2, 12],
    reserve: null,
    verifiee: true,
    teinte: 'mixte',
    profil: [b(T.or, "ferret d'or"), b(T.paon, 'queue de fibres de paon'), b(T.jauneCitron, 'corps arrière jaune citron'), b(T.paon, 'corps avant de herl de paon'), b(T.or, "côtes d'or"), b(T.renard, 'aile de renard argenté'), b(T.grizzly, 'collerette grizzly'), b(T.rouge, 'tête rouge')]
  },
  {
    nom: 'As de pique',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Blue Doctor',
    origine: 'Classique victorienne',
    toilette: "Ferret argent, plumet jaune, queue de crête de faisan doré, corps de floche bleue côtelé d'argent, collerette bleue, aile mêlée, tête de laine rouge.",
    hamecon: [2, 8],
    reserve: null,
    teinte: 'vive',
    profil: [b(T.argent, 'ferret argent'), b(T.jaune, 'plumet jaune'), b(T.faisan, 'queue de faisan doré'), b(T.bleu, 'corps bleu côtelé argent'), b(T.bleuVif, 'collerette bleue'), b(T.melee, 'aile mêlée'), b(T.rouge, 'tête de laine rouge')]
  },
  {
    nom: 'Dusty Miller',
    origine: 'Classique victorienne',
    toilette: "Corps d'argent dont la section arrière est de floche orange, côtes d'argent, collerette gris cendré, aile mêlée sobre.",
    hamecon: [2, 8],
    reserve: null,
    teinte: 'argentee',
    profil: [b(T.orange, 'section arrière orange'), b(T.argentClair, "corps d'argent"), b(T.argent, "côtes d'argent"), b(T.grisCendre, 'collerette gris cendré'), b(T.melee, 'aile mêlée sobre')]
  },
  {
    nom: 'Gageure',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Lanctôt',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Orange Blossom',
    origine: 'Miramichi, Nouveau-Brunswick',
    toilette: "Queue de faisan doré, corps de floche orange côtelé d'argent, collerette orange, aile de poils orange et jaune.",
    hamecon: [4, 10],
    reserve: 'courant',
    teinte: 'vive',
    profil: [b(T.faisan, 'queue de faisan doré'), b(T.orange, 'corps orange côtelé argent'), b(T.argent, "côtes d'argent"), b(T.orangeVif, 'collerette orange'), b(T.jaune, 'aile orange et jaune')]
  },
  {
    nom: 'Pompier',
    origine: 'Michel Beaudin, 1980, rivières de Gaspé',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    note: "Créée vers 1980 par Michel Beaudin, pompier à Montréal, et devenue une classique de la Dartmouth, de la York et de la Saint-Jean. La fiche n'a pu vérifier sa toilette exacte dans une source fiable.",
    teinte: null,
    profil: null
  },
  {
    nom: 'Red Abbey',
    origine: "Classique, très répandue dans l'Est",
    toilette: "Queue de fibres rouges ou de faisan doré, corps de floche rouge côtelé d'argent, collerette brune, aile de poil brun.",
    hamecon: [4, 10],
    reserve: 'courant',
    teinte: 'vive',
    profil: [b(T.rouge, 'queue de fibres rouges'), b(T.rouge, 'corps rouge côtelé argent'), b(T.argent, "côtes d'argent"), b(T.brun, 'collerette brune'), b(T.brun, 'aile de poil brun')]
  },
  {
    nom: 'Rogers Fancy',
    origine: 'Maritimes',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Ross spécial',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Samson',
    origine: 'Québécoise',
    toilette: null,
    hamecon: null,
    reserve: 'non-verifiee',
    teinte: null,
    profil: null
  },
  {
    nom: 'Silver Cosseboom',
    origine: "D'après John Cosseboom, années 1920",
    toilette: "Ferret argent, queue de floche verte, corps de tinsel plat argent côtelé, aile d'écureuil gris, collerette jaune citron, tête rouge.",
    hamecon: [2, 12],
    reserve: null,
    verifiee: true,
    teinte: 'argentee',
    profil: [b(T.argent, 'ferret argent'), b(T.vert, 'queue de floche verte'), b(T.argentClair, 'corps de tinsel plat argent'), b(T.gris, "aile d'écureuil gris"), b(T.jauneCitron, 'collerette jaune citron'), b(T.rouge, 'tête rouge')]
  },
  {
    nom: 'Yellow Cosseboom',
    origine: 'Variante jaune de la Cosseboom',
    toilette: "Même architecture, corps de floche jaune côtelé d'argent, aile d'écureuil gris, collerette jaune, tête rouge.",
    hamecon: [2, 12],
    reserve: null,
    teinte: 'vive',
    profil: [b(T.jaune, 'corps jaune côtelé argent'), b(T.argent, "côtes d'argent"), b(T.gris, "aile d'écureuil gris"), b(T.jaune, 'collerette jaune'), b(T.rouge, 'tête rouge')]
  },
  {
    nom: 'Silver Doctor',
    origine: 'Classique victorienne',
    toilette: "Ferret argent et plumet rouge, queue de crête de faisan doré, corps de tinsel plat argent côtelé, collerette bleue puis pintade, aile mêlée, tête de laine rouge.",
    hamecon: [2, 8],
    reserve: null,
    teinte: 'argentee',
    profil: [b(T.argent, 'ferret argent'), b(T.rouge, 'plumet rouge'), b(T.faisan, 'queue de faisan doré'), b(T.argentClair, 'corps de tinsel plat argent'), b(T.bleu, 'collerette bleue'), b(T.pintade, 'puis pintade'), b(T.melee, 'aile mêlée'), b(T.rouge, 'tête de laine rouge')]
  },
  {
    nom: 'Silver Grey',
    origine: 'Classique victorienne',
    toilette: "Ferret argent et plumet jaune, queue de crête de faisan doré, corps de tinsel plat argent côtelé, collerette grise, aile mêlée claire.",
    hamecon: [2, 8],
    reserve: null,
    teinte: 'argentee',
    profil: [b(T.argent, 'ferret argent'), b(T.jaune, 'plumet jaune'), b(T.faisan, 'queue de faisan doré'), b(T.argentClair, 'corps de tinsel plat argent'), b(T.gris, 'collerette grise'), b(T.creme, 'aile mêlée claire')]
  },
  {
    nom: 'Silver Rat',
    origine: 'Série des Rat, Restigouche',
    toilette: "Ferret d'or, queue de crête de faisan doré, corps de tinsel plat argent côtelé d'or, aile de renard argenté, épaules de coq de Sonnerat, collerette grizzly, tête rouge.",
    hamecon: [2, 12],
    reserve: null,
    verifiee: true,
    teinte: 'argentee',
    profil: [b(T.or, "ferret d'or"), b(T.faisan, 'queue de faisan doré'), b(T.argentClair, 'corps de tinsel plat argent'), b(T.or, "côtes d'or"), b(T.renard, 'aile de renard argenté'), b(T.melee, 'épaules de coq de Sonnerat'), b(T.grizzly, 'collerette grizzly'), b(T.rouge, 'tête rouge')]
  },
  {
    nom: 'Black Rat',
    origine: 'Série des Rat',
    toilette: "Ferret d'or, queue de crête de faisan doré, corps noir côtelé d'or, aile de renard argenté, collerette grizzly, tête rouge.",
    hamecon: [2, 12],
    reserve: 'courant',
    teinte: 'sombre',
    profil: [b(T.or, "ferret d'or"), b(T.faisan, 'queue de faisan doré'), b(T.noir, "corps noir côtelé d'or"), b(T.or, "côtes d'or"), b(T.renard, 'aile de renard argenté'), b(T.grizzly, 'collerette grizzly'), b(T.rouge, 'tête rouge')]
  },
  {
    nom: 'Godbout de cristal',
    origine: "D'après la Godbout d'André A. Bellemare",
    toilette: "La Godbout d'origine, dite « cul vert » : ferret d'or, plumet vert fluorescent, corps de herl de paon, aile d'écureuil gris teint jaune, tête noire. La variante « de cristal » remplace le corps par des fibres synthétiques réfléchissantes.",
    hamecon: [2, 16],
    reserve: 'courant',
    verifiee: true,
    teinte: 'mixte',
    profil: [b(T.or, "ferret d'or"), b(T.vertFluo, 'plumet vert fluorescent'), b(T.paon, 'corps de herl de paon'), b(T.jaune, "aile d'écureuil teint jaune"), b(T.noir, 'tête noire')]
  },

  /* Les cinq patrons que la fiche nomme sous « Eau basse ». Elle n'en donne
     pas la toilette : rien n'est ajouté ici. */
  { nom: 'Corneille', origine: null, toilette: null, hamecon: null, reserve: 'sans-toilette', eauBasse: true, teinte: null, profil: null },
  { nom: 'Dragon', origine: null, toilette: null, hamecon: null, reserve: 'sans-toilette', eauBasse: true, teinte: null, profil: null },
  { nom: 'Inconnue', origine: null, toilette: null, hamecon: null, reserve: 'sans-toilette', eauBasse: true, teinte: null, profil: null },
  { nom: 'Silver Blue', origine: null, toilette: null, hamecon: null, reserve: 'sans-toilette', eauBasse: true, teinte: null, profil: null },
  { nom: 'Undertaker', origine: null, toilette: null, hamecon: null, reserve: 'sans-toilette', eauBasse: true, teinte: null, profil: null }
];

/* Le registre de l'eau, mot pour mot d'après la fiche.
 * `fenetre` est en revanche une lecture de l'application : la fiche parle de
 * « petite », « moyenne » et « grosse » mouche sans chiffrer les numéros.
 * L'échelle posée ici : petite = n° 10 à 16, moyenne = n° 6 à 8, grosse = n° 2 à 4. */
const NIVEAUX = {
  basse: {
    titre: 'Eau basse',
    fiche: "Petite mouche, montage dégarni, modèle « low water », ou streamer.",
    fenetre: [10, 16],
    fenetreTexte: 'petite'
  },
  normale: {
    titre: 'Eau normale',
    fiche: 'Mouche petite à moyenne.',
    fenetre: [6, 16],
    fenetreTexte: 'petite à moyenne'
  },
  haute: {
    titre: 'Eau haute',
    fiche: "Mouche moyenne à grosse. Si l'eau est sale, choisir une teinte sombre.",
    fenetre: [2, 8],
    fenetreTexte: 'moyenne à grosse'
  }
};

const TEINTES = {
  sombre: { libelle: 'Sombre', puce: '#17181c', desc: 'corps noir ou très foncé' },
  argentee: { libelle: 'Argentée', puce: '#c6cbd2', desc: 'corps de tinsel ou de floche claire' },
  vive: { libelle: 'Vive', puce: '#f2761b', desc: 'corps orange, rouge, jaune, vert ou bleu' },
  mixte: { libelle: 'Mixte', puce: '#7a6a3a', desc: 'corps en deux teintes contrastées' }
};

/* Ce que la photo du coffre montre, panneau par panneau.
 *
 * C'est une LECTURE VISUELLE, pas une identification. Une photo ne dit pas le
 * nom d'un patron : elle dit une famille, une teinte, une taille apparente.
 * Rien ici n'est donné pour un nom certain — c'est à vous de nommer.
 */
const COFFRE = [
  {
    id: 'couvercle',
    titre: 'Couvercle',
    image: 'assets/img/coffre-couvercle.jpg',
    familles: [
      { n: 8, quoi: 'Grosses sèches en poil de cerf, corps fuselé, hackle palmé', teintes: ['#8a6b45', '#c9bfae', '#3ddc6a'], note: 'Profil de Bomber. Brun et gris naturels ; trois portent un ferret ou une tête vert vif.' },
      { n: 5, quoi: 'Mouches à aile de poil sombre sur corps fauve', teintes: ['#c99a4e', '#2a2622'], note: 'Aile noire ou brun foncé, corps clair, hackle palmé.' },
      { n: 1, quoi: 'Mouche à corps orange vif et queue rouge', teintes: ['#f2761b', '#cf2b2b'], note: "La teinte la plus proche des orangées de la fiche." },
      { n: 1, quoi: 'Grosse mouche à aile de poil jaune vif', teintes: ['#f0c419', '#8a6b45'], note: 'Aile jaune franc au-dessus d\'un corps brun palmé.' },
      { n: 2, quoi: 'Mouches à aile blanche et flanc moucheté', teintes: ['#e8e4dc', '#8a7a5c'], note: 'Profil de noyée ou de petit streamer.' },
      { n: 1, quoi: 'Mouche à corps et collerette orange fluo', teintes: ['#ff6a13'], note: null },
      { n: 3, quoi: 'Mouches à corps de mousse noire, point orange', teintes: ['#17181c', '#f2761b'], note: 'Fourmi ou coléoptère — terrestres, hors du registre de la fiche.' },
      { n: 1, quoi: 'Mouche noire à hackle dense', teintes: ['#17181c'], note: null },
      { n: 3, quoi: 'Sèches à corps jaune, hackle et longues cerques', teintes: ['#f0d060', '#8a6b45'], note: null },
      { n: 3, quoi: 'Sèches rouges ou roses à hackle', teintes: ['#cf2b2b', '#e08a9a'], note: null },
      { n: 2, quoi: 'Sèches brun clair et crème', teintes: ['#d9c9a8'], note: null }
    ]
  },
  {
    id: 'fond',
    titre: 'Fond',
    image: 'assets/img/coffre-fond.jpg',
    familles: [
      { n: 6, quoi: 'Grands streamers à marabout et fibres brillantes', teintes: ['#6b7a2a', '#17181c', '#3ddc6a'], note: 'Olive, noir et chartreuse. La fiche les range sous « eau basse » comme solution de rechange.' },
      { n: 2, quoi: 'Bombers bruns à côtes jaune d\'or', teintes: ['#8a6b45', '#d9a520'], note: 'Poil de cerf brun, deux bandes jaunes marquées.' },
      { n: 2, quoi: 'Grosses mouches à aile blanche et tête filée', teintes: ['#e8e4dc', '#c9bfae'], note: 'Profil de Muddler.' },
      { n: 1, quoi: 'Mouche à hackle grizzly et fibres violettes', teintes: ['#8a8a8a', '#6b4a8a'], note: null },
      { n: 3, quoi: 'Mouches à aile grise ou blanche mouchetée', teintes: ['#c9c4bc', '#8a7a5c'], note: null },
      { n: 1, quoi: 'Petite mouche à corps orange', teintes: ['#f2761b'], note: null },
      { n: 1, quoi: 'Mouche noire à tête rouge', teintes: ['#17181c', '#cf2b2b'], note: null },
      { n: 1, quoi: 'Petite mouche chartreuse', teintes: ['#9acd32'], note: null },
      { n: 6, quoi: 'Petites sèches à hackle : grises, brunes, une à longues cerques', teintes: ['#9aa0a6', '#7a5a3a'], note: null }
    ]
  }
];

/* Les rapprochements que la photo autorise — et rien de plus.
 * Aucun n'est coché d'avance : ce sont des pistes à confirmer sur l'étau. */
const RAPPROCHEMENTS = [
  { mouche: 'Black Bear (green butt)', pourquoi: 'Le coffre contient des montages noirs à touche vert fluo, la signature du green butt.' },
  { mouche: 'Hot Orange', pourquoi: 'Une mouche à corps et collerette orange fluo est visible dans le couvercle.' },
  { mouche: 'Orange Blossom', pourquoi: 'Même famille orangée ; la photo ne permet pas de trancher entre les deux.' },
  { mouche: 'Godbout de cristal', pourquoi: 'Des montages à corps sombre brillant et plumet vert vif y ressemblent de loin.' }
];

const LECTURE_COFFRE = "L'essentiel de ce coffre est fait de Bombers, de streamers et de sèches — des montages que la fiche de Patrick Blanchet ne couvre pas, puisqu'elle traite des noyées classiques à aile de poil et de plume. Les recoupements possibles se comptent sur les doigts d'une main, et aucun n'est certain à partir d'une photo. D'où le principe de cet onglet : il vous montre ce qu'il voit, vous nommez.";

/* ─────────────── Troisième registre : le type d'eau ───────────────
 *
 * La fiche n'en dit rien. Absolument rien : c'est une fiche de rivière à
 * saumon, elle traite du niveau de l'eau et de la teinte, jamais du courant ni
 * des lacs. Aucune table n'a donc été inventée pour la combler.
 *
 * Ce registre est le vôtre. Aucun patron n'arrive marqué ; vous marquez les
 * vôtres au fil des sorties, et un patron non marqué n'est jamais écarté — il
 * est seulement rangé sous ceux que vous avez marqués.
 */
const TYPES_EAU = {
  calme: {
    libelle: 'Rivière calme',
    court: 'calme',
    note: "Fosse lente, courant faible. Le saumon voit la mouche longtemps et de près."
  },
  rapide: {
    libelle: 'Rivière rapide',
    court: 'rapide',
    note: "Courant vif, eau brisée. La mouche passe vite et se voit mal."
  },
  lac: {
    libelle: 'Lac',
    court: 'lac',
    note: "Hors du champ de la fiche, qui ne traite que des rivières à saumon."
  }
};
