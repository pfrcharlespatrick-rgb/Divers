/* Choisir sa mouche à saumon — logique de l'application.
 * Aucune donnée n'est produite ici : tout vient de donnees.js, qui vient de la fiche. */

'use strict';

const CLE = 'coffre-mouches-saumon.v1';

const etat = {
  vue: 'choisir',
  niveau: 'normale',
  clarte: 'claire',
  teintes: new Set(),
  filtreCoffre: false,
  recherche: '',
  coffre: new Set(),
  typeEau: null,          // null = tous les types
  marques: new Map()      // nom de mouche → Set de types d'eau, marqués par vous
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const echappe = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ─────────────── Mémoire de l'appareil ─────────────── */

function charge() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return;
    const d = JSON.parse(brut);
    etat.coffre = new Set(d.coffre || []);
    for (const [nom, types] of Object.entries(d.marques || {})) {
      etat.marques.set(nom, new Set(types));
    }
  } catch (e) { /* mémoire indisponible : on continue sans */ }
}

function enregistre() {
  try {
    localStorage.setItem(CLE, JSON.stringify({ version: 2, coffre: [...etat.coffre], marques: marquesEnObjet() }));
  } catch (e) { /* navigation privée, quota : on continue sans */ }
}

/* Les marques du troisième registre, sous une forme que JSON accepte. */
function marquesEnObjet() {
  const o = {};
  for (const [nom, types] of etat.marques) if (types.size) o[nom] = [...types];
  return o;
}

function estMarquee(mouche, type) {
  const types = etat.marques.get(mouche.nom);
  return Boolean(types && types.has(type));
}

/* ─────────────── Tailles ─────────────── */

/* Un numéro d'hameçon décroît quand la mouche grossit : le n° 2 est gros,
   le n° 16 est petit. Les intervalles sont donc écrits [gros, petit]. */
function tailleCompatible(mouche, fenetre) {
  if (!mouche.hamecon) return null;                 // la fiche ne dit rien
  const [gros, petit] = mouche.hamecon;
  const [fGros, fPetit] = fenetre;
  return petit >= fGros && gros <= fPetit;
}

function taillesRetenues(mouche, fenetre) {
  if (!mouche.hamecon) return null;
  const gros = Math.max(mouche.hamecon[0], fenetre[0]);
  const petit = Math.min(mouche.hamecon[1], fenetre[1]);
  return gros <= petit ? [gros, petit] : null;
}

/* ─────────────── Sélection ─────────────── */

function selection() {
  const niveau = NIVEAUX[etat.niveau];
  const eauSale = etat.niveau === 'haute' && etat.clarte === 'sale';
  const teintesVoulues = eauSale ? new Set(['sombre']) : etat.teintes;

  const retenues = [];
  const ecartees = [];

  for (const m of MOUCHES) {
    if (etat.filtreCoffre && !etat.coffre.has(m.nom)) continue;

    const raisons = [];

    // Registre de l'eau
    const compat = tailleCompatible(m, niveau.fenetre);
    const nommeeEauBasse = etat.niveau === 'basse' && m.eauBasse;
    if (compat === false && !nommeeEauBasse) continue;
    if (compat === null && !nommeeEauBasse) raisons.push("la fiche ne donne pas de numéro d'hameçon");

    // Registre de la teinte
    if (teintesVoulues.size) {
      if (!m.teinte) raisons.push('la fiche ne donne pas de toilette, donc pas de teinte');
      else if (!teintesVoulues.has(m.teinte)) continue;
    }

    // Registre du type d'eau : il ne retire personne, il fait remonter les
    // patrons que vous avez marqués. Un patron non marqué reste disponible.
    const marquee = etat.typeEau ? estMarquee(m, etat.typeEau) : false;

    (raisons.length ? ecartees : retenues).push({ m, raisons, nommeeEauBasse, marquee });
  }

  return { retenues, ecartees, eauSale, niveau };
}

/* ─────────────── Rendu d'une fiche ─────────────── */

