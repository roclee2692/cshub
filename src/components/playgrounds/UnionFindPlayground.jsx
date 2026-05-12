import { useState, useMemo } from 'react'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn } from './shared'

const PRESETS = {
  default: {
    n: 8,
    ops: [
      { type: 'union', a: 0, b: 1 },
      { type: 'union', a: 2, b: 3 },
      { type: 'union', a: 4, b: 5 },
      { type: 'union', a: 6, b: 7 },
      { type: 'union', a: 1, b: 3 },
      { type: 'union', a: 5, b: 7 },
      { type: 'find', x: 0 },
      { type: 'union', a: 2, b: 6 },
      { type: 'find', x: 0 },
    ],
  },
  small: {
    n: 6,
    ops: [
      { type: 'union', a: 0, b: 2 },
      { type: 'union', a: 1, b: 3 },
      { type: 'union', a: 0, b: 4 },
      { type: 'find', x: 4 },
      { type: 'union', a: 2, b: 5 },
      { type: 'union', a: 1, b: 5 },
      { type: 'find', x: 3 },
    ],
  },
}

const NODE_R = 22
const W = 560
const H = 200

function getPositions(n) {
  const positions = []
  const cols = Math.ceil(n / 2)
  for (let i = 0; i < n; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    positions.push({
      x: 40 + col * (W - 80) / (cols - 1 || 1),
      y: 50 + row * 100,
    })
  }
  return positions
}

function buildTree(parent, n) {
  const children = Array.from({ length: n }, () => [])
  const roots = []
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) roots.push(i)
    else children[parent[i]].push(i)
  }
  return { children, roots }
}

function treePositions(parent, size, n) {
  const { children, roots } = buildTree(parent, n)
  const pos = Array(n).fill(null)

  function subtreeWidth(node) {
    if (children[node].length === 0) return 1
    return children[node].reduce((s, c) => s + subtreeWidth(c), 0)
  }

  let totalW = roots.reduce((s, r) => s + subtreeWidth(r), 0)
  let xOffset = 40

  function layout(node, x, y) {
    pos[node] = { x, y }
    let cx = x - (subtreeWidth(node) - 1) * 50 / 2
    for (const child of children[node]) {
      const sw = subtreeWidth(child)
      layout(child, cx + (sw - 1) * 50 / 2, y + 80)
      cx += sw * 50
    }
  }

  let rx = 60
  for (const root of roots) {
    const sw = subtreeWidth(root)
    layout(root, rx + (sw - 1) * 50 / 2, 50)
    rx += sw * 50 + 20
  }

  return pos
}

const COLOR = {
  default: 'var(--surface-2)',
  active: '#8b5cf6',
  path: '#3b82f6',
  same: '#f59e0b',
}

export default function UnionFindPlayground({ algoFn }) {
  const [preset, setPreset] = useState('default')
  const { n, ops } = PRESETS[preset]
  const steps = useMemo(() => algoFn(n, ops), [algoFn, n, ops])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  const pos = useMemo(() => {
    if (!current) return []
    return treePositions(current.parent, current.size, n)
  }, [current, n])

  const svgH = pos.length ? Math.max(...pos.filter(Boolean).map(p => p.y)) + 60 : 140

  if (!current) return null

  const activeSet = new Set(current.active)
  const pathSet = new Set(current.pathNodes)

  function nodeColor(i) {
    if (activeSet.has(i)) return COLOR.active
    if (pathSet.has(i)) return COLOR.path
    if (current.action === 'same' && activeSet.has(i)) return COLOR.same
    return COLOR.default
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn active={preset === 'default'} onClick={() => { setPreset('default'); ctrl.reset() }}>默认 (8节点)</ToolbarBtn>
        <ToolbarBtn active={preset === 'small'} onClick={() => { setPreset('small'); ctrl.reset() }}>简单 (6节点)</ToolbarBtn>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          操作: {ctrl.step}/{steps.length - 1}
        </span>
      </Toolbar>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflow: 'hidden' }}>
        <svg width="100%" viewBox={`0 0 600 ${svgH}`} style={{ display: 'block', minHeight: 140 }}>
          {/* Edges */}
          {pos.filter(Boolean).map((p, i) => {
            const par = current.parent[i]
            if (par === i || !pos[par]) return null
            const pp = pos[par]
            return (
              <g key={i}>
                <line x1={p.x} y1={p.y} x2={pp.x} y2={pp.y}
                  stroke={pathSet.has(i) ? '#3b82f6' : 'var(--border)'}
                  strokeWidth={pathSet.has(i) ? 2.5 : 1.5}
                  strokeDasharray={pathSet.has(i) ? '5,3' : 'none'} />
                <polygon
                  points={arrowHead(p.x, p.y, pp.x, pp.y, NODE_R)}
                  fill={pathSet.has(i) ? '#3b82f6' : 'var(--text-tertiary)'}
                />
              </g>
            )
          })}

          {/* Nodes */}
          {pos.filter(Boolean).map((p, i) => {
            const color = nodeColor(i)
            const isRoot = current.parent[i] === i
            return (
              <g key={i} style={{ transform: `translate(${p.x}px,${p.y}px)`, transition: 'transform 0.4s' }}>
                <circle r={NODE_R} fill={color} stroke={isRoot ? '#10b981' : 'var(--border)'}
                  strokeWidth={isRoot ? 2.5 : 1.5} />
                <text textAnchor="middle" dominantBaseline="central"
                  fill={color === COLOR.default ? 'var(--text-primary)' : 'white'}
                  fontSize={13} fontWeight={700} fontFamily="var(--font-mono)">
                  {i}
                </text>
                <text textAnchor="middle" y={NODE_R + 12}
                  fill="var(--text-tertiary)" fontSize={10} fontFamily="var(--font-mono)">
                  {isRoot ? `s=${current.size[i]}` : `p=${current.parent[i]}`}
                </text>
              </g>
            )
          })}
        </svg>

        <div style={{ display: 'flex', gap: 16, padding: '8px 16px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { color: COLOR.active, label: '操作节点' },
            { color: COLOR.path, label: '路径压缩' },
            { color: '#10b981', label: '根节点(绿边框)' },
          ].map(({ color, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}

function arrowHead(x1, y1, x2, y2, nodeR) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < nodeR * 2 + 10) return '0,0 0,0 0,0'
  const ux = dx / len, uy = dy / len
  const tx = x1 + ux * (len - nodeR - 4)
  const ty = y1 + uy * (len - nodeR - 4)
  const px = -uy * 4, py = ux * 4
  return `${tx},${ty} ${tx - ux * 8 + px},${ty - uy * 8 + py} ${tx - ux * 8 - px},${ty - uy * 8 - py}`
}
