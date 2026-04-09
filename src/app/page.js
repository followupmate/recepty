'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { recipes as R, categories as CATS, getEmoji } from '../data/recipes';

/* ─── GRADIENT SYSTEM ─────────────────────────────────────────────────────
   Each category has its own warm palette. Recipe id shifts hue ±10°
   so cards in the same category still look individual.               */
const catGradient = (cat, id = 0) => {
  const s = ((id * 17) % 20) - 10; // hue shift -10…+10
  const m = {
    ranajky:   [30,  100, 94, 35,  100, 88],
    predjedla: [88,   55, 95, 92,   50, 86],
    hlavne:    [20,   18, 92, 22,   16, 83],
    prilohy:   [130,  40, 93, 133,  38, 84],
    omacky:    [8,    75, 94, 14,   78, 87],
    dezerty:   [45,  100, 94, 48,  100, 87],
  };
  const b = m[cat] || [80, 30, 93, 85, 28, 85];
  return `linear-gradient(135deg, hsl(${b[0]+s},${b[1]}%,${b[2]}%), hsl(${b[3]+s},${b[4]}%,${b[5]}%))`;
};

/* ─── GREETING ──────────────────────────────────────────────────────────── */
const greeting = () => {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Dobré ráno ☀️ Čo dnes na raňajky?';
  if (h >= 12 && h < 17) return 'Dobré popoludnie 🍽️ Čas na inšpiráciu?';
  if (h >= 17)            return 'Dobrý večer 🌙 Čo na večeru?';
  return 'Nočná chuťovka? 🦉';
};

/* ─── HERO CARD ─────────────────────────────────────────────────────────── */
function HeroCard({ r, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: catGradient(r.cat, r.id),
        borderRadius: 24,
        padding: '28px 24px 24px',
        cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        boxShadow: h ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'all 0.25s ease',
        marginBottom: 4,
      }}
    >
      {/* Label */}
      <p style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--tertiary)', marginBottom: 14, fontFamily: 'var(--font-body)',
      }}>Recept dňa</p>

      {/* Emoji — top right, glassmorphism circle */}
      <div style={{
        position: 'absolute', top: 22, right: 22,
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
      }}>{getEmoji(r.t)}</div>

      {/* Title */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.75rem', fontWeight: 700,
        color: 'var(--on-surface)', lineHeight: 1.2,
        margin: '0 88px 14px 0', letterSpacing: '-0.01em',
      }}>{r.t}</h2>

      {/* Meta */}
      <p style={{
        fontSize: 11, color: 'var(--secondary)',
        fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
        fontWeight: 600, textTransform: 'uppercase',
      }}>
        {r.ing.length} ingrediencií · {r.s.length} {r.s.length === 1 ? 'krok' : r.s.length < 5 ? 'kroky' : 'krokov'}
      </p>

      {/* "Otvoriť" hint */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        marginTop: 16, padding: '6px 14px', borderRadius: 9999,
        background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(6px)',
        fontSize: 12, fontWeight: 600, color: 'var(--tertiary)',
        fontFamily: 'var(--font-body)',
      }}>Otvoriť recept →</div>
    </div>
  );
}

/* ─── LARGE CARD (every 5th in list) ───────────────────────────────────── */
function LargeCard({ r, onClick, fav, onFav }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: catGradient(r.cat, r.id),
        borderRadius: 24, height: 180,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: h ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Emoji top-right */}
      <div style={{
        position: 'absolute', top: 18, right: 18,
        width: 58, height: 58, borderRadius: '50%',
        background: 'rgba(255,255,255,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
      }}>{getEmoji(r.t)}</div>

      {/* Fav */}
      <button
        onClick={e => { e.stopPropagation(); onFav(r.id); }}
        style={{
          position: 'absolute', bottom: 18, right: 18,
          background: 'rgba(255,255,255,0.55)', border: 'none',
          width: 32, height: 32, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, cursor: 'pointer',
        }}
      >{fav ? '❤️' : '🤍'}</button>

      {/* Content — bottom left */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px' }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.15rem', fontWeight: 700,
          color: 'var(--on-surface)', lineHeight: 1.2,
          margin: '0 56px 6px 0', letterSpacing: '-0.01em',
        }}>{r.t}</h3>
        <p style={{
          fontSize: 10, color: 'var(--secondary)',
          fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
          fontWeight: 600, textTransform: 'uppercase', margin: 0,
        }}>
          {r.ing.length} ingrediencií · {r.s.length} {r.s.length === 1 ? 'krok' : r.s.length < 5 ? 'kroky' : 'krokov'}
        </p>
      </div>
    </div>
  );
}

