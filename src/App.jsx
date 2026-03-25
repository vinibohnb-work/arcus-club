import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import {
  supabase,
  toMentee, toMenteeDb,
  toLead, toLeadDb,
  toEvent, toEventDb,
  toGoalsObj, fromGoalsObj,
} from "./lib/supabase";

const COLORS = {
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  cardHover: "#1C1C1C",
  border: "#2A2A2A",
  borderLight: "#222222",
  accent: "#C9A84C",       // warm gold
  accentLight: "#E2C37A",
  accentDim: "#C9A84C33",
  violet: "#7B6FD4",
  teal: "#3DBFB0",
  red: "#E05252",
  text: "#F2EDE4",         // warm white
  textMuted: "#8A8070",
  textDim: "#4A4440",
};

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_BODY = `'Cormorant Garamond', 'Garamond', Georgia, serif`;
const FONT_UI = `'Jost', 'DM Sans', sans-serif`;

const styles = {
  app: {
    fontFamily: FONT_UI,
    background: COLORS.bg,
    minHeight: "100vh",
    color: COLORS.text,
    display: "flex",
    backgroundImage: `radial-gradient(ellipse at 20% 0%, #1A140833 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #0D0D1A22 0%, transparent 60%)`,
  },
  sidebar: {
    width: 260,
    minHeight: "100vh",
    background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex",
    flexDirection: "column",
    padding: "36px 0 24px",
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
  },
  logo: {
    padding: "0 28px 32px",
    borderBottom: `1px solid ${COLORS.border}`,
    marginBottom: 16,
  },
  logoMark: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  logoDot: {
    width: 28,
    height: 2,
    background: `linear-gradient(90deg, ${COLORS.accent}, transparent)`,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 18,
    fontFamily: FONT_DISPLAY,
    fontWeight: 700,
    fontStyle: "italic",
    color: COLORS.text,
    lineHeight: 1.2,
    letterSpacing: "0.01em",
  },
  logoSub: {
    fontSize: 11,
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    fontWeight: 400,
    fontFamily: FONT_UI,
    marginTop: 4,
  },
  navSection: { padding: "8px 12px" },
  navLabel: {
    fontSize: 11,
    color: COLORS.textDim,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontWeight: 600,
    fontFamily: FONT_UI,
    padding: "12px 28px 6px",
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 28px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: active ? 500 : 400,
    fontFamily: FONT_UI,
    color: active ? COLORS.text : COLORS.textMuted,
    background: active ? `${COLORS.accent}0D` : "transparent",
    borderLeft: active ? `1px solid ${COLORS.accent}` : "1px solid transparent",
    letterSpacing: "0.03em",
    marginBottom: 1,
    transition: "all 0.2s",
  }),
  main: {
    marginLeft: 260,
    flex: 1,
    padding: "48px 56px",
    minHeight: "100vh",
    maxWidth: "calc(100vw - 260px)",
  },
  pageHeader: { marginBottom: 44 },
  pageTitle: {
    fontSize: 34,
    fontFamily: FONT_DISPLAY,
    fontWeight: 700,
    fontStyle: "italic",
    color: COLORS.text,
    letterSpacing: "-0.01em",
    marginBottom: 6,
    lineHeight: 1.1,
  },
  pageSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontFamily: FONT_UI,
    letterSpacing: "0.04em",
  },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 24 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 20 },
  card: (extra = {}) => ({
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    padding: 28,
    ...extra,
  }),
  statCard: (color) => ({
    background: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    padding: "24px 28px",
    borderLeft: `2px solid ${color}`,
    position: "relative",
    overflow: "hidden",
  }),
  statValue: {
    fontSize: 38,
    fontFamily: FONT_DISPLAY,
    fontWeight: 700,
    color: COLORS.text,
    letterSpacing: "-0.03em",
    lineHeight: 1,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.14em",
    fontWeight: 500,
    fontFamily: FONT_UI,
  },
  statDelta: (pos) => ({
    fontSize: 13,
    color: pos ? COLORS.teal : COLORS.red,
    fontWeight: 500,
    marginTop: 8,
    fontFamily: FONT_UI,
    letterSpacing: "0.03em",
  }),
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    fontFamily: FONT_UI,
    color: COLORS.textMuted,
    marginBottom: 20,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  },
  badge: (color) => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 2,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: FONT_UI,
    letterSpacing: "0.08em",
    background: `${color}18`,
    color: color,
    border: `1px solid ${color}33`,
    textTransform: "uppercase",
  }),
  btn: (variant = "primary") => ({
    padding: variant === "sm" ? "7px 16px" : "11px 24px",
    borderRadius: 2,
    border: "none",
    cursor: "pointer",
    fontSize: variant === "sm" ? 13 : 14,
    fontWeight: 500,
    fontFamily: FONT_UI,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    background: variant === "ghost" ? "transparent"
      : variant === "outline" ? "transparent"
      : COLORS.accent,
    color: variant === "ghost" ? COLORS.textMuted
      : variant === "outline" ? COLORS.accent
      : "#0A0800",
    border: variant === "outline" ? `1px solid ${COLORS.accent}` : "none",
    transition: "all 0.2s",
  }),
  input: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 2,
    padding: "10px 14px",
    color: COLORS.text,
    fontSize: 15,
    width: "100%",
    outline: "none",
    fontFamily: FONT_UI,
    letterSpacing: "0.02em",
  },
  textarea: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 2,
    padding: "10px 14px",
    color: COLORS.text,
    fontSize: 15,
    width: "100%",
    outline: "none",
    fontFamily: FONT_UI,
    resize: "vertical",
    minHeight: 80,
    letterSpacing: "0.02em",
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontFamily: FONT_UI,
  },
  tag: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 2,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: FONT_UI,
    letterSpacing: "0.06em",
    background: `${color}14`,
    color: color,
    textTransform: "uppercase",
  }),
  avatarCircle: (size = 36, color = COLORS.accent) => ({
    width: size,
    height: size,
    borderRadius: 2,
    background: `${color}18`,
    border: `1px solid ${color}44`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: size * 0.33,
    fontWeight: 600,
    fontFamily: FONT_UI,
    letterSpacing: "0.05em",
    color: color,
    flexShrink: 0,
  }),
  progressBar: (pct, color) => ({
    height: 2,
    borderRadius: 1,
    background: COLORS.borderLight,
    overflow: "hidden",
    position: "relative",
  }),
  progressFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: 1,
    transition: "width 0.5s ease",
  }),
  divider: {
    height: 1,
    background: COLORS.border,
    margin: "20px 0",
  },
  pill: (active, color = COLORS.accent) => ({
    padding: "6px 16px",
    borderRadius: 2,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: FONT_UI,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    background: active ? `${color}18` : "transparent",
    color: active ? color : COLORS.textMuted,
    border: `1px solid ${active ? color + "55" : COLORS.border}`,
    transition: "all 0.15s",
  }),
  modal: {
    position: "fixed",
    inset: 0,
    background: "#000000CC",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    padding: 36,
    width: "100%",
    maxWidth: 520,
    maxHeight: "85vh",
    overflowY: "auto",
  },
};

// DATA

const INITIAL_LEADS = [];

const LEAD_STAGES = ["Novo Lead", "Contato Feito", "Proposta Enviada", "Negociação", "Convertido", "Perdido"];
const MENTEE_STAGES = ["Ativo", "Inativo"];
const LEAD_SOURCES = ["Instagram", "LinkedIn", "YouTube", "Indicação", "Evento", "WhatsApp", "Google", "Outro"];
const INTERACTION_TYPES = ["Ligação", "Mensagem", "Reunião", "E-mail", "Outro"];
const NEXT_STEP_TYPES = ["Ligar", "Enviar mensagem", "Enviar proposta", "Agendar reunião", "Reunião de fechamento", "Follow-up", "Outro"];
const ASSIGNEES = ["Eu", "Sócio", "Ambos"];
const STAGE_COLORS = {
  "Ativo": "#3DBFB0",
  "Inativo": "#E05252",
  "Novo Lead": "#6A6A7A",
  "Contato Feito": "#7B6FD4",
  "Proposta Enviada": "#C9A84C",
  "Negociação": "#E09A3D",
  "Convertido": "#3DBFB0",
  "Perdido": "#E05252",
};

const AWARENESS_LEVELS = [
  { key: "Frio",       color: "#6A6A7A", desc: "Sem contato anterior" },
  { key: "Seguidor",   color: "#7B6FD4", desc: "Segue nas redes sociais" },
  { key: "Engajado",   color: "#3DBFB0", desc: "Interage com conteúdo" },
  { key: "Consciente", color: "#C9A84C", desc: "Conhece e entende o clube" },
  { key: "Quente",     color: "#E09A3D", desc: "Pronto para contato direto" },
  { key: "Recusa",     color: "#E05252", desc: "Não tem interesse" },
];
const MILESTONE_LABELS = ["Onboarding", "Diagnóstico", "Plano de Ação", "Execução", "Revisão", "Avanço Contínuo"];

const INITIAL_EVENTS = [
  { id: 1, title: "Masterclass: Escala de Negócios", date: "2025-03-10", type: "evento", desc: "Live para todos os mentorados", time: "19:00" },
  { id: 2, title: "Post: Dica de Produtividade", date: "2025-03-07", type: "post", desc: "Instagram + LinkedIn", time: "08:00" },
  { id: 3, title: "Sessão 1:1 - Ana Souza", date: "2025-03-08", type: "sessao", desc: "Revisão de metas Q1", time: "10:00" },
  { id: 4, title: "Workshop: Tráfego Pago", date: "2025-03-15", type: "evento", desc: "Para mentorados premium", time: "14:00" },
  { id: 5, title: "Post: Case de Sucesso Diego", date: "2025-03-12", type: "post", desc: "Depoimento para redes", time: "09:00" },
  { id: 6, title: "Sessão 1:1 - Bruno Lima", date: "2025-03-11", type: "sessao", desc: "Definição de nicho", time: "16:00" },
];

