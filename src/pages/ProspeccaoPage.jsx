import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, toProspect, toProspectDb } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616",
  border: "#2A2A2A", borderLight: "#1C1C1C",
  accent: "#C9A84C", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI      = `'Jost', 'DM Sans', sans-serif`;

// ─── Static data ──────────────────────────────────────────────────────────────
const PROSPECT_STATUSES = [
  { key: "identificado",  label: "Identificado",  color: "#6B7280" },
  { key: "contato",       label: "1º Contato",    color: "#3DBFB0" },
  { key: "apresentacao",  label: "Apresentação",  color: "#7B6FD4" },
  { key: "proposta",      label: "Proposta",      color: "#C9A84C" },
  { key: "negociacao",    label: "Negociação",    color: "#E09A3D" },
  { key: "fechado",       label: "Fechado",       color: "#4ade80" },
  { key: "perdido",       label: "Perdido",       color: "#E05252" },
];
const PROSPECT_TYPES = [
  { key: "particular",   label: "Particular" },
  { key: "publica",      label: "Pública" },
  { key: "tecnica",      label: "Técnica" },
  { key: "universidade", label: "Universidade" },
];

// ─── Shared UI primitives ────────────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: "20px 24px",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Prospecting CRM ─────────────────────────────────────────────────────────
function ProspectingContent({ menteeId, prospects, setProspects }) {
  const today = new Date().toISOString().slice(0, 10);
  const [filter, setFilter]       = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [editMode, setEditMode]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const BLANK = {
    menteeId, schoolName: "", schoolType: "particular",
    city: "", state: "", contactName: "", contactRole: "",
    phone: "", email: "", status: "identificado",
    notes: "", nextAction: "", nextActionDate: "",
  };
  const [form, setForm] = useState(BLANK);
  const isAdding = editMode && !selectedId;

  const sColor = (s) => PROSPECT_STATUSES.find(x => x.key === s)?.color || COLORS.textMuted;
  const sLabel = (s) => PROSPECT_STATUSES.find(x => x.key === s)?.label || s;
  const tLabel = (t) => PROSPECT_TYPES.find(x => x.key === t)?.label || t;
  const fmtDate = (d) => d ? d.split("-").reverse().join("/") : "";

  const displayed = filter ? prospects.filter(p => p.status === filter) : prospects;
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const openAdd  = () => { setForm(BLANK); setSelectedId(null); setEditMode(true); };
  const openEdit = (p) => { setForm({ ...p }); setSelectedId(p.id); setEditMode(true); };
  const closeForm = () => { setEditMode(false); setSelectedId(null); };

  const handleSave = async () => {
    if (!form.schoolName.trim()) return;
    setSaving(true);
    try {
      const db = toProspectDb(form);
      if (isAdding) {
        const { data } = await supabase
          .from("mentee_prospects")
          .insert({ ...db, mentee_id: menteeId })
          .select().single();
        if (data) {
          const newP = toProspect(data);
          setProspects(prev => [newP, ...prev]);
          setSelectedId(newP.id);
          setForm(newP);
          setEditMode(false);
        }
      } else {
        await supabase.from("mentee_prospects").update(db).eq("id", selectedId);
        setProspects(prev => prev.map(p => p.id === selectedId ? { ...p, ...form } : p));
        setEditMode(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setDeleting(true);
    await supabase.from("mentee_prospects").delete().eq("id", selectedId);
    setProspects(prev => prev.filter(p => p.id !== selectedId));
    setSelectedId(null);
    setEditMode(false);
    setDeleting(false);
  };

  const quickStatus = async (p, newStatus, e) => {
    e.stopPropagation();
    await supabase.from("mentee_prospects").update({ status: newStatus }).eq("id", p.id);
    setProspects(prev => prev.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
  };

  const inpStyle = {
    width: "100%", background: COLORS.surface,
    border: `1px solid ${COLORS.border}`, borderRadius: 4,
    padding: "8px 10px", color: COLORS.text, fontFamily: FONT_UI,
    fontSize: 13, outline: "none", boxSizing: "border-box",
  };
  const fieldLabel = (txt) => (
    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5,
      textTransform: "uppercase", letterSpacing: "0.1em" }}>{txt}</div>
  );

  const counts = {};
  PROSPECT_STATUSES.forEach(s => { counts[s.key] = prospects.filter(p => p.status === s.key).length; });
  const active  = prospects.filter(p => !["fechado","perdido"].includes(p.status)).length;
  const overdue = prospects.filter(p => p.nextActionDate && p.nextActionDate < today && !["fechado","perdido"].includes(p.status)).length;

  /* ── Edit / Add form ── */
  if (editMode) return (
    <Card>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ fontSize:16, fontFamily:FONT_DISPLAY, color:COLORS.accent, letterSpacing:"0.04em" }}>
          — {isAdding ? "Nova Escola" : "Editar Escola"}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {!isAdding && (
            <button onClick={handleDelete} disabled={deleting}
              style={{ padding:"5px 12px", background:"transparent", border:`1px solid ${COLORS.red}44`,
                borderRadius:4, color:COLORS.red, fontFamily:FONT_UI, fontSize:12, cursor:"pointer" }}>
              {deleting ? "…" : "Excluir"}
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !form.schoolName.trim()}
            style={{ padding:"5px 14px", background:`${COLORS.accent}22`, border:`1px solid ${COLORS.accent}55`,
              borderRadius:4, color:COLORS.accent, fontFamily:FONT_UI, fontSize:12, cursor:"pointer" }}>
            {saving ? "Salvando…" : "✓ Salvar"}
          </button>
          <button onClick={closeForm}
            style={{ padding:"5px 10px", background:"transparent", border:`1px solid ${COLORS.border}`,
              borderRadius:4, color:COLORS.textMuted, fontFamily:FONT_UI, fontSize:12, cursor:"pointer" }}>
            ✕
          </button>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
        <div style={{ gridColumn:"1/-1" }}>
          {fieldLabel("Nome da escola *")}
          <input value={form.schoolName} onChange={f("schoolName")}
            placeholder="Ex: Colégio São Paulo" style={inpStyle} autoFocus />
        </div>
        <div>
          {fieldLabel("Tipo")}
          <select value={form.schoolType} onChange={f("schoolType")} style={inpStyle}>
            {PROSPECT_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Status")}
          <select value={form.status} onChange={f("status")} style={inpStyle}>
            {PROSPECT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Cidade")}
          <input value={form.city} onChange={f("city")} placeholder="Ex: São Paulo" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Estado")}
          <input value={form.state} onChange={f("state")} placeholder="Ex: SP" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Nome do contato")}
          <input value={form.contactName} onChange={f("contactName")} placeholder="Responsável" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Cargo")}
          <input value={form.contactRole} onChange={f("contactRole")} placeholder="Ex: Diretor(a)" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Telefone")}
          <input value={form.phone} onChange={f("phone")} placeholder="(00) 00000-0000" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("E-mail")}
          <input type="email" value={form.email} onChange={f("email")} placeholder="contato@escola.com" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Próxima ação")}
          <input value={form.nextAction} onChange={f("nextAction")} placeholder="Ex: Ligar para marcar demo" style={inpStyle} />
        </div>
        <div>
          {fieldLabel("Data")}
          <input type="date" value={form.nextActionDate} onChange={f("nextActionDate")} style={inpStyle} />
        </div>
        <div style={{ gridColumn:"1/-1" }}>
          {fieldLabel("Observações")}
          <textarea value={form.notes} onChange={f("notes")} rows={3}
            placeholder="Notas sobre a escola, conversas, objeções…"
            style={{ ...inpStyle, resize:"vertical" }} />
        </div>
      </div>
    </Card>
  );

  /* ── List view ── */
  return (
    <div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Total",            value:prospects.length,  color:COLORS.accent },
          { label:"Em andamento",     value:active,            color:COLORS.teal },
          { label:"Ações em atraso",  value:overdue,           color: overdue > 0 ? COLORS.red : COLORS.textMuted },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:6, padding:"16px 20px" }}>
            <div style={{ fontSize:28, fontWeight:900, color }}>{value}</div>
            <div style={{ fontSize:11, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={() => setFilter(null)}
          style={{ padding:"5px 12px", borderRadius:100, fontFamily:FONT_UI, fontSize:12, cursor:"pointer",
            border:`1px solid ${!filter ? COLORS.accent : COLORS.border}`,
            background: !filter ? `${COLORS.accent}18` : "transparent",
            color: !filter ? COLORS.accent : COLORS.textMuted }}>
          Todos ({prospects.length})
        </button>
        {PROSPECT_STATUSES.map(s => counts[s.key] > 0 && (
          <button key={s.key} onClick={() => setFilter(filter === s.key ? null : s.key)}
            style={{ padding:"5px 12px", borderRadius:100, fontFamily:FONT_UI, fontSize:12, cursor:"pointer",
              border:`1px solid ${filter===s.key ? s.color : COLORS.border}55`,
              background: filter===s.key ? `${s.color}18` : "transparent",
              color: filter===s.key ? s.color : COLORS.textMuted }}>
            {s.label} ({counts[s.key]})
          </button>
        ))}
        <button onClick={openAdd}
          style={{ marginLeft:"auto", padding:"7px 16px", background:`${COLORS.accent}18`,
            border:`1px solid ${COLORS.accent}55`, borderRadius:4, color:COLORS.accent,
            fontFamily:FONT_UI, fontSize:12, fontWeight:500, cursor:"pointer", whiteSpace:"nowrap" }}>
          + Nova escola
        </button>
      </div>

      {/* Prospect list */}
      {displayed.length === 0 ? (
        <Card>
          <div style={{ textAlign:"center", padding:"48px 0", color:COLORS.textMuted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🏫</div>
            <div style={{ fontSize:16, fontWeight:600, marginBottom:8, color:COLORS.text }}>
              {prospects.length === 0 ? "Nenhuma escola cadastrada" : "Sem resultados para este filtro"}
            </div>
            <div style={{ fontSize:13 }}>
              {prospects.length === 0
                ? "Clique em \"+ Nova escola\" para começar a prospecção."
                : "Tente outro filtro de status."}
            </div>
          </div>
        </Card>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {displayed.map(p => {
            const isOverdue  = p.nextActionDate && p.nextActionDate < today && !["fechado","perdido"].includes(p.status);
            const isSelected = selectedId === p.id;
            return (
              <div key={p.id}>
                {/* Card row */}
                <div onClick={() => setSelectedId(isSelected ? null : p.id)}
                  style={{ background:COLORS.card, border:`1px solid ${isSelected ? sColor(p.status)+"66" : COLORS.border}`,
                    borderRadius: isSelected ? "6px 6px 0 0" : 6, padding:"16px 20px",
                    cursor:"pointer", transition:"border-color 0.2s" }}
                  onMouseEnter={e => { if(!isSelected) e.currentTarget.style.borderColor = COLORS.borderLight; }}
                  onMouseLeave={e => { if(!isSelected) e.currentTarget.style.borderColor = COLORS.border; }}
                >
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                        <span style={{ fontSize:15, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {p.schoolName}
                        </span>
                        <span style={{ fontSize:11, color:COLORS.textMuted, background:COLORS.surface,
                          padding:"2px 8px", borderRadius:100, flexShrink:0 }}>
                          {tLabel(p.schoolType)}
                        </span>
                      </div>
                      <div style={{ display:"flex", gap:12, fontSize:12, color:COLORS.textMuted, flexWrap:"wrap" }}>
                        {p.city && <span>{p.city}{p.state ? `/${p.state}` : ""}</span>}
                        {p.contactName && <span>· {p.contactName}{p.contactRole ? ` (${p.contactRole})` : ""}</span>}
                        {p.nextAction && (
                          <span style={{ color: isOverdue ? COLORS.red : COLORS.textMuted }}>
                            · {isOverdue ? "⚠ " : ""}{p.nextAction}
                            {p.nextActionDate ? ` — ${fmtDate(p.nextActionDate)}` : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ padding:"4px 10px", borderRadius:100, fontSize:11, fontWeight:500, flexShrink:0,
                      background:`${sColor(p.status)}18`, color:sColor(p.status),
                      border:`1px solid ${sColor(p.status)}33` }}>
                      {sLabel(p.status)}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isSelected && (
                  <div style={{ background:COLORS.surface, border:`1px solid ${sColor(p.status)}44`,
                    borderTop:"none", borderRadius:"0 0 6px 6px", padding:"16px 20px" }}>
                    {/* Quick status */}
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:11, color:COLORS.textMuted, textTransform:"uppercase",
                        letterSpacing:"0.1em", marginBottom:8 }}>Mover para:</div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {PROSPECT_STATUSES.map(s => (
                          <button key={s.key} onClick={(e) => quickStatus(p, s.key, e)}
                            style={{ padding:"4px 10px", borderRadius:100, fontFamily:FONT_UI, fontSize:11, cursor:"pointer",
                              border:`1px solid ${p.status===s.key ? s.color : COLORS.border}55`,
                              background: p.status===s.key ? `${s.color}22` : "transparent",
                              color: p.status===s.key ? s.color : COLORS.textDim }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Details */}
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 24px",
                      fontSize:13, marginBottom:14 }}>
                      {p.phone && <div><span style={{ color:COLORS.textMuted }}>Tel: </span>{p.phone}</div>}
                      {p.email && <div><span style={{ color:COLORS.textMuted }}>E-mail: </span>{p.email}</div>}
                      {p.nextAction && (
                        <div style={{ gridColumn:"1/-1", color: isOverdue ? COLORS.red : COLORS.text }}>
                          <span style={{ color:COLORS.textMuted }}>Próxima ação: </span>
                          {p.nextAction}{p.nextActionDate ? ` — ${fmtDate(p.nextActionDate)}` : ""}
                        </div>
                      )}
                      {p.notes && (
                        <div style={{ gridColumn:"1/-1", color:COLORS.textMuted, fontStyle:"italic", lineHeight:1.6 }}>
                          {p.notes}
                        </div>
                      )}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(p); }}
                      style={{ padding:"6px 16px", background:"transparent", border:`1px solid ${COLORS.border}`,
                        borderRadius:4, color:COLORS.textMuted, fontFamily:FONT_UI, fontSize:12,
                        cursor:"pointer", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor=COLORS.accent; e.currentTarget.style.color=COLORS.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.color=COLORS.textMuted; }}>
                      ✎ Editar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProspeccaoPage() {
  const { id }                     = useParams();
  const { isAdmin }                = useAuth();
  const navigate                   = useNavigate();
  const [prospects, setProspects]  = useState([]);
  const [menteeName, setMenteeName] = useState("");
  const [loading, setLoading]      = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      // Load mentee name for the header
      const { data: menteeRow } = await supabase
        .from("mentees").select("name").eq("id", id).single();
      if (menteeRow) setMenteeName(menteeRow.name);

      // Load prospects
      const { data } = await supabase
        .from("mentee_prospects")
        .select("*")
        .eq("mentee_id", id)
        .order("created_at", { ascending: false });
      setProspects((data || []).map(toProspect));
      setLoading(false);
    };

    load();
  }, [id]);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: FONT_UI,
      color: COLORS.text,
    }}>
      {/* ── Top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${COLORS.bg}ee`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 24px",
        display: "flex", alignItems: "center", gap: 16, height: 56,
      }}>
        <button
          onClick={() => navigate(`/mentorado/${id}`)}
          style={{ background:"none", border:"none", color:COLORS.textMuted, cursor:"pointer",
            fontFamily:FONT_UI, fontSize:13, display:"flex", alignItems:"center", gap:6,
            padding:"4px 0", transition:"color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = COLORS.accent}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.textMuted}
        >
          ← Voltar
        </button>
        <div style={{ width:1, height:20, background:COLORS.border }} />
        <div style={{ fontSize:13, color:COLORS.textMuted }}>
          {menteeName && <span style={{ color:COLORS.text }}>{menteeName} · </span>}
          Prospecção
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase",
            letterSpacing: "0.15em", marginBottom: 8 }}>CRM</div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700,
            color: COLORS.accent, margin: 0, letterSpacing: "0.02em" }}>
            Prospecção de Escolas
          </h1>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 8, lineHeight: 1.6 }}>
            Gerencie seu pipeline de prospecção — cadastre escolas, acompanhe o status de cada conversa e registre os próximos passos.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:COLORS.textMuted }}>
            Carregando…
          </div>
        ) : (
          <ProspectingContent
            menteeId={id}
            prospects={prospects}
            setProspects={setProspects}
          />
        )}
      </div>
    </div>
  );
}
