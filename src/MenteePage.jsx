import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase, toMentee, toProspect, toProspectDb } from "./lib/supabase";
import { useAuth } from "./contexts/AuthContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616",
  border: "#2A2A2A", borderLight: "#1C1C1C",
  accent: "#C9A84C", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI     = `'Jost', 'DM Sans', sans-serif`;

// ─── Circular menu config ─────────────────────────────────────────────────────
//  Photo center inside the SVG/container coordinate system
const PC = { x: 118, y: 205 };   // photo center
const PR = 80;                    // photo radius  → 160px diameter
const OR = 178;                   // orbit radius  (center → balloon anchor)

const MENU = [
  { id: "milestones",  label: "Minha Jornada",  icon: "🎯", angle: -70 },
  { id: "plan",        label: "Plano",           icon: "📌", angle: -35 },
  { id: "tasks",       label: "Afazeres",        icon: "✅", angle:   0 },
  { id: "resources",   label: "Recursos",        icon: "🔗", angle:  35 },
  { id: "references",  label: "Referências",     icon: "📚", angle:  70 },
];

const toRad  = d => (d * Math.PI) / 180;
const bPos   = a => ({ x: PC.x + OR * Math.cos(toRad(a)), y: PC.y + OR * Math.sin(toRad(a)) });
const ePos   = a => ({ x: PC.x + PR * Math.cos(toRad(a)), y: PC.y + PR * Math.sin(toRad(a)) });
const arcStart = bPos(MENU[0].angle);
const arcEnd   = bPos(MENU[MENU.length - 1].angle);
const ARC_PATH = `M ${arcStart.x.toFixed(1)} ${arcStart.y.toFixed(1)} A ${OR} ${OR} 0 0 1 ${arcEnd.x.toFixed(1)} ${arcEnd.y.toFixed(1)}`;
const RING_C   = 2 * Math.PI * (PR + 8);

// ─── Static data ──────────────────────────────────────────────────────────────
const MILESTONE_LABELS = ["Onboarding","Diagnóstico","Plano de Ação","Execução","Revisão","Avanço Contínuo"];

const DEFAULT_PLAN = [
  "Onboarding: Definição de objetivos e diagnóstico inicial",
  "Plano de ação personalizado (30/60/90 dias)",
  "Sessões 1:1 semanais (45 min cada)",
  "Acesso à biblioteca de materiais exclusivos",
  "Suporte via WhatsApp (seg–sex, 9h–18h)",
  "Gravações das sessões disponíveis por 30 dias",
  "Relatório mensal de progresso",
  "Acesso ao grupo exclusivo de mentorados",
];

const DEMO_MENTEE = {
  id: "demo",
  name: "Lucas Ferreira",
  email: "lucas@email.com",
  phone: "(11) 99123-4567",
  stage: "Ativo",
  goal: "Lançar minha startup de tecnologia",
  joinDate: "2025-01-10",
  avatar: "LF",
  color: "#7B6FD4",
  tags: ["Startup","Tecnologia","Produto"],
  lastContact: "2025-03-05",
  notes: "Sólida base técnica e grande potencial empreendedor.",
  milestones: [true, true, true, false, false, false],
  photoUrl: "https://i.pravatar.cc/300?img=68",
  customPlan:
    "1. Validar hipóteses com 20 entrevistas de usuário até 31/03\n" +
    "2. Definir MVP e roadmap de funcionalidades para Q2\n" +
    "3. Montar deck de pitch para aceleradoras (Endeavor, Distrito)\n" +
    "4. Prospectar 3 co-fundadores ou sócios estratégicos\n" +
    "5. Estruturar modelo de receita e precificação\n" +
    "6. Apresentar para 2 fundos de seed até 30/06",
};

const INITIAL_MENTEES = [
  { id:1, name:"Ana Souza",   email:"ana@email.com",   phone:"(11) 99999-0001", stage:"Ativo",   goal:"Escalar faturamento",        joinDate:"2024-10-01", avatar:"AS", color:"#6C63FF", tags:["Marketing","E-commerce"],      milestones:[true,true,true,false,false,false] },
  { id:2, name:"Bruno Lima",  email:"bruno@email.com", phone:"(11) 99999-0002", stage:"Ativo",   goal:"Lançar produto digital",     joinDate:"2024-11-15", avatar:"BL", color:"#F5A623", tags:["Infoproduto","Copywriting"],    milestones:[true,true,false,false,false,false] },
  { id:3, name:"Carla Mendes",email:"carla@email.com", phone:"(11) 99999-0003", stage:"Inativo", goal:"Gestão de equipe",           joinDate:"2024-09-01", avatar:"CM", color:"#2DD4BF", tags:["Liderança","RH"],               milestones:[true,false,false,false,false,false] },
  { id:4, name:"Diego Costa", email:"diego@email.com", phone:"(11) 99999-0004", stage:"Ativo",   goal:"Vendas B2B",                 joinDate:"2024-08-01", avatar:"DC", color:"#FF6B6B", tags:["Vendas","B2B"],                 milestones:[true,true,true,true,true,false] },
  { id:5, name:"Elena Rocha", email:"elena@email.com", phone:"(11) 99999-0005", stage:"Ativo",   goal:"Primeira venda online",      joinDate:"2024-07-01", avatar:"ER", color:"#A78BFA", tags:["Iniciante","Digital"],          milestones:[true,true,true,false,false,false] },
  DEMO_MENTEE,
];

// Dados são carregados do Supabase no useEffect abaixo

// ─── Small helper components ──────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <div style={{ fontSize:12, fontWeight:600, fontFamily:FONT_UI, color:COLORS.textMuted,
    marginBottom:20, letterSpacing:"0.14em", textTransform:"uppercase" }}>{children}</div>
);

