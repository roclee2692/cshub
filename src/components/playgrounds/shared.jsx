export function Toolbar({ children }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 12,
      flexWrap: 'wrap',
      padding: '8px 10px',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shine)',
      borderRadius: 'var(--r-md)',
    }}>
      {children}
    </div>
  )
}

export function ToolbarBtn({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 13px',
        borderRadius: 'var(--r-sm)',
        fontSize: 12.5,
        fontWeight: 600,
        background: active ? 'var(--accent-soft)' : 'var(--glass-bg-mid)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: `1px solid ${active ? 'var(--accent-border)' : 'var(--glass-border)'}`,
        boxShadow: active ? 'var(--glass-shine), 0 0 12px var(--accent-soft)' : 'var(--glass-shine)',
        color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
        transition: 'all 0.15s',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--glass-bg-strong)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'var(--glass-bg-mid)'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}
    >
      {children}
    </button>
  )
}

export function TextInput({ value, onChange, placeholder, onSubmit, submitLabel = '应用', width = 220 }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={e => { if (e.key === 'Enter') onSubmit() }}
        style={{
          width,
          padding: '5px 10px',
          borderRadius: 'var(--r-sm)',
          border: '1px solid var(--glass-border)',
          background: 'var(--glass-bg-mid)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          color: 'var(--text-primary)',
          fontSize: 12.5,
          fontFamily: 'var(--font-mono)',
        }}
      />
      <button
        onClick={onSubmit}
        style={{
          padding: '5px 13px',
          borderRadius: 'var(--r-sm)',
          fontSize: 12.5, fontWeight: 600,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-border)',
          boxShadow: '0 0 12px var(--accent-soft)',
          color: 'var(--accent-light)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'white' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent-light)' }}
      >
        {submitLabel}
      </button>
    </div>
  )
}

export function Legend({ items }) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', padding: '8px 14px' }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
          {label}
        </span>
      ))}
    </div>
  )
}
