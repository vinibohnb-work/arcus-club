import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, toProspect, toProspectDb } from "../lib/supabase";

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616", cardHover: "#1C1C1C",
  border: "#2A2A2A", borderLight: "#1C1C1C",
  accent: "#C9A84C", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI      = `'Jost', 'DM Sans', sans-serif`;

// ─── Static data ──────────────────────────────────────────────────────────────
const PROSPECT_STATUSES = [
  { key: "identificado",  label: "Identificado",  color: "#6B7280", desc: "Escola mapeada" },
  { key: "contato",       label: "1º Contato",    color: "#7B6FD4", desc: "Primeiro contato feito" },
  { key: "apresentacao",  label: "Apresentação",  color: "#3DBFB0", desc: "Demo ou apresentação" },
  { key: "proposta",      label: "Proposta",      color: "#C9A84C", desc: "Proposta enviada" },
  { key: "negociacao",    label: "Negociação",    color: "#E09A3D", desc: "Em negociação" },
  { key: "fechado",       label: "Fechado ✓",     color: "#4ade80", desc: "Contrato fechado" },
  { key: "perdido",       label: "Perdido",       color: "#E05252", desc: "Sem interesse" },
];
const PROSPECT_TYPES = [
  { key: "particular",   label: "Particular" },
  { key: "publica",      label: "Pública" },
  { key: "tecnica",      label: "Técnica" },
  { key: "universidade", label: "Universidade" },
];
const INTERACTION_TYPES = ["Ligação", "Mensagem", "Reunião", "E-mail", "Visita", "Outro"];
const NEXT_STEP_TYPES   = ["Ligar", "Enviar mensagem", "Enviar proposta", "Agendar reunião", "Follow-up", "Outro"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sColor  = (s) => PROSPECT_STATUSES.find(x => x.key === s)?.color || COLORS.textMuted;
const sLabel  = (s) => PROSPECT_STATUSES.find(x => x.key === s)?.label || s;
const tLabel  = (t) => PROSPECT_TYPES.find(x => x.key === t)?.label || t;
const fmtDate = (d) => d ? d.split("-").reverse().join("/") : "";
const uid     = () => Math.random().toString(36).slice(2, 10);

const interactionIcon = (t) => ({ "Ligação": "📞", "Mensagem": "💬", "Reunião": "🤝", "E-mail": "✉️", "Visita": "🚶", "Outro": "📝" }[t] || "📝");
const stepIcon        = (t) => ({ "Ligar": "📞", "Enviar mensagem": "💬", "Enviar proposta": "📄", "Agendar reunião": "🤝", "Follow-up": "🔄", "Outro": "📝" }[t] || "📝");
const stepUrgency     = (date, today) => {
  if (!date) return COLORS.textMuted;
  if (date < today) return COLORS.red;
  if (date === today) return COLORS.accent;
  return COLORS.textMuted;
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const S = {
  input: {
    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2,
    padding: "10px 14px", color: COLORS.text, fontSize: 14, width: "100%",
    outline: "none", fontFamily: FONT_UI, letterSpacing: "0.02em", boxSizing: "border-box",
  },
  textarea: {
    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2,
    padding: "10px 14px", color: COLORS.text, fontSize: 14, width: "100%",
    outline: "none", fontFamily: FONT_UI, resize: "vertical", minHeight: 80,
    letterSpacing: "0.02em", boxSizing: "border-box",
  },
  label: {
    fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 6,
    display: "block", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT_UI,
  },
  btn: (variant = "primary") => ({
    padding: "9px 20px", borderRadius: 2, cursor: "pointer",
    fontSize: 13, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em",
    textTransform: "uppercase", transition: "all 0.2s",
    background: variant === "ghost" ? "transparent" : variant === "outline" ? "transparent" : COLORS.accent,
    color: variant === "ghost" ? COLORS.textMuted : variant === "outline" ? COLORS.accent : "#0A0800",
    border: variant === "outline" ? `1px solid ${COLORS.accent}44` : variant === "ghost" ? "none" : "none",
  }),
  modal: {
    position: "fixed", inset: 0, background: "#000000CC", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 24, backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 4,
    padding: 32, width: "100%", maxWidth: 560, maxHeight: "88vh", overflowY: "auto",
  },
  pill: (active, color = COLORS.accent) => ({
    padding: "5px 14px", borderRadius: 2, fontSize: 11, fontWeight: 500, fontFamily: FONT_UI,
    letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
    background: active ? `${color}18` : "transparent", color: active ? color : COLORS.textMuted,
    border: `1px solid ${active ? color + "55" : COLORS.border}`, transition: "all 0.15s",
  }),
};

// ─── School card (kanban) ─────────────────────────────────────────────────────
function SchoolCard({ prospect, today, onClick }) {
  const pending = (prospect.nextSteps || []).filter(s => !s.done);
  const overdue = pending.filter(s => s.date < today).length > 0;
  const nextStep = [...pending].sort((a, b) => a.date.localeCompare(b.date))[0];
  const bg = overdue ? `${COLORS.red}14` : COLORS.card;
  const borderColor = overdue ? `${COLORS.red}55` : COLORS.border;
  return (
    <div onClick={onClick}
      style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 4,
        padding: "10px 12px", cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = overdue ? `${COLORS.red}22` : COLORS.cardHover}
      onMouseLeave={e => e.currentTarget.style.background = bg}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: overdue ? COLORS.red : COLORS.text,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {prospect.schoolName}
      </div>
      <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>
        {tLabel(prospect.schoolType)}{prospect.city ? ` · ${prospect.city}` : ""}
      </div>
      {nextStep && (
        <div style={{ fontSize: 11, color: overdue ? COLORS.red : COLORS.textMuted, marginTop: 4 }}>
          {stepIcon(nextStep.type)} {fmtDate(nextStep.date)}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProspeccaoPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const today        = new Date().toISOString().slice(0, 10);
  const tomorrow     = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();

  const [prospects, setProspects]   = useState([]);
  const [menteeName, setMenteeName] = useState("");
  const [loading, setLoading]       = useState(true);
  const [viewMode, setViewMode]     = useState("kanban");
  const [search, setSearch]         = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [detailTab, setDetailTab]   = useState("history");

  // Modals
  const [showAddModal, setShowAddModal]           = useState(false);
  const [showEditModal, setShowEditModal]         = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showNextStepModal, setShowNextStepModal] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [editingStep, setEditingStep]             = useState(null);
  const [saving, setSaving]                       = useState(false);

  const BLANK_SCHOOL = {
    schoolName: "", schoolType: "particular", city: "", state: "",
    contactName: "", contactRole: "", phone: "", email: "",
    status: "identificado", notes: "",
  };
  const [schoolForm, setSchoolForm]               = useState(BLANK_SCHOOL);
  const [interactionForm, setInteractionForm]     = useState({ type: "Ligação", note: "", date: today });
  const [nextStepForm, setNextStepForm]           = useState({ type: "Ligar", title: "", note: "", date: tomorrow });

  const selectedProspect = prospects.find(p => p.id === selectedId) || null;
  const filtered = prospects.filter(p =>
    p.schoolName.toLowerCase().includes(search.toLowerCase()) ||
    p.contactName.toLowerCase().includes(search.toLowerCase())
  );

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [{ data: menteeRow }, { data: rows }] = await Promise.all([
        supabase.from("mentees").select("name").eq("id", id).single(),
        supabase.from("mentee_prospects").select("*").eq("mentee_id", id).order("created_at", { ascending: false }),
      ]);
      if (menteeRow) setMenteeName(menteeRow.name);
      setProspects((rows || []).map(toProspect));
      setLoading(false);
    };
    load();
  }, [id]);

  // ── Persist prospect row ──────────────────────────────────────────────────
  const persist = async (updated) => {
    const db = toProspectDb(updated);
    await supabase.from("mentee_prospects").update(db).eq("id", updated.id);
    setProspects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // ── Add school ────────────────────────────────────────────────────────────
  const handleAddSchool = async () => {
    if (!schoolForm.schoolName.trim()) return;
    setSaving(true);
    try {
      const db = toProspectDb({ ...schoolForm, menteeId: id, interactions: [], nextSteps: [] });
      const { data } = await supabase.from("mentee_prospects")
        .insert({ ...db, mentee_id: id }).select().single();
      if (data) {
        const newP = toProspect(data);
        setProspects(prev => [newP, ...prev]);
        setSelectedId(newP.id);
        setDetailTab("history");
      }
      setShowAddModal(false);
      setSchoolForm(BLANK_SCHOOL);
    } finally { setSaving(false); }
  };

  // ── Edit school ───────────────────────────────────────────────────────────
  const handleEditSchool = async () => {
    if (!schoolForm.schoolName.trim() || !selectedProspect) return;
    setSaving(true);
    try {
      const updated = { ...selectedProspect, ...schoolForm };
      await persist(updated);
      setShowEditModal(false);
    } finally { setSaving(false); }
  };

  // ── Delete school ─────────────────────────────────────────────────────────
  const handleDeleteSchool = async () => {
    if (!selectedId) return;
    await supabase.from("mentee_prospects").delete().eq("id", selectedId);
    setProspects(prev => prev.filter(p => p.id !== selectedId));
    setSelectedId(null);
    setShowEditModal(false);
  };

  // ── Move status ───────────────────────────────────────────────────────────
  const moveStatus = async (prospect, newStatus) => {
    await persist({ ...prospect, status: newStatus });
  };

  // ── Add / edit interaction ────────────────────────────────────────────────
  const handleSaveInteraction = async () => {
    if (!interactionForm.note || !selectedProspect) return;
    setSaving(true);
    try {
      let interactions;
      if (editingInteraction) {
        interactions = (selectedProspect.interactions || [])
          .map(it => it.id === editingInteraction ? { ...it, ...interactionForm } : it)
          .sort((a, b) => b.date.localeCompare(a.date));
      } else {
        const entry = { id: uid(), ...interactionForm };
        interactions = [...(selectedProspect.interactions || []), entry]
          .sort((a, b) => b.date.localeCompare(a.date));
      }
      await persist({ ...selectedProspect, interactions });
      setShowInteractionModal(false);
      setEditingInteraction(null);
      setInteractionForm({ type: "Ligação", note: "", date: today });
    } finally { setSaving(false); }
  };

  const deleteInteraction = async (itId) => {
    const interactions = (selectedProspect.interactions || []).filter(it => it.id !== itId);
    await persist({ ...selectedProspect, interactions });
  };

  // ── Add / edit next step ──────────────────────────────────────────────────
  const handleSaveNextStep = async () => {
    if (!nextStepForm.title || !selectedProspect) return;
    setSaving(true);
    try {
      let nextSteps;
      if (editingStep) {
        nextSteps = (selectedProspect.nextSteps || [])
          .map(s => s.id === editingStep ? { ...s, ...nextStepForm } : s)
          .sort((a, b) => a.date.localeCompare(b.date));
      } else {
        const step = { id: uid(), ...nextStepForm, done: false };
        nextSteps = [...(selectedProspect.nextSteps || []), step]
          .sort((a, b) => a.date.localeCompare(b.date));
      }
      await persist({ ...selectedProspect, nextSteps });
      setShowNextStepModal(false);
      setEditingStep(null);
      setNextStepForm({ type: "Ligar", title: "", note: "", date: tomorrow });
    } finally { setSaving(false); }
  };

  const deleteStep = async (stepId) => {
    const nextSteps = (selectedProspect.nextSteps || []).filter(s => s.id !== stepId);
    await persist({ ...selectedProspect, nextSteps });
  };

  const toggleStepDone = async (stepId) => {
    const nextSteps = (selectedProspect.nextSteps || [])
      .map(s => s.id === stepId ? { ...s, done: !s.done } : s);
    await persist({ ...selectedProspect, nextSteps });
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const active  = prospects.filter(p => !["fechado","perdido"].includes(p.status)).length;
  const overdue = prospects.filter(p => {
    const pending = (p.nextSteps || []).filter(s => !s.done);
    return pending.some(s => s.date < today) && !["fechado","perdido"].includes(p.status);
  }).length;

  // ── Field helper ──────────────────────────────────────────────────────────
  const sf = (field) => (e) => setSchoolForm(prev => ({ ...prev, [field]: e.target.value }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT_UI, color: COLORS.text,
      backgroundImage: `radial-gradient(ellipse at 20% 0%, #1A140833 0%, transparent 60%)` }}>

      {/* ── Top bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: `${COLORS.bg}ee`,
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 32px", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
        <button onClick={() => navigate(`/mentorado/${id}`)}
          style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer",
            fontFamily:FONT_UI, fontSize:13, display:"flex", alignItems:"center", gap:6, padding:"4px 0" }}
          onMouseEnter={e => e.currentTarget.style.color = COLORS.accent}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.textMuted}>
          ← Voltar
        </button>
        <div style={{ width:1, height:20, background:COLORS.border }} />
        <div style={{ fontSize:13, color:COLORS.textMuted }}>
          {menteeName && <span style={{ color:COLORS.text }}>{menteeName}</span>}
          {menteeName && " · "}Prospecção
        </div>
      </div>

      <div style={{ padding: "44px 48px 80px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 36, display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
          <div>
            <div style={{ fontSize:11, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>CRM</div>
            <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:36, fontWeight:700, fontStyle:"italic",
              color:COLORS.text, margin:0, letterSpacing:"-0.01em", lineHeight:1.1 }}>
              Prospecção de Escolas
            </h1>
            <p style={{ fontSize:14, color:COLORS.textMuted, marginTop:8, letterSpacing:"0.04em" }}>
              Pipeline de vendas — cadastre escolas, registre interações e gerencie os próximos passos.
            </p>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            {/* View toggle */}
            <div style={{ display:"flex", border:`1px solid ${COLORS.border}`, borderRadius:2, overflow:"hidden" }}>
              {[["kanban", "⊞ Kanban"], ["list", "≡ Lista"]].map(([v, label]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  style={{ padding:"8px 16px", border:"none", cursor:"pointer", fontSize:12, fontWeight:600,
                    fontFamily:FONT_UI, letterSpacing:"0.08em",
                    background: viewMode === v ? COLORS.accent : COLORS.surface,
                    color: viewMode === v ? "#0A0800" : COLORS.textMuted, transition:"all 0.15s" }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => { setSchoolForm(BLANK_SCHOOL); setShowAddModal(true); }}
              style={{ ...S.btn(), padding:"9px 22px" }}>
              + Nova Escola
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28, maxWidth:600 }}>
          {[
            { label:"Total",            value:prospects.length, color:COLORS.accent },
            { label:"Em andamento",     value:active,           color:COLORS.teal },
            { label:"Ações em atraso",  value:overdue,          color: overdue > 0 ? COLORS.red : COLORS.textMuted },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`,
              borderRadius:4, padding:"16px 20px", borderLeft:`2px solid ${color}` }}>
              <div style={{ fontFamily:FONT_DISPLAY, fontSize:30, fontWeight:700, color, letterSpacing:"-0.02em" }}>{value}</div>
              <div style={{ fontSize:11, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.12em", marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div style={{ marginBottom:20 }}>
          <input style={{ ...S.input, maxWidth:420, fontSize:13 }}
            placeholder="🔍 Buscar escola ou contato…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:COLORS.textMuted }}>Carregando…</div>
        ) : prospects.length === 0 ? (
          <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:8,
            padding:"64px 0", textAlign:"center", color:COLORS.textMuted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏫</div>
            <div style={{ fontSize:16, fontWeight:600, color:COLORS.text, marginBottom:8 }}>Nenhuma escola cadastrada</div>
            <div style={{ fontSize:13 }}>Clique em "+ Nova Escola" para começar a prospecção.</div>
          </div>
        ) : (
          <>
            {/* ── KANBAN ── */}
            {viewMode === "kanban" && (
              <div style={{ overflowX:"auto", paddingBottom:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(7,minmax(160px,1fr))", gap:10, alignItems:"flex-start" }}>
                  {PROSPECT_STATUSES.map(status => {
                    const col = filtered.filter(p => p.status === status.key);
                    return (
                      <div key={status.key} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        <div style={{ background:COLORS.surface, border:`1px solid ${COLORS.border}`,
                          borderTop:`3px solid ${status.color}`, borderRadius:4, padding:"10px 14px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div style={{ fontSize:11, fontWeight:700, color:status.color,
                              letterSpacing:"0.1em", textTransform:"uppercase" }}>{status.label}</div>
                            <div style={{ fontSize:11, background:`${status.color}22`, color:status.color,
                              borderRadius:10, padding:"1px 7px", fontWeight:700 }}>{col.length}</div>
                          </div>
                          <div style={{ fontSize:11, color:COLORS.textDim, marginTop:3 }}>{status.desc}</div>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                          {col.map(p => (
                            <SchoolCard key={p.id} prospect={p} today={today}
                              onClick={() => { setSelectedId(p.id); setDetailTab("history"); }} />
                          ))}
                          {col.length === 0 && (
                            <div style={{ border:`1px dashed ${COLORS.border}`, borderRadius:4,
                              padding:"24px 12px", textAlign:"center", color:COLORS.textDim, fontSize:12 }}>
                              —
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
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {PROSPECT_STATUSES.map(status => {
                  const col = filtered.filter(p => p.status === status.key);
                  if (col.length === 0) return null;
                  return (
                    <div key={status.key} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px",
                        background:COLORS.surface, border:`1px solid ${COLORS.border}`,
                        borderLeft:`3px solid ${status.color}`, borderRadius:4, marginBottom:6 }}>
                        <div style={{ fontSize:12, fontWeight:700, color:status.color,
                          textTransform:"uppercase", letterSpacing:"0.1em" }}>{status.label}</div>
                        <div style={{ fontSize:11, color:COLORS.textDim }}>{status.desc}</div>
                        <div style={{ marginLeft:"auto", fontSize:12, color:status.color, fontWeight:700 }}>{col.length}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:4, paddingLeft:12 }}>
                        {col.map(p => {
                          const pending = (p.nextSteps || []).filter(s => !s.done);
                          const isOverdue = pending.some(s => s.date < today);
                          const nextStep = [...pending].sort((a, b) => a.date.localeCompare(b.date))[0];
                          return (
                            <div key={p.id} onClick={() => { setSelectedId(p.id); setDetailTab("history"); }}
                              style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`,
                                borderLeft:`3px solid ${sColor(p.status)}`, borderRadius:4,
                                padding:"10px 16px", cursor:"pointer", display:"flex",
                                alignItems:"center", gap:12, transition:"background 0.15s" }}
                              onMouseEnter={e => e.currentTarget.style.background = COLORS.cardHover}
                              onMouseLeave={e => e.currentTarget.style.background = COLORS.card}>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:14, fontWeight:700, color:COLORS.text }}>{p.schoolName}</div>
                                <div style={{ fontSize:12, color:COLORS.textMuted }}>
                                  {tLabel(p.schoolType)}{p.city ? ` · ${p.city}` : ""}{p.contactName ? ` · ${p.contactName}` : ""}
                                </div>
                              </div>
                              {nextStep && (
                                <div style={{ fontSize:12, color:stepUrgency(nextStep.date, today), flexShrink:0 }}>
                                  {stepIcon(nextStep.type)} {fmtDate(nextStep.date)}
                                </div>
                              )}
                              {isOverdue && (
                                <span style={{ fontSize:11, background:COLORS.red, color:"#fff",
                                  borderRadius:10, padding:"1px 7px", fontWeight:700, flexShrink:0 }}>atraso</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Detalhe da Escola
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedProspect && (
        <div style={S.modal} onClick={() => setSelectedId(null)}>
          <div style={{ ...S.modalBox, maxWidth:640, maxHeight:"92vh" }} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:20,
              paddingBottom:20, borderBottom:`1px solid ${COLORS.border}` }}>
              <div style={{ width:44, height:44, borderRadius:2, background:`${sColor(selectedProspect.status)}18`,
                border:`1px solid ${sColor(selectedProspect.status)}44`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:20, flexShrink:0 }}>
                🏫
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:18, fontWeight:700, color:COLORS.text, marginBottom:2 }}>
                  {selectedProspect.schoolName}
                </div>
                <div style={{ fontSize:12, color:COLORS.textMuted }}>
                  {tLabel(selectedProspect.schoolType)}
                  {selectedProspect.city ? ` · ${selectedProspect.city}${selectedProspect.state ? `/${selectedProspect.state}` : ""}` : ""}
                  {selectedProspect.contactName ? ` · ${selectedProspect.contactName}${selectedProspect.contactRole ? ` (${selectedProspect.contactRole})` : ""}` : ""}
                </div>
                {(selectedProspect.phone || selectedProspect.email) && (
                  <div style={{ fontSize:12, color:COLORS.textMuted, marginTop:2 }}>
                    {selectedProspect.phone}{selectedProspect.phone && selectedProspect.email ? " · " : ""}{selectedProspect.email}
                  </div>
                )}
              </div>
              <button style={{ ...S.btn("outline"), padding:"5px 12px", fontSize:12 }}
                onClick={() => { setSchoolForm({ ...selectedProspect }); setShowEditModal(true); }}>
                ✎ Editar
              </button>
              <button style={{ ...S.btn("ghost"), padding:"5px 8px" }} onClick={() => setSelectedId(null)}>✕</button>
            </div>

            {/* Status selector */}
            <div style={{ marginBottom:20 }}>
              <div style={S.label}>Status no pipeline</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {PROSPECT_STATUSES.map(s => (
                  <button key={s.key} onClick={() => moveStatus(selectedProspect, s.key)}
                    style={S.pill(selectedProspect.status === s.key, s.color)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:16 }}>
              {[["history","📋 Histórico"], ["nextsteps","🗓 Próximos Passos"]].map(([k, label]) => {
                const badge = k === "nextsteps"
                  ? (selectedProspect.nextSteps || []).filter(s => !s.done && s.date <= today).length : 0;
                return (
                  <button key={k} onClick={() => setDetailTab(k)}
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 16px",
                      borderRadius:2, cursor:"pointer", fontSize:13, fontWeight:600,
                      background: detailTab === k ? COLORS.accent : COLORS.card,
                      color: detailTab === k ? "#0A0800" : COLORS.textMuted,
                      border: `1px solid ${detailTab === k ? COLORS.accent : COLORS.border}`,
                      transition:"all 0.15s", fontFamily:FONT_UI }}>
                    {label}
                    {badge > 0 && <span style={{ background:COLORS.red, color:"#fff", borderRadius:10,
                      padding:"0 5px", fontSize:10, fontWeight:700 }}>{badge}</span>}
                  </button>
                );
              })}
              <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
                {detailTab === "history" && (
                  <button style={{ ...S.btn("outline"), fontSize:12, padding:"6px 14px" }}
                    onClick={() => setShowInteractionModal(true)}>+ Interação</button>
                )}
                {detailTab === "nextsteps" && (
                  <button style={{ ...S.btn("outline"), fontSize:12, padding:"6px 14px" }}
                    onClick={() => setShowNextStepModal(true)}>+ Passo</button>
                )}
              </div>
            </div>

            {/* Tab content */}
            <div style={{ overflowY:"auto", maxHeight:340 }}>
              {detailTab === "history" && (
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {(selectedProspect.interactions || []).length === 0 ? (
                    <div style={{ textAlign:"center", padding:"32px 0", color:COLORS.textMuted }}>
                      <div style={{ fontSize:24, marginBottom:8 }}>💬</div>
                      <div style={{ fontWeight:600 }}>Nenhuma interação registrada.</div>
                      <div style={{ fontSize:13, marginTop:4 }}>Registre ligações, mensagens, reuniões e visitas.</div>
                    </div>
                  ) : (selectedProspect.interactions || []).map(it => (
                    <div key={it.id} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`,
                      borderRadius:4, padding:"12px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ width:32, height:32, borderRadius:"50%", background:`${COLORS.accent}18`,
                        display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                        {interactionIcon(it.type)}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:13, fontWeight:700, color:COLORS.text }}>{it.type}</span>
                          <span style={{ fontSize:12, color:COLORS.textMuted, marginLeft:"auto" }}>{fmtDate(it.date)}</span>
                          <button style={{ ...S.btn("ghost"), padding:"2px 6px", fontSize:12 }}
                            onClick={() => { setEditingInteraction(it.id); setInteractionForm({ type:it.type, note:it.note, date:it.date }); setShowInteractionModal(true); }}>✎</button>
                          <button style={{ ...S.btn("ghost"), padding:"2px 6px", fontSize:12, color:COLORS.red }}
                            onClick={() => deleteInteraction(it.id)}>✕</button>
                        </div>
                        <div style={{ fontSize:13, color:COLORS.text, lineHeight:1.6 }}>{it.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {detailTab === "nextsteps" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(selectedProspect.nextSteps || []).length === 0 ? (
                    <div style={{ textAlign:"center", padding:"32px 0", color:COLORS.textMuted }}>
                      <div style={{ fontSize:24, marginBottom:8 }}>🗓</div>
                      <div style={{ fontWeight:600 }}>Nenhum próximo passo agendado.</div>
                      <div style={{ fontSize:13, marginTop:4 }}>Agende ações para avançar com esta escola.</div>
                    </div>
                  ) : (selectedProspect.nextSteps || []).map(s => {
                    const isOverdue = s.date < today && !s.done;
                    const isToday   = s.date === today && !s.done;
                    return (
                      <div key={s.id} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`,
                        borderLeft:`3px solid ${s.done ? COLORS.teal : isOverdue ? COLORS.red : isToday ? COLORS.accent : COLORS.border}`,
                        borderRadius:4, padding:"10px 14px", display:"flex", alignItems:"center", gap:12,
                        opacity: s.done ? 0.5 : 1 }}>
                        <div onClick={() => toggleStepDone(s.id)}
                          style={{ width:20, height:20, borderRadius:4, border:`2px solid ${s.done ? COLORS.teal : COLORS.border}`,
                            background: s.done ? COLORS.teal : "transparent", display:"flex", alignItems:"center",
                            justifyContent:"center", cursor:"pointer", fontSize:13, flexShrink:0, transition:"all 0.2s" }}>
                          {s.done && "✓"}
                        </div>
                        <span style={{ fontSize:16, flexShrink:0 }}>{stepIcon(s.type)}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                            <span style={{ fontSize:13, fontWeight:700,
                              color: s.done ? COLORS.textMuted : COLORS.text,
                              textDecoration: s.done ? "line-through" : "none" }}>{s.title}</span>
                            {isOverdue && <span style={{ fontSize:11, color:COLORS.red, fontWeight:700 }}>⚠ Atrasado</span>}
                            {isToday   && <span style={{ fontSize:11, color:COLORS.accent, fontWeight:700 }}>● Hoje</span>}
                          </div>
                          {s.note && <div style={{ fontSize:12, color:COLORS.textMuted, marginTop:2 }}>{s.note}</div>}
                        </div>
                        <span style={{ fontSize:12, color: s.done ? COLORS.textMuted : stepUrgency(s.date, today),
                          fontWeight: isToday || isOverdue ? 700 : 400, flexShrink:0 }}>
                          {fmtDate(s.date)}
                        </span>
                        <button style={{ ...S.btn("ghost"), padding:"2px 6px", fontSize:12 }}
                          onClick={() => { setEditingStep(s.id); setNextStepForm({ type:s.type, title:s.title, note:s.note||"", date:s.date }); setShowNextStepModal(true); }}>✎</button>
                        <button style={{ ...S.btn("ghost"), padding:"2px 6px", fontSize:12, color:COLORS.red }}
                          onClick={() => deleteStep(s.id)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedProspect.notes && (
              <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${COLORS.border}`,
                fontSize:13, color:COLORS.textMuted, fontStyle:"italic", lineHeight:1.6 }}>
                {selectedProspect.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Nova / Editar Escola
      ══════════════════════════════════════════════════════════════════════ */}
      {(showAddModal || showEditModal) && (
        <div style={S.modal} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:FONT_DISPLAY, fontStyle:"italic" }}>
                {showAddModal ? "Nova Escola" : "Editar Escola"}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {showEditModal && (
                  <button style={{ ...S.btn("ghost"), color:COLORS.red, padding:"6px 12px", fontSize:12 }}
                    onClick={handleDeleteSchool}>Excluir</button>
                )}
                <button style={{ ...S.btn("ghost") }} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>✕</button>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={S.label}>Nome da escola *</label>
                <input value={schoolForm.schoolName} onChange={sf("schoolName")}
                  placeholder="Ex: Colégio São Paulo" style={S.input} autoFocus />
              </div>
              <div>
                <label style={S.label}>Tipo</label>
                <select value={schoolForm.schoolType} onChange={sf("schoolType")} style={S.input}>
                  {PROSPECT_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Status</label>
                <select value={schoolForm.status} onChange={sf("status")} style={S.input}>
                  {PROSPECT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Cidade</label>
                <input value={schoolForm.city} onChange={sf("city")} placeholder="Ex: São Paulo" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Estado</label>
                <input value={schoolForm.state} onChange={sf("state")} placeholder="Ex: SP" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Nome do contato</label>
                <input value={schoolForm.contactName} onChange={sf("contactName")} placeholder="Responsável" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Cargo</label>
                <input value={schoolForm.contactRole} onChange={sf("contactRole")} placeholder="Ex: Diretor(a)" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Telefone</label>
                <input value={schoolForm.phone} onChange={sf("phone")} placeholder="(00) 00000-0000" style={S.input} />
              </div>
              <div>
                <label style={S.label}>E-mail</label>
                <input type="email" value={schoolForm.email} onChange={sf("email")} placeholder="contato@escola.com" style={S.input} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={S.label}>Observações</label>
                <textarea value={schoolForm.notes} onChange={sf("notes")} rows={3}
                  placeholder="Notas gerais sobre a escola…" style={S.textarea} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button style={S.btn("outline")} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancelar</button>
              <button style={S.btn()} disabled={saving || !schoolForm.schoolName.trim()}
                onClick={showAddModal ? handleAddSchool : handleEditSchool}>
                {saving ? "Salvando…" : showAddModal ? "Salvar" : "Atualizar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Registrar Interação
      ══════════════════════════════════════════════════════════════════════ */}
      {showInteractionModal && (
        <div style={S.modal} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:FONT_DISPLAY, fontStyle:"italic" }}>
                {editingInteraction ? "Editar Interação" : "Registrar Interação"}
                <span style={{ fontFamily:FONT_UI, fontStyle:"normal", fontSize:14, color:COLORS.textMuted, fontWeight:400, marginLeft:10 }}>
                  — {selectedProspect?.schoolName}
                </span>
              </div>
              <button style={S.btn("ghost")} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>✕</button>
            </div>
            <div style={{ display:"grid", gap:14 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={S.label}>Tipo</label>
                  <select style={S.input} value={interactionForm.type}
                    onChange={e => setInteractionForm(p => ({ ...p, type: e.target.value }))}>
                    {INTERACTION_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Data</label>
                  <input type="date" style={S.input} value={interactionForm.date}
                    onChange={e => setInteractionForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={S.label}>Resumo / Observações</label>
                <textarea style={{ ...S.textarea, minHeight:100 }} value={interactionForm.note}
                  onChange={e => setInteractionForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="O que foi discutido? Qual foi o resultado?" />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button style={S.btn("outline")} onClick={() => { setShowInteractionModal(false); setEditingInteraction(null); }}>Cancelar</button>
              <button style={S.btn()} disabled={saving || !interactionForm.note.trim()} onClick={handleSaveInteraction}>
                {saving ? "Salvando…" : editingInteraction ? "Salvar alterações" : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: Próximo Passo
      ══════════════════════════════════════════════════════════════════════ */}
      {showNextStepModal && (
        <div style={S.modal} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>
          <div style={S.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <div style={{ fontSize:18, fontWeight:700, fontFamily:FONT_DISPLAY, fontStyle:"italic" }}>
                {editingStep ? "Editar Próximo Passo" : "Agendar Próximo Passo"}
                <span style={{ fontFamily:FONT_UI, fontStyle:"normal", fontSize:14, color:COLORS.textMuted, fontWeight:400, marginLeft:10 }}>
                  — {selectedProspect?.schoolName}
                </span>
              </div>
              <button style={S.btn("ghost")} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>✕</button>
            </div>
            <div style={{ display:"grid", gap:14 }}>
              <div>
                <label style={S.label}>Título / Ação *</label>
                <input style={S.input} value={nextStepForm.title}
                  onChange={e => setNextStepForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex: Ligar para confirmar interesse" autoFocus />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <div>
                  <label style={S.label}>Tipo</label>
                  <select style={S.input} value={nextStepForm.type}
                    onChange={e => setNextStepForm(p => ({ ...p, type: e.target.value }))}>
                    {NEXT_STEP_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.label}>Data</label>
                  <input type="date" style={S.input} value={nextStepForm.date}
                    onChange={e => setNextStepForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={S.label}>Observação (opcional)</label>
                <textarea style={{ ...S.textarea, minHeight:80 }} value={nextStepForm.note}
                  onChange={e => setNextStepForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="Contexto ou objetivo deste passo" />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20, justifyContent:"flex-end" }}>
              <button style={S.btn("outline")} onClick={() => { setShowNextStepModal(false); setEditingStep(null); }}>Cancelar</button>
              <button style={S.btn()} disabled={saving || !nextStepForm.title.trim()} onClick={handleSaveNextStep}>
                {saving ? "Salvando…" : editingStep ? "Salvar alterações" : "Agendar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
