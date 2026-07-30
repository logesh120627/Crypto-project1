import { useState } from "react";

const LANDING_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #050508; }

  .landing {
    min-height: 100vh;
    background: #050508;
    color: #e8e8f0;
    font-family: 'Space Grotesk', sans-serif;
  }

  /* NAV */
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    position: sticky;
    top: 0;
    background: rgba(5,5,8,0.9);
    backdrop-filter: blur(20px);
    z-index: 100;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-logo-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00e5a0, #00b377);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 20px #00e5a044;
  }

  .nav-logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  .nav-logo-text span { color: #00e5a0; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .nav-link {
    color: #666;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
  }

  .nav-link:hover { color: #fff; }

  .nav-cta {
    background: linear-gradient(135deg, #00e5a0, #00c489);
    color: #050508;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(0,229,160,0.3);
  }

  .nav-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,229,160,0.4);
  }

  /* HERO */
  .hero {
    text-align: center;
    padding: 100px 20px 80px;
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,229,160,0.08);
    border: 1px solid rgba(0,229,160,0.2);
    border-radius: 20px;
    padding: 6px 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #00e5a0;
    letter-spacing: 1px;
    margin-bottom: 32px;
  }

  .hero-title {
    font-size: 64px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 24px;
    color: #fff;
  }

  .hero-title span { color: #00e5a0; }

  .hero-sub {
    font-size: 18px;
    color: #666;
    line-height: 1.7;
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-btns {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 60px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #00e5a0, #00c489);
    color: #050508;
    border: none;
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(0,229,160,0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0,229,160,0.4);
  }

  .btn-secondary {
    background: rgba(255,255,255,0.05);
    color: #e8e8f0;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 14px 28px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.2);
  }

  /* STATS */
  .stats {
    display: flex;
    justify-content: center;
    gap: 48px;
    padding: 40px;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 80px;
  }

  .stat-item { text-align: center; }

  .stat-value {
    font-family: 'JetBrains Mono', monospace;
    font-size: 32px;
    font-weight: 700;
    color: #00e5a0;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 13px;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* FEATURES */
  .features {
    max-width: 1100px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }

  .section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #00e5a0;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    color: #fff;
    letter-spacing: -1px;
    margin-bottom: 12px;
  }

  .section-sub {
    font-size: 16px;
    color: #555;
    text-align: center;
    margin-bottom: 48px;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .feature-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.2s;
  }

  .feature-card:hover {
    border-color: rgba(0,229,160,0.2);
    background: rgba(0,229,160,0.02);
    transform: translateY(-2px);
  }

  .feature-icon {
    font-size: 28px;
    margin-bottom: 14px;
  }

  .feature-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .feature-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.7;
  }

  /* AGENTS */
  .agents {
    max-width: 1100px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .agent-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s;
  }

  .agent-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255,255,255,0.12);
  }

  .agent-emoji { font-size: 24px; margin-bottom: 10px; }

  .agent-name {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
  }

  .agent-desc {
    font-size: 11px;
    color: #444;
    line-height: 1.6;
  }

  /* PRICING */
  .pricing {
    max-width: 800px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .pricing-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 32px;
    transition: all 0.2s;
  }

  .pricing-card.popular {
    background: rgba(0,229,160,0.04);
    border-color: rgba(0,229,160,0.3);
    box-shadow: 0 0 40px rgba(0,229,160,0.08);
  }

  .popular-badge {
    background: #00e5a0;
    color: #050508;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 16px;
    letter-spacing: 1px;
  }

  .pricing-plan {
    font-size: 14px;
    color: #555;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .pricing-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 48px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .pricing-price span {
    font-size: 18px;
    color: #555;
    font-weight: 400;
  }

  .pricing-desc {
    font-size: 13px;
    color: #444;
    margin-bottom: 24px;
  }

  .pricing-features {
    list-style: none;
    margin-bottom: 28px;
  }

  .pricing-features li {
    font-size: 13px;
    color: #888;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pricing-features li::before {
    content: '✓';
    color: #00e5a0;
    font-weight: 700;
    font-size: 12px;
  }

  /* HOW IT WORKS */
  .how {
    max-width: 900px;
    margin: 0 auto 80px;
    padding: 0 20px;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .step {
    text-align: center;
    padding: 24px;
  }

  .step-num {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: rgba(0,229,160,0.1);
    border: 1px solid rgba(0,229,160,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #00e5a0;
    margin: 0 auto 16px;
  }

  .step-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .step-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.7;
  }

  /* FOOTER */
  .footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 40px;
    text-align: center;
  }

  .footer-logo {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }

  .footer-logo span { color: #00e5a0; }

  .footer-text {
    font-size: 12px;
    color: #333;
    margin-bottom: 16px;
  }

  .footer-disclaimer {
    font-size: 11px;
    color: #222;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .hero-title { font-size: 36px; }
    .features-grid { grid-template-columns: 1fr; }
    .agents-grid { grid-template-columns: repeat(2, 1fr); }
    .pricing-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr; }
    .stats { flex-wrap: wrap; gap: 24px; }
    .nav-links { display: none; }
    .nav { padding: 16px 20px; }
  }