const INITIAL_GOALS = {
  30: [
    { id: 1, text: "Atingir 10 mentorados ativos", done: true },
    { id: 2, text: "Publicar 12 conteúdos nas redes", done: true },
    { id: 3, text: "Criar template de onboarding", done: false },
  ],
  60: [
    { id: 4, text: "Lançar plano VIP", done: false },
    { id: 5, text: "Realizar 2 masterclasses", done: true },
    { id: 6, text: "Atingir R$ 25k MRR", done: false },
  ],
  90: [
    { id: 7, text: "Expandir para 20 mentorados", done: false },
    { id: 8, text: "Criar área de membros", done: false },
    { id: 9, text: "Parceria com 2 influencers", done: false },
  ],
  150: [
    { id: 10, text: "Atingir R$ 60k MRR", done: false },
    { id: 11, text: "Contratar assistente", done: false },
    { id: 12, text: "Lançar curso gravado", done: false },
    { id: 13, text: "Comunidade com 500 membros", done: false },
  ],
  360: [],
};

const DEFAULT_PLAN_ITEMS = [
  "Onboarding: Definição de objetivos e diagnóstico",
  "– Plano de ação personalizado (30/60/90 dias)",
  "– Sessões 1:1 semanais (45 min cada)",
  "– Acesso à biblioteca de materiais exclusivos",
  "Suporte via WhatsApp (seg-sex, 9h-18h)",
  "Gravações das sessões disponíveis por 30 dias",
  "– Relatório mensal de progresso",
  "Acesso ao grupo exclusivo de mentorados",
];

// ICONS
const Icon = ({ name, size = 16 }) => {
  const icons = {
    home: "⬡", users: "👥", calendar: "📅", target: "🎯", crm: "📊", settings: "⚙️",
    plus: "+", edit: "✏️", trash: "🗑️", check: "✓", close: "✕", eye: "👁",
    star: "★", fire: "🔥", lock: "◎", unlock: "🔓", bell: "🔔", mail: "✉️",
    phone: "📞", tag: "🏷️", chart: "📈", award: "🏆", user: "👤", back: "←",
    send: "→", dot: "•", flag: "⚑", clock: "⏰",
  };
  return <span style={{ fontSize: size, lineHeight: 1 }}>{icons[name] || "•"}</span>;
};

// PROGRESS BAR COMPONENT
const Progress = ({ value, color = COLORS.accent, height = 6 }) => (
  <div style={{ ...styles.progressBar(value, color), height }}>
    <div style={{ ...styles.progressFill(value, color), height: "100%" }} />
  </div>
);

// AVATAR
const Avatar = ({ initials, color, size = 36 }) => (
  <div style={styles.avatarCircle(size, color)}>{initials}</div>
);

// ==================== VIEWS ====================

