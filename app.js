/* =========================================================
   ZIAPOPO FC — Manager
   App autonome (localStorage) — déployable sur GitHub Pages
========================================================= */

const STORAGE_KEY = "ziapopofc:data";

const FORMATIONS = {
  "4-3-3": [
    { key: "GK", label: "GB", x: 50, y: 90 },
    { key: "LB", label: "DG", x: 15, y: 70 },
    { key: "CB1", label: "DC", x: 35, y: 74 },
    { key: "CB2", label: "DC", x: 65, y: 74 },
    { key: "RB", label: "DD", x: 85, y: 70 },
    { key: "CM1", label: "MC", x: 30, y: 48 },
    { key: "CM2", label: "MC", x: 50, y: 53 },
    { key: "CM3", label: "MC", x: 70, y: 48 },
    { key: "LW", label: "AIG", x: 18, y: 18 },
    { key: "ST", label: "BU", x: 50, y: 12 },
    { key: "RW", label: "AID", x: 82, y: 18 },
  ],
  "4-4-2": [
    { key: "GK", label: "GB", x: 50, y: 90 },
    { key: "LB", label: "DG", x: 15, y: 70 },
    { key: "CB1", label: "DC", x: 35, y: 74 },
    { key: "CB2", label: "DC", x: 65, y: 74 },
    { key: "RB", label: "DD", x: 85, y: 70 },
    { key: "LM", label: "MG", x: 15, y: 46 },
    { key: "CM1", label: "MC", x: 38, y: 50 },
    { key: "CM2", label: "MC", x: 62, y: 50 },
    { key: "RM", label: "MD", x: 85, y: 46 },
    { key: "ST1", label: "BU", x: 38, y: 15 },
    { key: "ST2", label: "BU", x: 62, y: 15 },
  ],
  "4-2-3-1": [
    { key: "GK", label: "GB", x: 50, y: 90 },
    { key: "LB", label: "DG", x: 15, y: 70 },
    { key: "CB1", label: "DC", x: 35, y: 74 },
    { key: "CB2", label: "DC", x: 65, y: 74 },
    { key: "RB", label: "DD", x: 85, y: 70 },
    { key: "CDM1", label: "MDC", x: 38, y: 58 },
    { key: "CDM2", label: "MDC", x: 62, y: 58 },
    { key: "LW", label: "MOG", x: 18, y: 32 },
    { key: "CAM", label: "MOC", x: 50, y: 30 },
    { key: "RW", label: "MOD", x: 82, y: 32 },
    { key: "ST", label: "BU", x: 50, y: 12 },
  ],
  "3-5-2": [
    { key: "GK", label: "GB", x: 50, y: 90 },
    { key: "CB1", label: "DC", x: 28, y: 74 },
    { key: "CB2", label: "DC", x: 50, y: 77 },
    { key: "CB3", label: "DC", x: 72, y: 74 },
    { key: "LWB", label: "DLG", x: 10, y: 50 },
    { key: "CM1", label: "MC", x: 35, y: 48 },
    { key: "CM2", label: "MC", x: 50, y: 53 },
    { key: "CM3", label: "MC", x: 65, y: 48 },
    { key: "RWB", label: "DLD", x: 90, y: 50 },
    { key: "ST1", label: "BU", x: 38, y: 15 },
    { key: "ST2", label: "BU", x: 62, y: 15 },
  ],
};

const POSTES = ["GB", "DC", "DG", "DD", "MDC", "MC", "MOC", "MG", "MD", "AIG", "AID", "BU"];
const STATUTS = ["Titulaire", "Rotation", "Réserve", "En essai"];
const STATUT_COLOR = { Titulaire: "#16C172", Rotation: "#D4AF37", "Réserve": "#5C6773", "En essai": "#4C8DFF" };

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  effectif: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  compos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  matchs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1-2 4h-1M7 5H4a2 2 0 0 0 2 4h1"/></svg>',
};

const TABS = [
  { key: "dashboard", label: "Tableau de bord", icon: "dashboard" },
  { key: "effectif", label: "Effectif", icon: "effectif" },
  { key: "compos", label: "Compositions", icon: "compos" },
  { key: "matchs", label: "Matchs", icon: "matchs" },
  { key: "stats", label: "Statistiques", icon: "stats" },
];

/* ---------------------------- State ---------------------------- */

