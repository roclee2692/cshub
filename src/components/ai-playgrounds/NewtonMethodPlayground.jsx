import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'
import { OptVizCanvas, Axes, PathLine, CurrentDot, contourPaths } from './OptViz2D'

// 二次函数：牛顿法一步收敛
const fn = (x, y) => x * x + 4 * y * y
const grad = (x, y) => [2 * x, 8 * y]
const hessian = () => [[2, 0], [0, 8]] // 常数 Hessian

const X_RANGE = [-5, 5]
const Y_RANGE = [-3, 3]
const LEVELS = [1, 4, 9, 16, 25, 40]

function computeSteps(useNewton) {
  const steps = []
  let x = 4, y = 2
  const maxSteps = useNewton ? 5 : 40
  const path = [{ x, y }]
  const lr = 0.1

  for (let i = 0; i < maxSteps; i++) {
    const [gx, gy] = grad(x, y)
    const loss = fn(x, y)

    steps.push({
      description: useNewton
        ? `牛顿法 步骤 ${i + 1}: x=(${x.toFixed(3)}, ${y.toFixed(3)}), loss=${loss.toFixed(4)}`
        : `梯度下降 步骤 ${i + 1}: x=(${x.toFixed(3)}, ${y.toFixed(3)}), loss=${loss.toFixed(4)}`,
      x, y, loss, useNewton, gx, gy,
      path: path.map(p => ({ ...p })),
    })

    if (useNewton) {
      const H = hessian()
      const Hinv = [[1 / H[0][0], 0], [0, 1 / H[1][1]]]
      x -= Hinv[0][0] * gx + Hinv[0][1] * gy
      y -= Hinv[1][0] * gx + Hinv[1][1] * gy
    } else {
      x -= lr * gx
      y -= lr * gy
    }
    path.push({ x, y })

    if (loss < 0.0001) break
  }

  steps.push({
    description: `收敛: (${x.toFixed(4)}, ${y.toFixed(4)}), loss=${fn(x, y).toFixed(6)}`,
    x, y, loss: fn(x, y), useNewton, gx: 0, gy: 0,
    path: path.map(p => ({ ...p })),
  })

  return steps
}

export default function NewtonMethodPlayground() {
  const presets = useMemo(() => [
    { id: 'newton', label: '牛顿法', state: { useNewton: true } },
    { id: 'gd', label: '梯度下降', state: { useNewton: false } },
  ], [])

  const contours = useMemo(() => contourPaths(fn, X_RANGE, Y_RANGE, LEVELS), [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.useNewton)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ useNewton: true }}
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
              <span>{current.useNewton ? '牛顿法' : '梯度下降'}</span>
              <span>loss: <b>{current.loss.toFixed(5)}</b></span>
              <span>步数: {current.path.length - 1}</span>
            </div>
          </div>
        </VizCard>
      )}
    />
  )
}