// DASHBOARD
function Dashboard({ mentees, leads, events }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();
  const endOfWeek = (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })();
  const active = mentees.filter(m => m.stage === "Ativo").length;
  const [expandedKey, setExpandedKey] = useState(null);

  const stepIcon = t => ({ "Ligar": "📞", "Enviar mensagem": "💬", "Enviar proposta": "📄", "Agendar reunião": "🤝", "Reunião de fechamento": "🏁", "Follow-up": "🔄", "Outro": "📝" }[t] || "📝");

  // Coleta todos os next steps pendentes de todos os leads
  const allPending = leads.flatMap(l =>
    (l.nextSteps || []).filter(s => !s.done).map(s => ({ ...s, leadName: l.name, leadColor: l.color, leadAvatar: l.avatar }))
  );

  // Agrupa por bucket de data
  const groups = [];

  const overdue = allPending.filter(s => s.date < today).sort((a, b) => a.date.localeCompare(b.date));
  if (overdue.length) groups.push({ key: "overdue", label: "Atrasado", color: COLORS.red, highlight: true, steps: overdue });

  const todaySteps = allPending.filter(s => s.date === today);
  if (todaySteps.length) groups.push({ key: "today", label: "Hoje", color: COLORS.accent, highlight: true, steps: todaySteps });

  const tomorrowSteps = allPending.filter(s => s.date === tomorrow);
  if (tomorrowSteps.length) groups.push({ key: "tomorrow", label: "Amanhã", color: COLORS.teal, highlight: true, steps: tomorrowSteps });

  // Demais dias até fim da semana, agrupados por data
  const restDates = [...new Set(
    allPending.filter(s => s.date > tomorrow && s.date <= endOfWeek).map(s => s.date)
  )].sort();
  restDates.forEach(date => {
    const steps = allPending.filter(s => s.date === date);
    const label = new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" });
    groups.push({ key: date, label, color: COLORS.textMuted, highlight: false, steps });
  });

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ ...styles.statCard(COLORS.teal), maxWidth: 260 }}>
          <div style={styles.statValue}>{active}</div>
          <div style={styles.statLabel}>Mentorados Ativos</div>
        </div>
      </div>

      <div style={{ ...styles.grid2, marginBottom: 24 }}>
        {/* Card: atividades consolidadas */}
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>— Prospecção · Próximos 7 dias</div>
          {groups.length === 0
            ? <div style={{ color: COLORS.textMuted, fontSize: 13, paddingTop: 8 }}>Nenhuma atividade pendente.</div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {groups.map(g => {
                  const isOpen = expandedKey === g.key;
                  return (
                    <div key={g.key}>
                      {/* Linha do grupo */}
                      <div onClick={() => setExpandedKey(isOpen ? null : g.key)}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: isOpen ? "4px 4px 0 0" : 4, background: g.highlight ? (isOpen ? `${g.color}30` : `${g.color}1E`) : (isOpen ? `${g.color}14` : COLORS.surface), border: `1px solid ${g.highlight || isOpen ? g.color + "55" : COLORS.border}`, borderLeft: `3px solid ${g.color}`, cursor: "pointer", transition: "all 0.15s" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: g.highlight ? g.color : COLORS.text }}>{g.label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: g.highlight ? g.color : COLORS.textMuted, background: g.highlight ? `${g.color}22` : COLORS.border, border: g.highlight ? `1px solid ${g.color}44` : "none", borderRadius: 10, padding: "2px 9px", fontWeight: 600 }}>
                            {g.steps.length} tarefa{g.steps.length !== 1 ? "s" : ""}
                          </span>
                          <span style={{ fontSize: 11, color: g.highlight ? g.color : COLORS.textMuted, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                        </div>
                      </div>
                      {/* Detalhe expandido */}
                      {isOpen && (
                        <div style={{ border: `1px solid ${g.color}44`, borderTop: "none", borderRadius: "0 0 4px 4px", background: COLORS.card, overflow: "hidden" }}>
                          {g.steps.map((s, i) => (
                            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}>
                              <Avatar initials={s.leadAvatar} color={s.leadColor} size={26} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{stepIcon(s.type)} {s.title}</div>
                                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{s.leadName}{s.note ? ` · ${s.note}` : ""}</div>
                              </div>
                              <span style={{ fontSize: 11, color: COLORS.textMuted, flexShrink: 0 }}>{s.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          }
        </div>

        {/* Card: próximos eventos */}
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>– Próximos Eventos</div>
          {events.slice(0, 5).map(e => {
            const typeColor = e.type === "evento" ? COLORS.accent : e.type === "post" ? COLORS.accent : COLORS.teal;
            return (
              <div key={e.id} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                <div style={{ ...styles.tag(typeColor), fontSize: 12, minWidth: 52, justifyContent: "center" }}>{e.type}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted }}>{e.date} • {e.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// CRM — LEADS / PROSPECÇÃO
function CRM({ leads, setLeads, setMentees }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();

  const [viewMode, setViewMode] = useState("kanban");
  const [selectedId, setSelectedId] = useState(null);
  const [detailTab, setDetailTab] = useState("history");
  const [search, setSearch] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", source: "Instagram", interest: "", tags: "", awareness: "Frio" });
  const [interactionForm, setInteractionForm] = useState({ type: "Ligação", note: "", date: today });
  const [nextStepForm, setNextStepForm] = useState({ type: "Ligar", title: "", note: "", date: tomorrow });
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [editingStep, setEditingStep] = useState(null);

  const selectedLead = leads.find(l => l.id === selectedId) || null;
  const interactionIcon = t => ({ "Ligação": "📞", "Mensagem": "💬", "Reunião": "🤝", "E-mail": "✉️", "Outro": "📝" }[t] || "📝");
  const stepIcon = t => ({ "Ligar": "📞", "Enviar mensagem": "💬", "Enviar proposta": "📄", "Agendar reunião": "🤝", "Reunião de fechamento": "🏁", "Follow-up": "🔄", "Outro": "📝" }[t] || "📝");
  const stepUrgency = date => { if (date < today) return COLORS.red; if (date === today) return COLORS.accent; return COLORS.textMuted; };

  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  const addLead = () => {
    if (!leadForm.name) return;
    const newL = {
      id: Date.now(), ...leadForm,
      avatar: leadForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      color: ["#6C63FF", "#F5A623", "#2DD4BF", "#FF6B6B", "#A78BFA"][Math.floor(Math.random() * 5)],
      tags: leadForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      lastContact: today, interactions: [], nextSteps: [],
    };
    setLeads(prev => [...prev, newL]);
    setSelectedId(newL.id);
    setShowLeadModal(false);
    setLeadForm({ name: "", email: "", phone: "", source: "Instagram", interest: "", tags: "", awareness: "Frio" });
  };

  const moveAwareness = (leadId, newLevel) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, awareness: newLevel } : l));
  };

  const addInteraction = () => {
    if (!interactionForm.note || !selectedId) return;
    if (editingInteraction) {
      setLeads(prev => prev.map(l => l.id === selectedId ? {
        ...l,
        interactions: (l.interactions || []).map(it => it.id === editingInteraction ? { ...it, ...interactionForm } : it)
          .sort((a, b) => b.date.localeCompare(a.date)),
      } : l));
      setEditingInteraction(null);
    } else {
      const entry = { id: Date.now(), ...interactionForm };
      setLeads(prev => prev.map(l => l.id === selectedId ? {
        ...l,
        interactions: [...(l.interactions || []), entry].sort((a, b) => b.date.localeCompare(a.date)),
        lastContact: interactionForm.date,
      } : l));
    }
    setShowInteractionModal(false);
    setInteractionForm({ type: "Ligação", note: "", date: today });
  };

  const deleteInteraction = (leadId, interactionId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l, interactions: (l.interactions || []).filter(it => it.id !== interactionId),
    } : l));
  };

  const deleteStep = (leadId, stepId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l, nextSteps: (l.nextSteps || []).filter(s => s.id !== stepId),
    } : l));
  };

  const addNextStep = () => {
    if (!nextStepForm.title || !selectedId) return;
    if (editingStep) {
      setLeads(prev => prev.map(l => l.id === selectedId ? {
        ...l,
        nextSteps: (l.nextSteps || []).map(s => s.id === editingStep ? { ...s, ...nextStepForm } : s)
          .sort((a, b) => a.date.localeCompare(b.date)),
      } : l));
      setEditingStep(null);
    } else {
      const step = { id: Date.now(), ...nextStepForm, done: false };
      setLeads(prev => prev.map(l => l.id === selectedId ? {
        ...l,
        nextSteps: [...(l.nextSteps || []), step].sort((a, b) => a.date.localeCompare(b.date)),
      } : l));
    }
    setShowNextStepModal(false);
    setNextStepForm({ type: "Ligar", title: "", note: "", date: tomorrow });
  };

  const toggleStepDone = (leadId, stepId) => {
    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l, nextSteps: l.nextSteps.map(s => s.id === stepId ? { ...s, done: !s.done } : s),
    } : l));
  };

  const deleteLead = (id) => { setLeads(prev => prev.filter(l => l.id !== id)); setSelectedId(null); };

  const LeadCard = ({ lead }) => {
    const pending = (lead.nextSteps || []).filter(s => !s.done);
    const overdue = pending.filter(s => s.date < today).length > 0;
    const nextStep = [...pending].sort((a, b) => a.date.localeCompare(b.date))[0];
    const bg = overdue ? `${COLORS.red}18` : COLORS.card;
    const borderColor = overdue ? COLORS.red : COLORS.border;
    const hoverBg = overdue ? `${COLORS.red}28` : COLORS.cardHover;
    return (
      <div
        onClick={() => { setSelectedId(lead.id); setDetailTab("history"); }}
        style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 4, padding: "10px 12px", cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.background = hoverBg}
        onMouseLeave={e => e.currentTarget.style.background = bg}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: overdue ? COLORS.red : COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.name}</div>
        {nextStep && (
          <div style={{ fontSize: 11, color: overdue ? COLORS.red : COLORS.textDim, marginTop: 3 }}>{nextStep.date}</div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* ── Header ── */}
      <div style={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={styles.pageTitle}>Prospecção</div>
            <div style={styles.pageSubtitle}>Leads organizados por nível de consciência do clube</div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ display: "flex", border: `1px solid ${COLORS.border}`, borderRadius: 4, overflow: "hidden" }}>
              {[["kanban", "⊞ Kanban"], ["list", "≡ Lista"]].map(([v, label]) => (
                <button key={v} onClick={() => setViewMode(v)} style={{ padding: "8px 18px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: FONT_UI, letterSpacing: "0.08em", background: viewMode === v ? COLORS.accent : COLORS.surface, color: viewMode === v ? "#0A0800" : COLORS.textMuted, transition: "all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
            <button style={styles.btn()} onClick={() => setShowLeadModal(true)}>+ Novo Lead</button>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <input style={{ ...styles.input, fontSize: 13, maxWidth: 480 }} placeholder="🔍 Buscar lead..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── KANBAN ── */}
      {viewMode === "kanban" && (
        <div style={{ overflowX: "auto", paddingBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, alignItems: "flex-start" }}>
            {AWARENESS_LEVELS.map(level => {
              const colLeads = filtered.filter(l => (l.awareness || "Frio") === level.key);
              return (
                <div key={level.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Cabeçalho da coluna */}
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderTop: `3px solid ${level.color}`, borderRadius: 4, padding: "12px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: level.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{level.key}</div>
                      <div style={{ fontSize: 12, background: `${level.color}22`, color: level.color, borderRadius: 10, padding: "1px 8px", fontWeight: 700 }}>{colLeads.length}</div>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 3 }}>{level.desc}</div>
                  </div>
                  {/* Cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {colLeads.map(l => <LeadCard key={l.id} lead={l} />)}
                    {colLeads.length === 0 && (
                      <div style={{ border: `1px dashed ${COLORS.border}`, borderRadius: 4, padding: "28px 12px", textAlign: "center", color: COLORS.textDim, fontSize: 12 }}>
                        Nenhum lead
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── LISTA ── */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {AWARENESS_LEVELS.map(level => {
            const colLeads = filtered.filter(l => (l.awareness || "Frio") === level.key);
            if (colLeads.length === 0) return null;
            return (
              <div key={level.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${level.color}`, borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: level.color, textTransform: "uppercase", letterSpacing: "0.1em" }}>{level.key}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>{level.desc}</div>
                  <div style={{ marginLeft: "auto", fontSize: 12, color: level.color, fontWeight: 700 }}>{colLeads.length}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 12 }}>
                  {colLeads.map(l => {
                    const pending = (l.nextSteps || []).filter(s => !s.done);
                    const overdue = pending.filter(s => s.date < today);
                    const todayStep = pending.find(s => s.date === today);
                    const nextStep = [...pending].sort((a, b) => a.date.localeCompare(b.date))[0];
                    return (
                      <div key={l.id} onClick={() => { setSelectedId(l.id); setDetailTab("history"); }}
                        style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderLeft: `3px solid ${l.color}`, borderRadius: 4, padding: "10px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = COLORS.cardHover}
                        onMouseLeave={e => e.currentTarget.style.background = COLORS.card}
                      >
                        <Avatar initials={l.avatar} color={l.color} size={28} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{l.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{l.source}{l.interest ? ` · ${l.interest}` : ""}</div>
                        </div>
                        {nextStep && <div style={{ fontSize: 11, color: stepUrgency(nextStep.date), flexShrink: 0 }}>{stepIcon(nextStep.type)} {nextStep.date}</div>}
                        {overdue.length > 0 && <span style={{ fontSize: 10, background: COLORS.red, color: "#fff", borderRadius: 10, padding: "1px 6px", fontWeight: 700, flexShrink: 0 }}>{overdue.length} atras.</span>}
                        {overdue.length === 0 && todayStep && <span style={{ fontSize: 10, background: COLORS.accent, color: "#000", borderRadius: 10, padding: "1px 6px", fontWeight: 700, flexShrink: 0 }}>hoje</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Detalhe do Lead ── */}
      {selectedLead && (
        <div style={styles.modal} onClick={() => setSelectedId(null)}>
          <div style={{ ...styles.modalBox, maxWidth: 640, maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
            {/* Cabeçalho */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${COLORS.border}` }}>
              <Avatar initials={selectedLead.avatar} color={selectedLead.color} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, marginBottom: 2 }}>{selectedLead.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{selectedLead.email}{selectedLead.phone ? ` · ${selectedLead.phone}` : ""} · {selectedLead.source}</div>
                {selectedLead.interest && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{selectedLead.interest}</div>}
              </div>
              <button style={{ ...styles.btn("ghost"), padding: "4px 8px" }} onClick={() => setSelectedId(null)}>✕</button>
            </div>

            {/* Seletor de nível de consciência */}
            <div style={{ marginBottom: 20 }}>
              <div style={styles.label}>Nível de Consciência</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {AWARENESS_LEVELS.map(lvl => (
                  <button key={lvl.key} onClick={() => moveAwareness(selectedLead.id, lvl.key)}
                    style={{ ...styles.pill((selectedLead.awareness || "Frio") === lvl.key, lvl.color), fontSize: 11 }}>
                    {lvl.key}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
              {[["history", "📋 Histórico"], ["nextsteps", "🗓 Próximos Passos"]].map(([k, label]) => {
                const badge = k === "nextsteps" ? (selectedLead.nextSteps || []).filter(s => !s.done && s.date <= today).length : 0;
                return (
                  <div key={k} onClick={() => setDetailTab(k)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 600, background: detailTab === k ? COLORS.accent : COLORS.card, color: detailTab === k ? "#fff" : COLORS.textMuted, border: `1px solid ${detailTab === k ? COLORS.accent : COLORS.border}`, transition: "all 0.15s" }}>
                    {label}
                    {badge > 0 && <span style={{ background: COLORS.red, color: "#fff", borderRadius: 10, padding: "0px 5px", fontSize: 10, fontWeight: 700 }}>{badge}</span>}
                  </div>
                );
              })}
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                {detailTab === "history" && (
                  <button style={{ ...styles.btn("outline"), fontSize: 12, padding: "6px 14px" }} onClick={() => setShowInteractionModal(true)}>+ Interação</button>
                )}
                {detailTab === "nextsteps" && (
                  <button style={{ ...styles.btn("outline"), fontSize: 12, padding: "6px 14px" }} onClick={() => setShowNextStepModal(true)}>+ Passo</button>
                )}
                <button style={{ ...styles.btn("ghost"), padding: "6px 10px", color: COLORS.red, fontSize: 12 }} onClick={() => deleteLead(selectedLead.id)}>Remover</button>
              </div>
            </div>

            {/* Conteúdo da aba */}
            <div style={{ overflowY: "auto", maxHeight: 360 }}>
              {detailTab === "history" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(selectedLead.interactions || []).length === 0
                    ? <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textMuted }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
                        <div style={{ fontWeight: 600 }}>Nenhuma interação registrada.</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Registre ligações, mensagens, reuniões e e-mails.</div>
                      </div>
                    : (selectedLead.interactions || []).map(it => (
                        <div key={it.id} style={{ ...styles.card({ padding: "12px 16px" }), display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${selectedLead.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{interactionIcon(it.type)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{it.type}</span>
                              <span style={{ fontSize: 12, color: COLORS.textMuted, marginLeft: "auto" }}>{it.date}</span>
                              <button style={{ ...styles.btn("ghost"), padding: "2px 6px", fontSize: 12 }} onClick={() => { setEditingInteraction(it.id); setInteractionForm({ type: it.type, note: it.note, date: it.date }); setShowInteractionModal(true); }}>✎</button>
                              <button style={{ ...styles.btn("ghost"), padding: "2px 6px", fontSize: 12, color: COLORS.red }} onClick={() => deleteInteraction(selectedLead.id, it.id)}>✕</button>
                            </div>
                            <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>{it.note}</div>
                          </div>
                        </div>
                      ))
                  }
                </div>
              )}
              {detailTab === "nextsteps" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(selectedLead.nextSteps || []).length === 0
                    ? <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textMuted }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>🗓</div>
                        <div style={{ fontWeight: 600 }}>Nenhum próximo passo agendado.</div>
                        <div style={{ fontSize: 13, marginTop: 4 }}>Agende ações para avançar com este lead.</div>
                      </div>
                    : (selectedLead.nextSteps || []).map(s => {
                        const isOverdue = s.date < today && !s.done;
                        const isToday = s.date === today && !s.done;
                        return (
                          <div key={s.id} style={{ ...styles.card({ padding: "10px 14px" }), display: "flex", alignItems: "center", gap: 12, opacity: s.done ? 0.5 : 1, borderLeft: `3px solid ${s.done ? COLORS.teal : isOverdue ? COLORS.red : isToday ? COLORS.accent : COLORS.border}` }}>
                            <div onClick={() => toggleStepDone(selectedLead.id, s.id)}
                              style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${s.done ? COLORS.teal : COLORS.border}`, background: s.done ? COLORS.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 13, flexShrink: 0, transition: "all 0.2s" }}>
                              {s.done && "✓"}
                            </div>
                            <span style={{ fontSize: 16, flexShrink: 0 }}>{stepIcon(s.type)}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: s.done ? COLORS.textMuted : COLORS.text, textDecoration: s.done ? "line-through" : "none" }}>{s.title}</span>
                                {isOverdue && <span style={{ fontSize: 11, color: COLORS.red, fontWeight: 700 }}>⚠ Atrasado</span>}
                                {isToday && <span style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700 }}>● Hoje</span>}
                              </div>
                              {s.note && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.note}</div>}
                            </div>
                            <span style={{ fontSize: 12, color: s.done ? COLORS.textMuted : stepUrgency(s.date), fontWeight: isToday || isOverdue ? 700 : 400, flexShrink: 0 }}>{s.date}</span>
                            <button style={{ ...styles.btn("ghost"), padding: "2px 6px", fontSize: 12 }} onClick={() => { setEditingStep(s.id); setNextStepForm({ type: s.type, title: s.title, note: s.note || "", date: s.date }); setShowNextStepModal(true); }}>✎</button>
                            <button style={{ ...styles.btn("ghost"), padding: "2px 6px", fontSize: 12, color: COLORS.red }} onClick={() => deleteStep(selectedLead.id, s.id)}>✕</button>
                          </div>
                        );
                      })
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Novo Lead ── */}
      {showLeadModal && (
        <div style={styles.modal} onClick={() => setShowLeadModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Novo Lead</div>
              <button style={styles.btn("ghost")} onClick={() => setShowLeadModal(false)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["name", "Nome completo", "1 / -1"], ["email", "E-mail", ""], ["phone", "Telefone", ""], ["interest", "Interesse / Objetivo", "1 / -1"], ["tags", "Tags (separadas por vírgula)", "1 / -1"]].map(([k, label, span]) => (
                <div key={k} style={span ? { gridColumn: span } : {}}>
                  <label style={styles.label}>{label}</label>
                  <input style={styles.input} value={leadForm[k] || ""} onChange={e => setLeadForm(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={styles.label}>Canal de Aquisição</label>
                <select style={styles.input} value={leadForm.source} onChange={e => setLeadForm(p => ({ ...p, source: e.target.value }))}>
                  {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Nível de Consciência</label>
                <select style={styles.input} value={leadForm.awareness} onChange={e => setLeadForm(p => ({ ...p, awareness: e.target.value }))}>
                  {AWARENESS_LEVELS.map(a => <option key={a.key}>{a.key}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={styles.btn("outline")} onClick={() => setShowLeadModal(false)}>Cancelar</button>
              <button style={styles.btn()} onClick={addLead}>Salvar Lead</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Registrar Interação ── */}
      {showInteractionModal && (
        <div style={styles.modal} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{editingInteraction ? "Editar Interação" : "Registrar Interação"} — {selectedLead?.name}</div>
              <button style={styles.btn("ghost")} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>✕</button>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={styles.label}>Tipo</label>
                  <select style={styles.input} value={interactionForm.type} onChange={e => setInteractionForm(p => ({ ...p, type: e.target.value }))}>
                    {INTERACTION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Data</label>
                  <input type="date" style={styles.input} value={interactionForm.date} onChange={e => setInteractionForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Resumo / Observações</label>
                <textarea style={{ ...styles.textarea, minHeight: 100 }} value={interactionForm.note} onChange={e => setInteractionForm(p => ({ ...p, note: e.target.value }))} placeholder="O que foi discutido? Qual foi o resultado?" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={styles.btn("outline")} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>Cancelar</button>
              <button style={styles.btn()} onClick={addInteraction}>{editingInteraction ? "Salvar alterações" : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Agendar Próximo Passo ── */}
      {showNextStepModal && (
        <div style={styles.modal} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>{editingStep ? "Editar Próximo Passo" : "Agendar Próximo Passo"} — {selectedLead?.name}</div>
              <button style={styles.btn("ghost")} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>✕</button>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={styles.label}>Título / Ação</label>
                <input style={styles.input} value={nextStepForm.title} onChange={e => setNextStepForm(p => ({ ...p, title: e.target.value }))} placeholder="Ex: Ligar para confirmar interesse" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={styles.label}>Tipo</label>
                  <select style={styles.input} value={nextStepForm.type} onChange={e => setNextStepForm(p => ({ ...p, type: e.target.value }))}>
                    {NEXT_STEP_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Data</label>
                  <input type="date" style={styles.input} value={nextStepForm.date} onChange={e => setNextStepForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Observação (opcional)</label>
                <textarea style={{ ...styles.textarea, minHeight: 80 }} value={nextStepForm.note} onChange={e => setNextStepForm(p => ({ ...p, note: e.target.value }))} placeholder="Contexto ou objetivo deste passo" />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={styles.btn("outline")} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>Cancelar</button>
              <button style={styles.btn()} onClick={addNextStep}>{editingStep ? "Salvar alterações" : "Agendar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// MENTORADOS ATIVOS
function MenteesSection({ mentees, setMentees, setView, setSelectedMentee, copyPortalLink, copiedId }) {
  const [filter, setFilter] = useState("Ativo");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", stage: "Ativo", goal: "", tags: "", notes: "" });

  const filtered = mentees.filter(m => {
    const matchStage = m.stage === filter;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  const addMentee = () => {
    if (!form.name) return;
    const newM = {
      id: Date.now(), ...form,
      joinDate: new Date().toISOString().split("T")[0],
      avatar: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      color: ["#6C63FF", "#F5A623", "#2DD4BF", "#FF6B6B", "#A78BFA"][Math.floor(Math.random() * 5)],
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      lastContact: new Date().toISOString().split("T")[0],
      milestones: [false, false, false, false, false, false],
    };
    setMentees(prev => [...prev, newM]);
    setShowModal(false);
    setForm({ name: "", email: "", phone: "", stage: "Ativo", goal: "", tags: "", notes: "" });
  };

  const deleteMentee = (id) => setMentees(prev => prev.filter(m => m.id !== id));
  const stageColor = (s) => STAGE_COLORS[s] || COLORS.textMuted;

  const active = mentees.filter(m => m.stage === "Ativo").length;
  const inactive = mentees.filter(m => m.stage === "Inativo").length;

  return (
    <div>
      <div style={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={styles.pageTitle}>Mentorados</div>
            <div style={styles.pageSubtitle}>Gerencie seu grupo de mentoria</div>
          </div>
          <button style={styles.btn()} onClick={() => setShowModal(true)}>+ Novo Mentorado</button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <div onClick={() => setFilter("Ativo")} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", padding: "12px 28px", borderRadius: 4, background: COLORS.card, border: filter === "Ativo" ? `1px solid ${STAGE_COLORS["Ativo"]}` : `1px solid ${COLORS.border}`, borderLeft: `3px solid ${STAGE_COLORS["Ativo"]}`, opacity: filter === "Ativo" ? 1 : 0.45, transition: "all 0.2s", minWidth: 100 }}>
          <span style={{ fontSize: 28, fontFamily: FONT_DISPLAY, fontWeight: 700, color: COLORS.text, lineHeight: 1, display: "block", textAlign: "center" }}>{active}</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", textAlign: "center" }}>Ativos</span>
        </div>
        <div onClick={() => setFilter("Inativo")} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", padding: "12px 28px", borderRadius: 4, background: COLORS.card, border: filter === "Inativo" ? `1px solid ${STAGE_COLORS["Inativo"]}` : `1px solid ${COLORS.border}`, borderLeft: `3px solid ${STAGE_COLORS["Inativo"]}`, opacity: filter === "Inativo" ? 1 : 0.45, transition: "all 0.2s", minWidth: 100 }}>
          <span style={{ fontSize: 28, fontFamily: FONT_DISPLAY, fontWeight: 700, color: COLORS.text, lineHeight: 1, display: "block", textAlign: "center" }}>{inactive}</span>
          <span style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", textAlign: "center" }}>Inativos</span>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <input style={{ ...styles.input, maxWidth: 240 }} placeholder="🔍 Buscar mentorado..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(m => {
          const isInactive = m.stage === "Inativo";
          return (
            <div key={m.id} style={{ ...styles.card({ background: isInactive ? `#3D2B8B18` : COLORS.card, border: isInactive ? `1px solid #3D2B8B55` : `1px solid ${COLORS.border}`, opacity: isInactive ? 0.85 : 1, padding: "12px 16px" }), display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
              onClick={() => { setSelectedMentee(m); setView("mentee-detail"); }}>
              <Avatar initials={m.avatar} color={isInactive ? "#884444" : m.color} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isInactive ? COLORS.textMuted : COLORS.text }}>{m.name}</span>
                  {isInactive && <span style={{ fontSize: 11, color: "#7B6FD4", fontWeight: 600 }}>● Inativo</span>}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 3 }}>
                  {m.email} • {m.phone} • Entrou: {m.joinDate}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>– {m.goal}</span>
                  {(Array.isArray(m.tags) ? m.tags : []).map(t => (
                    <span key={t} style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.border, padding: "1px 7px", borderRadius: 12 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexDirection: "row", alignItems: "center", flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                <button style={{ ...styles.btn("outline"), padding: "4px 10px", fontSize: 12 }}
                  onClick={() => { setSelectedMentee(m); setView("mentee-detail"); }}>Ver Perfil</button>
                <button
                  style={{ ...styles.btn("ghost"), padding: "4px 10px", fontSize: 11, color: copiedId === m.id ? COLORS.teal : COLORS.accent, border: `1px solid ${copiedId === m.id ? COLORS.teal : COLORS.accent}44`, borderRadius: 2 }}
                  onClick={() => copyPortalLink(m)}
                  title={`Copiar link do portal: /mentorado/${m.id}`}>
                  {copiedId === m.id ? "✓ Copiado!" : "🔗 Link do Portal"}
                </button>
                {!isInactive
                  ? <button style={{ ...styles.btn("ghost"), padding: "4px 10px", color: COLORS.red, fontSize: 12 }}
                      onClick={() => setMentees(prev => prev.map(x => x.id === m.id ? { ...x, stage: "Inativo" } : x))}>Desativar</button>
                  : <button style={{ ...styles.btn("ghost"), padding: "4px 10px", color: COLORS.teal, fontSize: 12 }}
                      onClick={() => setMentees(prev => prev.map(x => x.id === m.id ? { ...x, stage: "Ativo" } : x))}>Reativar</button>
                }
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...styles.card({ textAlign: "center", padding: 40 }), color: COLORS.textMuted }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>👥</div>
            <div style={{ fontSize: 16 }}>Nenhum mentorado encontrado.</div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Novo Mentorado</div>
              <button style={styles.btn("ghost")} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["name", "Nome completo", "1 / -1"], ["email", "E-mail", ""], ["phone", "Telefone", ""], ["goal", "Objetivo principal", "1 / -1"]].map(([k, l, span]) => (
                <div key={k} style={span ? { gridColumn: span } : {}}>
                  <label style={styles.label}>{l}</label>
                  <input style={styles.input} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={styles.label}>Estágio</label>
                <select style={styles.input} value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                  {MENTEE_STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={styles.label}>Tags (separadas por vírgula)</label>
                <input style={styles.input} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="Ex: Marketing, E-commerce" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={styles.label}>Observações</label>
                <textarea style={styles.textarea} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={styles.btn("outline")} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={styles.btn()} onClick={addMentee}>Salvar Mentorado</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// CALENDAR
function Calendar({ events, setEvents }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "evento", desc: "", time: "" });
  const [filterType, setFilterType] = useState("Todos");

  const filtered = events.filter(e => filterType === "Todos" || e.type === filterType);
  const sorted = [...filtered].sort((a, b) => new Date(a.date) - new Date(b.date));

  const addEvent = () => {
    if (!form.title || !form.date) return;
    setEvents(prev => [...prev, { id: Date.now(), ...form }]);
    setShowModal(false);
    setForm({ title: "", date: "", type: "evento", desc: "", time: "" });
  };

  const typeColor = (t) => t === "evento" ? COLORS.accent : t === "post" ? COLORS.accent : COLORS.teal;
  const typeLabel = (t) => t === "evento" ? "Evento" : t === "post" ? "Post" : "Sessão 1:1";

  const today = new Date().toISOString().split("T")[0];
  const upcoming = sorted.filter(e => e.date >= today);
  const past = sorted.filter(e => e.date < today);

  return (
    <div>
      <div style={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={styles.pageTitle}>Calendário</div>
            <div style={styles.pageSubtitle}>Posts, Eventos e Sessões</div>
          </div>
          <button style={styles.btn()} onClick={() => setShowModal(true)}>+ Novo Agendamento</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {["Todos", "evento", "post", "sessao"].map(t => (
          <div key={t} style={styles.pill(filterType === t, typeColor(t))} onClick={() => setFilterType(t)}>
            {t === "Todos" ? "Todos" : typeLabel(t)}
          </div>
        ))}
      </div>

      <div style={styles.grid2}>
        <div>
          <div style={{ ...styles.sectionTitle, color: COLORS.teal, marginBottom: 12 }}>
            – Próximos ({upcoming.length})
          </div>
          {upcoming.map(e => (
            <div key={e.id} style={{ ...styles.card({ marginBottom: 10, borderLeft: `4px solid ${typeColor(e.type)}` }) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={styles.badge(typeColor(e.type))}>{typeLabel(e.type)}</span>
                    <span style={{ fontSize: 13, color: COLORS.textMuted }}>{e.date} • {e.time}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{e.title}</div>
                  <div style={{ fontSize: 14, color: COLORS.textMuted }}>{e.desc}</div>
                </div>
                <button style={{ ...styles.btn("ghost"), color: COLORS.red, fontSize: 18, padding: "2px 8px" }}
                  onClick={() => setEvents(prev => prev.filter(ev => ev.id !== e.id))}>✕</button>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && <div style={{ color: COLORS.textMuted, fontSize: 15 }}>Nenhum evento futuro.</div>}
        </div>

        <div>
          <div style={{ ...styles.sectionTitle, color: COLORS.textMuted, marginBottom: 12 }}>
            🕐 Passados ({past.length})
          </div>
          {past.map(e => (
            <div key={e.id} style={{ ...styles.card({ marginBottom: 10, opacity: 0.6 }) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={styles.badge(typeColor(e.type))}>{typeLabel(e.type)}</span>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{e.date}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{e.title}</div>
            </div>
          ))}
          {past.length === 0 && <div style={{ color: COLORS.textMuted, fontSize: 15 }}>Nenhum registro anterior.</div>}
        </div>
      </div>

      {showModal && (
        <div style={styles.modal} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 700 }}>Novo Agendamento</div>
              <button style={styles.btn("ghost")} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={styles.label}>Título</label>
                <input style={styles.input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={styles.label}>Data</label>
                  <input type="date" style={styles.input} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label style={styles.label}>Horário</label>
                  <input type="time" style={styles.input} value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={styles.label}>Tipo</label>
                <select style={styles.input} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="evento">Evento</option>
                  <option value="post">Post</option>
                  <option value="sessao">Sessão 1:1</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Descrição</label>
                <textarea style={styles.textarea} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={styles.btn("outline")} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={styles.btn()} onClick={addEvent}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// GOALS
function Goals({ goals, setGoals }) {
  const [activeTab, setActiveTab] = useState(30);
  const [newGoal, setNewGoal] = useState("");

  const tabColor = { 30: COLORS.teal, 60: COLORS.accent, 90: COLORS.accent, 150: "#FF6B6B", 360: "#A78BFA" };

  const toggleGoal = (id) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(g => g.id === id ? { ...g, done: !g.done } : g)
    }));
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { id: Date.now(), text: newGoal, done: false }]
    }));
    setNewGoal("");
  };

  const deleteGoal = (id) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(g => g.id !== id)
    }));
  };

  const current = goals[activeTab];
  const doneCount = current.filter(g => g.done).length;
  const pct = current.length ? Math.round((doneCount / current.length) * 100) : 0;
  const color = tabColor[activeTab];

  const labelMap = { 30: "30 Dias", 60: "60 Dias", 90: "90 Dias", 150: "150 Dias", 360: "360 Dias" };

  return (
    <div>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Metas do Clube</div>
        <div style={styles.pageSubtitle}>Acompanhe seus objetivos em diferentes horizontes de tempo</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[30, 60, 90, 150, 360].map(t => {
          const g = goals[t];
          const d = g.filter(x => x.done).length;
          const p = g.length ? Math.round((d / g.length) * 100) : 0;
          return (
            <div key={t} style={{ ...styles.card({ flex: 1, cursor: "pointer", borderTop: `3px solid ${activeTab === t ? tabColor[t] : COLORS.border}`, opacity: activeTab === t ? 1 : 0.65 }), transition: "all 0.15s" }}
              onClick={() => setActiveTab(t)}>
              <div style={{ fontSize: 24, fontWeight: 800, color: tabColor[t], marginBottom: 2 }}>{p}%</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{labelMap[t]}</div>
              <Progress value={p} color={tabColor[t]} />
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6 }}>{d}/{g.length} metas</div>
            </div>
          );
        })}
      </div>

      <div style={styles.card()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Metas — {labelMap[activeTab]}</div>
            <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 2 }}>{doneCount} de {current.length} concluídas</div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color }}>
            {pct}%
          </div>
        </div>

        <Progress value={pct} color={color} height={10} />
        <div style={styles.divider} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {current.map(g => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: g.done ? `${color}11` : COLORS.surface, border: `1px solid ${g.done ? color + "33" : COLORS.border}` }}>
              <div onClick={() => toggleGoal(g.id)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${g.done ? color : COLORS.border}`, background: g.done ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}>
                {g.done && <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: g.done ? COLORS.textMuted : COLORS.text, textDecoration: g.done ? "line-through" : "none" }}>{g.text}</span>
              <button style={{ ...styles.btn("ghost"), padding: "2px 8px", color: COLORS.red }} onClick={() => deleteGoal(g.id)}>✕</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={{ ...styles.input, flex: 1 }}
            placeholder="Adicionar nova meta..."
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGoal()}
          />
          <button style={styles.btn()} onClick={addGoal}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

// MENTEE DETAIL (admin side)
function MenteeDetail({ mentee, setMentees, setView }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [customPlan, setCustomPlan] = useState(mentee.customPlan || "");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [payments, setPayments] = useState(mentee.payments || []);
  const milestones = mentee.milestones || [false, false, false, false, false, false];

  useEffect(() => { loadFiles(); }, []);

  const loadFiles = async () => {
    const { data } = await supabase
      .from('files')
      .select('*')
      .eq('mentee_id', String(mentee.id))
      .order('created_at', { ascending: false });
    if (data) {
      const withUrls = await Promise.all(data.map(async (f) => {
        const { data: signed } = await supabase.storage
          .from('mentee-files')
          .createSignedUrl(f.storage_path, 3600);
        return { ...f, url: signed?.signedUrl || '' };
      }));
      setFiles(withUrls);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const path = `${mentee.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('mentee-files').upload(path, file);
    if (!uploadError) {
      await supabase.from('files').insert({
        mentee_id: String(mentee.id),
        name: file.name,
        storage_path: path,
        file_type: file.type,
        size: file.size,
      });
      await loadFiles();
    }
    setUploading(false);
    e.target.value = '';
  };

  const deleteFile = async (fileId, storagePath) => {
    await supabase.storage.from('mentee-files').remove([storagePath]);
    await supabase.from('files').delete().eq('id', fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const fileIcon = (type) => {
    if (!type) return '📄';
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎧';
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊';
    return '📎';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleMilestone = (i) => {
    const updated = [...milestones];
    updated[i] = !updated[i];
    setMentees(prev => prev.map(m => m.id === mentee.id ? { ...m, milestones: updated } : m));
  };

  const savePlan = () => {
    setMentees(prev => prev.map(m => m.id === mentee.id ? { ...m, customPlan } : m));
  };

  const savePayments = async (newPayments) => {
    setPayments(newPayments);
    setMentees(prev => prev.map(m => m.id === mentee.id ? { ...m, payments: newPayments } : m));
    await supabase.from('mentees').update({ payments: newPayments }).eq('id', String(mentee.id));
  };

  const stageColor = STAGE_COLORS[mentee.stage] || COLORS.textMuted;
  const doneCount = milestones.filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button style={{ ...styles.btn("ghost"), marginBottom: 12 }} onClick={() => setView("mentees")}>← Voltar aos Mentorados</button>

        <div style={styles.card()}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <Avatar initials={mentee.avatar} color={mentee.color} size={64} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{mentee.name}</div>
                <span style={styles.badge(stageColor)}>{mentee.stage}</span>
              </div>
              <div style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 8 }}>
                ✉️ {mentee.email} &nbsp; 📞 {mentee.phone}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {(Array.isArray(mentee.tags) ? mentee.tags : []).map(t => (
                  <span key={t} style={styles.tag(mentee.color)}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: 15, color: COLORS.textMuted }}>– Meta: <strong style={{ color: COLORS.text }}>{mentee.goal}</strong></div>
            </div>
            <div style={{ textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: mentee.color, lineHeight: 1 }}>{doneCount}<span style={{ fontSize: 20, color: COLORS.textMuted }}>/{milestones.length}</span></div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>marcos atingidos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone tracker */}
      <div style={{ ...styles.card({ marginBottom: 20 }) }}>
        <div style={styles.sectionTitle}>— Marcos da Jornada</div>
        <div style={{ display: "flex", gap: 0, alignItems: "center", overflowX: "auto", paddingBottom: 8 }}>
          {MILESTONE_LABELS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 70 }}>
                <div onClick={() => toggleMilestone(i)}
                  style={{ width: 36, height: 36, borderRadius: 4, background: milestones[i] ? mentee.color : COLORS.surface, border: `2px solid ${milestones[i] ? mentee.color : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, cursor: "pointer", transition: "all 0.2s", boxShadow: milestones[i] ? `0 0 14px ${mentee.color}66` : "none" }}>
                  {milestones[i] ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: 12, color: milestones[i] ? mentee.color : COLORS.textMuted, marginTop: 6, textAlign: "center", fontWeight: milestones[i] ? 700 : 400 }}>{label}</div>
              </div>
              {i < MILESTONE_LABELS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: milestones[i] ? mentee.color : COLORS.border, margin: "0 4px", marginBottom: 20, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          ["overview",    "Visão Geral"],
          ["plan",        "Plano Personalizado"],
          ["notes",       "Observações"],
          ["files",       `Arquivos${files.length ? ` (${files.length})` : ''}`],
          ["financeiro",  `💰 Financeiro${payments.filter(p => !p.paidAt).length ? ` (${payments.filter(p => !p.paidAt).length})` : ''}`],
        ].map(([k, l]) => (
          <div key={k} style={styles.pill(activeTab === k)} onClick={() => setActiveTab(k)}>{l}</div>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={styles.grid2}>
          <div style={styles.card()}>
            <div style={styles.sectionTitle}>– Plano Base da Mentoria</div>
            {DEFAULT_PLAN_ITEMS.map((item, i) => (
              <div key={i} style={{ fontSize: 15, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>{item}</div>
            ))}
          </div>
          <div style={styles.card()}>
            <div style={styles.sectionTitle}>– Dados do Mentorado</div>
            {[
              ["Entrou em", mentee.joinDate],
              ["Último contato", mentee.lastContact],
              ["Estágio", mentee.stage],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 15 }}>
                <span style={{ color: COLORS.textMuted }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "plan" && (
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>✍️ Plano Personalizado — {mentee.name}</div>
          <textarea
            style={{ ...styles.textarea, minHeight: 220, marginBottom: 12 }}
            placeholder="Descreva aqui o plano personalizado para este mentorado: objetivos específicos, tarefas, prazos, recursos, etc."
            value={customPlan}
            onChange={e => setCustomPlan(e.target.value)}
          />
          <button style={styles.btn()} onClick={savePlan}>Salvar Plano Personalizado</button>
        </div>
      )}

      {activeTab === "notes" && (
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>📝 Observações</div>
          <div style={{ fontSize: 16, color: COLORS.textMuted, lineHeight: 1.7 }}>{mentee.notes || "Sem observações registradas."}</div>
        </div>
      )}

      {activeTab === "files" && (
        <div style={styles.card()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={styles.sectionTitle}>📎 Arquivos do Mentorado</div>
            <label style={{ ...styles.btn("outline"), cursor: "pointer", fontSize: 13, display: "inline-block" }}>
              {uploading ? "Enviando…" : "+ Enviar Arquivo"}
              <input type="file" style={{ display: "none" }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          {files.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.textMuted }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📂</div>
              <div style={{ fontSize: 15 }}>Nenhum arquivo enviado ainda.</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Envie materiais, gravações, planilhas ou qualquer arquivo para este mentorado.</div>
            </div>
          ) : (
            files.map(f => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{fileIcon(f.file_type)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{formatSize(f.size)} · {f.created_at?.split('T')[0]}</div>
                </div>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  style={{ ...styles.btn("outline"), fontSize: 12, padding: "4px 12px", textDecoration: "none", display: "inline-block", flexShrink: 0 }}>
                  Baixar
                </a>
                <button style={{ ...styles.btn("ghost"), color: COLORS.red, padding: "4px 8px", fontSize: 13, flexShrink: 0 }}
                  onClick={() => deleteFile(f.id, f.storage_path)}>✕</button>
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === "financeiro" && (() => {
        const today = new Date().toISOString().slice(0, 10);
        const METHODS = ["PIX", "Transferência", "Cartão", "Outro"];
        const statusOf = p => p.paidAt ? "pago" : p.dueDate < today ? "atrasado" : "pendente";
        const STATUS_COLOR = { pago: COLORS.teal, pendente: COLORS.accent, atrasado: COLORS.red };
        const STATUS_LABEL = { pago: "Pago", pendente: "Pendente", atrasado: "Atrasado" };
        const fmtBRL  = v => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const fmtDate = d => d ? d.split("-").reverse().join("/") : "—";

        const withStatus = payments.map(p => ({ ...p, _status: statusOf(p) }));
        const sorted = [...withStatus].sort((a, b) => {
          const o = { atrasado: 0, pendente: 1, pago: 2 };
          if (o[a._status] !== o[b._status]) return o[a._status] - o[b._status];
          return a.dueDate.localeCompare(b.dueDate);
        });
        const totalPago     = withStatus.filter(p => p._status === "pago").reduce((s, p) => s + (p.amount || 0), 0);
        const totalPendente = withStatus.filter(p => p._status === "pendente").reduce((s, p) => s + (p.amount || 0), 0);
        const totalAtrasado = withStatus.filter(p => p._status === "atrasado").reduce((s, p) => s + (p.amount || 0), 0);

        const clean = list => list.map(({ _status, ...p }) => p);

        return <FinanceiroAdmin
          withStatus={withStatus} sorted={sorted}
          totalPago={totalPago} totalPendente={totalPendente} totalAtrasado={totalAtrasado}
          fmtBRL={fmtBRL} fmtDate={fmtDate}
          STATUS_COLOR={STATUS_COLOR} STATUS_LABEL={STATUS_LABEL}
          METHODS={METHODS} today={today} clean={clean}
          onSave={savePayments} payments={payments}
        />;
      })()}
    </div>
  );
}

function FinanceiroAdmin({ withStatus, sorted, totalPago, totalPendente, totalAtrasado, fmtBRL, fmtDate, STATUS_COLOR, STATUS_LABEL, METHODS, today, clean, onSave, payments }) {
  const empty = { description: "", amount: "", method: "PIX", dueDate: today, paidAt: "" };
  const [mode, setMode] = useState(null); // null | "add" | payment.id
  const [form, setForm] = useState(empty);

  const commit = () => {
    if (!form.description.trim() || !form.amount || !form.dueDate) return;
    const entry = { ...form, amount: Number(form.amount), paidAt: form.paidAt || null };
    if (mode === "add") {
      onSave(clean([...withStatus, { ...entry, id: Date.now() }]));
    } else {
      onSave(clean(withStatus.map(p => p.id === mode ? { ...p, ...entry } : p)));
    }
    setMode(null); setForm(empty);
  };

  const del      = id => onSave(clean(withStatus.filter(p => p.id !== id)));
  const markPaid = id => onSave(clean(withStatus.map(p => p.id === id ? { ...p, paidAt: today } : p)));
  const startEdit = p => { setMode(p.id); setForm({ description: p.description, amount: String(p.amount), method: p.method, dueDate: p.dueDate, paidAt: p.paidAt || "" }); };

  const inp = { ...styles.input, fontSize: 13 };

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Recebido", value: totalPago,     color: COLORS.teal  },
          { label: "Pendente", value: totalPendente, color: COLORS.accent },
          { label: "Atrasado", value: totalAtrasado, color: COLORS.red   },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...styles.card(), padding: "14px 18px", border: `1px solid ${color}33` }}>
            <div style={{ fontSize: 11, color, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color }}>{fmtBRL(value)}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div style={styles.card()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={styles.sectionTitle}>— Histórico de Pagamentos</div>
          {mode !== "add" && (
            <button style={{ ...styles.btn("outline"), fontSize: 12, padding: "5px 14px" }}
              onClick={() => { setMode("add"); setForm(empty); }}>+ Adicionar</button>
          )}
        </div>

        {sorted.length === 0 && mode !== "add" && (
          <div style={{ textAlign: "center", padding: "36px 0", color: COLORS.textMuted }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>💰</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nenhum pagamento registrado</div>
            <div style={{ fontSize: 13 }}>Clique em "+ Adicionar" para registrar o primeiro pagamento.</div>
          </div>
        )}

        {sorted.map(p => (
          mode === p.id ? (
            <div key={p.id} style={{ background: COLORS.surface, borderRadius: 6, padding: 14, marginBottom: 8, border: `1px solid ${COLORS.accent}33` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 8, marginBottom: 8 }}>
                <input style={inp} placeholder="Descrição" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} autoFocus />
                <input style={inp} type="number" placeholder="Valor (R$)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 8, marginBottom: 10 }}>
                <select style={inp} value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                  {METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
                <div>
                  <label style={{ ...styles.label, marginBottom: 4 }}>Vencimento</label>
                  <input style={{ ...inp, width: "100%" }} type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
                <div>
                  <label style={{ ...styles.label, marginBottom: 4 }}>Data de pagamento</label>
                  <input style={{ ...inp, width: "100%" }} type="date" value={form.paidAt || ""} onChange={e => setForm(f => ({ ...f, paidAt: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button style={{ ...styles.btn("ghost"), fontSize: 13 }} onClick={() => setMode(null)}>Cancelar</button>
                <button style={{ ...styles.btn(), fontSize: 13 }} onClick={commit}>Salvar</button>
              </div>
            </div>
          ) : (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{p.description}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>
                  Venc: {fmtDate(p.dueDate)}{p.paidAt ? ` · Pago: ${fmtDate(p.paidAt)}` : ""} · {p.method}
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: STATUS_COLOR[p._status], flexShrink: 0 }}>{fmtBRL(p.amount)}</div>
              <span style={{ ...styles.badge(STATUS_COLOR[p._status]), fontSize: 10 }}>{STATUS_LABEL[p._status]}</span>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {p._status !== "pago" && (
                  <button onClick={() => markPaid(p.id)}
                    style={{ padding: "4px 10px", background: `${COLORS.teal}18`, border: `1px solid ${COLORS.teal}44`, borderRadius: 4, color: COLORS.teal, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                    ✓ Pago
                  </button>
                )}
                <button style={{ ...styles.btn("ghost"), padding: "4px 8px", fontSize: 12 }} onClick={() => startEdit(p)}>✎</button>
                <button style={{ ...styles.btn("ghost"), padding: "4px 8px", fontSize: 12, color: COLORS.red }} onClick={() => del(p.id)}>✕</button>
              </div>
            </div>
          )
        ))}

        {mode === "add" && (
          <div style={{ background: COLORS.surface, borderRadius: 6, padding: 14, marginTop: 12, border: `1px solid ${COLORS.accent}33` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 8, marginBottom: 8 }}>
              <input style={inp} placeholder="Descrição (ex: Mensalidade março/25)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} autoFocus />
              <input style={inp} type="number" placeholder="Valor (R$)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <select style={inp} value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                {METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
              <div>
                <label style={{ ...styles.label, marginBottom: 4 }}>Vencimento</label>
                <input style={{ ...inp, width: "100%" }} type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
              </div>
              <div>
                <label style={{ ...styles.label, marginBottom: 4 }}>Data de pagamento (opcional)</label>
                <input style={{ ...inp, width: "100%" }} type="date" value={form.paidAt || ""} onChange={e => setForm(f => ({ ...f, paidAt: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button style={{ ...styles.btn("ghost"), fontSize: 13 }} onClick={() => setMode(null)}>Cancelar</button>
              <button style={{ ...styles.btn(), fontSize: 13 }} onClick={commit}>Adicionar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// MENTEE PORTAL (user view)
function MenteePortal({ mentee, setView }) {
  const [activeTab, setActiveTab] = useState("home");
  const milestones = mentee.milestones || [false, false, false, false, false, false];
  const doneCount = milestones.filter(Boolean).length;

  return (
    <div>
      <button style={{ ...styles.btn("ghost"), marginBottom: 20 }} onClick={() => setView("mentee-portal-list")}>← Voltar</button>

      {/* Hero */}
      <div style={{ ...styles.card({ marginBottom: 24, background: `linear-gradient(135deg, ${mentee.color}22, ${mentee.color}08)`, border: `1px solid ${mentee.color}44` }) }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Avatar initials={mentee.avatar} color={mentee.color} size={72} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Central do Mentorado</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>Olá, {mentee.name.split(" ")[0]}! ,</div>
            <div style={{ fontSize: 15, color: COLORS.textMuted }}>Sua meta: <strong style={{ color: mentee.color }}>{mentee.goal}</strong></div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: mentee.color, lineHeight: 1 }}>{doneCount}<span style={{ fontSize: 24, color: COLORS.textMuted }}>/{milestones.length}</span></div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>marcos concluídos</div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div style={{ ...styles.card({ marginBottom: 24 }) }}>
        <div style={styles.sectionTitle}>— Sua Jornada de Mentoria</div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {MILESTONE_LABELS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 70 }}>
                <div style={{ width: 36, height: 36, borderRadius: 4, background: milestones[i] ? mentee.color : COLORS.surface, border: `2px solid ${milestones[i] ? mentee.color : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, transition: "all 0.3s", boxShadow: milestones[i] ? `0 0 14px ${mentee.color}66` : "none" }}>
                  {milestones[i] ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: 12, color: milestones[i] ? mentee.color : COLORS.textMuted, marginTop: 6, textAlign: "center", fontWeight: milestones[i] ? 700 : 400 }}>{label}</div>
              </div>
              {i < MILESTONE_LABELS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: milestones[i] ? mentee.color : COLORS.border, margin: "0 4px", marginBottom: 20, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["home", "– Plano Base"], ["custom", "— Plano Personalizado"], ["resources", "– Recursos"]].map(([k, l]) => (
          <div key={k} style={styles.pill(activeTab === k, mentee.color)} onClick={() => setActiveTab(k)}>{l}</div>
        ))}
      </div>

      {activeTab === "home" && (
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>– Plano Base — Mentoria Contínua</div>
          <div style={{ fontSize: 15, color: COLORS.textMuted, marginBottom: 16 }}>
            Este é o núcleo da sua jornada. Nossa mentoria é aberta e contínua — você evolui no seu ritmo, sem prazo de término.
          </div>
          {DEFAULT_PLAN_ITEMS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${mentee.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, color: mentee.color, fontWeight: 700 }}>{i + 1}</div>
              <div style={{ fontSize: 15, lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "custom" && (
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>— Seu Plano Personalizado</div>
          {mentee.customPlan ? (
            <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.8, whiteSpace: "pre-wrap", background: COLORS.surface, borderRadius: 10, padding: 16, border: `1px solid ${mentee.color}33` }}>
              {mentee.customPlan}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>◎</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Plano em elaboração</div>
              <div style={{ fontSize: 15 }}>Seu mentor está preparando um plano exclusivo para você. Em breve ele estará disponível aqui!</div>
            </div>
          )}
        </div>
      )}

      {activeTab === "resources" && (
        <div style={styles.card()}>
          <div style={styles.sectionTitle}>– Biblioteca de Recursos</div>
          {[
            { icon: "🎥", title: "Gravação: Sessão 1 — Diagnóstico", type: "Vídeo", avail: true },
            { icon: "📄", title: "Template: Plano de 90 dias", type: "PDF", avail: true },
            { icon: "🎧", title: "Áudio: Mentalidade de crescimento", type: "Áudio", avail: true },
            { icon: "📊", title: "Planilha: Controle de metas", type: "Planilha", avail: true },
            { icon: "🎥", title: "Gravação: Masterclass — Escala", type: "Vídeo", avail: true },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{r.type}</div>
              </div>
              <span style={styles.badge(COLORS.teal)}>Disponível</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MENTEE PORTAL LIST
function MenteePortalList({ mentees, setView, setSelectedMentee }) {
  return (
    <div>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Minha Jornada</div>
        <div style={styles.pageSubtitle}>Selecione um mentorado para acessar sua central</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {mentees.map(m => {
          const doneCount = (m.milestones || []).filter(Boolean).length;
          return (
            <div key={m.id}
              style={{ ...styles.card({ cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: `1px solid ${m.color}33` }), position: "relative", overflow: "hidden" }}
              onClick={() => { setSelectedMentee(m); setView("mentee-portal"); }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${m.color}, ${m.color}55)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <Avatar initials={m.avatar} color={m.color} size={48} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{m.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={styles.badge(STAGE_COLORS[m.stage] || COLORS.accent)}>{m.stage}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 12 }}>– {m.goal}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>Marcos atingidos</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{doneCount}/{(m.milestones || []).length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// MAIN APP
export default function App() {
  const navigate = useNavigate();
  const { user, authReady, signOut } = useAuth();
  const isLoaded = useRef(false);

  const [view, setView] = useState("dashboard");
  const [mentees, setMentees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Carregar dados após onAuthStateChange ter confirmado sessão (token renovado)
  useEffect(() => {
    if (!authReady || !user) return;
    if (isLoaded.current) return;
    isLoaded.current = false;
    ;(async () => {
      try {
        console.log('[App] fetching data...');
        const [m, l, e, g] = await Promise.all([
          supabase.from('mentees').select('*'),
          supabase.from('leads').select('*'),
          supabase.from('events').select('*'),
          supabase.from('goals').select('*'),
        ]);
        console.log('[load] mentees:', m.data?.length ?? 0, m.error ?? 'ok');
        console.log('[load] leads:',   l.data?.length ?? 0, l.error ?? 'ok');
        console.log('[load] events:',  e.data?.length ?? 0, e.error ?? 'ok');
        console.log('[load] goals:',   g.data?.length ?? 0, g.error ?? 'ok');
        if (m.data?.length) setMentees(m.data.map(toMentee));
        if (l.data?.length) setLeads(l.data.map(toLead));
        if (e.data?.length) setEvents(e.data.map(toEvent));
        if (g.data?.length) setGoals(toGoalsObj(g.data));
        setTimeout(() => { isLoaded.current = true; }, 0);
      } catch (err) {
        console.error('[App] fetch error:', err);
      }
    })();
  }, [authReady, user]);

  // Sincronizar mentorados com o Supabase
  useEffect(() => {
    if (!isLoaded.current) return;
    (async () => {
      const { data: existing } = await supabase.from('mentees').select('id');
      const existingIds = new Set(existing?.map(m => m.id) ?? []);
      const currentIds = new Set(mentees.map(m => String(m.id)));
      const toDelete = [...existingIds].filter(id => !currentIds.has(id));
      if (toDelete.length) await supabase.from('mentees').delete().in('id', toDelete);
      if (mentees.length) await supabase.from('mentees').upsert(mentees.map(toMenteeDb));
    })();
  }, [mentees]);

  // Sincronizar leads com o Supabase
  useEffect(() => {
    if (!isLoaded.current) return;
    (async () => {
      const { data: existing, error: selErr } = await supabase.from('leads').select('id');
      if (selErr) { console.error('[leads sync] select error:', selErr); return; }
      const existingIds = new Set(existing?.map(l => l.id) ?? []);
      const currentIds = new Set(leads.map(l => String(l.id)));
      const toDelete = [...existingIds].filter(id => !currentIds.has(id));
      if (toDelete.length) {
        const { error: delErr } = await supabase.from('leads').delete().in('id', toDelete);
        if (delErr) console.error('[leads sync] delete error:', delErr);
      }
      if (leads.length) {
        const { error: upsErr } = await supabase.from('leads').upsert(leads.map(toLeadDb));
        if (upsErr) console.error('[leads sync] upsert error:', upsErr);
      }
    })();
  }, [leads]);

  // Sincronizar eventos com o Supabase
  useEffect(() => {
    if (!isLoaded.current) return;
    (async () => {
      const { data: existing } = await supabase.from('events').select('id');
      const existingIds = new Set(existing?.map(e => e.id) ?? []);
      const currentIds = new Set(events.map(e => String(e.id)));
      const toDelete = [...existingIds].filter(id => !currentIds.has(id));
      if (toDelete.length) await supabase.from('events').delete().in('id', toDelete);
      if (events.length) await supabase.from('events').upsert(events.map(toEventDb));
    })();
  }, [events]);

  // Sincronizar metas com o Supabase
  useEffect(() => {
    if (!isLoaded.current) return;
    (async () => {
      const rows = fromGoalsObj(goals);
      const { data: existing } = await supabase.from('goals').select('id');
      const existingIds = new Set(existing?.map(g => g.id) ?? []);
      const currentIds = new Set(rows.map(r => r.id));
      const toDelete = [...existingIds].filter(id => !currentIds.has(id));
      if (toDelete.length) await supabase.from('goals').delete().in('id', toDelete);
      if (rows.length) await supabase.from('goals').upsert(rows);
    })();
  }, [goals]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const copyPortalLink = (mentee) => {
    const url = `${window.location.origin}/mentorado/${mentee.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(mentee.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const nav = [
    { id: "dashboard", label: "Visão Geral", icon: "◈" },
    { id: "mentees", label: "Mentorados", icon: "◇" },
    { id: "crm", label: "Prospecção", icon: "◉" },
    { id: "calendar", label: "Calendário", icon: "◻" },
    { id: "goals", label: "Metas", icon: "◎" },
  ];

  const renderView = () => {
    if (view === "mentee-detail" && selectedMentee) return <MenteeDetail mentee={selectedMentee} setMentees={setMentees} setView={setView} />;
    if (view === "mentees") return <MenteesSection mentees={mentees} setMentees={setMentees} setView={setView} setSelectedMentee={setSelectedMentee} copyPortalLink={copyPortalLink} copiedId={copiedId} />;
    if (view === "crm") return <CRM leads={leads} setLeads={setLeads} setMentees={setMentees} />;
    if (view === "calendar") return <Calendar events={events} setEvents={setEvents} />;
    if (view === "goals") return <Goals goals={goals} setGoals={setGoals} />;
    return <Dashboard mentees={mentees} leads={leads} events={events} />;
  };

  const activeLeads = leads.filter(l => l.stage !== "Convertido" && l.stage !== "Perdido").length;

  const sidebarStyle = {
    ...styles.sidebar,
    ...(isMobile ? {
      transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s ease",
      zIndex: 200,
    } : {}),
  };

  const mainStyle = {
    ...styles.main,
    marginLeft: isMobile ? 0 : 260,
    padding: isMobile ? "24px 20px" : "48px 56px",
    maxWidth: isMobile ? "100vw" : "calc(100vw - 260px)",
  };

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A84C55; }
        input[type=range] { accent-color: #C9A84C; }
        select option { background: #161616; color: #F2EDE4; }
        button:hover { opacity: 0.85; }
        input:focus, textarea:focus, select:focus { border-color: #C9A84C55 !important; }
      `}</style>

      {isMobile && sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 150 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div style={sidebarStyle}>
        <div style={styles.logo}>
          <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 46, width: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} />
        </div>

        <div style={{ padding: "20px 0 8px" }}>
          <div style={styles.navLabel}>Administração</div>
          {nav.map(item => (
            <div key={item.id} style={styles.navItem(view === item.id || (view === "mentee-detail" && item.id === "mentees"))}
              onClick={() => { setView(item.id); if (isMobile) setSidebarOpen(false); }}>
              <span style={{ fontSize: 12, color: (view === item.id || (view === "mentee-detail" && item.id === "mentees")) ? COLORS.accent : COLORS.textDim, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === "crm" && activeLeads > 0 && (
                <span style={{ background: COLORS.accent, color: "#0A0800", borderRadius: 2, fontSize: 11, fontWeight: 600, fontFamily: FONT_UI, padding: "2px 6px", letterSpacing: "0.06em" }}>{activeLeads}</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: "0 28px 8px" }}>
          <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 20 }}>
            <div style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: FONT_UI, marginBottom: 14 }}>{mentees.filter(m => m.stage === "Ativo").length} mentorados · {activeLeads} leads</div>
            <button
              onClick={signOut}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", cursor: "pointer", color: COLORS.textMuted, fontSize: 13, fontFamily: FONT_UI, letterSpacing: "0.06em", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = COLORS.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; }}
            >
              <span style={{ fontSize: 14 }}>⎋</span> Sair da conta
            </button>
          </div>
        </div>
      </div>

      <div style={mainStyle}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.text,
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: 2,
              marginBottom: 24,
              fontSize: 20,
              lineHeight: 1,
            }}
          >☰</button>
        )}
        {renderView()}
      </div>
    </div>
  );
}