/* ─── STANDARD CARD ─────────────────────────────────────────────────────── */
function StandardCard({ r, onClick, fav, onFav }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 24, cursor: 'pointer',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        boxShadow: h ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: h ? 'translateY(-2px)' : 'none',
        transition: 'all 0.25s ease',
        padding: 0,
      }}
    >
      {/* Left gradient stripe — 4px */}
      <div style={{
        width: 4, alignSelf: 'stretch', flexShrink: 0,
        background: catGradient(r.cat, r.id),
      }} />

      {/* Emoji in gradient circle */}
      <div style={{
        width: 52, height: 52, borderRadius: 16, flexShrink: 0,
        margin: '14px 14px 14px 16px',
        background: catGradient(r.cat, r.id),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
      }}>{getEmoji(r.t)}</div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.3,
          fontFamily: 'var(--font-display)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 5,
        }}>{r.t}</div>
        <div style={{
          fontSize: '0.75rem', color: 'var(--secondary)',
          fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
          fontWeight: 600, textTransform: 'uppercase',
        }}>
          {r.ing.length} INGREDIENCIÍ · {r.s.length} {r.s.length === 1 ? 'KROK' : r.s.length < 5 ? 'KROKY' : 'KROKOV'}
        </div>
      </div>

      {/* Fav */}
      <button
        onClick={e => { e.stopPropagation(); onFav(r.id); }}
        style={{
          background: 'none', border: 'none', fontSize: 18,
          padding: '14px 16px 14px 8px', flexShrink: 0,
          transition: 'transform 0.15s',
          transform: h ? 'scale(1.15)' : 'scale(1)',
        }}
      >{fav ? '❤️' : '🤍'}</button>
    </div>
  );
}

