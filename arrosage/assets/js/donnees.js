/* Contenu du guide HRC 100-C (modèle 04056, 6 stations) — tiré du manuel Hydro-Rain.
   Script classique, sans module : l'application s'ouvre aussi bien depuis un fichier local. */

const DONNEES = {};

DONNEES.boutons = [
  { id: 'enter', nom: 'ENTER / MANUAL', role: 'Confirme un réglage. En mode RUN, lance l’arrosage manuel.' },
  { id: 'clear', nom: 'CLEAR', role: 'Efface un réglage. Arrête un arrosage manuel ou un délai de pluie.' },
  { id: 'program', nom: 'PROGRAM', role: 'Passe d’un programme à l’autre : A, B, C.' },
  { id: 'gauche', nom: '◀', role: 'Réglage ou station précédente ; change AM/PM.' },
  { id: 'droite', nom: '▶', role: 'Réglage ou station suivante ; change AM/PM.' },
  { id: 'rain', nom: 'RAIN DELAY', role: 'Suspend l’arrosage 24, 48 ou 72 h.' },
  { id: 'plus', nom: '+', role: 'Augmente une valeur. Maintenir pour défiler vite.' },
  { id: 'moins', nom: '−  (TEST CYCLE)', role: 'Diminue une valeur. Après ENTER en mode RUN : lance le cycle de test.' },
  { id: 'reset', nom: 'RESET', role: 'Petit trou à gauche de l’écran. Efface toute la programmation.' }
];

DONNEES.cadran = [
  { id: 'OFF', nom: 'OFF', role: 'Tout est arrêté. Aucune station ne s’ouvre.' },
  { id: 'RUN', nom: 'RUN', role: 'Fonctionnement automatique du programme.' },
  { id: 'CLOCK', nom: 'SET CLOCK', role: 'Heure actuelle.' },
  { id: 'DATE', nom: 'SET DATE', role: 'Année, mois, jour.' },
  { id: 'START', nom: 'START TIME', role: 'Heure(s) de départ, jusqu’à 4 par programme.' },
  { id: 'RUNTIME', nom: 'RUN TIME', role: 'Durée d’arrosage de chaque station.' },
  { id: 'OFTEN', nom: 'HOW OFTEN', role: 'Fréquence : jours de la semaine, intervalle, pairs/impairs.' },
  { id: 'BUDGET', nom: 'BUDGET', role: 'Ajustement saisonnier de 10 % à 200 %.' }
];

