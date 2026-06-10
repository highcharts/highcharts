import { useState, useEffect, useRef } from "react";

// ── Users ────────────────────────────────────────────────────────────────────
const USERS = {
  "ahmed@fx.com": { name: "أحمد المحلل", avatar: "أح", pass: "123456", role: "محلل متقدم" },
  "sara@fx.com":  { name: "سارة الفوركس", avatar: "سا", pass: "123456", role: "متداولة" },
};

// ── Major pairs ──────────────────────────────────────────────────────────────
const MAJOR_PAIRS = [
  { pair: "EUR/USD", base: 1.0851 },
  { pair: "GBP/USD", base: 1.2734 },
  { pair: "USD/JPY", base: 157.42 },
  { pair: "USD/CHF", base: 0.9012 },
  { pair: "AUD/USD", base: 0.6543 },
  { pair: "USD/CAD", base: 1.3621 },
  { pair: "NZD/USD", base: 0.5987 },
  { pair: "EUR/GBP", base: 0.8521 },
];

const SIGNALS = ["BUY","SELL","NO_SIGNAL"];
const PATTERNS_POOL = ["ابتلاع شرائي","مطرقة","نجمة الصباح","دوجي","رأس وكتفين","قاع مزدوج","قمة مزدوجة","الجنود الثلاثة","غيمة داكنة","بين بار"];
const SUMMARIES_BUY = ["نموذج شرائي قوي عند منطقة دعم مع تقاطع EMA إيجابي","تقاطع المتوسطات مع RSI في منطقة محايدة يدعم الصعود","كسر مقاومة مع زخم صاعد قوي"];
const SUMMARIES_SELL = ["ضغط بيعي على مقاومة رئيسية مع RSI مرتفع","نموذج انعكاسي هابط عند مقاومة تاريخية","تقاطع سلبي للمتوسطات مع تراجع الزخم"];

function rnd(min, max) { return Math.random() * (max - min) + min; }

function generateDailyAnalysis() {
  return MAJOR_PAIRS.map(({ pair, base }) => {
    const sig = SIGNALS[Math.floor(Math.random() * SIGNALS.length)];
    const entry = +(base * (1 + rnd(-0.001, 0.001))).toFixed(pair.includes("JPY") ? 2 : 5);
    const pip = pair.includes("JPY") ? 0.01 : 0.0001;
    const isBuy = sig === "BUY";
    const isSell = sig === "SELL";
    const score = Math.floor(rnd(2, 6));
    const patCount = Math.floor(rnd(1, 3));
    const pats = [...PATTERNS_POOL].sort(() => 0.5 - Math.random()).slice(0, patCount);
    return {
      pair,
      signal: sig,
      entry,
      target: isBuy ? +(entry + pip * 29).toFixed(pair.includes("JPY") ? 2 : 5) : isSell ? +(entry - pip * 29).toFixed(pair.includes("JPY") ? 2 : 5) : null,
      stop:   isBuy ? +(entry - pip * 16).toFixed(pair.includes("JPY") ? 2 : 5) : isSell ? +(entry + pip * 16).toFixed(pair.includes("JPY") ? 2 : 5) : null,
      confidence: ["عالية جداً","عالية","متوسطة"][Math.floor(rnd(0,3))],
      score,
      patterns: pats,
      summary: isBuy ? SUMMARIES_BUY[Math.floor(rnd(0,3))] : isSell ? SUMMARIES_SELL[Math.floor(rnd(0,3))] : "لا توجد إشارة واضحة حالياً، يُنصح بالانتظار.",
      ema: ["صاعد","هابط","محايد"][Math.floor(rnd(0,3))],
      rsi: ["تشبع شراء","تشبع بيع","محايد"][Math.floor(rnd(0,3))],
      atr: ["منخفض","متوسط","مرتفع"][Math.floor(rnd(0,3))],
    };
  });
}

// ── AI prompt ────────────────────────────────────────────────────────────────
const AI_PROMPT = `أنت محلل فوركس. أعطني JSON فقط بدون backticks:
{"pair":"","timeframe":"","signal":"BUY أو SELL أو NO_SIGNAL","entry":0,"target":0,"stop":0,"confidence":"عالية جداً أو عالية أو متوسطة","score":1,"reasons":[],"patterns":[],"indicators":{"ema_trend":"","rsi_status":"","atr_level":""},"news_warning":false,"summary":""}
قواعد: هدف 29 نقطة، وقف 16 نقطة، 3 عوامل تأكيد على الأقل.`;

