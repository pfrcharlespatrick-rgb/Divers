/* L'interface du guide HRC 100-C.
   Rien ne sort de l'appareil : le simulateur est une imitation du boîtier,
   jamais une commande envoyée au vrai contrôleur. */

(function () {
  'use strict';

  const D = DONNEES;

  const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const ORDRE = ['CLOCK', 'DATE', 'START', 'RUNTIME', 'OFTEN', 'BUDGET', 'OFF', 'RUN'];
  const DEG = { CLOCK: 0, DATE: 45, START: 90, RUNTIME: 135, OFTEN: 180, BUDGET: 225, OFF: 270, RUN: 315 };
  const NOMS = {
    CLOCK: 'Set clock', DATE: 'Set date', START: 'Start time', RUNTIME: 'Run time',
    OFTEN: 'How often', BUDGET: 'Budget', OFF: 'Off', RUN: 'Run'
  };
  const BOUTONS = ['program', 'rain', 'clear', 'gauche', 'enter', 'plus', 'droite', 'moins'];

  const ACCUEILS = [
    { id: 'panneau', titre: 'Le boîtier d’abord', desc: 'La photographie et le schéma interactif ouvrent l’application, la liste des guides suit.' },
    { id: 'index', titre: 'Index de journal', desc: 'Un grand titre, un chapeau, puis les neuf procédures numérotées.' },
    { id: 'etat', titre: 'Aujourd’hui', desc: 'La position du cadran en grand et les quatre gestes fréquents.' }
  ];

  const CLE_ACCUEIL = 'arrosage.accueil';

  const fmt = (m) => {
    const h = Math.floor(m / 60) % 24, mm = m % 60;
    const ap = h < 12 ? 'AM' : 'PM';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return hh + ':' + String(mm).padStart(2, '0') + ' ' + ap;
  };

  const simNeuf = () => ({
    dial: 'OFF', prog: 0, clock: 390, date: { y: 2026, m: 9, d: 15 }, dateField: 0,
    startIdx: 0, station: 0, oftenCur: 0,
    starts: [[300, null, null, null], [null, null, null, null], [null, null, null, null]],
    runs: [[15, 10, 10, 10, 10, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
    often: [
      { mode: 'days', days: [true, false, true, false, true, false, false], int: 1 },
      { mode: 'days', days: [false, false, false, false, false, false, false], int: 1 },
      { mode: 'days', days: [false, false, false, false, false, false, false], int: 1 }
    ],
    budget: [100, 100, 100], rain: 0, rainSel: null, manual: null, awaitTest: false, tick: 0
  });

  function accueilEnregistre() {
    try {
      const v = localStorage.getItem(CLE_ACCUEIL);
      if (ACCUEILS.some((a) => a.id === v)) return v;
    } catch (e) { /* navigation privée, stockage bloqué : on garde le défaut */ }
    return 'panneau';
  }

  function enregistrerAccueil(id) {
    try { localStorage.setItem(CLE_ACCUEIL, id); } catch (e) { /* sans conséquence */ }
  }

  const etat = {
    ecran: 'home',
    accueil: accueilEnregistre(),
    guideId: null,
    step: 0,
    expl: null,
    sim: simNeuf()
  };

  /* ── petites fabriques de balises ─────────────────────────────────── */

  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  function bouton(cls, txt, action, aria) {
    const b = el('button', cls, txt);
    b.type = 'button';
    if (aria) b.setAttribute('aria-label', aria);
    b.addEventListener('click', action);
    return b;
  }

  /* ── le simulateur : la mécanique du vrai boîtier ─────────────────── */

  function stationSuivante(sim, m) {
    if (m.single) return null;
    for (let i = m.station + 1; i < 6; i++) {
      const d = m.test ? m.dur : sim.runs[sim.prog][i];
      if (d > 0) return Object.assign({}, m, { station: i, remaining: d * 60 });
    }
    return null;
  }

  function presser(id) {
    if (etat.ecran !== 'sim') {
      const b = D.boutons.find((x) => x.id === id);
      etat.expl = b ? { nom: b.nom, texte: b.role } : null;
      rendre();
      return;
    }

    const sim = etat.sim;
    const P = sim.prog;
    const wasAwait = sim.awaitTest;
    sim.awaitTest = false;
    const enChoixManuel = sim.manual && sim.manual.phase === 'select';

    switch (sim.dial) {
      case 'CLOCK':
        if (id === 'plus') sim.clock = (sim.clock + 1) % 1440;
        if (id === 'moins') sim.clock = (sim.clock + 1439) % 1440;
        if (id === 'gauche' || id === 'droite') sim.clock = (sim.clock + 720) % 1440;
        break;

      case 'DATE': {
        const f = ['y', 'm', 'd'][sim.dateField];
        const dt = sim.date;
        const dlt = id === 'plus' ? 1 : id === 'moins' ? -1 : 0;
        if (f === 'y') dt.y += dlt;
        if (f === 'm') dt.m = ((dt.m - 1 + dlt + 12) % 12) + 1;
        if (f === 'd') dt.d = ((dt.d - 1 + dlt + 31) % 31) + 1;
        if (id === 'enter' || id === 'droite') sim.dateField = (sim.dateField + 1) % 3;
        if (id === 'gauche') sim.dateField = (sim.dateField + 2) % 3;
        break;
      }

      case 'START': {
        const cur = sim.starts[P][sim.startIdx];
        if (id === 'plus') sim.starts[P][sim.startIdx] = cur == null ? 360 : (cur + 15) % 1440;
        if (id === 'moins') sim.starts[P][sim.startIdx] = cur == null ? 360 : (cur + 1425) % 1440;
        if (id === 'clear') sim.starts[P][sim.startIdx] = null;
        if (id === 'droite' || id === 'enter') sim.startIdx = (sim.startIdx + 1) % 4;
        if (id === 'gauche') sim.startIdx = (sim.startIdx + 3) % 4;
        if (id === 'program') sim.prog = (P + 1) % 3;
        break;
      }

      case 'RUNTIME': {
        const r = sim.runs[P];
        if (id === 'plus') r[sim.station] = Math.min(240, r[sim.station] + 1);
        if (id === 'moins') r[sim.station] = Math.max(0, r[sim.station] - 1);
        if (id === 'clear') r[sim.station] = 0;
        if (id === 'droite' || id === 'enter') sim.station = (sim.station + 1) % 6;
        if (id === 'gauche') sim.station = (sim.station + 5) % 6;
        if (id === 'program') sim.prog = (P + 1) % 3;
        break;
      }

      case 'OFTEN': {
        const o = sim.often[P];
        const c = sim.oftenCur;
        if (id === 'droite') sim.oftenCur = (c + 1) % 10;
        if (id === 'gauche') sim.oftenCur = (c + 9) % 10;
        if (c < 7 && (id === 'plus' || id === 'enter')) { o.mode = 'days'; o.days[c] = true; }
        if (c < 7 && (id === 'moins' || id === 'clear')) o.days[c] = false;
        if (c === 7) {
          o.mode = 'int';
          if (id === 'plus') o.int = Math.min(30, o.int + 1);
          if (id === 'moins') o.int = Math.max(1, o.int - 1);
        }
        if (c === 8 && (id === 'plus' || id === 'enter')) o.mode = 'odd';
        if (c === 9 && (id === 'plus' || id === 'enter')) o.mode = 'even';
        if (id === 'program') sim.prog = (P + 1) % 3;
        break;
      }

      case 'BUDGET': {
        if (id === 'plus') sim.budget[P] = Math.min(200, sim.budget[P] + 10);
        if (id === 'moins') sim.budget[P] = Math.max(10, sim.budget[P] - 10);
        if (id === 'program') sim.prog = (P + 1) % 3;
        break;
      }

      case 'RUN': {
        if (sim.rainSel != null) {
          if (id === 'droite') sim.rainSel = Math.min(72, sim.rainSel + 24);
          if (id === 'gauche') sim.rainSel = Math.max(24, sim.rainSel - 24);
          if (id === 'enter') { sim.rain = sim.rainSel; sim.rainSel = null; }
          if (id === 'clear') sim.rainSel = null;
          break;
        }
        if (id === 'rain') { sim.rainSel = 24; break; }
        if (id === 'clear') { sim.manual = null; sim.rain = 0; break; }
        if (id === 'program') { sim.prog = (P + 1) % 3; break; }

        if (enChoixManuel) {
          const m = sim.manual;
          if (id === 'moins' && wasAwait) { m.test = true; m.sel = 'ALL'; m.dur = 2; }
          else if (id === 'droite') { m.sel = m.sel === 'ALL' ? 0 : Math.min(5, m.sel + 1); if (m.dur == null) m.dur = 5; }
          else if (id === 'gauche') { m.sel = (m.sel === 'ALL' || m.sel === 0) ? 'ALL' : m.sel - 1; }
          else if (id === 'plus') m.dur = Math.min(240, (m.dur || 0) + 1);
          else if (id === 'moins') m.dur = Math.max(1, (m.dur || 2) - 1);
          else if (id === 'enter') {
            if (m.sel === 'ALL') {
              const premiere = m.test ? 0 : sim.runs[P].findIndex((x) => x > 0);
              if (premiere < 0) { sim.manual = null; break; }
              sim.manual = {
                phase: 'running', station: premiere,
                remaining: (m.test ? m.dur : sim.runs[P][premiere]) * 60,
                test: !!m.test, dur: m.dur, single: false
              };
            } else {
              sim.manual = { phase: 'running', station: m.sel, remaining: m.dur * 60, single: true };
            }
          }
          break;
        }

        if (id === 'enter' && !sim.manual) {
          sim.manual = { phase: 'select', sel: 'ALL', dur: null, test: false };
          sim.awaitTest = true;
        }
        break;
      }

      default: break;
    }

    rendre();
  }

  function tourner(pos) {
    if (etat.ecran !== 'sim') {
      const c = D.cadran.find((x) => x.id === pos);
      etat.expl = c ? { id: c.id, nom: c.nom, texte: c.role } : null;
      rendre();
      return;
    }
    const sim = etat.sim;
    sim.dial = pos;
    sim.rainSel = null;
    if (pos !== 'RUN') sim.manual = null;
    sim.awaitTest = false;
    sim.dateField = 0;
    rendre();
  }

  function texteLcd() {
    const sim = etat.sim;
    const P = 'ABC'[sim.prog];
    switch (sim.dial) {
      case 'OFF': return 'OFF';
      case 'CLOCK': return fmt(sim.clock);
      case 'DATE': return ['Y ' + sim.date.y, 'M ' + sim.date.m, 'D ' + sim.date.d][sim.dateField];
      case 'START': {
        const v = sim.starts[sim.prog][sim.startIdx];
        return P + '  ' + (sim.startIdx + 1) + '  ' + (v == null ? '--:--' : fmt(v));
      }
      case 'RUNTIME':
        return P + '  ST ' + (sim.station + 1) + '  ' + sim.runs[sim.prog][sim.station] + ' MIN';
      case 'OFTEN': {
        const o = sim.often[sim.prog], c = sim.oftenCur;
        const parts = DAYS.map((d, i) => (c === i ? '▸' : '') + (o.mode === 'days' && o.days[i] ? '[' + d + ']' : d));
        parts.push(
          (c === 7 ? '▸' : '') + (o.mode === 'int' ? '[INT ' + o.int + ']' : 'INT'),
          (c === 8 ? '▸' : '') + (o.mode === 'odd' ? '[ODD]' : 'ODD'),
          (c === 9 ? '▸' : '') + (o.mode === 'even' ? '[EVEN]' : 'EVEN')
        );
        return P + '  ' + parts.join(' ');
      }
      case 'BUDGET': return P + '  ' + sim.budget[sim.prog] + ' %';
      case 'RUN': {
        if (sim.rainSel != null) return 'RAIN DELAY  ' + sim.rainSel;
        const m = sim.manual;
        if (m && m.phase === 'select') {
          return m.test ? 'MANUAL  ST A  ' + m.dur + ' MIN'
            : m.sel === 'ALL' ? 'MANUAL  ABC  ALL'
              : 'MANUAL  ST ' + (m.sel + 1) + '  ' + m.dur + ' MIN';
        }
        if (m && m.phase === 'running') {
          const s = Math.max(0, m.remaining);
          return 'ST ' + (m.station + 1) + '  ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        }
        if (sim.rain > 0 && sim.tick % 4 >= 2) return sim.rain + ' HR';
        return fmt(sim.clock);
      }
    }
    return '';
  }

  /* ── le panneau : construit une seule fois, mis à jour ensuite ────── */

  const panneau = el('section', 'panneau');
  const panKicker = el('div', 'kicker', 'Face avant · touchez pour comprendre');
  const lcd = el('div', 'lcd');
  const btPanneau = {};
  const cadranPos = {};
  const aiguille = el('div', 'cadran-aiguille');
  const explNom = el('div', 'expl-nom');
  const explTexte = el('div', 'expl-texte');

  function btBoitier(id, texte, cls, aria) {
    const b = bouton('bt ' + cls, texte, () => presser(id), aria);
    btPanneau[id] = b;
    return b;
  }

  (function construirePanneau() {
    panneau.appendChild(panKicker);

    const haut = el('div', 'pan-haut');
    lcd.setAttribute('aria-live', 'polite');
    haut.appendChild(lcd);
    const cote = el('div', 'pan-lcd-cote');
    cote.appendChild(btBoitier('program', 'Program', 'bt-mini'));
    cote.appendChild(btBoitier('rain', 'Rain delay', 'bt-mini bt-pluie'));
    haut.appendChild(cote);
    panneau.appendChild(haut);

    const rangee = el('div', 'pan-rangee');

    const gauche = el('div', 'pan-cluster');
    gauche.appendChild(btBoitier('clear', 'Clear', 'bt-cote'));
    gauche.appendChild(btBoitier('gauche', '◀', 'bt-fleche', 'Réglage ou station précédente'));
    const enter = btBoitier('enter', null, 'bt-cote bt-enter');
    enter.appendChild(document.createTextNode('Enter'));
    enter.appendChild(document.createElement('br'));
    enter.appendChild(document.createTextNode('Manual'));
    gauche.appendChild(enter);
    rangee.appendChild(gauche);

    const cadran = el('div', 'cadran');
    cadran.appendChild(el('div', 'cadran-anneau'));
    cadran.appendChild(el('div', 'cadran-moyeu'));
    cadran.appendChild(aiguille);
    ORDRE.forEach((k) => {
      const b = bouton('cadran-pos', NOMS[k], () => tourner(k));
      b.style.transform = 'rotate(' + DEG[k] + 'deg) translateY(-84px) rotate(-' + DEG[k] + 'deg)';
      cadranPos[k] = b;
      cadran.appendChild(b);
    });
    rangee.appendChild(cadran);

    const droite = el('div', 'pan-cluster');
    droite.appendChild(btBoitier('plus', '+', 'bt-signe', 'Augmenter'));
    droite.appendChild(btBoitier('droite', '▶', 'bt-fleche', 'Réglage ou station suivante'));
    droite.appendChild(btBoitier('moins', '−', 'bt-signe', 'Diminuer, ou cycle de test'));
    droite.appendChild(el('div', 'pan-cluster-note', 'Test cycle'));
    rangee.appendChild(droite);

    panneau.appendChild(rangee);

    const expl = el('div', 'expl');
    expl.appendChild(explNom);
    expl.appendChild(explTexte);
    panneau.appendChild(expl);
  }());

  function majPanneau() {
    const estGuide = etat.ecran === 'guide';
    const estSim = etat.ecran === 'sim';
    const estPanneau = etat.ecran === 'panneau';
    const estHomeEtat = etat.ecran === 'home' && etat.accueil === 'etat';
    const guide = guideCourant();
    const etape = etapeCourante();
    const sim = etat.sim;

    panKicker.hidden = !estPanneau;

    const surligne = estGuide && etape ? etape.b : null;
    BOUTONS.forEach((k) => btPanneau[k].classList.toggle('is-actif', surligne === k));

    const actif = estGuide && etape ? etape.c
      : estSim ? sim.dial
        : (etat.expl && ORDRE.indexOf(etat.expl.id) >= 0) ? etat.expl.id
          : (estHomeEtat ? sim.dial : 'OFF');
    ORDRE.forEach((k) => cadranPos[k].classList.toggle('is-actif', actif === k));
    aiguille.style.transform = 'rotate(' + (DEG[actif] != null ? DEG[actif] : 270) + 'deg)';

    lcd.textContent = estGuide && etape ? etape.lcd
      : (estSim || estHomeEtat) ? texteLcd()
        : (etat.expl ? (etat.expl.lcd || 'OFF') : 'OFF');

    let nom = '', texte = '';
    if (estSim) {
      const info = D.cadran.find((c) => c.id === sim.dial);
      nom = info ? info.nom : '';
      texte = info ? info.role : '';
      const st = sim.dial === 'RUNTIME' ? sim.station
        : (sim.manual && sim.manual.phase === 'running') ? sim.manual.station
          : (sim.manual && sim.manual.phase === 'select' && sim.manual.sel !== 'ALL') ? sim.manual.sel
            : null;
      if (st != null) {
        nom = st < 5 ? 'ST ' + (st + 1) + ' = Zone ' + (st + 1) : 'ST 6 — non raccordée';
        if (st >= 5) texte = 'Cette station n’est reliée à aucune vanne. Laissez sa durée à 0.';
      }
    } else if (etat.expl) {
      nom = etat.expl.nom; texte = etat.expl.texte;
    } else if (estGuide && etape) {
      const b = D.boutons.find((x) => x.id === etape.b) || D.cadran.find((x) => x.id === etape.c);
      if (b) { nom = b.nom; texte = b.role; }
    } else {
      nom = 'Schéma';
      texte = 'Touchez un bouton ou une position du cadran pour lire son rôle.';
    }
    explNom.textContent = nom;
    explTexte.textContent = texte;
  }

  /* ── les écrans ───────────────────────────────────────────────────── */

  function guideCourant() { return D.guides.find((g) => g.id === etat.guideId) || null; }
  function etapeCourante() { const g = guideCourant(); return g ? g.etapes[etat.step] : null; }

  function allerA(ecran) { etat.ecran = ecran; etat.expl = null; rendre(); }

  function ouvrirGuide(id) {
    etat.ecran = 'guide'; etat.guideId = id; etat.step = 0; etat.expl = null;
    rendre();
    window.scrollTo(0, 0);
  }

  function dateDuJour() {
    return new Date().toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function figurePhoto(parent) {
    const fig = el('figure', 'halftone photo');
    const img = el('img');
    img.src = 'assets/img/boitier.jpg';
    img.alt = 'Boîtier Hydro-Rain HRC 100-C ouvert : porte à gauche, façade avec écran, cadran et boutons à droite';
    img.width = 1290; img.height = 469;
    fig.appendChild(img);
    parent.appendChild(fig);
    parent.appendChild(el('p', 'photo-legende',
      'Votre boîtier, porte ouverte. Le schéma ci-dessous reprend la façade de droite.'));
  }

  function listeGuides(classe) {
    const liste = el('div', 'liste-guides' + (classe ? ' ' + classe : ''));
    D.guides.forEach((g, i) => {
      const b = bouton('guide-ligne', null, () => ouvrirGuide(g.id));
      b.appendChild(el('span', 'guide-num', String(i + 1).padStart(2, '0')));
      b.appendChild(el('span', null, g.titre));
      b.appendChild(el('span', 'guide-duree', g.duree));
      liste.appendChild(b);
    });
    return liste;
  }

  function ecranAccueilA(hote) {
    const s = el('section', 'accueil-a');
    s.appendChild(el('div', 'kicker', 'Hydro-Rain HRC 100-C · 6 stations'));
    s.appendChild(el('h1', null, 'Le système d’arrosage, expliqué bouton par bouton.'));
    s.appendChild(el('p', null, 'Touchez un bouton ou une position du cadran.'));
    hote.appendChild(s);
  }

  function ecranAccueilB(hote) {
    const s = el('section', 'accueil-b');
    const ligne = el('div', 'kicker kicker-ligne');
    ligne.appendChild(el('span', null, 'Guide de l’arrosage'));
    ligne.appendChild(el('span', null, dateDuJour()));
    s.appendChild(ligne);
    s.appendChild(el('h1', null, 'Faire fonctionner le Hydro-Rain HRC 100-C.'));
    s.appendChild(el('p', null, 'Neuf procédures pas à pas, un schéma du boîtier et un simulateur qui réagit comme le vrai appareil. Écrit pour qui n’a jamais ouvert la porte du contrôleur.'));
    s.appendChild(listeGuides());
    hote.appendChild(s);
  }

  function ecranAccueilC(hote) {
    const sim = etat.sim;
    const s = el('section', 'accueil-c');
    s.appendChild(el('div', 'kicker', dateDuJour()));

    const h1 = el('h1', null, 'Cadran sur ');
    h1.appendChild(el('span', null, NOMS[sim.dial].toUpperCase()));
    h1.appendChild(document.createTextNode('.'));
    s.appendChild(h1);

    const phrase = sim.dial === 'OFF'
      ? 'Le système est arrêté : aucune station ne s’ouvrira. Tournez le cadran sur RUN pour reprendre le programme automatique.'
      : sim.dial === 'RUN'
        ? (sim.rain > 0
          ? 'Arrosage suspendu pour ' + sim.rain + ' h. Il reprendra seul ensuite.'
          : 'Programme ' + 'ABC'[sim.prog] + ' en automatique. Prochain départ ' + fmt(sim.starts[sim.prog][0] != null ? sim.starts[sim.prog][0] : 300) + '.')
        : 'Le cadran est en position de réglage. Pensez à le remettre sur RUN une fois terminé.';
    s.appendChild(el('p', null, phrase));

    const gestes = el('div', 'gestes');
    gestes.appendChild(el('div', 'kicker', 'Gestes fréquents'));
    [
      ['Suspendre pour la pluie', 'pluie'],
      ['Arroser une zone maintenant', 'manuel'],
      ['Tester toutes les stations', 'test'],
      ['Fermer pour l’hiver', 'hiver']
    ].forEach(([texte, id]) => {
      const b = bouton('geste', texte + ' ', () => ouvrirGuide(id));
      b.appendChild(el('span', null, '→'));
      gestes.appendChild(b);
    });
    s.appendChild(gestes);

    s.appendChild(bouton('lien-sim', 'Ouvrir le simulateur pour s’entraîner sans risque →', () => allerA('sim')));
    hote.appendChild(s);
  }

  function ecranGuideTete(hote) {
    const guide = guideCourant();
    const etape = etapeCourante();
    const s = el('section', 'guide-tete');

    const ligne = el('div', 'kicker kicker-ligne');
    ligne.appendChild(bouton('retour', '← Guides', () => allerA('guides')));
    ligne.appendChild(el('span', null, 'Étape ' + (etat.step + 1) + ' / ' + (guide ? guide.etapes.length : 0)));
    s.appendChild(ligne);

    s.appendChild(el('h2', null, guide ? guide.titre : ''));
    s.appendChild(el('p', 'etape-texte', etape ? etape.t : ''));
    hote.appendChild(s);
  }

  function ecranGuideNav(hote) {
    const guide = guideCourant();
    const total = guide ? guide.etapes.length : 0;
    const s = el('section', 'etapes-nav');

    s.appendChild(bouton('btn btn-secondary', 'Précédent', () => {
      if (etat.step > 0) { etat.step -= 1; etat.expl = null; rendre(); }
      else allerA('guides');
    }));

    const points = el('div', 'etapes-points');
    for (let i = 0; i < total; i++) {
      const p = el('i', i <= etat.step ? 'is-fait' : null);
      points.appendChild(p);
    }
    s.appendChild(points);

    s.appendChild(bouton('btn btn-primary', etat.step >= total - 1 ? 'Terminé' : 'Suivant', () => {
      if (etat.step < total - 1) { etat.step += 1; etat.expl = null; rendre(); }
      else { etat.ecran = 'guides'; etat.expl = null; rendre(); }
    }));

    hote.appendChild(s);
  }

  function ecranSimTete(hote) {
    const s = el('section', 'sim-tete');
    s.appendChild(el('div', 'kicker', 'Simulateur · rien n’est envoyé au vrai boîtier'));
    s.appendChild(el('h2', null, 'Essayez sans risque.'));
    const p = el('p', null, 'Les minutes d’arrosage défilent en accéléré. ');
    p.appendChild(bouton(null, 'Réinitialiser', () => { etat.sim = simNeuf(); rendre(); }));
    s.appendChild(p);
    hote.appendChild(s);
  }

  function ecranListeGuides(hote) {
    const s = el('section', 'liste-guides-bloc');
    s.appendChild(el('div', 'kicker', 'Pas à pas'));
    s.appendChild(listeGuides());
    hote.appendChild(s);
  }

  function ecranLexique(hote) {
    const s = el('section', 'lexique');

    const zones = el('div', 'lexique-bloc');
    zones.appendChild(el('div', 'kicker', 'Les zones'));
    const tags = el('div', 'zones');
    D.zones.forEach((z) => tags.appendChild(el('span', 'tag tag-accent', z.nom)));
    zones.appendChild(tags);
    zones.appendChild(el('p', null, 'Sur l’écran du boîtier, la zone apparaît comme « ST » suivi de son numéro (ST 1 = zone 1). La station 6 n’est pas raccordée : laissez sa durée à 0.'));
    s.appendChild(zones);

    const btns = el('div', 'lexique-bloc');
    btns.appendChild(el('div', 'kicker', 'Les boutons'));
    D.boutons.forEach((b) => {
      const l = bouton('lexique-ligne', null, () => { etat.expl = { nom: b.nom, texte: b.role }; rendre(); });
      l.appendChild(el('b', null, b.nom));
      l.appendChild(el('span', null, b.role));
      btns.appendChild(l);
    });
    s.appendChild(btns);

    const cad = el('div', 'lexique-bloc');
    cad.appendChild(el('div', 'kicker', 'Le cadran'));
    D.cadran.forEach((c) => {
      const l = bouton('lexique-ligne', null, () => {
        etat.expl = {
          id: c.id, nom: c.nom, texte: c.role,
          lcd: c.id === 'OFF' ? 'OFF' : c.id === 'RUN' ? fmt(etat.sim.clock) : ''
        };
        rendre();
      });
      l.appendChild(el('b', null, c.nom));
      l.appendChild(el('span', null, c.role));
      cad.appendChild(l);
    });
    s.appendChild(cad);

    hote.appendChild(s);
  }

  function ecranAide(hote) {
    const s = el('section', 'aide');

    const pannes = el('div', 'aide-bloc');
    pannes.appendChild(el('h2', null, 'Quand ça ne marche pas.'));
    D.depannage.forEach((d) => {
      const bloc = el('div', 'panne');
      bloc.appendChild(el('div', 'panne-titre', d.p));
      d.c.forEach((c) => bloc.appendChild(el('div', 'panne-cause', '– ' + c)));
      pannes.appendChild(bloc);
    });
    s.appendChild(pannes);

    const fiche = el('div', 'fiche-bloc');
    fiche.appendChild(el('div', 'kicker', 'Fiche technique'));
    D.fiche.forEach((f) => {
      const ligne = el('div', 'fiche-ligne');
      ligne.appendChild(el('span', null, f[0]));
      ligne.appendChild(el('span', null, f[1]));
      fiche.appendChild(ligne);
    });
    s.appendChild(fiche);

    const choix = el('div', 'fiche-bloc');
    choix.appendChild(el('div', 'kicker', 'Écran d’accueil'));
    const liste = el('div', 'choix-accueil');
    ACCUEILS.forEach((a) => {
      const actif = etat.accueil === a.id;
      const b = bouton('choix-ligne' + (actif ? ' is-actif' : ''), null, () => {
        etat.accueil = a.id;
        enregistrerAccueil(a.id);
        etat.expl = null;
        rendre();
      });
      b.setAttribute('aria-pressed', actif ? 'true' : 'false');
      b.appendChild(el('i', null, actif ? '●' : '○'));
      const txt = el('b', null, a.titre);
      txt.appendChild(el('small', null, a.desc));
      b.appendChild(txt);
      liste.appendChild(b);
    });
    choix.appendChild(liste);
    s.appendChild(choix);

    const install = el('div', 'fiche-bloc');
    install.appendChild(el('div', 'kicker', 'Garder le guide sous la main'));
    const p = el('p', 'panne-cause', 'Sur téléphone, « Ajouter à l’écran d’accueil » installe le guide comme une application. Il fonctionne ensuite sans réseau, devant le boîtier. Rien n’est envoyé nulle part.');
    p.style.textIndent = '0';
    p.style.paddingLeft = '0';
    install.appendChild(p);
    s.appendChild(install);

    hote.appendChild(s);
  }

  /* ── assemblage ───────────────────────────────────────────────────── */

  const ecran = document.getElementById('ecran');
  const navBoutons = {};

  (function construireNav() {
    const nav = document.querySelector('.nav-bas');
    [
      ['home', 'Accueil'], ['panneau', 'Boîtier'], ['guides', 'Guides'],
      ['sim', 'Simulateur'], ['aide', 'Aide']
    ].forEach(([id, texte]) => {
      const b = bouton(null, texte, () => { allerA(id); window.scrollTo(0, 0); });
      navBoutons[id] = b;
      nav.appendChild(b);
    });
  }());

  function rendre() {
    const e = etat.ecran;
    const estHome = e === 'home';
    const estHomePanneau = estHome && etat.accueil === 'panneau';
    const estHomeIndex = estHome && etat.accueil === 'index';
    const estHomeEtat = estHome && etat.accueil === 'etat';
    const estGuide = e === 'guide';
    const estGuides = e === 'guides';
    const estSim = e === 'sim';
    const estPanneau = e === 'panneau';
    const estAide = e === 'aide';

    ecran.textContent = '';

    if (estHomePanneau) ecranAccueilA(ecran);
    if (estHomePanneau || estPanneau) figurePhoto(ecran);
    if (estHomeIndex) ecranAccueilB(ecran);
    if (estHomeEtat) ecranAccueilC(ecran);
    if (estGuide) ecranGuideTete(ecran);
    if (estSim) ecranSimTete(ecran);
    if (estPanneau || estGuide || estSim || estHomePanneau) ecran.appendChild(panneau);
    if (estGuide) ecranGuideNav(ecran);
    if (estHomePanneau || estGuides) ecranListeGuides(ecran);
    if (estPanneau) ecranLexique(ecran);
    if (estAide) ecranAide(ecran);

    ecran.appendChild(el('div', 'espace'));

    majPanneau();

    Object.keys(navBoutons).forEach((k) => {
      const actif = (k === 'home' && estHome)
        || (k === 'panneau' && estPanneau)
        || (k === 'guides' && (estGuides || estGuide))
        || (k === 'sim' && estSim)
        || (k === 'aide' && estAide);
      navBoutons[k].classList.toggle('is-actif', actif);
    });
  }

  /* Le temps qui passe dans le simulateur : 30 secondes d'arrosage
     par seconde réelle, pour voir un cycle complet sans attendre. */
  setInterval(function () {
    const sim = etat.sim;
    sim.tick += 1;
    if (sim.manual && sim.manual.phase === 'running') {
      sim.manual.remaining -= 30;
      if (sim.manual.remaining <= 0) sim.manual = stationSuivante(sim, sim.manual);
    }
    if (etat.ecran === 'sim') majPanneau();
  }, 1000);

  rendre();

  /* Mode hors ligne : seulement quand la page est servie par un site. */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* tant pis, l'app marche quand même */ });
    });
  }
}());
