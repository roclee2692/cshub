import { Link, useParams } from 'react-router-dom'
import { CATEGORIES, getAlgorithmsByCategory } from '../data/algorithms'
import { useProgress } from '../contexts/ProgressContext'

export default function Sidebar({ mobileOpen = false, onClose }) {
  const { slug } = useParams()
  const { isFavorite, isCompleted } = useProgress()
  return (
    <>
      {mobileOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, top: 56,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 80,
        }} />
      )}
      <aside
        className={mobileOpen ? 'sidebar sidebar-open' : 'sidebar'}
        style={{
          width: 248,
          borderRight: '1px solid var(--glass-border)',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          overflowY: 'auto',
          padding: '20px 10px',
          flexShrink: 0,
        }}>

        <div style={{
          padding: '0 10px 14px',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
        }}>
          算法目录
        </div>

        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const algos = getAlgorithmsByCategory(catKey)
          return (
            <div key={catKey} style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px',
                fontSize: 11.5,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                letterSpacing: '-0.01em',
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 7,
                  background: 'var(--glass-bg-mid)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, flexShrink: 0,
                }}>{cat.icon}</span>
                <span>{cat.name}</span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 10,
                  color: 'var(--text-tertiary)',
                  background: 'var(--glass-bg-mid)',
                  border: '1px solid var(--glass-border)',
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontWeight: 600,
                }}>
                  {algos.length}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '2px 0 0' }}>
                {algos.map(a => {
                  const active = slug === a.slug
                  const fav = isFavorite(a.slug)
                  const done = isCompleted(a.slug)
                  return (
                    <li key={a.slug}>
                      <Link to={`/algo/${a.slug}`} onClick={onClose} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '6px 10px 6px 28px',
                        fontSize: 12.5,
                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: active ? 'var(--accent-soft)' : 'transparent',
                        borderRadius: 'var(--r-sm)',
                        borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                        marginLeft: 4,
                        fontWeight: active ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'var(--glass-bg-mid)'
                          e.currentTarget.style.color = 'var(--text-primary)'
                        }
                      }}
                      onMouseLeave={e => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = 'var(--text-secondary)'
                        }
                      }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, minWidth: 0, overflow: 'hidden' }}>
                          {done && <DoneDot />}
                          {fav && <FavDot />}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                        </span>
                        <DiffBadge level={a.difficulty} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </aside>
    </>
  )
}

function DoneDot() {
  return (
    <span title="已学完" style={{
      width: 14, height: 14, flexShrink: 0,
      borderRadius: '50%',
      background: 'var(--green-soft)',
      color: 'var(--green)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )
}

function FavDot() {
  return (
    <svg title="已收藏" width="11" height="11" viewBox="0 0 24 24"
      fill="var(--yellow)" stroke="var(--yellow)" strokeWidth="2" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function DiffBadge({ level }) {
  const colorMap = {
    '基础': { bg: 'var(--green-soft)',  fg: 'var(--green)' },
    '中等': { bg: 'var(--yellow-soft)', fg: 'var(--yellow)' },
    '进阶': { bg: 'var(--red-soft)',    fg: 'var(--red)' },
  }
  const c = colorMap[level] || colorMap['基础']
  return (
    <span style={{
      fontSize: 9, padding: '1px 5px', borderRadius: 4,
      background: c.bg, color: c.fg,
      fontWeight: 700, letterSpacing: '0.02em',
    }}>{level}</span>
  )
}
