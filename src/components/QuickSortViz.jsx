const NODE = 46
const GAP = 10
const UNIT = NODE + GAP
const PIVOT_LIFT = 64

export default function QuickSortViz({ stepData }) {
  if (!stepData) return null
  const {
    arr, range,
    pivotId, pivotValue, pivotLifted,
    i, j, fixedPivotIds = [],
    compareIds, swapIds, phase,
  } = stepData

  const n = arr.length
  const totalW = n * UNIT - GAP

  const inRange = (idx) => range && idx >= range[0] && idx <= range[1]

  function nodeStyleFor(el, idx) {
    const isPivot = el.id === pivotId
    const isFixed = fixedPivotIds.includes(el.id)
    const isComparing = compareIds?.includes(el.id) && !isPivot
    const isSwapping = swapIds?.includes(el.id)
    const dimmed = range && !inRange(idx) && !isFixed

    let bg, border, ring

    if (phase === 'done' || isFixed) {
      bg = 'linear-gradient(135deg, #34d399, #059669)'
      border = '#059669'
    } else if (isPivot) {
      bg = 'linear-gradient(135deg, #f472b6, #db2777)'
      border = '#db2777'
    } else if (i != null && idx <= i && inRange(idx)) {
      // 已知 ≤ pivot 区
      bg = 'linear-gradient(135deg, #6ee7b7, #10b981)'
      border = '#10b981'
    } else if (inRange(idx)) {
      bg = 'linear-gradient(135deg, #c4b5fd, #8b5cf6)'
      border = '#8b5cf6'
    } else {
      bg = 'linear-gradient(135deg, #4b5563, #374151)'
      border = '#4b5563'
    }

    if (isComparing) {
      ring = '0 0 0 4px rgba(245, 158, 11, 0.6), 0 0 24px rgba(245, 158, 11, 0.7)'
    } else if (isSwapping) {
      ring = '0 0 0 4px rgba(239, 68, 68, 0.6), 0 0 24px rgba(239, 68, 68, 0.7)'
    } else if (isPivot) {
      ring = '0 0 0 3px rgba(236, 72, 153, 0.5), 0 0 28px rgba(236, 72, 153, 0.5)'
    }

    return {
      background: bg,
      borderColor: border,
      boxShadow: ring || '0 4px 14px rgba(0,0,0,0.35)',
      opacity: dimmed ? 0.28 : 1,
    }
  }

  return (
    <div style={{
      position: 'relative',
      minWidth: totalW + 32,
      height: 280,
      margin: '0 auto',
      padding: '90px 16px 0',
    }}>
      {/* PIVOT 标签：抬升 pivot 上方 */}
      {pivotId != null && pivotLifted && (
        <PivotLabel id={pivotId} idToIdx={new Map(arr.map((e, i) => [e.id, i]))} />
      )}

      {/* 顶部：分区括号 */}
      {range && (
        <Bracket from={range[0]} to={range[1]} color="#8b5cf6" label={`分区 [${range[0]}, ${range[1]}]`} />
      )}

      {/* 主行：所有元素 */}
      <div style={{ position: 'relative', height: NODE, marginTop: 24 }}>
        {arr.map((el, idx) => {
          const isPivot = el.id === pivotId
          const x = idx * UNIT + 16
          const y = (isPivot && pivotLifted) ? -PIVOT_LIFT : 0
          const s = nodeStyleFor(el, idx)
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: 0, top: 0,
                width: NODE, height: NODE,
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.3s, box-shadow 0.25s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                color: 'white',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: 17,
                border: '2px solid',
                zIndex: isPivot ? 10 : 1,
                ...s,
              }}
            >
              {el.value}
            </div>
          )
        })}

        {/* i 边界——一条竖直墙线，画在 i 和 i+1 之间 */}
        {i != null && i >= range?.[0] - 1 && phase !== 'done' && (
          <div style={{
            position: 'absolute',
            left: (i + 1) * UNIT + 16 - GAP / 2,
            top: -12, bottom: -12,
            width: 2,
            background: 'linear-gradient(to bottom, transparent, #10b981 30%, #10b981 70%, transparent)',
            transition: 'left 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
            pointerEvents: 'none',
          }}>
            <span style={{
              position: 'absolute', top: -16, left: -10,
              fontSize: 10, color: '#10b981', fontFamily: 'var(--font-mono)', fontWeight: 700,
            }}>i+1</span>
          </div>
        )}
      </div>

      {/* 底部：j 指针 */}
      <div style={{ position: 'relative', height: 30, marginTop: 10 }}>
        {j != null && j >= 0 && j < n && phase !== 'done' && (
          <Pointer index={j} color="#f59e0b" label="j" subtitle="扫描位" />
        )}
      </div>

      {/* 比较读数 */}
      {compareIds && pivotValue != null && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: -8,
          display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', fontSize: 13,
        }}>
          <Chip label={`arr[${j}]`}
            value={arr.find(e => e.id === compareIds[0])?.value}
            color="#f59e0b" />
          <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {arr.find(e => e.id === compareIds[0])?.value <= pivotValue ? '≤' : '>'}
          </span>
          <Chip label="pivot" value={pivotValue} color="#ec4899" highlight />
        </div>
      )}
    </div>
  )
}

function PivotLabel({ id, idToIdx }) {
  const idx = idToIdx.get(id)
  if (idx == null) return null
  const left = idx * UNIT + 16 + (NODE - 50) / 2
  return (
    <div style={{
      position: 'absolute',
      left, top: 8,
      width: 50,
      transform: 'translateX(0)',
      transition: 'left 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
      textAlign: 'center',
    }}>
      <span style={{
        fontSize: 9, fontWeight: 800,
        color: 'white',
        background: 'linear-gradient(135deg, #f472b6, #db2777)',
        padding: '2px 8px',
        borderRadius: 4,
        letterSpacing: '0.08em',
        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.4)',
      }}>PIVOT</span>
    </div>
  )
}

function Bracket({ from, to, color, label }) {
  const left = from * UNIT + 16
  const width = (to - from + 1) * UNIT - GAP
  return (
    <div style={{
      position: 'absolute',
      left, width,
      top: 64, height: 22,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      borderTop: `2px solid ${color}`,
      borderLeft: `2px solid ${color}`,
      borderRight: `2px solid ${color}`,
      borderRadius: '6px 6px 0 0',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: 10, color, fontWeight: 700,
        background: 'var(--bg)',
        padding: '0 6px',
        marginBottom: -7,
        letterSpacing: '0.04em',
      }}>{label}</span>
    </div>
  )
}

function Pointer({ index, color, label, subtitle, yOffset = 0 }) {
  const left = index * UNIT + 16 + (NODE - 16) / 2
  return (
    <div style={{
      position: 'absolute',
      left, top: yOffset,
      transition: 'left 0.5s cubic-bezier(0.34, 1.2, 0.64, 1)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <svg width="16" height="12" viewBox="0 0 16 12">
        <path d="M8 0 L15 10 L1 10 Z" fill={color} />
      </svg>
      <span style={{
        fontSize: 11, color, fontWeight: 700,
        fontFamily: 'var(--font-mono)', marginTop: 2,
      }}>{label}</span>
      {subtitle && (
        <span style={{ fontSize: 9, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}

function Chip({ label, value, color, highlight }) {
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: 8,
      background: highlight ? color : 'var(--surface)',
      color: highlight ? 'white' : color,
      border: `1px solid ${color}`,
      fontFamily: 'var(--font-mono)',
      fontWeight: 600, fontSize: 13,
      transition: 'all 0.2s',
    }}>
      {label} = {value}
    </span>
  )
}
