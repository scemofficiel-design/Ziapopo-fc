import { useState, useEffect, useRef, useCallback } from "react";
import { LayoutDashboard, Users, LayoutGrid, CalendarDays, Plus, X, Search, Trophy, Download, Trash2, Pencil, Check } from "lucide-react";

/* ---------------------------------------------------------
   ROYAL IMPACT MANAGER — QG de club EA SPORTS FC Clubs
   Palette: fond quasi-noir bleuté, vert pelouse premium, or "officiel"
   Display: Oswald (condensé, esprit broadcast sportif) / Body: Inter
--------------------------------------------------------- */

const FONT_LINK_ID = "rim-fonts";

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
const STATUT_COLOR = {
  Titulaire: "#16C172",
  Rotation: "#D4AF37",
  Réserve: "#5C6773",
  "En essai": "#4C8DFF",
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function useStorage(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await window.storage.get(key, false);
        if (mounted && res && res.value) setValue(JSON.parse(res.value));
      } catch (e) {
        // clé absente au premier lancement — on garde le fallback
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => (mounted = false);
  }, [key]);

  const persist = useCallback(
    async (next) => {
      setValue(next);
      try {
        await window.storage.set(key, JSON.stringify(next), false);
      } catch (e) {
        console.error("Erreur de sauvegarde", key, e);
      }
    },
    [key]
  );

  return [value, persist, loaded];
}

