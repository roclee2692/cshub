import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'
import { OptVizCanvas, Axes, PathLine, CurrentDot, contourPaths } from './OptViz2D'

// 非对称函数：x 方向曲率小，y 方向曲率大（RMSProp 优势明显）
const fn = (x, y) => 0.05 * x * x + 5 * y * y
const grad = (x, y) => [0.1 * x, 10 * y]

const X_RANGE = [-6, 6]
const Y_RANGE = [-2, 2]
const LEVELS = [0.3, 1, 3, 6, 12, 25, 50]

function computeSteps(lr, beta) {
  const steps = []
  let x = 5, y = 1.5
  let sx = 0, sy = 0 // 二阶矩
  const eps = 1e-8
  const maxSteps = 60
  const path = [{ x, y }]

  for (let i = 0; i < maxSteps; i++) {
    const [gx, gy] = grad(x, y)
    const loss = fn(x, y)

    steps.push({
      description: `步骤 ${i + 1}: x=(${x.toFixed(2)}, ${y.toFixed(2)}), s=(${sx.toFixed(3)}, ${sy.toFixed(3)}), loss=${loss.toFixed(3)}`,
      x, y, sx, sy, gx, gy, loss, beta,
      pathX: Math.sqrt(sx + eps).toFixed(3),
      pathY: Math.sqrt(sy + eps).toFixed(3),
      path: path.map(p => ({ ...p })),
    })

    sx = beta * sx + (1 - beta) * gx * gx
    sy = beta * sy + (1 - beta) * gy * gy
    x -= lr * gx / (Math.sqrt(sx) + eps)
    y -= lr * gy / (Math.sqrt(sy) + eps)
    path.push({ x, y })

    if (loss < 0.001) break
  }

  steps.push({
    description: `收敛: (${x.toFixed(3)}, ${y.toFixed(3)}), loss=${fn(x, y).toFixed(4)}`,
    x, y, sx: 0, sy: 0, gx: 0, gy: 0, loss: fn(x, y), beta,
    pathX: '0', pathY: '0',
    path: path.map(p => ({ ...p })),
  })

  return steps
}

export default function RMSPropPlayground() {
  const presets = useMemo(() => [
    { id: 'rms09', label: 'β=0.9', state: { lr: 0.1, beta: 0.9 } },
    { id: 'rms099', label: 'β=0.99', state: { lr: 0.1, beta: 0.99 } },
    { id: 'fixed', label: '固定 lr 对比', state: { lr: 0.01, beta: 0 } },
  ], [])

  const contours = useMemo(() => contourPaths(fn, X_RANGE, Y_RANGE, LEVELS), [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.lr, state.beta)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ lr: 0.1, beta: 0.9 }}
      presets={presets}
      derivePayload={s => s}
      computeSteps={computeStepsFn}
      legend={[
        { color: '#f97316', label: '优化路径' },
        { color: '#ef4444', label: '当前位置' },
      ]}
      renderViz={({ current }) => (
        <VizCard>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <OptVizCanvas>
              <Axes xRange={X_RANGE} yRange={Y_RANGE} />
              {contours.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--border)" strokeWidth="0.8" opacity="0.5" />
              ))}
              <PathLine points={current.path} xRange={X_RANGE} yRange={Y_RANGE} />
              <CurrentDot x={current.x} y={current.y} xRange={X_RANGE} yRange={Y_RANGE} />
            </OptVizCanvas>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>loss: <b>{current.loss.toFixed(3)}</b></span>
              <span>有效 lr: x={current.pathX}, y={current.pathY}</span>
            </div>
          </div>
        </VizCard>
      )}
    />
  )
}