`;

export default function Landing({ onLaunch }) {
  return (
    <>
      <style>{LANDING_STYLES}</style>
      <div className="landing">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">₿</div>
            <div className="nav-logo-text">Crypto<span>Mind</span> Pro</div>
          </div>
          <div className="nav-links">
            <a className="nav-link">Features</a>
            <a className="nav-link">AI Agents</a>
            <a className="nav-link">Pricing</a>
            <a className="nav-link">How It Works</a>
          </div>
          <button className="nav-cta" onClick={onLaunch}>
            Launch App →
          </button>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-badge">
            🤖 8 AI Agents · Live Market Data · Trade Calculator
          </div>
          <h1 className="hero-title">
            The Smartest<br />
            <span>AI Crypto</span><br />
            Analyzer
          </h1>
          <p className="hero-sub">
            CryptoMind Pro uses 8 specialized AI traders that debate live market data,
            detect support & resistance levels, and give you a precise trading signal
            with entry, target, stop loss, and leverage — in seconds.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={onLaunch}>
              🚀 Launch for Free
            </button>
            <button className="btn-secondary" onClick={() => {
              alert("📱 To add CryptoMind Pro to your home screen:\n\n1. Open this site in Chrome\n2. Tap the 3 dots menu (⋮)\n3. Tap 'Add to Home Screen'\n4. Tap Add\n\nThe app will appear on your home screen!");
            }}>
              📱 Add to Home Screen
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          {[
            { value: "15+", label: "Coins Supported" },
            { value: "8", label: "AI Agents" },
            { value: "100%", label: "Free to Use" },
            { value: "Live", label: "Market Data" },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything You Need</h2>
          <p className="section-sub">Professional trading tools powered by AI</p>
          <div className="features-grid">
            {[
              { icon: "📊", title: "Live Market Data", desc: "Real-time prices for 15+ coins from CoinGecko. 7-day sparkline charts, market cap, volume, and 24h changes." },
              { icon: "🤖", title: "8 AI Trader Debate", desc: "Bull Trader, Bear Trader, Technical Analyst, Sentiment Analyst, Risk Manager, On-Chain Analyst, News Analyst, and Whale Tracker debate live data." },
              { icon: "⚖️", title: "AI Consensus Signal", desc: "AI Committee gives a final verdict with SIGNAL, CONFIDENCE, ENTRY, TARGET, STOP, LEVERAGE, RISK, and TIMEFRAME." },
              { icon: "📈", title: "Support & Resistance", desc: "Automatically detects key support and resistance levels from 7-day price data. Shows R1, R2, R3 and S1, S2, S3." },
              { icon: "🧮", title: "Trade Calculator", desc: "Enter your Entry Price, Stop Loss, and Take Profit. Get Risk, Reward, RR Ratio, and Position Size using the 1% risk rule." },
              { icon: "🎯", title: "Prediction Tracker", desc: "Save AI predictions and track accuracy over time. Mark wins and losses. See your overall win rate." },
              { icon: "💡", title: "AI Values Button", desc: "One click fills the Trade Calculator with AI Consensus values. No manual typing — instant trading plan." },
              { icon: "📱", title: "Install on Phone", desc: "CryptoMind Pro works as a PWA. Install it on your phone home screen like a native app — no Play Store needed." },
              { icon: "🧭", title: "Market Sentiment", desc: "Real-time sentiment score from 0-100 calculated from 24h and 7d price changes. Bullish, Neutral, or Bearish." },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI AGENTS */}
        <div className="agents">
          <div className="section-label">AI Agents</div>
          <h2 className="section-title">Meet Your AI Trading Team</h2>
          <p className="section-sub">8 specialized AI agents debate every trade</p>
          <div className="agents-grid">
            {[
              { emoji: "🟢", name: "Bull Trader", desc: "Finds every reason to buy" },
              { emoji: "🔴", name: "Bear Trader", desc: "Finds every reason to sell" },
              { emoji: "📊", name: "Technical Analyst", desc: "Reads chart patterns" },
              { emoji: "💭", name: "Sentiment Analyst", desc: "Reads market mood" },
              { emoji: "🛡️", name: "Risk Manager", desc: "Manages position safety" },
              { emoji: "🌍", name: "On-Chain Analyst", desc: "Analyzes blockchain data" },
              { emoji: "📰", name: "News Analyst", desc: "Reads market sentiment" },
              { emoji: "🐋", name: "Whale Tracker", desc: "Tracks big money moves" },
            ].map((a) => (
              <div key={a.name} className="agent-card">
                <div className="agent-emoji">{a.emoji}</div>
                <div className="agent-name">{a.name}</div>
                <div className="agent-desc">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">3 Simple Steps</h2>
          <p className="section-sub">Get a complete trading plan in under 60 seconds</p>
          <div className="steps">
            {[
              { num: "1", title: "Select a Coin", desc: "Choose from 15+ coins including BTC, ETH, SOL, BNB, XRP, DOGE, ADA and more." },
              { num: "2", title: "Start AI Debate", desc: "8 AI agents analyze live market data and debate the best trading direction." },
              { num: "3", title: "Get Trading Plan", desc: "AI Committee gives SIGNAL, ENTRY, TARGET, STOP, LEVERAGE. One click fills the Trade Calculator." },
            ].map((s) => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRICING */}
        <div className="pricing">
          <div className="section-label">Pricing</div>
          <h2 className="section-title">Simple Pricing</h2>
          <p className="section-sub">Start free, upgrade when ready</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan">Free</div>
              <div className="pricing-price">$0<span>/month</span></div>
              <div className="pricing-desc">Perfect for getting started</div>
              <ul className="pricing-features">
                <li>5 coins (BTC, ETH, SOL, BNB, XRP)</li>
                <li>AI Analysis Panel</li>
                <li>Trade Calculator</li>
                <li>Support & Resistance</li>
                <li>Market Sentiment</li>
              </ul>
              <button className="btn-secondary" style={{ width: "100%" }} onClick={onLaunch}>
                Get Started Free
              </button>
            </div>
            <div className="pricing-card popular">
              <div className="popular-badge">MOST POPULAR</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price">$9<span>/month</span></div>
              <div className="pricing-desc">For serious traders</div>
              <ul className="pricing-features">
                <li>15+ coins supported</li>
                <li>8 AI Trader Debate</li>
                <li>AI Committee Consensus</li>
                <li>Prediction Accuracy Tracker</li>
                <li>AI Values Auto-fill</li>
                <li>PWA Mobile App</li>
                <li>Priority Support</li>
              </ul>
              <button className="btn-primary" style={{ width: "100%" }} onClick={onLaunch}>
                Start Pro Free Trial
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">Crypto<span>Mind</span> Pro</div>
          <div className="footer-text">Built with React, Groq AI, and CoinGecko API</div>
          <div className="footer-disclaimer">
            ⚠️ CryptoMind Pro is for educational and informational purposes only.
            Not financial advice. Always do your own research before trading.
            Crypto trading involves significant risk of loss.
          </div>
        </footer>

      </div>
    </>
  );
}