DONNEES.guides = [
  { id: 'horloge', titre: 'Régler l’horloge et la date', duree: '2 min', etapes: [
    { t: 'Tournez le cadran sur SET CLOCK.', c: 'CLOCK', b: null, lcd: '12:00 AM' },
    { t: 'Appuyez sur + ou − pour régler l’heure. Maintenez pour défiler vite.', c: 'CLOCK', b: 'plus', lcd: '6:30 AM' },
    { t: 'Appuyez sur ◀ ou ▶ pour choisir AM ou PM.', c: 'CLOCK', b: 'droite', lcd: '6:30 PM' },
    { t: 'Tournez le cadran sur SET DATE. La lettre qui clignote indique ce que vous réglez : Y (année), M (mois), D (jour).', c: 'DATE', b: null, lcd: 'Y 2026' },
    { t: 'Réglez l’année avec + / −, puis ENTER. Même chose pour le mois, puis le jour.', c: 'DATE', b: 'enter', lcd: 'M 09  D 15' },
    { t: 'Tournez le cadran sur RUN pour valider.', c: 'RUN', b: null, lcd: '6:30 PM' }
  ]},
  { id: 'programme', titre: 'Programmer départs et durées', duree: '5 min', etapes: [
    { t: 'Appuyez sur PROGRAM jusqu’à voir la lettre du programme voulu (A pour la plupart des usages).', c: 'RUN', b: 'program', lcd: 'A' },
    { t: 'Tournez le cadran sur START TIME. Réglez la 1re heure de départ avec + / − (par pas de 15 min).', c: 'START', b: 'plus', lcd: 'A  1  5:00 AM' },
    { t: 'Appuyez sur ▶ pour un 2e, 3e ou 4e départ. Laissez vide (--:--) si un seul départ suffit.', c: 'START', b: 'droite', lcd: 'A  2  --:--' },
    { t: 'Tournez le cadran sur RUN TIME. Choisissez la station avec ◀ ▶ et sa durée avec + / −.', c: 'RUNTIME', b: 'plus', lcd: 'A  ST 1  15 MIN' },
    { t: 'ENTER ou ▶ passe à la station suivante. Réglez les zones 1 à 5 ; laissez la station 6 à 0 (non raccordée). Une station sans durée est ignorée.', c: 'RUNTIME', b: 'enter', lcd: 'A  ST 2  10 MIN' },
    { t: 'Tournez le cadran sur HOW OFTEN. Trois choix : jours de la semaine, intervalle (INT), jours pairs/impairs (ODD/EVEN).', c: 'OFTEN', b: null, lcd: 'A  MO TU WE TH FR SA SU' },
    { t: 'Jours : ◀ ▶ pour déplacer, + ou ENTER pour cocher un jour, − ou CLEAR pour le retirer.', c: 'OFTEN', b: 'enter', lcd: 'A  [MO] [WE] [FR]' },
    { t: 'Tournez le cadran sur RUN. C’est programmé.', c: 'RUN', b: null, lcd: '6:30 PM' }
  ]},
  { id: 'manuel', titre: 'Arrosage manuel', duree: '1 min', etapes: [
    { t: 'Le cadran doit être sur RUN.', c: 'RUN', b: null, lcd: '6:30 PM' },
    { t: 'Appuyez sur ENTER / MANUAL. L’écran affiche ABC et ALL : toutes les stations, pour leurs durées programmées.', c: 'RUN', b: 'enter', lcd: 'MANUAL  ABC  ALL' },
    { t: 'Pour une seule zone : appuyez sur ◀ ▶ jusqu’au numéro de la zone (1 à 5), dans les 5 secondes.', c: 'RUN', b: 'droite', lcd: 'MANUAL  ST 3' },
    { t: 'Réglez la durée avec + / − (1 à 240 min), puis ENTER.', c: 'RUN', b: 'plus', lcd: 'MANUAL  ST 3  5 MIN' },
    { t: 'La station démarre. CLEAR arrête l’arrosage ; le programme automatique reprend ensuite tout seul.', c: 'RUN', b: 'clear', lcd: 'ST 3  4:59' }
  ]},
  { id: 'test', titre: 'Cycle de test', duree: '1 min + test', etapes: [
    { t: 'Cadran sur RUN.', c: 'RUN', b: null, lcd: '6:30 PM' },
    { t: 'Appuyez sur ENTER / MANUAL, puis dans les 5 secondes sur − (marqué TEST CYCLE).', c: 'RUN', b: 'moins', lcd: 'MANUAL  ST A  2 MIN' },
    { t: 'L’écran montre MANUAL, STATION A (toutes) et 2 minutes par station. Ajustez avec + / −.', c: 'RUN', b: 'plus', lcd: 'MANUAL  ST A  3 MIN' },
    { t: 'ENTER lance le test : chaque station s’ouvre à tour de rôle. Faites le tour du terrain pour vérifier les têtes.', c: 'RUN', b: 'enter', lcd: 'ST 1  2:59' },
    { t: 'CLEAR interrompt. À la fin, le contrôleur revient au programme normal.', c: 'RUN', b: 'clear', lcd: '6:30 PM' }
  ]},
  { id: 'pluie', titre: 'Délai de pluie', duree: '30 s', etapes: [
    { t: 'Cadran sur RUN.', c: 'RUN', b: null, lcd: '6:30 PM' },
    { t: 'Appuyez sur RAIN DELAY : 24 h de pause par défaut.', c: 'RUN', b: 'rain', lcd: 'RAIN DELAY  24' },
    { t: '◀ ▶ pour 48 h ou 72 h. ENTER ou attendez 10 s.', c: 'RUN', b: 'droite', lcd: 'RAIN DELAY  48' },
    { t: 'L’écran alterne heure et heures restantes toutes les 2 s. CLEAR annule le délai ; sinon l’arrosage reprend seul à la fin.', c: 'RUN', b: 'clear', lcd: '47 HR' }
  ]},
  { id: 'budget', titre: 'Budget d’eau (saisonnier)', duree: '1 min', etapes: [
    { t: 'Tournez le cadran sur BUDGET. Appuyez sur PROGRAM pour choisir A, B ou C.', c: 'BUDGET', b: 'program', lcd: 'A  100 %' },
    { t: '+ / − de 10 % à 200 % par pas de 10. Exemple : 60 min à 50 % = 30 min pour chaque station.', c: 'BUDGET', b: 'moins', lcd: 'A  50 %' },
    { t: 'ENTER, puis cadran sur RUN. Le budget reste actif jusqu’à ce que vous le changiez.', c: 'RUN', b: 'enter', lcd: '6:30 PM' }
  ]},
  { id: 'abc', titre: 'Programmes A, B, C', duree: 'lecture', etapes: [
    { t: 'Un programme = un groupe de stations, des heures de départ et des durées. Les trois sont indépendants.', c: 'RUN', b: 'program', lcd: 'A' },
    { t: 'La plupart des jardins n’utilisent que A. B et C servent aux zones à besoins différents : goutte-à-goutte, gazon neuf, rotors.', c: 'RUN', b: 'program', lcd: 'B' },
    { t: 'Vérifiez toujours la lettre affichée avant de modifier un réglage : la modification s’applique au programme affiché.', c: 'START', b: 'program', lcd: 'C  1  --:--' },
    { t: 'Si deux programmes se chevauchent, le second attend la fin du premier (empilement).', c: 'RUN', b: null, lcd: '6:30 PM' }
  ]},
  { id: 'hiver', titre: 'Hivernage et remise en route', duree: 'saisonnier', etapes: [
    { t: 'Automne : tournez le cadran sur OFF. La programmation est conservée par la pile ; rien ne s’ouvre.', c: 'OFF', b: null, lcd: 'OFF' },
    { t: 'Faites purger les conduites (soufflage à l’air) par un professionnel avant le gel. Le contrôleur reste branché.', c: 'OFF', b: null, lcd: 'OFF' },
    { t: 'Printemps : rouvrez l’eau, vérifiez horloge et date (voir guide Horloge).', c: 'CLOCK', b: null, lcd: '6:30 PM' },
    { t: 'Lancez un cycle de test pour repérer les têtes cassées, puis cadran sur RUN.', c: 'RUN', b: 'moins', lcd: 'MANUAL  ST A  2 MIN' }
  ]},
  { id: 'pile', titre: 'Pile et câblage', duree: '5 min', etapes: [
    { t: 'Pile CR2032 (lithium), à droite du boîtier. Elle garde le programme en cas de panne de courant. Remplacez-la chaque année.', c: 'OFF', b: null, lcd: '' },
    { t: 'Faites glisser le tiroir vers la droite, insérez la pile côté + vers le haut, refermez.', c: 'OFF', b: null, lcd: '' },
    { t: 'La pile seule n’ouvre aucune vanne : le contrôleur doit être branché sur le 120 V.', c: 'OFF', b: null, lcd: '' },
    { t: 'Bornes : un fil commun (blanc) sur COMMON, un fil de couleur par zone (1 à 5 ; la borne 6 reste libre). SENSOR (jaune) pour un détecteur de pluie ; PUMP pour une vanne maîtresse.', c: 'OFF', b: null, lcd: '' },
    { t: 'Interrupteur capteur : sur ON sans détecteur branché, le contrôleur n’arrose pas. Mettez-le sur OFF.', c: 'OFF', b: null, lcd: '' }
  ]}
];

