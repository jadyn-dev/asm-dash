import { useState, useMemo } from "react";

const BG = "#ffffff";
const BG_ALT = "#fafafa";
const BG_DARK = "#111111";
const YELLOW = "#f5c518";
const YELLOW_LIGHT = "#fef9e7";
const YELLOW_MED = "#fdf0b2";
const TEXT = "#111111";
const TEXT_MID = "#555555";
const TEXT_LIGHT = "#999999";
const BORDER = "#e5e5e5";
const WHITE = "#ffffff";

const CALL_CATEGORIES = [
  { id: "shipping", label: "Shipping / Tracking", color: "#111", bg: YELLOW_LIGHT, icon: "\u{1F4E6}" },
  { id: "serial", label: "Serial Discrepancy", color: "#111", bg: "#fce4e4", icon: "\u{1F522}" },
  { id: "device", label: "Device / Hardware", color: "#111", bg: "#f0eefb", icon: "\u{1F4BB}" },
  { id: "portal", label: "Portal / System", color: "#111", bg: "#fce8f3", icon: "\u{1F310}" },
  { id: "other", label: "Other", color: "#111", bg: "#f2f2f2", icon: "\u{1F4CB}" },
];

const CALL_STATUSES = [
  { id: "active", label: "Active", color: BG_DARK, bg: YELLOW },
  { id: "waiting_rca", label: "Waiting on RCA", color: "#7a5c00", bg: YELLOW_MED },
  { id: "waiting_info", label: "Waiting on Info", color: TEXT_MID, bg: "#ebebeb" },
  { id: "waiting_zones", label: "Waiting on Zones", color: "#7a5c00", bg: YELLOW_LIGHT },
  { id: "watchlist", label: "Watchlist", color: TEXT_LIGHT, bg: "#f5f5f5" },
  { id: "closed", label: "Closed", color: "#2d6a2e", bg: "#e6f4e6" },
];

const FR_STATUSES = [
  { id: "submitted", label: "Submitted", color: TEXT_MID, bg: "#f0f0f0" },
  { id: "under_review", label: "Under Review", color: "#7a5c00", bg: YELLOW_LIGHT },
  { id: "planned", label: "Planned", color: BG_DARK, bg: YELLOW_MED },
  { id: "in_progress", label: "In Progress", color: BG_DARK, bg: YELLOW },
  { id: "shipped", label: "Shipped", color: "#2d6a2e", bg: "#e6f4e6" },
  { id: "declined", label: "Declined", color: "#8b2020", bg: "#fce4e4" },
];

const PG_STATUSES = [
  { id: "identified", label: "Identified", color: "#8b2020", bg: "#fce4e4" },
  { id: "evaluating", label: "Evaluating", color: "#7a5c00", bg: YELLOW_LIGHT },
  { id: "in_progress", label: "In Progress", color: BG_DARK, bg: YELLOW },
  { id: "implemented", label: "Implemented", color: "#2d6a2e", bg: "#e6f4e6" },
  { id: "monitoring", label: "Monitoring", color: TEXT_MID, bg: "#f0f0f0" },
];

const now = Date.now();
const day = 86400000;

