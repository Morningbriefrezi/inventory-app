import { useState, useMemo, useEffect } from "react";

// ══════════════════════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════════════════════
function makeTheme(dark) {
  if (dark) return {
    bg: "#0D1117", sidebar: "#090C12", sidebarBorder: "#161D2B",
    accent: "#EF4444", accentLight: "#1A0A0A",
    text: "#E8EDF5", textSecondary: "#8B9AB5", textMuted: "#566380",
    border: "#1C2538", card: "#121829", cardAlt: "#0F1520",
    green: "#22C55E", blue: "#3B82F6", amber: "#F59E0B", purple: "#A855F7",
    inputBg: "#0D1117", topbar: "#0D1117", tableAlt: "#0F1520",
    shadow: "0 2px 8px rgba(0,0,0,0.5)",
  };
  return {
    bg: "#F0F2F5", sidebar: "#111827", sidebarBorder: "#1F2937",
    accent: "#D32F2F", accentLight: "#FFF5F5",
    text: "#111827", textSecondary: "#6B7280", textMuted: "#9CA3AF",
    border: "#E5E7EB", card: "#FFFFFF", cardAlt: "#F9FAFB",
    green: "#16A34A", blue: "#1D4ED8", amber: "#D97706", purple: "#7C3AED",
    inputBg: "#FAFAFA", topbar: "#FFFFFF", tableAlt: "#FAFAFA",
    shadow: "0 1px 4px rgba(0,0,0,0.09)",
  };
}

const FONT = `'Segoe UI', 'DejaVu Sans', Georgia, sans-serif`;

// ══════════════════════════════════════════════════════════════════
// STATIC DATA
// ══════════════════════════════════════════════════════════════════
const ADDRESSES = [
  { id:1, name:"ობიექტი I – რუსთაველის გამზ. 15, ვაკე",       short:"ობ. I · ვაკე",    color:"#D32F2F", light:"#FFF5F5", darkLight:"#1A0808" },
  { id:2, name:"ობიექტი II – ჭავჭავაძის გამზ. 45, საბურთალო", short:"ობ. II · საბ.",   color:"#1D4ED8", light:"#EFF6FF", darkLight:"#080D1A" },
  { id:3, name:"ობიექტი III – კახეთის გზ. 77, ისანი",         short:"ობ. III · ისანი", color:"#16A34A", light:"#F0FDF4", darkLight:"#081208" },
];

const INIT_CATS = [
  { id:1, name:"სამშენებლო მასალები",       icon:"🧱", color:"#D97706" },
  { id:2, name:"ელექტრო სამუშაოები",        icon:"⚡", color:"#1D4ED8" },
  { id:3, name:"სანტექნიკა",                icon:"🔧", color:"#0891B2" },
  { id:4, name:"საიზოლაციო მასალები",       icon:"🏠", color:"#7C3AED" },
  { id:5, name:"ხელსაწყოები",               icon:"🔨", color:"#D32F2F" },
  { id:6, name:"უსაფრთხოების აღჭ.",         icon:"🦺", color:"#16A34A" },
  { id:7, name:"ტექნიკა და გენ.",           icon:"⚙️", color:"#374151" },
  { id:8, name:"სხვა",                      icon:"📦", color:"#6B7280" },
];

const MONTHS_F = ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"];
const MONTHS_S = ["იანვ","თებ","მარ","აპრ","მაი","ივნ","ივლ","აგვ","სექ","ოქტ","ნოე","დეკ"];
const UNITS    = ["ც.","კგ","ტ","მ","მ²","მ³","ლ","კომპლ.","ყუთი","პალეტი","წყვ"];

const STATUS_META = {
  "დასრულებული": { bg:"#DCFCE7", color:"#166534", dot:"#16A34A", dbg:"#0A1F10", dc:"#4ADE80" },
  "მიმდინარე":   { bg:"#DBEAFE", color:"#1E40AF", dot:"#1D4ED8", dbg:"#080F24", dc:"#60A5FA" },
  "მოლოდინი":    { bg:"#FEF9C3", color:"#854D0E", dot:"#D97706", dbg:"#1A1200", dc:"#FCD34D" },
  "დამტკიცებული":{ bg:"#DCFCE7", color:"#166534", dot:"#16A34A", dbg:"#0A1F10", dc:"#4ADE80" },
  "უარყოფილი":   { bg:"#FEE2E2", color:"#991B1B", dot:"#D32F2F", dbg:"#1F0808", dc:"#F87171" },
};

let _uid = 1000;
function uid() { return `_${_uid++}`; }

// ── One example item per category ────────────────────────────────
const ITEMS0 = [
  { id:uid(), name:"ცემენტი M400",              catId:1, unit:"კგ",  qty:5000, minQ:500, price:0.45, addrId:1, notes:"ნოტიო ადგილებიდან დაცული" },
  { id:uid(), name:"ელ. კაბელი 2.5mm²",        catId:2, unit:"მ",   qty:1200, minQ:100, price:1.20, addrId:3, notes:"" },
  { id:uid(), name:"მილი PVC D50",              catId:3, unit:"მ",   qty:230,  minQ:30,  price:4.80, addrId:1, notes:"" },
  { id:uid(), name:"მინაბამბა 5cm",             catId:4, unit:"მ²",  qty:80,   minQ:20,  price:3.50, addrId:2, notes:"" },
  { id:uid(), name:"ბოლტი M10×80",              catId:5, unit:"ც.",  qty:4,    minQ:50,  price:0.30, addrId:1, notes:"⚠ მარაგი მცირეა" },
  { id:uid(), name:"სამ. ხელთათმანები",         catId:6, unit:"წყვ", qty:80,   minQ:20,  price:1.80, addrId:3, notes:"" },
  { id:uid(), name:"გენერატორი 5kW",            catId:7, unit:"ც.",  qty:2,    minQ:1,   price:1200, addrId:2, notes:"" },
  { id:uid(), name:"ვინილის ლენტი",            catId:8, unit:"ც.",  qty:15,   minQ:5,   price:0.90, addrId:1, notes:"" },
];

const PURCH0 = [
  { id:uid(), date:"2026-01-15", item:"ცემენტი M400",       catId:1, addrId:1, qty:3000, unit:"კგ", up:0.45, sup:"სამშენებლო სუპ.", status:"დასრულებული", notes:"" },
  { id:uid(), date:"2026-02-10", item:"ელ. კაბელი 2.5mm²", catId:2, addrId:3, qty:500,  unit:"მ",  up:1.20, sup:"ელ. ბაზარი",      status:"დასრულებული", notes:"" },
  { id:uid(), date:"2026-03-02", item:"მილი PVC D50",       catId:3, addrId:1, qty:80,   unit:"მ",  up:4.80, sup:"სანტ+ პლუს",     status:"მოლოდინი",   notes:"10 მარ." },
];

const SPENDS0 = [
  { id:uid(), date:"2026-01-20", desc:"ბეტ. სამ. – საფ.",      catId:1, addrId:1, amount:4500, status:"დამტკიცებული", notes:"" },
  { id:uid(), date:"2026-02-08", desc:"ელ. სად. – სარდ.",      catId:2, addrId:3, amount:1200, status:"დამტკიცებული", notes:"" },
  { id:uid(), date:"2026-03-03", desc:"კარ-ფანჯ. კომპ.",       catId:5, addrId:2, amount:7800, status:"მოლოდინი",    notes:"" },
];