function badgeReserve(m) {
  if (m.reserve === 'non-verifiee') return '<span class="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">toilette non vérifiée</span>';
  if (m.reserve === 'courant') return '<span class="rounded bg-riviere-100 px-1.5 py-0.5 text-xs font-medium text-riviere-700 dark:bg-riviere-800 dark:text-riviere-200">montage courant</span>';
  if (m.reserve === 'sans-toilette') return '<span class="rounded bg-riviere-100 px-1.5 py-0.5 text-xs font-medium text-riviere-700 dark:bg-riviere-800 dark:text-riviere-200">sans toilette</span>';
  if (m.verifiee) return '<span class="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">toilette vérifiée</span>';
  return '';
}

function profilHtml(m) {
  if (!m.profil) {
    return '<div class="mt-2.5 flex h-7 items-center justify-center rounded border border-dashed border-riviere-300 text-xs text-riviere-500 dark:border-riviere-700 dark:text-riviere-400">pas de toilette écrite, donc pas de profil</div>';
  }
  const bandes = m.profil.map((p) =>
    `<button type="button" class="bande flex-1 outline-none focus-visible:ring-2 focus-visible:ring-laque-500" style="background:${p.c}" title="${echappe(p.l)}" aria-label="${echappe(p.l)}" data-libelle="${echappe(p.l)}"></button>`
  ).join('');
  return `<div class="mt-2.5"><div class="flex h-7 overflow-hidden rounded ring-1 ring-black/10 dark:ring-white/15">${bandes}</div>
    <p class="mt-1 min-h-[1.1rem] text-xs italic text-riviere-500 dark:text-riviere-400" data-role="legende">Touchez une bande pour lire le matériau.</p></div>`;
}

function lienPhotos(m) {
  const q = encodeURIComponent(`mouche à saumon "${m.nom}" fly`);
  return `<a href="https://duckduckgo.com/?iax=images&ia=images&q=${q}" target="_blank" rel="noopener noreferrer"
    class="sans-impression inline-flex items-center gap-1 text-sm font-medium text-laque-600 hover:underline dark:text-laque-300">Voir des photographies <span aria-hidden="true">↗</span></a>`;
}

