import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ALGORITHM_LIST, CATEGORIES } from '../data/algorithms'

export default function SearchPalette({ open, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ALGORITHM_LIST
    const score = (a) => {
      const cat = CATEGORIES[a.category]?.name || ''
      const haystack = [a.name, a.nameEn, a.slug, a.difficulty, cat].join(' ').toLowerCase()
      if (a.name.toLowerCase() === q) return 100
      if (a.name.toLowerCase().startsWith(q)) return 80
      if (a.nameEn.toLowerCase().startsWith(q)) return 70
      if (a.slug.startsWith(q)) return 60
      if (haystack.includes(q)) return 40
      // 字符顺序模糊匹配（每个字符按顺序出现即可）
      let i = 0
      for (const ch of haystack) {
        if (ch === q[i]) i++
        if (i === q.length) return 10
      }
      return 0
    }
    return ALGORITHM_LIST
      .map(a => ({ a, s: score(a) }))
      .filter(x => x.s > 0)
      .sort((x, y) => y.s - x.s)
      .map(x => x.a)
  }, [query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive(i => Math.min(i + 1, Math.max(results.length - 1, 0)))
      }
      else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive(i => Math.max(i - 1, 0))
      }
      else if (e.key === 'Enter') {
        e.preventDefault()
        const target = results[active]
        if (target) {
          navigate(`/algo/${target.slug}`)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, active, navigate, onClose])

  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%', maxWidth: 560,
          background: 'var(--bg-elev)',
          border: '1px solid var(--border-strong)',
          borderRadius: 12,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          animation: 'paletteIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索算法名称、分类或英文名…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: 15,
              color: 'var(--text-primary)',
              padding: 0,
            }}
          />
          <kbd style={{
            padding: '2px 6px', fontSize: 10,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 3, color: 'var(--text-tertiary)',
          }}>ESC</kbd>
        </div>

        <div ref={listRef} style={{ maxHeight: '52vh', overflowY: 'auto', padding: 8 }}>
          {results.length === 0 && (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--text-tertiary)',
            }}>
              没找到匹配的算法
            </div>
          )}
          {results.map((a, i) => {
            const cat = CATEGORIES[a.category]
            const isActive = i === active
            return (
              <div
                key={a.slug}
                data-idx={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => { navigate(`/algo/${a.slug}`); onClose() }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  transition: 'background 0.12s',
                }}
              >
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  borderRadius: 8,
                  background: `${cat.color}22`, color: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-primary)',
                  }}>
                    {a.name}
                    <span style={{
                      marginLeft: 8, fontSize: 11, color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)', fontWeight: 400,
                    }}>{a.nameEn}</span>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--text-tertiary)',
                    marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {cat.name} · {a.description}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, padding: '2px 6px',
                  borderRadius: 3,
                  background: 'var(--surface)',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                  flexShrink: 0,
                }}>{a.timeComplexity.average}</span>
              </div>
            )
          })}
        </div>

        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          display: 'flex', gap: 16,
          fontSize: 11,
          color: 'var(--text-tertiary)',
        }}>
          <span><Key>↑↓</Key> 选择</span>
          <span><Key>↵</Key> 打开</span>
          <span style={{ marginLeft: 'auto' }}>{results.length} 个结果</span>
        </div>
      </div>
    </div>
  )
}

function Key({ children }) {
  return (
    <kbd style={{
      padding: '1px 5px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 3,
      fontSize: 10,
      fontFamily: 'var(--font-mono)',
      marginRight: 4,
    }}>{children}</kbd>
  )
}
