'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { recipes as R, categories as CATS, getEmoji } from '../data/recipes';

function Card({ r, onClick, fav, onFav }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h ? 'rgba(255,255,255,1)' : 'var(--card)', borderRadius: 14, cursor: 'pointer',
        transition: 'all 0.25s ease',
        border: `1px solid ${h ? 'var(--border-hover)' : 'var(--border)'}`,
        boxShadow: h ? 'var(--shadow-hover)' : 'var(--shadow)',
        transform: h ? 'translateY(-2px)' : 'none',
        display: 'flex', alignItems: 'center', padding: '16px 18px', gap: 14,
      }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: `hsl(${(r.id * 29) % 360}, 30%, 95%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
      }}>
        {getEmoji(r.t)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.35,
          fontFamily: 'var(--font-display)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{r.t}</div>
        <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 2 }}>
          {r.ing.length} ingrediencií · {r.s.length} {r.s.length === 1 ? 'krok' : r.s.length < 5 ? 'kroky' : 'krokov'}
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onFav(r.id); }}
        style={{
          background: 'none', border: 'none', fontSize: 18,
          padding: 4, flexShrink: 0, transition: 'transform 0.15s',
          transform: h ? 'scale(1.1)' : 'scale(1)',
        }}>
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}

function Detail({ r, onBack, sv, setSv }) {
  const base = r.bp || 1;
  const fmt = (a, u) => {
    if (a === 0) return u || 'podľa chuti';
    return `${Math.round(a / base * sv * 10) / 10} ${u}`;
  };
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)',
        padding: '8px 16px', borderRadius: 10, fontSize: 14,
        marginBottom: 24, boxShadow: 'var(--shadow)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>← Späť</button>

      <div style={{
        width: 72, height: 72, borderRadius: 18, margin: '0 auto 16px',
        background: `hsl(${(r.id * 29) % 360}, 30%, 95%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
      }}>{getEmoji(r.t)}</div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)',
        margin: '0 0 24px', fontWeight: 700, textAlign: 'center', lineHeight: 1.3,
      }}>{r.t}</h1>

      <div style={{
        background: 'var(--accent-bg)', border: '1px solid rgba(196,113,59,0.15)',
        borderRadius: 12, padding: '12px 18px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 28,
      }}>
        <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500 }}>Porcie</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSv(Math.max(1, sv - 1))} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(196,113,59,0.25)',
            background: 'white', color: 'var(--accent)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
          }}>−</button>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', minWidth: 24, textAlign: 'center',
            fontFamily: 'var(--font-display)' }}>{sv}</span>
          <button onClick={() => setSv(sv + 1)} style={{
            width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(196,113,59,0.25)',
            background: 'white', color: 'var(--accent)', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
          }}>+</button>
        </div>
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 10px', fontWeight: 600 }}>Ingrediencie</h2>
      <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--border)',
        overflow: 'hidden', marginBottom: 28, boxShadow: 'var(--shadow)' }}>
        {r.ing.map(([name, amt, unit], i) => (
          <div key={i} style={{
            padding: '11px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: i < r.ing.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: 14 }}>{name}</span>
            <span style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>
              {fmt(amt, unit)}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, margin: '0 0 10px', fontWeight: 600 }}>Postup</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {r.s.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              minWidth: 28, height: 28, borderRadius: '50%', background: 'var(--accent-bg)',
              color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{step}</p>
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
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter(r => r.t.toLowerCase().includes(s) || r.ing.some(([n]) => n.toLowerCase().includes(s))); }
    return l;
  }, [q, cat, showFav, favs]);

  const btnStyle = (active) => ({
    padding: '6px 12px', borderRadius: 10,
    border: `1px solid ${active ? 'rgba(196,113,59,0.3)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : 'var(--card)',
    color: active ? 'var(--accent)' : 'var(--text-soft)',
    fontSize: 12, fontWeight: 500, boxShadow: 'var(--shadow)', whiteSpace: 'nowrap',
  });

  if (sel) return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 60px' }}>
      <Detail r={sel} onBack={() => { setSel(null); setSv(1); }} sv={sv} setSv={setSv} />
    </main>
  );

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 60px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🍽️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, margin: '0 0 4px' }}>
            Naše Recepty
          </h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 13 }}>{R.length} receptov · rodinná zbierka</p>
        </div>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--text-soft)' }}>🔍</span>
          <input type="text" placeholder="Hľadaj recept alebo ingredienciu..."
            value={q} onChange={e => setQ(e.target.value)}
            style={{
              width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12,
              border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)',
              fontSize: 15, boxShadow: 'var(--shadow)',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => setShowFav(!showFav)} style={btnStyle(showFav)}>
            ❤️ Obľúbené{favs.length > 0 ? ` (${favs.length})` : ''}
          </button>
          <button onClick={random} style={btnStyle(false)}>🎲 Čo dnes?</button>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? 'all' : c.id)} style={btnStyle(cat === c.id)}>
              {c.e} {c.label}
            </button>
          ))}
        </div>

        <p style={{ color: 'var(--text-soft)', fontSize: 12, marginBottom: 12 }}>
          {list.length === 0 ? 'Žiadne recepty' : `${list.length} ${list.length === 1 ? 'recept' : list.length < 5 ? 'recepty' : 'receptov'}`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.map(r => (
            <Card key={r.id} r={r} onClick={() => { setSel(r); setSv(1); }}
              fav={favs.includes(r.id)} onFav={toggleFav} />
          ))}
        </div>

        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-soft)' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🍽️</div>
            <p style={{ fontSize: 14 }}>Žiadne recepty nezodpovedajú hľadaniu</p>
          </div>
        )}
      </div>
    </main>
  );
}
