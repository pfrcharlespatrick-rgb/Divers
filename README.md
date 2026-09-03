# Divers

Petites applications web autonomes : elles tiennent dans un dossier, tournent
dans le navigateur, fonctionnent hors ligne et n'envoient rien nulle part.

**→ [Ouvrir la page d'accueil](https://pfrcharlespatrick-rgb.github.io/Divers/)**

---

## Ma mouche du jour

**→ [Ouvrir l'application](https://pfrcharlespatrick-rgb.github.io/Divers/mouches-saumon/)**

Vous donnez les conditions du jour. L'application sort de **votre** coffre la
mouche qui convient — en photographie, avec la manière de la pêcher et l'endroit
exact où la trouver dans la boîte.

### Les quatre onglets

| Onglet | À quoi ça sert |
|---|---|
| **Le jour** | Quatre questions — où, le ciel, l'eau, ça monte ou non — et la mouche du jour, en photo. Plus deux solutions de rechange, la manière de la pêcher, et les conseils que ces conditions appellent. |
| **Mon coffre** | Les 52 mouches, découpées une à une dans votre photographie. Décochez celles que vous n'avez plus : elles sortent des conseils. |
| **La fiche** | Les 31 patrons du PDF de Patrick Blanchet, avec leur toilette et leur profil coloré. Votre document d'origine, conservé entier. |
| **D'où ça vient** | Ce qui est repris, ce qui est observé, ce qui est déduit. |

### La mouche du jour

Le résultat n'est pas une liste, c'est **une** mouche, en grand :

- **la photographie** de la vôtre, découpée dans l'image du coffre ;
- **pourquoi elle** — quels caractères la font gagner dans ces conditions ;
- **comment la pêcher** — la manière propre à sa famille de montage ;
- **où la trouver** — un cercle rouge posé sur la photo du panneau.

Suivent deux solutions de rechange, puis les conseils du jour : dérive,
approche, profondeur, lecture de l'eau.

Et, quand les conditions réclament quelque chose que le coffre n'a pas, l'onglet
le dit et propose comment y suppléer — allonger le bas de ligne, ralentir la
dérive, dégarnir un hackle. Vous n'avez que ces mouches-là ; l'application ne
fait jamais semblant du contraire.

## Trois origines, à ne pas confondre

**1. Votre fiche — reprise mot pour mot.** Noms, origines, toilettes, numéros
d'hameçon, réserves de l'auteur, sources citées. Rien n'y a été ajouté.

Ce que le PDF **ne contient pas** : la table qui relie les conditions du jour aux
patrons. La fiche l'annonce en tête (« touchez les conditions du jour »), mais le
fichier est l'*impression* d'une page interactive : les boutons de conditions ne
se sont pas imprimés, et le tableau n'apparaît sur aucune des sept pages —
vérifié page par page, en image et non seulement en texte.

**2. Votre coffre — ce que la photo montre.** Les 52 mouches ont été découpées
dans votre photographie. Chacune est décrite par ce qui se voit : famille de
montage, teinte dominante, taille apparente, volume de la silhouette, et la nage
que cette silhouette permet. **Aucun nom de patron n'est avancé** — une photo n'en
donne pas, et un nom inventé ferait sortir la mauvaise mouche.

**3. Les conseils — principes généraux.** Le classement et les conseils viennent
des principes généraux de la pêche à la mouche, pas de la fiche : la silhouette
prime quand la lumière baisse, on descend en taille quand l'eau est basse et
claire, on descend en profondeur quand rien ne monte, la silhouette compte plus
que la couleur en eau teintée. Des principes, pas des certitudes.

## Vos données

Tout est écrit dans la mémoire du navigateur (`localStorage`), sur votre
appareil. Pas de compte, pas de serveur, pas de traceur, aucune requête vers
l'extérieur. Le bouton **Sauvegarder mes réglages** produit un `.json` à
conserver.

Sur téléphone, « Ajouter à l'écran d'accueil » installe l'application. Une fois
ouverte, elle fonctionne sans réseau — les 52 photographies comprises.

## Sous le capot

HTML, Tailwind CSS et JavaScript, sans cadre applicatif ni étape de compilation
à l'usage. La feuille de style, les deux polices et toutes les images sont
livrées dans le dépôt : aucun CDN, aucune requête sortante.

Les couleurs viennent du sujet : le vert-noir d'une rivière au crépuscule, le
blanc froid de la mousse alvéolée du coffre, et le rouge de la tête laquée qui
signe la série des Rat — le seul accent, réservé à ce que vous choisissez et à ce
que l'application répond. Titres en Zilla Slab, texte en Public Sans.

```
divers/
├── index.html                    page d'accueil
├── outils/                       config de compilation de la feuille de style
└── mouches-saumon/
    ├── index.html                l'application
    ├── sw.js                     service worker (mode hors ligne)
    ├── manifest.webmanifest      installation sur l'écran d'accueil
    ├── fiche-source.pdf          la fiche d'origine, conservée
    └── assets/
        ├── css/app.css           Tailwind compilé
        ├── polices/              Zilla Slab et Public Sans, en woff2
        ├── js/coffre.js          les 52 mouches et leurs caractères observés
        ├── js/conditions.js      les registres et le moteur de conseil
        ├── js/fiche.js           les 31 patrons du PDF
        ├── js/app.js             l'interface
        ├── img/mouches/          les 52 gros plans
        ├── img/coffre-*.jpg      les deux panneaux
        └── icones/
```

### Refaire la feuille de style

Nécessaire seulement si vous modifiez les classes CSS dans `index.html` ou dans
les fichiers `js` :

```sh
cd outils
npx tailwindcss@3 -c tailwind.config.js -i entree.css \
  -o ../mouches-saumon/assets/css/app.css --minify
```

## Sources

Fiche *Choisir sa mouche à saumon*, de Patrick Blanchet (conservée dans
`mouches-saumon/fiche-source.pdf`).

Toilettes vérifiées pour la Silver Rat, la Rusty Rat, la Cosseboom, la Godbout
et la Black Dose d'après Frédéric Lévesque, *Salmo Salar* n° 16, avril 1989,
repris par Fabri-Mouches.ca. Origine de la Pompier d'après Pierre Saumur, même
source.
