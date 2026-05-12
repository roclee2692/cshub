export default function ComplexityCards({ algo }) {
  const tc = algo.timeComplexity
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
      gap: 10,
      marginBottom: 32,
    }}>
      <Card label="时间（最好）" value={tc.best}             accent="#34d399" glow="rgba(52,211,153,0.18)" />
      <Card label="时间（平均）" value={tc.average}          accent="#fbbf24" glow="rgba(251,191,36,0.18)" />
      <Card label="时间（最坏）" value={tc.worst}            accent="#f87171" glow="rgba(248,113,113,0.18)" />
      <Card label="空间复杂度"   value={algo.spaceComplexity} accent="#60a5fa" glow="rgba(96,165,250,0.18)" />
    </div>
  )
}

function Card({ label, value, accent, glow }) {
  return (
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: `var(--glass-shine), 0 4px 20px ${glow}`,
      borderRadius: 'var(--r-lg)',
      padding: '16px 18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.boxShadow = `var(--glass-shine), 0 8px 32px ${glow}`
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = `var(--glass-shine), 0 4px 20px ${glow}`
    }}>
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        borderRadius: '16px 16px 0 0',
      }} />
      {/* Glow dot */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80,
        background: `radial-gradient(circle, ${glow.replace('0.18','0.35')}, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        fontSize: 10.5, color: 'var(--text-tertiary)',
        marginBottom: 8, fontWeight: 600, letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 20, fontWeight: 700,
        color: accent,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
    </div>
  )
}