/* ─── BOTTOM NAV ────────────────────────────────────────────────────────── */
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',     icon: '⌂',  label: 'Domov' },
    { id: 'list',     icon: '☰',  label: 'Zoznam' },
    { id: 'favs',     icon: '♡',  label: 'Obľúbené' },
    { id: 'settings', icon: '⚙',  label: 'Nast.' },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 -1px 0 rgba(157,188,121,0.2), 0 -6px 20px rgba(33,57,4,0.05)',
      display: 'flex', alignItems: 'stretch',
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, border: 'none', background: 'none',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 3, cursor: 'pointer', position: 'relative',
              color: active ? 'var(--primary)' : '#8C8177',
              transition: 'color 0.2s ease',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>
              {t.id === 'favs' && active ? '♥' : t.icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{t.label}</span>
            {/* Active dot */}
            {active && (
              <span style={{
                position: 'absolute', bottom: 7,
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--primary)',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ─── DETAIL ────────────────────────────────────────────────────────────── */
function Detail({ r, onBack, sv, setSv }) {
  const base = r.bp || 1;
  const [checkedIngs, setCheckedIngs] = useState([]);

  const fmt = (a, u) => {
    if (a === 0) return u || 'podľa chuti';
    return `${Math.round(a / base * sv * 10) / 10} ${u}`;
  };
  const toggleIng = (i) => setCheckedIngs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const gradBtnStyle = {
    background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
    border: 'none', color: 'var(--on-primary)', fontWeight: 700,
    width: 36, height: 36, borderRadius: '50%', fontSize: 18,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(157,69,0,0.26)', cursor: 'pointer',
  };

  return (
    <>
      {/* Full-width gradient header — bleeds to screen edges */}
      <div style={{
        background: catGradient(r.cat, r.id),
        height: 200,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Back — glassmorphism pill */}
        <button onClick={onBack} style={{
          position: 'absolute', top: 16, left: 16,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(8px)',
          border: 'none', color: 'var(--on-surface)',
          padding: '6px 16px', borderRadius: 9999, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer',
        }}>← Späť</button>

        {/* Hero emoji */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.52)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 10,
        }}>{getEmoji(r.t)}</div>

        {/* Category badge */}
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--tertiary)', fontFamily: 'var(--font-body)',
          background: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: 9999,
        }}>{r.cat || 'recept'}</span>
      </div>

      {/* Content — padded, max-width centered */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 16px 32px 24px' }}>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 5.5vw, 2.25rem)',
          color: 'var(--on-surface)',
          margin: '0 0 32px', fontWeight: 700,
          textAlign: 'center', lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}>{r.t}</h1>

        {/* Serving adjuster */}
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: 16, padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 32, boxShadow: 'var(--ghost-border)',
        }}>
          <span style={{
            fontSize: 11, color: 'var(--on-surface-variant)',
            fontWeight: 700, letterSpacing: '0.1em',
            fontFamily: 'var(--font-body)', textTransform: 'uppercase',
          }}>Porcie</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSv(Math.max(1, sv - 1))} style={gradBtnStyle}>−</button>
            <span style={{
              fontSize: 22, fontWeight: 700, color: 'var(--on-surface)',
              minWidth: 28, textAlign: 'center', fontFamily: 'var(--font-display)',
            }}>{sv}</span>
            <button onClick={() => setSv(sv + 1)} style={gradBtnStyle}>+</button>
          </div>
        </div>

        {/* Ingredients — surface-container-low, NO dividers */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 20,
          margin: '0 0 12px', fontWeight: 700, color: 'var(--on-surface)',
          letterSpacing: '-0.01em',
        }}>Ingrediencie</h2>
        <div style={{
          background: 'var(--surface-container-low)',
          borderRadius: 16, overflow: 'hidden', marginBottom: 32,
          boxShadow: 'var(--ghost-border)',
        }}>
          {r.ing.map(([name, amt, unit], i) => (
            <div
              key={i}
              onClick={() => toggleIng(i)}
              style={{
                padding: '13px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer',
                opacity: checkedIngs.includes(i) ? 0.38 : 1,
                transition: 'opacity 0.22s ease',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.4)',
              }}
            >
              <span style={{
                fontSize: 15, lineHeight: 1.6,
                fontFamily: 'var(--font-body)', color: 'var(--on-surface)',
                textDecoration: checkedIngs.includes(i) ? 'line-through' : 'none',
              }}>{name}</span>
              <span style={{
                color: 'var(--primary)', fontSize: 14, fontWeight: 700,
                whiteSpace: 'nowrap', marginLeft: 16, fontFamily: 'var(--font-body)',
              }}>{fmt(amt, unit)}</span>
            </div>
          ))}
        </div>

        {/* Steps — gradient numbered circles */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 20,
          margin: '0 0 18px', fontWeight: 700, color: 'var(--on-surface)',
          letterSpacing: '-0.01em',
        }}>Postup</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
          {r.s.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                minWidth: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                color: 'var(--on-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)',
                boxShadow: '0 3px 10px rgba(157,69,0,0.22)',
              }}>{i + 1}</div>
              <p style={{
                margin: 0, fontSize: 15, lineHeight: 1.7,
                color: 'var(--on-surface)', fontFamily: 'var(--font-body)', paddingTop: 5,
              }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sel, setSel] = useState(null);
  const [sv, setSv] = useState(1);
  const [favs, setFavs] = useState([]);
  const [tab, setTab] = useState('home');

  // Random featured recipe — fixed per session
  const [featured] = useState(() => R[Math.floor(Math.random() * R.length)]);

  useEffect(() => {
    try { const s = localStorage.getItem('nase-recepty-favs'); if (s) setFavs(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('nase-recepty-favs', JSON.stringify(favs)); } catch {}
  }, [favs]);
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const toggleFav = useCallback(id => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]), []);

  const openRecipe = useCallback((r) => { setSel(r); setSv(r.bp || 1); }, []);

  const random = () => {
    const pool = R;
    openRecipe(pool[Math.floor(Math.random() * pool.length)]);
  };

  const list = useMemo(() => {
    let l = R;
    if (tab === 'favs') l = l.filter(r => favs.includes(r.id));
    if (cat !== 'all') l = l.filter(r => r.cat === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter(r => r.t.toLowerCase().includes(s) || r.ing.some(([n]) => n.toLowerCase().includes(s)));
    }
    return l;
  }, [q, cat, tab, favs]);

  /* Active chip: primary gradient | Inactive: ghost border, transparent */
  const chipStyle = (active) => ({
    padding: '7px 15px', borderRadius: 9999,
    border: active ? 'none' : '1px solid rgba(103,131,70,0.25)',
    background: active
      ? 'linear-gradient(135deg, var(--primary), #e8864a)'
      : 'transparent',
    color: active ? '#fff7f5' : 'var(--secondary)',
    fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap',
    fontFamily: 'var(--font-body)',
    boxShadow: active ? '0 4px 14px rgba(157,69,0,0.26)' : 'none',
    transition: 'all 0.22s ease', cursor: 'pointer',
  });

  /* ── Placeholder tabs ──────────────────────────────────────────── */
  const renderContent = () => {
    if (sel) return (
      <div style={{ paddingBottom: 80 }}>
        <Detail r={sel} onBack={() => { setSel(null); setSv(1); }} sv={sv} setSv={setSv} />
      </div>
    );

    if (tab === 'list') return (
      <div style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingBottom: 80,
      }}>
        <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', padding: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 18 }}>📋</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
            color: 'var(--on-surface)', marginBottom: 10, fontWeight: 700,
          }}>Už čoskoro</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.5 }}>
            Nákupný zoznam ingrediencií
          </p>
        </div>
      </div>
    );

    if (tab === 'settings') return (
      <div style={{
        minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', paddingBottom: 80,
      }}>
        <div style={{ textAlign: 'center', color: 'var(--on-surface-variant)', padding: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 18 }}>⚙️</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
            color: 'var(--on-surface)', marginBottom: 10, fontWeight: 700,
          }}>Nastavenia</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15 }}>Verzia 1.0</p>
        </div>
      </div>
    );

    /* ── Home / Favs list ────────────────────────────────────────── */
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', paddingLeft: 24, paddingRight: 16, paddingBottom: 80 }}>

        {/* Editorial header */}
        <div style={{ paddingTop: 48, marginBottom: 28 }}>
          <p style={{
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--tertiary)', marginBottom: 8,
            fontFamily: 'var(--font-body)', textTransform: 'uppercase',
          }}>{tab === 'favs' ? 'Vaša kolekcia' : 'Rodinná zbierka'}</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 8vw, 2.5rem)',
            fontWeight: 700, color: 'var(--on-surface)',
            lineHeight: 1.05, letterSpacing: '-0.025em', margin: '0 0 10px',
          }}>{tab === 'favs' ? 'Obľúbené' : 'Naše Recepty'}</h1>
          <p style={{
            color: 'var(--secondary)', fontSize: '0.9rem',
            fontFamily: 'var(--font-body)', lineHeight: 1.5, fontStyle: 'italic',
          }}>
            {tab === 'favs'
              ? `${favs.length} uložených receptov`
              : greeting()}
          </p>
        </div>

        {/* Hero card — home tab only */}
        {tab === 'home' && (
          <div style={{ marginBottom: 28 }}>
            <HeroCard r={featured} onClick={() => openRecipe(featured)} />
          </div>
        )}

        {/* Search — pill shape, #cdeda5 bg */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{
            position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'var(--outline)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Hľadaj recept alebo ingredienciu..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '13px 18px 13px 46px',
              borderRadius: 9999,       /* pill */
              border: 'none',
              background: 'var(--surface-container-highest)',
              color: 'var(--on-surface)', fontSize: 15,
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s ease',
            }}
          />
        </div>

        {/* Action row — home only */}
        {tab === 'home' && (
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={random}
              style={{
                padding: '8px 18px', borderRadius: 9999, border: 'none',
                background: 'linear-gradient(135deg, var(--primary), #e8864a)',
                color: '#fff7f5', fontSize: '0.8rem', fontWeight: 600,
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 14px rgba(157,69,0,0.26)',
                cursor: 'pointer',
              }}
            >🎲 Čo dnes?</button>
          </div>
        )}

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? 'all' : c.id)} style={chipStyle(cat === c.id)}>
              {c.e} {c.label}
            </button>
          ))}
        </div>

        {/* Count label */}
        <p style={{
          color: 'var(--on-surface-variant)', fontSize: 11,
          marginBottom: 16, fontFamily: 'var(--font-body)',
          letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase',
        }}>
          {list.length === 0
            ? 'Žiadne recepty'
            : `${list.length} ${list.length === 1 ? 'recept' : list.length < 5 ? 'recepty' : 'receptov'}`}
        </p>

        {/* Mixed card list: large card every 5th */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map((r, idx) =>
            (idx + 1) % 5 === 0 ? (
              <LargeCard key={r.id} r={r}
                onClick={() => openRecipe(r)}
                fav={favs.includes(r.id)} onFav={toggleFav} />
            ) : (
              <StandardCard key={r.id} r={r}
                onClick={() => openRecipe(r)}
                fav={favs.includes(r.id)} onFav={toggleFav} />
            )
          )}
        </div>

        {/* Empty state */}
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--on-surface-variant)' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🍽️</div>
            <p style={{ fontSize: 15, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
              {tab === 'favs'
                ? 'Zatiaľ žiadne obľúbené recepty.'
                : 'Žiadne recepty nezodpovedajú hľadaniu.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      {renderContent()}
      <BottomNav tab={sel ? tab : tab} setTab={(t) => { setSel(null); setTab(t); }} />
    </div>
  );
}
