import { Link } from 'react-router-dom'
import { CATEGORIES, getAlgorithmsByCategory } from '../../data/algorithms'

export default function CategoryComparison({ algo }) {
  const peers = getAlgorithmsByCategory(algo.category)
  if (peers.length <= 1) return null
  const cat = CATEGORIES[algo.category]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        fontSize: 12.5,
        fontFamily: 'var(--font-mono)',
      }}>
        <thead>
          <tr>
            {['算法', '最好', '平均', '最坏', '空间', '难度', '稳定'].map(h => (
              <th key={h} style={{
                padding: '8px 12px',
                background: 'var(--surface-2)',
                color: 'var(--text-tertiary)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.05em',
                textAlign: h === '算法' ? 'left' : 'center',
                borderBottom: '1px solid var(--border)',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {peers.map((a, i) => {
            const isCurrent = a.slug === algo.slug
            return (
              <tr key={a.slug} style={{
                background: isCurrent ? 'var(--accent-soft)' : (i % 2 === 0 ? 'transparent' : 'var(--bg-elev)'),
                borderLeft: isCurrent ? '3px solid var(--accent)' : '3px solid transparent',
              }}>
                <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border)' }}>
                  {isCurrent ? (
                    <span style={{ fontWeight: 700, color: 'var(--accent-light)', fontFamily: 'var(--font-sans)' }}>
                      {a.name}
                    </span>
                  ) : (
                    <Link to={`/algo/${a.slug}`} style={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-sans)',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-light)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}>
                      {a.name}
                    </Link>
                  )}
                </td>
                {[
                  a.timeComplexity?.best,
                  a.timeComplexity?.average,
                  a.timeComplexity?.worst,
                  a.spaceComplexity,
                ].map((val, ci) => (
                  <td key={ci} style={{
                    padding: '9px 12px',
                    textAlign: 'center',
                    borderBottom: '1px solid var(--border)',
                    color: val ? complexityColor(val) : 'var(--text-tertiary)',
                    fontWeight: isCurrent ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {val ?? '—'}
                  </td>
                ))}
                <td style={{ padding: '9px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                  <DiffBadge level={a.difficulty} />
                </td>
                <td style={{ padding: '9px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                  {a.stable === true
                    ? <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 600 }}>稳定</span>
                    : a.stable === false
                    ? <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>—</span>
                    : <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>N/A</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function complexityColor(val) {
  if (!val) return 'var(--text-tertiary)'
  if (/^O\(1\)$/.test(val)) return 'var(--green)'
  if (/^O\(n\)$|^O\(n\+/.test(val)) return 'var(--blue)'
  if (/log/.test(val) && !/n²|n\^2/.test(val)) return 'var(--accent-light)'
  if (/n²|n\^2|n·E|V·E|n\*m|nm/.test(val)) return 'var(--yellow)'
  if (/n!|2\^n/.test(val)) return 'var(--red)'
  if (/V³|n³/.test(val)) return 'var(--red)'
  return 'var(--text-secondary)'
}

function DiffBadge({ level }) {
  const colorMap = {
    '基础': { bg: 'var(--green-soft)', fg: 'var(--green)' },
    '中等': { bg: 'var(--yellow-soft)', fg: 'var(--yellow)' },
    '进阶': { bg: 'var(--red-soft)', fg: 'var(--red)' },
  }
  const c = colorMap[level] || colorMap['基础']
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 6px', borderRadius: 3,
      background: c.bg, color: c.fg,
      fontSize: 10, fontWeight: 600,
      fontFamily: 'var(--font-sans)',
    }}>{level}</span>
  )
}
