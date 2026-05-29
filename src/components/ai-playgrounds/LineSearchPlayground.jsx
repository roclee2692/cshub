import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'

// 1D 函数用于线搜索演示
const fn = x => (x - 3) * (x - 3) * (x - 1) * (x - 1) * 0.1 + 0.5
const fnPrime = x => 0.1 * 2 * (x - 3) * ((x - 1) * (x - 1) + (x - 3) * (x - 1))

const W = 480
const H = 280
const PAD = 40
const X_RANGE = [-1, 5]

function toSvgX(x) { return PAD + (x - X_RANGE[0]) / (X_RANGE[1] - X_RANGE[0]) * (W - 2 * PAD) }
function toSvgY(y, yRange) { return H - PAD - (y - yRange[0]) / (yRange[1] - yRange[0]) * (H - 2 * PAD) }

function computeSteps(method) {
  const steps = []
  const yRange = [0, 4]

  // 生成曲线点
  const curvePoints = []
  for (let x = X_RANGE[0]; x <= X_RANGE[1]; x += 0.05) {
    curvePoints.push({ x, y: fn(x) })
  }

  if (method === 'golden') {
    // 黄金分割法
    let a = 0, b = 4
    const phi = (Math.sqrt(5) - 1) / 2
    let x1 = b - phi * (b - a)
    let x2 = a + phi * (b - a)
    let f1 = fn(x1), f2 = fn(x2)

    for (let i = 0; i < 12; i++) {
      steps.push({
        description: `步骤 ${i + 1}: 区间 [${a.toFixed(3)}, ${b.toFixed(3)}], x1=${x1.toFixed(3)}, x2=${x2.toFixed(3)}`,
        a, b, x1, x2, f1, f2, method, curvePoints, yRange,
      })

      if (f1 > f2) {
        a = x1
        x1 = x2
        f1 = f2
        x2 = a + phi * (b - a)
        f2 = fn(x2)
      } else {
        b = x2
        x2 = x1
        f2 = f1
        x1 = b - phi * (b - a)
        f1 = fn(x1)
      }
    }
    steps.push({ description: `收敛: x = ${((a + b) / 2).toFixed(4)}`, a, b, x1: (a + b) / 2, x2: (a + b) / 2, f1: fn((a + b) / 2), f2: fn((a + b) / 2), method, curvePoints, yRange })
  } else {
    // 回溯线搜索
    let x = 0.5
    const c = 1e-4
    const rho = 0.5

    for (let i = 0; i < 10; i++) {
      const fx = fn(x)
      const gx = fnPrime(x)
      let alpha = 1
      let newX = x - alpha * gx
      let count = 0

      // Armijo 条件
      while (fn(newX) > fx - c * alpha * gx * gx && count < 10) {
        alpha *= rho
        newX = x - alpha * gx
        count++
      }

      steps.push({
        description: `步骤 ${i + 1}: x=${x.toFixed(3)}, α=${alpha.toFixed(4)}, 搜索 ${count} 次`,
        a: x, b: newX, x1: x, x2: newX, f1: fx, f2: fn(newX), method, curvePoints, yRange, alpha,
      })

      x = newX
      if (Math.abs(gx) < 0.01) break
    }
    steps.push({ description: `收敛: x = ${x.toFixed(4)}`, a: x, b: x, x1: x, x2: x, f1: fn(x), f2: fn(x), method, curvePoints, yRange })
  }

  return steps
}

export default function LineSearchPlayground() {
  const presets = useMemo(() => [
    { id: 'golden', label: '黄金分割法', state: { method: 'golden' } },
    { id: 'backtrack', label: '回溯线搜索', state: { method: 'backtrack' } },
  ], [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.method)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ method: 'golden' }}
      presets={presets}
      derivePayload={s => s}
      computeSteps={computeStepsFn}
      renderViz={({ current }) => {
        const curvePath = current.curvePoints.map(p =>
          `${toSvgX(p.x)},${toSvgY(p.y, current.yRange)}`
        ).join(' ')

        return (
          <VizCard>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 480 }}>
              {/* 曲线 */}
              <polyline points={curvePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />

              {/* 坐标轴 */}
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />

              {/* 区间标记 */}
              <line x1={toSvgX(current.a)} y1={H - PAD} x2={toSvgX(current.a)} y2={H - PAD - 15}
                stroke="#f59e0b" strokeWidth="2" />
              <line x1={toSvgX(current.b)} y1={H - PAD} x2={toSvgX(current.b)} y2={H - PAD - 15}
                stroke="#f59e0b" strokeWidth="2" />

              {/* 区间连线 */}
              <line x1={toSvgX(current.a)} y1={H - PAD - 8} x2={toSvgX(current.b)} y2={H - PAD - 8}
                stroke="#f59e0b" strokeWidth="2" />

              {/* 测试点 */}
              <circle cx={toSvgX(current.x1)} cy={toSvgY(current.f1, current.yRange)} r="5" fill="#10b981" />
              <circle cx={toSvgX(current.x2)} cy={toSvgY(current.f2, current.yRange)} r="5" fill="#3b82f6" />

              {/* 标注 */}
              <text x={toSvgX(current.a)} y={H - 4} textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">a</text>
              <text x={toSvgX(current.b)} y={H - 4} textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">b</text>
            </svg>
          </VizCard>
        )
      }}
    />
  )
}
