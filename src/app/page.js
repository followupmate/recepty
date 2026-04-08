'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { recipes as R, categories as CATS, getEmoji } from '../data/recipes';

function Card({ r, onClick, fav, onFav }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: 'var(--surface-container-lowest)',
        borderRadius: 16,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: h ? 'var(--shadow-float)' : 'var(--shadow-ambient)',
        transform: h ? 'translateY(-2px)' : 'none',
        display: 'flex', alignItems: 'center',
        paddingTop: 14, paddingBottom: 14,
        paddingLeft: 16, paddingRight: 14,
        gap: 14,
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 24, flexShrink: 0,
        background: `hsl(${(r.id * 47) % 60 + 80}, 50%, 88%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
      }}>
        {getEmoji(r.t)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.35,
          fontFamily: 'var(--font-display)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{r.t}</div>
        <div style={{
          fontSize: 11, color: 'var(--on-surface-variant)', marginTop: 4,
          fontFamily: 'var(--font-body)', letterSpacing: '0.06em', fontWeight: 500,
        }}>
          {r.ing.length} INGREDIENCIÍ · {r.s.length} {r.s.length === 1 ? 'KROK' : r.s.length < 5 ? 'KROKY' : 'KROKOV'}
        </div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onFav(r.id); }}
        style={{
          background: 'none', border: 'none', fontSize: 18,
          padding: 6, flexShrink: 0, transition: 'transform 0.15s',
          transform: h ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

function Detail({ r, onBack, sv, setSv }) {
  const base = r.bp || 1;
  const [checkedIngs, setCheckedIngs] = useState([]);

  const fmt = (a, u) => {
    if (a === 0) return u || 'podľa chuti';
    return `${Math.round(a / base * sv * 10) / 10} ${u}`;
  };

  const toggleIng = (i) => {
    setCheckedIngs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>

      {/* Back — ghost border, pill shape */}
      <button onClick={onBack} style={{
        background: 'none',
        border: `1px solid rgba(103,131,70,0.22)`,
        color: 'var(--on-surface)',
        padding: '8px 20px', borderRadius: 9999, fontSize: 13,
        marginBottom: 36,
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-body)', fontWeight: 500,
      }}>← Späť</button>

      {/* Hero emoji */}
      <div style={{
        width: 80, height: 80, borderRadius: 24, margin: '0 auto 20px',
        background: `hsl(${(r.id * 47) % 60 + 80}, 50%, 88%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40,
      }}>{getEmoji(r.t)}</div>

      {/* Recipe title — editorial display */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
        color: 'var(--on-surface)',
        margin: '0 0 32px', fontWeight: 700,
        textAlign: 'center', lineHeight: 1.15,
        letterSpacing: '-0.02em',
      }}>{r.t}</h1>

      {/* Serving adjuster — tonal, no border */}
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 16, padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 36,
      }}>
        <span style={{
          fontSize: 11, color: 'var(--on-surface-variant)',
          fontWeight: 700, letterSpacing: '0.08em', fontFamily: 'var(--font-body)',
        }}>PORCIE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => setSv(Math.max(1, sv - 1))} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--surface-container-lowest)',
            border: 'none',
            color: 'var(--primary)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            boxShadow: '0 2px 8px rgba(33,57,4,0.08)',
          }}>−</button>
          <span style={{
            fontSize: 22, fontWeight: 700, color: 'var(--on-surface)',
            minWidth: 28, textAlign: 'center', fontFamily: 'var(--font-display)',
          }}>{sv}</span>
          <button onClick={() => setSv(sv + 1)} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--surface-container-lowest)',
            border: 'none',
            color: 'var(--primary)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            boxShadow: '0 2px 8px rgba(33,57,4,0.08)',
          }}>+</button>
        </div>
      </div>

      {/* Ingredients — tonal container, no divider lines */}
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 20,
        margin: '0 0 12px', fontWeight: 700, color: 'var(--on-surface)',
      }}>Ingrediencie</h2>
      <div style={{
        background: 'var(--surface-container-low)',
        borderRadius: 16, overflow: 'hidden', marginBottom: 36,
      }}>
        {r.ing.map(([name, amt, unit], i) => (
          <div
            key={i}
            onClick={() => toggleIng(i)}
            style={{
              padding: '13px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer',
              opacity: checkedIngs.includes(i) ? 0.4 : 1,
              transition: 'opacity 0.2s ease',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.35)',
            }}
          >
            <span style={{
              fontSize: 15, lineHeight: 1.6,
              fontFamily: 'var(--font-body)', color: 'var(--on-surface)',
              textDecoration: checkedIngs.includes(i) ? 'line-through' : 'none',
            }}>{name}</span>
            <span style={{
              color: 'var(--primary)', fontSize: 14, fontWeight: 600,
              whiteSpace: 'nowrap', marginLeft: 16, fontFamily: 'var(--font-body)',
            }}>{fmt(amt, unit)}</span>
          </div>
        ))}
      </div>

      {/* Steps */}
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 20,
        margin: '0 0 16px', fontWeight: 700, color: 'var(--on-surface)',
      }}>Postup</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 64 }}>
        {r.s.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{
              minWidth: 30, height: 30, borderRadius: '50%',
              background: 'var(--surface-container-low)',
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
              fontFamily: 'var(--font-body)',
            }}>{i + 1}</div>
            <p style={{
              margin: 0, fontSize: 15, lineHeight: 1.65,
              color: 'var(--on-surface)', fontFamily: 'var(--font-body)', paddingTop: 4,
            }}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
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

  const chipStyle = (active) => ({
    padding: '7px 16px', borderRadius: 9999,
    border: 'none',
    background: active
      ? 'linear-gradient(135deg, var(--primary), var(--primary-container))'
      : 'var(--surface-container-lowest)',
    color: active ? 'var(--on-primary)' : 'var(--on-surface-variant)',
    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
    fontFamily: 'var(--font-body)',
    boxShadow: active ? '0 4px 14px rgba(157,69,0,0.28)' : 'var(--shadow-ambient)',
    transition: 'all 0.2s ease',
  });

  if (sel) return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', padding: '28px 16px 72px 24px' }}>
      <Detail r={sel} onBack={() => { setSel(null); setSv(1); }} sv={sv} setSv={setSv} />
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', paddingBottom: 72 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', paddingLeft: 24, paddingRight: 16 }}>

        {/* Editorial header */}
        <div style={{ paddingTop: 44, marginBottom: 36 }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            color: 'var(--tertiary)', marginBottom: 8, fontFamily: 'var(--font-body)',
          }}>RODINNÁ ZBIERKA</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontWeight: 700, color: 'var(--on-surface)',
            lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 10px',
          }}>Naše Recepty</h1>
          <p style={{
            color: 'var(--on-surface-variant)', fontSize: 14,
            fontFamily: 'var(--font-body)', lineHeight: 1.5,
          }}>{R.length} receptov · rodinná zbierka</p>
        </div>

        {/* Search — surface-container-highest bg, sm radius, no border */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 15, color: 'var(--on-surface-variant)',
          }}>🔍</span>
          <input
            type="text"
            placeholder="Hľadaj recept alebo ingredienciu..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '13px 14px 13px 42px', borderRadius: 4,
              border: 'none', background: 'var(--surface-container-highest)',
              color: 'var(--on-surface)', fontSize: 15,
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s ease',
            }}
          />
        </div>

        {/* Action chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setShowFav(!showFav)} style={chipStyle(showFav)}>
            ❤️ Obľúbené{favs.length > 0 ? ` (${favs.length})` : ''}
          </button>
          <button onClick={random} style={chipStyle(false)}>🎲 Čo dnes?</button>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? 'all' : c.id)} style={chipStyle(cat === c.id)}>
              {c.e} {c.label}
            </button>
          ))}
        </div>

        {/* Count label */}
        <p style={{
          color: 'var(--on-surface-variant)', fontSize: 11,
          marginBottom: 14, fontFamily: 'var(--font-body)', letterSpacing: '0.06em', fontWeight: 500,
        }}>
          {list.length === 0
            ? 'ŽIADNE RECEPTY'
            : `${list.length} ${list.length === 1 ? 'RECEPT' : list.length < 5 ? 'RECEPTY' : 'RECEPTOV'}`}
        </p>

        {/* Recipe list — no dividers, gap-based separation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(r => (
            <Card key={r.id} r={r} onClick={() => { setSel(r); setSv(1); }}
              fav={favs.includes(r.id)} onFav={toggleFav} />
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--on-surface-variant)' }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🍽️</div>
            <p style={{ fontSize: 15, fontFamily: 'var(--font-body)' }}>
              Žiadne recepty nezodpovedajú hľadaniu
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
