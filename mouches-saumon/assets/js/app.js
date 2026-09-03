/* Ma mouche du jour — interface.
 *
 * Les données viennent de coffre.js (ce que la photo montre), conditions.js
 * (les principes généraux) et fiche.js (le PDF de Patrick Blanchet). Rien
 * n'est produit ici que de l'affichage.
 */

'use strict';

const CLE = 'ma-mouche-du-jour.v1';

const etat = {
  vue: 'jour',
  lieu: 'rapide',
  ciel: 'voile',
  eau: 'normale',
  activite: 'rien',
  absentes: new Set(),   // les mouches que vous avez décochées
  filtre: null,          // famille mise en avant dans l'onglet coffre
  recherche: ''
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const echappe = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const img = (id) => `assets/img/mouches/${id}.jpg`;

/* ─────────────── Mémoire de l'appareil ─────────────── */

function charge() {
  try {
    const d = JSON.parse(localStorage.getItem(CLE) || 'null');
    if (!d) return;
    for (const k of ['lieu', 'ciel', 'eau', 'activite']) if (d[k]) etat[k] = d[k];
    etat.absentes = new Set(d.absentes || []);
  } catch (e) { /* mémoire indisponible : on continue sans */ }
}

function enregistre() {
  try {
    localStorage.setItem(CLE, JSON.stringify({
      version: 1, lieu: etat.lieu, ciel: etat.ciel, eau: etat.eau,
      activite: etat.activite, absentes: [...etat.absentes]
    }));
  } catch (e) { /* navigation privée, quota : on continue sans */ }
}

const presentes = () => MOUCHES.filter((m) => !etat.absentes.has(m.id));

/* ─────────────── Les boutons de conditions ─────────────── */

function boutons(cible, table, actif, attribut) {
  $(cible).innerHTML = Object.entries(table).map(([cle, v]) =>
    `<button type="button" class="choix rounded-lg border-2 border-riviere-200 bg-white px-3 py-2.5 text-sm font-medium transition dark:border-riviere-700 dark:bg-riviere-900"
       data-${attribut}="${cle}" aria-pressed="${actif === cle}">${echappe(v.libelle)}</button>`
  ).join('');
}

function rendChoix() {
  boutons('#choix-lieu', LIEUX, etat.lieu, 'lieu');
  boutons('#choix-ciel', CIELS, etat.ciel, 'ciel');
  boutons('#choix-eau', EAUX, etat.eau, 'eau');
  boutons('#choix-activite', ACTIVITES, etat.activite, 'activite');
  $('#texte-lieu').textContent = LIEUX[etat.lieu].desc;
}

/* ─────────────── La mouche du jour ─────────────── */

const ARTICLE = { bomber: 'un', streamer: 'un', seche: 'une', noyee: 'une', terrestre: 'un' };

function pourquoi(mouche, pour) {
  const raisons = {
    famille: () => `c'est ${ARTICLE[mouche.famille]} ${FAMILLES[mouche.famille].libelle.toLowerCase()}, ce que ces conditions réclament`,
    teinte: () => `sa teinte ${TEINTES[mouche.teinte].libelle} convient à cette lumière`,
    taille: () => `sa taille ${mouche.taille === 'grosse' ? 'imposante' : mouche.taille} correspond à cette eau`,
    volume: () => mouche.volume === 'etoffe' ? 'sa silhouette étoffée se voit de loin' : 'sa silhouette dégarnie passe inaperçue',
    nage: () => mouche.nage === 'surface' ? 'elle travaille en surface' : mouche.nage === 'fond' ? 'elle descend chercher le poisson' : 'elle nage entre deux eaux'
  };
  return pour.map((t) => raisons[t] && raisons[t]()).filter(Boolean);
}

function pastilles(mouche) {
  return [
    `<span class="inline-flex items-center gap-1.5 rounded-full bg-riviere-100 px-2.5 py-1 text-xs dark:bg-riviere-800">
       <span class="h-2.5 w-2.5 rounded-full ring-1 ring-black/20 dark:ring-white/25" style="background:${TEINTES[mouche.teinte].puce}"></span>
       ${echappe(TEINTES[mouche.teinte].libelle)}</span>`,
    `<span class="rounded-full bg-riviere-100 px-2.5 py-1 text-xs dark:bg-riviere-800">${echappe(FAMILLES[mouche.famille].libelle)}</span>`,
    `<span class="rounded-full bg-riviere-100 px-2.5 py-1 text-xs dark:bg-riviere-800">${echappe(mouche.taille)}</span>`
  ].join('');
}

function carteReperage(mouche) {
  const p = PANNEAUX[mouche.pan];
  return `<figure class="reperage mt-4 overflow-hidden rounded-lg ring-1 ring-riviere-200 dark:ring-riviere-700">
      <img src="${p.image}" alt="Panneau « ${echappe(p.titre)} » du coffre" loading="lazy" class="block w-full">
      <span class="pastille" style="left:${mouche.cx / 10}%; top:${mouche.cy / 10}%"></span>
      <figcaption class="bg-riviere-50 px-3 py-2 text-xs text-riviere-600 dark:bg-riviere-900 dark:text-riviere-300">
        Où la trouver&nbsp;: panneau « ${echappe(p.titre)} », dans le cercle.
      </figcaption>
    </figure>`;
}

function carteVedette(entree, total) {
  const { m, pour } = entree;
  const raisons = pourquoi(m, pour);
  return `<article class="overflow-hidden rounded-2xl border-2 border-laque-500 bg-white dark:bg-riviere-900">
    <div class="flex items-center justify-between gap-3 bg-laque-500 px-4 py-2">
      <p class="font-titre text-base text-white">La mouche du jour</p>
      <p class="text-xs text-laque-100">choisie parmi vos ${total}</p>
    </div>
    <img src="${img(m.id)}" alt="${echappe(m.nom)}" class="block w-full bg-riviere-100 dark:bg-riviere-800">
    <div class="p-4">
      <h3 class="font-titre text-xl leading-tight">${echappe(m.nom)}</h3>
      <div class="mt-2 flex flex-wrap gap-1.5">${pastilles(m)}</div>

      ${raisons.length ? `<p class="mt-3 text-sm leading-relaxed">
        <strong class="font-medium">Pourquoi elle&nbsp;:</strong> ${echappe(raisons.join(', '))}.</p>` : ''}

      <p class="mt-3 rounded-lg bg-riviere-50 p-3 text-sm leading-relaxed dark:bg-riviere-800/60">
        <strong class="font-medium">Comment la pêcher.</strong> ${echappe(CONSEILS_FAMILLE[m.famille])}
      </p>

      ${carteReperage(m)}
    </div>
  </article>`;
}

function carteRechange(entree, rang) {
  const { m } = entree;
  return `<article class="overflow-hidden rounded-xl border border-riviere-200 bg-white dark:border-riviere-800 dark:bg-riviere-900">
    <img src="${img(m.id)}" alt="${echappe(m.nom)}" loading="lazy" class="block w-full bg-riviere-100 dark:bg-riviere-800">
    <div class="p-3">
      <p class="text-xs font-medium uppercase tracking-wide text-riviere-500 dark:text-riviere-400">${rang}<sup>e</sup> choix</p>
      <h4 class="mt-0.5 font-titre text-base leading-tight">${echappe(m.nom)}</h4>
      <div class="mt-1.5 flex flex-wrap gap-1">${pastilles(m)}</div>
    </div>
  </article>`;
}

function rendResultat() {
  const dispo = presentes();
  const zone = $('#resultat');

  if (!dispo.length) {
    zone.innerHTML = `<p class="rounded-xl border border-dashed border-riviere-300 p-6 text-center text-sm text-riviere-500 dark:border-riviere-700 dark:text-riviere-400">
      Vous avez décoché toutes vos mouches. Rendez-en au moins une dans l'onglet <em>Mon coffre</em>.</p>`;
    return;
  }

  const { classees, manques, conseils } = conseilDuJour(etat, dispo);
  const [premiere, ...suite] = classees;
  const rechange = suite.slice(0, 2);

  zone.innerHTML = `
    ${carteVedette(premiere, dispo.length)}

    ${rechange.length ? `<h3 class="mt-6 font-titre text-lg">Si elle ne donne rien</h3>
      <div class="mt-2 grid grid-cols-2 gap-3">
        ${rechange.map((e, i) => carteRechange(e, i + 2)).join('')}
      </div>` : ''}

    ${manques.length ? `<div class="mt-6 rounded-xl border border-laque-300 bg-laque-100 p-4 dark:border-laque-700 dark:bg-laque-700/20">
      <h3 class="font-titre text-base">Ce qui vous manquerait aujourd'hui</h3>
      ${manques.map((x) => `<p class="mt-2 text-sm leading-relaxed">${echappe(x.texte)}</p>`).join('')}
    </div>` : ''}

    ${conseils.length ? `<h3 class="mt-6 font-titre text-lg">Les conseils du jour</h3>
      <ul class="mt-2 space-y-2">
        ${conseils.map((c) => `<li class="flex gap-2.5 rounded-lg border border-riviere-200 bg-white p-3 text-sm leading-relaxed dark:border-riviere-800 dark:bg-riviere-900">
            <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-laque-500"></span>
            <span>${echappe(c)}</span></li>`).join('')}
      </ul>` : ''}

    <p class="sans-impression mt-5 text-xs leading-relaxed text-riviere-500 dark:text-riviere-400">
      Ce classement ne vient pas de la fiche de Patrick Blanchet — elle ne contient pas de table des
      conditions. Il applique les principes généraux de la pêche à la mouche à ce que votre photographie
      montre. L'onglet <em>D'où ça vient</em> l'explique en entier.
    </p>`;
}

/* ─────────────── Onglet « Mon coffre » ─────────────── */

function rendCoffre() {
  $('#compte-coffre').textContent = `${presentes().length} sur ${MOUCHES.length}`;

  const puce = (cle, libelle, n, actif) =>
    `<button type="button" class="etiquette rounded-full border border-riviere-200 px-3 py-1.5 text-sm transition dark:border-riviere-700"
       data-filtre="${cle}" aria-pressed="${actif}">${echappe(libelle)} <span class="tabular-nums text-riviere-500">${n}</span></button>`;

  $('#filtres-coffre').innerHTML =
    puce('tous', 'Toutes', MOUCHES.length, etat.filtre === null) +
    Object.entries(FAMILLES).map(([cle, f]) =>
      puce(cle, f.libelle, MOUCHES.filter((m) => m.famille === cle).length, etat.filtre === cle)).join('');

  const liste = etat.filtre ? MOUCHES.filter((m) => m.famille === etat.filtre) : MOUCHES;

  $('#grille-coffre').innerHTML = liste.map((m) => {
    const absente = etat.absentes.has(m.id);
    return `<article class="overflow-hidden rounded-xl border border-riviere-200 bg-white transition dark:border-riviere-800 dark:bg-riviere-900${absente ? ' opacity-45' : ''}">
      <img src="${img(m.id)}" alt="${echappe(m.nom)}" loading="lazy" class="block w-full bg-riviere-100 dark:bg-riviere-800">
      <div class="p-3">
        <h4 class="font-titre text-sm leading-tight">${echappe(m.nom)}</h4>
        <p class="mt-1 text-xs text-riviere-500 dark:text-riviere-400">${echappe(FAMILLES[m.famille].libelle)} · ${echappe(TEINTES[m.teinte].libelle)} · ${echappe(m.taille)}</p>
        <label class="sans-impression mt-2 flex cursor-pointer items-center gap-2 text-xs">
          <input type="checkbox" class="h-4 w-4 accent-laque-500" data-presente="${m.id}"${absente ? '' : ' checked'}>
          <span>${absente ? "je ne l'ai plus" : "je l'ai"}</span>
        </label>
      </div>
    </article>`;
  }).join('');
}

/* ─────────────── Onglet « La fiche » ─────────────── */

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

function rendCatalogue() {
  const q = etat.recherche.trim().toLowerCase();
  const liste = q
    ? FICHE.filter((m) => [m.nom, m.origine, m.toilette, m.note].filter(Boolean).join(' ').toLowerCase().includes(q))
    : FICHE;

  $('#catalogue').innerHTML = liste.length ? liste.map((m) => `
    <article class="rounded-xl border border-riviere-200 bg-white p-4 dark:border-riviere-800 dark:bg-riviere-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <h3 class="font-titre text-lg leading-tight">${echappe(m.nom)}</h3>
          ${m.origine ? `<p class="text-sm text-riviere-600 dark:text-riviere-300">${echappe(m.origine)}</p>` : ''}
        </div>
        <div class="flex shrink-0 flex-wrap items-center gap-1.5">${badgeReserve(m)}</div>
      </div>
      ${profilHtml(m)}
      ${m.toilette ? `<p class="mt-3 text-sm leading-relaxed text-riviere-800 dark:text-papier-100">${echappe(m.toilette)}</p>` : ''}
      ${m.note ? `<p class="mt-2 text-sm italic leading-relaxed text-riviere-600 dark:text-riviere-300">${echappe(m.note)}</p>` : ''}
      ${!m.toilette && !m.note ? `<p class="mt-3 text-sm italic text-riviere-600 dark:text-riviere-300">Patron régional dont la fiche n'a pu vérifier la toilette dans une source fiable. Fiez-vous aux photographies.</p>` : ''}
      <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        ${m.hamecon ? `<span class="text-riviere-700 dark:text-riviere-300">Hameçon n° ${m.hamecon[0]} à ${m.hamecon[1]}</span>` : ''}
        <a href="https://duckduckgo.com/?iax=images&amp;ia=images&amp;q=${encodeURIComponent('mouche à saumon "' + m.nom + '" fly')}"
           target="_blank" rel="noopener noreferrer"
           class="sans-impression inline-flex items-center gap-1 text-sm font-medium text-laque-600 hover:underline dark:text-laque-300">Voir des photographies <span aria-hidden="true">↗</span></a>
      </div>
    </article>`).join('')
    : `<p class="rounded-lg border border-dashed border-riviere-300 p-6 text-center text-sm text-riviere-500 dark:border-riviere-700 dark:text-riviere-400">Rien ne correspond à « ${echappe(etat.recherche)} ».</p>`;
}

/* ─────────────── Navigation ─────────────── */

function montre(vue) {
  etat.vue = vue;
  for (const b of $$('.onglet')) {
    const actif = b.id === `t-${vue}`;
    b.setAttribute('aria-selected', String(actif));
    $(`#${b.getAttribute('aria-controls')}`).hidden = !actif;
  }
  if (vue === 'jour') rendResultat();
  if (vue === 'coffre') rendCoffre();
  if (vue === 'catalogue') rendCatalogue();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─────────────── Sauvegarde ─────────────── */

function sauvegarde() {
  const contenu = JSON.stringify({
    application: 'ma-mouche-du-jour', version: 1, date: new Date().toISOString(),
    lieu: etat.lieu, ciel: etat.ciel, eau: etat.eau, activite: etat.activite,
    absentes: [...etat.absentes]
  }, null, 2);
  const blob = new Blob([contenu], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mes-reglages-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  message('Réglages sauvegardés.');
}

function restaure(fichier) {
  const lecteur = new FileReader();
  lecteur.onload = () => {
    try {
      const d = JSON.parse(lecteur.result);
      const connues = new Set(MOUCHES.map((m) => m.id));
      if (d.lieu in LIEUX) etat.lieu = d.lieu;
      if (d.ciel in CIELS) etat.ciel = d.ciel;
      if (d.eau in EAUX) etat.eau = d.eau;
      if (d.activite in ACTIVITES) etat.activite = d.activite;
      etat.absentes = new Set((d.absentes || []).filter((id) => connues.has(id)));
      enregistre(); rendChoix(); rendResultat(); rendCoffre();
      message('Réglages restaurés.');
    } catch (e) {
      message("Ce fichier n'est pas une sauvegarde de cette application.");
    }
  };
  lecteur.readAsText(fichier);
}

let minuteur;
function message(txt) {
  const el = $('#message');
  el.textContent = txt;
  clearTimeout(minuteur);
  minuteur = setTimeout(() => { el.textContent = ''; }, 6000);
}

/* ─────────────── Écoute ─────────────── */

function branche() {
  for (const b of $$('.onglet')) b.addEventListener('click', () => montre(b.id.slice(2)));

  document.addEventListener('click', (ev) => {
    for (const registre of ['lieu', 'ciel', 'eau', 'activite']) {
      const b = ev.target.closest(`[data-${registre}]`);
      if (b) {
        etat[registre] = b.dataset[registre];
        enregistre(); rendChoix(); rendResultat();
        return;
      }
    }

    const filtre = ev.target.closest('[data-filtre]');
    if (filtre) {
      etat.filtre = filtre.dataset.filtre === 'tous' ? null : filtre.dataset.filtre;
      rendCoffre();
      return;
    }

    const bande = ev.target.closest('.bande');
    if (bande) {
      const legende = bande.closest('div').parentElement.querySelector('[data-role="legende"]');
      if (legende) legende.textContent = bande.dataset.libelle;
    }
  });

  document.addEventListener('change', (ev) => {
    const c = ev.target.closest('[data-presente]');
    if (c) {
      const id = c.dataset.presente;
      c.checked ? etat.absentes.delete(id) : etat.absentes.add(id);
      enregistre(); rendCoffre();
      return;
    }
    if (ev.target.id === 'btn-restaure' && ev.target.files[0]) { restaure(ev.target.files[0]); ev.target.value = ''; }
  });

  $('#recherche').addEventListener('input', (ev) => { etat.recherche = ev.target.value; rendCatalogue(); });
  $('#btn-sauvegarde').addEventListener('click', sauvegarde);
}

/* ─────────────── Départ ─────────────── */

charge();
rendChoix();
rendResultat();
branche();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
