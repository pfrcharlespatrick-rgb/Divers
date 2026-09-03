/* Le coffre — ce que la photo montre, mouche par mouche.
 *
 * Chaque entrée décrit UNIQUEMENT ce qui se voit sur la photographie : une
 * famille de montage, une teinte dominante, une taille apparente, un volume de
 * silhouette, et la nage que cette silhouette permet. Aucun nom de patron n'est
 * avancé — une photo n'en donne pas, et en inventer un ferait choisir la
 * mauvaise mouche.
 *
 * `pan`, `cx`, `cy` situent la mouche dans le panneau, pour la pastille de
 * repérage sur la photo du coffre. Les coordonnées sont en pour-mille de la
 * largeur et de la hauteur du panneau, donc indépendantes de la résolution.
 *
 * famille : bomber · streamer · seche · noyee · terrestre
 * teinte  : sombre · naturel · clair · vive
 * taille  : grosse · moyenne · petite
 * volume  : etoffe · moyen · degarni
 * nage    : surface · entre-deux · fond
 */

const MOUCHES = [
  { id:'c01', pan:'couvercle', cx:144, cy:286, nom:"Bomber brun à ferret vert vif",        famille:'bomber',    teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c02', pan:'couvercle', cx:77,  cy:381, nom:"Streamer brun sombre à fibres brillantes", famille:'streamer', teinte:'sombre', taille:'grosse', volume:'etoffe', nage:'fond' },
  { id:'c03', pan:'couvercle', cx:219, cy:334, nom:"Bomber brun et blanc à ferret vert",   famille:'bomber',    teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c04', pan:'couvercle', cx:217, cy:181, nom:"Grosse sèche pâle ébouriffée",         famille:'bomber',    teinte:'clair',   taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c05', pan:'couvercle', cx:188, cy:443, nom:"Bomber très sombre à hackle noir",     famille:'bomber',    teinte:'sombre',  taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c06', pan:'couvercle', cx:178, cy:553, nom:"Bomber gris à collerette blanche",     famille:'bomber',    teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c07', pan:'couvercle', cx:130, cy:686, nom:"Bomber crème à touche verte",          famille:'bomber',    teinte:'clair',   taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c08', pan:'couvercle', cx:135, cy:829, nom:"Bomber brun à ferret vert et aile noire", famille:'bomber', teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c09', pan:'couvercle', cx:313, cy:281, nom:"Corps orange vif, queue rouge, aile mouchetée", famille:'noyee', teinte:'vive', taille:'moyenne', volume:'moyen', nage:'entre-deux' },
  { id:'c10', pan:'couvercle', cx:337, cy:353, nom:"Noyée à aile mouchetée",               famille:'noyee',     teinte:'naturel', taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'c11', pan:'couvercle', cx:385, cy:338, nom:"Bomber fauve à hackle et tête noire",  famille:'bomber',    teinte:'naturel', taille:'moyenne', volume:'etoffe',  nage:'surface' },
  { id:'c12', pan:'couvercle', cx:352, cy:467, nom:"Grosse fauve à aile noire",            famille:'noyee',     teinte:'vive',    taille:'grosse',  volume:'moyen',   nage:'entre-deux' },
  { id:'c13', pan:'couvercle', cx:347, cy:615, nom:"Orangée à longue aile noire",          famille:'noyee',     teinte:'vive',    taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'c14', pan:'couvercle', cx:539, cy:400, nom:"Noyée à aile blanche mouchetée",       famille:'noyee',     teinte:'clair',   taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'c15', pan:'couvercle', cx:530, cy:562, nom:"Aile blanche et jaune",                famille:'noyee',     teinte:'clair',   taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'c16', pan:'couvercle', cx:510, cy:234, nom:"Grosse à aile jaune vif",              famille:'noyee',     teinte:'vive',    taille:'grosse',  volume:'etoffe',  nage:'entre-deux' },
  { id:'c17', pan:'couvercle', cx:520, cy:810, nom:"Orange vif à hackle palmé",            famille:'seche',     teinte:'vive',    taille:'moyenne', volume:'etoffe',  nage:'surface' },
  { id:'c18', pan:'couvercle', cx:323, cy:815, nom:"Aile mouchetée claire",                famille:'noyee',     teinte:'clair',   taille:'moyenne', volume:'degarni', nage:'entre-deux' },
  { id:'c19', pan:'couvercle', cx:684, cy:262, nom:"Terrestre à corps de mousse noire",    famille:'terrestre', teinte:'sombre',  taille:'petite',  volume:'moyen',   nage:'surface' },
  { id:'c20', pan:'couvercle', cx:698, cy:438, nom:"Terrestre à corps de mousse noire",    famille:'terrestre', teinte:'sombre',  taille:'petite',  volume:'moyen',   nage:'surface' },
  { id:'c21', pan:'couvercle', cx:751, cy:334, nom:"Sèche à hackle jaune pâle",            famille:'seche',     teinte:'clair',   taille:'petite',  volume:'moyen',   nage:'surface' },
  { id:'c22', pan:'couvercle', cx:631, cy:600, nom:"Grosse noire à hackle très dense",     famille:'seche',     teinte:'sombre',  taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'c23', pan:'couvercle', cx:679, cy:734, nom:"Sèche à hackle rouge et noir",         famille:'seche',     teinte:'vive',    taille:'petite',  volume:'moyen',   nage:'surface' },
  { id:'c24', pan:'couvercle', cx:770, cy:715, nom:"Sèche à hackle rose",                  famille:'seche',     teinte:'vive',    taille:'petite',  volume:'moyen',   nage:'surface' },
  { id:'c25', pan:'couvercle', cx:838, cy:238, nom:"Sèche brune à longues cerques",        famille:'seche',     teinte:'naturel', taille:'moyenne', volume:'degarni', nage:'surface' },
  { id:'c26', pan:'couvercle', cx:847, cy:381, nom:"Sèche grise à hackle",                 famille:'seche',     teinte:'naturel', taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'c27', pan:'couvercle', cx:843, cy:505, nom:"Sèche gris et blanc",                  famille:'seche',     teinte:'clair',   taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'c28', pan:'couvercle', cx:835, cy:796, nom:"Crème à aile large",                   famille:'noyee',     teinte:'clair',   taille:'petite',  volume:'degarni', nage:'entre-deux' },

  { id:'f01', pan:'fond', cx:158, cy:173, nom:"Grand streamer noir à marabout",            famille:'streamer',  teinte:'sombre',  taille:'grosse',  volume:'etoffe',  nage:'fond' },
  { id:'f02', pan:'fond', cx:177, cy:301, nom:"Streamer noir et olive à brillant",         famille:'streamer',  teinte:'sombre',  taille:'grosse',  volume:'etoffe',  nage:'fond' },
  { id:'f03', pan:'fond', cx:163, cy:424, nom:"Streamer olive à corps vert brillant",      famille:'streamer',  teinte:'sombre',  taille:'grosse',  volume:'etoffe',  nage:'fond' },
  { id:'f04', pan:'fond', cx:206, cy:588, nom:"Streamer noir à corps vert vif",            famille:'streamer',  teinte:'vive',    taille:'grosse',  volume:'etoffe',  nage:'fond' },
  { id:'f05', pan:'fond', cx:144, cy:806, nom:"Streamer olive et jaune à marabout",        famille:'streamer',  teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'fond' },
  { id:'f06', pan:'fond', cx:369, cy:109, nom:"Aile blanche sur corps olive",              famille:'noyee',     teinte:'clair',   taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f07', pan:'fond', cx:405, cy:260, nom:"Olive et jaune à hackle palmé",             famille:'seche',     teinte:'naturel', taille:'moyenne', volume:'etoffe',  nage:'surface' },
  { id:'f08', pan:'fond', cx:460, cy:314, nom:"Fauve dorée à aile",                        famille:'noyee',     teinte:'naturel', taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f09', pan:'fond', cx:455, cy:505, nom:"Hackle grizzly et fibres violettes",        famille:'noyee',     teinte:'sombre',  taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f10', pan:'fond', cx:431, cy:679, nom:"Brune à aile grise",                        famille:'noyee',     teinte:'naturel', taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f11', pan:'fond', cx:410, cy:788, nom:"Brun-gris à hackle",                        famille:'seche',     teinte:'naturel', taille:'moyenne', volume:'moyen',   nage:'surface' },
  { id:'f12', pan:'fond', cx:642, cy:100, nom:"Grosse crème à tête de poil filé",          famille:'streamer',  teinte:'clair',   taille:'grosse',  volume:'etoffe',  nage:'entre-deux' },
  { id:'f13', pan:'fond', cx:825, cy:118, nom:"Petite orange vif",                         famille:'noyee',     teinte:'vive',    taille:'petite',  volume:'degarni', nage:'entre-deux' },
  { id:'f14', pan:'fond', cx:829, cy:228, nom:"Noire à tag rouge",                         famille:'noyee',     teinte:'sombre',  taille:'petite',  volume:'degarni', nage:'entre-deux' },
  { id:'f15', pan:'fond', cx:844, cy:323, nom:"Petite chartreuse",                         famille:'noyee',     teinte:'vive',    taille:'petite',  volume:'degarni', nage:'entre-deux' },
  { id:'f16', pan:'fond', cx:599, cy:446, nom:"Bomber brun à bande jaune d'or",            famille:'bomber',    teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'f17', pan:'fond', cx:594, cy:588, nom:"Bomber brun à bande jaune d'or",            famille:'bomber',    teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' },
  { id:'f18', pan:'fond', cx:693, cy:460, nom:"Aile blanche et hackle",                    famille:'noyee',     teinte:'clair',   taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f19', pan:'fond', cx:844, cy:469, nom:"Sèche gris et blanc",                       famille:'seche',     teinte:'clair',   taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'f20', pan:'fond', cx:844, cy:583, nom:"Sèche gris et blanc",                       famille:'seche',     teinte:'clair',   taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'f21', pan:'fond', cx:681, cy:683, nom:"Aile sombre violacée",                      famille:'noyee',     teinte:'sombre',  taille:'moyenne', volume:'moyen',   nage:'entre-deux' },
  { id:'f22', pan:'fond', cx:853, cy:683, nom:"Sèche brun-rouge",                          famille:'seche',     teinte:'naturel', taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'f23', pan:'fond', cx:858, cy:779, nom:"Sèche brun-rouge",                          famille:'seche',     teinte:'naturel', taille:'petite',  volume:'degarni', nage:'surface' },
  { id:'f24', pan:'fond', cx:681, cy:824, nom:"Grosse sèche brune à longues cerques",      famille:'seche',     teinte:'naturel', taille:'grosse',  volume:'etoffe',  nage:'surface' }
];

const PANNEAUX = {
  couvercle: { titre: 'Couvercle', image: 'assets/img/coffre-couvercle.jpg' },
  fond:      { titre: 'Fond',      image: 'assets/img/coffre-fond.jpg' }
};

const FAMILLES = {
  bomber:    { libelle: 'Bomber',    quoi: "Grosse sèche en poil de cerf, corps fuselé, hackle palmé. Flotte haut et laisse un sillage." },
  streamer:  { libelle: 'Streamer',  quoi: "Longue mouche à marabout ou à poil, ramenée par saccades. Imite un petit poisson." },
  seche:     { libelle: 'Sèche',     quoi: "Se pêche en surface, en dérive libre." },
  noyee:     { libelle: 'Noyée',     quoi: "Aile de poil ou de plume, pêchée sous la surface, en travers du courant." },
  terrestre: { libelle: 'Terrestre', quoi: "Fourmi ou coléoptère en mousse. Flotte bas, silhouette compacte." }
};

const TEINTES = {
  sombre:  { libelle: 'sombre',  puce: '#17181c' },
  naturel: { libelle: 'naturelle', puce: '#8a6b45' },
  clair:   { libelle: 'claire',  puce: '#ddd8cc' },
  vive:    { libelle: 'vive',    puce: '#e8590c' }
};