function ficheHtml(m, extra = {}) {
  const coche = etat.coffre.has(m.nom);
  const tailles = extra.fenetre ? taillesRetenues(m, extra.fenetre) : null;

  return `<article class="fiche-mouche rounded-xl border border-riviere-200 bg-white p-4 dark:border-riviere-800 dark:bg-riviere-900">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="min-w-0">
        <h3 class="font-titre text-lg leading-tight">${echappe(m.nom)}</h3>
        ${m.origine ? `<p class="text-sm text-riviere-600 dark:text-riviere-300">${echappe(m.origine)}</p>` : ''}
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-1.5">${badgeReserve(m)}</div>
    </div>

    ${profilHtml(m)}

    ${m.toilette ? `<p class="mt-3 text-sm leading-relaxed text-riviere-800 dark:text-papier-200">${echappe(m.toilette)}</p>` : ''}
    ${m.note ? `<p class="mt-2 text-sm italic leading-relaxed text-riviere-600 dark:text-riviere-300">${echappe(m.note)}</p>` : ''}
    ${!m.toilette && !m.note ? `<p class="mt-3 text-sm italic text-riviere-600 dark:text-riviere-300">Patron régional dont la fiche n'a pu vérifier la toilette dans une source fiable. Fiez-vous aux photographies.</p>` : ''}

    <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      ${m.hamecon ? `<span class="text-riviere-700 dark:text-riviere-300">Hameçon n° ${m.hamecon[0]} à ${m.hamecon[1]}</span>` : ''}
      ${tailles ? `<span class="rounded bg-laque-100 px-2 py-0.5 text-xs font-medium text-laque-700 dark:bg-laque-700/25 dark:text-laque-300">ici : n° ${tailles[0]} à ${tailles[1]}</span>` : ''}
      ${extra.nommeeEauBasse ? `<span class="rounded bg-laque-100 px-2 py-0.5 text-xs font-medium text-laque-700 dark:bg-laque-700/25 dark:text-laque-300">nommée par la fiche pour l'eau basse</span>` : ''}
      ${lienPhotos(m)}
    </div>

    ${extra.raisons && extra.raisons.length ? `<p class="mt-2 text-xs text-amber-700 dark:text-amber-300">Retenue sous réserve : ${extra.raisons.map(echappe).join(' ; ')}.</p>` : ''}

    <div class="sans-impression mt-3 space-y-2 border-t border-riviere-100 pt-3 dark:border-riviere-800">
      <label class="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" class="h-4 w-4 accent-laque-500" data-coffre="${echappe(m.nom)}" ${coche ? 'checked' : ''}>
        <span>Je l'ai dans mon coffre</span>
      </label>
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-xs text-riviere-500 dark:text-riviere-400">Je la pêche en&nbsp;:</span>
        ${Object.entries(TYPES_EAU).map(([cle, t]) => `<button type="button"
            class="etiquette rounded-full border border-riviere-200 px-2.5 py-1 text-xs transition dark:border-riviere-700"
            data-marque="${cle}" data-mouche="${echappe(m.nom)}"
            aria-pressed="${estMarquee(m, cle)}">${echappe(t.libelle.toLowerCase())}</button>`).join('')}
      </div>
    </div>
  </article>`;
}

/* ─────────────── Onglet « Choisir » ─────────────── */

function rendChoix() {
  $('#choix-niveau').innerHTML = Object.entries(NIVEAUX).map(([cle, n]) =>
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-2 py-3 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-niveau="${cle}" aria-pressed="${etat.niveau === cle}">${echappe(n.titre.replace('Eau ', ''))}</button>`
  ).join('');

  $('#choix-clarte').innerHTML = [['claire', 'Claire'], ['sale', 'Sale']].map(([cle, lib]) =>
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-2 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-clarte="${cle}" aria-pressed="${etat.clarte === cle}">${lib}</button>`
  ).join('');

  const boutonsTeinte = Object.entries(TEINTES).map(([cle, t]) =>
    `<button type="button" class="choix flex items-center gap-2 rounded-lg border-2 border-riviere-200 bg-white px-3 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-teinte="${cle}" aria-pressed="${etat.teintes.has(cle)}" title="${echappe(t.desc)}">
       <span class="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/20 dark:ring-white/25" style="background:${t.puce}"></span>${echappe(t.libelle)}</button>`
  ).join('');
  $('#choix-type').innerHTML = Object.entries(TYPES_EAU).map(([cle, t]) =>
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-3 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-type="${cle}" aria-pressed="${etat.typeEau === cle}">${echappe(t.libelle)}</button>`
  ).join('') +
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-3 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-type="tous" aria-pressed="${etat.typeEau === null}">Tous</button>`;

  $('#choix-teinte').innerHTML = boutonsTeinte +
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-3 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-teinte="toutes" aria-pressed="${etat.teintes.size === 0}">Toutes</button>`;
}