// ══════════════════════════════════════════════════════════════════
// LOCAL STORAGE HELPERS
// ══════════════════════════════════════════════════════════════════
function loadState(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveState(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ══════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ══════════════════════════════════════════════════════════════════
function Badge({ status, dark }) {
  const m = STATUS_META[status] || { bg:"#F3F4F6", color:"#374151", dot:"#9CA3AF", dbg:"#1a1a1a", dc:"#9CA3AF" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:dark?m.dbg:m.bg, color:dark?m.dc:m.color, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:dark?m.dc:m.dot, display:"inline-block" }} />
      {status}
    </span>
  );
}

function APill({ addrId, dark }) {
  const a = ADDRESSES.find(x => x.id === addrId);
  if (!a) return null;
  return (
    <span style={{ background:dark?a.darkLight:a.light, color:a.color, border:`1px solid ${a.color}40`, borderRadius:6, padding:"3px 9px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
      {a.short}
    </span>
  );
}

function KCard({ label, value, icon, color, sub, G }) {
  return (
    <div style={{ background:G.card, borderRadius:12, padding:"18px 20px", boxShadow:G.shadow, position:"relative", overflow:"hidden", border:`1px solid ${G.border}` }}>
      <div style={{ position:"absolute", right:16, top:14, fontSize:28, opacity:.1 }}>{icon}</div>
      <div style={{ fontSize:11, fontWeight:700, color:G.textMuted, textTransform:"uppercase", letterSpacing:.9, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||G.text, lineHeight:1, letterSpacing:-.5 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:G.textMuted, marginTop:5 }}>{sub}</div>}
    </div>
  );
}

function F({ label, children, G }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
      {label && <label style={{ fontSize:12, fontWeight:700, color:G.textSecondary, letterSpacing:.2 }}>{label}</label>}
      {children}
    </div>
  );
}

function iStyle(G) {
  return { border:`1.5px solid ${G.border}`, borderRadius:8, padding:"9px 12px", fontSize:14, color:G.text, outline:"none", background:G.inputBg, fontFamily:FONT, width:"100%", boxSizing:"border-box" };
}
function Inp({ label, G, ...p }) { return <F label={label} G={G}><input  {...p} style={{ ...iStyle(G), ...p.style }} /></F>; }
function Sel({ label, children, G, ...p }) { return <F label={label} G={G}><select {...p} style={{ ...iStyle(G), cursor:"pointer", ...p.style }}>{children}</select></F>; }
function Txa({ label, G, ...p }) { return <F label={label} G={G}><textarea {...p} style={{ ...iStyle(G), resize:"vertical", minHeight:64, ...p.style }} /></F>; }

function Btn({ children, variant="primary", size="md", G, ...p }) {
  const V = {
    primary:   { background:G.accent, color:"#fff", border:"none" },
    secondary: { background:G.cardAlt, color:G.text, border:`1px solid ${G.border}` },
    success:   { background:G.green, color:"#fff", border:"none" },
    ghost:     { background:"transparent", color:G.textSecondary, border:"none" },
  };
  const S = { sm:{padding:"6px 14px",fontSize:12}, md:{padding:"9px 18px",fontSize:13}, lg:{padding:"11px 24px",fontSize:14} };
  return (
    <button {...p} style={{ ...V[variant], ...S[size], borderRadius:8, fontWeight:700, cursor:"pointer", fontFamily:FONT, display:"inline-flex", alignItems:"center", gap:6, ...p.style }}>
      {children}
    </button>
  );
}

function Modal({ title, onClose, width=560, children, G }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:G.card, borderRadius:16, width:`min(95vw,${width}px)`, maxHeight:"90vh", overflow:"auto", boxShadow:"0 24px 60px rgba(0,0,0,0.4)", border:`1px solid ${G.border}` }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 22px 14px", borderBottom:`1px solid ${G.border}` }}>
          <span style={{ fontWeight:800, fontSize:16, color:G.text }}>{title}</span>
          <button onClick={onClose} style={{ border:`1px solid ${G.border}`, background:G.cardAlt, borderRadius:7, width:30, height:30, cursor:"pointer", fontSize:15, color:G.textSecondary, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ padding:"18px 22px 22px" }}>{children}</div>
      </div>
    </div>
  );
}

