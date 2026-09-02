# Divers

Petites applications web autonomes : elles tiennent dans un dossier, tournent
dans le navigateur, fonctionnent hors ligne et n'envoient rien nulle part.

**→ [Ouvrir la page d'accueil](https://pfrcharlespatrick-rgb.github.io/divers/)**

---

## Choisir sa mouche à saumon

**→ [Ouvrir l'application](https://pfrcharlespatrick-rgb.github.io/divers/mouches-saumon/)**

La fiche plastifiée de Patrick Blanchet, mise en application : trente et un
patrons de mouches à saumon, leur toilette, leur profil coloré, le registre du
niveau d'eau — et l'inventaire de votre propre coffre.

### Les quatre onglets

| Onglet | À quoi ça sert |
|---|---|
| **Choisir** | Trois registres : le niveau de l'eau donne une fenêtre de tailles, la teinte réduit la liste, le type d'eau fait remonter ce que vous pêchez là. Le résultat dit, pour chaque patron retenu, en quel numéro le monter aujourd'hui. |
| **Catalogue** | Les trente et un patrons, avec recherche par nom, par matériau ou par rivière. |
| **Mon coffre** | La photo de votre coffre, panneau par panneau, avec un relevé des familles de montage. Puis l'inventaire à cocher, qui sert ensuite de filtre. |
| **La fiche** | D'où viennent les données, ce que l'application déduit, et ce qu'elle refuse d'inventer. |

### Le profil coloré

Chaque fiche porte une bande de couleurs : une case par matériau nommé dans la
toilette, dans l'ordre du montage — ferret, plumet, queue, corps, collerette,
aile, tête. Touchez une case, elle vous dit quel matériau elle représente.

C'est un schéma, pas une photographie. Le lien **Voir des photographies** de
chaque fiche ouvre une recherche d'images pour voir la mouche réelle.

## Ce qui vient de la fiche, ce qui vient de l'application

Le PDF de Patrick Blanchet est la source unique. Rien n'a été complété depuis
ailleurs, et là où la fiche se tait, l'application se tait aussi.

**Repris tels quels :** les noms, les origines, les toilettes, les numéros
d'hameçon, les réserves de l'auteur, le registre du niveau d'eau et les sources
citées.

**Déduit du texte de la fiche, et signalé comme tel :**

- *Le profil coloré* — une relecture de la toilette écrite. Pas de toilette, pas
  de profil : neuf patrons régionaux restent sans bande.
- *La teinte* (sombre, argentée, vive, mixte) — tirée de la couleur du corps
  telle que la toilette la décrit. Même règle : pas de toilette, pas de teinte.
- *La fenêtre de tailles* — la fiche dit « petite », « moyenne », « grosse »
  sans chiffrer. L'application pose une échelle : petite = n° 10 à 16,
  moyenne = n° 6 à 8, grosse = n° 2 à 4.

**Volontairement absent :** la table qui associe le ciel à la teinte. La fiche
l'annonce (« touchez les conditions du jour »), mais le PDF fourni est une
impression : les boutons de conditions n'y ont pas survécu, et le tableau n'y
figure nulle part. Il n'a donc pas été reconstitué de mémoire. Le seul cas que
la fiche tranche noir sur blanc — eau haute et sale, teinte sombre — est câblé
dans l'application.

**Le vôtre, pas celui de la fiche :** le type d'eau — rivière calme, rivière
rapide, lac. La fiche n'en dit rien : elle ne traite que des rivières à saumon,
et jamais du courant ni des lacs. Aucune table n'a donc été inventée pour la
combler. Le registre part vide et se remplit de vos marques : sur chaque fiche,
trois étiquettes disent où vous pêchez ce patron. Il range les résultats, il
n'en écarte aucun — ce que vous n'avez pas marqué reste affiché en dessous.

**Non identifié :** les mouches de la photo. Une photo donne une famille de
montage, des teintes, une taille apparente. Elle ne donne pas un nom. L'onglet
*Mon coffre* décrit ce qu'il voit et vous laisse nommer ; les quatre
rapprochements proposés sont des pistes, aucune n'est cochée d'avance.

## Vos données

Tout est écrit dans la mémoire du navigateur (`localStorage`), sur votre
appareil. Pas de compte, pas de serveur, pas de traceur, aucune requête vers
l'extérieur. Vider les données du navigateur efface l'inventaire — d'où le
bouton **Sauvegarder mon coffre (.json)**, qui emporte aussi vos marques de
type d'eau.

Sur téléphone, « Ajouter à l'écran d'accueil » installe l'application. Une fois
ouverte, elle fonctionne sans réseau.

## Sous le capot

HTML, Tailwind CSS et JavaScript, sans cadre applicatif ni étape de compilation
à l'usage. La feuille de style **et les deux polices** sont construites et
livrées dans le dépôt : aucun CDN n'est appelé, aucune requête ne part vers
l'extérieur, et l'application démarre hors ligne dès qu'elle est en cache.

Les couleurs viennent du sujet : le vert-noir d'une rivière au crépuscule, le
blanc froid de la mousse alvéolée du coffre, et le rouge de la tête laquée qui
signe la série des Rat et la Cosseboom — le seul accent de l'interface, réservé
à ce que vous choisissez et à ce que l'application répond. Titres en Zilla Slab,
texte en Public Sans.

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
        ├── js/donnees.js         les trente et un patrons
        ├── js/app.js             la logique
        ├── img/                  la photo du coffre et ses deux panneaux
        └── icones/
```

### Refaire la feuille de style

Nécessaire seulement si vous modifiez les classes CSS dans `index.html` ou
`app.js` :

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
