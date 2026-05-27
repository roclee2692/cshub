import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'
import { AI_LEGEND } from '../../styles/aiVizTokens'

// 损失函数
const FUNCTIONS = {
  quadratic: {
    label: '二次函数',
    fn: x => x * x,
    grad: x => 2 * x,
    range: [-5, 5],
    start: 4,
  },
  abs: {
    label: '绝对值',
    fn: x => Math.abs(x),
    grad: x => x > 0 ? 1 : x < 0 ? -1 : 0,
    range: [-5, 5],
    start: 4,
  },
  cubic: {
    label: '三次函数',
    fn: x => x * x * x - 3 * x,
    grad: x => 3 * x * x - 3,
    range: [-3, 3],
    start: -2.5,
  },
}

function computeSteps(lr, funcKey, startX) {
  const func = FUNCTIONS[funcKey]
  const steps = []
  let x = startX
  const maxSteps = 40

  for (let i = 0; i < maxSteps; i++) {
    const y = func.fn(x)
    const g = func.grad(x)
    steps.push({
      description: `步骤 ${i + 1}: x = ${x.toFixed(3)}, f(x) = ${y.toFixed(3)}, 梯度 = ${g.toFixed(3)}`,
      x,
      y,
      grad: g,
      lr,
      path: steps.map(s => ({ x: s.x, y: s.y })),
    })

    const newX = x - lr * g
    if (Math.abs(newX - x) < 1e-6) break
    x = newX
  }

  // 最后一步
  steps.push({
    description: `收敛: x = ${x.toFixed(3)}, f(x) = ${func.fn(x).toFixed(3)}`,
    x,
    y: func.fn(x),
    grad: func.grad(x),
    lr,
    path: steps.map(s => ({ x: s.x, y: s.y })),
  })

  return steps
}

// SVG 尺寸
const W = 500
const H = 300
const PAD = 40

function toSvgX(x, range) {
  return PAD + (x - range[0]) / (range[1] - range[0]) * (W - 2 * PAD)
}
function toSvgY(y, yRange) {
  return H - PAD - (y - yRange[0]) / (yRange[1] - yRange[0]) * (H - 2 * PAD)
}

export default function GradientDescentPlayground() {
  const presets = useMemo(() => [
    { id: 'quad', label: '二次函数', state: { func: 'quadratic', startX: 4, lr: 0.1 } },
    { id: 'cubic', label: '三次函数', state: { func: 'cubic', startX: -2.5, lr: 0.1 } },
    { id: 'slow', label: '慢学习率', state: { func: 'quadratic', startX: 4, lr: 0.02 } },
    { id: 'fast', label: '快学习率', state: { func: 'quadratic', startX: 4, lr: 0.8 } },
  ], [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.lr, state.func, state.startX)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ func: 'quadratic', startX: 4, lr: 0.1 }}
      presets={presets}
      derivePayload={s => s}
      computeSteps={computeStepsFn}
      extraToolbar={({ state, setState }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            学习率:
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={state.lr}
              onChange={e => setState(prev => ({ ...prev, lr: parseFloat(e.target.value) }))}
              style={{ width: 80 }}
            />
            <span style={{ fontFamily: 'monospace', fontSize: 11, minWidth: 32 }}>{state.lr.toFixed(2)}</span>
          </label>
        </div>
      )}
      legend={AI_LEGEND.loss}
      renderViz={({ current, state }) => {
        const func = FUNCTIONS[state.func]
        const [xMin, xMax] = func.range

        // 计算 y 范围
        let yMin = Infinity, yMax = -Infinity
        for (let x = xMin; x <= xMax; x += 0.1) {
          const y = func.fn(x)
          if (y < yMin) yMin = y
          if (y > yMax) yMax = y
        }
        // 给一些 padding
        const yPad = (yMax - yMin) * 0.1
        yMin -= yPad
        yMax += yPad

        // 生成曲线路径
        const curvePoints = []
        for (let x = xMin; x <= xMax; x += 0.05) {
          curvePoints.push(`${toSvgX(x, func.range)},${toSvgY(func.fn(x), [yMin, yMax])}`)
        }
        const curvePath = `M${curvePoints.join('L')}`

        // 路径线
        const pathPoints = current.path || []
        const pathLine = pathPoints.map(p =>
          `${toSvgX(p.x, func.range)},${toSvgY(p.y, [yMin, yMax])}`
        )

        // 当前点
        const cx = toSvgX(current.x, func.range)
        const cy = toSvgY(current.y, [yMin, yMax])

        // 梯度箭头
        const arrowLen = 30
        const gradNorm = Math.min(Math.abs(current.grad), 5) / 5
        const arrowEndX = cx - Math.sign(current.grad) * arrowLen * gradNorm

        return (
          <VizCard>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 500 }}>
                {/* 坐标轴 */}
                <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD}
                  stroke="var(--border)" strokeWidth="1" />
                <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD}
                  stroke="var(--border)" strokeWidth="1" />

                {/* 损失曲线 */}
                <path d={curvePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" opacity="0.6" />

                {/* 优化路径 */}
                {pathLine.length > 1 && (
                  <polyline
                    points={pathLine.join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="4,3"
                    opacity="0.8"
                  />
                )}

                {/* 梯度箭头 */}
                {Math.abs(current.grad) > 0.01 && (
                  <line
                    x1={cx} y1={cy}
                    x2={arrowEndX} y2={cy}
                    stroke="#f97316"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                )}
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
                  </marker>
                </defs>

                {/* 当前点 */}
                <circle cx={cx} cy={cy} r="7" fill="#ef4444" stroke="white" strokeWidth="2">
                  <animate attributeName="r" values="7;9;7" dur="1s" repeatCount="indefinite" />
                </circle>

                {/* 坐标标注 */}
                <text x={W / 2} y={H - 6} textAnchor="middle" fill="var(--text-tertiary)" fontSize="11">x</text>
                <text x={12} y={H / 2} textAnchor="middle" fill="var(--text-tertiary)" fontSize="11"
                  transform={`rotate(-90, 12, ${H / 2})`}>L(x)</text>
              </svg>

              {/* 信息面板 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                width: '100%',
                maxWidth: 400,
              }}>
                <InfoBox label="x" value={current.x.toFixed(4)} />
                <InfoBox label="f(x)" value={current.y.toFixed(4)} />
                <InfoBox label="梯度" value={current.grad.toFixed(4)} />
              </div>
            </div>
          </VizCard>
        )
      }}
    />
  )
}

function InfoBox({ label, value }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '6px 10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}