function loadState() {
  const fallback = {
    clubName: "ZIAPOPO FC",
    players: [],
    compositions: [],
    matches: [],
    championships: [],
    editions: [],
    stats: {},
    tab: "dashboard",
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch (e) {
    console.error("Erreur de lecture du stockage", e);
    return fallback;
  }
}

let STATE = loadState();

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch (e) {
    console.error("Erreur de sauvegarde", e);
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------------------------- Helpers ---------------------------- */

function esc(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function matchResult(score) {
  if (!score || !score.includes("-")) return null;
  const [a, b] = score.split("-").map((s) => parseInt(s.trim(), 10));
  if (isNaN(a) || isNaN(b)) return null;
  if (a > b) return "V";
  if (a < b) return "D";
  return "N";
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return d;
  }
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

/* ---------------------------- Render root ---------------------------- */

function render() {
  renderHeader();
  renderBottomNav();
  const view = document.getElementById("view");
  if (STATE.tab === "dashboard") view.innerHTML = renderDashboard();
  else if (STATE.tab === "effectif") view.innerHTML = renderEffectif();
  else if (STATE.tab === "compos") view.innerHTML = renderCompositions();
  else if (STATE.tab === "matchs") view.innerHTML = renderMatchs();
  else if (STATE.tab === "stats") view.innerHTML = renderStatistiques();
  attachViewHandlers();
}

function setTab(tab) {
  STATE.tab = tab;
  saveState();
  render();
}

/* ---------------------------- Header ---------------------------- */

function renderHeader() {
  const zone = document.getElementById("clubNameZone");
  zone.innerHTML = `<div class="club-name" id="clubNameDisplay" title="Toucher pour renommer le club">${esc(STATE.clubName)}</div>`;
  document.getElementById("clubNameDisplay").addEventListener("click", () => {
    zone.innerHTML = `
      <div class="form-row">
        <input class="club-name-input" id="clubNameInput" value="${esc(STATE.clubName)}" />
        <button class="btn-icon" id="clubNameSave" style="color:var(--green);">${ICONS.check}</button>
      </div>`;
    const input = document.getElementById("clubNameInput");
    input.focus();
    input.select();
    const commit = () => {
      STATE.clubName = input.value.trim() || "ZIAPOPO FC";
      saveState();
      render();
    };
    document.getElementById("clubNameSave").addEventListener("click", commit);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); });
  });
}

function renderBottomNav() {
  const nav = document.getElementById("bottomNav");
  nav.innerHTML = TABS.map(
    (t) => `
    <button class="nav-btn ${STATE.tab === t.key ? "active" : ""}" data-tab="${t.key}">
      ${ICONS[t.icon]}
      <span class="nav-label">${t.label}</span>
    </button>`
  ).join("");
  nav.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => setTab(btn.dataset.tab));
  });
}

/* ---------------------------- Dashboard ---------------------------- */