const CALL_ITEMS = [
  { id: 1, title: "Acorn Ship to allwhere - box tracking & photos", order: "112239-1-ACOR / 111818-1-ACOR", serial: "", category: "shipping", status: "active", desc: "How many boxes received? Need running list, tracking, and photos. Wait on ITAD until BIOS passwords received.", nextStep: "Bilal to get progress update", whatWasSaid: "Need photos added", comments: [{ text: "Bilal following up on progress", ts: now - day, author: "Me" }], linkedIds: [] },
  { id: 2, title: "Drop shipment wrong label - tracking mixup", order: "107979-1-DUOH", serial: "", category: "shipping", status: "waiting_rca", desc: "Drop shipment heading to Depot, wrong label. Tracking 888224513474 on wrong order 107984-1-SEES.", nextStep: "Correct return tracking confirmed. Awaiting RCA from Zones.", whatWasSaid: "Waiting on RCA", comments: [], linkedIds: [3] },
  { id: 3, title: "Wrong serial shipped - 776VWC4 vs 766VWC4", order: "102556-1-ABCL / 111564-1-ABCL", serial: "766VWC4 / 776VWC4", category: "serial", status: "waiting_rca", desc: "Serial requested was 766VWC4 but 776VWC4 was shipped. Can correct serial go on 111564-1-ABCL?", nextStep: "Waiting on RCA from Zones", whatWasSaid: "", comments: [], linkedIds: [2] },
  { id: 4, title: "Serial discrepancy on inbound transfer", order: "110784-1-DIET", serial: "CFNWCQNKHY", category: "serial", status: "active", desc: "Received serial in inventory since Dec from previous transfer (SKU 009925497-ALWCP). How was it received again?", nextStep: "Need explanation from Zones warehouse team", whatWasSaid: "No record of deployment since December", comments: [], linkedIds: [3] },
  { id: 5, title: "FedEx no update since 2/18 - overnight kit", order: "111562-1-ABCL", serial: "", category: "shipping", status: "waiting_info", desc: "Kit deployed overnight, no FedEx update since 2/18. Zones opened ticket 2/25.", nextStep: "Need invoice with item costs for FedEx investigation", whatWasSaid: "Need all item details to share with FedEx", comments: [], linkedIds: [] },
  { id: 6, title: "Device graded D-Fair - no photos, need details", order: "", serial: "H4G779P46T", category: "device", status: "waiting_zones", desc: "Graded D-Fair, no photos. Keyboard/touchpad don't work, OS install failing. Client wants clarity.", nextStep: "Zones to provide photos and root cause for OS failure", whatWasSaid: "", comments: [], linkedIds: [] },
  { id: 7, title: "Package possibly stolen - no signature", order: "113052-1-ABCL", serial: "", category: "shipping", status: "active", desc: "End-user says order didn't arrive, may be stolen. FedEx says signature not required - human error on label.", nextStep: "Bilal to confirm resolution / possible replacement", whatWasSaid: "Human error - signature not selected when creating label", comments: [], linkedIds: [2, 5] },
  { id: 8, title: "ABM enrollment - need proof of serial", order: "103384-1-WRIK", serial: "KW3JC5W727", category: "device", status: "active", desc: "Vendor says serial not on manifest. Need photo of serial on back of box.", nextStep: "Zones to take photo of serial", whatWasSaid: "", comments: [], linkedIds: [] },
  { id: 9, title: "Diagnostics reports for AUDI orders", order: "110117-1-AUDI / 110876-1-AUDI", serial: "PF5SPE2K / PF5SS9VA", category: "device", status: "waiting_zones", desc: "Need diagnostics reports for two AUDI serials", nextStep: "Zones to send reports", whatWasSaid: "", comments: [], linkedIds: [] },
  { id: 10, title: "International order labels", order: "115202-1-SERV / 115337-1-TREA", serial: "", category: "shipping", status: "watchlist", desc: "Labels created for international orders - monitoring", nextStep: "Monitor shipment", whatWasSaid: "", comments: [], linkedIds: [] },
  { id: 11, title: "Asset tag holding fee clarification", order: "", serial: "", category: "other", status: "watchlist", desc: "Confirm: no fee if clients hold asset tags without using them?", nextStep: "Confirm with Zones", whatWasSaid: "", comments: [], linkedIds: [] },
  { id: 12, title: "Repair order not mapping to portal", order: "110187-1-EPIC", serial: "", category: "portal", status: "active", desc: "Repair order not mapping correctly - retrieval overrode the repair in allwhere portal.", nextStep: "Zones/allwhere engineering to fix mapping logic", whatWasSaid: "Retrieval overrode the repair", comments: [], linkedIds: [] },
];

const FR_ITEMS = [
  { id: 101, title: "Bulk document upload", status: "submitted", desc: "Bulk document upload not working or unavailable. Significant time waste.", requestedDate: now - 5 * day, comments: [{ text: "This would save hours per week", ts: now - 3 * day, author: "Me" }] },
  { id: 102, title: "Self-service COD mass export", status: "under_review", desc: "Need ability to mass export CODs for recycle orders. Email automation to ITAD@allwhere.co", requestedDate: now - 7 * day, comments: [] },
  { id: 103, title: "Order notes auto-push to RTSes", status: "submitted", desc: "RTS team not receiving order notes proactively. Need automated push.", requestedDate: now - 6 * day, comments: [] },
  { id: 104, title: "Tracking integration for Bulks & S2A", status: "planned", desc: "Easy-to-use tracking for peripherals and Ship-to-allwhere within the portal instead of spreadsheets.", requestedDate: now - 14 * day, comments: [] },
];

const PG_ITEMS = [
  { id: 201, title: "Move Bulks & S2A off spreadsheet", status: "evaluating", desc: "Currently tracking Bulks and Ship-to-allwhere on a manual spreadsheet. Need to migrate to a system solution.", impact: "Reduces manual work, fewer errors, better visibility", milestones: [{ text: "Identify system requirements", done: true }, { text: "Zones proposes solution", done: false }, { text: "Test new workflow", done: false }, { text: "Migrate off spreadsheet", done: false }], comments: [{ text: "Requirements discussed on call", ts: now - 7 * day, author: "Me" }] },
  { id: 202, title: "COD receiving workflow for recycle orders", status: "identified", desc: "No interim solution for receiving CODs for recycle orders. Need all historical CODs backfilled + ongoing process.", impact: "Compliance, audit trail, client trust", milestones: [{ text: "Define interim COD workflow", done: false }, { text: "Backfill all historical CODs", done: false }, { text: "Build self-service export", done: false }, { text: "Email automation to ITAD@allwhere.co", done: false }], comments: [] },
  { id: 203, title: "RTS order notes communication gap", status: "identified", desc: "RTSes not getting order notes proactively. Creates delays and confusion.", impact: "Faster turnaround, fewer escalations", milestones: [{ text: "Identify why notes aren't flowing", done: false }, { text: "Implement fix", done: false }, { text: "Verify RTS receives notes", done: false }], comments: [] },
  { id: 204, title: "Shipping label QA process", status: "evaluating", desc: "Multiple incidents of wrong labels, missing signatures. Need a QA step before labels are applied.", impact: "Fewer lost/stolen packages, fewer RCAs", milestones: [{ text: "Document current label process", done: true }, { text: "Identify failure points", done: true }, { text: "Propose QA checklist", done: false }, { text: "Implement and train", done: false }], comments: [] },
];

