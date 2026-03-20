import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase, toMentee } from "./lib/supabase";

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
  { id: "milestones", label: "Minha Jornada",       icon: "🎯", angle: -70 },
  { id: "home",       label: "Plano Base",           icon: "📋", angle: -23 },
  { id: "custom",     label: "Plano Personalizado",  icon: "✍️", angle:  23 },
  { id: "resources",  label: "Recursos",             icon: "📚", angle:  70 },
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
function MilestonesContent({ mentee, milestones, doneCount, pct }) {
  return (
    <div>
      {/* Greeting hero */}
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

      {/* Timeline de marcos */}
      <Card>
        <SectionTitle>— Sua Jornada de Mentoria</SectionTitle>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {MILESTONE_LABELS.map((label, i) => {
            const done = milestones[i];
            const isNext = !done && (i === 0 || milestones[i - 1]);
            return (
              <div key={i} style={{ display:"flex", gap:16, alignItems:"flex-start", paddingBottom: i < MILESTONE_LABELS.length - 1 ? 0 : 0 }}>
                {/* Linha vertical + círculo */}
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
                {/* Texto */}
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
    </div>
  );
}

function PlanBaseContent({ mentee }) {
  return (
    <Card>
      <SectionTitle>— Plano Base · Mentoria Contínua</SectionTitle>
      <div style={{ fontSize:15, color:COLORS.textMuted, marginBottom:24, lineHeight:1.7 }}>
        Este é o núcleo da sua jornada. Nossa mentoria é aberta e contínua — você evolui no seu ritmo, sem prazo de término.
      </div>
      {DEFAULT_PLAN.map((item, i) => (
        <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"14px 0", borderBottom:`1px solid ${COLORS.border}` }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:`${mentee.color}22`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, flexShrink:0, color:mentee.color, fontWeight:700 }}>{i + 1}</div>
          <div style={{ fontSize:15, lineHeight:1.6 }}>{item}</div>
        </div>
      ))}
    </Card>
  );
}

function CustomPlanContent({ mentee }) {
  return (
    <Card>
      <SectionTitle>— Seu Plano Personalizado</SectionTitle>
      {mentee.customPlan ? (
        <div style={{ fontSize:15, color:COLORS.text, lineHeight:1.9, whiteSpace:"pre-wrap",
          background:COLORS.surface, borderRadius:6, padding:"20px 24px",
          border:`1px solid ${mentee.color}33` }}>
          {mentee.customPlan}
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:"52px 0", color:COLORS.textMuted }}>
          <div style={{ fontSize:44, marginBottom:14 }}>◎</div>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:8, color:COLORS.text }}>Plano em elaboração</div>
          <div style={{ fontSize:14, lineHeight:1.7 }}>
            Seu mentor está preparando um plano exclusivo para você.<br />Em breve estará disponível aqui!
          </div>
        </div>
      )}
    </Card>
  );
}

function ResourcesContent({ files = [] }) {
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
  return (
    <Card>
      <SectionTitle>— Biblioteca de Recursos</SectionTitle>
      {files.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:COLORS.textMuted }}>
          <div style={{ fontSize:36, marginBottom:10 }}>📂</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:6 }}>Nenhum arquivo disponível ainda</div>
          <div style={{ fontSize:13 }}>Seu mentor irá compartilhar materiais em breve.</div>
        </div>
      ) : (
        files.map((f) => (
          <div key={f.id} style={{ display:"flex", alignItems:"center", gap:16, padding:"14px 0",
            borderBottom:`1px solid ${COLORS.border}` }}>
            <div style={{ fontSize:28, flexShrink:0 }}>{fileIcon(f.file_type)}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</div>
              <div style={{ fontSize:12, color:COLORS.textMuted }}>{formatSize(f.size)} · {f.created_at?.split('T')[0]}</div>
            </div>
            <a href={f.url} target="_blank" rel="noopener noreferrer"
              style={{ display:"inline-block", padding:"6px 16px", borderRadius:2, fontSize:12, fontWeight:500,
                background:`${COLORS.accent}18`, color:COLORS.accent, border:`1px solid ${COLORS.accent}44`,
                textDecoration:"none", flexShrink:0 }}>
              Baixar
            </a>
          </div>
        ))
      )}
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function MenteePage() {
  const { id }                        = useParams();
  const [mentee, setMentee]           = useState(null);
  const [activeTab, setActiveTab]     = useState("milestones");
  const [notFound, setNotFound]       = useState(false);
  const [photoErr, setPhotoErr]       = useState(false);
  const [hoverId, setHoverId]         = useState(null);
  const [files, setFiles]             = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('files').select('*').eq('mentee_id', id).order('created_at', { ascending: false })
      .then(async ({ data }) => {
        if (data?.length) {
          const withUrls = await Promise.all(data.map(async (f) => {
            const { data: signed } = await supabase.storage.from('mentee-files').createSignedUrl(f.storage_path, 3600);
            return { ...f, url: signed?.signedUrl || '' };
          }));
          setFiles(withUrls);
        }
      });
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
        setMentee(toMentee(data));
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

  const renderContent = () => {
    switch (activeTab) {
      case "milestones": return <MilestonesContent mentee={mentee} milestones={milestones} doneCount={doneCount} pct={pct} />;
      case "home":       return <PlanBaseContent mentee={mentee} />;
      case "custom":     return <CustomPlanContent mentee={mentee} />;
      case "resources":  return <ResourcesContent files={files} />;
      default:           return null;
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

          {/* Goal + join date */}
          <div style={{ marginTop:4, maxWidth:260 }}>
            <div style={{ fontSize:12, color:COLORS.textMuted, marginBottom:4, letterSpacing:"0.06em" }}>Meta</div>
            <div style={{ fontSize:14, color:COLORS.text, fontWeight:500, lineHeight:1.5 }}>{mentee.goal}</div>
            <div style={{ fontSize:11, color:COLORS.textDim, marginTop:8 }}>
              Membro desde {new Date(mentee.joinDate).toLocaleDateString("pt-BR", { month:"long", year:"numeric" })}
            </div>
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

          {/* Footer */}
          <div style={{ marginTop:48, textAlign:"center", color:COLORS.textDim,
            fontSize:11, fontFamily:FONT_UI, letterSpacing:"0.12em" }}>
            O LUCRO ESTÁ NA ORGANIZAÇÃO · SISTEMA DE MENTORIA
          </div>
        </div>
      </div>
    </div>
  );
}