function rendResultats() {
  const { retenues, ecartees, eauSale, niveau } = selection();

  $('#texte-niveau').innerHTML =
    `<strong class="font-medium">${echappe(niveau.titre)}.</strong> ${echappe(niveau.fiche)}
     <span class="mt-1 block text-xs text-riviere-500 dark:text-riviere-400">Lecture de l'application : n° ${niveau.fenetre[0]} à ${niveau.fenetre[1]} (${echappe(niveau.fenetreTexte)}).</span>`;

  const blocClarte = $('#bloc-clarte');
  blocClarte.hidden = etat.niveau !== 'haute';
  $('#texte-clarte').textContent = eauSale
    ? "La fiche tranche ce cas : eau haute et sale, teinte sombre. La sélection est forcée sur les patrons sombres."
    : '';

  $('#compte-coffre').textContent = etat.coffre.size ? `(${etat.coffre.size})` : '(vide)';
  const marquees = etat.typeEau ? retenues.filter((r) => r.marquee).length : 0;
  $('#compte-resultats').textContent = etat.typeEau
    ? `${marquees} marqué${marquees > 1 ? 's' : ''} sur ${retenues.length} retenu${retenues.length > 1 ? 's' : ''}`
    : `${retenues.length} retenu${retenues.length > 1 ? 's' : ''}`;

  $('#texte-type').textContent = etat.typeEau ? TYPES_EAU[etat.typeEau].note : '';

  const fenetre = niveau.fenetre;
  const carte = ({ m, nommeeEauBasse }) => ficheHtml(m, { fenetre, nommeeEauBasse });

  let html;
  if (!retenues.length) {
    html = `<p class="rounded-lg border border-dashed border-riviere-300 p-6 text-center text-sm text-riviere-500 dark:border-riviere-700 dark:text-riviere-400">Aucun patron ne répond à ces conditions. Élargissez la teinte, ou décochez le filtre du coffre.</p>`;
  } else if (etat.typeEau) {
    // Le type d'eau range en deux tas, il n'en jette aucun.
    const t = TYPES_EAU[etat.typeEau];
    const miennes = retenues.filter((r) => r.marquee);
    const autres = retenues.filter((r) => !r.marquee);
    const titre = (txt, n) => `<h3 class="mt-1 flex items-baseline justify-between gap-3 font-titre text-base">
        <span>${txt}</span><span class="font-texte text-sm font-normal tabular-nums text-riviere-500 dark:text-riviere-400">${n}</span></h3>`;

    html = miennes.length
      ? titre(`Ce que vous pêchez en ${echappe(t.libelle.toLowerCase())}`, miennes.length) +
        `<div class="mt-2 space-y-3">${miennes.map(carte).join('')}</div>`
      : `<p class="rounded-lg border border-dashed border-laque-300 p-4 text-sm text-riviere-700 dark:border-laque-700 dark:text-riviere-300">
           Vous n'avez encore marqué aucun patron pour « ${echappe(t.libelle.toLowerCase())} ».
           Sur chaque fiche ci-dessous, l'étiquette <em>${echappe(t.libelle.toLowerCase())}</em> le fait entrer ici.</p>`;

    if (autres.length) {
      html += titre('Les autres, non marqués', autres.length) +
        `<div class="mt-2 space-y-3">${autres.map(carte).join('')}</div>`;
    }
  } else {
    html = retenues.map(carte).join('');
  }

  if (ecartees.length) {
    html += `<details class="sans-impression rounded-xl border border-dashed border-riviere-300 p-4 dark:border-riviere-700">
      <summary class="cursor-pointer text-sm font-medium">${ecartees.length} patron${ecartees.length > 1 ? 's' : ''} que la fiche ne permet pas de trancher</summary>
      <p class="mt-2 text-sm text-riviere-600 dark:text-riviere-300">Ils ne sont ni retenus ni écartés : la fiche ne dit pas assez pour décider. Fiez-vous aux photographies.</p>
      <div class="mt-3 space-y-3">${ecartees.map(({ m, raisons, nommeeEauBasse }) => ficheHtml(m, { fenetre, raisons, nommeeEauBasse })).join('')}</div>
    </details>`;
  }

  $('#resultats').innerHTML = html;
}

/* ─────────────── Onglet « Catalogue » ─────────────── */

function rendCatalogue() {
  const q = etat.recherche.trim().toLowerCase();
  const liste = q
    ? MOUCHES.filter((m) => [m.nom, m.origine, m.toilette, m.note].filter(Boolean).join(' ').toLowerCase().includes(q))
    : MOUCHES;

  $('#catalogue').innerHTML = liste.length
    ? liste.map((m) => ficheHtml(m)).join('')
    : `<p class="rounded-lg border border-dashed border-riviere-300 p-6 text-center text-sm text-riviere-500 dark:border-riviere-700 dark:text-riviere-400">Rien ne correspond à « ${echappe(etat.recherche)} ».</p>`;
}

/* ─────────────── Onglet « Mon coffre » ─────────────── */