let nid = 300;

function Badge({ color, bg, children, small }) {
  return <span style={{ background: bg, color, padding: small ? "1px 7px" : "2px 10px", borderRadius: 999, fontSize: small ? 11 : 12, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", style, small }) {
  const s = {
    primary: { background: BG_DARK, color: WHITE, border: "none" },
    yellow: { background: YELLOW, color: BG_DARK, border: "none" },
    secondary: { background: WHITE, color: TEXT, border: "1px solid " + BORDER },
    danger: { background: "#fce4e4", color: "#8b2020", border: "1px solid #f5c4c4" },
  };
  return <button onClick={onClick} style={{ padding: small ? "4px 12px" : "8px 16px", borderRadius: 8, fontSize: small ? 12 : 13, fontWeight: 600, cursor: "pointer", ...s[variant], ...style }}>{children}</button>;
}

function Sel({ value, onChange, options, style }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ padding: "7px 10px", borderRadius: 8, border: "1px solid " + BORDER, fontSize: 13, background: WHITE, cursor: "pointer", color: TEXT, ...style }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: WHITE, borderRadius: 16, padding: 24, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "auto", boxShadow: "0 24px 48px rgba(0,0,0,.2)" }}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: TEXT_MID, textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = { padding: "8px 12px", borderRadius: 8, border: "1px solid " + BORDER, fontSize: 13, width: "100%", boxSizing: "border-box", color: TEXT };

