import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Film, Music2, ArrowRight, ArrowLeftRight, Check, X, ChevronRight,
  ChevronDown, Play, Home, FolderKanban, PlusCircle, ListChecks, Download,
  BarChart3, Settings, HelpCircle, User, LogOut, AlertTriangle, CheckCircle2,
  Circle, Loader2, Scissors, Sparkles, ShieldCheck, Menu, FileVideo, FileAudio,
  Trash2, RefreshCw, ExternalLink, Github, Twitter, Linkedin
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/*  TOKENS                                                                  */
/* ----------------------------------------------------------------------- */
const C = {
  bg: "#0A0C10",
  bgAlt: "#0D1013",
  panel: "#13161C",
  panel2: "#181C23",
  panelGlass: "rgba(19,22,28,0.7)",
  border: "#242932",
  borderSoft: "#1A1E25",
  text: "#EEF0F3",
  textDim: "#9198A6",
  textFaint: "#565D6B",
  mint: "#5EEAB0",
  mintDim: "#2E5B49",
  coral: "#FF6B4D",
  coralDim: "#5C2E23",
  yellow: "#F2C14E",
  red: "#F2555A",
  blue: "#6FA8FF",
};

const FONT_DISPLAY = "'Space Grotesk', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    .eb-root { background:${C.bg}; color:${C.text}; font-family:${FONT_BODY}; }
    .eb-root * { box-sizing:border-box; }
    .eb-root ::selection { background:${C.mint}; color:#06110C; }
    .eb-root ::-webkit-scrollbar { width:8px; height:8px; }
    .eb-root ::-webkit-scrollbar-track { background:transparent; }
    .eb-root ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
    .eb-root button, .eb-root select, .eb-root input { font-family:inherit; }
    .eb-root button:focus-visible, .eb-root a:focus-visible, .eb-root input:focus-visible, .eb-root select:focus-visible {
      outline:2px solid ${C.mint}; outline-offset:2px;
    }
    .eb-mono { font-family:${FONT_MONO}; }
    .eb-display { font-family:${FONT_DISPLAY}; }

    @keyframes eb-dash { to { stroke-dashoffset:-40; } }
    .eb-marching { stroke-dasharray:4 6; animation: eb-dash 1.4s linear infinite; }

    @keyframes eb-pulse { 0%,100% { opacity:1; } 50% { opacity:.35; } }
    .eb-pulse { animation: eb-pulse 1.6s ease-in-out infinite; }

    @keyframes eb-shimmer { 0% { background-position:-200px 0; } 100% { background-position:200px 0; } }
    .eb-shimmer { background-image: linear-gradient(90deg, ${C.panel2} 0%, #232833 50%, ${C.panel2} 100%); background-size:200px 100%; animation: eb-shimmer 1.4s linear infinite; }

    @keyframes eb-spin { to { transform:rotate(360deg); } }
    .eb-spin { animation: eb-spin 1s linear infinite; }

    @media (prefers-reduced-motion: reduce) {
      .eb-marching, .eb-pulse, .eb-shimmer, .eb-spin { animation:none !important; }
    }

    .eb-scrollbar-hide::-webkit-scrollbar { display:none; }
    .eb-scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }

    /* Responsive grid utilities */
    .eb-g-hero { grid-template-columns: 1.05fr 0.95fr; }
    .eb-g-2 { grid-template-columns: 1fr 1fr; }
    .eb-g-3 { grid-template-columns: repeat(3, 1fr); }
    .eb-g-howitworks { grid-template-columns: 320px 1fr; }
    .eb-g-analogy { grid-template-columns: 1fr auto 1fr; }
    .eb-g-footer { grid-template-columns: 1.4fr repeat(3, 1fr); }
    .eb-g-timeline { grid-template-columns: 1fr 280px; }

    @media (max-width: 900px) {
      .eb-g-hero { grid-template-columns: 1fr; }
      .eb-g-3 { grid-template-columns: 1fr 1fr; }
      .eb-g-timeline { grid-template-columns: 1fr; }
      .eb-app-sidebar { width: 68px !important; }
      .eb-app-sidebar .eb-navlabel, .eb-app-sidebar .eb-brandlabel { display: none !important; }
      .eb-app-sidebar button { justify-content: center !important; }
    }
    @media (max-width: 760px) {
      .eb-g-2 { grid-template-columns: 1fr; }
      .eb-g-3 { grid-template-columns: 1fr; }
      .eb-g-howitworks { grid-template-columns: 1fr; }
      .eb-g-analogy { grid-template-columns: 1fr; }
      .eb-g-footer { grid-template-columns: 1fr 1fr; }
      .eb-hide-mobile { display: none !important; }
      .eb-nav-toggle { display: inline-flex !important; }
      .eb-hero-title { font-size: 38px !important; }
      .eb-stat-row { flex-wrap: wrap; }
      .eb-project-row { grid-template-columns: 1fr !important; justify-items: start !important; gap: 6px !important; }
      .eb-project-row > *:last-child { display: none !important; }
    }
    @media (max-width: 480px) {
      .eb-g-footer { grid-template-columns: 1fr; }
    }
  `}</style>
);

/* ----------------------------------------------------------------------- */
/*  UTIL                                                                    */
/* ----------------------------------------------------------------------- */
function fmtTC(sec) {
  const clamped = Math.max(0, sec);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = Math.floor(clamped % 60);
  const ms = Math.round((clamped - Math.floor(clamped)) * 1000);
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
}
function fmtDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}
function confidenceTier(conf) {
  if (conf >= 90) return { label: "Match", color: C.mint, dim: C.mintDim, bg: "rgba(94,234,176,0.1)" };
  if (conf >= 75) return { label: "Review suggested", color: C.yellow, dim: "#5A4B22", bg: "rgba(242,193,78,0.1)" };
  return { label: "Needs review", color: C.red, dim: C.coralDim, bg: "rgba(242,85,90,0.1)" };
}

/* ----------------------------------------------------------------------- */
/*  DEMO DATA                                                               */
/* ----------------------------------------------------------------------- */
const SOFTWARE = ["VN", "CapCut", "Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Other"];

const CLIP_DEFS = [
  { source: "IMG_2029.MOV", dur: 5.10, conf: 99, sIn: 0.00, sOut: 5.10 },
  { source: "IMG_2030.MOV", dur: 5.70, conf: 96, sIn: 2.10, sOut: 7.80 },
  { source: "IMG_2034.MOV", dur: 4.37, conf: 97, sIn: 4.25, sOut: 8.62 },
  { source: "IMG_2036.MOV", dur: 7.20, conf: 93, sIn: 1.00, sOut: 8.20 },
  { source: "IMG_2038.MOV", dur: 7.60, conf: 88, sIn: 3.40, sOut: 11.00 },
  { source: "IMG_2041.MOV", dur: 8.90, conf: 99, sIn: 0.50, sOut: 9.40 },
  { source: "IMG_2044.MOV", dur: 7.20, conf: 71, sIn: 6.00, sOut: 13.20 },
  { source: "IMG_2050.MOV", dur: 8.50, conf: 95, sIn: 0.90, sOut: 10.20 },
  { source: "IMG_2056.MOV", dur: 9.30, conf: 90, sIn: 1.60, sOut: 10.90 },
];

function buildClips() {
  let t = 0;
  return CLIP_DEFS.map((c, i) => {
    const tIn = t;
    const tOut = t + c.dur;
    t = tOut;
    return {
      id: `v1-${i + 1}`,
      name: `Clip ${String(i + 1).padStart(2, "0")}`,
      source: c.source,
      sourceIn: c.sIn,
      sourceOut: c.sOut,
      timelineIn: tIn,
      timelineOut: tOut,
      confidence: c.conf,
      track: 1,
    };
  });
}
const VIDEO_TRACK_1 = buildClips();
const TOTAL_DURATION = VIDEO_TRACK_1[VIDEO_TRACK_1.length - 1].timelineOut;

const VIDEO_TRACK_2 = [
  { id: "v2-1", name: 'Text: "Mumbai"', source: "overlay_title.mov", timelineIn: 0, timelineOut: 15.17, confidence: 95, track: 2 },
  { id: "v2-2", name: "Lower Third: @dancer.ig", source: "overlay_lt.mov", timelineIn: 38.87, timelineOut: 54.57, confidence: 82, track: 2 },
];

const WAVEFORM = Array.from({ length: 90 }, (_, i) => {
  const a = Math.sin(i * 0.35) * 0.5 + 0.5;
  const b = Math.sin(i * 0.9 + 2) * 0.3 + 0.3;
  return Math.max(0.08, Math.min(1, a * 0.6 + b * 0.4));
});

const MUSIC_TRACK = { id: "a1", name: "music_theme.wav", timelineIn: 0, timelineOut: TOTAL_DURATION, volume: 0.8 };

const ALL_CLIPS = [...VIDEO_TRACK_1, ...VIDEO_TRACK_2];
const MATCH_PCT = Math.round((ALL_CLIPS.filter(c => c.confidence >= 90).length / ALL_CLIPS.length) * 100);
const WARNING_COUNT = ALL_CLIPS.filter(c => c.confidence < 90).length;

const DEMO_PROJECTS = [
  { id: "p1", name: "Dance Campaign — India → Australia", source: "VN", destination: "Premiere Pro", status: "Completed", accuracy: 96, date: "Aug 3, 2026" },
  { id: "p2", name: "Product Launch Teaser", source: "CapCut", destination: "DaVinci Resolve", status: "Completed", accuracy: 91, date: "Jul 28, 2026" },
  { id: "p3", name: "Client Reel v2", source: "Premiere Pro", destination: "Final Cut Pro", status: "Needs review", accuracy: 78, date: "Jul 21, 2026" },
  { id: "p4", name: "Rooftop Sessions Ep. 4", source: "VN", destination: "Premiere Pro", status: "Completed", accuracy: 94, date: "Jul 14, 2026" },
];

/* ----------------------------------------------------------------------- */
/*  SHARED PRIMITIVES                                                      */
/* ----------------------------------------------------------------------- */
function Button({ children, variant = "primary", size = "md", icon: Icon, onClick, className = "", type = "button", disabled }) {
  const pad = size === "sm" ? "8px 14px" : size === "lg" ? "14px 26px" : "11px 20px";
  const fontSize = size === "sm" ? 13 : 14.5;
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 8,
    padding: pad, fontSize, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent", transition: "all .15s ease", whiteSpace: "nowrap",
    opacity: disabled ? 0.45 : 1,
  };
  const styles = {
    primary: { background: C.mint, color: "#062017", borderColor: C.mint },
    coral: { background: C.coral, color: "#200904", borderColor: C.coral },
    outline: { background: "transparent", color: C.text, borderColor: C.border },
    ghost: { background: "transparent", color: C.textDim, borderColor: "transparent" },
    subtle: { background: C.panel2, color: C.text, borderColor: C.border },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{ ...base, ...styles[variant] }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(1.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
      padding: "3px 9px", borderRadius: 999, color, background: bg, border: `1px solid ${color}33`,
    }}>
      {children}
    </span>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="eb-mono" style={{
      fontSize: 12, letterSpacing: "0.12em", color: C.mint, marginBottom: 14,
      display: "flex", alignItems: "center", gap: 8, textTransform: "uppercase",
    }}>
      <span style={{ width: 16, height: 1, background: C.mint, display: "inline-block" }} />
      {children}
    </div>
  );
}

/* Timecode ruler — the recurring signature motif, used as section dividers
   and as the literal timeline ruler inside the app screens. */
function TimecodeRuler({ duration = 120, playheadPct = null, dense = false }) {
  const ticks = dense ? 24 : 12;
  const labels = Array.from({ length: ticks + 1 }, (_, i) => (duration / ticks) * i);
  return (
    <div style={{ position: "relative", width: "100%", height: dense ? 34 : 22, userSelect: "none" }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 1000 ${dense ? 34 : 22}`}>
        <line x1="0" y1={dense ? 33 : 21} x2="1000" y2={dense ? 33 : 21} stroke={C.border} strokeWidth="1" />
        {labels.map((t, i) => (
          <g key={i}>
            <line x1={(i / ticks) * 1000} y1={dense ? 20 : 12} x2={(i / ticks) * 1000} y2={dense ? 33 : 21} stroke={C.borderSoft} strokeWidth="1" />
            {dense && (
              <text x={(i / ticks) * 1000 + 3} y={12} fill={C.textFaint} fontSize="9" fontFamily={FONT_MONO}>
                {fmtDuration(t)}
              </text>
            )}
          </g>
        ))}
      </svg>
      {playheadPct !== null && (
        <div style={{ position: "absolute", top: 0, left: `${playheadPct}%`, width: 2, height: "100%", background: C.coral, boxShadow: `0 0 8px ${C.coral}` }} />
      )}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 0" }}>
        <span className="eb-mono" style={{ fontSize: 11, color: C.textFaint, letterSpacing: "0.1em" }}>{label}</span>
        <div style={{ flex: 1 }}><TimecodeRuler duration={90} /></div>
      </div>
    </div>
  );
}

