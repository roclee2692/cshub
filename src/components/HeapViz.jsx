// 堆可视化:树(上) + 数组条形(下) 双视图
// 树节点坐标由堆下标推导:level=floor(log2(i+1)),层内序号 = i-(2^level-1)。
//
// 2026-07 动画升级:节点/柱子改用稳定元素 id 作 key(attachStableIds
// 预计算),上浮/下沉的每次交换,圆圈会**沿树边实际游到新位置**
// (USFCA Galles 堆动画的核心观感)——此前 key={i} 把 DOM 钉死在
// 位置上,只有数值在瞬移,transform 过渡从未真正触发。
// 注意:下标标签 [i] 与树边属于"位置层"(key 按位置,不移动),
// 只有 圆圈+数值 属于"元素层"(key 按身份,随交换游动)。

const TREE_H = 220
const BAR_AREA_H = 140

export default function HeapViz({ stepData, speedMs = 1000 }) {
  if (!stepData) return null
  const { array, ids, heapSize, comparing = [], swapped = [], sorted = [] } = stepData
  const n = array.length
  const max = Math.max(...array, 1)
  const W = Math.max(680, n * 56)

  // 动画时长跟随播放速度(与 SortingViz 同策略)
  const dur = Math.max(140, Math.min(480, speedMs * 0.45))

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

  const active = (i) => swapped.includes(i) || comparing.includes(i)

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: 12, overflow: 'hidden'
    }}>
      <svg width="100%" viewBox={`0 0 ${W} ${TREE_H}`} style={{ display: 'block' }}>
        {/* 位置层:树边(不随元素移动) */}
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
        {/* 位置层:下标标签(元素游走时 [i] 留在原槽位) */}
        {array.map((_, i) => {
          const { x, y } = nodePos(i)
          return (
            <text key={`idx${i}`} x={x} y={y - 24} textAnchor="middle"
              fill="var(--text-tertiary)" fontSize={9}>[{i}]</text>
          )
        })}
        {/* 元素层:圆圈+数值,key 用稳定 id → 交换时沿树边游到新位置 */}
        {array.map((val, i) => {
          const { x, y } = nodePos(i)
          const id = ids ? ids[i] : i
          return (
            <g key={id} style={{
              transform: `translate(${x}px, ${y}px)`,
              transition: `transform ${dur}ms cubic-bezier(0.34, 1.15, 0.64, 1)`,
            }}>
              <circle r={active(i) ? 20 : 18}
                fill={nodeColor(i)}
                stroke={strokeFor(i)}
                strokeWidth={2}
                strokeDasharray={i >= heapSize && !sorted.includes(i) ? '4 3' : '0'}
                style={{ transition: `fill ${Math.min(dur, 250)}ms, stroke ${Math.min(dur, 250)}ms, r 0.15s` }} />
              <text textAnchor="middle" y={4} fill="white" fontSize={12} fontWeight="bold">{val}</text>
            </g>
          )
        })}
      </svg>

      {/* 数组条形:同样按稳定 id 滑动 */}
      <div style={{ position: 'relative', height: BAR_AREA_H, marginTop: 16, padding: '0 8px' }}>
        {array.map((val, i) => {
          const slotW = (W - 16) / n
          const barH = (val / max) * (BAR_AREA_H - 28)
          const id = ids ? ids[i] : i
          return (
            <div key={id} style={{
              position: 'absolute',
              left: i * slotW,
              bottom: 0,
              width: slotW - 4,
              transition: `left ${dur}ms cubic-bezier(0.34, 1.15, 0.64, 1), background ${Math.min(dur, 250)}ms`,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{val}</span>
              <div style={{
                width: '100%',
                height: barH,
                background: nodeColor(i),
                borderRadius: '3px 3px 0 0',
                transition: `height ${Math.min(dur, 300)}ms, background ${Math.min(dur, 250)}ms`,
                opacity: i >= heapSize && !sorted.includes(i) ? 0.4 : 1,
              }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