function injectFonts() {
  if (document.getElementById(FONT_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/* ---------------------------- UI atoms ---------------------------- */

function Card({ children, className = "", style = {} }) {
  return (
    <div
      className={className}
      style={{
        background: "#12161D",
        border: "1px solid #232A35",
        borderRadius: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, color = "#8B93A1", bg = "rgba(139,147,161,0.12)" }) {
  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
        color,
        background: bg,
        padding: "3px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.6,
        textTransform: "uppercase",
        color: "#6B7380",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, style = {}, type = "button", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: 14,
        color: "#06120B",
        background: disabled ? "#2A6B4D" : "linear-gradient(135deg,#1FE08A,#0FAE68)",
        border: "none",
        borderRadius: 10,
        padding: "11px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        color: "#C7CCD4",
        background: "#1A1F28",
        border: "1px solid #2A313D",
        borderRadius: 10,
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/* ---------------------------- App shell ---------------------------- */

const TABS = [
  { key: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "effectif", label: "Effectif", icon: Users },
  { key: "compos", label: "Compositions", icon: LayoutGrid },
  { key: "matchs", label: "Matchs", icon: CalendarDays },
];

export default function RoyalImpactManager() {
  useEffect(() => {
    injectFonts();
  }, []);

  const [tab, setTab] = useState("dashboard");
  const [players, setPlayers, playersLoaded] = useStorage("rim:players", []);
  const [compositions, setCompositions, composLoaded] = useStorage("rim:compositions", []);
  const [matches, setMatches, matchesLoaded] = useStorage("rim:matches", []);
  const [clubName, setClubName] = useStorage("rim:clubname", "ZIAPOPO FC");

  const ready = playersLoaded && composLoaded && matchesLoaded;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #131B18 0%, #090B0F 55%, #07090C 100%)",
        color: "#EDEFF3",
        fontFamily: "Inter, sans-serif",
        paddingBottom: 84,
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #2A313D; border-radius: 8px; }
        button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #1FE08A; outline-offset: 1px; }
      `}</style>

      <Header clubName={clubName} setClubName={setClubName} />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "16px 14px 0" }}>
        {!ready ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6B7380" }}>
            Chargement du club…
          </div>
        ) : tab === "dashboard" ? (
          <Dashboard players={players} matches={matches} compositions={compositions} clubName={clubName} />
        ) : tab === "effectif" ? (
          <Effectif players={players} setPlayers={setPlayers} />
        ) : tab === "compos" ? (
          <Compositions
            players={players}
            compositions={compositions}
            setCompositions={setCompositions}
            clubName={clubName}
          />
        ) : (
          <Matchs matches={matches} setMatches={setMatches} players={players} />
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function Header({ clubName, setClubName }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(clubName);
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(10px)",
        background: "rgba(9,11,15,0.85)",
        borderBottom: "1px solid #1C2128",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "linear-gradient(135deg,#1FE08A,#0B7A48)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Oswald, sans-serif",
            fontWeight: 700,
            color: "#06120B",
          }}
        >
          <Trophy size={18} strokeWidth={2.4} />
        </div>
        {editing ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              style={{
                background: "#161B22",
                border: "1px solid #2A313D",
                borderRadius: 8,
                color: "#EDEFF3",
                fontFamily: "Oswald, sans-serif",
                fontSize: 16,
                padding: "4px 8px",
                width: 160,
              }}
            />
            <button
              onClick={() => {
                setClubName(draft.trim() || "ZIAPOPO FC");
                setEditing(false);
              }}
              style={{ background: "none", border: "none", color: "#1FE08A", cursor: "pointer" }}
            >
              <Check size={18} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => {
              setDraft(clubName);
              setEditing(true);
            }}
            style={{
              fontFamily: "Oswald, sans-serif",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: 0.3,
              cursor: "pointer",
            }}
            title="Toucher pour renommer le club"
          >
            {clubName}
          </div>
        )}
      </div>
      <Pill color="#1FE08A" bg="rgba(31,224,138,0.12)">EA SPORTS FC CLUBS</Pill>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        background: "rgba(11,14,18,0.94)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid #1C2128",
        display: "flex",
        justifyContent: "space-around",
        padding: "8px 6px calc(8px + env(safe-area-inset-bottom))",
      }}
    >
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 8px",
              color: active ? "#1FE08A" : "#6B7380",
              cursor: "pointer",
              flex: 1,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------------------- Dashboard ---------------------------- */

function Dashboard({ players, matches, compositions, clubName }) {
  const sorted = [...matches].sort((a, b) => new Date(a.date) - new Date(b.date));
  const now = new Date();
  const next = sorted.find((m) => m.date && new Date(m.date) >= now && !m.score);
  const played = [...matches].filter((m) => m.score).sort((a, b) => new Date(b.date) - new Date(a.date));
  const last = played[0];
  const last5 = played.slice(0, 5);

  const record = played.reduce(
    (acc, m) => {
      const r = matchResult(m.score);
      if (r === "V") acc.v++;
      else if (r === "N") acc.n++;
      else if (r === "D") acc.d++;
      return acc;
    },
    { v: 0, n: 0, d: 0 }
  );

  const dispo = players.filter((p) => p.dispo !== false).length;
  const indispo = players.length - dispo;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatCard label="Effectif" value={players.length} sub="joueurs enregistrés" />
        <StatCard label="Disponibles" value={dispo} sub={`${indispo} indisponible(s)`} accent="#1FE08A" />
      </div>

      <Card style={{ padding: 16 }}>
        <Eyebrow>Prochain rendez-vous</Eyebrow>
        {next ? (
          <div>
            <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 22, fontWeight: 600 }}>
              {clubName} vs {next.adversaire || "?"}
            </div>
            <div style={{ color: "#8B93A1", fontSize: 13, marginTop: 4 }}>
              {formatDate(next.date)} {next.competition ? `· ${next.competition}` : ""}
            </div>
          </div>
        ) : (
          <div style={{ color: "#6B7380", fontSize: 14 }}>Aucun match programmé. Ajoute-le dans l'onglet Matchs.</div>
        )}
      </Card>

      <Card style={{ padding: 16 }}>
        <Eyebrow>Forme actuelle (5 derniers)</Eyebrow>
        {last5.length === 0 ? (
          <div style={{ color: "#6B7380", fontSize: 14 }}>Pas encore de résultat enregistré.</div>
        ) : (
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            {last5.map((m) => {
              const r = matchResult(m.score);
              const c = r === "V" ? "#1FE08A" : r === "D" ? "#FF5D6C" : "#D4AF37";
              return (
                <div
                  key={m.id}
                  title={`${m.adversaire || "?"} · ${m.score || ""}`}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: `${c}22`,
                    color: c,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontFamily: "Oswald, sans-serif",
                    fontSize: 13,
                  }}
                >
                  {r}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <StatCard label="Victoires" value={record.v} accent="#1FE08A" compact />
        <StatCard label="Nuls" value={record.n} accent="#D4AF37" compact />
        <StatCard label="Défaites" value={record.d} accent="#FF5D6C" compact />
      </div>

      {last && (
        <Card style={{ padding: 16 }}>
          <Eyebrow>Dernier résultat</Eyebrow>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, fontWeight: 600 }}>
            {clubName} {last.score} {last.adversaire}
          </div>
        </Card>
      )}

      <Card style={{ padding: 16 }}>
        <Eyebrow>Compositions enregistrées</Eyebrow>
        <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, fontWeight: 600 }}>
          {compositions.length} composition{compositions.length > 1 ? "s" : ""}
        </div>
      </Card>
    </div>
  );
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

function StatCard({ label, value, sub, accent = "#EDEFF3", compact }) {
  return (
    <Card style={{ padding: compact ? "12px 10px" : "16px" }}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{ fontFamily: "Oswald, sans-serif", fontSize: compact ? 24 : 30, fontWeight: 700, color: accent }}>
        {value}
      </div>
      {sub && <div style={{ color: "#6B7380", fontSize: 12, marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

/* ---------------------------- Effectif ---------------------------- */

function Effectif({ players, setPlayers }) {
  const [query, setQuery] = useState("");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [editingPlayer, setEditingPlayer] = useState(null); // null = fermé, {} = nouveau, obj = édition
  const inTrial = false;

  const filtered = players.filter((p) => {
    const matchQuery = p.pseudo?.toLowerCase().includes(query.toLowerCase());
    const matchStatut = filterStatut === "Tous" || p.statut === filterStatut;
    return matchQuery && matchStatut;
  });

  function savePlayer(p) {
    if (players.find((x) => x.id === p.id)) {
      setPlayers(players.map((x) => (x.id === p.id ? p : x)));
    } else {
      setPlayers([...players, p]);
    }
    setEditingPlayer(null);
  }

  function deletePlayer(id) {
    setPlayers(players.filter((x) => x.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} color="#6B7380" style={{ position: "absolute", left: 10, top: 11 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un joueur…"
            style={{
              width: "100%",
              background: "#12161D",
              border: "1px solid #232A35",
              borderRadius: 10,
              color: "#EDEFF3",
              padding: "10px 10px 10px 32px",
              fontSize: 14,
            }}
          />
        </div>
        <PrimaryButton onClick={() => setEditingPlayer({})} style={{ width: 44, padding: 0 }}>
          <Plus size={18} />
        </PrimaryButton>
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {["Tous", ...STATUTS].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatut(s)}
            style={{
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid " + (filterStatut === s ? "transparent" : "#232A35"),
              background: filterStatut === s ? "#1FE08A" : "#12161D",
              color: filterStatut === s ? "#06120B" : "#C7CCD4",
              cursor: "pointer",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ color: "#6B7380", fontSize: 14 }}>
            {players.length === 0 ? "Aucun joueur pour l'instant. Ajoute ton premier joueur." : "Aucun joueur ne correspond."}
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((p) => (
            <PlayerRow key={p.id} p={p} onEdit={() => setEditingPlayer(p)} onDelete={() => deletePlayer(p.id)} />
          ))}
        </div>
      )}

      {editingPlayer !== null && (
        <PlayerModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={savePlayer}
        />
      )}
    </div>
  );
}

function PlayerRow({ p, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  return (
    <Card style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: "#1A1F28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Oswald, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: "#1FE08A",
          flexShrink: 0,
        }}
      >
        {p.poste || "?"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.pseudo || "Sans pseudo"}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
          <Pill color={STATUT_COLOR[p.statut] || "#8B93A1"} bg={`${STATUT_COLOR[p.statut] || "#8B93A1"}22`}>
            {p.statut || "Rotation"}
          </Pill>
          {p.niveau && <Pill>Niv. {p.niveau}</Pill>}
          {p.dispo === false && <Pill color="#FF5D6C" bg="rgba(255,93,108,0.12)">Indisponible</Pill>}
        </div>
      </div>
      {confirmDelete ? (
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={onDelete} style={{ background: "#FF5D6C22", border: "none", borderRadius: 8, padding: 8, color: "#FF5D6C" }}>
            <Check size={16} />
          </button>
          <button onClick={() => setConfirmDelete(false)} style={{ background: "#1A1F28", border: "none", borderRadius: 8, padding: 8, color: "#8B93A1" }}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={onEdit} style={{ background: "#1A1F28", border: "none", borderRadius: 8, padding: 8, color: "#C7CCD4" }}>
            <Pencil size={15} />
          </button>
          <button onClick={() => setConfirmDelete(true)} style={{ background: "#1A1F28", border: "none", borderRadius: 8, padding: 8, color: "#8B93A1" }}>
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </Card>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,6,8,0.72)",
        backdropFilter: "blur(3px)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 480,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "#12161D",
          borderTop: "1px solid #2A313D",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: "18px 18px calc(18px + env(safe-area-inset-bottom))",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 18, fontWeight: 600 }}>{title}</div>
          <button onClick={onClose} style={{ background: "#1A1F28", border: "none", borderRadius: 8, padding: 6, color: "#C7CCD4" }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#8B93A1", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "#0E1216",
  border: "1px solid #232A35",
  borderRadius: 9,
  color: "#EDEFF3",
  padding: "10px 12px",
  fontSize: 14,
};

function PlayerModal({ player, onClose, onSave }) {
  const [form, setForm] = useState({
    id: player.id || uid(),
    pseudo: player.pseudo || "",
    poste: player.poste || "MC",
    posteSecondaire: player.posteSecondaire || "",
    niveau: player.niveau || "",
    statut: player.statut || "Rotation",
    dispo: player.dispo !== false,
    heureConnexion: player.heureConnexion || "",
    commentaires: player.commentaires || "",
  });

  return (
    <Modal title={player.id ? "Modifier le joueur" : "Nouveau joueur"} onClose={onClose}>
      <Field label="Pseudo">
        <input style={inputStyle} value={form.pseudo} onChange={(e) => setForm({ ...form, pseudo: e.target.value })} placeholder="Ex: RoyalStriker9" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Poste principal">
          <select style={inputStyle} value={form.poste} onChange={(e) => setForm({ ...form, poste: e.target.value })}>
            {POSTES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Poste secondaire">
          <select style={inputStyle} value={form.posteSecondaire} onChange={(e) => setForm({ ...form, posteSecondaire: e.target.value })}>
            <option value="">—</option>
            {POSTES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Niveau">
          <input style={inputStyle} value={form.niveau} onChange={(e) => setForm({ ...form, niveau: e.target.value })} placeholder="Ex: 89" />
        </Field>
        <Field label="Statut">
          <select style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
            {STATUTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Heure habituelle de connexion">
        <input style={inputStyle} value={form.heureConnexion} onChange={(e) => setForm({ ...form, heureConnexion: e.target.value })} placeholder="Ex: 20h - 23h" />
      </Field>
      <Field label="Commentaires internes">
        <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.commentaires} onChange={(e) => setForm({ ...form, commentaires: e.target.value })} />
      </Field>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#C7CCD4", marginBottom: 16 }}>
        <input type="checkbox" checked={form.dispo} onChange={(e) => setForm({ ...form, dispo: e.target.checked })} />
        Disponible actuellement
      </label>
      <PrimaryButton onClick={() => onSave(form)} style={{ width: "100%" }} disabled={!form.pseudo.trim()}>
        Enregistrer
      </PrimaryButton>
    </Modal>
  );
}

/* ---------------------------- Compositions ---------------------------- */

function Compositions({ players, compositions, setCompositions, clubName }) {
  const [formation, setFormation] = useState("4-3-3");
  const [name, setName] = useState("");
  const [slots, setSlots] = useState({}); // slotKey -> playerId
  const [activeSlot, setActiveSlot] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const canvasRef = useRef(null);

  const layout = FORMATIONS[formation];
  const assignedIds = new Set(Object.values(slots));

  function pickPlayer(playerId) {
    if (!activeSlot) return;
    setSlots((s) => ({ ...s, [activeSlot]: playerId }));
    setActiveSlot(null);
  }

  function clearSlot(slotKey) {
    setSlots((s) => {
      const next = { ...s };
      delete next[slotKey];
      return next;
    });
  }

  function saveComposition() {
    const comp = {
      id: loadedId || uid(),
      name: name.trim() || `Compo ${new Date().toLocaleDateString("fr-FR")}`,
      formation,
      slots,
    };
    if (loadedId) {
      setCompositions(compositions.map((c) => (c.id === loadedId ? comp : c)));
    } else {
      setCompositions([...compositions, comp]);
      setLoadedId(comp.id);
    }
  }

  function loadComposition(c) {
    setFormation(c.formation);
    setSlots(c.slots);
    setName(c.name);
    setLoadedId(c.id);
  }

  function newComposition() {
    setFormation("4-3-3");
    setSlots({});
    setName("");
    setLoadedId(null);
  }

  function deleteComposition(id) {
    setCompositions(compositions.filter((c) => c.id !== id));
    if (loadedId === id) newComposition();
  }

  function generateVisual() {
    const canvas = canvasRef.current;
    const W = 1000, H = 1250;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // fond
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0E1520");
    bg.addColorStop(1, "#070A0D");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // en-tête
    ctx.fillStyle = "#1FE08A";
    ctx.font = "700 22px Oswald, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COMPOSITION OFFICIELLE", W / 2, 60);
    ctx.fillStyle = "#EDEFF3";
    ctx.font = "700 42px Oswald, sans-serif";
    ctx.fillText(clubName.toUpperCase(), W / 2, 108);
    ctx.fillStyle = "#8B93A1";
    ctx.font = "500 20px Inter, sans-serif";
    ctx.fillText(`Formation ${formation} — ${name || "Sans nom"}`, W / 2, 138);

    // pelouse
    const pitchX = 60, pitchY = 170, pitchW = W - 120, pitchH = 980;
    ctx.fillStyle = "#123322";
    roundRect(ctx, pitchX, pitchY, pitchW, pitchH, 18);
    ctx.fill();
    // bandes
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

    // joueurs
    layout.forEach((slot) => {
      const px = pitchX + (slot.x / 100) * pitchW;
      const py = pitchY + (slot.y / 100) * pitchH;
      const playerId = slots[slot.key];
      const player = players.find((p) => p.id === playerId);

      ctx.beginPath();
      ctx.arc(px, py, 34, 0, Math.PI * 2);
      ctx.fillStyle = player ? "#1FE08A" : "rgba(255,255,255,0.08)";
      ctx.fill();
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
      const label = player ? player.pseudo : "—";
      ctx.fillText(truncate(label, 16), px, py + 56);
    });

    // pied de page
    ctx.textAlign = "left";
    ctx.fillStyle = "#4C5560";
    ctx.font = "500 14px Inter, sans-serif";
    ctx.fillText(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, pitchX, H - 20);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || "composition").replace(/\s+/g, "_")}.png`;
    a.click();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {Object.keys(FORMATIONS).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFormation(f);
              setSlots({});
            }}
            style={{
              flexShrink: 0,
              fontFamily: "Oswald, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid " + (formation === f ? "transparent" : "#232A35"),
              background: formation === f ? "#1FE08A" : "#12161D",
              color: formation === f ? "#06120B" : "#C7CCD4",
              cursor: "pointer",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom de la composition (ex: Équipe A — Ligue)"
        style={inputStyle}
      />

      <Card style={{ padding: 12 }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "0.8",
            background: "linear-gradient(180deg,#123322,#0E2A1B)",
            borderRadius: 12,
            border: "1px solid #1E4531",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 14, border: "1.5px solid rgba(255,255,255,0.18)", borderRadius: 4 }} />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 90,
              height: 90,
              border: "1.5px solid rgba(255,255,255,0.18)",
              borderRadius: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
          {layout.map((slot) => {
            const playerId = slots[slot.key];
            const player = players.find((p) => p.id === playerId);
            return (
              <button
                key={slot.key}
                onClick={() => setActiveSlot(slot.key)}
                style={{
                  position: "absolute",
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: "translate(-50%,-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: player ? "#1FE08A" : "rgba(255,255,255,0.1)",
                    border: player ? "2px solid #0B7A48" : "1.5px dashed rgba(255,255,255,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Oswald, sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    color: player ? "#06120B" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {slot.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#EDEFF3",
                    background: "rgba(0,0,0,0.55)",
                    padding: "1px 5px",
                    borderRadius: 5,
                    maxWidth: 68,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {player ? player.pseudo : "vide"}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <div style={{ display: "flex", gap: 8 }}>
        <PrimaryButton onClick={saveComposition} style={{ flex: 1 }}>
          <Check size={16} /> {loadedId ? "Mettre à jour" : "Enregistrer"}
        </PrimaryButton>
        <GhostButton onClick={generateVisual}>
          <Download size={15} /> Générer le visuel
        </GhostButton>
      </div>
      {loadedId && <GhostButton onClick={newComposition}>+ Nouvelle composition</GhostButton>}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {compositions.length > 0 && (
        <div>
          <Eyebrow>Compositions enregistrées</Eyebrow>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {compositions.map((c) => (
              <Card key={c.id} style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div onClick={() => loadComposition(c)} style={{ cursor: "pointer" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ color: "#6B7380", fontSize: 12 }}>{c.formation}</div>
                </div>
                <button onClick={() => deleteComposition(c.id)} style={{ background: "#1A1F28", border: "none", borderRadius: 8, padding: 8, color: "#8B93A1" }}>
                  <Trash2 size={15} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeSlot && (
        <Modal title={`Assigner — ${layout.find((l) => l.key === activeSlot)?.label}`} onClose={() => setActiveSlot(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              onClick={() => clearSlot(activeSlot) || setActiveSlot(null)}
              style={{ ...inputStyle, textAlign: "left", color: "#8B93A1", cursor: "pointer" }}
            >
              — Laisser vide
            </button>
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => pickPlayer(p.id)}
                style={{
                  ...inputStyle,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  opacity: assignedIds.has(p.id) && slots[activeSlot] !== p.id ? 0.4 : 1,
                }}
              >
                <span>{p.pseudo}</span>
                <span style={{ color: "#6B7380" }}>{p.poste}</span>
              </button>
            ))}
            {players.length === 0 && <div style={{ color: "#6B7380", fontSize: 13 }}>Ajoute des joueurs dans l'onglet Effectif d'abord.</div>}
          </div>
        </Modal>
      )}
    </div>
  );
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

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? str.slice(0, n - 1) + "…" : str;
}

/* ---------------------------- Matchs ---------------------------- */

function Matchs({ matches, setMatches, players }) {
  const [editing, setEditing] = useState(null);

  function save(m) {
    if (matches.find((x) => x.id === m.id)) {
      setMatches(matches.map((x) => (x.id === m.id ? m : x)));
    } else {
      setMatches([...matches, m]);
    }
    setEditing(null);
  }

  function del(id) {
    setMatches(matches.filter((x) => x.id !== id));
  }

  const sorted = [...matches].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <PrimaryButton onClick={() => setEditing({})}>
        <Plus size={16} /> Ajouter un match
      </PrimaryButton>

      {sorted.length === 0 ? (
        <Card style={{ padding: 24, textAlign: "center" }}>
          <div style={{ color: "#6B7380", fontSize: 14 }}>Aucun match enregistré.</div>
        </Card>
      ) : (
        sorted.map((m) => {
          const r = matchResult(m.score);
          const c = r === "V" ? "#1FE08A" : r === "D" ? "#FF5D6C" : r === "N" ? "#D4AF37" : "#6B7380";
          return (
            <Card key={m.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 17, fontWeight: 600 }}>
                    vs {m.adversaire || "?"}
                  </div>
                  <div style={{ color: "#6B7380", fontSize: 12, marginTop: 2 }}>
                    {formatDate(m.date)} {m.competition ? `· ${m.competition}` : ""}
                  </div>
                </div>
                {m.score ? (
                  <div style={{ fontFamily: "Oswald, sans-serif", fontSize: 20, fontWeight: 700, color: c }}>{m.score}</div>
                ) : (
                  <Pill>À venir</Pill>
                )}
              </div>
              {(m.homme || m.commentaires) && (
                <div style={{ marginTop: 8, fontSize: 13, color: "#8B93A1" }}>
                  {m.homme && <div>⭐ Homme du match : {players.find((p) => p.id === m.homme)?.pseudo || m.homme}</div>}
                  {m.commentaires && <div style={{ marginTop: 2 }}>{m.commentaires}</div>}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <GhostButton onClick={() => setEditing(m)} style={{ flex: 1 }}>
                  <Pencil size={13} /> Modifier
                </GhostButton>
                <GhostButton onClick={() => del(m.id)} style={{ width: 44 }}>
                  <Trash2 size={14} />
                </GhostButton>
              </div>
            </Card>
          );
        })
      )}

      {editing !== null && <MatchModal match={editing} players={players} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function MatchModal({ match, players, onClose, onSave }) {
  const [form, setForm] = useState({
    id: match.id || uid(),
    adversaire: match.adversaire || "",
    competition: match.competition || "",
    date: match.date ? match.date.slice(0, 16) : "",
    score: match.score || "",
    homme: match.homme || "",
    commentaires: match.commentaires || "",
  });

  return (
    <Modal title={match.id ? "Modifier le match" : "Nouveau match"} onClose={onClose}>
      <Field label="Adversaire">
        <input style={inputStyle} value={form.adversaire} onChange={(e) => setForm({ ...form, adversaire: e.target.value })} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Compétition">
          <input style={inputStyle} value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} placeholder="Ligue / Coupe / Amical" />
        </Field>
        <Field label="Date">
          <input type="datetime-local" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </Field>
      </div>
      <Field label="Score (laisser vide si à venir)">
        <input style={inputStyle} value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="Ex: 3-1" />
      </Field>
      <Field label="Homme du match">
        <select style={inputStyle} value={form.homme} onChange={(e) => setForm({ ...form, homme: e.target.value })}>
          <option value="">—</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>{p.pseudo}</option>
          ))}
        </select>
      </Field>
      <Field label="Commentaires">
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.commentaires} onChange={(e) => setForm({ ...form, commentaires: e.target.value })} />
      </Field>
      <PrimaryButton onClick={() => onSave(form)} style={{ width: "100%" }} disabled={!form.adversaire.trim()}>
        Enregistrer
      </PrimaryButton>
    </Modal>
  );
}
