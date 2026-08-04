import { useState, useEffect, useRef } from "react";

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", binance: "BTCUSDT" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", binance: "ETHUSDT" },
  { id: "solana", symbol: "SOL", name: "Solana", binance: "SOLUSDT" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", binance: "BNBUSDT" },
  { id: "ripple", symbol: "XRP", name: "XRP", binance: "XRPUSDT" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", binance: "DOGEUSDT" },
  { id: "cardano", symbol: "ADA", name: "Cardano", binance: "ADAUSDT" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", binance: "AVAXUSDT" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", binance: "LINKUSDT" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", binance: "DOTUSDT" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", binance: "LTCUSDT" },
  { id: "tron", symbol: "TRX", name: "TRON", binance: "TRXUSDT" },
  { id: "matic-network", symbol: "POL", name: "Polygon", binance: "POLUSDT" },
  { id: "sui", symbol: "SUI", name: "Sui", binance: "SUIUSDT" },
  { id: "aptos", symbol: "APT", name: "Aptos", binance: "APTUSDT" },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #050508; }

  .app {
    min-height: 100vh;
    background: linear-gradient(135deg, #050508 0%, #0a0a14 50%, #050508 100%);
    color: #e8e8f0;
    font-family: 'Space Grotesk', sans-serif;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    padding: 16px 20px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    backdrop-filter: blur(10px);
  }

  .logo-wrap {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00e5a0, #00b377);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 20px #00e5a044;
    font-size: 18px;
  }

  .logo-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #00e5a0;
    box-shadow: 0 0 10px #00e5a0;
    animation: pulse 2s infinite;
    margin-left: auto;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px #00e5a088; }
    50% { opacity: 0.5; box-shadow: 0 0 20px #00e5a0cc; }
  }

  .app-title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #fff;
  }

  .app-title span {
    color: #00e5a0;
  }

  .app-sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #00e5a0;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: #00e5a011;
    border: 1px solid #00e5a033;
    padding: 3px 10px;
    border-radius: 20px;
  }

  .version-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #f0c040;
    background: #f0c04011;
    border: 1px solid #f0c04033;
    padding: 3px 8px;
    border-radius: 20px;
    letter-spacing: 1px;
  }

  .coin-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .coin-tab {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 8px 16px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    transition: all 0.2s;
    letter-spacing: 0.5px;
  }

  .coin-tab:hover {
    border-color: #00e5a044;
    color: #ccc;
    background: rgba(0,229,160,0.05);
  }

  .coin-tab.active {
    background: linear-gradient(135deg, #00e5a011, #00e5a008);
    border-color: #00e5a0;
    color: #00e5a0;
    box-shadow: 0 0 15px #00e5a022;
  }

  .price-row {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 20px;
    padding: 20px 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
  }

  .price-main {
    font-family: 'JetBrains Mono', monospace;
    font-size: 42px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -2px;
    text-shadow: 0 0 30px rgba(255,255,255,0.1);
  }

  .price-change {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 8px;
    letter-spacing: 0.5px;
  }

  .price-change.up {
    background: rgba(0,229,160,0.12);
    color: #00e5a0;
    border: 1px solid rgba(0,229,160,0.2);
  }

  .price-change.down {
    background: rgba(255,77,114,0.12);
    color: #ff4d72;
    border: 1px solid rgba(255,77,114,0.2);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .metric-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 16px;
    transition: all 0.2s;
  }

  .metric-card:hover {
    border-color: rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
  }

  .metric-label {
    font-size: 10px;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }

  .metric-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    font-weight: 600;
    color: #d0d0e0;
  }

  .chart-wrapper {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 11px;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 14px;
  }

  canvas { width: 100% !important; }

  .ai-panel {
    background: rgba(0,229,160,0.03);
    border: 1px solid rgba(0,229,160,0.12);
    border-radius: 14px;
    padding: 20px;
  }

  .ai-panel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .ai-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    color: #00e5a0;
    background: rgba(0,229,160,0.1);
    border: 1px solid rgba(0,229,160,0.3);
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 1.5px;
  }

  .ai-panel-title {
    font-size: 14px;
    font-weight: 600;
    color: #e8e8f0;
  }

  .ai-prompt-row {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
  }

  .ai-input {
    flex: 1;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 11px 16px;
    color: #e8e8f0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    outline: none;
    transition: all 0.2s;
  }

  .ai-input:focus {
    border-color: rgba(0,229,160,0.4);
    background: rgba(0,229,160,0.04);
  }

  .ai-input::placeholder { color: #2a2a3a; }

  .ai-btn {
    background: linear-gradient(135deg, #00e5a0, #00c489);
    color: #050508;
    border: none;
    border-radius: 10px;
    padding: 11px 20px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0,229,160,0.3);
  }

  .ai-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,229,160,0.4);
  }

  .ai-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .quick-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .quick-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 6px 14px;
    color: #555;
    font-size: 12px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .quick-btn:hover {
    border-color: rgba(0,229,160,0.3);
    color: #00e5a0;
    background: rgba(0,229,160,0.05);
  }

  .ai-response {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 16px;
    font-size: 14px;
    line-height: 1.8;
    color: #b0b0c0;
    min-height: 80px;
  }

  .ai-response.loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #444;
  }

  .typing-dots span {
    display: inline-block;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #00e5a0;
    animation: blink 1.2s infinite;
    margin: 0 2px;
  }

  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .sentiment-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
  }

  .sentiment-track {
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.05);
    border-radius: 3px;
    overflow: hidden;
  }

  .sentiment-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px currentColor;
  }

  .error-msg {
    color: #ff4d72;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    padding-top: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .section-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 20px;
    margin-top: 20px;
    transition: border-color 0.2s;
  }

  .section-card:hover {
    border-color: rgba(255,255,255,0.1);
  }

  .section-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    letter-spacing: 1.5px;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #e8e8f0;
  }

  @media (max-width: 600px) {
    .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    .price-main { font-size: 30px; }
    .app { padding: 12px; }
  }
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
const AGENTS = [
  {
    id: "bull",
    name: "Bull Trader",
    emoji: "🟢",
    color: "#00e5a0",
    role: "You are an aggressive bull trader. Find every reason why this coin will go UP. Look at positive momentum, support levels, buying pressure, and bullish signals. Be confident and specific with numbers.",
  },
  {
    id: "bear",
    name: "Bear Trader",
    emoji: "🔴",
    color: "#ff4d72",
    role: "You are a cautious bear trader. Find every reason why this coin will go DOWN. Look at resistance levels, selling pressure, bearish divergence, and risk factors. Be specific with numbers.",
  },
  {
    id: "technical",
    name: "Technical Analyst",
    emoji: "📊",
    color: "#a78bfa",
    role: "You are an expert technical analyst. Analyze price action, trend direction, key support and resistance levels, momentum, and chart patterns based on the data provided. Give specific price levels.",
  },
  {
    id: "sentiment",
    name: "Sentiment Analyst",
    emoji: "💭",
    color: "#f0c040",
    role: "You are a market sentiment expert. Analyze the market mood, fear and greed indicators, volume trends, and overall market psychology. Give a sentiment score 0-100 and explain what it means.",
  },
  {
    id: "risk",
    name: "Risk Manager",
    emoji: "🛡️",
    color: "#60a5fa",
    role: "You are a professional risk manager. Assess the overall risk of trading this coin right now. Give a risk rating Low/Medium/High, suggest stop loss and take profit levels, and recommend position size as % of portfolio.",
  },
  {
    id: "onchain",
    name: "On-Chain Analyst",
    emoji: "🌍",
    color: "#34d399",
    role: "You are an expert on-chain analyst. Based on the market data provided, analyze blockchain indicators like market cap to volume ratio, price momentum, and network activity signals. Estimate whether whales are accumulating or distributing based on volume and price action. Give specific insights about what the on-chain data suggests for the next 24-48 hours.",
  },
  {
    id: "news",
    name: "News Analyst",
    emoji: "📰",
    color: "#fb923c",
    role: "You are a crypto news and sentiment analyst. Based on the current price action and market data, analyze what the likely news sentiment is around this coin. Consider the price trend, volume, and market cap changes to estimate whether news sentiment is positive, negative, or neutral. Give a news sentiment score 0-100 and explain key factors driving market narrative.",
  },
  {
    id: "whale",
    name: "Whale Tracker",
    emoji: "🐋",
    color: "#38bdf8",
    role: "You are an expert whale movement tracker. Based on the volume data, price action, and market cap provided, analyze whether large players (whales) are likely buying or selling. Look for signs of accumulation (high volume + stable price) or distribution (high volume + price drop). Give specific insights about likely whale behavior and what retail traders should watch for.",
  },
];
const QUICK_QUESTIONS = [
  "Key resistance levels?",
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
  const [agentResponses, setAgentResponses] = useState({});
  const [agentLoading, setAgentLoading] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [consensus, setConsensus] = useState(null);
  const [timeframe, setTimeframe] = useState("1h");
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cryptomind_predictions") || "[]");
    setPredictions(saved);
  }, []);
  // Auto refresh price every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [selected]);
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch sparkline from CoinGecko (for chart only)
        const ids = COINS.map((c) => c.id).join(",");
        const geckoRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d`
        );
        const geckoData = await geckoRes.json();
        const geckoMap = {};
        geckoData.forEach((d) => (geckoMap[d.id] = d));

        // Fetch live prices from Binance
        const binanceSymbols = COINS.map((c) => `"${c.binance}"`).join(",");
        const binanceRes = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbols=[${binanceSymbols}]`
        );
        const binanceData = await binanceRes.json();

        // Merge Binance prices into market data
        const map = {};
        COINS.forEach((coin) => {
          const gecko = geckoMap[coin.id] || {};
          const binance = binanceData.find((b) => b.symbol === coin.binance) || {};
          map[coin.id] = {
            ...gecko,
            current_price: parseFloat(binance.lastPrice) || gecko.current_price,
            high_24h: parseFloat(binance.highPrice) || gecko.high_24h,
            low_24h: parseFloat(binance.lowPrice) || gecko.low_24h,
            price_change_percentage_24h: parseFloat(binance.priceChangePercent) || gecko.price_change_percentage_24h,
            total_volume: parseFloat(binance.quoteVolume) || gecko.total_volume,
          };
        });

        setMarketData(map);
        const coinData = map[selected.id];
        if (coinData?.sparkline_in_7d?.price) setPrices(coinData.sparkline_in_7d.price);
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
  async function runAgentDebate() {
    if (!coin) return;
    setAgentLoading(true);
    setDebateStarted(true);
    setAgentResponses({});
    setConsensus(null);

    const coinInfo = `${selected.name} (${selected.symbol}): 
    Price: $${coin.current_price?.toLocaleString()}, 
    24h Change: ${change24h?.toFixed(2)}%, 
    7d Change: ${coin.price_change_percentage_7d_in_currency?.toFixed(2)}%, 
    Market Cap: ${fmt(coin.market_cap)}, 
    24h High: $${coin.high_24h?.toLocaleString()}, 
    24h Low: $${coin.low_24h?.toLocaleString()}, 
    Volume: ${fmt(coin.total_volume)}.`;

    const responses = {};

    for (const agent of AGENTS) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + import.meta.env.VITE_GROQ_KEY
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            max_tokens: 1000,
            messages: [
              {
                role: "system",
                content: agent.role
              },
              {
                role: "user",
                content: `Analyze this live market data for ${timeframe} timeframe and give your expert opinion in 3-4 sentences:\n${coinInfo}`
              }
            ],
          }),
        });
        const data = await res.json();
        responses[agent.id] = data.choices?.[0]?.message?.content || "No response.";
      } catch (e) {
        responses[agent.id] = "Failed to get response.";
      }
      setAgentResponses({ ...responses });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Calculate consensus
    const bullish = responses["bull"] || "";
    const bearish = responses["bear"] || "";
    const technical = responses["technical"] || "";
    
    try {
      const consensusRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + import.meta.env.VITE_GROQ_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 2000,
          messages: [
            {
              role: "system",
              content: "You are a senior trading committee chair. Based on the analysis from multiple traders, give a final consensus verdict. Be decisive and specific."
            },
            {
              role: "user",
              content: `Based on these expert opinions about ${selected.name} for ${timeframe} timeframe, give a final trading verdict:

Bull: ${bullish.slice(0, 200)}
Bear: ${bearish.slice(0, 200)}
Technical: ${technical.slice(0, 200)}
OnChain: ${responses["onchain"]?.slice(0, 200) || ""}
News: ${responses["news"]?.slice(0, 200) || ""}
Whale: ${responses["whale"]?.slice(0, 200) || ""}

Give a final verdict in this exact format:
SIGNAL: [BUY/SELL/HOLD]
CONFIDENCE: [0-100]%
ENTRY: $[price]
TARGET: $[price]
STOP: $[price]
LEVERAGE: [1x-20x]
RISK: [Low/Medium/High]
TIMEFRAME: [1h/4h/1d]
BULLISH_FACTORS:
- [factor 1]
- [factor 2]
- [factor 3]
BEARISH_RISKS:
- [risk 1]
- [risk 2]
- [risk 3]
SCORES:
TECHNICAL: [0-100]
SENTIMENT: [0-100]
VOLUME: [0-100]
SUPPORT_ZONE: [0-100]
WHALE_ACTIVITY: [0-100]
VOTES:
BULL_TRADER: [BUY/SELL/HOLD] | [one sentence reason]
BEAR_TRADER: [BUY/SELL/HOLD] | [one sentence reason]
TECHNICAL_ANALYST: [BUY/SELL/HOLD] | [one sentence reason]
SENTIMENT_ANALYST: [BUY/SELL/HOLD] | [one sentence reason]
RISK_MANAGER: [BUY/SELL/HOLD] | [one sentence reason]
WHY_NOT_100:
- [reason 1]
- [reason 2]
- [reason 3]`
            }
          ],
        }),
      });
      const consensusData = await consensusRes.json();
      setConsensus(consensusData.choices?.[0]?.message?.content || "");
    } catch (e) {
      setConsensus("Failed to generate consensus.");
    }

    setAgentLoading(false);
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
  function extractAIValues() {
    if (!consensus) return;
    const entryMatch = consensus.match(/ENTRY:\s*\$?([\d,]+\.?\d*)/i);
    const targetMatch = consensus.match(/TARGET:\s*\$?([\d,]+\.?\d*)/i);
    const stopMatch = consensus.match(/STOP:\s*\$?([\d,]+\.?\d*)/i);
    const tpMatch = consensus.match(/TP:\s*\$?([\d,]+\.?\d*)/i);
    const slMatch = consensus.match(/SL:\s*\$?([\d,]+\.?\d*)/i);

    if (entryMatch) setEntryPrice(entryMatch[1].replace(/,/g, ""));
    
    // Try TARGET first, then TP
    if (targetMatch) setTakeProfit(targetMatch[1].replace(/,/g, ""));
    else if (tpMatch) setTakeProfit(tpMatch[1].replace(/,/g, ""));
    
    // Try STOP first, then SL
    if (stopMatch) setStopLoss(stopMatch[1].replace(/,/g, ""));
    else if (slMatch) setStopLoss(slMatch[1].replace(/,/g, ""));

    // Debug — show what was found
    console.log("Entry:", entryMatch?.[1]);
    console.log("Target:", targetMatch?.[1]);
    console.log("Stop:", stopMatch?.[1]);
  }
  function getSupportResistance() {
    if (!prices || prices.length < 10) return { supports: [], resistances: [] };
    
    const supports = [];
    const resistances = [];
    
    // Find local minima (support) and maxima (resistance)
    for (let i = 2; i < prices.length - 2; i++) {
      const prev2 = prices[i - 2];
      const prev1 = prices[i - 1];
      const curr = prices[i];
      const next1 = prices[i + 1];
      const next2 = prices[i + 2];

      // Local minimum = support
      if (curr < prev1 && curr < prev2 && curr < next1 && curr < next2) {
        supports.push(parseFloat(curr.toFixed(2)));
      }

      // Local maximum = resistance
      if (curr > prev1 && curr > prev2 && curr > next1 && curr > next2) {
        resistances.push(parseFloat(curr.toFixed(2)));
      }
    }

    // Remove duplicates that are too close (within 0.5%)
    const filterClose = (levels) => {
      const filtered = [];
      levels.forEach((level) => {
        const tooClose = filtered.some(
          (f) => Math.abs(f - level) / level < 0.005
        );
        if (!tooClose) filtered.push(level);
      });
      return filtered;
    };

    // Sort and take top 3 each
    const topSupports = filterClose(supports)
      .sort((a, b) => b - a)
      .slice(0, 3);
    const topResistances = filterClose(resistances)
      .sort((a, b) => a - b)
      .slice(0, 3);

    return { supports: topSupports, resistances: topResistances };
  }

