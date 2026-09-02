/* Palette et typographie de « Choisir sa mouche à saumon ».
 *
 * Les trois familles viennent du sujet :
 *   riviere — le vert-noir d'une rivière gaspésienne au crépuscule ;
 *   papier  — le blanc froid de la mousse alvéolée du coffre ;
 *   laque   — le rouge de la tête laquée qui signe la série des Rat
 *             et la Cosseboom. C'est le seul accent ; il ne sert qu'à
 *             marquer ce que vous avez choisi et ce que l'application répond.
 */
const chemin = require('path');
const app = (f) => chemin.join(__dirname, '..', 'mouches-saumon', f);

module.exports = {
  // Résolus depuis ce fichier : la commande marche depuis n'importe où.
  content: [app('index.html'), app('assets/js/*.js')],

  /* Trois états de thème, pas deux : le réglage « système » ne pose aucune
     marque sur la racine, un choix explicite pose data-theme. Les deux
     variantes couvrent les trois cas sans qu'aucun ne l'emporte à tort. */
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) & }',
    ':root[data-theme="dark"] &'
  ]],
  theme: {
    extend: {
      colors: {
        riviere: { 50:'#f1f5f3',100:'#e2eae7',200:'#c4d6d0',300:'#9ab5ad',400:'#6d9086',500:'#4d6f66',600:'#35544c',700:'#2b423c',800:'#1f302c',900:'#16221f',950:'#0e1614' },
        papier:  { 50:'#f5f7f5',100:'#e9ede9',200:'#d8ded9',300:'#bcc6c0' },
        laque:   { 100:'#fae5e2',300:'#e29188',500:'#b3281c',600:'#962016',700:'#7a1a12' }
      },
      fontFamily: {
        titre: ['"Zilla Slab"','Rockwell','"Roboto Slab"','Georgia','serif'],
        texte: ['"Public Sans"','ui-sans-serif','system-ui','-apple-system','"Segoe UI"','Roboto','sans-serif']
      }
    }
  }
}