export default function Dashboard() {
  const [mainTab, setMainTab] = useState("calls");
  const [callItems, setCallItems] = useState(CALL_ITEMS);
  const [frItems, setFrItems] = useState(FR_ITEMS);
  const [pgItems, setPgItems] = useState(PG_ITEMS);
  const [detail, setDetail] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [nc, setNc] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [callCat, setCallCat] = useState("all");
  const [callStat, setCallStat] = useState("all");
  const [frStat, setFrStat] = useState("all");
  const [pgStat, setPgStat] = useState("all");

  const filteredCalls = useMemo(() => {
    let r = [...callItems];
    if (callCat !== "all") r = r.filter(i => i.category === callCat);
    if (callStat !== "all") r = r.filter(i => i.status === callStat);
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(i => [i.title, i.order, i.serial, i.desc, i.nextStep].some(f => f && f.toLowerCase().includes(q))); }
    return r;
  }, [callItems, callCat, callStat, search]);

  const filteredFR = useMemo(() => {
    let r = [...frItems];
    if (frStat !== "all") r = r.filter(i => i.status === frStat);
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(i => [i.title, i.desc].some(f => f && f.toLowerCase().includes(q))); }
    return r;
  }, [frItems, frStat, search]);

  const filteredPG = useMemo(() => {
    let r = [...pgItems];
    if (pgStat !== "all") r = r.filter(i => i.status === pgStat);
    if (search.trim()) { const q = search.toLowerCase(); r = r.filter(i => [i.title, i.desc].some(f => f && f.toLowerCase().includes(q))); }
    return r;
  }, [pgItems, pgStat, search]);

  const openDetail = (item, type) => { setDetail(item); setDetailType(type); setNc(""); };
  const updCall = (id, u) => { setCallItems(p => p.map(i => i.id === id ? { ...i, ...u } : i)); if (detail && detail.id === id) setDetail(prev => ({ ...prev, ...u })); };
  const updFR = (id, u) => { setFrItems(p => p.map(i => i.id === id ? { ...i, ...u } : i)); if (detail && detail.id === id) setDetail(prev => ({ ...prev, ...u })); };
  const updPG = (id, u) => { setPgItems(p => p.map(i => i.id === id ? { ...i, ...u } : i)); if (detail && detail.id === id) setDetail(prev => ({ ...prev, ...u })); };

  const delItem = () => {
    if (!detail) return;
    if (detailType === "call") setCallItems(p => p.filter(i => i.id !== detail.id));
    if (detailType === "fr") setFrItems(p => p.filter(i => i.id !== detail.id));
    if (detailType === "pg") setPgItems(p => p.filter(i => i.id !== detail.id));
    setDetail(null);
  };

  const addComment = () => {
    if (!nc.trim() || !detail) return;
    var c = { text: nc.trim(), ts: Date.now(), author: "Me" };
    var updated = (detail.comments || []).concat([c]);
    if (detailType === "call") updCall(detail.id, { comments: updated });
    if (detailType === "fr") updFR(detail.id, { comments: updated });
    if (detailType === "pg") updPG(detail.id, { comments: updated });
    setDetail(prev => ({ ...prev, comments: updated }));
    setNc("");
  };

  const toggleMilestone = (idx) => {
    if (detailType !== "pg" || !detail || !detail.milestones) return;
    var ms = detail.milestones.map((m, i) => i === idx ? { ...m, done: !m.done } : m);
    updPG(detail.id, { milestones: ms });
    setDetail(prev => ({ ...prev, milestones: ms }));
  };

  const [callForm, setCallForm] = useState({ title: "", order: "", serial: "", category: "shipping", status: "active", desc: "", nextStep: "", whatWasSaid: "" });
  const [frForm, setFrForm] = useState({ title: "", status: "submitted", desc: "" });
  const [pgForm, setPgForm] = useState({ title: "", status: "identified", desc: "", impact: "" });

  const addCallItem = () => { if (!callForm.title.trim()) return; setCallItems(p => p.concat([{ ...callForm, id: ++nid, comments: [], linkedIds: [] }])); setCallForm({ title: "", order: "", serial: "", category: "shipping", status: "active", desc: "", nextStep: "", whatWasSaid: "" }); setShowAdd(false); };
  const addFRItem = () => { if (!frForm.title.trim()) return; setFrItems(p => p.concat([{ ...frForm, id: ++nid, requestedDate: Date.now(), comments: [] }])); setFrForm({ title: "", status: "submitted", desc: "" }); setShowAdd(false); };
  const addPGItem = () => { if (!pgForm.title.trim()) return; setPgItems(p => p.concat([{ ...pgForm, id: ++nid, milestones: [{ text: "Identify root cause", done: false }, { text: "Propose solution", done: false }, { text: "Implement", done: false }, { text: "Verify & close", done: false }], comments: [] }])); setPgForm({ title: "", status: "identified", desc: "", impact: "" }); setShowAdd(false); };

  var cat = function(id) { return CALL_CATEGORIES.find(c => c.id === id) || CALL_CATEGORIES[4]; };
  var callStFn = function(id) { return CALL_STATUSES.find(s => s.id === id) || CALL_STATUSES[0]; };
  var frStFn = function(id) { return FR_STATUSES.find(s => s.id === id) || FR_STATUSES[0]; };
  var pgStFn = function(id) { return PG_STATUSES.find(s => s.id === id) || PG_STATUSES[0]; };
  var getLinked = function(item) { return callItems.filter(i => item.linkedIds && item.linkedIds.includes(i.id)); };

  var TABS = [
    { id: "calls", label: "\u{1F4CB} Call Priority List", count: callItems.filter(i => i.status !== "closed").length },
    { id: "features", label: "\u2728 Feature Requests", count: frItems.filter(i => i.status !== "shipped" && i.status !== "declined").length },
    { id: "process", label: "\u2699\uFE0F Process Gaps / Improvements", count: pgItems.filter(i => i.status !== "implemented").length },
  ];

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: BG_ALT, minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: BG_DARK, borderRadius: 16, padding: "22px 28px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: YELLOW }}>allwhere<span style={{ color: WHITE }}>/Zones</span> <span style={{ color: WHITE, fontWeight: 400 }}>ASM Dashboard</span></h1>
            <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: 13 }}>Track call items, feature requests, and process improvements</p>
          </div>
          <Btn variant="yellow" onClick={() => setShowAdd(true)}>+ Add Item</Btn>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
          {TABS.map(t => (
            <div key={t.id} onClick={() => setMainTab(t.id)} style={{ background: mainTab === t.id ? BG_DARK : WHITE, borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,.08)", cursor: "pointer", transition: "all .15s", border: mainTab === t.id ? "2px solid " + YELLOW : "2px solid transparent" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: mainTab === t.id ? YELLOW : TEXT_MID }}>{t.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: mainTab === t.id ? WHITE : TEXT }}>{t.count}</div>
              <div style={{ fontSize: 11, color: mainTab === t.id ? "#888" : TEXT_LIGHT, marginTop: 2 }}>open items</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 2, marginBottom: 16, borderBottom: "2px solid " + BORDER }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)} style={{ padding: "10px 20px", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", background: "transparent", color: mainTab === t.id ? BG_DARK : TEXT_LIGHT, borderBottom: mainTab === t.id ? "3px solid " + YELLOW : "3px solid transparent", marginBottom: -2, transition: "all .15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 14 }}>
          <input placeholder="Search across all items..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, maxWidth: 400, marginBottom: 0, background: WHITE }} />
        </div>

        {mainTab === "calls" && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
              <Sel value={callCat} onChange={setCallCat} options={[{ value: "all", label: "All Categories" }].concat(CALL_CATEGORIES.map(c => ({ value: c.id, label: c.icon + " " + c.label })))} />
              <Sel value={callStat} onChange={setCallStat} options={[{ value: "all", label: "All Statuses" }].concat(CALL_STATUSES.map(s => ({ value: s.id, label: s.label })))} />
              <span style={{ fontSize: 12, color: TEXT_LIGHT, marginLeft: "auto" }}>{filteredCalls.length} item{filteredCalls.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ background: WHITE, borderRadius: 14, boxShadow: "0 1px 3px rgba(0,0,0,.06)", overflow: "hidden", border: "1px solid " + BORDER }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: BG_DARK }}>
                      {["Item", "Order #", "Category", "Status", "Next Step", "\u{1F517}"].map(h => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: YELLOW, textTransform: "uppercase", letterSpacing: ".5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCalls.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 36, color: TEXT_LIGHT }}>No items match</td></tr>}
                    {filteredCalls.map(function(item, idx) {
                      var c = cat(item.category), st = callStFn(item.status);
                      return (
                        <tr key={item.id} onClick={() => openDetail(item, "call")} style={{ cursor: "pointer", borderBottom: "1px solid " + BORDER, background: idx % 2 === 0 ? WHITE : BG_ALT }} onMouseEnter={e => { e.currentTarget.style.background = YELLOW_LIGHT; }} onMouseLeave={e => { e.currentTarget.style.background = idx % 2 === 0 ? WHITE : BG_ALT; }}>
                          <td style={{ padding: "12px", maxWidth: 260 }}>
                            <div style={{ fontWeight: 600, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                            {item.serial && <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 1 }}>SN: {item.serial}</div>}
                          </td>
                          <td style={{ padding: "12px", fontSize: 12, color: TEXT_MID, fontFamily: "monospace", maxWidth: 150 }}><div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.order || "\u2014"}</div></td>
                          <td style={{ padding: "12px" }}><Badge color={c.color} bg={c.bg} small>{c.icon} {c.label}</Badge></td>
                          <td style={{ padding: "12px" }}><Badge color={st.color} bg={st.bg}>{st.label}</Badge></td>
                          <td style={{ padding: "12px", fontSize: 12, color: TEXT_MID, maxWidth: 200 }}><div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nextStep || "\u2014"}</div></td>
                          <td style={{ padding: "12px", color: item.linkedIds && item.linkedIds.length ? BG_DARK : "#ddd", fontWeight: 700 }}>{item.linkedIds ? item.linkedIds.length : 0}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {mainTab === "features" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
              <Sel value={frStat} onChange={setFrStat} options={[{ value: "all", label: "All Statuses" }].concat(FR_STATUSES.map(s => ({ value: s.id, label: s.label })))} />
              <span style={{ fontSize: 12, color: TEXT_LIGHT, marginLeft: "auto" }}>{filteredFR.length} request{filteredFR.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredFR.length === 0 && <div style={{ background: WHITE, borderRadius: 12, padding: 36, textAlign: "center", color: TEXT_LIGHT }}>No feature requests match</div>}
              {filteredFR.map(function(item) {
                var st = frStFn(item.status);
                return (
                  <div key={item.id} onClick={() => openDetail(item, "fr")} style={{ background: WHITE, borderRadius: 12, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", cursor: "pointer", border: "1px solid " + BORDER, borderLeftWidth: 4, borderLeftColor: YELLOW }} onMouseEnter={e => { e.currentTarget.style.background = YELLOW_LIGHT; }} onMouseLeave={e => { e.currentTarget.style.background = WHITE; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: TEXT_MID, lineHeight: 1.5 }}>{item.desc}</div>
                      </div>
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                    </div>
                    {item.requestedDate && <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 8 }}>Requested {new Date(item.requestedDate).toLocaleDateString()}</div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {mainTab === "process" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
              <Sel value={pgStat} onChange={setPgStat} options={[{ value: "all", label: "All Statuses" }].concat(PG_STATUSES.map(s => ({ value: s.id, label: s.label })))} />
              <span style={{ fontSize: 12, color: TEXT_LIGHT, marginLeft: "auto" }}>{filteredPG.length} item{filteredPG.length !== 1 ? "s" : ""}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredPG.length === 0 && <div style={{ background: WHITE, borderRadius: 12, padding: 36, textAlign: "center", color: TEXT_LIGHT }}>No process items match</div>}
              {filteredPG.map(function(item) {
                var st = pgStFn(item.status);
                var ms = item.milestones || [];
                var done = ms.filter(m => m.done).length;
                var pct = ms.length > 0 ? Math.round(done / ms.length * 100) : 0;
                return (
                  <div key={item.id} onClick={() => openDetail(item, "pg")} style={{ background: WHITE, borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,.06)", cursor: "pointer", border: "1px solid " + BORDER, borderLeft: "4px solid " + YELLOW }} onMouseEnter={e => { e.currentTarget.style.background = YELLOW_LIGHT; }} onMouseLeave={e => { e.currentTarget.style.background = WHITE; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 4 }}>{item.title}</div>
                        <div style={{ fontSize: 13, color: TEXT_MID }}>{item.desc}</div>
                        {item.impact && <div style={{ fontSize: 12, color: "#7a5c00", marginTop: 4 }}>{"\u{1F4A1}"} Impact: {item.impact}</div>}
                      </div>
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                    </div>
                    {ms.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#e5e5e5", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#2d6a2e" : YELLOW, borderRadius: 3, transition: "width .3s" }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#2d6a2e" : BG_DARK }}>{pct}%</span>
                        <span style={{ fontSize: 11, color: TEXT_LIGHT }}>{done}/{ms.length}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Add Modal */}
        <Modal open={showAdd} onClose={() => setShowAdd(false)}>
          <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: TEXT }}>Add New Item</h2>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {[{ id: "calls", label: "\u{1F4CB} Call Item" }, { id: "features", label: "\u2728 Feature Request" }, { id: "process", label: "\u2699\uFE0F Process Gap" }].map(t => (
              <button key={t.id} onClick={() => setMainTab(t.id)} style={{ padding: "6px 14px", borderRadius: 8, border: mainTab === t.id ? "2px solid " + BG_DARK : "1px solid " + BORDER, background: mainTab === t.id ? YELLOW : WHITE, color: BG_DARK, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.label}</button>
            ))}
          </div>
          {mainTab === "calls" && (
            <>
              <Field label="Title *"><input value={callForm.title} onChange={e => setCallForm(p => ({ ...p, title: e.target.value }))} style={inp} placeholder="Brief issue title" /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Order #"><input value={callForm.order} onChange={e => setCallForm(p => ({ ...p, order: e.target.value }))} style={inp} placeholder="e.g. 112239-1-ACOR" /></Field>
                <Field label="Serial #"><input value={callForm.serial} onChange={e => setCallForm(p => ({ ...p, serial: e.target.value }))} style={inp} placeholder="e.g. CFNWCQNKHY" /></Field>
              </div>
              <Field label="What Was Said"><textarea value={callForm.whatWasSaid} onChange={e => setCallForm(p => ({ ...p, whatWasSaid: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} /></Field>
              <Field label="Next Step"><input value={callForm.nextStep} onChange={e => setCallForm(p => ({ ...p, nextStep: e.target.value }))} style={inp} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Category"><Sel value={callForm.category} onChange={v => setCallForm(p => ({ ...p, category: v }))} options={CALL_CATEGORIES.map(c => ({ value: c.id, label: c.icon + " " + c.label }))} style={{ width: "100%" }} /></Field>
                <Field label="Status"><Sel value={callForm.status} onChange={v => setCallForm(p => ({ ...p, status: v }))} options={CALL_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
              </div>
              <Field label="Description"><textarea value={callForm.desc} onChange={e => setCallForm(p => ({ ...p, desc: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} /></Field>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn onClick={addCallItem}>Add Call Item</Btn></div>
            </>
          )}
          {mainTab === "features" && (
            <>
              <Field label="Feature Title *"><input value={frForm.title} onChange={e => setFrForm(p => ({ ...p, title: e.target.value }))} style={inp} placeholder="What feature do you need?" /></Field>
              <Field label="Description"><textarea value={frForm.desc} onChange={e => setFrForm(p => ({ ...p, desc: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Why is this needed?" /></Field>
              <Field label="Status"><Sel value={frForm.status} onChange={v => setFrForm(p => ({ ...p, status: v }))} options={FR_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn onClick={addFRItem}>Add Feature Request</Btn></div>
            </>
          )}
          {mainTab === "process" && (
            <>
              <Field label="Process Gap Title *"><input value={pgForm.title} onChange={e => setPgForm(p => ({ ...p, title: e.target.value }))} style={inp} placeholder="What's the gap or improvement?" /></Field>
              <Field label="Description"><textarea value={pgForm.desc} onChange={e => setPgForm(p => ({ ...p, desc: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" }} /></Field>
              <Field label="Expected Impact"><input value={pgForm.impact} onChange={e => setPgForm(p => ({ ...p, impact: e.target.value }))} style={inp} placeholder="e.g. Fewer errors, faster turnaround" /></Field>
              <Field label="Status"><Sel value={pgForm.status} onChange={v => setPgForm(p => ({ ...p, status: v }))} options={PG_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn><Btn onClick={addPGItem}>Add Process Item</Btn></div>
            </>
          )}
        </Modal>

        {/* Detail Modal */}
        <Modal open={!!detail} onClose={() => setDetail(null)}>
          {detail && detailType === "call" && (function() {
            var c = cat(detail.category), st = callStFn(detail.status);
            var lk = getLinked(detail);
            var unlinkable = callItems.filter(i => i.id !== detail.id && !(detail.linkedIds && detail.linkedIds.includes(i.id)));
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TEXT }}>{detail.title}</h2>
                  <Btn variant="danger" small onClick={delItem}>Delete</Btn>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  <Badge color={c.color} bg={c.bg}>{c.icon} {c.label}</Badge>
                  <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                </div>
                {detail.order && <div style={{ fontSize: 13, marginBottom: 5 }}><strong style={{ color: TEXT_MID }}>Order:</strong> <span style={{ fontFamily: "monospace" }}>{detail.order}</span></div>}
                {detail.serial && <div style={{ fontSize: 13, marginBottom: 5 }}><strong style={{ color: TEXT_MID }}>Serial:</strong> <span style={{ fontFamily: "monospace" }}>{detail.serial}</span></div>}
                {detail.desc && <div style={{ fontSize: 13, color: TEXT_MID, marginBottom: 5, lineHeight: 1.5 }}><strong style={{ color: TEXT_MID }}>Details:</strong> {detail.desc}</div>}
                {detail.whatWasSaid && <div style={{ fontSize: 13, color: TEXT_MID, marginBottom: 5 }}><strong style={{ color: TEXT_MID }}>What Was Said:</strong> {detail.whatWasSaid}</div>}
                {detail.nextStep && <div style={{ fontSize: 13, background: YELLOW_LIGHT, borderRadius: 8, padding: "8px 12px", marginBottom: 12, border: "1px solid " + YELLOW_MED }}>{"\u23ED\uFE0F"} <strong>Next Step:</strong> {detail.nextStep}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                  <Field label="Status"><Sel value={detail.status} onChange={v => updCall(detail.id, { status: v })} options={CALL_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
                  <Field label="Category"><Sel value={detail.category} onChange={v => updCall(detail.id, { category: v })} options={CALL_CATEGORIES.map(c => ({ value: c.id, label: c.icon + " " + c.label }))} style={{ width: "100%" }} /></Field>
                </div>
                <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 12, marginBottom: 12 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: TEXT }}>{"\u{1F517}"} Linked Issues ({lk.length})</h3>
                  {lk.length === 0 && <p style={{ fontSize: 12, color: TEXT_LIGHT, margin: "0 0 6px" }}>No linked issues</p>}
                  {lk.map(l => <div key={l.id} style={{ background: BG_ALT, borderRadius: 8, padding: "6px 12px", marginBottom: 3, fontSize: 12, display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 600 }}>{l.title.slice(0, 45)}</span><Badge color={callStFn(l.status).color} bg={callStFn(l.status).bg} small>{callStFn(l.status).label}</Badge></div>)}
                  {unlinkable.length > 0 && <Sel value="" onChange={v => { if (!v) return; var tid = parseInt(v); setCallItems(p => p.map(i => { if (i.id === detail.id && !i.linkedIds.includes(tid)) return { ...i, linkedIds: i.linkedIds.concat([tid]) }; if (i.id === tid && !i.linkedIds.includes(detail.id)) return { ...i, linkedIds: i.linkedIds.concat([detail.id]) }; return i; })); setDetail(prev => ({ ...prev, linkedIds: prev.linkedIds.concat([tid]) })); }} options={[{ value: "", label: "Link another issue..." }].concat(unlinkable.map(i => ({ value: String(i.id), label: i.title.slice(0, 50) })))} style={{ width: "100%", fontSize: 12, marginTop: 6 }} />}
                </div>
                <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: TEXT }}>{"\u{1F4AC}"} Comments ({detail.comments ? detail.comments.length : 0})</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10, maxHeight: 160, overflow: "auto" }}>
                    {(!detail.comments || !detail.comments.length) && <p style={{ color: TEXT_LIGHT, fontSize: 12, margin: 0 }}>No comments yet</p>}
                    {detail.comments && detail.comments.map((cm, i) => <div key={i} style={{ background: BG_ALT, borderRadius: 8, padding: "7px 12px" }}><div style={{ fontSize: 12, color: TEXT }}>{cm.text}</div><div style={{ fontSize: 10, color: TEXT_LIGHT, marginTop: 2 }}>{cm.author} · {new Date(cm.ts).toLocaleString()}</div></div>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}><input placeholder="Add a comment..." value={nc} onChange={e => setNc(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addComment(); }} style={{ ...inp, flex: 1, marginBottom: 0 }} /><Btn small onClick={addComment}>Post</Btn></div>
                </div>
              </>
            );
          })()}

          {detail && detailType === "fr" && (function() {
            var st = frStFn(detail.status);
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TEXT }}>{detail.title}</h2>
                  <Btn variant="danger" small onClick={delItem}>Delete</Btn>
                </div>
                <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                <p style={{ fontSize: 13, color: TEXT_MID, marginTop: 12, lineHeight: 1.5 }}>{detail.desc}</p>
                {detail.requestedDate && <div style={{ fontSize: 12, color: TEXT_LIGHT, marginBottom: 14 }}>Requested {new Date(detail.requestedDate).toLocaleDateString()}</div>}
                <Field label="Status"><Sel value={detail.status} onChange={v => updFR(detail.id, { status: v })} options={FR_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
                <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: TEXT }}>{"\u{1F4AC}"} Comments ({detail.comments ? detail.comments.length : 0})</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10, maxHeight: 160, overflow: "auto" }}>
                    {(!detail.comments || !detail.comments.length) && <p style={{ color: TEXT_LIGHT, fontSize: 12, margin: 0 }}>No comments yet</p>}
                    {detail.comments && detail.comments.map((cm, i) => <div key={i} style={{ background: BG_ALT, borderRadius: 8, padding: "7px 12px" }}><div style={{ fontSize: 12, color: TEXT }}>{cm.text}</div><div style={{ fontSize: 10, color: TEXT_LIGHT, marginTop: 2 }}>{cm.author} · {new Date(cm.ts).toLocaleString()}</div></div>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}><input placeholder="Add a comment..." value={nc} onChange={e => setNc(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addComment(); }} style={{ ...inp, flex: 1, marginBottom: 0 }} /><Btn small onClick={addComment}>Post</Btn></div>
                </div>
              </>
            );
          })()}

          {detail && detailType === "pg" && (function() {
            var st = pgStFn(detail.status);
            var ms = detail.milestones || [];
            var done = ms.filter(m => m.done).length;
            var pct = ms.length > 0 ? Math.round(done / ms.length * 100) : 0;
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: TEXT }}>{detail.title}</h2>
                  <Btn variant="danger" small onClick={delItem}>Delete</Btn>
                </div>
                <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                <p style={{ fontSize: 13, color: TEXT_MID, marginTop: 12, lineHeight: 1.5 }}>{detail.desc}</p>
                {detail.impact && <div style={{ fontSize: 13, color: "#7a5c00", marginBottom: 14 }}>{"\u{1F4A1}"} <strong>Expected Impact:</strong> {detail.impact}</div>}
                <Field label="Status"><Sel value={detail.status} onChange={v => updPG(detail.id, { status: v })} options={PG_STATUSES.map(s => ({ value: s.id, label: s.label }))} style={{ width: "100%" }} /></Field>
                {ms.length > 0 && (
                  <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 12, marginBottom: 12 }}>
                    <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: TEXT }}>{"\u{1F4CA}"} Milestones ({done}/{ms.length})</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#e5e5e5", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: pct + "%", height: "100%", background: pct === 100 ? "#2d6a2e" : YELLOW, borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? "#2d6a2e" : BG_DARK }}>{pct}%</span>
                    </div>
                    {ms.map((m, i) => (
                      <div key={i} onClick={e => { e.stopPropagation(); toggleMilestone(i); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", borderRadius: 6, background: m.done ? "#e6f4e6" : BG_ALT, cursor: "pointer", fontSize: 13, marginBottom: 3, border: "1px solid " + (m.done ? "#c3e6c3" : BORDER) }}>
                        <span>{m.done ? "\u2705" : "\u2B1C"}</span>
                        <span style={{ color: m.done ? "#2d6a2e" : TEXT, textDecoration: m.done ? "line-through" : "none" }}>{m.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: TEXT }}>{"\u{1F4AC}"} Comments ({detail.comments ? detail.comments.length : 0})</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10, maxHeight: 160, overflow: "auto" }}>
                    {(!detail.comments || !detail.comments.length) && <p style={{ color: TEXT_LIGHT, fontSize: 12, margin: 0 }}>No comments yet</p>}
                    {detail.comments && detail.comments.map((cm, i) => <div key={i} style={{ background: BG_ALT, borderRadius: 8, padding: "7px 12px" }}><div style={{ fontSize: 12, color: TEXT }}>{cm.text}</div><div style={{ fontSize: 10, color: TEXT_LIGHT, marginTop: 2 }}>{cm.author} · {new Date(cm.ts).toLocaleString()}</div></div>)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}><input placeholder="Add a comment..." value={nc} onChange={e => setNc(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addComment(); }} style={{ ...inp, flex: 1, marginBottom: 0 }} /><Btn small onClick={addComment}>Post</Btn></div>
                </div>
              </>
            );
          })()}
        </Modal>
      </div>
    </div>
  );
}
