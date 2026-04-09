'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { recipes as R, categories as CATS, getEmoji } from '../data/recipes';

/* Warm earthy hue per recipe — cycles through golden-green band */
const cardHue = (id) => `hsl(${(id * 47) % 60 + 75}, 52%, 87%)`;

/* ─── CARD ──────────────────────────────────────────────────────── */
function Card({ r, onClick, fav, onFav }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 24,                 /* xl = 1.5rem */
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
        boxShadow: h ? 'var(--shadow-float)' : 'var(--shadow-ambient)',
        transform: h ? 'translateY(-3px)' : 'none',
        display: 'flex', alignItems: 'center',
        padding: '16px 16px 16px 18px',
        gap: 16,
      }}
    >
      {/* Emoji container — xl roundness */}
      <div style={{
        width: 58, height: 58, borderRadius: 20, flexShrink: 0,
        background: cardHue(r.id),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
      }}>
        {getEmoji(r.t)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.3,
          fontFamily: 'var(--font-display)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 5,
        }}>{r.t}</div>
        {/* Metadata — uppercase label style */}
        <div style={{
          fontSize: 11, color: 'var(--on-surface-variant)',
          fontFamily: 'var(--font-body)', letterSpacing: '0.08em', fontWeight: 600,
        }}>
          {r.ing.length} INGREDIENCIÍ · {r.s.length} {r.s.length === 1 ? 'KROK' : r.s.length < 5 ? 'KROKY' : 'KROKOV'}
        </div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onFav(r.id); }}
        style={{
          background: 'none', border: 'none', fontSize: 20,
          padding: '4px 6px', flexShrink: 0,
          transition: 'transform 0.2s ease',
          transform: h ? 'scale(1.18)' : 'scale(1)',
          lineHeight: 1,
        }}
      >
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

/* ─── DETAIL ────────────────────────────────────────────────────── */
function Detail({ r, onBack, sv, setSv }) {
  const base = r.bp || 1;
  const [checkedIngs, setCheckedIngs] = useState([]);

  const fmt = (a, u) => {
    if (a === 0) return u || 'podľa chuti';
    return `${Math.round(a / base * sv * 10) / 10} ${u}`;
  };
  const toggleIng = (i) => setCheckedIngs(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  /* Terracotta gradient button — used for +/- and could be reused */
  const gradBtn = (onClick) => (
    <button onClick={onClick} style={{
      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
      border: 'none', color: 'var(--on-primary)', fontWeight: 700,
      width: 36, height: 36, borderRadius: '50%', fontSize: 18,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 14px rgba(157,69,0,0.26)',
      cursor: 'pointer',
    }} />
  );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>

      {/* Back — secondary ghost border, pill */}
      <button onClick={onBack} style={{
        background: 'transparent',
        border: '1px solid rgba(103,131,70,0.22)',
        color: 'var(--on-surface)',
        padding: '8px 20px', borderRadius: 9999, fontSize: 13,
        marginBottom: 40,
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-body)', fontWeight: 500,
      }}>← Späť</button>

      {/* Hero emoji — large, warm shadow */}
      <div style={{
        width: 88, height: 88, borderRadius: 28, margin: '0 auto 18px',
        background: cardHue(r.id),
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44,
        boxShadow: '0 8px 32px rgba(33,57,4,0.08)',
      }}>{getEmoji(r.t)}</div>

      {/* Category badge — tertiary accent */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--surface-container-low)',
          color: 'var(--tertiary)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '5px 14px', borderRadius: 9999,
          fontFamily: 'var(--font-body)',
        }}>{r.cat || 'recept'}</span>
      </div>

      {/* Recipe title — editorial display */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.9rem, 6vw, 2.6rem)',
        color: 'var(--on-surface)',
        margin: '0 0 36px', fontWeight: 700,
        textAlign: 'center', lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}>{r.t}</h1>

      {/* Serving adjuster — tonal bg + ghost border, gradient buttons */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 20, padding: '16px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 40,
        boxShadow: 'var(--ghost-border)',
      }}>
        <span style={{
          fontSize: 11, color: 'var(--on-surface-variant)',
          fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'var(--font-body)',
        }}>PORCIE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button
            onClick={() => setSv(Math.max(1, sv - 1))}
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              border: 'none', color: 'var(--on-primary)', fontWeight: 700,
              width: 36, height: 36, borderRadius: '50%', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(157,69,0,0.26)', cursor: 'pointer',
            }}
          >−</button>
          <span style={{
            fontSize: 24, fontWeight: 700, color: 'var(--on-surface)',
            minWidth: 32, textAlign: 'center', fontFamily: 'var(--font-display)',
          }}>{sv}</span>
          <button
            onClick={() => setSv(sv + 1)}
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              border: 'none', color: 'var(--on-primary)', fontWeight: 700,
              width: 36, height: 36, borderRadius: '50%', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(157,69,0,0.26)', cursor: 'pointer',
            }}
          >+</button>
        </div>
      </div>

      {/* Ingredients — surface-container-low, NO divider lines */}
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 21,
        margin: '0 0 14px', fontWeight: 700, color: 'var(--on-surface)',
        letterSpacing: '-0.01em',
      }}>Ingrediencie</h2>
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 20, overflow: 'hidden', marginBottom: 40,
        boxShadow: 'var(--ghost-border)',
      }}>
        {r.ing.map(([name, amt, unit], i) => (
          <div
            key={i}
            onClick={() => toggleIng(i)}
            style={{
              padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
              opacity: checkedIngs.includes(i) ? 0.38 : 1,
              transition: 'opacity 0.22s ease',
              /* Alternating rows via subtle tint — no lines */
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.38)',
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

      {/* Steps — gradient numbered circles, white text */}
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 21,
        margin: '0 0 18px', fontWeight: 700, color: 'var(--on-surface)',
        letterSpacing: '-0.01em',
      }}>Postup</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 72 }}>
        {r.s.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              minWidth: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              color: 'var(--on-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
              fontFamily: 'var(--font-body)',
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
  );
}