function rendCoffre() {
  $('#lecture-coffre').textContent = LECTURE_COFFRE;

  $('#panneaux').innerHTML = COFFRE.map((p) => {
    const total = p.familles.reduce((s, f) => s + f.n, 0);
    const lignes = p.familles.map((f) => `
      <li class="flex gap-3 border-t border-riviere-100 py-2.5 first:border-0 first:pt-0 dark:border-riviere-800">
        <span class="mt-0.5 w-7 shrink-0 text-right font-titre text-base tabular-nums text-laque-600 dark:text-laque-300">${f.n}</span>
        <span class="mt-1.5 flex shrink-0 gap-0.5">${f.teintes.map((c) => `<span class="h-3 w-3 rounded-sm ring-1 ring-black/15 dark:ring-white/20" style="background:${c}"></span>`).join('')}</span>
        <span class="min-w-0">
          <span class="block text-sm">${echappe(f.quoi)}</span>
          ${f.note ? `<span class="block text-xs text-riviere-500 dark:text-riviere-400">${echappe(f.note)}</span>` : ''}
        </span>
      </li>`).join('');

    return `<div class="overflow-hidden rounded-xl border border-riviere-200 bg-white dark:border-riviere-800 dark:bg-riviere-900">
      <img src="${p.image}" alt="Panneau « ${echappe(p.titre)} » du coffre" loading="lazy" class="w-full">
      <div class="p-4">
        <h3 class="font-titre text-base">${echappe(p.titre)} <span class="font-texte text-sm font-normal text-riviere-500 dark:text-riviere-400">— environ ${total} mouches</span></h3>
        <ul class="mt-2">${lignes}</ul>
      </div>
    </div>`;
  }).join('');

  $('#rapprochements').innerHTML = RAPPROCHEMENTS.map((r) => {
    const coche = etat.coffre.has(r.mouche);
    return `<label class="flex cursor-pointer items-start gap-3 rounded-lg border border-riviere-200 bg-white p-3 dark:border-riviere-800 dark:bg-riviere-900">
      <input type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-laque-500" data-coffre="${echappe(r.mouche)}" ${coche ? 'checked' : ''}>
      <span class="min-w-0">
        <span class="block text-sm font-medium">${echappe(r.mouche)}</span>
        <span class="block text-sm text-riviere-600 dark:text-riviere-300">${echappe(r.pourquoi)}</span>
      </span>
    </label>`;
  }).join('');

  $('#inventaire').innerHTML = MOUCHES.map((m) => {
    const coche = etat.coffre.has(m.nom);
    return `<label class="flex cursor-pointer items-center gap-2.5 rounded-lg border border-riviere-200 bg-white px-3 py-2 text-sm dark:border-riviere-800 dark:bg-riviere-900">
      <input type="checkbox" class="h-4 w-4 shrink-0 accent-laque-500" data-coffre="${echappe(m.nom)}" ${coche ? 'checked' : ''}>
      <span class="truncate">${echappe(m.nom)}</span>
    </label>`;
  }).join('');
}

/* ─────────────── Navigation ─────────────── */