function SoftwarePill({ name, active }) {
  return (
    <div style={{
      padding: "8px 14px", borderRadius: 8, border: `1px solid ${active ? C.mint : C.border}`,
      background: active ? "rgba(94,234,176,0.08)" : C.panel, fontSize: 13, fontWeight: 600,
      color: active ? C.mint : C.textDim, whiteSpace: "nowrap",
    }}>
      {name}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  LANDING PAGE SECTIONS                                                   */
/* ----------------------------------------------------------------------- */
function NavBar({ onTry, onSignIn }) {
  const [open, setOpen] = useState(false);
  const links = ["How it works", "Supported software", "Pricing"];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(10,12,16,0.85)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scissors size={15} color="#06170F" />
          </div>
          <span className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>EditBridge</span>
        </div>
        <div className="eb-hide-mobile eb-scrollbar-hide" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", gap: 24 }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} style={{ fontSize: 14, color: C.textDim, textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign in</Button>
            <Button variant="primary" size="sm" onClick={onTry}>Try EditBridge</Button>
          </div>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="eb-nav-toggle"
          style={{ display: "none", width: 36, height: 36, borderRadius: 8, background: C.panel2, border: `1px solid ${C.border}`, alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          {open ? <X size={17} color={C.text} /> : <Menu size={17} color={C.text} />}
        </button>
      </div>
      {open && (
        <div style={{ borderTop: `1px solid ${C.borderSoft}`, padding: "14px 24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setOpen(false)} style={{ fontSize: 14.5, color: C.textDim, textDecoration: "none" }}>{l}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <Button variant="ghost" size="sm" onClick={onSignIn}>Sign in</Button>
            <Button variant="primary" size="sm" onClick={onTry}>Try EditBridge</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineNode({ label, sub, active }) {
  return (
    <div style={{
      padding: "10px 16px", borderRadius: 10, background: active ? "rgba(94,234,176,0.08)" : C.panel,
      border: `1px solid ${active ? C.mint : C.border}`, minWidth: 128, textAlign: "center",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? C.mint : C.text }}>{label}</div>
      {sub && <div className="eb-mono" style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function HeroPipeline() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPulse(p => (p + 1) % 3), 1100);
    return () => clearInterval(id);
  }, []);
  const left = ["VN", "CapCut", "Premiere Pro"];
  const right = ["Premiere Pro", "DaVinci Resolve", "Final Cut Pro"];
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 18, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {left.map((s, i) => <PipelineNode key={s} label={s} sub="source" active={pulse === i} />)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <svg width="70" height="90" viewBox="0 0 70 90">
            <line x1="0" y1="12" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" />
            <line x1="0" y1="45" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" />
            <line x1="0" y1="78" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" />
          </svg>
          <div style={{
            padding: "14px 12px", borderRadius: 12, background: C.mint, color: "#06170F",
            fontWeight: 700, fontSize: 13, textAlign: "center", boxShadow: `0 0 24px rgba(94,234,176,0.35)`,
          }}>
            <Sparkles size={16} style={{ marginBottom: 4 }} />
            <div>EditBridge AI</div>
          </div>
          <svg width="70" height="90" viewBox="0 0 70 90">
            <line x1="0" y1="12" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" style={{ transform: "scaleX(-1)", transformOrigin: "center" }} />
            <line x1="0" y1="45" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" />
            <line x1="0" y1="78" x2="70" y2="45" className="eb-marching" stroke={C.textFaint} strokeWidth="1" style={{ transform: "scaleX(-1)", transformOrigin: "center" }} />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {right.map((s, i) => <PipelineNode key={s} label={s} sub="destination" active={pulse === i} />)}
        </div>
      </div>
    </div>
  );
}

function Hero({ onTry }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 40px" }}>
      <div className="eb-g-hero" style={{ display: "grid", gap: 56, alignItems: "center" }}>
        <div>
          <Eyebrow>Universal edit transfer</Eyebrow>
          <h1 className="eb-display eb-hero-title" style={{ fontSize: 56, lineHeight: 1.04, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
            Edit once.<br />Finish anywhere.
          </h1>
          <p style={{ fontSize: 17, color: C.textDim, marginTop: 22, maxWidth: 460, lineHeight: 1.6 }}>
            Transfer your creative timeline between editing platforms without rebuilding the edit from scratch.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
            <Button variant="primary" size="lg" icon={ArrowRight} onClick={onTry}>Try EditBridge</Button>
            <Button variant="outline" size="lg" icon={Play}>See how it works</Button>
          </div>
          <div className="eb-mono eb-stat-row" style={{ display: "flex", gap: 22, marginTop: 36 }}>
            {[["Cuts", "Reconstructed"], ["Timing", "Preserved"], ["Audio", "Synced"]].map(([a, b]) => (
              <div key={a} style={{ fontSize: 11.5, color: C.textFaint }}>
                <span style={{ color: C.mint }}>{a}</span> — {b}
              </div>
            ))}
          </div>
        </div>
        <HeroPipeline />
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <div id="problem" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Eyebrow>The problem</Eyebrow>
      <h2 className="eb-display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", maxWidth: 620, margin: 0 }}>
        Why rebuild an edit you've already made?
      </h2>
      <p style={{ color: C.textDim, fontSize: 15.5, maxWidth: 640, marginTop: 16, lineHeight: 1.7 }}>
        Editing applications don't talk to each other. When one editor works mobile and another finishes in
        professional software, the second editor has to manually recreate cuts, timing, clip order, music
        placement, audio timing, effects and transitions — often changing the original creative intent along the way.
      </p>

      <div className="eb-g-2" style={{ display: "grid", gap: 20, marginTop: 40 }}>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, background: C.panel }}>
          <Badge color={C.red} bg="rgba(242,85,90,0.1)">Without EditBridge</Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {["Editor A", "Export video", "Editor B", "Manually re-edit everything"].map((s, i, arr) => (
              <React.Fragment key={s}>
                <span className="eb-mono" style={{ fontSize: 12.5, padding: "6px 10px", borderRadius: 6, background: C.panel2, color: C.textDim, border: `1px solid ${C.border}` }}>{s}</span>
                {i < arr.length - 1 && <ChevronRight size={14} color={C.textFaint} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div style={{ border: `1px solid ${C.mint}55`, borderRadius: 14, padding: 24, background: "rgba(94,234,176,0.04)" }}>
          <Badge color={C.mint} bg="rgba(94,234,176,0.1)">With EditBridge</Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {["Editor A", "Reference + raw media", "EditBridge", "Reconstructed timeline", "Editor B"].map((s, i, arr) => (
              <React.Fragment key={s}>
                <span className="eb-mono" style={{ fontSize: 12.5, padding: "6px 10px", borderRadius: 6, background: C.panel2, color: s === "EditBridge" ? C.mint : C.text, border: `1px solid ${s === "EditBridge" ? C.mint : C.border}` }}>{s}</span>
                {i < arr.length - 1 && <ChevronRight size={14} color={C.mint} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalogySection() {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Eyebrow>Why it works</Eyebrow>
      <h2 className="eb-display" style={{ fontSize: 32, fontWeight: 700, maxWidth: 640, margin: 0, letterSpacing: "-0.01em" }}>
        The edit shouldn't have to start over when it crosses borders.
      </h2>
      <div style={{ marginTop: 32, border: `1px solid ${C.border}`, borderRadius: 16, padding: "36px 32px", background: `radial-gradient(circle at 20% 20%, rgba(94,234,176,0.06), transparent 55%), ${C.panel}` }}>
        <div className="eb-g-analogy" style={{ display: "grid", gap: 24, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div className="eb-mono" style={{ fontSize: 11, color: C.textFaint, letterSpacing: "0.1em", marginBottom: 10 }}>INDIA</div>
            <div style={{ fontSize: 40 }}>💃</div>
            <div style={{ fontSize: 13, color: C.textDim, marginTop: 8 }}>Editing Software A</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              padding: "12px 18px", borderRadius: 10, border: `1px dashed ${C.mint}`, background: "rgba(94,234,176,0.06)",
              fontSize: 12.5, color: C.mint, fontWeight: 600, maxWidth: 170,
            }}>
              EditBridge = the choreography sheet
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="eb-mono" style={{ fontSize: 11, color: C.textFaint, letterSpacing: "0.1em", marginBottom: 10 }}>AUSTRALIA</div>
            <div style={{ fontSize: 40 }}>💃</div>
            <div style={{ fontSize: 13, color: C.textDim, marginTop: 8 }}>Editing Software B</div>
          </div>
        </div>
        <p style={{ textAlign: "center", color: C.textDim, fontSize: 14.5, marginTop: 28, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
          Imagine a dancer performing the same routine in India, then being asked to perform it again in
          Australia — but nobody hands them the choreography. EditBridge captures the structure of the original
          edit so another editor can continue the work in a different editing environment.
        </p>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Upload", desc: "Drop in the reference/exported video, the original raw clips, and music or audio if you have it.", icon: Upload },
    { title: "Analyze", desc: "EditBridge detects cuts, matches frames back to source clips, and analyzes audio.", icon: Sparkles },
    { title: "Reconstruct", desc: "A universal timeline is built — video tracks, audio tracks, and an effects reference layer.", icon: ListChecks },
    { title: "Export", desc: "Choose Premiere Pro, DaVinci Resolve, Final Cut Pro, or another format, and generate the timeline.", icon: Download },
  ];
  return (
    <div id="how-it-works" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Eyebrow>How it works</Eyebrow>
      <h2 className="eb-display" style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
        Four steps. One timeline.
      </h2>
      <div className="eb-g-howitworks" style={{ display: "grid", gap: 24, marginTop: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {steps.map((s, i) => (
            <button key={s.title} onClick={() => setStep(i)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12,
              background: step === i ? C.panel2 : "transparent", border: `1px solid ${step === i ? C.border : "transparent"}`,
              cursor: "pointer", textAlign: "left",
            }}>
              <span className="eb-mono" style={{ fontSize: 12, color: step === i ? C.mint : C.textFaint, width: 22 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: step === i ? C.text : C.textDim }}>{s.title}</div>
              </div>
              {step === i && <ChevronRight size={16} color={C.mint} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, background: C.panel, minHeight: 260, display: "flex", flexDirection: "column" }}>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(94,234,176,0.1)", border: `1px solid ${C.mint}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.createElement(steps[step].icon, { size: 22, color: C.mint })}
              </div>
              <div className="eb-display" style={{ fontSize: 22, fontWeight: 700, marginTop: 18 }}>{steps[step].title}</div>
              <p style={{ color: C.textDim, fontSize: 14.5, marginTop: 8, lineHeight: 1.65, maxWidth: 480 }}>{steps[step].desc}</p>

              <div style={{ marginTop: "auto", paddingTop: 24 }}>
                {step === 0 && (
                  <div style={{ display: "flex", gap: 10 }}>
                    {["Reference video", "Raw media", "Music / audio"].map(l => (
                      <div key={l} style={{ flex: 1, border: `1px dashed ${C.border}`, borderRadius: 10, padding: "16px 10px", textAlign: "center" }}>
                        <Upload size={16} color={C.textFaint} />
                        <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 6 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                )}
                {step === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Detecting cuts", "Matching frames", "Identifying source clips", "Analyzing audio"].map((l, i) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textDim }}>
                        <Loader2 size={13} color={C.mint} className="eb-spin" style={{ animationDelay: `${i * 0.1}s` }} /> {l}
                      </div>
                    ))}
                  </div>
                )}
                {step === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {["Video track 1", "Video track 2", "Audio track 1", "Music track", "Effects / reference layer"].map(l => (
                      <div key={l} style={{ fontSize: 12.5, fontFamily: FONT_MONO, color: C.textDim, background: C.panel2, padding: "6px 10px", borderRadius: 6, border: `1px solid ${C.borderSoft}` }}>{l}</div>
                    ))}
                  </div>
                )}
                {step === 3 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Premiere Pro", "DaVinci Resolve", "Final Cut Pro", "Other"].map(l => <SoftwarePill key={l} name={l} active={l === "Premiere Pro"} />)}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EffectCompatSection() {
  const cols = [
    { title: "Native transfer", icon: CheckCircle2, color: C.mint, desc: "Cuts, timing, clip order and basic audio information move over directly." },
    { title: "Effect mapping", icon: RefreshCw, color: C.blue, desc: "Common effects are approximated in the destination software.", rows: [["Zoom", "Scale keyframes"], ["Fade", "Cross dissolve"], ["Blur", "Blur effect"]] },
    { title: "Visual preservation", icon: ShieldCheck, color: C.yellow, desc: "Unsupported effects keep their original look via a rendered reference layer." },
  ];
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
      <Eyebrow>Honest limits</Eyebrow>
      <h2 className="eb-display" style={{ fontSize: 32, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>Effect compatibility</h2>
      <p style={{ color: C.textDim, fontSize: 15, marginTop: 12, maxWidth: 600 }}>
        Some effects are software-specific and cannot be translated perfectly between editing applications. Here's what to expect.
      </p>
      <div className="eb-g-3" style={{ display: "grid", gap: 18, marginTop: 30 }}>
        {cols.map(c => (
          <div key={c.title} style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, background: C.panel }}>
            <c.icon size={20} color={c.color} />
            <div style={{ fontWeight: 700, fontSize: 15.5, marginTop: 12 }}>{c.title}</div>
            <p style={{ fontSize: 13, color: C.textDim, marginTop: 8, lineHeight: 1.6 }}>{c.desc}</p>
            {c.rows && (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {c.rows.map(([a, b]) => (
                  <div key={a} className="eb-mono" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.textDim }}>
                    <span>{a}</span><ArrowRight size={11} color={C.textFaint} /><span style={{ color: C.text }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
            {c.title === "Visual preservation" && (
              <div className="eb-mono" style={{ marginTop: 14, fontSize: 11.5, color: C.textFaint, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                Original effect <ArrowRight size={11} /> Mapped effect <ArrowRight size={11} /> Reference layer
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 13, color: C.textFaint, display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={14} color={C.yellow} /> EditBridge never claims 100% identical effects across every editing application — complex effects are flagged for review.
      </div>
    </div>
  );
}

function PricingSection({ onTry }) {
  const plans = [
    { name: "Free", price: "₹0", period: "", features: ["2 transfers / month", "Basic timeline reconstruction", "Watermarked / reference export"], cta: "Start free" },
    { name: "Creator", price: "₹999", period: "/month", features: ["30 transfers", "Higher processing limits", "Premiere / Resolve export", "No watermark"], cta: "Try EditBridge", highlight: true },
    { name: "Studio", price: "Custom", period: "", features: ["Unlimited / team workflows", "API access", "Priority processing", "Team collaboration"], cta: "Talk to us" },
  ];
  return (
    <div id="pricing" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 90px" }}>
      <Eyebrow>Pricing</Eyebrow>
      <h2 className="eb-display" style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>Simple plans, placeholder prices</h2>
      <div className="eb-g-3" style={{ display: "grid", gap: 18, marginTop: 30 }}>
        {plans.map(p => (
          <div key={p.name} style={{
            border: `1px solid ${p.highlight ? C.mint : C.border}`, borderRadius: 16, padding: 26,
            background: p.highlight ? "rgba(94,234,176,0.05)" : C.panel, position: "relative",
          }}>
            {p.highlight && <Badge color={C.mint} bg="rgba(94,234,176,0.15)">Most popular</Badge>}
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: p.highlight ? 12 : 0 }}>{p.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 10 }}>
              <span className="eb-display" style={{ fontSize: 30, fontWeight: 700 }}>{p.price}</span>
              <span style={{ fontSize: 13, color: C.textFaint }}>{p.period}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              {p.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.textDim }}>
                  <Check size={14} color={C.mint} /> {f}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Button variant={p.highlight ? "primary" : "outline"} onClick={onTry} className="w-full">{p.cta}</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinalCTA({ onTry }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "10px 24px 90px" }}>
      <div style={{
        border: `1px solid ${C.border}`, borderRadius: 20, padding: "64px 40px", textAlign: "center",
        background: `radial-gradient(circle at 50% 0%, rgba(94,234,176,0.08), transparent 60%), ${C.panel}`,
      }}>
        <h2 className="eb-display" style={{ fontSize: 34, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
          Your edit is already done.<br />Why rebuild it?
        </h2>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 26 }}>
          <Button variant="primary" size="lg" icon={ArrowRight} onClick={onTry}>Transfer my edit</Button>
          <Button variant="outline" size="lg" icon={Play}>Watch demo</Button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const cols = {
    Product: ["How it works", "Supported software", "Pricing"],
    Developers: ["API docs", "Universal timeline spec"],
    Company: ["Contact", "Privacy", "Terms"],
  };
  return (
    <div style={{ borderTop: `1px solid ${C.borderSoft}`, padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div className="eb-g-footer" style={{ display: "grid", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Scissors size={13} color="#06170F" />
              </div>
              <span className="eb-display" style={{ fontWeight: 700 }}>EditBridge</span>
            </div>
            <p style={{ fontSize: 13, color: C.textFaint, marginTop: 12, maxWidth: 240 }}>"Edit once. Finish anywhere."</p>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <div className="eb-mono" style={{ fontSize: 11, color: C.textFaint, letterSpacing: "0.08em", marginBottom: 12 }}>{title.toUpperCase()}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {items.map(i => <a key={i} href="#" style={{ fontSize: 13.5, color: C.textDim, textDecoration: "none" }}>{i}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.borderSoft}` }}>
          <span style={{ fontSize: 12, color: C.textFaint }}>© 2026 EditBridge. All rights reserved.</span>
          <div style={{ display: "flex", gap: 14 }}>
            <Twitter size={15} color={C.textFaint} />
            <Github size={15} color={C.textFaint} />
            <Linkedin size={15} color={C.textFaint} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ onTry, onSignIn }) {
  return (
    <div>
      <NavBar onTry={onTry} onSignIn={onSignIn} />
      <Hero onTry={onTry} />
      <SectionDivider label="00 · TIMELINE" />
      <ProblemSection />
      <AnalogySection />
      <SectionDivider label="01 · PROCESS" />
      <HowItWorksSection />
      <div id="supported-software" />
      <EffectCompatSection />
      <SectionDivider label="02 · PLANS" />
      <PricingSection onTry={onTry} />
      <FinalCTA onTry={onTry} />
      <Footer />
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  AUTH                                                                    */
/* ----------------------------------------------------------------------- */
function AuthScreen({ onDone, onBack }) {
  const [mode, setMode] = useState("signup");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: 380 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
          ← Back to site
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 26 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Scissors size={15} color="#06170F" />
          </div>
          <span className="eb-display" style={{ fontSize: 18, fontWeight: 700 }}>EditBridge</span>
        </div>
        <div style={{ display: "flex", gap: 4, background: C.panel2, borderRadius: 10, padding: 4, marginBottom: 22 }}>
          {["signup", "login"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px 0", borderRadius: 7, border: "none", cursor: "pointer",
              background: mode === m ? C.panel : "transparent", color: mode === m ? C.text : C.textDim, fontSize: 13.5, fontWeight: 600,
            }}>
              {m === "signup" ? "Sign up" : "Log in"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && (
            <input placeholder="Full name" style={inputStyle} />
          )}
          <input placeholder="Email address" style={inputStyle} />
          <input placeholder="Password" type="password" style={inputStyle} />
          {mode === "login" && (
            <a href="#" style={{ fontSize: 12.5, color: C.mint, textDecoration: "none", alignSelf: "flex-end" }}>Forgot password?</a>
          )}
          <Button variant="primary" onClick={onDone}>{mode === "signup" ? "Create account" : "Log in"}</Button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 11.5, color: C.textFaint }}>OR</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          <Button variant="subtle" onClick={onDone}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", width: "100%" }}>
              <svg width="15" height="15" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.5 0-13.9 4.2-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35 26.8 36 24 36c-5.4 0-9.9-3.4-11.5-8.1l-6.5 5C9.9 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.2 5.3-6 6.8l6.3 5.3C39.5 37.5 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
              Continue with Google
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
const inputStyle = {
  background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "11px 12px",
  color: C.text, fontSize: 13.5, outline: "none",
};

/* ----------------------------------------------------------------------- */
/*  APP SHELL (sidebar / topbar)                                            */
/* ----------------------------------------------------------------------- */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "new", label: "New transfer", icon: PlusCircle },
  { id: "review", label: "Review matches", icon: ListChecks },
  { id: "exports", label: "Exports", icon: Download },
  { id: "usage", label: "Usage", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
];

function Sidebar({ active, onNav, onSignOut }) {
  return (
    <div className="eb-app-sidebar" style={{ width: 220, borderRight: `1px solid ${C.borderSoft}`, display: "flex", flexDirection: "column", padding: "18px 12px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Scissors size={13} color="#06170F" />
        </div>
        <span className="eb-display eb-brandlabel" style={{ fontWeight: 700, fontSize: 15.5 }}>EditBridge</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 8,
            border: "none", cursor: "pointer", textAlign: "left",
            background: active === item.id ? C.panel2 : "transparent",
            color: active === item.id ? C.text : C.textDim,
          }}>
            <item.icon size={15} color={active === item.id ? C.mint : C.textFaint} />
            <span className="eb-navlabel" style={{ fontSize: 13.5, fontWeight: active === item.id ? 600 : 500 }}>{item.label}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
        <button onClick={onSignOut} style={{
          display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 8,
          border: "none", cursor: "pointer", background: "transparent", color: C.textFaint, width: "100%", textAlign: "left",
        }}>
          <LogOut size={15} /> <span className="eb-navlabel" style={{ fontSize: 13.5 }}>Sign out</span>
        </button>
      </div>
    </div>
  );
}

function TopBar({ title }) {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div style={{ height: 58, borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", flexShrink: 0 }}>
      <span className="eb-display" style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
      <div style={{ position: "relative" }}>
        <button onClick={() => setOpenMenu(o => !o)} style={{
          width: 32, height: 32, borderRadius: "50%", background: C.panel2, border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}>
          <User size={15} color={C.textDim} />
        </button>
        {openMenu && (
          <div style={{ position: "absolute", right: 0, top: 40, background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 6, width: 160, zIndex: 20 }}>
            <div style={{ padding: "8px 10px", fontSize: 12.5, color: C.textDim }}>demo@editbridge.app</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  DASHBOARD                                                               */
/* ----------------------------------------------------------------------- */
function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, background: C.panel, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12.5, color: C.textFaint }}>{label}</span>
        <Icon size={14} color={C.textFaint} />
      </div>
      <div className="eb-display" style={{ fontSize: 26, fontWeight: 700, marginTop: 8 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.mint, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function ProjectRow({ p, onOpen }) {
  const statusColor = p.status === "Completed" ? C.mint : p.status === "Needs review" ? C.yellow : C.textDim;
  return (
    <button onClick={() => onOpen(p)} className="eb-project-row" style={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 24px", gap: 12, alignItems: "center",
      width: "100%", padding: "14px 16px", background: "transparent", border: "none", borderBottom: `1px solid ${C.borderSoft}`,
      cursor: "pointer", textAlign: "left",
    }}>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
        <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 2 }}>{p.date}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.textDim }}>{p.source} <ArrowRight size={11} color={C.textFaint} /> {p.destination}</div>
      <div><Badge color={statusColor} bg={`${statusColor}1A`}>{p.status}</Badge></div>
      <div className="eb-mono" style={{ fontSize: 12.5, color: C.textDim }}>{p.accuracy}% matched</div>
      <div />
      <ChevronRight size={15} color={C.textFaint} />
    </button>
  );
}

function DashboardView({ onNav, onOpenProject }) {
  return (
    <div style={{ padding: 28, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontSize: 13.5, color: C.textDim }}>Welcome back</div>
          <h1 className="eb-display" style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 0" }}>Your transfers</h1>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => onNav("new")}>New transfer</Button>
      </div>

      <div className="eb-stat-row" style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <StatCard label="Projects" value={DEMO_PROJECTS.length} icon={FolderKanban} />
        <StatCard label="Recent transfers" value="4" sub="+1 this week" icon={ArrowLeftRight} />
        <StatCard label="Credits used" value="6 / 30" sub="Creator plan" icon={BarChart3} />
      </div>

      <div style={{ marginTop: 30 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textDim, marginBottom: 6 }}>Recent projects</div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
          {DEMO_PROJECTS.map(p => <ProjectRow key={p.id} p={p} onOpen={onOpenProject} />)}
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ onOpenProject, onNav }) {
  return (
    <div style={{ padding: 28, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Projects</h1>
        <Button variant="primary" size="sm" icon={PlusCircle} onClick={() => onNav("new")}>New transfer</Button>
      </div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel, marginTop: 20 }}>
        {DEMO_PROJECTS.map(p => <ProjectRow key={p.id} p={p} onOpen={onOpenProject} />)}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  NEW TRANSFER WIZARD                                                     */
/* ----------------------------------------------------------------------- */
function WizardSteps({ step }) {
  const labels = ["Set up", "Upload", "Analyze", "Timeline", "Review", "Export"];
  return (
    <div className="eb-scrollbar-hide" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22, overflowX: "auto", paddingBottom: 4 }}>
      {labels.map((l, i) => (
        <React.Fragment key={l}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: i < step ? C.mint : i === step ? "transparent" : C.panel2,
              border: `1px solid ${i <= step ? C.mint : C.border}`, fontSize: 10.5, fontWeight: 700,
              color: i < step ? "#06170F" : i === step ? C.mint : C.textFaint,
              flexShrink: 0,
            }}>
              {i < step ? <Check size={11} /> : i + 1}
            </div>
            <span style={{ fontSize: 12.5, color: i === step ? C.text : C.textFaint, fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{l}</span>
          </div>
          {i < labels.length - 1 && <div style={{ width: 20, height: 1, background: C.border, flexShrink: 0 }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function SetupStep({ data, setData, onNext }) {
  const swap = () => setData(d => ({ ...d, source: d.destination, destination: d.source }));
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 13, color: C.textDim, marginBottom: 6, fontWeight: 600 }}>Project name</div>
      <input
        value={data.name}
        onChange={e => setData(d => ({ ...d, name: e.target.value }))}
        placeholder="e.g. Dance Campaign — India → Australia"
        style={{ ...inputStyle, width: "100%", padding: "12px 14px", fontSize: 14 }}
      />

      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 22 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 6, letterSpacing: "0.06em" }}>SOURCE</div>
          <select value={data.source} onChange={e => setData(d => ({ ...d, source: e.target.value }))} style={{ ...inputStyle, width: "100%", padding: "11px 12px" }}>
            {SOFTWARE.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={swap} title="Swap source and destination" style={{
          width: 38, height: 38, borderRadius: 8, border: `1px solid ${C.border}`, background: C.panel2,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginBottom: 1,
        }}>
          <ArrowLeftRight size={15} color={C.mint} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 6, letterSpacing: "0.06em" }}>DESTINATION</div>
          <select value={data.destination} onChange={e => setData(d => ({ ...d, destination: e.target.value }))} style={{ ...inputStyle, width: "100%", padding: "11px 12px" }}>
            {SOFTWARE.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <Button variant="primary" icon={ArrowRight} onClick={onNext} disabled={!data.name.trim()}>Continue to upload</Button>
      </div>
    </div>
  );
}

function DropZone({ label, hint, accept, icon: Icon, files, onAdd, onRemove }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).map(f => ({ name: f.name, size: f.size, id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}` }));
    onAdd(arr);
  };
  return (
    <div>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          border: `1.5px dashed ${dragOver ? C.mint : C.border}`, borderRadius: 12, padding: "22px 16px",
          textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(94,234,176,0.05)" : C.panel,
        }}
      >
        <input ref={inputRef} type="file" multiple accept={accept} style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
        <Icon size={20} color={dragOver ? C.mint : C.textFaint} />
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 4 }}>{hint}</div>
      </div>
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          {files.map(f => <FileRow key={f.id} file={f} onRemove={() => onRemove(f.id)} />)}
        </div>
      )}
    </div>
  );
}

function FileRow({ file, onRemove }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress(p => Math.min(100, p + Math.random() * 30)), 180);
    return () => clearInterval(id);
  }, []);
  useEffect(() => { if (progress >= 100) setProgress(100); }, [progress]);
  return (
    <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: "10px 12px", background: C.panel2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{file.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="eb-mono" style={{ fontSize: 11, color: C.textFaint }}>{fmtBytes(file.size)}</span>
          <button onClick={onRemove} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}><Trash2 size={13} color={C.textFaint} /></button>
        </div>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: C.border, marginTop: 8, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: progress >= 100 ? C.mint : C.blue, transition: "width .2s ease" }} />
      </div>
    </div>
  );
}

function UploadStep({ files, setFiles, onNext, onBack }) {
  const addFiles = (key) => (arr) => setFiles(f => ({ ...f, [key]: [...f[key], ...arr] }));
  const removeFile = (key) => (id) => setFiles(f => ({ ...f, [key]: f[key].filter(x => x.id !== id) }));
  const canContinue = files.reference.length > 0;
  return (
    <div style={{ maxWidth: 720 }}>
      <div className="eb-g-3" style={{ display: "grid", gap: 16 }}>
        <DropZone label="Reference video" hint="Drop your exported edited video here · MP4, MOV, M4V" accept="video/*" icon={FileVideo} files={files.reference} onAdd={addFiles("reference")} onRemove={removeFile("reference")} />
        <DropZone label="Raw media" hint="Drop original clips here · MP4, MOV, M4V" accept="video/*" icon={Film} files={files.raw} onAdd={addFiles("raw")} onRemove={removeFile("raw")} />
        <DropZone label="Music / audio" hint="Drop music or audio here · MP3, WAV, M4A" accept="audio/*" icon={FileAudio} files={files.audio} onAdd={addFiles("audio")} onRemove={removeFile("audio")} />
      </div>
      {!canContinue && <div style={{ fontSize: 12, color: C.textFaint, marginTop: 14 }}>A reference video is required to start analysis.</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" icon={Sparkles} onClick={onNext} disabled={!canContinue}>Start analysis</Button>
      </div>
    </div>
  );
}

function AnalysisStep({ onDone }) {
  const stages = ["Media imported", "Detecting cuts", "Matching source clips", "Analyzing timing", "Syncing audio", "Building timeline", "Preparing export"];
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    if (active >= stages.length) { setFinished(true); return; }
    const t = setTimeout(() => setActive(a => a + 1), 650);
    return () => clearTimeout(t);
  }, [active]);
  const progress = Math.min(100, Math.round((active / stages.length) * 100));
  return (
    <div style={{ maxWidth: 480 }}>
      <div className="eb-display" style={{ fontSize: 20, fontWeight: 700 }}>Reconstructing your edit</div>
      <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 4 }}>Demo mode — using simulated processing.</div>

      <div style={{ height: 6, borderRadius: 3, background: C.border, marginTop: 22, overflow: "hidden" }}>
        <motion.div animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} style={{ height: "100%", background: C.mint }} />
      </div>
      <div className="eb-mono" style={{ fontSize: 11.5, color: C.textFaint, marginTop: 6 }}>{progress}%</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
        {stages.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: i <= active - 1 ? C.text : i === active ? C.text : C.textFaint }}>
            {i < active ? <Check size={15} color={C.mint} /> : i === active ? <Loader2 size={15} color={C.mint} className="eb-spin" /> : <Circle size={13} color={C.borderSoft} />}
            {s}
          </div>
        ))}
      </div>

      {finished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24 }}>
          <Button variant="primary" icon={ArrowRight} onClick={onDone}>View timeline</Button>
        </motion.div>
      )}
    </div>
  );
}

/* ----- Timeline ----- */
function ClipBlock({ clip, total, onSelect, selected, trackColor }) {
  const leftPct = (clip.timelineIn / total) * 100;
  const widthPct = ((clip.timelineOut - clip.timelineIn) / total) * 100;
  const tier = confidenceTier(clip.confidence);
  return (
    <button
      onClick={() => onSelect(clip)}
      style={{
        position: "absolute", left: `${leftPct}%`, width: `${widthPct}%`, top: 4, bottom: 4,
        background: selected?.id === clip.id ? trackColor : C.panel2,
        border: `1px solid ${selected?.id === clip.id ? trackColor : C.border}`,
        borderLeft: `3px solid ${tier.color}`, borderRadius: 5, cursor: "pointer",
        padding: "4px 6px", overflow: "hidden", textAlign: "left",
      }}
      title={`${clip.name} — ${tier.label}`}
    >
      <div style={{ fontSize: 10.5, fontWeight: 700, color: selected?.id === clip.id ? "#06170F" : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{clip.name}</div>
    </button>
  );
}

function TrackRow({ label, height = 46, children }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid ${C.borderSoft}` }}>
      <div style={{ width: 108, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 12px", fontSize: 11.5, color: C.textFaint, fontWeight: 600, borderRight: `1px solid ${C.borderSoft}` }}>{label}</div>
      <div style={{ position: "relative", flex: 1, height }}>{children}</div>
    </div>
  );
}

function TimelinePanel({ project, clipsV1, clipsV2, music, selected, setSelected }) {
  const total = TOTAL_DURATION;
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.borderSoft}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>{project?.name || "Reconstructed timeline"}</div>
        <div className="eb-mono" style={{ fontSize: 11.5, color: C.textFaint }}>{fmtDuration(total)} total</div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 108, flexShrink: 0, borderRight: `1px solid ${C.borderSoft}` }} />
        <div style={{ flex: 1, padding: "6px 10px 0" }}><TimecodeRuler duration={total} dense /></div>
      </div>
      <TrackRow label="Video track 1">
        {clipsV1.map(c => <ClipBlock key={c.id} clip={c} total={total} onSelect={setSelected} selected={selected} trackColor={C.mint} />)}
      </TrackRow>
      <TrackRow label="Video track 2" height={38}>
        {clipsV2.map(c => <ClipBlock key={c.id} clip={c} total={total} onSelect={setSelected} selected={selected} trackColor={C.blue} />)}
      </TrackRow>
      <TrackRow label="Music track" height={44}>
        <div style={{ position: "absolute", inset: "6px 4px", display: "flex", alignItems: "center", gap: 1.5 }}>
          {WAVEFORM.map((v, i) => (
            <div key={i} style={{ width: 3, height: `${v * 100}%`, background: C.coral, opacity: 0.75, borderRadius: 1 }} />
          ))}
        </div>
      </TrackRow>
      <div style={{ padding: "8px 16px", fontSize: 11, color: C.textFaint, display: "flex", gap: 16 }}>
        <span><span style={{ color: C.mint }}>●</span> 90%+ match</span>
        <span><span style={{ color: C.yellow }}>●</span> 75–89%</span>
        <span><span style={{ color: C.red }}>●</span> Needs review</span>
      </div>
    </div>
  );
}

function ClipInspector({ clip }) {
  if (!clip) {
    return (
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, padding: 20, textAlign: "center", color: C.textFaint, fontSize: 13 }}>
        Select a clip on the timeline to see its match details.
      </div>
    );
  }
  const tier = confidenceTier(clip.confidence);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, padding: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{clip.name}</div>
      <Badge color={tier.color} bg={tier.bg}>{clip.confidence}% · {tier.label}</Badge>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }} className="eb-mono">
        {[
          ["Source", clip.source],
          ["Source in", fmtTC(clip.sourceIn ?? 0)],
          ["Source out", fmtTC(clip.sourceOut ?? 0)],
          ["Timeline in", fmtTC(clip.timelineIn)],
          ["Timeline out", fmtTC(clip.timelineOut)],
          ["Duration", fmtTC(clip.timelineOut - clip.timelineIn)],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: C.textFaint }}>{k}</span>
            <span style={{ color: C.text }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineStep({ project, selected, setSelected, onNext, onBack }) {
  return (
    <div>
      <div className="eb-g-timeline" style={{ display: "grid", gap: 18 }}>
        <TimelinePanel project={project} clipsV1={VIDEO_TRACK_1} clipsV2={VIDEO_TRACK_2} music={MUSIC_TRACK} selected={selected} setSelected={setSelected} />
        <ClipInspector clip={selected} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" icon={ArrowRight} onClick={onNext}>Review matches</Button>
      </div>
    </div>
  );
}

/* ----- Review ----- */
function ReviewList({ clips, reviewed, onMarkReviewed }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, overflow: "hidden" }}>
      {clips.map(c => {
        const tier = confidenceTier(c.confidence);
        const isReviewed = reviewed[c.id];
        return (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.name} <span style={{ color: C.textFaint, fontWeight: 400 }}>· {c.source}</span></div>
              <div className="eb-mono" style={{ fontSize: 11, color: C.textFaint, marginTop: 3 }}>
                {fmtTC(c.timelineIn)} → {fmtTC(c.timelineOut)}
              </div>
            </div>
            <Badge color={isReviewed ? C.mint : tier.color} bg={isReviewed ? "rgba(94,234,176,0.1)" : tier.bg}>
              {isReviewed ? "Reviewed" : `${c.confidence}% · ${tier.label}`}
            </Badge>
            {!isReviewed && c.confidence < 90 && (
              <Button variant="subtle" size="sm" icon={Check} onClick={() => onMarkReviewed(c.id)}>Mark reviewed</Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewStep({ reviewed, setReviewed, onNext, onBack, embedded }) {
  const flagged = ALL_CLIPS.filter(c => c.confidence < 90);
  const remaining = flagged.filter(c => !reviewed[c.id]).length;
  return (
    <div>
      {!embedded && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, color: C.textDim }}>{flagged.length} clip{flagged.length !== 1 ? "s" : ""} flagged below 90% confidence — {remaining} remaining</div>
        </div>
      )}
      <ReviewList clips={embedded ? ALL_CLIPS : flagged} reviewed={reviewed} onMarkReviewed={id => setReviewed(r => ({ ...r, [id]: true }))} />
      {!embedded && (
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button variant="primary" icon={ArrowRight} onClick={onNext}>Continue to export</Button>
        </div>
      )}
    </div>
  );
}

/* ----- Export ----- */
function buildUniversalTimelineJSON(project) {
  return {
    project: project?.name || "Untitled project",
    duration: Number(TOTAL_DURATION.toFixed(2)),
    source_software: project?.source,
    destination_software: project?.destination,
    video_tracks: [
      { track: 1, clips: VIDEO_TRACK_1.map(c => ({ source: c.source, source_in: c.sourceIn, source_out: c.sourceOut, timeline_in: Number(c.timelineIn.toFixed(2)), timeline_out: Number(c.timelineOut.toFixed(2)), confidence: c.confidence })) },
      { track: 2, clips: VIDEO_TRACK_2.map(c => ({ source: c.source, timeline_in: c.timelineIn, timeline_out: c.timelineOut, confidence: c.confidence })) },
    ],
    audio_tracks: [
      { source: MUSIC_TRACK.name, timeline_in: MUSIC_TRACK.timelineIn, timeline_out: Number(MUSIC_TRACK.timelineOut.toFixed(2)), volume: MUSIC_TRACK.volume },
    ],
  };
}
function buildSampleXML(project) {
  const clipsXML = VIDEO_TRACK_1.map(c => `      <clipitem>
        <name>${c.name}</name>
        <file>${c.source}</file>
        <in>${c.sourceIn}</in>
        <out>${c.sourceOut}</out>
        <start>${c.timelineIn.toFixed(2)}</start>
        <end>${c.timelineOut.toFixed(2)}</end>
        <confidence>${c.confidence}</confidence>
      </clipitem>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Sample timeline export generated by EditBridge (demo mode) -->
<xmeml version="5">
  <sequence>
    <name>${(project?.name || "Untitled project")}</name>
    <duration>${TOTAL_DURATION.toFixed(2)}</duration>
    <rate><timebase>30</timebase></rate>
    <media>
      <video>
        <track>
${clipsXML}
        </track>
      </video>
      <audio>
        <track>
          <clipitem>
            <name>${MUSIC_TRACK.name}</name>
            <start>0</start>
            <end>${TOTAL_DURATION.toFixed(2)}</end>
            <volume>${MUSIC_TRACK.volume}</volume>
          </clipitem>
        </track>
      </audio>
    </media>
  </sequence>
</xmeml>
`;
}
function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ExportStep({ project, onBack, onFinish }) {
  const [exported, setExported] = useState([]);
  const exportTarget = (name) => {
    const xml = buildSampleXML(project);
    download(`${(project?.name || "editbridge_timeline").replace(/\s+/g, "_")}_${name.replace(/\s+/g, "_")}.xml`, xml, "application/xml");
    setExported(e => [...new Set([...e, name])]);
  };
  const exportPackage = () => {
    const json = buildUniversalTimelineJSON(project);
    download(`${(project?.name || "editbridge_project").replace(/\s+/g, "_")}_universal_timeline.json`, JSON.stringify(json, null, 2), "application/json");
    setExported(e => [...new Set([...e, "package"])]);
  };
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="eb-display" style={{ fontSize: 20, fontWeight: 700 }}>Your timeline is ready</div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, padding: 20, marginTop: 18 }}>
        <div className="eb-g-3" style={{ display: "grid", gap: 16 }}>
          {[
            ["Source", project?.source || "VN"],
            ["Destination", project?.destination || "Premiere Pro"],
            ["Timeline", fmtDuration(TOTAL_DURATION)],
            ["Clips", ALL_CLIPS.length],
            ["Audio tracks", 2],
            ["Matched", `${MATCH_PCT}%`],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11.5, color: C.textFaint }}>{k}</div>
              <div className="eb-mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11.5, color: C.textFaint }}>Warnings</div>
            <div className="eb-mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 4, color: WARNING_COUNT ? C.yellow : C.mint }}>{WARNING_COUNT}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
        <Button variant="coral" icon={Download} onClick={() => exportTarget(project?.destination || "Premiere Pro")}>
          Export {project?.destination || "Premiere Pro"} timeline {exported.includes(project?.destination || "Premiere Pro") && "· Downloaded"}
        </Button>
        <div style={{ display: "flex", gap: 10 }}>
          {["DaVinci Resolve", "Final Cut Pro"].filter(s => s !== project?.destination).map(s => (
            <Button key={s} variant="outline" icon={Download} onClick={() => exportTarget(s)}>
              Export {s} {exported.includes(s) && "· Downloaded"}
            </Button>
          ))}
        </div>
        <Button variant="subtle" icon={Download} onClick={exportPackage}>
          Download project package (universal timeline JSON) {exported.includes("package") && "· Downloaded"}
        </Button>
      </div>
      <div style={{ fontSize: 11.5, color: C.textFaint, marginTop: 14, lineHeight: 1.6 }} className="eb-mono">
        /project/timeline.xml · /media · /audio · /reference · /metadata
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" icon={Check} onClick={onFinish}>Done — back to dashboard</Button>
      </div>
    </div>
  );
}

function NewTransferWizard({ onFinish }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", source: "VN", destination: "Premiere Pro" });
  const [files, setFiles] = useState({ reference: [], raw: [], audio: [] });
  const [selectedClip, setSelectedClip] = useState(null);
  const [reviewed, setReviewed] = useState({});

  return (
    <div style={{ padding: 28, overflowY: "auto" }}>
      <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>New transfer</h1>
      <WizardSteps step={step} />
      {step === 0 && <SetupStep data={data} setData={setData} onNext={() => setStep(1)} />}
      {step === 1 && <UploadStep files={files} setFiles={setFiles} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <AnalysisStep onDone={() => setStep(3)} />}
      {step === 3 && <TimelineStep project={data} selected={selectedClip} setSelected={setSelectedClip} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <ReviewStep reviewed={reviewed} setReviewed={setReviewed} onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {step === 5 && <ExportStep project={data} onBack={() => setStep(4)} onFinish={onFinish} />}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  PROJECT DETAIL (read-only opened project)                               */
/* ----------------------------------------------------------------------- */
function ProjectDetail({ project, onBack }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ padding: 28, overflowY: "auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.textDim, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← Back to projects</button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{project.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, fontSize: 13, color: C.textDim }}>
            {project.source} <ArrowRight size={12} color={C.textFaint} /> {project.destination}
          </div>
        </div>
        <Badge color={project.accuracy >= 90 ? C.mint : C.yellow} bg="rgba(94,234,176,0.1)">{project.accuracy}% matched</Badge>
      </div>
      <div className="eb-g-timeline" style={{ marginTop: 20, display: "grid", gap: 18 }}>
        <TimelinePanel project={project} clipsV1={VIDEO_TRACK_1} clipsV2={VIDEO_TRACK_2} music={MUSIC_TRACK} selected={selected} setSelected={setSelected} />
        <ClipInspector clip={selected} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  SIMPLE PANELS: Usage / Settings / Help / Exports                        */
/* ----------------------------------------------------------------------- */
function UsageView() {
  const used = 6, total = 30;
  return (
    <div style={{ padding: 28, maxWidth: 560 }}>
      <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>Usage</h1>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: C.panel, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
          <span>Transfers this month</span>
          <span className="eb-mono">{used} / {total}</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.border, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${(used / total) * 100}%`, height: "100%", background: C.mint }} />
        </div>
        <div style={{ fontSize: 12, color: C.textFaint, marginTop: 10 }}>Creator plan · resets Sep 1, 2026</div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div style={{ padding: 28, maxWidth: 480 }}>
      <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>Settings</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 6 }}>Display name</div>
          <input defaultValue="Demo Editor" style={{ ...inputStyle, width: "100%" }} />
        </div>
        <div>
          <div style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 6 }}>Default destination software</div>
          <select defaultValue="Premiere Pro" style={{ ...inputStyle, width: "100%" }}>
            {SOFTWARE.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <Button variant="primary" style={{ alignSelf: "flex-start" }}>Save changes</Button>
      </div>
    </div>
  );
}

function HelpView() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    ["Which editors does EditBridge support?", "The MVP focuses on VN and CapCut as sources with Premiere Pro as the primary destination. Premiere, DaVinci Resolve and Final Cut Pro are supported as both source and destination as the universal timeline architecture expands."],
    ["Will every effect transfer perfectly?", "No — cuts, timing, clip order and basic audio always transfer. Effects are approximated where possible, and preserved visually as a reference layer where they can't be mapped."],
    ["What does a confidence score mean?", "It reflects how certain the matching engine is that a reconstructed clip corresponds to the correct source and in/out points. Anything under 90% is worth a manual check in Review matches."],
  ];
  return (
    <div style={{ padding: 28, maxWidth: 620 }}>
      <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>Help</h1>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
        {faqs.map(([q, a], i) => (
          <div key={q} style={{ borderBottom: i < faqs.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{q}</span>
              <ChevronDown size={15} color={C.textFaint} style={{ transform: openIdx === i ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
            </button>
            {openIdx === i && <div style={{ padding: "0 16px 16px", fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>{a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportsView({ onOpenProject }) {
  return (
    <div style={{ padding: 28 }}>
      <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 18px" }}>Exports</h1>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
        {DEMO_PROJECTS.filter(p => p.status === "Completed").map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.borderSoft}` }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
              <div className="eb-mono" style={{ fontSize: 11.5, color: C.textFaint, marginTop: 3 }}>{p.destination} timeline · {p.date}</div>
            </div>
            <Button variant="subtle" size="sm" icon={Download} onClick={() => download(`${p.name.replace(/\s+/g, "_")}.xml`, buildSampleXML(p), "application/xml")}>Download</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  APP ROOT                                                                */
/* ----------------------------------------------------------------------- */
export default function EditBridgeApp() {
  const [stage, setStage] = useState("landing"); // landing | auth | app
  const [navId, setNavId] = useState("dashboard");
  const [openProject, setOpenProject] = useState(null);

  const goApp = useCallback(() => { setStage("app"); setNavId("dashboard"); }, []);
  const handleOpenProject = (p) => { setOpenProject(p); setNavId("project-detail"); };
  const handleNav = (id) => { setOpenProject(null); setNavId(id); };

  const titles = {
    dashboard: "Dashboard", projects: "Projects", new: "New transfer", review: "Review matches",
    exports: "Exports", usage: "Usage", settings: "Settings", help: "Help", "project-detail": "Project",
  };

  return (
    <div className="eb-root" style={{ minHeight: "100vh" }}>
      <GlobalStyle />
      <AnimatePresence mode="wait">
        {stage === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <LandingPage onTry={goApp} onSignIn={() => setStage("auth")} />
          </motion.div>
        )}
        {stage === "auth" && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <AuthScreen onDone={goApp} onBack={() => setStage("landing")} />
          </motion.div>
        )}
        {stage === "app" && (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} style={{ display: "flex", height: "100vh" }}>
            <Sidebar active={navId} onNav={handleNav} onSignOut={() => setStage("landing")} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <TopBar title={openProject ? openProject.name : titles[navId]} />
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {navId === "dashboard" && <DashboardView onNav={handleNav} onOpenProject={handleOpenProject} />}
                {navId === "projects" && <ProjectsView onOpenProject={handleOpenProject} onNav={handleNav} />}
                {navId === "new" && <NewTransferWizard onFinish={() => handleNav("dashboard")} />}
                {navId === "review" && (
                  <div style={{ padding: 28, overflowY: "auto" }}>
                    <h1 className="eb-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Review matches</h1>
                    <p style={{ fontSize: 13, color: C.textDim, margin: "0 0 18px" }}>All reconstructed clips across your most recent transfer, sorted by confidence.</p>
                    <ReviewStepStateful />
                  </div>
                )}
                {navId === "exports" && <ExportsView onOpenProject={handleOpenProject} />}
                {navId === "usage" && <UsageView />}
                {navId === "settings" && <SettingsView />}
                {navId === "help" && <HelpView />}
                {navId === "project-detail" && openProject && <ProjectDetail project={openProject} onBack={() => handleNav("projects")} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewStepStateful() {
  const [reviewed, setReviewed] = useState({});
  return <ReviewStep reviewed={reviewed} setReviewed={setReviewed} embedded />;
}