function DataTable({ cols, rows, footer, G }) {
  return (
    <div style={{ background:G.card, borderRadius:12, boxShadow:G.shadow, overflow:"hidden", border:`1px solid ${G.border}` }}>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:G.cardAlt }}>
              {cols.map(c => <th key={c.k} style={{ padding:"11px 14px", textAlign:"left", fontSize:11, color:G.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, whiteSpace:"nowrap" }}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0
              ? <tr><td colSpan={cols.length} style={{ padding:"44px", textAlign:"center", color:G.textMuted, fontSize:14 }}>ჩანაწერი ვერ მოიძებნა</td></tr>
              : rows.map((row, i) => (
                  <tr key={row.id || i} style={{ borderTop:`1px solid ${G.border}`, background:i%2===1?G.tableAlt:G.card }}>
                    {cols.map(c => <td key={c.k} style={{ padding:"10px 14px", fontSize:13, color:G.text, verticalAlign:"middle" }}>{c.fn ? c.fn(row) : row[c.k]}</td>)}
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      {footer && (
        <div style={{ padding:"10px 14px", background:G.cardAlt, borderTop:`1px solid ${G.border}`, display:"flex", gap:18, flexWrap:"wrap", alignItems:"center" }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function Filters({ addr, setAddr, month, setMonth, cat, setCat, status, setStatus, cats, extra, G }) {
  const ss = { ...iStyle(G), padding:"8px 12px", fontSize:13, fontWeight:600, cursor:"pointer", width:"auto" };
  const dirty = addr !== "all" || month !== "all" || cat !== "all" || (status && status !== "all");
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14, alignItems:"center" }}>
      <span style={{ fontSize:11, fontWeight:700, color:G.textMuted, textTransform:"uppercase", letterSpacing:.8 }}>ფილტრი:</span>
      <select value={addr} onChange={e => setAddr(e.target.value)} style={ss}>
        <option value="all">🏗 ყველა ობიექტი</option>
        {ADDRESSES.map(a => <option key={a.id} value={a.id}>{a.short}</option>)}
      </select>
      <select value={month} onChange={e => setMonth(e.target.value)} style={ss}>
        <option value="all">📅 ყველა თვე</option>
        {MONTHS_F.map((m, i) => <option key={i} value={i}>{m}</option>)}
      </select>
      <select value={cat} onChange={e => setCat(e.target.value)} style={ss}>
        <option value="all">🗂 ყველა კატეგ.</option>
        {cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
      </select>
      {status !== undefined && (
        <select value={status} onChange={e => setStatus(e.target.value)} style={ss}>
          <option value="all">📋 ყველა სტ.</option>
          {Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}
        </select>
      )}
      {extra}
      {dirty && (
        <button onClick={() => { setAddr("all"); setMonth("all"); setCat("all"); setStatus && setStatus("all"); }}
          style={{ border:"none", background:G.accentLight, color:G.accent, borderRadius:8, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FONT }}>
          ✕ გასუფთავება
        </button>
      )}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder = "ძიება...", G }) {
  return (
    <div style={{ position:"relative" }}>
      <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:G.textMuted, fontSize:14 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...iStyle(G), paddingLeft:32, width:210 }} />
    </div>
  );
}

function Toggle({ label, desc, value, onChange, G }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${G.border}` }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{desc}</div>}
      </div>
      <div onClick={onChange} style={{ width:42, height:24, borderRadius:12, background:value?G.accent:"#D1D5DB", cursor:"pointer", position:"relative", transition:"background .18s", flexShrink:0, marginLeft:16 }}>
        <div style={{ position:"absolute", top:4, left:value?22:4, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .18s", boxShadow:"0 1px 3px rgba(0,0,0,.2)" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// NAV
// ══════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dashboard",  label:"მთავარი დაფა",  icon:"⬛" },
  { id:"inventory",  label:"ინვენტარი",      icon:"📦" },
  { id:"categories", label:"კატეგორიები",    icon:"🗂" },
  { id:"purchases",  label:"შესყიდვები",     icon:"🛒" },
  { id:"spends",     label:"ხარჯები",        icon:"💸" },
  { id:"reports",    label:"ანგარიშები",     icon:"📊" },
  { id:"settings",   label:"პარამეტრები",    icon:"⚙️" },
];

// ══════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [dark,   setDark]   = useState(() => loadState("inv_dark",   false));
  const [items,  setItems]  = useState(() => loadState("inv_items",  ITEMS0));
  const [purch,  setPurch]  = useState(() => loadState("inv_purch",  PURCH0));
  const [spends, setSpends] = useState(() => loadState("inv_spends", SPENDS0));
  const [cats,   setCats]   = useState(() => loadState("inv_cats",   INIT_CATS));
  const [cfg,    setCfg]    = useState(() => loadState("inv_cfg",    { lowAlert:true, autoOrder:false, emailNotif:true, approval:true, cur:"₾", tax:"18", defUnit:"ც." }));

  const G = makeTheme(dark);

  useEffect(() => saveState("inv_dark",   dark),   [dark]);
  useEffect(() => saveState("inv_items",  items),  [items]);
  useEffect(() => saveState("inv_purch",  purch),  [purch]);
  useEffect(() => saveState("inv_spends", spends), [spends]);
  useEffect(() => saveState("inv_cats",   cats),   [cats]);
  useEffect(() => saveState("inv_cfg",    cfg),    [cfg]);

  const [page,       setPage]       = useState("dashboard");
  const [collapsed,  setCollapsed]  = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [modal,      setModal]      = useState(null);
  const [detItem,    setDetItem]    = useState(null);

  const [fA,  setFA]  = useState("all");
  const [fM,  setFM]  = useState("all");
  const [fC,  setFC]  = useState("all");
  const [fSt, setFSt] = useState("all");
  const [sI,  setSI]  = useState("");
  const [sP,  setSP]  = useState("");
  const [sSp, setSSp] = useState("");

  const E_ITEM  = { name:"", catId:"1", unit:"ც.", qty:"", minQ:"", price:"", addrId:"1", notes:"" };
  const E_PURCH = { date:new Date().toISOString().slice(0,10), item:"", catId:"1", addrId:"1", qty:"", unit:"ც.", up:"", sup:"", status:"მიმდინარე", notes:"" };
  const E_SPEND = { date:new Date().toISOString().slice(0,10), desc:"", catId:"1", addrId:"1", amount:"", status:"მოლოდინი", notes:"" };
  const E_CAT   = { name:"", icon:"📦", color:"#6B7280" };
  const [iF, setIF] = useState(E_ITEM);
  const [pF, setPF] = useState(E_PURCH);
  const [sF, setSF] = useState(E_SPEND);
  const [cF, setCF] = useState(E_CAT);

  const now  = new Date();
  const cm   = now.getMonth();
  const cur  = cfg.cur;

  const lowItems = useMemo(() => items.filter(i => i.qty <= i.minQ), [items]);
  const invVal   = useMemo(() => items.reduce((s,i) => s + i.price * i.qty, 0), [items]);
  const thisPur  = useMemo(() => purch.filter(p => new Date(p.date).getMonth() === cm), [purch, cm]);
  const thisSp   = useMemo(() => spends.filter(s => new Date(s.date).getMonth() === cm), [spends, cm]);

  function filt(arr, getA, getM, getC, getSt, search, getN) {
    return arr.filter(r => {
      if (fA !== "all" && getA(r) !== +fA) return false;
      if (fM !== "all" && getM(r) !== +fM) return false;
      if (fC !== "all" && getC(r) !== +fC) return false;
      if (fSt !== "all" && getSt && getSt(r) !== fSt) return false;
      if (search && !getN(r).toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  const fItems = useMemo(() => filt(items,  r=>r.addrId, ()=>-1,                       r=>r.catId, null,        sI,  r=>r.name), [items, fA, fC, sI]);
  const fPurch = useMemo(() => filt(purch,  r=>r.addrId, r=>new Date(r.date).getMonth(), r=>r.catId, r=>r.status, sP,  r=>r.item), [purch, fA, fM, fC, fSt, sP]);
  const fSpend = useMemo(() => filt(spends, r=>r.addrId, r=>new Date(r.date).getMonth(), r=>r.catId, r=>r.status, sSp, r=>r.desc), [spends, fA, fM, fC, fSt, sSp]);

  function addItem() {
    setItems(p => [...p, { id:uid(), name:iF.name, catId:+iF.catId, unit:iF.unit, qty:+iF.qty, minQ:+iF.minQ, price:+iF.price, addrId:+iF.addrId, notes:iF.notes }]);
    setIF(E_ITEM); setModal(null);
  }
  function addPurch() {
    const p = { id:uid(), date:pF.date, item:pF.item, catId:+pF.catId, addrId:+pF.addrId, qty:+pF.qty, unit:pF.unit, up:+pF.up, sup:pF.sup, status:pF.status, notes:pF.notes };
    setPurch(prev => [p, ...prev]);
    setItems(prev => {
      const i = prev.findIndex(x => x.name === p.item && x.addrId === p.addrId);
      if (i >= 0) { const c = [...prev]; c[i] = { ...c[i], qty: c[i].qty + p.qty }; return c; }
      return prev;
    });
    setPF(E_PURCH); setModal(null);
  }
  function addSpend() {
    setSpends(p => [{ id:uid(), date:sF.date, desc:sF.desc, catId:+sF.catId, addrId:+sF.addrId, amount:+sF.amount, status:sF.status, notes:sF.notes }, ...p]);
    setSF(E_SPEND); setModal(null);
  }
  function addCat() {
    setCats(p => [...p, { id:Date.now(), name:cF.name, icon:cF.icon, color:cF.color }]);
    setCF(E_CAT); setModal(null);
  }

  const notifs = [
    ...lowItems.map(i => ({ id:i.id, msg:`⚠️ ${i.name} — მცირე მარაგი (${i.qty}/${i.minQ} ${i.unit})`, c:G.accent })),
    ...purch.filter(p => p.status === "მოლოდინი").map(p => ({ id:"p"+p.id, msg:`🛒 "${p.item}" — მოლოდინში`, c:G.amber })),
    ...spends.filter(s => s.status === "მოლოდინი" && cfg.approval).map(s => ({ id:"s"+s.id, msg:`💸 "${s.desc}" — დამტკიცება საჭ.`, c:G.amber })),
  ];

  // ── PAGES ────────────────────────────────────────────────────────

  function PageDashboard() {
    const addrSt = ADDRESSES.map(a => ({
      ...a,
      pT:  purch.filter(p => p.addrId === a.id).reduce((s,p) => s + p.qty * p.up, 0),
      sT:  spends.filter(s => s.addrId === a.id).reduce((s,sp) => s + sp.amount, 0),
      cnt: items.filter(i => i.addrId === a.id).length,
      low: items.filter(i => i.addrId === a.id && i.qty <= i.minQ).length,
    }));
    const recent = [
      ...purch.slice(0,5).map(p => ({ ...p, _t:"შეს.", _n:p.item, _v:p.qty * p.up })),
      ...spends.slice(0,5).map(s => ({ ...s, _t:"ხარ.", _n:s.desc, _v:s.amount })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

    return <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:0 }}>მთავარი დაფა</h2>
        <div style={{ display:"flex", gap:8 }}>
          <Btn size="sm" variant="secondary" G={G} onClick={() => setModal("purch")}>🛒 შეს.</Btn>
          <Btn size="sm" G={G} onClick={() => setModal("spend")}>💸 ხარ.</Btn>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:12, marginBottom:22 }}>
        <KCard G={G} label="ინვ. ღირებულება" value={`${cur}${invVal.toLocaleString("ka-GE",{maximumFractionDigits:0})}`} icon="💰" color={G.accent} />
        <KCard G={G} label={`${MONTHS_S[cm]} შეს.`} value={`${cur}${thisPur.reduce((s,p)=>s+p.qty*p.up,0).toFixed(0)}`} icon="🛒" color={G.blue} />
        <KCard G={G} label={`${MONTHS_S[cm]} ხარ.`} value={`${cur}${thisSp.reduce((s,sp)=>s+sp.amount,0).toFixed(0)}`} icon="💸" color={G.amber} />
        <KCard G={G} label="მცირე მარაგი" value={lowItems.length} icon="⚠️" color={lowItems.length>0?G.accent:G.green} sub={lowItems.length>0?"გამაფ. საჭ.":"ყველა ნ."} />
        <KCard G={G} label="პოზიციები" value={items.length} icon="📦" />
        <KCard G={G} label="ობიექტები" value={ADDRESSES.length} icon="🏗" color={G.purple} />
      </div>

      <div style={{ fontSize:12, fontWeight:700, color:G.textMuted, textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>ობიექტების მდგომ.</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:12, marginBottom:22 }}>
        {addrSt.map(a => (
          <div key={a.id} style={{ background:G.card, borderRadius:12, padding:"18px 20px", boxShadow:G.shadow, borderTop:`3px solid ${a.color}`, border:`1px solid ${G.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:G.text }}>{a.name.split(" – ")[0]}</div>
                <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{a.name.split(" – ")[1]}</div>
              </div>
              {a.low > 0 && <span style={{ background:"#FEE2E2", color:"#991B1B", borderRadius:20, padding:"3px 9px", fontSize:12, fontWeight:700 }}>⚠ {a.low}</span>}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[["შეს.",`${cur}${a.pT.toFixed(0)}`,a.color],["ხარ.",`${cur}${a.sT.toFixed(0)}`,G.accent],["პოზ.",a.cnt,G.purple]].map(([l,v,c]) => (
                <div key={l} style={{ background:G.cardAlt, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:10, color:G.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:c, marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:G.textMuted, textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>⚠️ მცირე მარაგი</div>
          {lowItems.length === 0
            ? <div style={{ background:G.card, borderRadius:12, padding:24, textAlign:"center", color:G.green, fontSize:14, fontWeight:600, boxShadow:G.shadow, border:`1px solid ${G.border}` }}>✅ ყველა ნ.</div>
            : <div style={{ background:G.card, borderRadius:12, boxShadow:G.shadow, overflow:"hidden", border:`1px solid ${G.border}` }}>
                {lowItems.map((i, idx) => (
                  <div key={i.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderBottom:idx<lowItems.length-1?`1px solid ${G.border}`:"none" }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{i.name}</div>
                      <APill addrId={i.addrId} dark={dark} />
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:15, fontWeight:800, color:G.accent }}>{i.qty} {i.unit}</div>
                      <div style={{ fontSize:11, color:G.textMuted }}>მინ: {i.minQ}</div>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:G.textMuted, textTransform:"uppercase", letterSpacing:.8, marginBottom:12 }}>🕐 ბოლო ოპ.</div>
          <div style={{ background:G.card, borderRadius:12, boxShadow:G.shadow, overflow:"hidden", border:`1px solid ${G.border}` }}>
            {recent.map((r, i) => (
              <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderBottom:i<recent.length-1?`1px solid ${G.border}`:"none" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ width:28, height:28, borderRadius:8, background:r._t==="შეს."?"#DBEAFE":"#FEF9C3", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                    {r._t === "შეს." ? "🛒" : "💸"}
                  </span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:G.text, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r._n}</div>
                    <div style={{ fontSize:11, color:G.textMuted }}>{r.date}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:r._t==="შეს."?G.blue:G.accent }}>{cur}{r._v?.toFixed(0)}</div>
                  <Badge status={r.status} dark={dark} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>;
  }

  function PageInventory() {
    const tv = fItems.reduce((s, i) => s + i.price * i.qty, 0);
    return <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:0 }}>ინვენტარი</h2>
        <Btn G={G} onClick={() => setModal("item")}>+ ახ. პოზიცია</Btn>
      </div>
      <Filters G={G} addr={fA} setAddr={setFA} month={fM} setMonth={setFM} cat={fC} setCat={setFC} status={undefined} setStatus={setFSt} cats={cats}
        extra={<SearchBox G={G} value={sI} onChange={setSI} placeholder="ძებნა სახელ..." />} />
      <DataTable G={G}
        cols={[
          { k:"name",  label:"პროდუქტი",   fn:r => (
            <button onClick={() => { setDetItem(r); setModal("detail"); }} style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", padding:0, fontFamily:FONT }}>
              <div style={{ fontSize:14, fontWeight:700, color:G.text }}>{r.name}</div>
              {r.notes && <div style={{ fontSize:12, color:G.textMuted }}>{r.notes}</div>}
            </button>
          )},
          { k:"cat",   label:"კატეგ.",    fn:r => { const c = cats.find(x => x.id === r.catId); return <span style={{ fontSize:13, color:G.textSecondary }}>{c?.icon} {c?.name}</span>; }},
          { k:"addr",  label:"ობიექტი",   fn:r => <APill addrId={r.addrId} dark={dark} /> },
          { k:"qty",   label:"რაოდ.",     fn:r => <span style={{ fontWeight:700, color:r.qty<=r.minQ?G.accent:G.text, fontSize:14 }}>{r.qty} {r.unit}</span> },
          { k:"min",   label:"მინ.",      fn:r => <span style={{ fontSize:13, color:G.textMuted }}>{r.minQ} {r.unit}</span> },
          { k:"price", label:"ფასი/ერთ.", fn:r => <span style={{ fontSize:13 }}>{cur}{r.price}</span> },
          { k:"total", label:"ჯამი",      fn:r => <span style={{ fontWeight:700, color:G.green, fontSize:14 }}>{cur}{(r.price*r.qty).toFixed(2)}</span> },
          { k:"st",    label:"სტ.",       fn:r => r.qty<=r.minQ
              ? <Badge status="მოლოდინი" dark={dark}/>
              : <span style={{ background:dark?"#0A1F10":"#DCFCE7", color:dark?"#4ADE80":"#166534", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700 }}>ნ.</span> },
          { k:"del",   label:"",          fn:r => <button onClick={() => setItems(p => p.filter(x => x.id !== r.id))} style={{ border:"none", background:"none", cursor:"pointer", color:G.textMuted, fontSize:15, padding:4 }}>🗑</button> },
        ]}
        rows={fItems}
        footer={[
          <span key="c" style={{ fontSize:13, color:G.textSecondary }}>სულ: <strong>{fItems.length}</strong> პ.</span>,
          <span key="v" style={{ fontSize:13, color:G.textSecondary }}>ჯ.ღ: <strong style={{ color:G.green }}>{cur}{tv.toFixed(2)}</strong></span>,
          <span key="l" style={{ fontSize:13, color:G.accent }}>მ.მ: <strong>{fItems.filter(i => i.qty <= i.minQ).length}</strong></span>,
        ]}
      />
    </>;
  }

  function PageCategories() {
    return <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:0 }}>კატეგორიები</h2>
        <Btn G={G} onClick={() => setModal("cat")}>+ ახ. კატეგ.</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14 }}>
        {cats.map(c => {
          const cnt = items.filter(i => i.catId === c.id).length;
          const pv  = purch.filter(p => p.catId === c.id).reduce((s,p) => s + p.qty * p.up, 0);
          const pct = items.length > 0 ? Math.round(cnt / items.length * 100) : 0;
          return (
            <div key={c.id} style={{ background:G.card, borderRadius:12, padding:"18px 20px", boxShadow:G.shadow, borderLeft:`3px solid ${c.color||G.border}`, border:`1px solid ${G.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{c.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:G.textMuted, background:G.cardAlt, borderRadius:20, padding:"3px 8px" }}>{pct}%</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:G.text, marginBottom:6 }}>{c.name}</div>
              <div style={{ display:"flex", gap:12, marginBottom:8 }}>
                <span style={{ fontSize:12, color:G.textMuted }}>📦 {cnt}</span>
                <span style={{ fontSize:12, color:G.textMuted }}>🛒 {purch.filter(p => p.catId === c.id).length}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:G.green, marginBottom:8 }}>{cur}{pv.toFixed(0)}</div>
              <div style={{ width:"100%", height:5, background:G.cardAlt, borderRadius:4 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:c.color||G.accent, borderRadius:4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </>;
  }

  function PagePurchases() {
    const tot = fPurch.reduce((s,p) => s + p.qty * p.up, 0);
    const tq  = fPurch.reduce((s,p) => s + p.qty, 0);
    const is  = iStyle(G);
    return <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:0 }}>შესყიდვები</h2>
        <Btn G={G} onClick={() => setModal("purch")}>🛒 + შეს.</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:16 }}>
        <KCard G={G} label="ჩანაწ." value={fPurch.length} icon="📋" />
        <KCard G={G} label="სულ რ." value={tq.toFixed(0)} icon="📦" color={G.blue} />
        <KCard G={G} label="თანხა" value={`${cur}${tot.toFixed(0)}`} icon="💰" color={G.green} />
        <KCard G={G} label="დღგ" value={`${cur}${(tot*+cfg.tax/100).toFixed(0)}`} icon="🧾" color={G.amber} sub={`${cfg.tax}%`} />
      </div>
      <Filters G={G} addr={fA} setAddr={setFA} month={fM} setMonth={setFM} cat={fC} setCat={setFC} status={fSt} setStatus={setFSt} cats={cats}
        extra={<SearchBox G={G} value={sP} onChange={setSP} placeholder="ძებნა..." />} />
      <DataTable G={G}
        cols={[
          { k:"date", label:"თარ.",   fn:r => <span style={{ fontSize:13, color:G.textMuted }}>{r.date}</span> },
          { k:"item", label:"საქ.",   fn:r => <span style={{ fontSize:14, fontWeight:700 }}>{r.item}</span> },
          { k:"cat",  label:"კატ.",   fn:r => { const c = cats.find(x => x.id === r.catId); return <span style={{ fontSize:13 }}>{c?.icon} {c?.name}</span>; }},
          { k:"addr", label:"ობ.",    fn:r => <APill addrId={r.addrId} dark={dark} /> },
          { k:"qty",  label:"რ.",     fn:r => <span style={{ fontWeight:700, color:G.blue, fontSize:14 }}>{r.qty} {r.unit}</span> },
          { k:"up",   label:"ფ./ე.",  fn:r => <span style={{ fontSize:13 }}>{cur}{r.up}</span> },
          { k:"tot",  label:"ჯ.",     fn:r => <span style={{ fontWeight:700, color:G.green, fontSize:14 }}>{cur}{(r.qty*r.up).toFixed(2)}</span> },
          { k:"sup",  label:"მომ.",   fn:r => <span style={{ fontSize:13, color:G.textSecondary }}>{r.sup}</span> },
          { k:"st",   label:"სტ.",    fn:r => (
            <select value={r.status} onChange={e => setPurch(p => p.map(x => x.id===r.id?{...x,status:e.target.value}:x))}
              style={{ ...is, padding:"4px 8px", fontSize:12, width:"auto" }}>
              {Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}
            </select>
          )},
          { k:"del",  label:"",       fn:r => <button onClick={() => setPurch(p => p.filter(x => x.id !== r.id))} style={{ border:"none", background:"none", cursor:"pointer", color:G.textMuted, fontSize:15, padding:4 }}>🗑</button> },
        ]}
        rows={fPurch}
        footer={[
          <span key="t" style={{ fontSize:13, color:G.textSecondary }}>ჯ.: <strong style={{ color:G.green }}>{cur}{tot.toFixed(2)}</strong></span>,
          <span key="q" style={{ fontSize:13, color:G.textSecondary }}>სულ რ.: <strong>{tq.toFixed(1)}</strong></span>,
        ]}
      />
    </>;
  }

  function PageSpends() {
    const tot  = fSpend.reduce((s,sp) => s + sp.amount, 0);
    const appr = fSpend.filter(s => s.status === "დამტკიცებული").reduce((s,sp) => s + sp.amount, 0);
    const pend = fSpend.filter(s => s.status === "მოლოდინი").reduce((s,sp) => s + sp.amount, 0);
    return <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:0 }}>ხარჯები</h2>
        <Btn G={G} onClick={() => setModal("spend")}>💸 + ხარ.</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:16 }}>
        <KCard G={G} label="ჩანაწ." value={fSpend.length} icon="📋" />
        <KCard G={G} label="სულ" value={`${cur}${tot.toFixed(0)}`} icon="💸" color={G.accent} />
        <KCard G={G} label="დამტ." value={`${cur}${appr.toFixed(0)}`} icon="✅" color={G.green} />
        <KCard G={G} label="მოლ." value={`${cur}${pend.toFixed(0)}`} icon="⏳" color={G.amber} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:16 }}>
        {ADDRESSES.map(a => {
          const t  = spends.filter(s => s.addrId === a.id).reduce((s,sp) => s + sp.amount, 0);
          const mx = Math.max(...ADDRESSES.map(x => spends.filter(s => s.addrId === x.id).reduce((s,sp) => s + sp.amount, 0)), 1);
          return (
            <div key={a.id} style={{ background:G.card, borderRadius:10, padding:"14px 16px", boxShadow:G.shadow, display:"flex", gap:12, alignItems:"center", border:`1px solid ${G.border}` }}>
              <div style={{ width:4, borderRadius:4, alignSelf:"stretch", background:a.color }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:G.textMuted, fontWeight:600 }}>{a.short}</div>
                <div style={{ fontSize:20, fontWeight:800, color:a.color, margin:"3px 0" }}>{cur}{t.toFixed(0)}</div>
                <div style={{ width:"100%", height:4, background:G.cardAlt, borderRadius:4 }}>
                  <div style={{ width:`${t/mx*100}%`, height:"100%", background:a.color, borderRadius:4 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Filters G={G} addr={fA} setAddr={setFA} month={fM} setMonth={setFM} cat={fC} setCat={setFC} status={fSt} setStatus={setFSt} cats={cats}
        extra={<SearchBox G={G} value={sSp} onChange={setSSp} placeholder="ძებნა..." />} />
      <DataTable G={G}
        cols={[
          { k:"date",   label:"თარ.",  fn:r => <span style={{ fontSize:13, color:G.textMuted }}>{r.date}</span> },
          { k:"desc",   label:"აღ.",   fn:r => <span style={{ fontSize:14, fontWeight:700, color:G.text }}>{r.desc}</span> },
          { k:"cat",    label:"კატ.",  fn:r => { const c = cats.find(x => x.id === r.catId); return <span style={{ fontSize:13 }}>{c?.icon} {c?.name}</span>; }},
          { k:"addr",   label:"ობ.",   fn:r => <APill addrId={r.addrId} dark={dark} /> },
          { k:"amount", label:"თ.",    fn:r => <span style={{ fontWeight:700, color:G.accent, fontSize:14 }}>{cur}{r.amount.toFixed(2)}</span> },
          { k:"st",     label:"სტ.",   fn:r => <Badge status={r.status} dark={dark} /> },
          { k:"del",    label:"",      fn:r => <button onClick={() => setSpends(p => p.filter(x => x.id !== r.id))} style={{ border:"none", background:"none", cursor:"pointer", color:G.textMuted, fontSize:15, padding:4 }}>🗑</button> },
        ]}
        rows={fSpend}
        footer={[<span key="t" style={{ fontSize:13, color:G.textSecondary }}>ჯ.: <strong style={{ color:G.accent }}>{cur}{tot.toFixed(2)}</strong></span>]}
      />
    </>;
  }

  function PageReports() {
    const mData = MONTHS_S.map((m, i) => ({
      m,
      p: purch.filter(p => new Date(p.date).getMonth() === i).reduce((s,p) => s + p.qty * p.up, 0),
      s: spends.filter(sp => new Date(sp.date).getMonth() === i).reduce((s,sp) => s + sp.amount, 0),
    }));
    const maxV = Math.max(...mData.map(d => Math.max(d.p, d.s)), 1);
    return <>
      <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:"0 0 20px" }}>ანგარიშები</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        <KCard G={G} label="ინვ. ღ." value={`${cur}${invVal.toFixed(0)}`} icon="💰" color={G.accent} />
        <KCard G={G} label="სულ შეს." value={`${cur}${purch.reduce((s,p)=>s+p.qty*p.up,0).toFixed(0)}`} icon="🛒" color={G.blue} />
        <KCard G={G} label="სულ ხარ." value={`${cur}${spends.reduce((s,sp)=>s+sp.amount,0).toFixed(0)}`} icon="💸" color={G.accent} />
        <KCard G={G} label="კატ." value={cats.length} icon="🗂" color={G.purple} />
      </div>
      <div style={{ background:G.card, borderRadius:12, padding:"20px 22px", boxShadow:G.shadow, marginBottom:18, border:`1px solid ${G.border}` }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 18px" }}>📊 თვიური შეს. / ხარ.</h3>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:130 }}>
          {mData.map((d, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
              <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:100 }}>
                <div style={{ flex:1, background:G.blue, borderRadius:"4px 4px 0 0", height:`${d.p/maxV*100}%`, minHeight:d.p>0?2:0, opacity:.85 }} />
                <div style={{ flex:1, background:G.accent, borderRadius:"4px 4px 0 0", height:`${d.s/maxV*100}%`, minHeight:d.s>0?2:0, opacity:.85 }} />
              </div>
              <span style={{ fontSize:9, color:G.textMuted, fontWeight:700 }}>{d.m}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:18, marginTop:12 }}>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:G.textSecondary }}><span style={{ width:12, height:12, background:G.blue, borderRadius:3, display:"inline-block" }}/> შეს.</span>
          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:G.textSecondary }}><span style={{ width:12, height:12, background:G.accent, borderRadius:3, display:"inline-block" }}/> ხარ.</span>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:G.card, borderRadius:12, padding:"18px 20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>📦 კატ. ინვ.</h3>
          {cats.map(c => {
            const v   = items.filter(i => i.catId === c.id).reduce((s,i) => s + i.price * i.qty, 0);
            const pct = invVal > 0 ? v / invVal * 100 : 0;
            return (
              <div key={c.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:G.text }}>{c.icon} {c.name}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:c.color }}>{cur}{v.toFixed(0)}</span>
                </div>
                <div style={{ width:"100%", height:5, background:G.cardAlt, borderRadius:4 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:c.color, borderRadius:4 }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background:G.card, borderRadius:12, padding:"18px 20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>🏗 ობ. ხარ.</h3>
          {ADDRESSES.map(a => {
            const v    = spends.filter(s => s.addrId === a.id).reduce((s,sp) => s + sp.amount, 0);
            const tot2 = spends.reduce((s,sp) => s + sp.amount, 0);
            const pct  = tot2 > 0 ? v / tot2 * 100 : 0;
            return (
              <div key={a.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:G.text }}>{a.short}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:a.color }}>{cur}{v.toFixed(0)}</span>
                </div>
                <div style={{ width:"100%", height:5, background:G.cardAlt, borderRadius:4 }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:a.color, borderRadius:4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>;
  }

  function PageSettings() {
    return <>
      <h2 style={{ fontSize:22, fontWeight:800, color:G.text, margin:"0 0 20px" }}>პარამეტრები</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        <div style={{ background:G.card, borderRadius:12, padding:"20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>🎨 გარეგნობა</h3>
          <Toggle G={G} label="ღამის რეჟიმი" desc="მუქი ფონი და ფერები" value={dark} onChange={() => setDark(p => !p)} />
          <Toggle G={G} label="მცირე მ. შეტ." desc="გაფ. მინ. მარაგზე" value={cfg.lowAlert} onChange={() => setCfg(p => ({...p, lowAlert:!p.lowAlert}))} />
          <Toggle G={G} label="ელ-ფ. შეტ." desc="შეტ. ელ-ფოსტაზე" value={cfg.emailNotif} onChange={() => setCfg(p => ({...p, emailNotif:!p.emailNotif}))} />
          <Toggle G={G} label="დამტ. სისტ." desc="ხარჯების ადმ. დამტ." value={cfg.approval} onChange={() => setCfg(p => ({...p, approval:!p.approval}))} />
        </div>
        <div style={{ background:G.card, borderRadius:12, padding:"20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>💱 ფინ. პარ.</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Inp G={G} label="ვალ. სიმბოლო" value={cfg.cur} onChange={e => setCfg(p => ({...p, cur:e.target.value}))} />
            <Inp G={G} label="დღგ %" type="number" value={cfg.tax} onChange={e => setCfg(p => ({...p, tax:e.target.value}))} />
            <Sel G={G} label="ნაგ. ერთ." value={cfg.defUnit} onChange={e => setCfg(p => ({...p, defUnit:e.target.value}))}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </Sel>
          </div>
        </div>
        <div style={{ background:G.card, borderRadius:12, padding:"20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>🏗 ობიექტები</h3>
          {ADDRESSES.map(a => (
            <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10, padding:"12px 14px", background:G.cardAlt, borderRadius:8, borderLeft:`3px solid ${a.color}` }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:G.text }}>{a.name.split(" – ")[0]}</div>
                <div style={{ fontSize:12, color:G.textMuted }}>{a.name.split(" – ")[1]}</div>
              </div>
              <span style={{ width:10, height:10, borderRadius:"50%", background:a.color }} />
            </div>
          ))}
        </div>
        <div style={{ background:G.card, borderRadius:12, padding:"20px", boxShadow:G.shadow, border:`1px solid ${G.border}` }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:G.text, margin:"0 0 14px" }}>📊 სისტემა</h3>
          {[["პოზ.",items.length],["შეს.",purch.length],["ხარ.",spends.length],["კატ.",cats.length]].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${G.border}`, fontSize:14 }}>
              <span style={{ color:G.textSecondary }}>{l}</span>
              <strong style={{ color:G.text }}>{v}</strong>
            </div>
          ))}
          <Btn G={G} variant="secondary" style={{ width:"100%", marginTop:14 }}
            onClick={() => { if (window.confirm("მონ. განახ.?")) { setItems(ITEMS0); setPurch(PURCH0); setSpends(SPENDS0); setCats(INIT_CATS); }}}>
            🔄 მონ. განახ.
          </Btn>
        </div>
      </div>
    </>;
  }

  const pageMap = {
    dashboard: <PageDashboard/>, inventory: <PageInventory/>, categories: <PageCategories/>,
    purchases: <PagePurchases/>, spends: <PageSpends/>, reports: <PageReports/>, settings: <PageSettings/>
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════
  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:FONT, background:G.bg, fontSize:14 }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width:collapsed?62:218, background:G.sidebar, display:"flex", flexDirection:"column", transition:"width .2s", flexShrink:0, position:"sticky", top:0, height:"100vh", borderRight:`1px solid ${G.sidebarBorder}` }}>
        <div style={{ padding:collapsed?"14px 0":"18px 16px", display:"flex", alignItems:"center", gap:12, borderBottom:`1px solid ${G.sidebarBorder}`, justifyContent:collapsed?"center":"flex-start", minHeight:62 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:G.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🏗</div>
          {!collapsed && <div>
            <div style={{ color:"#F9FAFB", fontWeight:800, fontSize:13, lineHeight:1.2 }}>სტრუქტურა</div>
            <div style={{ color:"#6B7280", fontSize:11, fontWeight:600 }}>დეველოპმენტი</div>
          </div>}
        </div>
        <nav style={{ flex:1, padding:"10px 6px", overflowY:"auto" }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} title={n.label}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:collapsed?"11px 0":"10px 12px", borderRadius:9, border:"none", background:active?"#1F2937":"transparent", color:active?"#F9FAFB":"#9CA3AF", cursor:"pointer", fontFamily:FONT, fontSize:13, fontWeight:active?700:500, transition:"all .12s", marginBottom:2, justifyContent:collapsed?"center":"flex-start" }}>
                <span style={{ fontSize:15, flexShrink:0 }}>{n.icon}</span>
                {!collapsed && <span style={{ flex:1 }}>{n.label}</span>}
                {!collapsed && active && <span style={{ width:5, height:5, borderRadius:"50%", background:G.accent, flexShrink:0 }} />}
              </button>
            );
          })}
        </nav>
        <button onClick={() => setCollapsed(p => !p)}
          style={{ margin:8, padding:"9px", border:`1px solid ${G.sidebarBorder}`, background:"transparent", borderRadius:8, color:"#6B7280", cursor:"pointer", fontSize:12, fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* TOPBAR */}
        <div style={{ background:G.topbar, borderBottom:`1px solid ${G.border}`, padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:10 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:G.text, lineHeight:1.2 }}>{NAV.find(n => n.id === page)?.label}</div>
            <div style={{ fontSize:11, color:G.textMuted, fontWeight:600 }}>სტრ. დეველ. · {now.toLocaleDateString("ka-GE")}</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={() => setDark(p => !p)}
              style={{ width:36, height:36, borderRadius:9, border:`1px solid ${G.border}`, background:G.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <div style={{ position:"relative" }}>
              <button onClick={() => setNotifOpen(p => !p)}
                style={{ width:36, height:36, borderRadius:9, border:`1px solid ${G.border}`, background:G.card, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, position:"relative" }}>
                🔔
                {notifs.length > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:G.accent, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{notifs.length}</span>}
              </button>
              {notifOpen && (
                <div style={{ position:"absolute", right:0, top:44, width:320, background:G.card, borderRadius:12, boxShadow:"0 8px 28px rgba(0,0,0,.2)", border:`1px solid ${G.border}`, zIndex:100 }}>
                  <div style={{ padding:"12px 16px", borderBottom:`1px solid ${G.border}`, fontWeight:700, fontSize:14, color:G.text }}>შეტყობ. ({notifs.length})</div>
                  <div style={{ maxHeight:280, overflowY:"auto" }}>
                    {notifs.length === 0
                      ? <div style={{ padding:"20px", textAlign:"center", color:G.textMuted, fontSize:13 }}>✅ ყველა ნ.</div>
                      : notifs.map(n => <div key={n.id} style={{ padding:"10px 16px", borderBottom:`1px solid ${G.border}`, fontSize:13, color:n.c, fontWeight:600 }}>{n.msg}</div>)
                    }
                  </div>
                  <button onClick={() => setNotifOpen(false)}
                    style={{ width:"100%", padding:"10px", border:"none", background:G.cardAlt, borderTop:`1px solid ${G.border}`, cursor:"pointer", fontSize:13, color:G.textSecondary, fontFamily:FONT, borderRadius:"0 0 12px 12px" }}>
                    დახ.
                  </button>
                </div>
              )}
            </div>
            <div style={{ width:36, height:36, borderRadius:9, background:G.accent, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:14 }}>ა</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, padding:"22px 24px", overflowY:"auto" }}>
          {pageMap[page]}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal === "item" && (
        <Modal G={G} title="➕ ახ. ინვ. პოზ." onClose={() => setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            <div style={{ gridColumn:"1/-1" }}><Inp G={G} label="სახელი *" value={iF.name} onChange={e => setIF(p => ({...p, name:e.target.value}))} placeholder="მ. ცემ. M400" /></div>
            <Sel G={G} label="კატეგ. *" value={iF.catId} onChange={e => setIF(p => ({...p, catId:e.target.value}))}>{cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</Sel>
            <Sel G={G} label="ობიექტი *" value={iF.addrId} onChange={e => setIF(p => ({...p, addrId:e.target.value}))}>{ADDRESSES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Sel>
            <Inp G={G} label="საწ. რ. *" type="number" value={iF.qty} onChange={e => setIF(p => ({...p, qty:e.target.value}))} placeholder="0" />
            <Sel G={G} label="ერთეული" value={iF.unit} onChange={e => setIF(p => ({...p, unit:e.target.value}))}>{UNITS.map(u => <option key={u}>{u}</option>)}</Sel>
            <Inp G={G} label="მინ. მარ." type="number" value={iF.minQ} onChange={e => setIF(p => ({...p, minQ:e.target.value}))} placeholder="0" />
            <Inp G={G} label={`ფ./ე. (${cur})`} type="number" value={iF.price} onChange={e => setIF(p => ({...p, price:e.target.value}))} placeholder="0.00" />
            <div style={{ gridColumn:"1/-1" }}><Txa G={G} label="შენ." value={iF.notes} onChange={e => setIF(p => ({...p, notes:e.target.value}))} placeholder="..." /></div>
          </div>
          {iF.qty && iF.price && <div style={{ background:dark?"#0A1F10":"#F0FDF4", border:`1px solid ${dark?"#14532D":"#BBF7D0"}`, borderRadius:8, padding:"10px 14px", marginTop:12, fontSize:14, fontWeight:700, color:G.green }}>💰 ჯ.ღ: {cur}{(+iF.qty * +iF.price).toFixed(2)}</div>}
          <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
            <Btn G={G} variant="secondary" onClick={() => setModal(null)}>გაუქმება</Btn>
            <Btn G={G} onClick={addItem} disabled={!iF.name || !iF.qty}>შენახვა</Btn>
          </div>
        </Modal>
      )}

      {modal === "purch" && (
        <Modal G={G} title="🛒 ახ. შეს." onClose={() => setModal(null)}>
          <div style={{ background:dark?"#080F24":"#EFF6FF", border:`1px solid ${dark?"#1e3a8a":"#BFDBFE"}`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:dark?"#93C5FD":"#1E40AF", fontWeight:600 }}>⚠️ შეი. ობ. — ავტ. ინვ. განახ.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            <Inp G={G} label="თარ. *" type="date" value={pF.date} onChange={e => setPF(p => ({...p, date:e.target.value}))} />
            <Sel G={G} label="ობ. *" value={pF.addrId} onChange={e => setPF(p => ({...p, addrId:e.target.value}))}>{ADDRESSES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Sel>
            <div style={{ gridColumn:"1/-1" }}><Inp G={G} label="საქ. სახ. *" value={pF.item} onChange={e => setPF(p => ({...p, item:e.target.value}))} placeholder="მ. ცემ. M400" /></div>
            <Sel G={G} label="კატ." value={pF.catId} onChange={e => setPF(p => ({...p, catId:e.target.value}))}>{cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</Sel>
            <Inp G={G} label="მომ-კი" value={pF.sup} onChange={e => setPF(p => ({...p, sup:e.target.value}))} placeholder="კ. სახ." />
            <Inp G={G} label="რ. *" type="number" value={pF.qty} onChange={e => setPF(p => ({...p, qty:e.target.value}))} placeholder="0" />
            <Sel G={G} label="ერთ." value={pF.unit} onChange={e => setPF(p => ({...p, unit:e.target.value}))}>{UNITS.map(u => <option key={u}>{u}</option>)}</Sel>
            <Inp G={G} label={`ე.ფ.(${cur})*`} type="number" value={pF.up} onChange={e => setPF(p => ({...p, up:e.target.value}))} placeholder="0.00" />
            <Sel G={G} label="სტ." value={pF.status} onChange={e => setPF(p => ({...p, status:e.target.value}))}>{Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}</Sel>
            <div style={{ gridColumn:"1/-1" }}><Txa G={G} label="შენ." value={pF.notes} onChange={e => setPF(p => ({...p, notes:e.target.value}))} placeholder="..." /></div>
          </div>
          {pF.qty && pF.up && <div style={{ background:dark?"#0A1F10":"#F0FDF4", border:`1px solid ${dark?"#14532D":"#BBF7D0"}`, borderRadius:8, padding:"10px 14px", marginTop:12, fontSize:14, fontWeight:800, color:G.green }}>✅ ჯ: {cur}{(+pF.qty * +pF.up).toFixed(2)} | დღგ: {cur}{(+pF.qty * +pF.up * +cfg.tax / 100).toFixed(2)}</div>}
          <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
            <Btn G={G} variant="secondary" onClick={() => setModal(null)}>გაუქმება</Btn>
            <Btn G={G} onClick={addPurch} disabled={!pF.item || !pF.qty || !pF.up}>შენახვა</Btn>
          </div>
        </Modal>
      )}

      {modal === "spend" && (
        <Modal G={G} title="💸 ახ. ხარ." onClose={() => setModal(null)}>
          <div style={{ background:dark?"#1F0808":"#FFF5F5", border:`1px solid ${dark?"#7F1D1D":"#FED7D7"}`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:dark?"#FCA5A5":"#991B1B", fontWeight:600 }}>💸 ობ. ხარჯი{cfg.approval ? " — ადმ. დამტ. საჭ." : ""}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
            <Inp G={G} label="თარ. *" type="date" value={sF.date} onChange={e => setSF(p => ({...p, date:e.target.value}))} />
            <Sel G={G} label="ობ. *" value={sF.addrId} onChange={e => setSF(p => ({...p, addrId:e.target.value}))}>{ADDRESSES.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Sel>
            <div style={{ gridColumn:"1/-1" }}><Inp G={G} label="აღ. *" value={sF.desc} onChange={e => setSF(p => ({...p, desc:e.target.value}))} placeholder="მ. ბეტ. II სართ." /></div>
            <Sel G={G} label="კატ." value={sF.catId} onChange={e => setSF(p => ({...p, catId:e.target.value}))}>{cats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</Sel>
            <Inp G={G} label={`თ.(${cur})*`} type="number" value={sF.amount} onChange={e => setSF(p => ({...p, amount:e.target.value}))} placeholder="0.00" />
            <Sel G={G} label="სტ." value={sF.status} onChange={e => setSF(p => ({...p, status:e.target.value}))}>{Object.keys(STATUS_META).map(s => <option key={s}>{s}</option>)}</Sel>
            <div style={{ gridColumn:"1/-1" }}><Txa G={G} label="შენ." value={sF.notes} onChange={e => setSF(p => ({...p, notes:e.target.value}))} placeholder="..." /></div>
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
            <Btn G={G} variant="secondary" onClick={() => setModal(null)}>გაუქმება</Btn>
            <Btn G={G} variant="success" onClick={addSpend} disabled={!sF.desc || !sF.amount}>გაგზავნა</Btn>
          </div>
        </Modal>
      )}

      {modal === "cat" && (
        <Modal G={G} title="🗂 ახ. კატ." onClose={() => setModal(null)} width={360}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Inp G={G} label="სახელი *" value={cF.name} onChange={e => setCF(p => ({...p, name:e.target.value}))} placeholder="კატ. სახ." />
            <Inp G={G} label="ემოჯი" value={cF.icon} onChange={e => setCF(p => ({...p, icon:e.target.value}))} placeholder="📦" />
            <Inp G={G} label="ფერი (#hex)" value={cF.color} onChange={e => setCF(p => ({...p, color:e.target.value}))} placeholder="#6B7280" />
          </div>
          <div style={{ display:"flex", gap:10, marginTop:16, justifyContent:"flex-end" }}>
            <Btn G={G} variant="secondary" onClick={() => setModal(null)}>გაუქმება</Btn>
            <Btn G={G} onClick={addCat} disabled={!cF.name}>შენახვა</Btn>
          </div>
        </Modal>
      )}

      {modal === "detail" && detItem && (() => {
        const c   = cats.find(x => x.id === detItem.catId);
        const a   = ADDRESSES.find(x => x.id === detItem.addrId);
        const low = detItem.qty <= detItem.minQ;
        const pct = detItem.minQ > 0 ? Math.min(100, detItem.qty / detItem.minQ * 100) : 100;
        return (
          <Modal G={G} title={`📦 ${detItem.name}`} onClose={() => { setModal(null); setDetItem(null); }} width={400}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[["კატ.",`${c?.icon} ${c?.name}`],["ობ.",a?.name.split(" – ")[0]],["რ.",`${detItem.qty} ${detItem.unit}`],["მინ.მ.",`${detItem.minQ} ${detItem.unit}`],["ფ./ე.",`${cur}${detItem.price}`],["ჯ.ღ.",`${cur}${(detItem.price*detItem.qty).toFixed(2)}`]].map(([l,v]) => (
                <div key={l} style={{ background:G.cardAlt, borderRadius:8, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:G.textMuted, fontWeight:700, textTransform:"uppercase", letterSpacing:.5 }}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:G.text, marginTop:3 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:G.textMuted, marginBottom:4 }}>
                <span>მარ. დ.</span>
                <span style={{ fontWeight:700, color:low?G.accent:G.green }}>{low ? "⚠ მ." : "✅ ნ."}</span>
              </div>
              <div style={{ width:"100%", height:8, background:G.cardAlt, borderRadius:4 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:low?G.accent:G.green, borderRadius:4 }} />
              </div>
            </div>
            {detItem.notes && <div style={{ background:dark?"#1A1200":"#FFF9C4", borderRadius:8, padding:"10px 12px", fontSize:13, color:dark?"#FCD34D":"#78350F", marginBottom:14 }}>📝 {detItem.notes}</div>}
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn G={G} size="sm" variant="secondary" onClick={() => { setModal(null); setDetItem(null); }}>დახ.</Btn>
              <Btn G={G} size="sm" onClick={() => { setModal("purch"); setDetItem(null); }}>🛒 შეს.</Btn>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