function renderDashboard() {
  const { players, matches, compositions, clubName } = STATE;
  const sorted = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  const next = sorted.find((m) => m.date && new Date(m.date) >= now && !m.score);
  const played = [...matches].filter((m) => m.score).sort((a, b) => new Date(b.date) - new Date(a.date));
  const last = played[0];
  const last5 = played.slice(0, 5);

  const record = played.reduce(
    (acc, m) => {
      const r = matchResult(m.score);
      if (r === "V") acc.v++; else if (r === "N") acc.n++; else if (r === "D") acc.d++;
      return acc;
    },
    { v: 0, n: 0, d: 0 }
  );

  const dispo = players.filter((p) => p.dispo !== false).length;
  const indispo = players.length - dispo;

  return `
  <div class="stack">
    <div class="grid2">
      <div class="card card-pad">
        <div class="eyebrow">Effectif</div>
        <div class="stat-value">${players.length}</div>
        <div class="stat-sub">joueurs enregistrés</div>
      </div>
      <div class="card card-pad">
        <div class="eyebrow">Disponibles</div>
        <div class="stat-value" style="color:var(--green);">${dispo}</div>
        <div class="stat-sub">${indispo} indisponible(s)</div>
      </div>
    </div>

    <div class="card card-pad">
      <div class="eyebrow">Prochain rendez-vous</div>
      ${next ? `
        <div style="font-family:'Oswald',sans-serif;font-size:22px;font-weight:600;">${esc(clubName)} vs ${esc(next.adversaire || "?")}</div>
        <div style="color:var(--muted);font-size:13px;margin-top:4px;">${formatDate(next.date)} ${next.competition ? "· " + esc(next.competition) : ""}</div>
      ` : `<div style="color:var(--muted2);font-size:14px;">Aucun match programmé. Ajoute-le dans l'onglet Matchs.</div>`}
    </div>

    <div class="card card-pad">
      <div class="eyebrow">Forme actuelle (5 derniers)</div>
      ${last5.length === 0 ? `<div style="color:var(--muted2);font-size:14px;">Pas encore de résultat enregistré.</div>` : `
        <div style="display:flex;gap:8px;margin-top:4px;">
          ${last5.map((m) => {
            const r = matchResult(m.score);
            const c = r === "V" ? "var(--green)" : r === "D" ? "var(--red)" : "var(--gold)";
            return `<div title="${esc(m.adversaire || "?")} · ${esc(m.score || "")}" style="width:30px;height:30px;border-radius:8px;background:${c}22;color:${c};display:flex;align-items:center;justify-content:center;font-weight:700;font-family:'Oswald',sans-serif;font-size:13px;">${r}</div>`;
          }).join("")}
        </div>
      `}
    </div>

    <div class="grid3">
      <div class="card card-pad-sm">
        <div class="eyebrow">Victoires</div>
        <div class="stat-value-sm" style="color:var(--green);">${record.v}</div>
      </div>
      <div class="card card-pad-sm">
        <div class="eyebrow">Nuls</div>
        <div class="stat-value-sm" style="color:var(--gold);">${record.n}</div>
      </div>
      <div class="card card-pad-sm">
        <div class="eyebrow">Défaites</div>
        <div class="stat-value-sm" style="color:var(--red);">${record.d}</div>
      </div>
    </div>

    ${last ? `
      <div class="card card-pad">
        <div class="eyebrow">Dernier résultat</div>
        <div style="font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;">${esc(clubName)} ${esc(last.score)} ${esc(last.adversaire)}</div>
      </div>` : ""}

    <div class="card card-pad">
      <div class="eyebrow">Compositions enregistrées</div>
      <div style="font-family:'Oswald',sans-serif;font-size:18px;font-weight:600;">${compositions.length} composition${compositions.length > 1 ? "s" : ""}</div>
    </div>
  </div>`;
}

/* ---------------------------- Effectif ---------------------------- */

let effectifQuery = "";
let effectifFilter = "Tous";

function renderEffectif() {
  const { players } = STATE;
  const filtered = players.filter((p) => {
    const matchQuery = (p.pseudo || "").toLowerCase().includes(effectifQuery.toLowerCase());
    const matchStatut = effectifFilter === "Tous" || p.statut === effectifFilter;
    return matchQuery && matchStatut;
  });

  return `
  <div class="stack">
    <div class="form-row">
      <div class="search-wrap">
        <span class="search-icon">${ICONS.search}</span>
        <input class="input search-input" id="effectifSearch" placeholder="Rechercher un joueur…" value="${esc(effectifQuery)}" />
      </div>
      <button class="btn-primary" id="addPlayerBtn" style="width:44px;padding:0;flex-shrink:0;">${ICONS.plus}</button>
    </div>

    <div class="chip-row">
      ${["Tous", ...STATUTS].map((s) => `<button class="chip ${effectifFilter === s ? "active" : ""}" data-filter="${esc(s)}">${s}</button>`).join("")}
    </div>

    ${filtered.length === 0 ? `
      <div class="card empty-card">${players.length === 0 ? "Aucun joueur pour l'instant. Ajoute ton premier joueur." : "Aucun joueur ne correspond."}</div>
    ` : `
      <div class="stack-sm">
        ${filtered.map(renderPlayerRow).join("")}
      </div>
    `}
  </div>`;
}

function renderPlayerRow(p) {
  const color = STATUT_COLOR[p.statut] || "#8B93A1";
  return `
  <div class="card player-row" data-player-id="${p.id}">
    <div class="player-avatar">${esc(p.poste || "?")}</div>
    <div style="flex:1;min-width:0;">
      <div class="player-name">${esc(p.pseudo || "Sans pseudo")}</div>
      <div class="player-tags">
        <span class="pill" style="color:${color};background:${color}22;">${esc(p.statut || "Rotation")}</span>
        ${p.niveau ? `<span class="pill" style="color:var(--muted);background:rgba(139,147,161,0.12);">Niv. ${esc(p.niveau)}</span>` : ""}
        ${p.dispo === false ? `<span class="pill" style="color:var(--red);background:rgba(255,93,108,0.12);">Indisponible</span>` : ""}
      </div>
    </div>
    <div class="btn-row">
      <button class="btn-icon edit-player-btn" data-id="${p.id}">${ICONS.pencil}</button>
      <button class="btn-icon delete-player-btn" data-id="${p.id}">${ICONS.trash}</button>
    </div>
  </div>`;
}

function openPlayerModal(player) {
  const isNew = !player;
  const p = player || { id: uid(), pseudo: "", poste: "MC", posteSecondaire: "", niveau: "", statut: "Rotation", dispo: true, heureConnexion: "", commentaires: "" };

  showModal(isNew ? "Nouveau joueur" : "Modifier le joueur", `
    <div class="field">
      <div class="field-label">Pseudo</div>
      <input class="input" id="f_pseudo" value="${esc(p.pseudo)}" placeholder="Ex: RoyalStriker9" />
    </div>
    <div class="grid2">
      <div class="field">
        <div class="field-label">Poste principal</div>
        <select class="input" id="f_poste">${POSTES.map((x) => `<option value="${x}" ${x === p.poste ? "selected" : ""}>${x}</option>`).join("")}</select>
      </div>
      <div class="field">
        <div class="field-label">Poste secondaire</div>
        <select class="input" id="f_posteSec">
          <option value="" ${!p.posteSecondaire ? "selected" : ""}>—</option>
          ${POSTES.map((x) => `<option value="${x}" ${x === p.posteSecondaire ? "selected" : ""}>${x}</option>`).join("")}
        </select>
      </div>
    </div>
    <div class="grid2">
      <div class="field">
        <div class="field-label">Niveau</div>
        <input class="input" id="f_niveau" value="${esc(p.niveau)}" placeholder="Ex: 89" />
      </div>
      <div class="field">
        <div class="field-label">Statut</div>
        <select class="input" id="f_statut">${STATUTS.map((x) => `<option value="${x}" ${x === p.statut ? "selected" : ""}>${x}</option>`).join("")}</select>
      </div>
    </div>
    <div class="field">
      <div class="field-label">Heure habituelle de connexion</div>
      <input class="input" id="f_heure" value="${esc(p.heureConnexion)}" placeholder="Ex: 20h - 23h" />
    </div>
    <div class="field">
      <div class="field-label">Commentaires internes</div>
      <textarea class="input" id="f_comments" style="min-height:70px;resize:vertical;">${esc(p.commentaires)}</textarea>
    </div>
    <label class="checkbox-row">
      <input type="checkbox" id="f_dispo" ${p.dispo ? "checked" : ""} />
      Disponible actuellement
    </label>
    <button class="btn-primary" id="savePlayerBtn">Enregistrer</button>
  `);

  const pseudoInput = document.getElementById("f_pseudo");
  const saveBtn = document.getElementById("savePlayerBtn");
  const toggleSave = () => { saveBtn.disabled = !pseudoInput.value.trim(); };
  pseudoInput.addEventListener("input", toggleSave);
  toggleSave();

  saveBtn.addEventListener("click", () => {
    const updated = {
      id: p.id,
      pseudo: pseudoInput.value.trim(),
      poste: document.getElementById("f_poste").value,
      posteSecondaire: document.getElementById("f_posteSec").value,
      niveau: document.getElementById("f_niveau").value,
      statut: document.getElementById("f_statut").value,
      heureConnexion: document.getElementById("f_heure").value,
      commentaires: document.getElementById("f_comments").value,
      dispo: document.getElementById("f_dispo").checked,
    };
    if (!updated.pseudo) return;
    const idx = STATE.players.findIndex((x) => x.id === p.id);
    if (idx >= 0) STATE.players[idx] = updated; else STATE.players.push(updated);
    saveState();
    closeModal();
    render();
  });
}

/* ---------------------------- Compositions ---------------------------- */

let compoFormation = "4-3-3";
let compoName = "";
let compoSlots = {};
let compoLoadedId = null;
let compoActiveSlot = null;

let statsActiveChampionship = null;
let statsActiveEdition = null;

function renderCompositions() {
  const { players, compositions } = STATE;
  const layout = FORMATIONS[compoFormation];

  return `
  <div class="stack">
    <div class="chip-row">
      ${Object.keys(FORMATIONS).map((f) => `<button class="chip chip-lg ${compoFormation === f ? "active" : ""}" data-formation="${f}">${f}</button>`).join("")}
    </div>

    <input class="input" id="compoNameInput" placeholder="Nom de la composition (ex: Équipe A — Ligue)" value="${esc(compoName)}" />

    <div class="card card-pad-sm">
      <div class="pitch" id="pitch">
        <div class="pitch-border"></div>
        <div class="pitch-circle"></div>
        ${layout.map((slot) => {
          const playerId = compoSlots[slot.key];
          const player = players.find((p) => p.id === playerId);
          return `
          <button class="slot-btn" data-slot="${slot.key}" style="left:${slot.x}%;top:${slot.y}%;">
            <div class="slot-dot ${player ? "filled" : "empty"}">${slot.label}</div>
            <div class="slot-name">${esc(player ? player.pseudo : "vide")}</div>
          </button>`;
        }).join("")}
      </div>
    </div>

    <div class="btn-row">
      <button class="btn-primary" id="saveCompoBtn" style="flex:1;">${ICONS.check} ${compoLoadedId ? "Mettre à jour" : "Enregistrer"}</button>
      <button class="btn-ghost" id="generateVisualBtn">${ICONS.download} Générer le visuel</button>
    </div>
    ${compoLoadedId ? `<button class="btn-ghost" id="newCompoBtn">+ Nouvelle composition</button>` : ""}

    <canvas id="compoCanvas" style="display:none;"></canvas>

    ${compositions.length > 0 ? `
      <div>
        <div class="eyebrow">Compositions enregistrées</div>
        <div class="stack-sm">
          ${compositions.map((c) => `
            <div class="card card-pad-sm" style="display:flex;align-items:center;justify-content:space-between;">
              <div class="load-compo-btn" data-id="${c.id}" style="cursor:pointer;">
                <div style="font-weight:600;font-size:14px;">${esc(c.name)}</div>
                <div style="color:var(--muted2);font-size:12px;">${esc(c.formation)}</div>
              </div>
              <button class="btn-icon delete-compo-btn" data-id="${c.id}">${ICONS.trash}</button>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  </div>`;
}

function openSlotModal(slotKey) {
  const layout = FORMATIONS[compoFormation];
  const slot = layout.find((l) => l.key === slotKey);
  const assignedIds = new Set(Object.values(compoSlots));
  const { players } = STATE;

  showModal(`Assigner — ${slot.label}`, `
    <div class="stack-sm">
      <button class="input clear-slot-btn" style="text-align:left;color:var(--muted);cursor:pointer;">— Laisser vide</button>
      ${players.length === 0 ? `<div style="color:var(--muted2);font-size:13px;">Ajoute des joueurs dans l'onglet Effectif d'abord.</div>` : players.map((p) => `
        <button class="input pick-player-btn" data-id="${p.id}" style="text-align:left;cursor:pointer;display:flex;justify-content:space-between;opacity:${assignedIds.has(p.id) && compoSlots[slotKey] !== p.id ? 0.4 : 1};">
          <span>${esc(p.pseudo)}</span><span style="color:var(--muted2);">${esc(p.poste)}</span>
        </button>
      `).join("")}
    </div>
  `);

  document.querySelector(".clear-slot-btn").addEventListener("click", () => {
    delete compoSlots[slotKey];
    closeModal();
    render();
  });
  document.querySelectorAll(".pick-player-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      compoSlots[slotKey] = btn.dataset.id;
      closeModal();
      render();
    });
  });
}

function generateVisual() {
  const canvas = document.getElementById("compoCanvas");
  const W = 1000, H = 1250;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const { players, clubName } = STATE;
  const layout = FORMATIONS[compoFormation];

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0E1520"); bg.addColorStop(1, "#070A0D");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#1FE08A";
  ctx.font = "700 22px Oswald, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("COMPOSITION OFFICIELLE", W / 2, 60);
  ctx.fillStyle = "#EDEFF3";
  ctx.font = "700 42px Oswald, sans-serif";
  ctx.fillText(clubName.toUpperCase(), W / 2, 108);
  ctx.fillStyle = "#8B93A1";
  ctx.font = "500 20px Inter, sans-serif";
  ctx.fillText(`Formation ${compoFormation} — ${compoName || "Sans nom"}`, W / 2, 138);

  const pitchX = 60, pitchY = 170, pitchW = W - 120, pitchH = 980;
  ctx.fillStyle = "#123322";
  roundRect(ctx, pitchX, pitchY, pitchW, pitchH, 18);
  ctx.fill();
  ctx.save();
  ctx.clip();
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.05)";
    ctx.fillRect(pitchX, pitchY + (pitchH / 10) * i, pitchW, pitchH / 10);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(pitchX + 20, pitchY + 20, pitchW - 40, pitchH - 40);
  ctx.beginPath();
  ctx.arc(W / 2, pitchY + pitchH / 2, 90, 0, Math.PI * 2);
  ctx.stroke();

  layout.forEach((slot) => {
    const px = pitchX + (slot.x / 100) * pitchW;
    const py = pitchY + (slot.y / 100) * pitchH;
    const playerId = compoSlots[slot.key];
    const player = players.find((p) => p.id === playerId);

    ctx.beginPath();
    ctx.arc(px, py, 34, 0, Math.PI * 2);
    ctx.fillStyle = player ? "#1FE08A" : "rgba(255,255,255,0.08)";
    ctx.fill();
    ctx.textAlign = "center";
    if (player) {
      ctx.fillStyle = "#06120B";
      ctx.font = "700 20px Oswald, sans-serif";
      ctx.fillText(slot.label, px, py + 7);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "600 15px Inter, sans-serif";
      ctx.fillText(slot.label, px, py + 5);
    }
    ctx.fillStyle = "#EDEFF3";
    ctx.font = "700 17px Inter, sans-serif";
    ctx.fillText(truncate(player ? player.pseudo : "—", 16), px, py + 56);
  });

  ctx.textAlign = "left";
  ctx.fillStyle = "#4C5560";
  ctx.font = "500 14px Inter, sans-serif";
  ctx.fillText(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pitchX, H - 20);

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(compoName || "composition").replace(/\s+/g, "_")}.png`;
  a.click();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------------------------- Matchs ---------------------------- */

function renderMatchs() {
  const { matches, players } = STATE;
  const sorted = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));

  return `
  <div class="stack">
    <button class="btn-primary" id="addMatchBtn">${ICONS.plus} Ajouter un match</button>
    ${sorted.length === 0 ? `<div class="card empty-card">Aucun match enregistré.</div>` : sorted.map((m) => {
      const r = matchResult(m.score);
      const c = r === "V" ? "var(--green)" : r === "D" ? "var(--red)" : r === "N" ? "var(--gold)" : "var(--muted2)";
      const homme = players.find((p) => p.id === m.homme);
      return `
      <div class="card card-pad" data-match-id="${m.id}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-family:'Oswald',sans-serif;font-size:17px;font-weight:600;">vs ${esc(m.adversaire || "?")}</div>
            <div style="color:var(--muted2);font-size:12px;margin-top:2px;">${formatDate(m.date)} ${m.competition ? "· " + esc(m.competition) : ""}</div>
          </div>
          ${m.score ? `<div style="font-family:'Oswald',sans-serif;font-size:20px;font-weight:700;color:${c};">${esc(m.score)}</div>` : `<span class="pill" style="color:var(--muted);background:rgba(139,147,161,0.12);">À venir</span>`}
        </div>
        ${(m.homme || m.commentaires) ? `
          <div style="margin-top:8px;font-size:13px;color:var(--muted);">
            ${m.homme ? `<div>⭐ Homme du match : ${esc(homme ? homme.pseudo : m.homme)}</div>` : ""}
            ${m.commentaires ? `<div style="margin-top:2px;">${esc(m.commentaires)}</div>` : ""}
          </div>` : ""}
        <div class="btn-row" style="margin-top:10px;">
          <button class="btn-ghost edit-match-btn" data-id="${m.id}" style="flex:1;">${ICONS.pencil} Modifier</button>
          <button class="btn-ghost delete-match-btn" data-id="${m.id}" style="width:44px;">${ICONS.trash}</button>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function openMatchModal(match) {
  const isNew = !match;
  const m = match || { id: uid(), adversaire: "", competition: "", date: "", score: "", homme: "", commentaires: "" };
  const { players } = STATE;

  showModal(isNew ? "Nouveau match" : "Modifier le match", `
    <div class="field">
      <div class="field-label">Adversaire</div>
      <input class="input" id="m_adversaire" value="${esc(m.adversaire)}" />
    </div>
    <div class="grid2">
      <div class="field">
        <div class="field-label">Compétition</div>
        <input class="input" id="m_competition" value="${esc(m.competition)}" placeholder="Ligue / Coupe / Amical" />
      </div>
      <div class="field">
        <div class="field-label">Date</div>
        <input class="input" type="datetime-local" id="m_date" value="${esc((m.date || "").slice(0, 16))}" />
      </div>
    </div>
    <div class="field">
      <div class="field-label">Score (laisser vide si à venir)</div>
      <input class="input" id="m_score" value="${esc(m.score)}" placeholder="Ex: 3-1" />
    </div>
    <div class="field">
      <div class="field-label">Homme du match</div>
      <select class="input" id="m_homme">
        <option value="">—</option>
        ${players.map((p) => `<option value="${p.id}" ${p.id === m.homme ? "selected" : ""}>${esc(p.pseudo)}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <div class="field-label">Commentaires</div>
      <textarea class="input" id="m_comments" style="min-height:60px;">${esc(m.commentaires)}</textarea>
    </div>
    <button class="btn-primary" id="saveMatchBtn">Enregistrer</button>
  `);

  const advInput = document.getElementById("m_adversaire");
  const saveBtn = document.getElementById("saveMatchBtn");
  const toggleSave = () => { saveBtn.disabled = !advInput.value.trim(); };
  advInput.addEventListener("input", toggleSave);
  toggleSave();

  saveBtn.addEventListener("click", () => {
    const updated = {
      id: m.id,
      adversaire: advInput.value.trim(),
      competition: document.getElementById("m_competition").value,
      date: document.getElementById("m_date").value,
      score: document.getElementById("m_score").value,
      homme: document.getElementById("m_homme").value,
      commentaires: document.getElementById("m_comments").value,
    };
    if (!updated.adversaire) return;
    const idx = STATE.matches.findIndex((x) => x.id === m.id);
    if (idx >= 0) STATE.matches[idx] = updated; else STATE.matches.push(updated);
    saveState();
    closeModal();
    render();
  });
}

/* ---------------------------- Statistiques ---------------------------- */

function statKey(champId, editionId, playerId) {
  return `${champId}::${editionId}::${playerId}`;
}

function getStat(champId, editionId, playerId) {
  return STATE.stats[statKey(champId, editionId, playerId)] || { buts: 0, passes: 0, cleanSheets: 0 };
}

function setStatField(champId, editionId, playerId, field, value) {
  const key = statKey(champId, editionId, playerId);
  const current = STATE.stats[key] || { buts: 0, passes: 0, cleanSheets: 0 };
  const num = Math.max(0, parseInt(value, 10) || 0);
  STATE.stats[key] = { ...current, [field]: num };
  saveState();
}

function renderStatistiques() {
  const { championships, editions, players } = STATE;

  if (!statsActiveChampionship || !championships.find((c) => c.id === statsActiveChampionship)) {
    statsActiveChampionship = championships[0] ? championships[0].id : null;
  }
  const champ = championships.find((c) => c.id === statsActiveChampionship) || null;
  const champEditions = champ ? editions.filter((e) => e.championshipId === champ.id) : [];

  if (!champ || !statsActiveEdition || !champEditions.find((e) => e.id === statsActiveEdition)) {
    statsActiveEdition = champEditions[0] ? champEditions[0].id : null;
  }
  const edition = champEditions.find((e) => e.id === statsActiveEdition) || null;

  const rows = edition
    ? players.map((p) => ({ p, s: getStat(champ.id, edition.id, p.id) }))
    : [];

  const topScorers = [...rows].sort((a, b) => b.s.buts - a.s.buts).filter((r) => r.s.buts > 0).slice(0, 3);
  const topAssists = [...rows].sort((a, b) => b.s.passes - a.s.passes).filter((r) => r.s.passes > 0).slice(0, 3);
  const topKeepers = rows.filter((r) => r.p.poste === "GB").sort((a, b) => b.s.cleanSheets - a.s.cleanSheets).filter((r) => r.s.cleanSheets > 0).slice(0, 3);

  return `
  <div class="stack">
    <div class="form-row">
      <div class="chip-row" style="flex:1;">
        ${championships.length === 0 ? `<span style="color:var(--muted2);font-size:13px;">Aucun championnat pour l'instant.</span>` : championships.map((c) => `
          <button class="chip chip-lg champ-chip ${champ && champ.id === c.id ? "active" : ""}" data-id="${c.id}">${esc(c.name)}</button>
        `).join("")}
      </div>
      <button class="btn-icon" id="addChampBtn" style="flex-shrink:0;">${ICONS.plus}</button>
    </div>

    ${champ ? `
      <div class="form-row">
        <div class="chip-row" style="flex:1;">
          ${champEditions.length === 0 ? `<span style="color:var(--muted2);font-size:13px;">Aucune édition pour ${esc(champ.name)}.</span>` : champEditions.map((e) => `
            <button class="chip edition-chip ${edition && edition.id === e.id ? "active" : ""}" data-id="${e.id}">${esc(e.name)}</button>
          `).join("")}
        </div>
        <button class="btn-icon" id="addEditionBtn" style="flex-shrink:0;">${ICONS.plus}</button>
      </div>
      <button class="btn-ghost delete-champ-btn" data-id="${champ.id}" style="align-self:flex-start;">${ICONS.trash} Supprimer ce championnat</button>
    ` : `<div class="card empty-card">Crée un championnat pour commencer à suivre les statistiques.</div>`}

    ${champ && edition ? `
      ${(topScorers.length || topAssists.length || topKeepers.length) ? `
        <div class="grid3">
          <div class="card card-pad-sm">
            <div class="eyebrow">Buteurs</div>
            ${topScorers.length ? topScorers.map((r) => `<div style="font-size:13px;margin-top:4px;">${esc(r.p.pseudo)} · <b style="color:var(--green);">${r.s.buts}</b></div>`).join("") : `<div style="color:var(--muted2);font-size:12px;">—</div>`}
          </div>
          <div class="card card-pad-sm">
            <div class="eyebrow">Passeurs</div>
            ${topAssists.length ? topAssists.map((r) => `<div style="font-size:13px;margin-top:4px;">${esc(r.p.pseudo)} · <b style="color:var(--gold);">${r.s.passes}</b></div>`).join("") : `<div style="color:var(--muted2);font-size:12px;">—</div>`}
          </div>
          <div class="card card-pad-sm">
            <div class="eyebrow">Gardiens</div>
            ${topKeepers.length ? topKeepers.map((r) => `<div style="font-size:13px;margin-top:4px;">${esc(r.p.pseudo)} · <b style="color:#4C8DFF;">${r.s.cleanSheets}</b></div>`).join("") : `<div style="color:var(--muted2);font-size:12px;">—</div>`}
          </div>
        </div>
      ` : ""}

      <div>
        <div class="eyebrow">${esc(champ.name)} — ${esc(edition.name)}</div>
        ${players.length === 0 ? `<div class="card empty-card">Ajoute des joueurs dans l'onglet Effectif d'abord.</div>` : `
          <div class="stack-sm">
            ${rows.map(({ p, s }) => `
              <div class="card card-pad-sm">
                <div style="font-weight:600;font-size:14px;margin-bottom:8px;">${esc(p.pseudo)} <span style="color:var(--muted2);font-weight:500;font-size:12px;">(${esc(p.poste)})</span></div>
                <div class="grid3">
                  <div>
                    <div class="field-label">Buts</div>
                    <input class="input stat-input" type="number" min="0" inputmode="numeric" data-player="${p.id}" data-field="buts" value="${s.buts}" />
                  </div>
                  <div>
                    <div class="field-label">Passes D.</div>
                    <input class="input stat-input" type="number" min="0" inputmode="numeric" data-player="${p.id}" data-field="passes" value="${s.passes}" />
                  </div>
                  <div>
                    <div class="field-label">${p.poste === "GB" ? "Inviolabilité" : "Inviolabilité —"}</div>
                    <input class="input stat-input" type="number" min="0" inputmode="numeric" data-player="${p.id}" data-field="cleanSheets" value="${s.cleanSheets}" ${p.poste === "GB" ? "" : "disabled"} />
                  </div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    ` : ""}
  </div>`;
}

function openChampionshipModal() {
  showModal("Nouveau championnat", `
    <div class="field">
      <div class="field-label">Nom du championnat</div>
      <input class="input" id="champNameInput" placeholder="Ex: Ligue ProClubs Saison Live" />
    </div>
    <button class="btn-primary" id="saveChampBtn">Créer</button>
  `);
  const input = document.getElementById("champNameInput");
  input.focus();
  document.getElementById("saveChampBtn").addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return;
    const champ = { id: uid(), name };
    STATE.championships.push(champ);
    statsActiveChampionship = champ.id;
    statsActiveEdition = null;
    saveState();
    closeModal();
    render();
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") document.getElementById("saveChampBtn").click(); });
}

function openEditionModal(championshipId) {
  showModal("Nouvelle édition / saison", `
    <div class="field">
      <div class="field-label">Nom de l'édition</div>
      <input class="input" id="editionNameInput" placeholder="Ex: Saison 1, Édition Été 2026" />
    </div>
    <button class="btn-primary" id="saveEditionBtn">Créer</button>
  `);
  const input = document.getElementById("editionNameInput");
  input.focus();
  document.getElementById("saveEditionBtn").addEventListener("click", () => {
    const name = input.value.trim();
    if (!name) return;
    const edition = { id: uid(), championshipId, name };
    STATE.editions.push(edition);
    statsActiveEdition = edition.id;
    saveState();
    closeModal();
    render();
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") document.getElementById("saveEditionBtn").click(); });
}

/* ---------------------------- Modal ---------------------------- */

function showModal(title, bodyHtml) {
  const root = document.getElementById("modalRoot");
  root.innerHTML = `
    <div class="modal-overlay" id="modalOverlay">
      <div class="modal-sheet" id="modalSheet">
        <div class="modal-head">
          <div class="modal-title">${esc(title)}</div>
          <button class="btn-icon" id="modalCloseBtn">${ICONS.x}</button>
        </div>
        ${bodyHtml}
      </div>
    </div>`;
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
}

function closeModal() {
  document.getElementById("modalRoot").innerHTML = "";
}

/* ---------------------------- Event wiring ---------------------------- */

let deleteConfirmPlayerId = null;

function attachViewHandlers() {
  if (STATE.tab === "effectif") {
    const search = document.getElementById("effectifSearch");
    if (search) {
      search.addEventListener("input", () => { effectifQuery = search.value; render(); search.focus(); search.selectionStart = search.selectionEnd = search.value.length; });
    }
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => { effectifFilter = btn.dataset.filter; render(); });
    });
    const addBtn = document.getElementById("addPlayerBtn");
    if (addBtn) addBtn.addEventListener("click", () => openPlayerModal(null));
    document.querySelectorAll(".edit-player-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = STATE.players.find((x) => x.id === btn.dataset.id);
        openPlayerModal(p);
      });
    });
    document.querySelectorAll(".delete-player-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        STATE.players = STATE.players.filter((x) => x.id !== btn.dataset.id);
        saveState();
        render();
      });
    });
  }

  if (STATE.tab === "compos") {
    document.querySelectorAll("[data-formation]").forEach((btn) => {
      btn.addEventListener("click", () => {
        compoFormation = btn.dataset.formation;
        compoSlots = {};
        render();
      });
    });
    const nameInput = document.getElementById("compoNameInput");
    if (nameInput) nameInput.addEventListener("input", () => { compoName = nameInput.value; });

    document.querySelectorAll(".slot-btn").forEach((btn) => {
      btn.addEventListener("click", () => openSlotModal(btn.dataset.slot));
    });

    const saveBtn = document.getElementById("saveCompoBtn");
    if (saveBtn) saveBtn.addEventListener("click", () => {
      const comp = {
        id: compoLoadedId || uid(),
        name: compoName.trim() || `Compo ${new Date().toLocaleDateString("fr-FR")}`,
        formation: compoFormation,
        slots: compoSlots,
      };
      const idx = STATE.compositions.findIndex((c) => c.id === comp.id);
      if (idx >= 0) STATE.compositions[idx] = comp; else STATE.compositions.push(comp);
      compoLoadedId = comp.id;
      saveState();
      render();
    });

    const genBtn = document.getElementById("generateVisualBtn");
    if (genBtn) genBtn.addEventListener("click", generateVisual);

    const newBtn = document.getElementById("newCompoBtn");
    if (newBtn) newBtn.addEventListener("click", () => {
      compoFormation = "4-3-3"; compoSlots = {}; compoName = ""; compoLoadedId = null;
      render();
    });

    document.querySelectorAll(".load-compo-btn").forEach((el) => {
      el.addEventListener("click", () => {
        const c = STATE.compositions.find((x) => x.id === el.dataset.id);
        if (!c) return;
        compoFormation = c.formation; compoSlots = { ...c.slots }; compoName = c.name; compoLoadedId = c.id;
        render();
      });
    });
    document.querySelectorAll(".delete-compo-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        STATE.compositions = STATE.compositions.filter((x) => x.id !== btn.dataset.id);
        if (compoLoadedId === btn.dataset.id) { compoFormation = "4-3-3"; compoSlots = {}; compoName = ""; compoLoadedId = null; }
        saveState();
        render();
      });
    });
  }

  if (STATE.tab === "stats") {
    document.querySelectorAll(".champ-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        statsActiveChampionship = btn.dataset.id;
        statsActiveEdition = null;
        render();
      });
    });
    document.querySelectorAll(".edition-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        statsActiveEdition = btn.dataset.id;
        render();
      });
    });
    const addChampBtn = document.getElementById("addChampBtn");
    if (addChampBtn) addChampBtn.addEventListener("click", openChampionshipModal);

    const addEditionBtn = document.getElementById("addEditionBtn");
    if (addEditionBtn) addEditionBtn.addEventListener("click", () => openEditionModal(statsActiveChampionship));

    document.querySelectorAll(".delete-champ-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        STATE.championships = STATE.championships.filter((c) => c.id !== id);
        STATE.editions = STATE.editions.filter((e) => e.championshipId !== id);
        Object.keys(STATE.stats).forEach((k) => { if (k.startsWith(id + "::")) delete STATE.stats[k]; });
        statsActiveChampionship = null;
        statsActiveEdition = null;
        saveState();
        render();
      });
    });

    document.querySelectorAll(".stat-input").forEach((input) => {
      input.addEventListener("change", () => {
        setStatField(statsActiveChampionship, statsActiveEdition, input.dataset.player, input.dataset.field, input.value);
      });
    });
  }

  if (STATE.tab === "matchs") {
    const addBtn = document.getElementById("addMatchBtn");
    if (addBtn) addBtn.addEventListener("click", () => openMatchModal(null));
    document.querySelectorAll(".edit-match-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = STATE.matches.find((x) => x.id === btn.dataset.id);
        openMatchModal(m);
      });
    });
    document.querySelectorAll(".delete-match-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        STATE.matches = STATE.matches.filter((x) => x.id !== btn.dataset.id);
        saveState();
        render();
      });
    });
  }
}

/* ---------------------------- Init ---------------------------- */

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
