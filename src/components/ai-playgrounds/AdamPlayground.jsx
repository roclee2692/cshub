import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'
import { OptVizCanvas, Axes, PathLine, CurrentDot, contourPaths } from './OptViz2D'

const fn = (x, y) => 0.05 * x * x + 5 * y * y
const grad = (x, y) => [0.1 * x, 10 * y]

const X_RANGE = [-6, 6]
const Y_RANGE = [-2, 2]
const LEVELS = [0.3, 1, 3, 6, 12, 25, 50]

function computeSteps(lr, beta1, beta2) {
  const steps = []
  let x = 5, y = 1.5
  let mx = 0, my = 0 // 一阶矩
  let vx = 0, vy = 0 // 二阶矩
  const eps = 1e-8
  const maxSteps = 60
  const path = [{ x, y }]

  for (let i = 0; i < maxSteps; i++) {
    const [gx, gy] = grad(x, y)
    const loss = fn(x, y)

    steps.push({
      description: `步骤 ${i + 1}: x=(${x.toFixed(2)}, ${y.toFixed(2)}), loss=${loss.toFixed(3)}`,
      x, y, loss, mx: mx.toFixed(4), my: my.toFixed(4), beta1, beta2,
      path: path.map(p => ({ ...p })),
    })

    mx = beta1 * mx + (1 - beta1) * gx
    my = beta1 * my + (1 - beta1) * gy
    vx = beta2 * vx + (1 - beta2) * gx * gx
    vy = beta2 * vy + (1 - beta2) * gy * gy

    const t = i + 1
    const mxHat = mx / (1 - Math.pow(beta1, t))
    const myHat = my / (1 - Math.pow(beta1, t))
    const vxHat = vx / (1 - Math.pow(beta2, t))
    const vyHat = vy / (1 - Math.pow(beta2, t))

    x -= lr * mxHat / (Math.sqrt(vxHat) + eps)
    y -= lr * myHat / (Math.sqrt(vyHat) + eps)
    path.push({ x, y })

    if (loss < 0.001) break
  }

  steps.push({
    description: `收敛: (${x.toFixed(3)}, ${y.toFixed(3)}), loss=${fn(x, y).toFixed(4)}`,
    x, y, loss: fn(x, y), mx: '0', my: '0', beta1, beta2,
    path: path.map(p => ({ ...p })),
  })

  return steps
}

export default function AdamPlayground() {
  const presets = useMemo(() => [
    { id: 'adam', label: 'Adam (默认)', state: { lr: 0.1, beta1: 0.9, beta2: 0.999 } },
    { id: 'adam-fast', label: 'Adam (大 lr)', state: { lr: 0.5, beta1: 0.9, beta2: 0.999 } },
    { id: 'adam-slow', label: 'Adam (小 lr)', state: { lr: 0.02, beta1: 0.9, beta2: 0.999 } },
  ], [])

  const contours = useMemo(() => contourPaths(fn, X_RANGE, Y_RANGE, LEVELS), [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.lr, state.beta1, state.beta2)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ lr: 0.1, beta1: 0.9, beta2: 0.999 }}
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
              <span>β1={current.beta1}, β2={current.beta2}</span>
            </div>
          </div>
        </VizCard>
      )}
    />
  )
}
