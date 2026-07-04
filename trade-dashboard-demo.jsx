import React, { useState, useEffect, useRef } from "react";
import { Package, TrendingUp, Ship, AlertTriangle, CheckCircle2, Clock, FileText, Anchor } from "lucide-react";

// ---- Mock data ----
const initialInventory = [
  { id: "SKU-1042", name: "Cotton Yarn 30s (Cone)", stock: 4200, unit: "kg", reorder: 1500, status: "ok" },
  { id: "SKU-2210", name: "Steel Rod 12mm", stock: 340, unit: "ton", reorder: 400, status: "low" },
  { id: "SKU-3387", name: "Palm Oil (Refined)", stock: 18500, unit: "ltr", reorder: 5000, status: "ok" },
  { id: "SKU-4456", name: "Ceramic Tile 60x60", stock: 92, unit: "box", reorder: 200, status: "critical" },
  { id: "SKU-5521", name: "PVC Resin K67", stock: 6100, unit: "kg", reorder: 2000, status: "ok" },
];

const lcRecords = [
  {
    id: "LC-2026-0714",
    buyer: "Al-Fahad Trading Co.",
    value: "$182,400",
    stage: 3,
    item: "Ceramic Tile 60x60",
  },
  {
    id: "LC-2026-0691",
    buyer: "Meridian Textiles Ltd.",
    value: "$64,900",
    stage: 5,
    item: "Cotton Yarn 30s",
  },
  {
    id: "LC-2026-0703",
    buyer: "Novak Industrial GmbH",
    value: "$310,000",
    stage: 2,
    item: "Steel Rod 12mm",
  },
];

const lcStages = ["Opened", "Docs Prepared", "Shipped", "Docs Submitted", "Bank Accepted", "Cleared"];

const salesFeedPool = [
  { buyer: "Meridian Textiles Ltd.", item: "Cotton Yarn 30s", qty: "600 kg", value: "$4,320" },
  { buyer: "Rhineland Distributors", item: "PVC Resin K67", qty: "1,200 kg", value: "$3,960" },
  { buyer: "Al-Fahad Trading Co.", item: "Ceramic Tile 60x60", qty: "40 box", value: "$5,800" },
  { buyer: "Novak Industrial GmbH", item: "Steel Rod 12mm", qty: "8 ton", value: "$11,040" },
  { buyer: "Coastal Foods Ltd.", item: "Palm Oil (Refined)", qty: "900 ltr", value: "$2,610" },
];

function statusColor(status) {
  if (status === "critical") return "#C0463C";
  if (status === "low") return "#C9973B";
  return "#3F7A6B";
}

export default function TradeDashboard() {
  const [inventory] = useState(initialInventory);
  const [feed, setFeed] = useState([]);
  const feedId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const pick = salesFeedPool[Math.floor(Math.random() * salesFeedPool.length)];
      feedId.current += 1;
      const entry = { ...pick, id: feedId.current, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
      setFeed((prev) => [entry, ...prev].slice(0, 8));
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0F1B2D", fontFamily: "'IBM Plex Sans', sans-serif", color: "#EDEAE2", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .display { font-family: 'Fraunces', serif; }
        .card { background: #16243A; border: 1px solid #263751; border-radius: 4px; }
        .feed-row { animation: slideIn 0.4s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .stage-dot { transition: all 0.3s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #3A4C6B; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #263751", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Anchor size={22} color="#C9973B" />
          <span className="display" style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "0.5px" }}>Ledger & Lading</span>
          <span className="mono" style={{ fontSize: "11px", color: "#6E82A6", marginLeft: "8px" }}>OPERATIONS DECK</span>
        </div>
        <div className="mono" style={{ fontSize: "12px", color: "#6E82A6" }}>
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
        {/* Left column: Inventory + LC */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* Inventory */}
          <div className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Package size={16} color="#C9973B" />
              <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#B8C4DB" }}>Inventory</span>
            </div>
            <div>
              {inventory.map((item) => {
                const pct = Math.min(100, Math.round((item.stock / (item.reorder * 3)) * 100));
                return (
                  <div key={item.id} style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "13.5px" }}>{item.name}</span>
                      <span className="mono" style={{ fontSize: "12px", color: statusColor(item.status) }}>
                        {item.stock.toLocaleString()} {item.unit}
                      </span>
                    </div>
                    <div style={{ height: "5px", background: "#263751", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: statusColor(item.status), borderRadius: "3px" }} />
                    </div>
                    {item.status !== "ok" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                        <AlertTriangle size={11} color={statusColor(item.status)} />
                        <span className="mono" style={{ fontSize: "10.5px", color: statusColor(item.status) }}>
                          {item.status === "critical" ? "Below reorder point — action needed" : "Approaching reorder point"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* LC Tracker */}
          <div className="card" style={{ padding: "20px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
              <FileText size={16} color="#C9973B" />
              <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#B8C4DB" }}>Letters of Credit — In Progress</span>
            </div>
            {lcRecords.map((lc) => (
              <div key={lc.id} style={{ marginBottom: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div>
                    <span className="mono" style={{ fontSize: "12.5px", color: "#C9973B" }}>{lc.id}</span>
                    <span style={{ fontSize: "13px", marginLeft: "10px" }}>{lc.buyer}</span>
                  </div>
                  <span className="mono" style={{ fontSize: "12.5px", color: "#B8C4DB" }}>{lc.value}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {lcStages.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "1px" }}>
                        <div
                          className="stage-dot"
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: i < lc.stage ? "#3F7A6B" : i === lc.stage ? "#C9973B" : "#263751",
                            border: i === lc.stage ? "2px solid #C9973B" : "none",
                            boxShadow: i === lc.stage ? "0 0 0 4px rgba(201,151,58,0.15)" : "none",
                          }}
                        />
                        <span className="mono" style={{ fontSize: "8.5px", color: "#6E82A6", marginTop: "6px", whiteSpace: "nowrap", transform: "translateX(-50%)" }}>
                          {stage}
                        </span>
                      </div>
                      {i < lcStages.length - 1 && (
                        <div style={{ flex: 1, height: "2px", background: i < lc.stage ? "#3F7A6B" : "#263751", margin: "0 2px" }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mono" style={{ fontSize: "10.5px", color: "#6E82A6", marginTop: "14px" }}>
                  Cargo: {lc.item}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Live sales */}
        <div className="card" style={{ padding: "20px", height: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <TrendingUp size={16} color="#3F7A6B" />
            <span style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "#B8C4DB" }}>Live Sales Feed</span>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3F7A6B", marginLeft: "auto", animation: "pulse 1.5s infinite" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {feed.length === 0 && (
              <div className="mono" style={{ fontSize: "12px", color: "#6E82A6", padding: "12px 0" }}>
                Waiting for next transaction…
              </div>
            )}
            {feed.map((entry) => (
              <div key={entry.id} className="feed-row" style={{ padding: "10px 0", borderBottom: "1px solid #263751" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px" }}>{entry.buyer}</span>
                  <span className="mono" style={{ fontSize: "12.5px", color: "#3F7A6B" }}>{entry.value}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span className="mono" style={{ fontSize: "10.5px", color: "#6E82A6" }}>{entry.item} · {entry.qty}</span>
                  <span className="mono" style={{ fontSize: "10.5px", color: "#6E82A6" }}>{entry.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
