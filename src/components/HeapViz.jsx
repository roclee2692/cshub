// Smooth dual-view: tree (top) + bar chart (bottom)
// Tree node positions are derived from heap index: level=floor(log2(i+1)),
// position-in-level = i - (2^level - 1). Total levels = ceil(log2(n+1)).

const TREE_H = 220
const BAR_AREA_H = 140

export default function HeapViz({ stepData }) {
  if (!stepData) return null
  const { array, heapSize, comparing = [], swapped = [], sorted = [] } = stepData
  const n = array.length
  const max = Math.max(...array, 1)
  const W = Math.max(680, n * 56)

  const levels = Math.ceil(Math.log2(n + 1))
  function nodePos(i) {
    const level = Math.floor(Math.log2(i + 1))
    const posInLevel = i - (2 ** level - 1)
    const slots = 2 ** level
    const x = ((posInLevel + 0.5) / slots) * W
    const y = 30 + level * (TREE_H - 60) / Math.max(levels - 1, 1)
    return { x, y }
  }

  function nodeColor(i) {
    if (sorted.includes(i)) return 'var(--green)'
    if (swapped.includes(i)) return 'var(--red)'
    if (comparing.includes(i)) return 'var(--yellow)'
    if (i >= heapSize) return 'var(--bar-inactive)'
    return 'var(--accent)'
  }

  function strokeFor(i) {
    if (i >= heapSize && !sorted.includes(i)) return 'var(--bar-inactive)'
    return 'transparent'
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 12, overflow: 'hidden'
    }}>
      <svg width="100%" viewBox={`0 0 ${W} ${TREE_H}`} style={{ display: 'block' }}>
        {/* edges */}
        {array.map((_, i) => {
          if (i === 0) return null
          const parent = Math.floor((i - 1) / 2)
          const a = nodePos(parent)
          const b = nodePos(i)
          const inactive = i >= heapSize
          return (
            <line key={`e${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={inactive ? 'var(--edge-inactive)' : 'var(--border)'} strokeWidth={1.5} />
          )
        })}
        {/* nodes — keyed by index for stable transforms */}
        {array.map((val, i) => {
          const { x, y } = nodePos(i)
          return (
            <g key={i} style={{ transform: `translate(${x}px, ${y}px)`, transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
              <circle r={18}
                fill={nodeColor(i)}
                stroke={strokeFor(i)}
                strokeWidth={2}
                strokeDasharray={i >= heapSize && !sorted.includes(i) ? '4 3' : '0'}
                style={{ transition: 'fill 0.3s, stroke 0.3s' }} />
              <text textAnchor="middle" y={4} fill="white" fontSize={12} fontWeight="bold">{val}</text>
              <text textAnchor="middle" y={-24} fill="var(--text-tertiary)" fontSize={9}>[{i}]</text>
            </g>
          )
        })}
      </svg>

      {/* bar chart with absolute positioning so bars slide smoothly */}
      <div style={{ position: 'relative', height: BAR_AREA_H, marginTop: 16, padding: '0 8px' }}>
        {array.map((val, i) => {
          const slotW = (W - 16) / n
          const barH = (val / max) * (BAR_AREA_H - 28)
          return (
            <div key={i} style={{
              position: 'absolute',
              left: i * slotW,
              bottom: 0,
              width: slotW - 4,
              transition: 'left 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{val}</span>
              <div style={{
                width: '100%',
                height: barH,
                background: nodeColor(i),
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.3s, background 0.3s',
                opacity: i >= heapSize && !sorted.includes(i) ? 0.4 : 1,
              }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
