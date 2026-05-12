const BAR_W = 36

export default function SortingViz({ stepData, maxVal }) {
  if (!stepData) return null
  const { array, comparing = [], swapped = [], sorted = [], mergeRange = [], pivot } = stepData
  const max = maxVal || Math.max(...array)

  function barColor(i) {
    if (sorted.includes(i)) return 'var(--green)'
    if (swapped.includes(i)) return 'var(--red)'
    if (comparing.includes(i)) return 'var(--yellow)'
    if (pivot === i) return 'var(--accent-light)'
    if (mergeRange.length === 2 && i >= mergeRange[0] && i <= mergeRange[1]) return 'var(--blue)'
    return 'var(--bar-default)'
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      gap: 4, height: 240, padding: '0 16px', overflowX: 'auto'
    }}>
      {array.map((val, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{val}</span>
          <div style={{
            width: BAR_W,
            height: `${(val / max) * 200}px`,
            background: barColor(i),
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.15s, background 0.15s',
          }} />
        </div>
      ))}
    </div>
  )
}