DONNEES.depannage = [
  { p: 'Une ou plusieurs stations ne s’ouvrent pas', c: ['Connexion du solénoïde défectueuse', 'Fil endommagé ou coupé', 'Vis de contrôle de débit fermée sur la vanne', 'Programmation incorrecte'] },
  { p: 'Des stations s’ouvrent au mauvais moment', c: ['Pression d’eau trop élevée', 'Plus d’une heure de départ programmée', 'AM/PM inversé'] },
  { p: 'Une station reste ouverte', c: ['Vanne défectueuse', 'Débris coincés dans la vanne', 'Membrane de vanne défectueuse'] },
  { p: 'Aucune station ne s’ouvre', c: ['Transformateur débranché ou défectueux', 'Programmation incorrecte', 'Interrupteur capteur sur ON sans détecteur'] },
  { p: 'Le contrôleur ne s’allume pas', c: ['Prise sans courant (vérifier le disjoncteur GFI)'] },
  { p: 'Programme perdu après une panne', c: ['Pile CR2032 faible ou absente. Remplacer, puis reprogrammer.', 'Sans programme, le mode de secours arrose chaque station 10 min par jour.'] }
];

DONNEES.fiche = [
  ['Modèle', 'HRC 100-C · nº 04056 · 6 stations'],
  ['Zones raccordées', 'Zones 1, 2, 3, 4, 5 · station 6 libre'],
  ['Alimentation', '120 V 60 Hz 0,2 A → 26 V 500 mA'],
  ['Charge max.', '250 mA par station, 500 mA total'],
  ['Programmes', 'A, B, C · 4 départs chacun'],
  ['Durée par station', '1 à 240 min'],
  ['Budget', '10 % à 200 % par pas de 10'],
  ['Pile', 'CR2032 lithium, ~1 an'],
  ['Boîtier', 'Type 3R, extérieur, verrouillable'],
  ['Assistance', 'Hydro-Rain 1-888-493-7672']
];

DONNEES.zones = [1, 2, 3, 4, 5].map((n) => ({ n, nom: 'Zone ' + n }));