function montre(vue) {
  etat.vue = vue;
  for (const b of $$('.onglet')) {
    const actif = b.id === `t-${vue}`;
    b.setAttribute('aria-selected', String(actif));
    $(`#${b.getAttribute('aria-controls')}`).hidden = !actif;
  }
  if (vue === 'choisir') rendResultats();
  if (vue === 'catalogue') rendCatalogue();
  if (vue === 'coffre') rendCoffre();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─────────────── Sauvegarde ─────────────── */

function sauvegarde() {
  const contenu = JSON.stringify({ application: 'choisir-sa-mouche-a-saumon', version: 2, date: new Date().toISOString(), coffre: [...etat.coffre], marques: marquesEnObjet() }, null, 2);
  const blob = new Blob([contenu], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mon-coffre-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  message(`${etat.coffre.size} patron(s) sauvegardé(s).`);
}

function restaure(fichier) {
  const lecteur = new FileReader();
  lecteur.onload = () => {
    try {
      const donnees = JSON.parse(lecteur.result);
      if (!Array.isArray(donnees.coffre)) throw new Error('format');
      const connus = new Set(MOUCHES.map((m) => m.nom));
      const gardes = donnees.coffre.filter((n) => connus.has(n));
      etat.coffre = new Set(gardes);
      etat.marques = new Map();
      for (const [nom, types] of Object.entries(donnees.marques || {})) {
        if (connus.has(nom)) etat.marques.set(nom, new Set(types.filter((t) => t in TYPES_EAU)));
      }
      enregistre();
      rendCoffre(); rendResultats();
      const ignores = donnees.coffre.length - gardes.length;
      message(`${gardes.length} patron(s) restauré(s)${ignores ? `, ${ignores} nom(s) inconnu(s) ignoré(s)` : ''}.`);
    } catch (e) {
      message("Ce fichier n'est pas une sauvegarde de cette application.");
    }
  };
  lecteur.readAsText(fichier);
}

let minuteurMessage;
function message(txt) {
  const el = $('#message-coffre');
  el.textContent = txt;
  clearTimeout(minuteurMessage);
  minuteurMessage = setTimeout(() => { el.textContent = ''; }, 6000);
}

/* ─────────────── Écoute ─────────────── */

function branche() {
  for (const b of $$('.onglet')) {
    b.addEventListener('click', () => montre(b.id.slice(2)));
  }

  document.addEventListener('click', (ev) => {
    const niveau = ev.target.closest('[data-niveau]');
    if (niveau) { etat.niveau = niveau.dataset.niveau; rendChoix(); rendResultats(); return; }

    const clarte = ev.target.closest('[data-clarte]');
    if (clarte) { etat.clarte = clarte.dataset.clarte; rendChoix(); rendResultats(); return; }

    const teinte = ev.target.closest('[data-teinte]');
    if (teinte) {
      const t = teinte.dataset.teinte;
      if (t === 'toutes') etat.teintes.clear();
      else etat.teintes.has(t) ? etat.teintes.delete(t) : etat.teintes.add(t);
      rendChoix(); rendResultats();
      return;
    }

    const type = ev.target.closest('[data-type]');
    if (type) {
      etat.typeEau = type.dataset.type === 'tous' ? null : type.dataset.type;
      rendChoix(); rendResultats();
      return;
    }

    const marque = ev.target.closest('[data-marque]');
    if (marque) {
      const { mouche, marque: t } = marque.dataset;
      const types = etat.marques.get(mouche) || new Set();
      types.has(t) ? types.delete(t) : types.add(t);
      types.size ? etat.marques.set(mouche, types) : etat.marques.delete(mouche);
      enregistre();
      // Toutes les étiquettes de cette mouche restent d'accord entre elles.
      for (const autre of $$(`[data-marque="${t}"][data-mouche="${CSS.escape(mouche)}"]`)) {
        autre.setAttribute('aria-pressed', String(types.has(t)));
      }
      if (etat.vue === 'choisir' && etat.typeEau) rendResultats();
      return;
    }

    const bande = ev.target.closest('.bande');
    if (bande) {
      const legende = bande.closest('div').parentElement.querySelector('[data-role="legende"]');
      if (legende) legende.textContent = bande.dataset.libelle;
    }
  });

  document.addEventListener('change', (ev) => {
    const c = ev.target.closest('[data-coffre]');
    if (c) {
      const nom = c.dataset.coffre;
      c.checked ? etat.coffre.add(nom) : etat.coffre.delete(nom);
      enregistre();
      // Toutes les cases portant ce nom restent d'accord entre elles.
      for (const autre of $$(`[data-coffre="${CSS.escape(nom)}"]`)) autre.checked = c.checked;
      $('#compte-coffre').textContent = etat.coffre.size ? `(${etat.coffre.size})` : '(vide)';
      if (etat.vue === 'choisir') rendResultats();
      return;
    }

    if (ev.target.id === 'filtre-coffre') { etat.filtreCoffre = ev.target.checked; rendResultats(); return; }
    if (ev.target.id === 'btn-restaure' && ev.target.files[0]) { restaure(ev.target.files[0]); ev.target.value = ''; }
  });

  $('#recherche').addEventListener('input', (ev) => { etat.recherche = ev.target.value; rendCatalogue(); });
  $('#btn-sauvegarde').addEventListener('click', sauvegarde);
  $('#btn-imprimer').addEventListener('click', () => window.print());
  $('#btn-vider').addEventListener('click', () => {
    if (!etat.coffre.size) return message('Le coffre est déjà vide.');
    if (!confirm('Décocher tous les patrons de votre coffre ?')) return;
    etat.coffre.clear(); etat.marques.clear(); enregistre(); rendCoffre(); rendResultats();
    message('Coffre vidé, marques comprises.');
  });
}

/* ─────────────── Départ ─────────────── */

charge();
rendChoix();
rendResultats();
branche();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