const Card = ({ children, extra = {} }) => (
  <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`,
    borderRadius:6, padding:28, ...extra }}>{children}</div>
);

const Badge = ({ color, children }) => (
  <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:2,
    fontSize:11, fontWeight:500, fontFamily:FONT_UI, letterSpacing:"0.08em",
    background:`${color}18`, color, border:`1px solid ${color}33`, textTransform:"uppercase" }}>
    {children}
  </span>
);

// ─── Content panels ───────────────────────────────────────────────────────────
function PaymentSummary({ payments }) {
  const today = new Date().toISOString().slice(0, 10);
  const fmtBRL  = v => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const fmtDate = d => d ? d.split("-").reverse().join("/") : "—";

  const pending = (payments || []).filter(p => !p.paidAt);
  const overdue = pending.filter(p => p.dueDate < today);
  const upcoming = pending.filter(p => p.dueDate >= today);

  if (pending.length === 0) return (
    <Card extra={{ marginTop: 24 }}>
      <SectionTitle>— Situação Financeira</SectionTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: COLORS.teal }}>
        <span style={{ fontSize: 20 }}>✅</span>
        <span style={{ fontSize: 14 }}>Pagamentos em dia. Obrigado!</span>
      </div>
    </Card>
  );

  return (
    <Card extra={{ marginTop: 24 }}>
      <SectionTitle>— Situação Financeira</SectionTitle>
      {overdue.map(p => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.description}</div>
            <div style={{ fontSize: 12, color: COLORS.red }}>Venceu em {fmtDate(p.dueDate)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.red }}>{fmtBRL(p.amount)}</span>
            <Badge color={COLORS.red}>Atrasado</Badge>
          </div>
        </div>
      ))}
      {upcoming.map(p => (
        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.description}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>Vence em {fmtDate(p.dueDate)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{fmtBRL(p.amount)}</span>
            <Badge color={COLORS.accent}>Pendente</Badge>
          </div>
        </div>
      ))}
    </Card>
  );
}

function MilestonesContent({ mentee, milestones, doneCount, pct, isAdmin, onToggleMilestone, payments }) {
  return (
    <div>
      {/* Greeting hero - unchanged */}
      <Card extra={{ marginBottom:24, background:`linear-gradient(135deg, ${mentee.color}16, ${mentee.color}06)`, border:`1px solid ${mentee.color}33`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${mentee.color}, transparent)` }} />
        <div style={{ fontSize:12, color:COLORS.textMuted, textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:6 }}>Central do Mentorado</div>
        <div style={{ fontSize:26, fontWeight:900, fontFamily:FONT_DISPLAY, fontStyle:"italic", marginBottom:6 }}>
          Olá, {mentee.name.split(" ")[0]}!
        </div>
        <div style={{ fontSize:14, color:COLORS.textMuted }}>
          Sua meta: <strong style={{ color:mentee.color }}>{mentee.goal}</strong>
        </div>
        <div style={{ marginTop:16, height:6, borderRadius:3, background:COLORS.borderLight, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:mentee.color, borderRadius:3, transition:"width 0.6s ease" }} />
        </div>
        <div style={{ fontSize:12, color:COLORS.textMuted, marginTop:6 }}>{pct}% da jornada concluída</div>
      </Card>

      <Card>
        <SectionTitle>— Sua Jornada de Mentoria {isAdmin && <span style={{fontSize:10,color:COLORS.accent,letterSpacing:"0.1em",fontWeight:400}}> · clique para alternar</span>}</SectionTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {MILESTONE_LABELS.map((label, i) => {
            const done = milestones[i];
            const isNext = !done && (i === 0 || milestones[i - 1]);
            return (
              <div key={i}
                onClick={() => isAdmin && onToggleMilestone(i)}
                style={{ display:"flex", gap:16, alignItems:"flex-start", cursor: isAdmin ? "pointer" : "default",
                  borderRadius:6, padding: isAdmin ? "2px 6px" : 0, margin: isAdmin ? "0 -6px" : 0,
                  transition:"background 0.15s" }}
                onMouseEnter={e => { if(isAdmin) e.currentTarget.style.background = `${mentee.color}0A`; }}
                onMouseLeave={e => { if(isAdmin) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                  <div style={{
                    width:38, height:38, borderRadius:6,
                    background: done ? mentee.color : isNext ? `${mentee.color}22` : COLORS.surface,
                    border: `2px solid ${done ? mentee.color : isNext ? mentee.color : COLORS.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:700,
                    color: done ? "#fff" : isNext ? mentee.color : COLORS.textDim,
                    boxShadow: done ? `0 0 16px ${mentee.color}55` : isNext ? `0 0 8px ${mentee.color}33` : "none",
                    transition:"all 0.3s",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  {i < MILESTONE_LABELS.length - 1 && (
                    <div style={{ width:2, height:36, background: done ? mentee.color : COLORS.border, transition:"background 0.3s" }} />
                  )}
                </div>
                <div style={{ paddingTop:8, paddingBottom:i < MILESTONE_LABELS.length - 1 ? 36 : 0 }}>
                  <div style={{ fontSize:15, fontWeight: done ? 600 : isNext ? 500 : 400, color: done ? COLORS.text : isNext ? COLORS.text : COLORS.textMuted, marginBottom:3 }}>
                    {label}
                  </div>
                  {done && <div style={{ fontSize:12, color:mentee.color }}>Concluído ✓</div>}
                  {isNext && <div style={{ fontSize:12, color:COLORS.textMuted }}>Em andamento…</div>}
                  {!done && !isNext && <div style={{ fontSize:12, color:COLORS.textDim }}>Próximo passo</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      {!isAdmin && <PaymentSummary payments={mentee.payments} />}
    </div>
  );
}

// ─── uid helper ──────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Goal colors palette ──────────────────────────────────────────────────────
const GOAL_COLORS = ["#C9A84C", "#3DBFB0", "#7B6FD4", "#E09A3D", "#E05252", "#60a5fa"];

// ─── Action Plan ─────────────────────────────────────────────────────────────
function ActionPlanContent({ mentee, actionPlan, isAdmin, onSave }) {
  const goals = actionPlan?.goals || [];
  const [editingGoalId, setEditingGoalId]       = useState(null);
  const [editGoalTitle, setEditGoalTitle]       = useState("");
  const [editingItemKey, setEditingItemKey]     = useState(null);
  const [editItemText, setEditItemText]         = useState("");
  const [addingGoal, setAddingGoal]             = useState(false);
  const [newGoalTitle, setNewGoalTitle]         = useState("");
  const [addingItemGoalId, setAddingItemGoalId] = useState(null);
  const [newItemText, setNewItemText]           = useState("");

  const save = (newGoals) => onSave({ ...actionPlan, goals: newGoals });

  const addGoal = () => {
    if (!newGoalTitle.trim()) return;
    save([...goals, { id: uid(), title: newGoalTitle.trim(), color: GOAL_COLORS[goals.length % GOAL_COLORS.length], items: [] }]);
    setNewGoalTitle(""); setAddingGoal(false);
  };
  const removeGoal    = (gid)         => save(goals.filter(g => g.id !== gid));
  const startEditGoal = (g)           => { setEditingGoalId(g.id); setEditGoalTitle(g.title); };
  const saveGoalTitle = (gid)         => {
    if (!editGoalTitle.trim()) return;
    save(goals.map(g => g.id === gid ? { ...g, title: editGoalTitle.trim() } : g));
    setEditingGoalId(null);
  };
  const addItem = (gid) => {
    if (!newItemText.trim()) return;
    save(goals.map(g => g.id === gid ? { ...g, items: [...(g.items || []), { id: uid(), text: newItemText.trim() }] } : g));
    setNewItemText(""); setAddingItemGoalId(null);
  };
  const removeItem    = (gid, iid)    => save(goals.map(g => g.id === gid ? { ...g, items: g.items.filter(i => i.id !== iid) } : g));
  const startEditItem = (gid, item)   => { setEditingItemKey(`${gid}:${item.id}`); setEditItemText(item.text); };
  const saveItemText  = (gid, iid)    => {
    if (!editItemText.trim()) return;
    save(goals.map(g => g.id === gid ? { ...g, items: g.items.map(i => i.id === iid ? { ...i, text: editItemText.trim() } : i) } : g));
    setEditingItemKey(null);
  };

  const inp = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "6px 10px", color: COLORS.text, fontFamily: FONT_UI, fontSize: 13, outline: "none" };
  const btn = (extra = {}) => ({ padding: "3px 8px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 11, cursor: "pointer", ...extra });

  if (goals.length === 0 && !addingGoal) return (
    <div>
      <Card>
        <div style={{ textAlign: "center", padding: "52px 0", color: COLORS.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📌</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: COLORS.text }}>
            {isAdmin ? "Plano ainda não definido" : "Plano em elaboração"}
          </div>
          <div style={{ fontSize: 13 }}>
            {isAdmin ? "Clique em \"+ Nova meta\" para começar." : "Seu mentor está preparando o plano. Em breve estará disponível aqui."}
          </div>
        </div>
      </Card>
      {isAdmin && (
        <button onClick={() => setAddingGoal(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 16px", background: "transparent", border: `1px dashed ${COLORS.border}`, borderRadius: 6, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 13, cursor: "pointer", width: "100%", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}>
          <span style={{ fontSize: 16 }}>+</span> Nova meta
        </button>
      )}
    </div>
  );

  return (
    <div>
      {goals.map(g => {
        const color = g.color || COLORS.accent;
        return (
          <Card key={g.id} extra={{ marginBottom: 14, borderLeft: `3px solid ${color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: (g.items || []).length > 0 || addingItemGoalId === g.id || isAdmin ? 14 : 0 }}>
              {editingGoalId === g.id ? (
                <input value={editGoalTitle} onChange={e => setEditGoalTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveGoalTitle(g.id); if (e.key === "Escape") setEditingGoalId(null); }}
                  style={{ ...inp, flex: 1, fontSize: 15, fontWeight: 600, border: `1px solid ${color}55` }} autoFocus />
              ) : (
                <div style={{ flex: 1, fontSize: 16, fontWeight: 700, color }}>{g.title}</div>
              )}
              {isAdmin && (
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {editingGoalId === g.id ? (
                    <>
                      <button onClick={() => saveGoalTitle(g.id)} style={{ ...btn(), background: `${color}22`, border: `1px solid ${color}55`, color }}>✓</button>
                      <button onClick={() => setEditingGoalId(null)} style={btn()}>✕</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEditGoal(g)} style={btn()}>✎</button>
                      <button onClick={() => removeGoal(g.id)} style={btn({ color: COLORS.red })}>✕</button>
                    </>
                  )}
                </div>
              )}
            </div>
            {(g.items || []).map((item, idx) => {
              const itemKey = `${g.id}:${item.id}`;
              return (
                <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{idx + 1}</div>
                  {editingItemKey === itemKey ? (
                    <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}>
                      <input value={editItemText} onChange={e => setEditItemText(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveItemText(g.id, item.id); if (e.key === "Escape") setEditingItemKey(null); }}
                        style={{ ...inp, flex: 1 }} autoFocus />
                      <button onClick={() => saveItemText(g.id, item.id)} style={{ ...btn(), background: `${color}22`, border: `1px solid ${color}55`, color }}>✓</button>
                      <button onClick={() => setEditingItemKey(null)} style={btn()}>✕</button>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: COLORS.text }}>{item.text}</div>
                      {isAdmin && (
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => startEditItem(g.id, item)} style={btn()}>✎</button>
                          <button onClick={() => removeItem(g.id, item.id)} style={btn({ color: COLORS.red })}>✕</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {isAdmin && (
              addingItemGoalId === g.id ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                  <input value={newItemText} onChange={e => setNewItemText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addItem(g.id); if (e.key === "Escape") { setAddingItemGoalId(null); setNewItemText(""); } }}
                    placeholder="Novo item…" style={{ ...inp, flex: 1 }} autoFocus />
                  <button onClick={() => addItem(g.id)} style={{ padding: "6px 14px", background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 4, color, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>Adicionar</button>
                  <button onClick={() => { setAddingItemGoalId(null); setNewItemText(""); }} style={{ padding: "6px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <button onClick={() => setAddingItemGoalId(g.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, padding: "6px 12px", background: "transparent", border: `1px dashed ${color}44`, borderRadius: 4, color: COLORS.textDim, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.color = COLORS.textDim; }}>
                  <span>+</span> Novo item
                </button>
              )
            )}
          </Card>
        );
      })}
      {isAdmin && (
        addingGoal ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addGoal(); if (e.key === "Escape") { setAddingGoal(false); setNewGoalTitle(""); } }}
              placeholder="Título da nova meta…" style={{ ...inp, flex: 1, fontSize: 14 }} autoFocus />
            <button onClick={addGoal} style={{ padding: "8px 16px", background: `${COLORS.accent}22`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 13, cursor: "pointer" }}>Criar</button>
            <button onClick={() => { setAddingGoal(false); setNewGoalTitle(""); }} style={{ padding: "8px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 13, cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setAddingGoal(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", border: `1px dashed ${COLORS.border}`, borderRadius: 6, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 13, cursor: "pointer", width: "100%", transition: "all 0.2s", marginTop: goals.length > 0 ? 4 : 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}>
            <span style={{ fontSize: 16 }}>+</span> Nova meta
          </button>
        )
      )}
    </div>
  );
}

// ─── Tasks (Afazeres) ─────────────────────────────────────────────────────────
function TasksContent({ mentee, planTasks, actionPlan, isAdmin, onSaveTasks }) {
  const goals = actionPlan?.goals || [];
  const today = new Date().toISOString().slice(0, 10);
  const [filterGoalId, setFilterGoalId] = useState(null);
  const [editingId, setEditingId]       = useState(null);
  const [adding, setAdding]             = useState(false);
  const BLANK = { id: uid(), title: "", goalId: "", dueDate: "", done: false };
  const [form, setForm] = useState(BLANK);
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const displayed = filterGoalId ? planTasks.filter(t => t.goalId === filterGoalId) : planTasks;
  const sorted    = [...displayed].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return a.dueDate ? -1 : b.dueDate ? 1 : 0;
  });
  const toggle     = (tid) => onSaveTasks(planTasks.map(t => t.id === tid ? { ...t, done: !t.done } : t));
  const openAdd    = ()    => { setForm({ ...BLANK, id: uid() }); setEditingId(null); setAdding(true); };
  const openEdit   = (t)   => { setForm({ ...t }); setEditingId(t.id); setAdding(false); };
  const handleSave = ()    => {
    if (!form.title.trim()) return;
    onSaveTasks(adding ? [...planTasks, { ...form }] : planTasks.map(t => t.id === editingId ? { ...form } : t));
    setAdding(false); setEditingId(null);
  };
  const handleDelete = (id) => {
    onSaveTasks(planTasks.filter(t => t.id !== id));
    if (editingId === id) { setEditingId(null); setAdding(false); }
  };

  const goalLabel = (gid) => goals.find(g => g.id === gid)?.title || null;
  const goalColor = (gid) => goals.find(g => g.id === gid)?.color || COLORS.textMuted;
  const fmtDate   = (d)   => d ? d.split("-").reverse().join("/") : "";
  const isOverdue = (t)   => t.dueDate && t.dueDate < today && !t.done;
  const inp = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "7px 10px", color: COLORS.text, fontFamily: FONT_UI, fontSize: 13, outline: "none", width: "100%" };

  if ((adding || editingId) && isAdmin) return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <SectionTitle style={{ marginBottom: 0 }}>{editingId && !adding ? "— Editar Tarefa" : "— Nova Tarefa"}</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {editingId && !adding && <button onClick={() => handleDelete(editingId)} style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${COLORS.red}44`, borderRadius: 4, color: COLORS.red, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>Excluir</button>}
          <button onClick={handleSave} disabled={!form.title.trim()} style={{ padding: "5px 14px", background: `${COLORS.accent}22`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✓ Salvar</button>
          <button onClick={() => { setAdding(false); setEditingId(null); }} style={{ padding: "5px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✕</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Título *</div>
          <input value={form.title} onChange={f("title")} placeholder="Ex: Ligar para o diretor" style={inp} autoFocus />
        </div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Meta relacionada</div>
          <select value={form.goalId} onChange={f("goalId")} style={inp}>
            <option value="">Nenhuma</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>
        <div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Prazo</div>
          <input type="date" value={form.dueDate} onChange={f("dueDate")} style={inp} />
        </div>
      </div>
    </Card>
  );

  const pending = planTasks.filter(t => !t.done).length;
  const done    = planTasks.filter(t => t.done).length;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total",      value: planTasks.length, color: COLORS.accent },
          { label: "Pendentes",  value: pending,          color: pending > 0 ? COLORS.teal : COLORS.textMuted },
          { label: "Concluídas", value: done,             color: done > 0 ? COLORS.textMuted : COLORS.textDim },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "16px 20px" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setFilterGoalId(null)} style={{ padding: "5px 12px", borderRadius: 100, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer", border: `1px solid ${!filterGoalId ? COLORS.accent : COLORS.border}`, background: !filterGoalId ? `${COLORS.accent}18` : "transparent", color: !filterGoalId ? COLORS.accent : COLORS.textMuted }}>Todas</button>
        {goals.map(g => (
          <button key={g.id} onClick={() => setFilterGoalId(filterGoalId === g.id ? null : g.id)}
            style={{ padding: "5px 12px", borderRadius: 100, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer", border: `1px solid ${filterGoalId === g.id ? g.color : COLORS.border}55`, background: filterGoalId === g.id ? `${g.color}18` : "transparent", color: filterGoalId === g.id ? g.color : COLORS.textMuted }}>
            {g.title.length > 22 ? g.title.slice(0, 22) + "…" : g.title}
          </button>
        ))}
        {isAdmin && (
          <button onClick={openAdd} style={{ marginLeft: "auto", padding: "7px 16px", background: `${COLORS.accent}18`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>+ Nova tarefa</button>
        )}
      </div>
      {sorted.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: COLORS.text }}>{planTasks.length === 0 ? "Nenhuma tarefa cadastrada" : "Sem tarefas para este filtro"}</div>
            {planTasks.length === 0 && isAdmin && <div style={{ fontSize: 13 }}>Clique em "+ Nova tarefa" para começar.</div>}
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map(task => {
            const overdue = isOverdue(task);
            return (
              <div key={task.id} style={{ background: COLORS.card, border: `1px solid ${overdue ? COLORS.red + "44" : COLORS.border}`, borderRadius: 6, padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", opacity: task.done ? 0.6 : 1, transition: "opacity 0.2s" }}>
                <div onClick={() => toggle(task.id)} style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${task.done ? COLORS.teal : COLORS.border}`, background: task.done ? COLORS.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: 2, transition: "all 0.2s" }}>
                  {task.done && <span style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: task.done ? 400 : 600, textDecoration: task.done ? "line-through" : "none", color: task.done ? COLORS.textMuted : COLORS.text, marginBottom: 4 }}>{task.title}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12 }}>
                    {goalLabel(task.goalId) && <span style={{ color: goalColor(task.goalId), background: `${goalColor(task.goalId)}18`, padding: "2px 8px", borderRadius: 100, border: `1px solid ${goalColor(task.goalId)}33` }}>{goalLabel(task.goalId)}</span>}
                    {task.dueDate && <span style={{ color: overdue ? COLORS.red : COLORS.textMuted }}>{overdue ? "⚠ " : ""}Prazo: {fmtDate(task.dueDate)}</span>}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => openEdit(task)} style={{ padding: "4px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 11, cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.color = COLORS.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}>✎</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Resources (link cards) ───────────────────────────────────────────────────
function ResourcesContent({ menteeResources, isAdmin, onSave, onTabChange }) {
  const BLANK = { label: "", icon: "🔗", description: "", tab: "", url: "" };
  const [adding, setAdding]       = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState(BLANK);
  const f = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    if (!form.label.trim()) return;
    const entry = { ...form, id: form.id || uid() };
    onSave(adding ? [...menteeResources, entry] : menteeResources.map(r => r.id === editingId ? entry : r));
    setAdding(false); setEditingId(null);
  };
  const handleDelete = (id) => { onSave(menteeResources.filter(r => r.id !== id)); if (editingId === id) setEditingId(null); };
  const handleClick  = (r)  => { if (r.tab) { onTabChange(r.tab); return; } if (r.url) window.open(r.url, "_blank", "noopener noreferrer"); };

  const inp    = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "7px 10px", color: COLORS.text, fontFamily: FONT_UI, fontSize: 13, outline: "none", width: "100%" };
  const fLabel = (txt) => <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.1em" }}>{txt}</div>;

  if ((adding || editingId) && isAdmin) return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <SectionTitle style={{ marginBottom: 0 }}>{editingId && !adding ? "— Editar Recurso" : "— Novo Recurso"}</SectionTitle>
        <div style={{ display: "flex", gap: 8 }}>
          {editingId && !adding && <button onClick={() => handleDelete(editingId)} style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${COLORS.red}44`, borderRadius: 4, color: COLORS.red, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>Excluir</button>}
          <button onClick={handleSave} disabled={!form.label.trim()} style={{ padding: "5px 14px", background: `${COLORS.accent}22`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✓ Salvar</button>
          <button onClick={() => { setAdding(false); setEditingId(null); }} style={{ padding: "5px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✕</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "10px 16px" }}>
        <div>{fLabel("Ícone")}<input value={form.icon} onChange={f("icon")} placeholder="🔗" style={{ ...inp, textAlign: "center", fontSize: 20 }} maxLength={2} /></div>
        <div>{fLabel("Rótulo *")}<input value={form.label} onChange={f("label")} placeholder="Ex: Prospecção" style={inp} autoFocus /></div>
        <div style={{ gridColumn: "1/-1" }}>{fLabel("Descrição")}<input value={form.description} onChange={f("description")} placeholder="Breve descrição" style={inp} /></div>
        <div style={{ gridColumn: "1/-1" }}>{fLabel("Aba interna (id)")}<input value={form.tab} onChange={f("tab")} placeholder="Ex: prospecting  (deixe vazio se usar URL)" style={inp} /></div>
        <div style={{ gridColumn: "1/-1" }}>{fLabel("URL externa")}<input value={form.url} onChange={f("url")} placeholder="https://…  (deixe vazio se usar aba interna)" style={inp} /></div>
      </div>
    </Card>
  );

  return (
    <div>
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <button onClick={() => { setForm({ ...BLANK }); setEditingId(null); setAdding(true); }}
            style={{ padding: "7px 16px", background: `${COLORS.accent}18`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>+ Novo recurso</button>
        </div>
      )}
      {menteeResources.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: COLORS.text }}>{isAdmin ? "Nenhum recurso cadastrado" : "Recursos em preparação"}</div>
            <div style={{ fontSize: 13 }}>{isAdmin ? "Clique em \"+ Novo recurso\" para adicionar." : "Seu mentor irá disponibilizar os recursos em breve."}</div>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
          {menteeResources.map(r => (
            <div key={r.id}
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px", cursor: r.tab || r.url ? "pointer" : "default", transition: "all 0.2s", position: "relative" }}
              onClick={() => handleClick(r)}
              onMouseEnter={e => { if (r.tab || r.url) { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.background = "#1C1C1C"; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.card; }}>
              {isAdmin && (
                <button onClick={(e) => { e.stopPropagation(); setForm({ ...r }); setEditingId(r.id); setAdding(false); }}
                  style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 11, cursor: "pointer" }}>✎</button>
              )}
              <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon || "🔗"}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: r.description ? 6 : 0 }}>{r.label}</div>
              {r.description && <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{r.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── References (files + links) ───────────────────────────────────────────────
function ReferencesContent({ menteeId, files, isAdmin, onRefreshFiles, referenceLinks, onSaveLinks }) {
  const [addingLink, setAddingLink]       = useState(false);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const BLANK_LINK                        = { title: "", url: "", description: "" };
  const [linkForm, setLinkForm]           = useState(BLANK_LINK);
  const [uploading, setUploading]         = useState(false);
  const [deleting, setDeleting]           = useState(null);
  const fileRef = useRef(null);
  const lf = (field) => (e) => setLinkForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSaveLink = () => {
    if (!linkForm.title.trim() || !linkForm.url.trim()) return;
    const entry = { ...linkForm, id: linkForm.id || uid() };
    onSaveLinks(addingLink ? [...referenceLinks, entry] : referenceLinks.map(l => l.id === editingLinkId ? entry : l));
    setAddingLink(false); setEditingLinkId(null);
  };
  const handleDeleteLink = (id) => { onSaveLinks(referenceLinks.filter(l => l.id !== id)); if (editingLinkId === id) setEditingLinkId(null); };
  const handleUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    const path = `${menteeId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("mentee-files").upload(path, file);
    if (!error) {
      await supabase.from("files").insert({ mentee_id: menteeId, name: file.name, storage_path: path, file_type: file.type, size: file.size });
      await onRefreshFiles();
    }
    setUploading(false); e.target.value = "";
  };
  const handleDeleteFile = async (f) => {
    setDeleting(f.id);
    await supabase.storage.from("mentee-files").remove([f.storage_path]);
    await supabase.from("files").delete().eq("id", f.id);
    await onRefreshFiles(); setDeleting(null);
  };

  const fileIcon = (t) => !t ? "📄" : t.includes("pdf") ? "📄" : t.includes("image") ? "🖼️" : t.includes("video") ? "🎥" : t.includes("spreadsheet") || t.includes("excel") || t.includes("csv") ? "📊" : "📎";
  const fmtSize  = (b) => !b ? "" : b < 1048576 ? (b / 1024).toFixed(0) + " KB" : (b / 1048576).toFixed(1) + " MB";
  const inp = { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: "7px 10px", color: COLORS.text, fontFamily: FONT_UI, fontSize: 13, outline: "none", width: "100%" };

  return (
    <div>
      {/* Links */}
      <Card extra={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <SectionTitle style={{ marginBottom: 0 }}>— Links de Referência</SectionTitle>
          {isAdmin && !addingLink && !editingLinkId && (
            <button onClick={() => { setLinkForm(BLANK_LINK); setEditingLinkId(null); setAddingLink(true); }}
              style={{ padding: "5px 14px", background: `${COLORS.accent}18`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>+ Link</button>
          )}
        </div>
        {(addingLink || editingLinkId) && isAdmin && (
          <div style={{ background: COLORS.surface, borderRadius: 6, padding: "14px", marginBottom: 14, border: `1px solid ${COLORS.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Título *</div>
                <input value={linkForm.title} onChange={lf("title")} placeholder="Ex: HubSpot" style={inp} autoFocus />
              </div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>URL *</div>
                <input value={linkForm.url} onChange={lf("url")} placeholder="https://…" style={inp} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Descrição</div>
                <input value={linkForm.description} onChange={lf("description")} placeholder="Breve descrição (opcional)" style={inp} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleSaveLink} disabled={!linkForm.title.trim() || !linkForm.url.trim()} style={{ padding: "5px 14px", background: `${COLORS.accent}22`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✓ Salvar</button>
              {editingLinkId && !addingLink && <button onClick={() => handleDeleteLink(editingLinkId)} style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${COLORS.red}44`, borderRadius: 4, color: COLORS.red, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>Excluir</button>}
              <button onClick={() => { setAddingLink(false); setEditingLinkId(null); }} style={{ padding: "5px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>✕</button>
            </div>
          </div>
        )}
        {referenceLinks.length === 0 && !addingLink && !editingLinkId ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: COLORS.textMuted, fontSize: 13 }}>
            {isAdmin ? "Nenhum link adicionado ainda." : "Nenhum link disponível ainda."}
          </div>
        ) : (
          referenceLinks.map(link => (
            <div key={link.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: COLORS.accent, textDecoration: "none" }}>{link.title}</a>
                {link.description && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{link.description}</div>}
              </div>
              {isAdmin && (
                <button onClick={() => { setLinkForm({ ...link }); setEditingLinkId(link.id); setAddingLink(false); }}
                  style={{ padding: "3px 8px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 4, color: COLORS.textMuted, fontFamily: FONT_UI, fontSize: 11, cursor: "pointer", flexShrink: 0 }}>✎</button>
              )}
            </div>
          ))
        )}
      </Card>

      {/* Files */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <SectionTitle style={{ marginBottom: 0 }}>— Materiais e Arquivos</SectionTitle>
          {isAdmin && (
            <>
              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleUpload} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ padding: "5px 14px", background: `${COLORS.accent}18`, border: `1px solid ${COLORS.accent}55`, borderRadius: 4, color: COLORS.accent, fontFamily: FONT_UI, fontSize: 12, cursor: "pointer" }}>
                {uploading ? "Enviando…" : "+ Arquivo"}
              </button>
            </>
          )}
        </div>
        {files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textMuted }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nenhum arquivo disponível ainda</div>
            <div style={{ fontSize: 13 }}>{isAdmin ? "Clique em \"+ Arquivo\" para enviar materiais." : "Seu mentor irá compartilhar materiais em breve."}</div>
          </div>
        ) : (
          files.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{fileIcon(f.file_type)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{fmtSize(f.size)} · {f.created_at?.split("T")[0]}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "6px 16px", borderRadius: 2, fontSize: 12, fontWeight: 500, background: `${COLORS.accent}18`, color: COLORS.accent, border: `1px solid ${COLORS.accent}44`, textDecoration: "none" }}>Baixar</a>
                {isAdmin && (
                  <button onClick={() => handleDeleteFile(f)} disabled={deleting === f.id}
                    style={{ padding: "6px 10px", background: "transparent", border: `1px solid ${COLORS.border}`, borderRadius: 2, color: deleting === f.id ? COLORS.textDim : COLORS.red, fontSize: 12, cursor: "pointer", fontFamily: FONT_UI }}>
                    {deleting === f.id ? "…" : "✕"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}


// ─── Prospecting CRM ─────────────────────────────────────────────────────────
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

function ProspectingContent({ menteeId, prospects, setProspects }) {
  const today        = new Date().toISOString().slice(0, 10);
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

  const openAdd = () => { setForm(BLANK); setSelectedId(null); setEditMode(true); };
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
    fontSize: 13, outline: "none",
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
        <SectionTitle style={{ marginBottom:0 }}>
          {isAdding ? "— Nova Escola" : "— Editar Escola"}
        </SectionTitle>
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

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MenteePage() {
  const { signOut, isAdmin }          = useAuth();
  const { id }                        = useParams();
  const [mentee, setMentee]           = useState(null);
  const [activeTab, setActiveTab]     = useState("milestones");
  const [notFound, setNotFound]       = useState(false);
  const [photoErr, setPhotoErr]       = useState(false);
  const [hoverId, setHoverId]         = useState(null);
  const [files, setFiles]                   = useState([]);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [prospects, setProspects]           = useState([]);
  const [actionPlan, setActionPlan]         = useState({ goals: [] });
  const [planTasks, setPlanTasks]           = useState([]);
  const [menteeResources, setMenteeResources] = useState([]);
  const [referenceLinks, setReferenceLinks] = useState([]);

  const loadFiles = async () => {
    const { data } = await supabase.from('files').select('*').eq('mentee_id', id).order('created_at', { ascending: false });
    if (data?.length) {
      const withUrls = await Promise.all(data.map(async (f) => {
        const { data: signed } = await supabase.storage.from('mentee-files').createSignedUrl(f.storage_path, 3600);
        return { ...f, url: signed?.signedUrl || '' };
      }));
      setFiles(withUrls);
    } else {
      setFiles([]);
    }
  };

  const loadProspects = async () => {
    const { data } = await supabase
      .from('mentee_prospects')
      .select('*')
      .eq('mentee_id', id)
      .order('created_at', { ascending: false });
    setProspects((data || []).map(toProspect));
  };

  useEffect(() => {
    if (!id) return;
    loadFiles();
    loadProspects();
  }, [id]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('mentees')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) {
        setNotFound(true);
      } else {
        const mapped = toMentee(data);
        setMentee(mapped);
        setActionPlan(mapped.actionPlan  || { goals: [] });
        setPlanTasks(mapped.tasks        || []);
        setMenteeResources(mapped.resources     || []);
        setReferenceLinks(mapped.referenceLinks || []);
      }
    })();
  }, [id]);

  /* ── Not found ── */
  if (notFound) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, display:"flex",
      alignItems:"center", justifyContent:"center", fontFamily:FONT_UI }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ textAlign:"center", color:COLORS.textMuted }}>
        <div style={{ fontSize:48, marginBottom:16 }}>◎</div>
        <div style={{ fontSize:20, fontWeight:700, color:COLORS.text, marginBottom:8 }}>Página não encontrada</div>
        <div style={{ fontSize:14 }}>Este link de mentorado não é válido.</div>
      </div>
    </div>
  );

  /* ── Loading ── */
  if (!mentee) return (
    <div style={{ minHeight:"100vh", background:COLORS.bg, display:"flex",
      alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:COLORS.textMuted, fontFamily:FONT_UI }}>Carregando…</div>
    </div>
  );

  const milestones = mentee.milestones || new Array(6).fill(false);
  const doneCount  = milestones.filter(Boolean).length;
  const pct        = Math.round((doneCount / milestones.length) * 100);
  const photoUrl   = mentee.photoUrl || null;

  const saveMilestones = async (newMilestones) => {
    setMentee(m => ({ ...m, milestones: newMilestones }));
    await supabase.from('mentees').update({ milestones: newMilestones }).eq('id', id);
  };

  const saveActionPlan = async (newPlan) => {
    setActionPlan(newPlan);
    await supabase.from('mentees').update({ action_plan: newPlan }).eq('id', id);
  };
  const savePlanTasks = async (newTasks) => {
    setPlanTasks(newTasks);
    await supabase.from('mentees').update({ tasks: newTasks }).eq('id', id);
  };
  const saveMenteeResources = async (newRes) => {
    setMenteeResources(newRes);
    await supabase.from('mentees').update({ resources: newRes }).eq('id', id);
  };
  const saveReferenceLinks = async (newLinks) => {
    setReferenceLinks(newLinks);
    await supabase.from('mentees').update({ reference_links: newLinks }).eq('id', id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "milestones":  return <MilestonesContent mentee={mentee} milestones={milestones} doneCount={doneCount} pct={pct} isAdmin={isAdmin} payments={mentee.payments} onToggleMilestone={(i) => { const next = milestones.map((v,idx) => idx===i ? !v : v); saveMilestones(next); }} />;
      case "plan":        return <ActionPlanContent mentee={mentee} actionPlan={actionPlan} isAdmin={isAdmin} onSave={saveActionPlan} />;
      case "tasks":       return <TasksContent mentee={mentee} planTasks={planTasks} actionPlan={actionPlan} isAdmin={isAdmin} onSaveTasks={savePlanTasks} />;
      case "resources":   return <ResourcesContent menteeResources={menteeResources} isAdmin={isAdmin} onSave={saveMenteeResources} onTabChange={setActiveTab} />;
      case "references":  return <ReferencesContent menteeId={id} files={files} isAdmin={isAdmin} onRefreshFiles={loadFiles} referenceLinks={referenceLinks} onSaveLinks={saveReferenceLinks} />;
      case "prospecting": return <ProspectingContent menteeId={id} prospects={prospects} setProspects={setProspects} />;
      default:            return null;
    }
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:COLORS.bg,
      backgroundImage:`radial-gradient(ellipse at 15% 50%, ${COLORS.surface}CC 0%, transparent 55%)`,
      color:COLORS.text,
      fontFamily:FONT_UI,
      overflowX:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        html, body { overflow-x:hidden; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#333; border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background:#C9A84C55; }

        @keyframes subtlePulse {
          0%,100% { opacity:1; }
          50% { opacity:0.65; }
        }
        @keyframes floatA {
          0%,100% { transform:translateY(0px); }
          50% { transform:translateY(-6px); }
        }
        @keyframes floatB {
          0%,100% { transform:translateY(0px); }
          50% { transform:translateY(-5px); }
        }
        @keyframes floatC {
          0%,100% { transform:translateY(0px); }
          50% { transform:translateY(-7px); }
        }
        @keyframes floatD {
          0%,100% { transform:translateY(0px); }
          50% { transform:translateY(-4px); }
        }
        .balloon-0 { animation: floatA 4.2s ease-in-out infinite; }
        .balloon-1 { animation: floatB 3.8s ease-in-out infinite; animation-delay:0.6s; }
        .balloon-2 { animation: floatC 4.5s ease-in-out infinite; animation-delay:1.2s; }
        .balloon-3 { animation: floatD 4.0s ease-in-out infinite; animation-delay:1.8s; }
        .balloon:hover { transform:scale(1.05) !important; filter:brightness(1.15); }
        .balloon { transition: box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease, filter 0.2s ease; cursor:pointer; }

        .mobile-menu-btn { display: none; }
        .sidebar-overlay { display: none; }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .sidebar-overlay { display: block !important; }
          .body-layout { height: auto !important; overflow: visible !important; }
          .left-panel {
            position: fixed !important;
            left: 0 !important; top: 56px !important;
            width: 100% !important;
            height: calc(100vh - 56px) !important;
            z-index: 150 !important;
            overflow-y: auto !important; overflow-x: hidden !important;
            background: #080808 !important;
            transform: translateX(-110%) !important;
            transition: transform 0.35s cubic-bezier(0.4,0,0.2,1) !important;
            padding: 28px 20px 40px !important;
          }
          .left-panel.open { transform: translateX(0) !important; }
          .circular-menu-area {
            transform: scale(0.7) !important;
            transform-origin: top left !important;
            margin-bottom: -128px !important;
          }
          .right-panel { overflow-y: visible !important; height: auto !important; padding: 28px 20px 60px !important; }
        }
      `}</style>

      {/* ── Fixed header ── */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        height:56, display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 20px 0 36px",
        background:`${COLORS.surface}EE`, borderBottom:`1px solid ${COLORS.border}`,
        backdropFilter:"blur(16px)",
      }}>
        <img src="/arcus_logo.png" alt="Arcus Club" style={{ height:46, width:"auto", objectFit:"contain" }} />

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Botão sair */}
          <button
            onClick={signOut}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"6px 14px", borderRadius:4,
              background:"transparent",
              border:`1px solid ${COLORS.border}`,
              color:COLORS.textMuted, fontFamily:FONT_UI,
              fontSize:12, fontWeight:500, letterSpacing:"0.05em",
              cursor:"pointer", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.textMuted; e.currentTarget.style.color = COLORS.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>

          {/* Botão hambúrguer — apenas mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            alignItems:"center", justifyContent:"center",
            width:40, height:40, borderRadius:6,
            background: sidebarOpen ? `${mentee.color}22` : "transparent",
            border:`1px solid ${sidebarOpen ? mentee.color : COLORS.border}`,
            cursor:"pointer", flexDirection:"column", gap:5, padding:0,
          }}
        >
          {sidebarOpen ? (
            <span style={{ fontSize:18, color:COLORS.textMuted, lineHeight:1 }}>✕</span>
          ) : (
            <>
              <span style={{ display:"block", width:18, height:1.5, background:COLORS.textMuted, borderRadius:1 }} />
              <span style={{ display:"block", width:18, height:1.5, background:COLORS.textMuted, borderRadius:1 }} />
              <span style={{ display:"block", width:12, height:1.5, background:COLORS.textMuted, borderRadius:1 }} />
            </>
          )}
        </button>
        </div>
      </header>

      {/* Overlay escuro ao abrir sidebar no mobile */}
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
        style={{
          position:"fixed", inset:0, top:56, zIndex:140,
          background:"rgba(0,0,0,0.65)",
          backdropFilter:"blur(2px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition:"opacity 0.3s ease",
        }}
      />

      {/* ── Body: left panel + right content ── */}
      <div className="body-layout" style={{ display:"flex", paddingTop:56, height:"calc(100vh - 56px)", overflow:"hidden" }}>

        {/* ════════════ LEFT PANEL ════════════ */}
        <div className={`left-panel${sidebarOpen ? " open" : ""}`} style={{
          width:560,
          flexShrink:0,
          position:"sticky",
          top:56,
          height:"calc(100vh - 56px)",
          background:"transparent",
          display:"flex",
          flexDirection:"column",
          justifyContent:"center",
          padding:"0 0 0 52px",
          overflowX:"hidden",
          overflowY:"hidden",
        }}>

          {/* Name + status */}
          <div style={{ marginBottom:4 }}>
            <div style={{ fontSize:11, color:COLORS.accent, textTransform:"uppercase",
              letterSpacing:"0.18em", marginBottom:6 }}>Central do Mentorado</div>
            <div style={{ fontSize:28, fontWeight:900, fontFamily:FONT_DISPLAY,
              fontStyle:"italic", letterSpacing:"-0.01em", lineHeight:1.1 }}>
              {mentee.name.split(" ")[0]}
              <span style={{ color:COLORS.textDim }}> {mentee.name.split(" ").slice(1).join(" ")}</span>
            </div>
            <div style={{ marginTop:8, display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ height:2, width:32, background:`${mentee.color}66`, borderRadius:1 }} />
              <span style={{ fontSize:11, color:COLORS.textMuted, letterSpacing:"0.1em" }}>
                {doneCount}/{milestones.length} marcos · {pct}%
              </span>
            </div>
          </div>

          {/* ── Circular menu area ── */}
          <div className="circular-menu-area" style={{ position:"relative", width:510, height:430, flexShrink:0 }}>

            {/* SVG overlay: arc + connectors + ring */}
            <svg
              viewBox="0 0 510 430"
              style={{ position:"absolute", inset:0, width:510, height:430, overflow:"visible" }}
            >
              {/* ── Dashed orbit arc ── */}
              <path
                d={ARC_PATH}
                fill="none"
                stroke={`${mentee.color}55`}
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />

              {/* ── Dots on the arc at each balloon anchor ── */}
              {MENU.map(item => {
                const p = bPos(item.angle);
                const isActive = activeTab === item.id;
                return (
                  <circle key={`dot-${item.id}`}
                    cx={p.x} cy={p.y} r={isActive ? 5 : 3.5}
                    fill={isActive ? mentee.color : COLORS.border}
                    stroke={isActive ? `${mentee.color}88` : "none"}
                    strokeWidth="4"
                    style={{ transition:"all 0.25s" }}
                  />
                );
              })}

              {/* ── Connector lines: photo edge → balloon anchor ── */}
              {MENU.map(item => {
                const b = bPos(item.angle);
                const e = ePos(item.angle);
                const isActive  = activeTab === item.id;
                const isHovered = hoverId === item.id;
                return (
                  <line key={`line-${item.id}`}
                    x1={e.x.toFixed(1)} y1={e.y.toFixed(1)}
                    x2={b.x.toFixed(1)} y2={b.y.toFixed(1)}
                    stroke={isActive || isHovered ? mentee.color : COLORS.textDim}
                    strokeWidth={isActive ? "1.8" : isHovered ? "1.2" : "0.8"}
                    opacity={isActive ? 1 : isHovered ? 0.6 : 0.35}
                    style={{ transition:"all 0.25s" }}
                  />
                );
              })}

              {/* ── Progress ring (track) ── */}
              <circle
                cx={PC.x} cy={PC.y} r={PR + 8}
                fill="none" stroke={COLORS.border} strokeWidth="3"
              />

              {/* ── Progress ring (fill) ── */}
              <circle
                cx={PC.x} cy={PC.y} r={PR + 8}
                fill="none"
                stroke={mentee.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * RING_C} ${RING_C}`}
                transform={`rotate(-90 ${PC.x} ${PC.y})`}
                style={{ transition:"stroke-dasharray 0.6s ease" }}
              />

              {/* ── Percentage label on ring ── */}
              <text
                x={PC.x} y={PC.y + PR + 26}
                textAnchor="middle"
                fill={mentee.color}
                fontSize="11"
                fontFamily={FONT_UI}
                fontWeight="600"
                letterSpacing="1"
              >{pct}%</text>
            </svg>

            {/* ── Person photo ── */}
            <div style={{
              position:"absolute",
              left: PC.x - PR,
              top:  PC.y - PR,
              width:  PR * 2,
              height: PR * 2,
              borderRadius:"50%",
              overflow:"hidden",
              border:`2px solid ${mentee.color}55`,
              background:`${mentee.color}22`,
              boxShadow:`0 0 32px ${mentee.color}33, 0 8px 32px rgba(0,0,0,0.5)`,
              zIndex:10,
            }}>
              {photoUrl && !photoErr ? (
                <img
                  src={photoUrl}
                  alt={mentee.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                  onError={() => setPhotoErr(true)}
                />
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:38, fontWeight:700,
                  color:mentee.color, fontFamily:FONT_UI }}>
                  {mentee.avatar}
                </div>
              )}
            </div>

            {/* ── Balloons ── */}
            {MENU.map((item, idx) => {
              const b        = bPos(item.angle);
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`balloon balloon-${idx}`}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  onMouseEnter={() => setHoverId(item.id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{
                    position:"absolute",
                    left: b.x,           /* left edge starts at the orbit point */
                    top:  b.y - 22,      /* vertically centered at orbit point  */
                    /* Visual */
                    background: isActive
                      ? `linear-gradient(135deg, ${mentee.color}28, ${mentee.color}14)`
                      : `${COLORS.card}DD`,
                    border:`1.5px solid ${isActive ? mentee.color : COLORS.border}`,
                    borderRadius:100,
                    padding:"9px 20px 9px 14px",
                    display:"flex",
                    alignItems:"center",
                    gap:9,
                    whiteSpace:"nowrap",
                    fontSize:13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? mentee.color : COLORS.textMuted,
                    backdropFilter:"blur(8px)",
                    boxShadow: isActive
                      ? `0 0 28px ${mentee.color}55, 0 6px 16px rgba(0,0,0,0.4)`
                      : "0 4px 14px rgba(0,0,0,0.35)",
                    zIndex:20,
                    userSelect:"none",
                  }}
                >
                  <span style={{ fontSize:18, lineHeight:1 }}>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span style={{ marginLeft:2, fontSize:9, color:mentee.color, opacity:0.8 }}>◂</span>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ════════════ RIGHT PANEL ════════════ */}
        <div className="right-panel" style={{
          flex:1,
          padding:"44px 52px 60px",
          overflowY:"auto",
          height:"100%",
        }}>
          {renderContent()}

        </div>
      </div>
    </div>
  );
}
