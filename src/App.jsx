import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;1,300&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --soil: #1e1208;
    --moss: #3D5A3E;
    --sage: #7A9E7E;
    --fern: #A8C5A0;
    --cream: #F5F0E8;
    --gold: #C8A84B;
    --copper: #B87333;
    --petal: #D4847A;
  }

  html { font-size: 16px; -webkit-text-size-adjust: 100%; }

  body {
    background: var(--soil);
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
    min-height: 100dvh;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    min-height: 100dvh;
    background:
      radial-gradient(ellipse at 10% 0%, rgba(61,90,62,0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 100%, rgba(74,44,23,0.5) 0%, transparent 55%),
      linear-gradient(160deg, #140c04 0%, #1e1208 45%, #17231a 100%);
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* ── Header ── */
  .header {
    padding: 48px 24px 28px;
    padding-top: calc(48px + env(safe-area-inset-top));
    border-bottom: 1px solid rgba(168,197,160,0.12);
  }

  .header-tag {
    font-size: 10px;
    letter-spacing: 0.22em;
    color: var(--sage);
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-tag::before {
    content: '';
    display: block;
    width: 20px; height: 1px;
    background: var(--sage);
    flex-shrink: 0;
  }

  .header h1 {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 300;
    color: var(--cream);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .header h1 em { font-style: italic; color: var(--gold); }

  .header-sub {
    font-size: 12px;
    color: rgba(232,237,230,0.4);
    margin-top: 8px;
    line-height: 1.6;
    letter-spacing: 0.02em;
  }

  /* ── Form ── */
  .form { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .field { display: flex; flex-direction: column; gap: 7px; }

  .field label {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sage);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .field input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(168,197,160,0.18);
    border-radius: 8px;
    padding: 13px 14px;
    color: var(--cream);
    font-family: 'DM Mono', monospace;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
    -webkit-appearance: none;
  }
  .field input::placeholder { color: rgba(232,237,230,0.22); }
  .field input:focus {
    border-color: rgba(200,168,75,0.5);
    background: rgba(200,168,75,0.04);
  }

  /* ── Segment ── */
  .segment {
    display: flex;
    border: 1px solid rgba(168,197,160,0.18);
    border-radius: 8px;
    overflow: hidden;
  }

  .segment button {
    flex: 1;
    padding: 11px 6px;
    background: transparent;
    border: none;
    border-right: 1px solid rgba(168,197,160,0.12);
    color: rgba(232,237,230,0.38);
    font-family: 'DM Mono', monospace;
    font-size: 10.5px;
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.03em;
    line-height: 1.3;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
  }
  .segment button:last-child { border-right: none; }
  .segment button.active {
    background: rgba(168,197,160,0.11);
    color: var(--fern);
  }

  /* ── Chip row (style) ── */
  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
    padding: 7px 13px;
    border-radius: 20px;
    border: 1px solid rgba(168,197,160,0.18);
    background: transparent;
    color: rgba(232,237,230,0.4);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.18s;
    letter-spacing: 0.03em;
    -webkit-tap-highlight-color: transparent;
  }
  .chip.active {
    background: rgba(168,197,160,0.11);
    border-color: rgba(168,197,160,0.4);
    color: var(--fern);
  }

  /* ── Generate Button ── */
  .generate-btn {
    width: 100%;
    padding: 16px;
    margin: 4px 0 0;
    background: linear-gradient(135deg, var(--moss) 0%, #223d23 100%);
    border: 1px solid rgba(168,197,160,0.28);
    border-radius: 10px;
    color: var(--fern);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    -webkit-tap-highlight-color: transparent;
  }
  .generate-btn:active { transform: scale(0.98); }
  .generate-btn:disabled { opacity: 0.42; cursor: not-allowed; }

  /* ── Loading ── */
  .loading {
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .ring {
    width: 40px; height: 40px;
    border: 2px solid rgba(168,197,160,0.12);
    border-top-color: var(--sage);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--sage);
    text-transform: uppercase;
    animation: pulse 2s ease-in-out infinite;
    text-align: center;
    line-height: 1.7;
  }
  @keyframes pulse { 0%,100%{opacity:0.45} 50%{opacity:1} }

  /* ── Result ── */
  .result {
    padding: 0 24px 60px;
    animation: up 0.5s ease-out;
  }
  @keyframes up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .divider {
    height: 1px;
    background: linear-gradient(90deg,transparent,rgba(168,197,160,0.25),transparent);
    margin: 8px 0 28px;
  }

  .result-heading {
    font-family: 'Fraunces', serif;
    font-size: 24px;
    font-weight: 300;
    color: var(--cream);
    font-style: italic;
    margin-bottom: 6px;
  }
  .result-meta {
    font-size: 10px;
    letter-spacing: 0.13em;
    color: var(--copper);
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  /* Prose */
  .prose { color: rgba(232,237,230,0.82); font-size: 14px; line-height: 1.8; }
  .prose h1,.prose h2,.prose h3,.prose h4 {
    font-family: 'Fraunces', serif;
    font-weight: 300;
    color: var(--cream);
    margin: 28px 0 10px;
    line-height: 1.25;
  }
  .prose h1 { font-size: 22px; border-bottom: 1px solid rgba(168,197,160,0.15); padding-bottom: 8px; }
  .prose h2 { font-size: 18px; color: var(--fern); }
  .prose h3 { font-size: 15px; color: var(--gold); }
  .prose h4 { font-size: 13px; color: var(--sage); text-transform: uppercase; letter-spacing: 0.1em; }
  .prose p { margin-bottom: 12px; }
  .prose ul, .prose ol { margin: 10px 0 14px 18px; }
  .prose li { margin-bottom: 6px; }
  .prose ul li::marker { color: var(--sage); }
  .prose strong { color: var(--gold); font-weight: 500; }
  .prose em { color: var(--fern); font-style: italic; }
  .prose hr { border: none; border-top: 1px solid rgba(168,197,160,0.15); margin: 24px 0; }
  .prose blockquote {
    border-left: 2px solid var(--gold);
    padding: 10px 16px;
    margin: 16px 0;
    background: rgba(200,168,75,0.05);
    border-radius: 0 6px 6px 0;
    font-style: italic;
    color: rgba(232,237,230,0.65);
  }

  /* Table wrapper for horizontal scroll on mobile */
  .prose .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 16px 0; }
  .prose table { border-collapse: collapse; font-size: 12px; min-width: 480px; width: 100%; }
  .prose th {
    background: rgba(61,90,62,0.4);
    color: var(--fern);
    font-weight: 500;
    text-align: left;
    padding: 9px 12px;
    border: 1px solid rgba(168,197,160,0.12);
    white-space: nowrap;
    letter-spacing: 0.05em;
  }
  .prose td {
    padding: 9px 12px;
    border: 1px solid rgba(168,197,160,0.08);
    color: rgba(232,237,230,0.72);
    vertical-align: top;
  }
  .prose tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

  /* ── Error ── */
  .error {
    margin: 0 24px 24px;
    padding: 14px 16px;
    background: rgba(212,132,122,0.09);
    border: 1px solid rgba(212,132,122,0.28);
    border-radius: 8px;
    color: var(--petal);
    font-size: 13px;
    line-height: 1.6;
  }
`;

function renderMd(text) {
  if (!text) return "";
  let h = text
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/g, (_, hdr, body) => {
      const ths = hdr.split("|").filter(c=>c.trim()).map(c=>`<th>${c.trim()}</th>`).join("");
      const rows = body.trim().split("\n").map(r=>{
        const tds = r.split("|").filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join("");
        return `<tr>${tds}</tr>`;
      }).join("");
      return `<div class="table-wrap"><table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table></div>`;
    })
    .replace(/^#### (.+)$/gm,"<h4>$1</h4>")
    .replace(/^### (.+)$/gm,"<h3>$1</h3>")
    .replace(/^## (.+)$/gm,"<h2>$1</h2>")
    .replace(/^# (.+)$/gm,"<h1>$1</h1>")
    .replace(/^---$/gm,"<hr>")
    .replace(/^&gt; (.+)$/gm,"<blockquote>$1</blockquote>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/`(.+?)`/g,"<code>$1</code>")
    .replace(/^- (.+)$/gm,"<li>$1</li>")
    .replace(/^(\d+)\. (.+)$/gm,"<li>$2</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g,m=>`<ul>${m}</ul>`)
    .split(/\n{2,}/).map(b=>{
      if(/^<(h[1-4]|ul|ol|div|blockquote|hr)/.test(b.trim())) return b;
      const t=b.trim(); if(!t) return "";
      return `<p>${t.replace(/\n/g,"<br>")}</p>`;
    }).join("\n");
  return h;
}

const SUNLIGHT = ["☀️ Full Sun","🌤 Part Shade","🌑 Full Shade"];
const STYLES   = ["Modern","Cottage","Zen","Mediterranean","Tropical","Rain Garden"];
const LANGS    = ["English","中文"];

export default function App() {
  const [city, setCity]         = useState("");
  const [type, setType]         = useState("");
  const [sun, setSun]           = useState(SUNLIGHT[0]);
  const [plant, setPlant]       = useState("");
  const [style, setStyle]       = useState(STYLES[0]);
  const [lang, setLang]         = useState("English");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);

  const ok = city.trim() && type.trim() && plant.trim() && !loading;

  async function generate() {
    setLoading(true); setResult(null); setError(null);
    const sys = lang === "中文"
      ? `你是专业景观植物搭配设计师。根据用户信息生成完整植物搭配方案，使用Markdown格式（标题、表格、列表）。包括：气候分析、全套植物库（乔木/灌木/多年生/草类/地被等层次，每种含名称、尺寸、阳光、浇水、养护难度⭐、花期、搭配理由）、设计技巧（色彩/结构/质感/季相/生态）。详细专业。`
      : `You are an expert landscape planting designer. Generate a complete planting palette in Markdown (headings, tables, lists). Include: climate zone analysis, full layered palette (canopy, understory, shrubs, perennials, grasses, groundcovers — each with name, size, sun, water, care ⭐–⭐⭐⭐, bloom, pairing rationale), design tips (color, structure, texture, seasons, ecology, invasives). Be thorough and inspiring.`;
    const msg = lang === "中文"
      ? `城市：${city}\n项目：${type}\n阳光：${sun}\n风格：${style}\n核心植物：${plant}\n请生成完整方案。`
      : `City: ${city}\nProject: ${type}\nSun: ${sun}\nStyle: ${style}\nAnchor: ${plant}\nGenerate complete planting palette.`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sys,
          messages: [{ role: "user", content: msg }],
        }),
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error.message);
      setResult(d.content?.map(b=>b.text||"").join("")||"");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-tag">Landscape Intelligence</div>
          <h1>Design Your<br /><em>Living Garden</em></h1>
          <p className="header-sub">Climate-matched · Ecologically considered · Beautifully layered</p>
        </header>

        <div className="form">
          <div className="field">
            <label>📍 City / Location</label>
            <input placeholder="e.g. Shanghai / 上海" value={city} onChange={e=>setCity(e.target.value)} />
          </div>

          <div className="field">
            <label>🏡 Project Type</label>
            <input placeholder="e.g. Residential backyard" value={type} onChange={e=>setType(e.target.value)} />
          </div>

          <div className="field">
            <label>☀️ Sunlight</label>
            <div className="segment">
              {SUNLIGHT.map(o=>(
                <button key={o} className={sun===o?"active":""} onClick={()=>setSun(o)}>{o}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>🎨 Style</label>
            <div className="chip-row">
              {STYLES.map(o=>(
                <button key={o} className={`chip${style===o?" active":""}`} onClick={()=>setStyle(o)}>{o}</button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>🌱 Anchor Plant</label>
            <input placeholder="e.g. Hydrangea / 绣球" value={plant} onChange={e=>setPlant(e.target.value)} />
          </div>

          <div className="field">
            <label>🌐 Language</label>
            <div className="segment">
              {LANGS.map(o=>(
                <button key={o} className={lang===o?"active":""} onClick={()=>setLang(o)}>{o}</button>
              ))}
            </div>
          </div>

          <button className="generate-btn" disabled={!ok} onClick={generate}>
            <span>🌿</span>
            {loading ? "Composing palette…" : "Generate Planting Design"}
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="ring" />
            <div className="loading-text">Analyzing climate<br/>Layering your palette…</div>
          </div>
        )}

        {error && <div className="error">⚠ {error}</div>}

        {result && !loading && (
          <div className="result">
            <div className="divider" />
            <div className="result-heading">{plant} Palette</div>
            <div className="result-meta">{city} · {sun} · {style}</div>
            <div className="prose" dangerouslySetInnerHTML={{__html: renderMd(result)}} />
          </div>
        )}
      </div>
    </>
  );
}
