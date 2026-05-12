export default function Section({ title, icon, children, accent }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        letterSpacing: '-0.02em',
      }}>
        {icon && (
          <span style={{
            width: 26, height: 26,
            borderRadius: 8,
            background: accent || 'var(--accent-soft)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shine)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
          }}>{icon}</span>
        )}
        {title}
      </h2>
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  )
}

export function Prose({ text }) {
  return (
    <div style={{
      fontSize: 14, lineHeight: 1.85,
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shine)',
      borderRadius: 'var(--r-lg)',
      padding: '18px 20px',
    }}>
      {text.split('\n\n').map((p, i) => (
        <p key={i} style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
          {renderInline(p)}
        </p>
      ))}
    </div>
  )
}

function renderInline(text) {
  const parts = []
  let buf = '', i = 0
  while (i < text.length) {
    if (text.slice(i, i + 2) === '**') {
      if (buf) parts.push(buf)
      buf = ''
      const end = text.indexOf('**', i + 2)
      if (end === -1) { buf += '**'; i += 2 }
      else {
        parts.push(<strong key={parts.length} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{text.slice(i + 2, end)}</strong>)
        i = end + 2
      }
    } else if (text[i] === '`') {
      if (buf) parts.push(buf)
      buf = ''
      const end = text.indexOf('`', i + 1)
      if (end === -1) { buf += '`'; i++ }
      else {
        parts.push(<code key={parts.length} style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.87em',
          padding: '2px 7px', borderRadius: 5,
          background: 'var(--glass-bg-mid)',
          border: '1px solid var(--glass-border)',
          color: 'var(--accent-light)',
        }}>{text.slice(i + 1, end)}</code>)
        i = end + 1
      }
    } else {
      buf += text[i++]
    }
  }
  if (buf) parts.push(buf)
  return parts
}
