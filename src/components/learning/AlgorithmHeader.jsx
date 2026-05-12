import { CATEGORIES } from '../../data/algorithms'
import { useProgress } from '../../contexts/ProgressContext'

export default function AlgorithmHeader({ algo }) {
  const cat = CATEGORIES[algo.category]
  const { isFavorite, isCompleted, toggleFavorite, toggleCompleted } = useProgress()
  const fav = isFavorite(algo.slug)
  const done = isCompleted(algo.slug)
  const diffColor = {
    '基础': 'var(--green)',
    '中等': 'var(--yellow)',
    '进阶': 'var(--red)',
  }[algo.difficulty] || 'var(--text-secondary)'

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Breadcrumb */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14,
        fontWeight: 500,
      }}>
        <span style={{
          padding: '2px 9px', borderRadius: 20,
          background: 'var(--glass-bg-mid)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}>
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </span>
        <span style={{ opacity: 0.35, fontSize: 14 }}>›</span>
        <span style={{ color: 'var(--text-secondary)' }}>{algo.nameEn}</span>
      </div>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        <h1 className="algo-title" style={{
          fontSize: 38, fontWeight: 800, flex: '1 1 auto', minWidth: 0,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, var(--text-primary) 40%, var(--accent-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {algo.name}
        </h1>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, paddingTop: 6 }}>
          <GlassActionBtn
            active={fav}
            onClick={() => toggleFavorite(algo.slug)}
            activeColor="var(--yellow)"
            activeGlow="rgba(251,191,36,0.2)"
          >
            <StarIcon filled={fav} />
            <span>{fav ? '已收藏' : '收藏'}</span>
          </GlassActionBtn>
          <GlassActionBtn
            active={done}
            onClick={() => toggleCompleted(algo.slug)}
            activeColor="var(--green)"
            activeGlow="rgba(52,211,153,0.2)"
          >
            <CheckIcon />
            <span>{done ? '已学完' : '标记已学'}</span>
          </GlassActionBtn>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 15, color: 'var(--text-secondary)',
        lineHeight: 1.7, marginBottom: 14,
        maxWidth: 680,
      }}>
        {algo.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <Tag color={diffColor}>{algo.difficulty}</Tag>
        {algo.stable !== undefined && (
          <Tag>{algo.stable ? '稳定' : '不稳定'}</Tag>
        )}
        {algo.inPlace !== undefined && (
          <Tag>{algo.inPlace ? '原地' : '非原地'}</Tag>
        )}
      </div>
    </div>
  )
}

function GlassActionBtn({ active, onClick, children, activeColor, activeGlow }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 14px',
      fontSize: 12.5, fontWeight: 600,
      borderRadius: 'var(--r-md)',
      background: active ? `color-mix(in srgb, ${activeColor} 12%, transparent)` : 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: `1px solid ${active ? activeColor + '60' : 'var(--glass-border)'}`,
      boxShadow: active ? `var(--glass-shine), 0 4px 16px ${activeGlow}` : 'var(--glass-shine)',
      color: active ? activeColor : 'var(--text-secondary)',
      transition: 'all 0.2s',
    }}>
      {children}
    </button>
  )
}

function StarIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Tag({ children, color = 'var(--text-tertiary)' }) {
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: 20,
      background: 'var(--glass-bg-mid)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shine)',
      color,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
    }}>{children}</span>
  )
}
