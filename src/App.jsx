import { useState, useEffect, useRef } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" }
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }

  .app {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e8e8f0;
    font-family: 'Space Grotesk', sans-serif;
    padding: 24px;
  }

  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }

  .logo-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: #00e5a0; box-shadow: 0 0 12px #00e5a088;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 12px #00e5a088; }
    50% { opacity: 0.6; box-shadow: 0 0 24px #00e5a0cc; }
  }

  .app-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: #fff; }
  .app-sub {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: #00e5a0; letter-spacing: 1px; text-transform: uppercase; margin-left: auto;
  }

  .coin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .coin-tab {
    background: #13131f; border: 1px solid #1e1e30; border-radius: 8px;
    padding: 8px 14px; cursor: pointer; font-family: 'JetBrains Mono', monospace;
    font-size: 13px; font-weight: 600; color: #888; transition: all 0.2s;
  }
  .coin-tab:hover { border-color: #00e5a044; color: #ccc; }
  .coin-tab.active { background: #001a10; border-color: #00e5a0; color: #00e5a0; }

  .price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; }
  .price-main {
    font-family: 'JetBrains Mono', monospace; font-size: 36px;
    font-weight: 600; color: #fff; letter-spacing: -1px;
  }
  .price-change {
    font-family: 'JetBrains Mono', monospace; font-size: 14px;
    font-weight: 600; padding: 3px 10px; border-radius: 6px;
  }
  .price-change.up { background: #002a18; color: #00e5a0; }
  .price-change.down { background: #2a0010; color: #ff4d72; }

  .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .metric-card { background: #13131f; border: 1px solid #1e1e30; border-radius: 10px; padding: 14px; }
  .metric-label {
    font-size: 11px; color: #555; text-transform: uppercase;
    letter-spacing: 1px; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace;
  }
  .metric-value { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; color: #d0d0e0; }

  .chart-wrapper { background: #13131f; border: 1px solid #1e1e30; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
  .chart-title {
    font-size: 12px; color: #555; text-transform: uppercase;
    letter-spacing: 1px; font-family: 'JetBrains Mono', monospace; margin-bottom: 14px;
  }
  canvas { width: 100% !important; }

  .ai-panel { background: #0d1a12; border: 1px solid #00e5a033; border-radius: 12px; padding: 20px; }
  .ai-panel-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .ai-badge {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600;
    color: #00e5a0; background: #002a18; border: 1px solid #00e5a044;
    padding: 3px 8px; border-radius: 4px; letter-spacing: 1px;
  }
  .ai-panel-title { font-size: 14px; font-weight: 600; color: #e8e8f0; }
  .ai-prompt-row { display: flex; gap: 10px; margin-bottom: 14px; }
  .ai-input {
    flex: 1; background: #0a0a0f; border: 1px solid #1e1e30; border-radius: 8px;
    padding: 10px 14px; color: #e8e8f0; font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; outline: none; transition: border-color 0.2s;
  }
  .ai-input:focus { border-color: #00e5a055; }
  .ai-input::placeholder { color: #333; }
  .ai-btn {
    background: #00e5a0; color: #0a0a0f; border: none; border-radius: 8px;
    padding: 10px 18px; font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; white-space: nowrap;
  }
  .ai-btn:hover { opacity: 0.85; }
  .ai-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .quick-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .quick-btn {
    background: #0a0a0f; border: 1px solid #1e1e30; border-radius: 6px;
    padding: 6px 12px; color: #666; font-size: 12px; cursor: pointer;
    font-family: 'JetBrains Mono', monospace; transition: all 0.2s;
  }
  .quick-btn:hover { border-color: #00e5a044; color: #00e5a0; }
  .ai-response {
    background: #0a0a0f; border: 1px solid #1e1e30; border-radius: 8px;
    padding: 14px; font-size: 14px; line-height: 1.7; color: #b0b0c0; min-height: 80px;
  }
  .ai-response.loading { display: flex; align-items: center; gap: 8px; color: #555; }
  .typing-dots span {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: #00e5a0; animation: blink 1.2s infinite; margin: 0 1px;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
  .sentiment-bar { display: flex; align-items: center; gap: 10px; margin-top: 12px; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
  .sentiment-track { flex: 1; height: 4px; background: #1e1e30; border-radius: 2px; overflow: hidden; }
  .sentiment-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }
  .error-msg { color: #ff4d72; font-size: 12px; font-family: 'JetBrains Mono', monospace; padding-top: 4px; }
`;

function MiniChart({ prices, positive }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !prices || prices.length < 2) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth * 2;
    const H = canvas.offsetHeight * 2;
    canvas.width = W;
    canvas.height = H;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    ctx.clearRect(0, 0, W, H);
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, positive ? "#00e5a022" : "#ff4d7222");
    gradient.addColorStop(1, "transparent");
    const pts = prices.map((p, i) => ({
      x: (i / (prices.length - 1)) * W,
      y: H - ((p - min) / range) * (H - 10) - 5,
    }));
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach((pt) => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.beginPath();
    pts.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
    ctx.strokeStyle = positive ? "#00e5a0" : "#ff4d72";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
  }, [prices, positive]);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "80px", display: "block" }} />;
}

const QUICK_QUESTIONS = [
  "Should I buy now?",
  "Key support levels?",
  "Bearish or bullish?",
  "What's the trend?",
];

export default function App() {
  const [selected, setSelected] = useState(COINS[0]);
  const [marketData, setMarketData] = useState({});
  const [prices, setPrices] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [capital, setCapital] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const ids = COINS.map((c) => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d`
        );
        const data = await res.json();
        const map = {};
        data.forEach((d) => (map[d.id] = d));
        setMarketData(map);
        const coin = map[selected.id];
        if (coin?.sparkline_in_7d?.price) setPrices(coin.sparkline_in_7d.price);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const coin = marketData[selected.id];
    if (coin?.sparkline_in_7d?.price) setPrices(coin.sparkline_in_7d.price);
  }, [selected, marketData]);

  const coin = marketData[selected.id];
  const change24h = coin?.price_change_percentage_24h ?? 0;
  const isUp = change24h >= 0;

  function fmt(n) {
    if (!n && n !== 0) return "—";
    if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
    return "$" + n.toLocaleString();
  }

  async function analyzeWithAI(q) {
    if (!q.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    setError("");
    const coinInfo = coin
      ? `${selected.name} (${selected.symbol}): Price $${coin.current_price?.toLocaleString()}, 24h change ${change24h?.toFixed(2)}%, 7d change ${coin.price_change_percentage_7d_in_currency?.toFixed(2)}%, Market cap ${fmt(coin.market_cap)}, 24h High $${coin.high_24h?.toLocaleString()}, 24h Low $${coin.low_24h?.toLocaleString()}, Volume $${fmt(coin.total_volume)}.`
      : `${selected.name} (${selected.symbol})`;
    const prompt = `You are a sharp crypto market analyst. Here's live market data:\n${coinInfo}\n\nUser question: ${q}\n\nGive a concise, data-driven insight in 3-4 sentences. Be specific to the numbers. Mention key levels or signals if relevant. Don't add disclaimers.`;
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + import.meta.env.VITE_GROQ_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || JSON.stringify(data);
      setAiResponse(text || "No response received.");
    } catch (e) {
      setError("Failed to reach AI. Check your connection.");
    }
    setAiLoading(false);
  }

  const change7d = coin?.price_change_percentage_7d_in_currency ?? 0;
  const rawSentiment = 50 + change24h * 2 + change7d * 0.5;
  const sentiment = Math.min(100, Math.max(0, rawSentiment));
  const sentimentLabel = sentiment >= 65 ? "Bullish" : sentiment <= 35 ? "Bearish" : "Neutral";
  const sentimentColor = sentiment >= 65 ? "#00e5a0" : sentiment <= 35 ? "#ff4d72" : "#f0c040";

  // Trade Calculator
  const calcResults = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return null;
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    const cap = parseFloat(capital) || 1000;
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const rrRatio = (reward / risk).toFixed(2);
    const posSize = (cap * 0.01 / risk).toFixed(4);
    const isLong = tp > entry;
    const slPct = (risk / entry * 100).toFixed(2);
    const tpPct = (reward / entry * 100).toFixed(2);
    const suggestedSL = isLong ? (entry * 0.97).toFixed(2) : (entry * 1.03).toFixed(2);
    const suggestedTP = isLong ? (entry * 1.06).toFixed(2) : (entry * 0.94).toFixed(2);
    const suggestedEntry = coin
      ? isLong ? (coin.low_24h * 1.005).toFixed(2) : (coin.high_24h * 0.995).toFixed(2)
      : entry.toFixed(2);
    const entrySuggestion = isLong
      ? entry <= coin?.low_24h * 1.01
        ? "Good entry near 24h low support."
        : entry >= coin?.high_24h * 0.99
        ? "Risky — near 24h high. Wait for pullback."
        : "Moderate entry. Consider waiting near support."
      : entry >= coin?.high_24h * 0.99
      ? "Good short entry near 24h high resistance."
      : "Moderate short. Enter closer to resistance.";
    const slSuggestion = parseFloat(slPct) < 1
      ? "Too tight (" + slPct + "%) — may get stopped by noise."
      : parseFloat(slPct) > 5
      ? "Too wide (" + slPct + "%) — reduces position size."
      : "Good distance (" + slPct + "%) — reasonable risk.";
    const tpSuggestion = parseFloat(rrRatio) >= 2
      ? "Excellent RR 1:" + rrRatio + " — above 1:2 minimum."
      : parseFloat(rrRatio) >= 1.5
      ? "Acceptable RR 1:" + rrRatio + ". Aim for 1:2 or higher."
      : "Poor RR 1:" + rrRatio + " — move TP further or SL closer.";
    const rrColor = parseFloat(rrRatio) >= 2 ? "#00e5a0" : parseFloat(rrRatio) >= 1.5 ? "#f0c040" : "#ff4d72";
    return { entry, sl, tp, cap, risk, reward, rrRatio, posSize, slPct, tpPct,
      suggestedSL, suggestedTP, suggestedEntry, entrySuggestion, slSuggestion,
      tpSuggestion, rrColor };
  };

  const calc = calcResults();

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="logo-dot" />
          <div className="app-title">CryptoMind</div>
          <div className="app-sub">AI Analyst · Live</div>
        </div>

        {/* Coin Tabs */}
        <div className="coin-tabs">
          {COINS.map((c) => (
            <button
              key={c.id}
              className={`coin-tab ${selected.id === c.id ? "active" : ""}`}
              onClick={() => { setSelected(c); setAiResponse(""); setQuestion(""); }}
            >
              {c.symbol}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="price-row">
          <div className="price-main">
            {coin ? "$" + coin.current_price?.toLocaleString() : "Loading…"}
          </div>
          {coin && (
            <div className={`price-change ${isUp ? "up" : "down"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% 24h
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Mkt Cap</div>
            <div className="metric-value">{fmt(coin?.market_cap)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">24h Vol</div>
            <div className="metric-value">{fmt(coin?.total_volume)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">7d Change</div>
            <div className="metric-value" style={{ color: change7d >= 0 ? "#00e5a0" : "#ff4d72" }}>
              {change7d >= 0 ? "+" : ""}{change7d?.toFixed(2)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">24h High</div>
            <div className="metric-value">{coin ? "$" + coin.high_24h?.toLocaleString() : "—"}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">24h Low</div>
            <div className="metric-value">{coin ? "$" + coin.low_24h?.toLocaleString() : "—"}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Sentiment</div>
            <div className="metric-value" style={{ color: sentimentColor }}>{sentimentLabel}</div>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div className="chart-wrapper" style={{ padding: "14px 20px" }}>
          <div className="chart-title">Market Sentiment (7d trend-weighted)</div>
          <div className="sentiment-bar">
            <span style={{ color: "#ff4d72", fontSize: 11 }}>Bear</span>
            <div className="sentiment-track">
              <div className="sentiment-fill" style={{ width: sentiment + "%", background: sentimentColor }} />
            </div>
            <span style={{ color: "#00e5a0", fontSize: 11 }}>Bull</span>
            <span style={{ color: sentimentColor, fontWeight: 600 }}>{sentiment.toFixed(0)}</span>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-wrapper">
          <div className="chart-title">7-day price · {selected.symbol}/USD</div>
          {prices.length > 0 ? (
            <MiniChart prices={prices} positive={isUp} />
          ) : (
            <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 13 }}>
              Loading chart…
            </div>
          )}
        </div>

        {/* AI Panel */}
        <div className="ai-panel">
          <div className="ai-panel-header">
            <div className="ai-badge">AI</div>
            <div className="ai-panel-title">Ask about {selected.name}</div>
          </div>
          <div className="quick-btns">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} className="quick-btn"
                onClick={() => { setQuestion(q); analyzeWithAI(q); }}>
                {q}
              </button>
            ))}
          </div>
          <div className="ai-prompt-row">
            <input
              className="ai-input"
              placeholder={`Ask anything about ${selected.symbol}…`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeWithAI(question)}
            />
            <button className="ai-btn" disabled={aiLoading || !question.trim()}
              onClick={() => analyzeWithAI(question)}>
              {aiLoading ? "…" : "Analyze"}
            </button>
          </div>
          {aiLoading ? (
            <div className="ai-response loading">
              <div className="typing-dots"><span /><span /><span /></div>
              <span>Analyzing market data…</span>
            </div>
          ) : aiResponse ? (
            <div className="ai-response">{aiResponse}</div>
          ) : (
            <div className="ai-response" style={{ color: "#333" }}>
              Ask a question or tap a quick option above to get AI-powered insights.
            </div>
          )}
          {error && <div className="error-msg">{error}</div>}
        </div>

        {/* Trade Calculator */}
        <div style={{
          background: "#13131f", border: "1px solid #1e1e30",
          borderRadius: "12px", padding: "20px", marginTop: "20px"
        }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: "600",
              color: "#f0c040", background: "#2a2000", border: "1px solid #f0c04044",
              padding: "3px 8px", borderRadius: "4px", letterSpacing: "1px"
            }}>CALC</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#e8e8f0" }}>
              Trade Calculator — {selected.symbol}
            </div>
          </div>

          {/* Input Row — 3 fields side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "12px" }}>
            {[
              { label: "Entry Price ($)", value: entryPrice, setter: setEntryPrice,
                placeholder: coin ? coin.current_price?.toLocaleString() : "0",
                border: "#1e1e30", color: "#e8e8f0" },
              { label: "Stop Loss ($)", value: stopLoss, setter: setStopLoss,
                placeholder: "0", border: "#ff4d7244", color: "#ff4d72" },
              { label: "Take Profit ($)", value: takeProfit, setter: setTakeProfit,
                placeholder: "0", border: "#00e5a044", color: "#00e5a0" },
            ].map((f) => (
              <div key={f.label}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555",
                  textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px"
                }}>{f.label}</div>
                <input type="number" placeholder={f.placeholder} value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  style={{
                    width: "100%", background: "#0a0a0f", border: "1px solid " + f.border,
                    borderRadius: "8px", padding: "10px", color: f.color,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", outline: "none"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Capital */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555",
              textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px"
            }}>Your Capital ($)</div>
            <input type="number" placeholder="1000" value={capital}
              onChange={(e) => setCapital(e.target.value)}
              style={{
                width: "100%", background: "#0a0a0f", border: "1px solid #1e1e30",
                borderRadius: "8px", padding: "10px", color: "#e8e8f0",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", outline: "none"
              }}
            />
          </div>

          {/* Results — only show when all 3 filled */}
          {calc && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

              {/* LEFT — Trade Results (vertical) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                  color: "#555", textTransform: "uppercase", letterSpacing: "1px"
                }}>Trade Results</div>

                {[
                  { label: "Risk Per Unit", value: "$" + calc.risk.toFixed(2),
                    sub: calc.slPct + "% from entry", color: "#ff4d72" },
                  { label: "Reward Per Unit", value: "$" + calc.reward.toFixed(2),
                    sub: calc.tpPct + "% from entry", color: "#00e5a0" },
                  { label: "Risk / Reward", value: "1 : " + calc.rrRatio,
                    sub: parseFloat(calc.rrRatio) >= 2 ? "Good trade" : parseFloat(calc.rrRatio) >= 1.5 ? "Acceptable" : "Poor trade",
                    color: calc.rrColor },
                  { label: "Position Size", value: calc.posSize + " " + selected.symbol,
                    sub: "1% risk of $" + calc.cap, color: "#e8e8f0" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#0a0a0f", border: "1px solid #1e1e30",
                    borderLeft: "3px solid " + item.color, borderRadius: "8px", padding: "12px",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                        color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px"
                      }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: "#444" }}>{item.sub}</div>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "16px",
                      fontWeight: "700", color: item.color
                    }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* RIGHT — Suggestions (vertical) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                  color: "#555", textTransform: "uppercase", letterSpacing: "1px"
                }}>Suggested Values & Analysis</div>

                {[
                  { label: "Entry Price", yourValue: "$" + calc.entry.toLocaleString(),
                    suggested: "$" + parseFloat(calc.suggestedEntry).toLocaleString(),
                    analysis: calc.entrySuggestion, border: "#888888" },
                  { label: "Stop Loss", yourValue: "$" + calc.sl.toLocaleString(),
                    suggested: "$" + parseFloat(calc.suggestedSL).toLocaleString(),
                    analysis: calc.slSuggestion, border: "#ff4d72" },
                  { label: "Take Profit", yourValue: "$" + calc.tp.toLocaleString(),
                    suggested: "$" + parseFloat(calc.suggestedTP).toLocaleString(),
                    analysis: calc.tpSuggestion, border: "#00e5a0" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "#0a0a0f",
                    border: "1px solid " + s.border + "33",
                    borderLeft: "3px solid " + s.border,
                    borderRadius: "8px", padding: "12px"
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                      color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px"
                    }}>{s.label}</div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: "#444", marginBottom: "3px" }}>Your Value</div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "13px", fontWeight: "600", color: "#e8e8f0"
                        }}>{s.yourValue}</div>
                      </div>
                      <div style={{ fontSize: "18px", color: "#444", alignSelf: "center" }}>→</div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: "#444", marginBottom: "3px" }}>Suggested</div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "13px", fontWeight: "600", color: s.border
                        }}>{s.suggested}</div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: "11px", color: "#888", lineHeight: "1.5",
                      borderTop: "1px solid #1e1e30", paddingTop: "8px"
                    }}>{s.analysis}</div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Note */}
          <div style={{
            marginTop: "12px", padding: "10px", background: "#0a0a0f", borderRadius: "8px",
            fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#444", lineHeight: "1.6"
          }}>
            * Position Size uses 1% risk rule — risks 1% of your capital per trade.
            Always use proper position sizing to protect your account.
          </div>
        </div>

      </div>
    </>
  );
}