const srLevels = getSupportResistance();
function savePrediction() {
    if (!consensus || !coin) return;
    const signalMatch = consensus.match(/SIGNAL:\s*(BUY|SELL|HOLD)/i);
    const entryMatch = consensus.match(/ENTRY:\s*\$?([\d,]+\.?\d*)/i);
    const targetMatch = consensus.match(/TARGET:\s*\$?([\d,]+\.?\d*)/i);
    const stopMatch = consensus.match(/STOP:\s*\$?([\d,]+\.?\d*)/i);
    const confidenceMatch = consensus.match(/CONFIDENCE:\s*(\d+)/i);

    if (!signalMatch) {
      alert("Run debate first to get a signal!");
      return;
    }

    const prediction = {
      id: Date.now(),
      coin: selected.symbol,
      coinName: selected.name,
      signal: signalMatch?.[1]?.toUpperCase() || "HOLD",
      entry: parseFloat(entryMatch?.[1]?.replace(/,/g, "") || coin.current_price),
      target: parseFloat(targetMatch?.[1]?.replace(/,/g, "") || 0),
      stop: parseFloat(stopMatch?.[1]?.replace(/,/g, "") || 0),
      confidence: parseInt(confidenceMatch?.[1] || 0),
      priceAtPrediction: coin.current_price,
      timestamp: new Date().toISOString(),
      result: "pending",
    };

    const existing = JSON.parse(localStorage.getItem("cryptomind_predictions") || "[]");
    existing.unshift(prediction);
    localStorage.setItem("cryptomind_predictions", JSON.stringify(existing.slice(0, 20)));
    setPredictions(existing.slice(0, 20));
    alert("Prediction saved! Check back in 24 hours to verify.");
  }

  function loadPredictions() {
    const saved = JSON.parse(localStorage.getItem("cryptomind_predictions") || "[]");
    setPredictions(saved);
  }

  function updatePredictionResult(id, result) {
    const existing = JSON.parse(localStorage.getItem("cryptomind_predictions") || "[]");
    const updated = existing.map((p) => p.id === id ? { ...p, result } : p);
    localStorage.setItem("cryptomind_predictions", JSON.stringify(updated));
    setPredictions(updated);
  }

  function clearPredictions() {
    localStorage.removeItem("cryptomind_predictions");
    setPredictions([]);
  }

  function getAccuracyStats() {
    const completed = predictions.filter((p) => p.result !== "pending");
    const wins = completed.filter((p) => p.result === "win").length;
    const losses = completed.filter((p) => p.result === "loss").length;
    const winRate = completed.length > 0 ? ((wins / completed.length) * 100).toFixed(1) : 0;
    return { wins, losses, total: completed.length, winRate, pending: predictions.filter((p) => p.result === "pending").length };
  }
  const calc = calcResults();

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* Header */}
        <div className="header">
          <div className="logo-wrap">₿</div>
          <div>
            <div className="app-title">Crypto<span>Mind</span> <span style={{ fontSize: 12, color: "#666", fontWeight: 400 }}>Pro</span></div>
          </div>
          <div className="app-sub">Live · AI</div>
          <div className="version-badge">v2.0</div>
          <div className="logo-dot" style={{ marginLeft: "auto" }} />
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
            {coin ? "$" + (coin.current_price >= 1
              ? coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : coin.current_price?.toFixed(4)
            ) : "Loading…"}
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
        {/* Support & Resistance Panel */}
        <div style={{
          background: "#13131f", border: "1px solid #1e1e30",
          borderRadius: "12px", padding: "20px", marginTop: "20px"
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: "600",
              color: "#f0c040", background: "#2a2000", border: "1px solid #f0c04044",
              padding: "3px 8px", borderRadius: "4px", letterSpacing: "1px"
            }}>S&R</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#e8e8f0" }}>
              Support & Resistance — {selected.symbol}
            </div>
          </div>

          {/* Current Price */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "16px", padding: "10px 14px",
            background: "#0a0a0f", borderRadius: "8px",
            border: "1px solid #1e1e30"
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
              color: "#555", textTransform: "uppercase", letterSpacing: "1px"
            }}>Current Price</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "16px",
              fontWeight: "700", color: isUp ? "#00e5a0" : "#ff4d72"
            }}>${coin?.current_price?.toLocaleString()}</div>
          </div>

          {/* Two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

            {/* Resistance Levels */}
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                color: "#ff4d72", textTransform: "uppercase", letterSpacing: "1px",
                marginBottom: "10px", fontWeight: "600"
              }}>🔴 Resistance Levels</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {srLevels.resistances.length > 0 ? srLevels.resistances.map((level, i) => {
                  const diff = ((level - (coin?.current_price || 0)) / (coin?.current_price || 1) * 100).toFixed(2);
                  return (
                    <div key={i} style={{
                      background: "#0a0a0f",
                      border: "1px solid #ff4d7233",
                      borderLeft: "3px solid #ff4d72",
                      borderRadius: "8px", padding: "10px 14px",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "14px", fontWeight: "600", color: "#ff4d72"
                        }}>${level.toLocaleString()}</div>
                        <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>
                          R{i + 1} — {diff}% above
                        </div>
                      </div>
                      <div style={{
                        fontSize: "10px", color: "#ff4d7288",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
                        {i === 0 ? "Nearest" : i === 1 ? "Mid" : "Strong"}
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ color: "#333", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                    No resistance found
                  </div>
                )}
              </div>
            </div>

            {/* Support Levels */}
            <div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                color: "#00e5a0", textTransform: "uppercase", letterSpacing: "1px",
                marginBottom: "10px", fontWeight: "600"
              }}>🟢 Support Levels</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {srLevels.supports.length > 0 ? srLevels.supports.map((level, i) => {
                  const diff = (((coin?.current_price || 0) - level) / (coin?.current_price || 1) * 100).toFixed(2);
                  return (
                    <div key={i} style={{
                      background: "#0a0a0f",
                      border: "1px solid #00e5a033",
                      borderLeft: "3px solid #00e5a0",
                      borderRadius: "8px", padding: "10px 14px",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div>
                        <div style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "14px", fontWeight: "600", color: "#00e5a0"
                        }}>${level.toLocaleString()}</div>
                        <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>
                          S{i + 1} — {diff}% below
                        </div>
                      </div>
                      <div style={{
                        fontSize: "10px", color: "#00e5a088",
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
                        {i === 0 ? "Nearest" : i === 1 ? "Mid" : "Strong"}
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ color: "#333", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                    No support found
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Note */}
          <div style={{
            marginTop: "14px", padding: "10px", background: "#0a0a0f",
            borderRadius: "8px", fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px", color: "#444", lineHeight: "1.6"
          }}>
            * Support and Resistance levels calculated from 7-day price data.
            Use these levels for setting Stop Loss and Take Profit in the Trade Calculator.
          </div>
        </div>
        {/* Timeframe Selector */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", padding: "16px 20px",
          marginTop: "20px",
          display: "flex", alignItems: "center", gap: "16px"
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
            color: "#555", textTransform: "uppercase", letterSpacing: "1px",
            whiteSpace: "nowrap"
          }}>Timeframe</div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["15m", "1h", "4h", "1D", "1W"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? "rgba(0,229,160,0.1)" : "rgba(255,255,255,0.03)",
                  border: timeframe === tf ? "1px solid #00e5a0" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px", padding: "6px 14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px", fontWeight: "600",
                  color: timeframe === tf ? "#00e5a0" : "#555",
                  cursor: "pointer", transition: "all 0.2s"
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          <div style={{
            marginLeft: "auto",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px", color: "#444"
          }}>
            {timeframe === "15m" && "⚡ Scalping — Short term signals"}
            {timeframe === "1h" && "📊 Day Trading — Hourly analysis"}
            {timeframe === "4h" && "📈 Swing Trading — 4 hour signals"}
            {timeframe === "1D" && "🗓️ Position Trading — Daily view"}
            {timeframe === "1W" && "📅 Long Term — Weekly trend"}
          </div>
        </div>
        {/* Multi-Agent Debate Panel */}
        <div style={{
          background: "#13131f", border: "1px solid #1e1e30",
          borderRadius: "12px", padding: "20px", marginTop: "20px"
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: "600",
                color: "#a78bfa", background: "#1a0a2a", border: "1px solid #a78bfa44",
                padding: "3px 8px", borderRadius: "4px", letterSpacing: "1px"
              }}>MULTI-AGENT</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#e8e8f0" }}>
                AI Trader Debate — {selected.symbol}
              </div>
            </div>
            <button
              onClick={runAgentDebate}
              disabled={agentLoading}
              style={{
                background: agentLoading ? "#1a1a2a" : "#a78bfa",
                color: agentLoading ? "#555" : "#0a0a0f",
                border: "none", borderRadius: "8px",
                padding: "8px 16px", fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px", fontWeight: "700", cursor: agentLoading ? "not-allowed" : "pointer",
                transition: "opacity 0.2s"
              }}
            >
              {agentLoading ? "Debating…" : "🗣️ Start Debate"}
            </button>
          </div>

          {/* Agent Cards */}
          {debateStarted && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {AGENTS.map((agent) => (
                <div key={agent.id} style={{
                  background: "#0a0a0f",
                  border: "1px solid " + agent.color + "33",
                  borderLeft: "3px solid " + agent.color,
                  borderRadius: "8px", padding: "14px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{agent.emoji}</span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                      fontWeight: "600", color: agent.color, textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>{agent.name}</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#b0b0c0", lineHeight: "1.7" }}>
                    {agentResponses[agent.id] ? (
                      agentResponses[agent.id]
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444" }}>
                        <div className="typing-dots"><span /><span /><span /></div>
                        <span>Analyzing…</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Consensus */}
          {consensus && (
            <div style={{
              background: "#0d1a12", border: "1px solid #00e5a033",
              borderRadius: "10px", padding: "16px"
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                color: "#00e5a0", textTransform: "uppercase", letterSpacing: "1px",
                marginBottom: "10px", fontWeight: "600"
              }}>⚖️ AI Committee Consensus</div>
              <button
                onClick={extractAIValues}
                style={{
                  background: "#00e5a0", color: "#0a0a0f",
                  border: "none", borderRadius: "6px",
                  padding: "6px 14px", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer",
                  marginBottom: "12px", float: "right"
                }}
              >
                ⬇️ Use AI Values in Calculator
              </button>
              {(() => {
                const signalMatch = consensus.match(/SIGNAL:\s*(BUY|SELL|HOLD)/i);
                const confidenceMatch = consensus.match(/CONFIDENCE:\s*(\d+)/i);
                const entryMatch = consensus.match(/ENTRY:\s*\$?([\d,]+\.?\d*)/i);
                const targetMatch = consensus.match(/TARGET:\s*\$?([\d,]+\.?\d*)/i);
                const stopMatch = consensus.match(/STOP:\s*\$?([\d,]+\.?\d*)/i);
                const riskMatch = consensus.match(/RISK:\s*(Low|Medium|High)/i);
                const leverageMatch = consensus.match(/LEVERAGE:\s*([\dx]+)/i);
                const timeframeMatch = consensus.match(/TIMEFRAME:\s*(\S+)/i);

                const signal = signalMatch?.[1]?.toUpperCase() || "HOLD";
                const confidence = parseInt(confidenceMatch?.[1] || 0);
                const signalColor = signal === "BUY" ? "#00e5a0" : signal === "SELL" ? "#ff4d72" : "#f0c040";

                // Bullish factors
                const bullishSection = consensus.match(/BULLISH_FACTORS:([\s\S]*?)BEARISH_RISKS:/i);
                const bullishFactors = bullishSection?.[1]?.match(/- (.+)/g)?.map(f => f.replace("- ", "").trim()) || [];

                // Bearish risks
                const bearishSection = consensus.match(/BEARISH_RISKS:([\s\S]*?)SCORES:/i);
                const bearishRisks = bearishSection?.[1]?.match(/- (.+)/g)?.map(f => f.replace("- ", "").trim()) || [];

                // Scores
                const scores = [
                  { label: "Technical Analysis", value: parseInt(consensus.match(/TECHNICAL:\s*(\d+)/i)?.[1] || 0) },
                  { label: "Sentiment", value: parseInt(consensus.match(/SENTIMENT:\s*(\d+)/i)?.[1] || 0) },
                  { label: "Volume", value: parseInt(consensus.match(/VOLUME:\s*(\d+)/i)?.[1] || 0) },
                  { label: "Support Zone", value: parseInt(consensus.match(/SUPPORT_ZONE:\s*(\d+)/i)?.[1] || 0) },
                  { label: "Whale Activity", value: parseInt(consensus.match(/WHALE_ACTIVITY:\s*(\d+)/i)?.[1] || 0) },
                ];

                // Votes with reasons
                const parseVote = (pattern) => {
                  const match = consensus.match(pattern);
                  if (!match) return { vote: "—", reason: "" };
                  const parts = match[1].split("|");
                  return {
                    vote: parts[0]?.trim().toUpperCase() || "—",
                    reason: parts[1]?.trim() || ""
                  };
                };

                const agentVotes = [
                  { name: "🟢 Bull Trader", ...parseVote(/BULL_TRADER:\s*(.+)/i) },
                  { name: "🔴 Bear Trader", ...parseVote(/BEAR_TRADER:\s*(.+)/i) },
                  { name: "📊 Technical", ...parseVote(/TECHNICAL_ANALYST:\s*(.+)/i) },
                  { name: "💭 Sentiment", ...parseVote(/SENTIMENT_ANALYST:\s*(.+)/i) },
                  { name: "🛡️ Risk Manager", ...parseVote(/RISK_MANAGER:\s*(.+)/i) },
                ];

                const votes = agentVotes.map(a => a.vote);
                const buyVotes = votes.filter(v => v === "BUY").length;
                const sellVotes = votes.filter(v => v === "SELL").length;
                const holdVotes = votes.filter(v => v === "HOLD").length;
                const totalVotes = agentVotes.filter(a => a.vote !== "—").length;
                const agreementScore = Math.round((Math.max(buyVotes, sellVotes, holdVotes) / totalVotes) * 100);

                // Why not 100
                const whySection = consensus.match(/WHY_NOT_100:([\s\S]*?)$/i);
                const reasons = whySection?.[1]?.match(/- (.+)/g)?.map(r => r.replace("- ", "").trim()) || [];
                const remaining = 100 - confidence;

                const voteColor = (v) => v === "BUY" ? "#00e5a0" : v === "SELL" ? "#ff4d72" : v === "HOLD" ? "#f0c040" : "#555";
                const scoreColor = (v) => v >= 80 ? "#00e5a0" : v >= 60 ? "#f0c040" : "#ff4d72";

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* BIG SIGNAL CARD */}
                    <div style={{
                      background: signal === "BUY" ? "rgba(0,229,160,0.08)" : signal === "SELL" ? "rgba(255,77,114,0.08)" : "rgba(240,192,64,0.08)",
                      border: "2px solid " + signalColor,
                      borderRadius: "14px", padding: "24px",
                      boxShadow: "0 0 40px " + signalColor + "22"
                    }}>
                      {/* Signal + Confidence */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{
                            fontSize: "56px", fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: "800", color: signalColor,
                            textShadow: "0 0 40px " + signalColor
                          }}>
                            {signal === "BUY" ? "🟢" : signal === "SELL" ? "🔴" : "🟡"}
                          </div>
                          <div>
                            <div style={{
                              fontSize: "48px", fontFamily: "'JetBrains Mono', monospace",
                              fontWeight: "800", color: signalColor, lineHeight: 1
                            }}>{signal}</div>
                            <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
                              {timeframe} Timeframe Signal
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            fontSize: "48px", fontFamily: "'JetBrains Mono', monospace",
                            fontWeight: "800", color: signalColor, lineHeight: 1
                          }}>{confidence}%</div>
                          <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>CONFIDENCE</div>
                        </div>
                      </div>

                      {/* Key levels grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                        {[
                          { label: "Entry", value: entryMatch?.[1] ? "$" + entryMatch[1] : "—", color: "#e8e8f0" },
                          { label: "Target", value: targetMatch?.[1] ? "$" + targetMatch[1] : "—", color: "#00e5a0" },
                          { label: "Stop Loss", value: stopMatch?.[1] ? "$" + stopMatch[1] : "—", color: "#ff4d72" },
                          { label: "Risk", value: riskMatch?.[1] || "—", color: riskMatch?.[1] === "Low" ? "#00e5a0" : riskMatch?.[1] === "High" ? "#ff4d72" : "#f0c040" },
                        ].map((item) => (
                          <div key={item.label} style={{
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: "8px", padding: "10px 12px", textAlign: "center"
                          }}>
                            <div style={{ fontSize: "10px", color: "#444", marginBottom: "4px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</div>
                            <div style={{ fontSize: "14px", fontWeight: "700", color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BULLISH & BEARISH */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{
                        background: "rgba(0,229,160,0.04)",
                        border: "1px solid rgba(0,229,160,0.15)",
                        borderRadius: "10px", padding: "14px"
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#00e5a0", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: "700" }}>📈 Bullish Factors</div>
                        {bullishFactors.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px", color: "#c0c0d0", lineHeight: "1.5" }}>
                            <span style={{ color: "#00e5a0", fontWeight: "700" }}>✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{
                        background: "rgba(255,77,114,0.04)",
                        border: "1px solid rgba(255,77,114,0.15)",
                        borderRadius: "10px", padding: "14px"
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#ff4d72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", fontWeight: "700" }}>📉 Bearish Risks</div>
                        {bearishRisks.map((r, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px", color: "#c0c0d0", lineHeight: "1.5" }}>
                            <span style={{ color: "#ff4d72", fontWeight: "700" }}>⚠</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CONFIDENCE BREAKDOWN */}
                    <div style={{ background: "#0a0a0f", border: "1px solid #1e1e30", borderRadius: "10px", padding: "14px" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: "600" }}>📊 Confidence Breakdown</div>
                      {scores.map((s) => (
                        <div key={s.label} style={{ marginBottom: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</span>
                            <span style={{ fontSize: "12px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", color: scoreColor(s.value) }}>{s.value}/100</span>
                          </div>
                          <div style={{ height: "5px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{
                              height: "100%", width: s.value + "%",
                              background: scoreColor(s.value),
                              borderRadius: "3px", transition: "width 0.6s ease",
                              boxShadow: "0 0 6px " + scoreColor(s.value) + "88"
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AGENT VOTES WITH REASONS */}
                    <div style={{ background: "#0a0a0f", border: "1px solid #1e1e30", borderRadius: "10px", padding: "14px" }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: "600" }}>🗳️ Agent Votes</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                        {agentVotes.map((agent) => (
                          <div key={agent.name} style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "10px 12px",
                            background: "rgba(255,255,255,0.02)",
                            borderLeft: "3px solid " + voteColor(agent.vote),
                            borderRadius: "6px"
                          }}>
                            <span style={{ fontSize: "12px", color: "#888", minWidth: "110px" }}>{agent.name}</span>
                            <span style={{
                              fontSize: "12px", fontWeight: "700",
                              fontFamily: "'JetBrains Mono', monospace",
                              color: voteColor(agent.vote), minWidth: "40px"
                            }}>{agent.vote}</span>
                            {agent.reason && (
                              <span style={{ fontSize: "11px", color: "#555", lineHeight: "1.4" }}>
                                {agent.reason}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Agreement Score */}
                      <div style={{
                        borderTop: "1px solid #1e1e30", paddingTop: "12px"
                      }}>
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: "10px"
                        }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Committee Agreement
                          </div>
                          <div style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "20px", fontWeight: "700",
                            color: agreementScore >= 80 ? "#00e5a0" : agreementScore >= 60 ? "#f0c040" : "#ff4d72"
                          }}>{agreementScore}%</div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          {[
                            { label: "BUY", count: buyVotes, color: "#00e5a0" },
                            { label: "SELL", count: sellVotes, color: "#ff4d72" },
                            { label: "HOLD", count: holdVotes, color: "#f0c040" },
                          ].map((v) => (
                            <div key={v.label} style={{
                              flex: 1, textAlign: "center", padding: "8px",
                              background: v.count > 0 ? v.color + "11" : "transparent",
                              border: "1px solid " + (v.count > 0 ? v.color + "33" : "#1e1e30"),
                              borderRadius: "6px"
                            }}>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "20px", fontWeight: "700", color: v.color }}>{v.count}</div>
                              <div style={{ fontSize: "10px", color: "#444", letterSpacing: "1px" }}>{v.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* WHY NOT 100% */}
                    {reasons.length > 0 && (
                      <div style={{
                        background: "rgba(240,192,64,0.04)",
                        border: "1px solid rgba(240,192,64,0.15)",
                        borderRadius: "10px", padding: "14px"
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#f0c040", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px", fontWeight: "700" }}>❓ Why Not 100%?</div>
                        <div style={{ fontSize: "11px", color: "#555", fontFamily: "'JetBrains Mono', monospace", marginBottom: "10px" }}>
                          Confidence: {confidence}% — Missing {remaining}% due to:
                        </div>
                        {reasons.map((r, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "12px", color: "#c0c0d0", lineHeight: "1.5" }}>
                            <span style={{ color: "#f0c040", fontWeight: "700" }}>•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                        <div style={{ marginTop: "12px" }}>
                          <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", display: "flex" }}>
                            <div style={{ height: "100%", width: confidence + "%", background: confidence >= 70 ? "#00e5a0" : "#f0c040", borderRadius: "3px 0 0 3px" }} />
                            <div style={{ height: "100%", width: remaining + "%", background: "rgba(240,192,64,0.2)", borderRadius: "0 3px 3px 0" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", color: confidence >= 70 ? "#00e5a0" : "#f0c040" }}>{confidence}%</span>
                            <span style={{ fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", color: "#f0c04088" }}>-{remaining}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HISTORICAL PERFORMANCE */}
                    {(() => {
                      const completed = predictions.filter(p => p.result !== "pending" && p.coin === selected.symbol);
                      const wins = completed.filter(p => p.result === "win").length;
                      const losses = completed.filter(p => p.result === "loss").length;
                      const winRate = completed.length > 0 ? ((wins / completed.length) * 100).toFixed(1) : null;

                      return completed.length > 0 ? (
                        <div style={{
                          background: "rgba(167,139,250,0.04)",
                          border: "1px solid rgba(167,139,250,0.15)",
                          borderRadius: "10px", padding: "14px"
                        }}>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px", fontWeight: "700" }}>📈 AI Performance — {selected.symbol}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                            {[
                              { label: "Accuracy", value: winRate + "%", color: parseFloat(winRate) >= 70 ? "#00e5a0" : parseFloat(winRate) >= 50 ? "#f0c040" : "#ff4d72" },
                              { label: "Wins", value: wins, color: "#00e5a0" },
                              { label: "Losses", value: losses, color: "#ff4d72" },
                            ].map((s) => (
                              <div key={s.label} style={{ textAlign: "center", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "22px", fontWeight: "700", color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: "10px", color: "#444", marginTop: "4px", letterSpacing: "1px" }}>{s.label}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: "10px", fontSize: "11px", color: "#444", fontFamily: "'JetBrains Mono', monospace" }}>
                            Based on {completed.length} completed predictions for {selected.symbol}
                          </div>
                        </div>
                      ) : null;
                    })()}

                  </div>
                );
              })()}
            </div>
          )}

          {/* Placeholder */}
          {!debateStarted && (
            <div style={{
              textAlign: "center", padding: "30px",
              color: "#333", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px"
            }}>
              Click "Start Debate" to get analysis from 5 AI traders
            </div>
          )}
        </div>
        {/* Prediction Accuracy Tracker */}
        <div style={{
          background: "#13131f", border: "1px solid #1e1e30",
          borderRadius: "12px", padding: "20px", marginTop: "20px"
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", fontWeight: "600",
                color: "#f0c040", background: "#2a2000", border: "1px solid #f0c04044",
                padding: "3px 8px", borderRadius: "4px", letterSpacing: "1px"
              }}>TRACKER</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#e8e8f0" }}>
                Prediction Accuracy Tracker
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={savePrediction}
                disabled={!consensus}
                style={{
                  background: consensus ? "#f0c040" : "#1a1a2a",
                  color: consensus ? "#0a0a0f" : "#555",
                  border: "none", borderRadius: "6px",
                  padding: "6px 14px", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px", fontWeight: "700", cursor: consensus ? "pointer" : "not-allowed"
                }}
              >
                💾 Save Prediction
              </button>
              <button
                onClick={clearPredictions}
                style={{
                  background: "#1a0a0a", color: "#ff4d72",
                  border: "1px solid #ff4d7233", borderRadius: "6px",
                  padding: "6px 14px", fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px", fontWeight: "700", cursor: "pointer"
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Stats Row */}
          {(() => {
            const stats = getAccuracyStats();
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Win Rate", value: stats.winRate + "%", color: "#00e5a0" },
                  { label: "Wins", value: stats.wins, color: "#00e5a0" },
                  { label: "Losses", value: stats.losses, color: "#ff4d72" },
                  { label: "Pending", value: stats.pending, color: "#f0c040" },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "#0a0a0f", border: "1px solid #1e1e30",
                    borderRadius: "8px", padding: "12px", textAlign: "center"
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                      color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px"
                    }}>{s.label}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "20px",
                      fontWeight: "700", color: s.color
                    }}>{s.value}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Predictions List */}
          {predictions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {predictions.map((p) => (
                <div key={p.id} style={{
                  background: "#0a0a0f",
                  border: "1px solid " + (p.result === "win" ? "#00e5a033" : p.result === "loss" ? "#ff4d7233" : "#1e1e30"),
                  borderLeft: "3px solid " + (p.result === "win" ? "#00e5a0" : p.result === "loss" ? "#ff4d72" : "#f0c040"),
                  borderRadius: "8px", padding: "12px"
                }}>
                  {/* Top Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
                        fontWeight: "700",
                        color: p.signal === "BUY" ? "#00e5a0" : p.signal === "SELL" ? "#ff4d72" : "#f0c040"
                      }}>{p.signal}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#888"
                      }}>{p.coin}</span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#444"
                      }}>{new Date(p.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                      color: p.result === "win" ? "#00e5a0" : p.result === "loss" ? "#ff4d72" : "#f0c040",
                      fontWeight: "600", textTransform: "uppercase"
                    }}>
                      {p.result === "pending" ? "⏳ Pending" : p.result === "win" ? "✅ Win" : "❌ Loss"}
                    </div>
                  </div>

                  {/* Price Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                    {[
                      { label: "Entry", value: "$" + p.entry?.toLocaleString() },
                      { label: "Target", value: "$" + p.target?.toLocaleString() },
                      { label: "Stop", value: "$" + p.stop?.toLocaleString() },
                      { label: "Confidence", value: p.confidence + "%" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div style={{ fontSize: "10px", color: "#444", marginBottom: "2px", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                        <div style={{ fontSize: "12px", color: "#c0c0d0", fontFamily: "'JetBrains Mono', monospace", fontWeight: "600" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Result Buttons */}
                  {p.result === "pending" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <button
                        onClick={() => updatePredictionResult(p.id, "win")}
                        style={{
                          background: "#002a18", color: "#00e5a0",
                          border: "1px solid #00e5a044", borderRadius: "6px",
                          padding: "4px 12px", fontSize: "11px", fontWeight: "700",
                          cursor: "pointer", fontFamily: "'JetBrains Mono', monospace"
                        }}
                      >✅ Mark Win</button>
                      <button
                        onClick={() => updatePredictionResult(p.id, "loss")}
                        style={{
                          background: "#2a0010", color: "#ff4d72",
                          border: "1px solid #ff4d7244", borderRadius: "6px",
                          padding: "4px 12px", fontSize: "11px", fontWeight: "700",
                          cursor: "pointer", fontFamily: "'JetBrains Mono', monospace"
                        }}
                      >❌ Mark Loss</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "30px",
              color: "#333", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px"
            }}>
              Run a debate and click "Save Prediction" to start tracking accuracy
            </div>
          )}
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