// ── Seed feed ────────────────────────────────────────────────────────────────
const SEED_FEED = [
  { id: 1, user:"أحمد المحلل", avatar:"أح", time:"منذ 15 دقيقة", pair:"EUR/USD", tf:"15m", signal:"BUY", confidence:"عالية جداً", entry:1.08512, target:1.08802, stop:1.08352, summary:"نموذج ابتلاع شرائي قوي عند دعم 1.0850", patterns:["ابتلاع شرائي","دعم قوي"], score:4, likes:7, chartThumb:null },
  { id: 2, user:"سارة الفوركس", avatar:"سا", time:"منذ 40 دقيقة", pair:"GBP/USD", tf:"5m", signal:"SELL", confidence:"عالية", entry:1.27340, target:1.27050, stop:1.27500, summary:"مقاومة 1.2740 صامدة مع RSI مرتفع", patterns:["دوجي هابط","مقاومة"], score:3, likes:4, chartThumb:null },
];

// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser]     = useState(null);
  const [page, setPage]     = useState("feed"); // feed | daily | analyze
  const [feed, setFeed]     = useState(SEED_FEED);
  const [daily, setDaily]   = useState(() => generateDailyAnalysis());
  const [nextUpdate, setNextUpdate] = useState(120 * 60); // seconds
  const [loginModal, setLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Login form
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [loginErr, setLoginErr] = useState("");

  // Analyze
  const [apiKey, setApiKey]       = useState("");        // <-- حقل مفتاح API
  const [image, setImage]         = useState(null);
  const [imageB64, setImageB64]   = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [analyzeErr, setAnalyzeErr] = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const [shared, setShared]       = useState(false);
  const fileRef = useRef();

  // ── Auto-refresh daily analysis ──────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => {
      setNextUpdate(n => {
        if (n <= 1) { setDaily(generateDailyAnalysis()); return 120 * 60; }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const fmtCountdown = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  // ── Auth ─────────────────────────────────────────────────────────────────
  const login = () => {
    const u = USERS[email.trim().toLowerCase()];
    if (!u || u.pass !== pass) { setLoginErr("بريد إلكتروني أو كلمة مرور غير صحيحة"); return; }
    setUser({ email, ...u });
    setLoginModal(false);
    setLoginErr("");
    if (pendingAction === "analyze") setPage("analyze");
    if (pendingAction === "share") {}
    setPendingAction(null);
  };

  const logout = () => { setUser(null); setPage("feed"); resetAnalyze(); };

  const requireLogin = (action) => {
    if (user) return true;
    setPendingAction(action);
    setLoginModal(true);
    return false;
  };

  // ── Analyze ───────────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    setResult(null); setAnalyzeErr(null); setShared(false);
    const r = new FileReader();
    r.onload = (e) => setImageB64(e.target.result.split(",")[1]);
    r.readAsDataURL(file);
  };
  const resetAnalyze = () => { setImage(null); setImageB64(null); setResult(null); setAnalyzeErr(null); setShared(false); };

  const analyze = async () => {
    if (!imageB64) return;
    if (!apiKey) { setAnalyzeErr("الرجاء إدخال مفتاح Anthropic API أولاً."); return; }
    setLoading(true); setAnalyzeErr(null); setResult(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: AI_PROMPT,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageB64 } },
            { type: "text", text: "حلل هذا الشارت وأعطني JSON فقط." }
          ]}]
        }),
      });
      const data = await res.json();
      const txt = data.content?.map(i => i.text || "").join("") || "";
      setResult(JSON.parse(txt.replace(/```json|```/g, "").trim()));
    } catch { setAnalyzeErr("تعذّر تحليل الصورة. تأكد من وضوح الشارت ومفتاح API الصحيح."); }
    finally { setLoading(false); }
  };

  const shareToFeed = () => {
    if (!requireLogin("share")) return;
    if (!result || result.signal === "NO_SIGNAL") return;
    setFeed(f => [{ id: Date.now(), user: user.name, avatar: user.avatar, time: "الآن",
      pair: result.pair, tf: result.timeframe || "—", signal: result.signal,
      confidence: result.confidence, entry: result.entry, target: result.target, stop: result.stop,
      summary: result.summary, patterns: result.patterns || [], score: result.score, likes: 0, chartThumb: image,
    }, ...f]);
    setShared(true);
  };

  const toggleLike = (id) => {
    if (!requireLogin("like")) return;
    setFeed(f => f.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  // ══════════════════════════════════════════════════════════════════════════
  // LOGIN MODAL
  // ══════════════════════════════════════════════════════════════════════════
  const LoginModal = () => (
    <div style={S.modalBack} onClick={() => setLoginModal(false)}>
      <div style={S.modalBox} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div style={S.modalLogo}>
            <span style={{ color: "#4ade80", fontSize: 22 }}>◈</span>
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 2 }}>FOR<span style={{ color: "#4ade80" }}>711</span></span>
          </div>
          <button style={S.modalClose} onClick={() => setLoginModal(false)}>✕</button>
        </div>
        <p style={S.modalSub}>سجّل الدخول للمشاركة والتحليل</p>

        <label style={S.label}>البريد الإلكتروني</label>
        <input style={S.input} type="email" placeholder="example@fx.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />

        <label style={S.label}>كلمة المرور</label>
        <input style={S.input} type="password" placeholder="••••••"
          value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()} />

        {loginErr && <p style={S.loginErr}>{loginErr}</p>}

        <button style={S.loginBtn} onClick={login}>دخول</button>

        <div style={S.demoWrap}>
          <p style={S.demoTitle}>حسابات تجريبية:</p>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(USERS).map(([e, u]) => (
              <button key={e} style={S.demoChip}
                onClick={() => { setEmail(e); setPass(u.pass); setLoginErr(""); }}>
                {u.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // NAV
  // ══════════════════════════════════════════════════════════════════════════
  const Nav = () => (
    <header style={S.nav}>
      <div style={S.navLogo}>
        <span style={{ color: "#4ade80", fontSize: 18 }}>◈</span>
        <span style={{ fontWeight: 800, letterSpacing: 2, fontSize: 15 }}>FOR<span style={{ color: "#4ade80" }}>711</span></span>
      </div>
      <div style={S.navTabs}>
        {[
          { id: "feed",    label: "📰 التحليلات" },
          { id: "daily",   label: "🌐 يومي" },
          { id: "analyze", label: "📊 تحليل" },
        ].map(t => (
          <button key={t.id} style={{ ...S.navTab, ...(page === t.id ? S.navTabActive : {}) }}
            onClick={() => {
              if (t.id === "analyze" && !requireLogin("analyze")) return;
              setPage(t.id);
              if (t.id !== "analyze") resetAnalyze();
            }}>
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={S.avatarBubble}>{user.avatar}</div>
            <button style={S.logoutBtn} onClick={logout}>خروج</button>
          </div>
        ) : (
          <button style={S.loginNavBtn} onClick={() => setLoginModal(true)}>دخول</button>
        )}
      </div>
    </header>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // FEED PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const FeedPage = () => (
    <div style={S.pageWrap}>
      <div style={S.pageHeader}>
        <div>
          <h2 style={S.pageTitle}>تحليلات المجتمع</h2>
          <p style={S.pageSub}>{feed.length} تحليل منشور</p>
        </div>
        <button style={S.ctaBtn} onClick={() => {
          if (!requireLogin("analyze")) return;
          setPage("analyze"); resetAnalyze();
        }}>+ نشر تحليل</button>
      </div>

      {feed.length === 0 && <div style={S.empty}>لا توجد تحليلات بعد. كن أول من يشارك!</div>}

      {feed.map(post => {
        const isBuy = post.signal === "BUY";
        return (
          <div key={post.id} style={S.card}>
            <div style={S.cardHead}>
              <div style={S.postAv}>{post.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={S.postName}>{post.user}</div>
                <div style={S.postTime}>{post.time}</div>
              </div>
              <div style={{ ...S.sigBadge, background: isBuy ? "#052e16" : "#1c0607", color: isBuy ? "#4ade80" : "#f87171", borderColor: isBuy ? "#4ade80" : "#f87171" }}>
                {isBuy ? "🟢 شراء" : "🔴 بيع"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={S.pairBig}>{post.pair}</span>
              <span style={S.tfTag}>{post.tf}</span>
              <span style={{ fontSize: 11, color: "#78716c", marginRight: "auto" }}>{post.confidence}</span>
            </div>
            {post.chartThumb && <img src={post.chartThumb} alt="" style={S.cardThumb} />}
            <p style={S.cardSummary}>{post.summary}</p>
            <div style={S.priceGrid}>
              {[
                { l: "دخول", v: post.entry?.toFixed(post.pair.includes("JPY") ? 2 : 5), c: "#e7e5e4", b: "#292524" },
                { l: "هدف", v: post.target?.toFixed(post.pair.includes("JPY") ? 2 : 5), c: "#4ade80", b: "#4ade80" },
                { l: "وقف", v: post.stop?.toFixed(post.pair.includes("JPY") ? 2 : 5), c: "#f87171", b: "#f87171" },
              ].map(p => (
                <div key={p.l} style={{ ...S.priceBox, borderColor: p.b }}>
                  <span style={S.priceL}>{p.l}</span>
                  <span style={{ ...S.priceV, color: p.c }}>{p.v}</span>
                </div>
              ))}
            </div>
            {post.patterns?.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {post.patterns.map((p, i) => <span key={i} style={S.tag}>{p}</span>)}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= post.score ? (isBuy ? "#4ade80" : "#f87171") : "#1c1917" }} />
                ))}
              </div>
              <button style={S.likeBtn} onClick={() => toggleLike(post.id)}>👍 {post.likes}</button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // DAILY PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const DailyPage = () => (
    <div style={S.pageWrap}>
      <div style={S.pageHeader}>
        <div>
          <h2 style={S.pageTitle}>التحليل اليومي</h2>
          <p style={S.pageSub}>العملات الرئيسية — يتجدد كل ساعتين</p>
        </div>
        <div style={S.countdownBox}>
          <span style={S.countdownLabel}>التحديث القادم</span>
          <span style={S.countdownTime}>{fmtCountdown(nextUpdate)}</span>
        </div>
      </div>

      <div style={S.dailyGrid}>
        {daily.map((d) => {
          const isBuy = d.signal === "BUY";
          const isSell = d.signal === "SELL";
          const noSig = d.signal === "NO_SIGNAL";
          return (
            <div key={d.pair} style={{ ...S.dailyCard, borderColor: isBuy ? "#14532d" : isSell ? "#450a0a" : "#1c1917" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={S.pairBig}>{d.pair}</span>
                <span style={{ ...S.sigBadgeSmall, background: isBuy ? "#052e16" : isSell ? "#1c0607" : "#1c1917", color: isBuy ? "#4ade80" : isSell ? "#f87171" : "#78716c", borderColor: isBuy ? "#166534" : isSell ? "#7f1d1d" : "#292524" }}>
                  {isBuy ? "🟢 شراء" : isSell ? "🔴 بيع" : "⚪ انتظار"}
                </span>
              </div>
              <p style={{ fontSize: 11, color: "#78716c", margin: "0 0 10px", lineHeight: 1.5 }}>{d.summary}</p>
              {!noSig && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
                  {[
                    { l: "دخول", v: d.entry, c: "#e7e5e4", b: "#292524" },
                    { l: "هدف", v: d.target, c: "#4ade80", b: "#14532d" },
                    { l: "وقف", v: d.stop, c: "#f87171", b: "#7f1d1d" },
                  ].map(p => (
                    <div key={p.l} style={{ ...S.priceBox, borderColor: p.b, padding: "8px 6px" }}>
                      <span style={S.priceL}>{p.l}</span>
                      <span style={{ ...S.priceV, color: p.c, fontSize: 11 }}>{p.v}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {d.patterns.map((p, i) => <span key={i} style={S.tag}>{p}</span>)}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[["EMA", d.ema], ["RSI", d.rsi], ["ATR", d.atr]].map(([l, v]) => (
                  <div key={l} style={S.miniChip}><span style={{ fontSize: 9, color: "#44403c" }}>{l}</span><span style={{ fontSize: 10, color: "#a8a29e", fontWeight: 600 }}>{v}</span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // ANALYZE PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const isBuy = result?.signal === "BUY";
  const isSell = result?.signal === "SELL";
  const noSignal = result?.signal === "NO_SIGNAL";

  const AnalyzePage = () => (
    <div style={S.pageWrap}>
      <div style={S.pageHeader}>
        <div>
          <h2 style={S.pageTitle}>تحليل شارت</h2>
          <p style={S.pageSub}>ارفع صورة الشارت للتحليل الفوري</p>
        </div>
      </div>

      {/* ── حقل مفتاح API ── */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>مفتاح Anthropic API</label>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          style={S.input}
        />
        <p style={{ fontSize: 10, color: "#44403c", margin: "4px 0 0" }}>
          أدخل مفتاح API من حسابك في Anthropic (Claude Vision).
        </p>
      </div>

      {!result && (
        <>
          <div
            style={{ ...S.uploadZone, ...(dragOver ? S.uploadHover : {}) }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); }}
            onClick={() => !image && fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept="image/*" onChange={e => processFile(e.target.files[0])} style={{ display: "none" }} />
            {image ? (
              <div style={{ position: "relative", width: "100%", borderRadius: 10, overflow: "hidden" }}>
                <img src={image} alt="chart" style={{ width: "100%", display: "block", maxHeight: 300, objectFit: "contain", borderRadius: 10 }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent,rgba(0,0,0,0.7))", display: "flex", justifyContent: "center", padding: "16px 0 10px" }}>
                  <button style={S.changeBtn} onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>تغيير الصورة</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/><path d="m7 6 5-3 5 3"/>
                </svg>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fafaf9", margin: "0 0 6px" }}>ارفع صورة الشارت</p>
                <p style={{ color: "#78716c", fontSize: 13, margin: "0 0 8px" }}>اسحب وأفلت أو انقر للاختيار</p>
                <p style={{ color: "#44403c", fontSize: 11, margin: 0, letterSpacing: 2 }}>PNG · JPG · WebP</p>
              </div>
            )}
          </div>
          {image && (
            <button style={{ ...S.analyzeBtn, ...(loading ? { opacity: 0.7, cursor: "not-allowed" } : {}) }} onClick={analyze} disabled={loading || !apiKey}>
              {loading
                ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span style={S.spinner} />جاري التحليل...
                  </span>
                : "▶ تحليل الشارت الآن"}
            </button>
          )}
        </>
      )}

      {analyzeErr && <div style={S.errBox}>{analyzeErr}</div>}

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...S.banner, background: isBuy ? "linear-gradient(135deg,#052e16,#14532d)" : isSell ? "linear-gradient(135deg,#1c0607,#450a0a)" : "linear-gradient(135deg,#1c1917,#292524)", borderColor: isBuy ? "#4ade80" : isSell ? "#f87171" : "#78716c" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#fafaf9" }}>{result.pair}</span>
              {result.timeframe && <span style={S.tfTag}>{result.timeframe}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: isBuy ? "#4ade80" : isSell ? "#f87171" : "#a8a29e" }}>
                {isBuy ? "🟢 شراء" : isSell ? "🔴 بيع" : "⚪ لا إشارة"}
              </span>
              {!noSignal && <span style={S.confBadge}>{result.confidence}</span>}
            </div>
            <p style={{ color: "#a8a29e", fontSize: 13, margin: 0 }}>{noSignal ? "السوق لا يوفر ظروفاً مثالية حالياً." : result.summary}</p>
          </div>

          {!noSignal && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ l:"دخول",v:result.entry?.toFixed(5),c:"#e7e5e4",b:"#292524"},{l:"هدف +29",v:result.target?.toFixed(5),c:"#4ade80",b:"#4ade80"},{l:"وقف -16",v:result.stop?.toFixed(5),c:"#f87171",b:"#f87171"}].map(p => (
                <div key={p.l} style={{ ...S.priceBox, borderColor: p.b, padding: "14px 10px", textAlign: "center" }}>
                  <span style={S.priceL}>{p.l}</span>
                  <span style={{ ...S.priceV, color: p.c, fontSize: 13 }}>{p.v}</span>
                </div>
              ))}
            </div>
          )}

          {!noSignal && (
            <div style={{ background: "#111110", border: "1px solid #1c1917", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#78716c" }}>قوة الإشارة</span>
              <div style={{ display: "flex", gap: 6, flex: 1 }}>
                {[1,2,3,4,5].map(i => <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i <= result.score ? (isBuy ? "#4ade80" : "#f87171") : "#292524" }} />)}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#a8a29e" }}>{result.score}/5</span>
            </div>
          )}

          {result.patterns?.length > 0 && (
            <div style={S.section}>
              <p style={S.secLabel}>النماذج</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.patterns.map((p, i) => <span key={i} style={S.tag}>{p}</span>)}
              </div>
            </div>
          )}

          {result.reasons?.length > 0 && (
            <div style={S.section}>
              <p style={S.secLabel}>أسباب التوصية</p>
              {result.reasons.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "#d6d3d1", marginBottom: 6 }}>
                  <span style={{ color: "#4ade80", fontSize: 8, marginTop: 5 }}>◆</span>{r}
                </div>
              ))}
            </div>
          )}

          {result.news_warning && <div style={S.newsBox}>⚠️ قد يكون هناك خبر اقتصادي قريب. تحقق من التقويم قبل الدخول.</div>}

          <div style={{ display: "flex", gap: 10 }}>
            <button style={S.newBtn} onClick={resetAnalyze}>+ تحليل جديد</button>
            {!noSignal && !shared && (
              <button style={S.shareBtn} onClick={shareToFeed}>📤 شارك التحليل</button>
            )}
            {shared && <div style={S.sharedOk}>✅ تم النشر!</div>}
          </div>

          <p style={{ fontSize: 11, color: "#44403c", textAlign: "center", lineHeight: 1.6 }}>
            ⚠️ للأغراض التعليمية فقط. التداول ينطوي على مخاطر.
          </p>
        </div>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={S.root}>
      {loginModal && <LoginModal />}
      <Nav />
      {page === "feed"    && <FeedPage />}
      {page === "daily"   && <DailyPage />}
      {page === "analyze" && <AnalyzePage />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════
const S = {
  root: { minHeight: "100vh", background: "#0c0a09", color: "#e7e5e4", fontFamily: "'Segoe UI',Tahoma,Arial,sans-serif", direction: "rtl" },

  // Modal
  modalBack: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
  modalBox: { background: "#111110", border: "1px solid #292524", borderRadius: 18, padding: "24px 22px", width: "100%", maxWidth: 380 },
  modalHead: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  modalLogo: { display: "flex", alignItems: "center", gap: 8 },
  modalClose: { background: "none", border: "none", color: "#78716c", fontSize: 18, cursor: "pointer" },
  modalSub: { color: "#78716c", fontSize: 12, margin: "0 0 20px" },
  label: { display: "block", fontSize: 12, color: "#78716c", marginBottom: 6 },
  input: { width: "100%", background: "#1c1917", border: "1px solid #292524", borderRadius: 8, padding: "11px 14px", color: "#e7e5e4", fontSize: 14, marginBottom: 14, boxSizing: "border-box", outline: "none" },
  loginErr: { color: "#f87171", fontSize: 12, margin: "0 0 12px", textAlign: "center" },
  loginBtn: { width: "100%", background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 10, color: "#fff", fontSize: 15, fontWeight: 700, padding: "13px", cursor: "pointer", marginBottom: 18 },
  demoWrap: { borderTop: "1px solid #1c1917", paddingTop: 14 },
  demoTitle: { fontSize: 11, color: "#44403c", margin: "0 0 8px" },
  demoChip: { background: "#1c1917", border: "1px solid #292524", borderRadius: 20, color: "#a8a29e", fontSize: 12, padding: "5px 14px", cursor: "pointer" },

  // Nav
  nav: { display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #1c1917", gap: 10, position: "sticky", top: 0, background: "#0c0a09", zIndex: 50 },
  navLogo: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0 },
  navTabs: { display: "flex", gap: 4, flex: 1, justifyContent: "center" },
  navTab: { background: "transparent", border: "1px solid #1c1917", borderRadius: 20, color: "#78716c", fontSize: 12, padding: "7px 14px", cursor: "pointer" },
  navTabActive: { background: "#1c1917", color: "#e7e5e4", borderColor: "#292524" },
  avatarBubble: { width: 30, height: 30, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 },
  logoutBtn: { background: "none", border: "none", color: "#78716c", fontSize: 12, cursor: "pointer" },
  loginNavBtn: { background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 700, padding: "7px 16px", cursor: "pointer" },

  // Page
  pageWrap: { maxWidth: 600, margin: "0 auto", padding: "20px 14px 60px" },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 12 },
  pageTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: "#fafaf9" },
  pageSub: { margin: "4px 0 0", fontSize: 12, color: "#78716c" },
  ctaBtn: { background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 20, color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 18px", cursor: "pointer", flexShrink: 0 },
  empty: { textAlign: "center", color: "#44403c", padding: "60px 0", fontSize: 14 },

  // Daily
  countdownBox: { background: "#111110", border: "1px solid #1c1917", borderRadius: 10, padding: "8px 14px", textAlign: "center", flexShrink: 0 },
  countdownLabel: { display: "block", fontSize: 9, color: "#44403c", letterSpacing: 1, marginBottom: 2 },
  countdownTime: { fontSize: 16, fontWeight: 800, color: "#4ade80", fontFamily: "monospace", letterSpacing: 2 },
  dailyGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  dailyCard: { background: "#111110", border: "1px solid", borderRadius: 12, padding: "14px" },
  sigBadgeSmall: { fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: "1px solid", flexShrink: 0 },
  miniChip: { background: "#1c1917", borderRadius: 6, padding: "5px 8px", display: "flex", flexDirection: "column", gap: 1, alignItems: "center" },

  // Feed
  card: { background: "#111110", border: "1px solid #1c1917", borderRadius: 14, padding: 16, marginBottom: 12 },
  cardHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  postAv: { width: 34, height: 34, borderRadius: "50%", background: "#292524", color: "#a8a29e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  postName: { fontSize: 14, fontWeight: 700, color: "#fafaf9" },
  postTime: { fontSize: 11, color: "#44403c", marginTop: 2 },
  sigBadge: { fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, border: "1px solid", flexShrink: 0 },
  pairBig: { fontSize: 16, fontWeight: 800, color: "#fafaf9", letterSpacing: 1 },
  tfTag: { fontSize: 10, color: "#78716c", background: "#1c1917", padding: "2px 9px", borderRadius: 20, border: "1px solid #292524" },
  cardThumb: { width: "100%", borderRadius: 8, marginBottom: 10, maxHeight: 140, objectFit: "cover" },
  cardSummary: { fontSize: 13, color: "#a8a29e", margin: "0 0 12px", lineHeight: 1.6 },
  priceGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 },
  priceBox: { background: "#1c1917", border: "1px solid", borderRadius: 8, padding: "10px 8px", textAlign: "center" },
  priceL: { display: "block", fontSize: 9, color: "#78716c", marginBottom: 4, letterSpacing: 0.5 },
  priceV: { fontSize: 12, fontWeight: 700, fontFamily: "monospace" },
  tag: { background: "#1c1917", border: "1px solid #292524", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#78716c" },
  likeBtn: { background: "#1c1917", border: "1px solid #292524", borderRadius: 20, color: "#a8a29e", fontSize: 12, padding: "5px 14px", cursor: "pointer" },

  // Analyze
  uploadZone: { border: "2px dashed #292524", borderRadius: 16, padding: 32, cursor: "pointer", background: "#111110", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  uploadHover: { borderColor: "#4ade80", background: "#0a1f0f" },
  changeBtn: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 20, padding: "6px 18px", fontSize: 12, cursor: "pointer" },
  analyzeBtn: { width: "100%", marginTop: 14, padding: "15px", background: "linear-gradient(135deg,#16a34a,#15803d)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  spinner: { width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  errBox: { marginTop: 14, padding: "13px 18px", background: "#1c0607", border: "1px solid #7f1d1d", borderRadius: 10, color: "#fca5a5", fontSize: 14, textAlign: "center" },
  banner: { border: "1px solid", borderRadius: 14, padding: "20px 22px" },
  confBadge: { fontSize: 12, color: "#d6d3d1", background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: 20 },
  section: { background: "#111110", border: "1px solid #1c1917", borderRadius: 12, padding: "14px 16px" },
  secLabel: { fontSize: 11, color: "#78716c", margin: "0 0 10px", letterSpacing: 1, textTransform: "uppercase" },
  newsBox: { background: "#1c1200", border: "1px solid #713f12", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fbbf24" },
  newBtn: { flex: 1, padding: "13px", background: "#1c1917", border: "1px solid #292524", borderRadius: 10, color: "#a8a29e", fontSize: 14, cursor: "pointer", fontWeight: 600 },
  shareBtn: { flex: 1, padding: "13px", background: "linear-gradient(135deg,#1d4ed8,#1e40af)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, cursor: "pointer", fontWeight: 700 },
  sharedOk: { flex: 1, padding: "13px", background: "#052e16", border: "1px solid #4ade80", borderRadius: 10, color: "#4ade80", fontSize: 13, textAlign: "center", fontWeight: 600 },
};