/* ─── HOME ──────────────────────────────────────────────────────── */
export default function Home() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sel, setSel] = useState(null);
  const [sv, setSv] = useState(1);
  const [favs, setFavs] = useState([]);
  const [showFav, setShowFav] = useState(false);

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
  const random = () => {
    const pool = showFav && favs.length ? R.filter(r => favs.includes(r.id)) : R;
    setSel(pool[Math.floor(Math.random() * pool.length)]); setSv(1);
  };

  const list = useMemo(() => {
    let l = R;
    if (showFav) l = l.filter(r => favs.includes(r.id));
    if (cat !== 'all') l = l.filter(r => r.cat === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter(r => r.t.toLowerCase().includes(s) || r.ing.some(([n]) => n.toLowerCase().includes(s)));
    }
    return l;
  }, [q, cat, showFav, favs]);

  /* Active: terracotta gradient | Inactive: ghost border, transparent fill */
  const chipStyle = (active) => ({
    padding: '8px 18px', borderRadius: 9999,
    border: active ? 'none' : '1px solid rgba(103,131,70,0.22)',
    background: active
      ? 'linear-gradient(135deg, var(--primary), var(--primary-container))'
      : 'transparent',
    color: active ? 'var(--on-primary)' : 'var(--on-surface-variant)',
    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    fontFamily: 'var(--font-body)',
    boxShadow: active ? '0 4px 14px rgba(157,69,0,0.26)' : 'none',
    transition: 'all 0.22s ease', cursor: 'pointer',
  });

  if (sel) return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', padding: '28px 16px 80px 24px' }}>
      <Detail r={sel} onBack={() => { setSel(null); setSv(1); }} sv={sv} setSv={setSv} />
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', paddingBottom: 80 }}>
      {/* Asymmetrical: 24px left, 16px right — editorial layout */}
      <div style={{ maxWidth: 600, margin: '0 auto', paddingLeft: 24, paddingRight: 16 }}>

        {/* ── Editorial header ─────────────────────────────────── */}
        <div style={{ paddingTop: 48, marginBottom: 40 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            color: 'var(--tertiary)', marginBottom: 10,
            fontFamily: 'var(--font-body)', textTransform: 'uppercase',
          }}>Rodinná zbierka</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 9vw, 3.2rem)',
            fontWeight: 700, color: 'var(--on-surface)',
            lineHeight: 1.05, letterSpacing: '-0.025em', margin: '0 0 12px',
          }}>Naše Recepty</h1>
          <p style={{
            color: 'var(--on-surface-variant)', fontSize: 14,
            fontFamily: 'var(--font-body)', lineHeight: 1.5,
          }}>{R.length} receptov · rodinná zbierka</p>
        </div>

        {/* ── Search — #cdeda5 bg, 1rem radius, no border ──────── */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <span style={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            fontSize: 15, color: 'var(--on-surface-variant)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Hľadaj recept alebo ingredienciu..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px 14px 46px',
              borderRadius: 16,             /* 1rem */
              border: 'none',
              background: 'var(--surface-container-highest)',
              color: 'var(--on-surface)', fontSize: 15,
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s ease',
            }}
          />
        </div>

        {/* ── Action chips ─────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setShowFav(!showFav)} style={chipStyle(showFav)}>
            ❤️ Obľúbené{favs.length > 0 ? ` (${favs.length})` : ''}
          </button>
          <button onClick={random} style={chipStyle(false)}>🎲 Čo dnes?</button>
        </div>

        {/* ── Category chips — full pill, ghost border inactive ── */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? 'all' : c.id)} style={chipStyle(cat === c.id)}>
              {c.e} {c.label}
            </button>
          ))}
        </div>

        {/* ── Count label — uppercase metadata style ────────────── */}
        <p style={{
          color: 'var(--on-surface-variant)', fontSize: 11,
          marginBottom: 16, fontFamily: 'var(--font-body)',
          letterSpacing: '0.08em', fontWeight: 600, textTransform: 'uppercase',
        }}>
          {list.length === 0
            ? 'Žiadne recepty'
            : `${list.length} ${list.length === 1 ? 'recept' : list.length < 5 ? 'recepty' : 'receptov'}`}
        </p>

        {/* ── Recipe list — gap-based, no dividers ─────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map(r => (
            <Card key={r.id} r={r} onClick={() => { setSel(r); setSv(1); }}
              fav={favs.includes(r.id)} onFav={toggleFav} />
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '72px 0', color: 'var(--on-surface-variant)' }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontSize: 15, fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
              Žiadne recepty nezodpovedajú hľadaniu
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
