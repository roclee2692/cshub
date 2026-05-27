import { useMemo, useCallback } from 'react'
import PlaygroundShell from '../playgrounds/PlaygroundShell'
import VizCard from '../playgrounds/VizCard'
import { OptVizCanvas, Axes, contourPaths } from './OptViz2D'

// Rastrigin 函数（多局部最优，适合测试 PSO）
const fn = (x, y) => 20 + x * x - 10 * Math.cos(2 * Math.PI * x) + y * y - 10 * Math.cos(2 * Math.PI * y)

const X_RANGE = [-5, 5]
const Y_RANGE = [-5, 5]
const LEVELS = [2, 5, 10, 20, 40, 60, 80]

function computeSteps(numParticles, w, c1, c2) {
  const steps = []

  // 初始化粒子
  let particles = Array.from({ length: numParticles }, () => ({
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    px: 0, py: 0, // 个体最优
    pBest: Infinity,
  }))

  // 初始化个体最优
  particles.forEach(p => {
    p.px = p.x
    p.py = p.y
    p.pBest = fn(p.x, p.y)
  })

  let gx = particles[0].x, gy = particles[0].y
  let gBest = fn(gx, gy)
  particles.forEach(p => {
    const f = fn(p.x, p.y)
    if (f < gBest) { gBest = f; gx = p.x; gy = p.y }
  })

  for (let iter = 0; iter < 25; iter++) {
    steps.push({
      description: `迭代 ${iter + 1}: 全局最优=(${gx.toFixed(2)}, ${gy.toFixed(2)}), f=${gBest.toFixed(3)}`,
      particles: particles.map(p => ({ x: p.x, y: p.y, vx: p.vx, vy: p.vy })),
      gx, gy, gBest, iter, w, c1, c2,
    })

    // 更新每个粒子
    particles.forEach(p => {
      const r1 = Math.random(), r2 = Math.random()
      p.vx = w * p.vx + c1 * r1 * (p.px - p.x) + c2 * r2 * (gx - p.x)
      p.vy = w * p.vy + c1 * r1 * (p.py - p.y) + c2 * r2 * (gy - p.y)
      p.x += p.vx
      p.y += p.vy

      // 边界约束
      p.x = Math.max(-5, Math.min(5, p.x))
      p.y = Math.max(-5, Math.min(5, p.y))

      // 更新个体最优
      const f = fn(p.x, p.y)
      if (f < p.pBest) {
        p.pBest = f
        p.px = p.x
        p.py = p.y
      }

      // 更新全局最优
      if (f < gBest) {
        gBest = f
        gx = p.x
        gy = p.y
      }
    })

    if (gBest < 0.01) break
  }

  steps.push({
    description: `最终: 全局最优=(${gx.toFixed(3)}, ${gy.toFixed(3)}), f=${gBest.toFixed(4)}`,
    particles: particles.map(p => ({ x: p.x, y: p.y, vx: p.vx, vy: p.vy })),
    gx, gy, gBest, iter: 50, w, c1, c2,
  })

  return steps
}

export default function PSOPlayground() {
  const presets = useMemo(() => [
    { id: 'default', label: '标准 PSO', state: { numParticles: 20, w: 0.7, c1: 1.5, c2: 1.5 } },
    { id: 'inertia', label: '高惯性', state: { numParticles: 20, w: 1.2, c1: 1.5, c2: 1.5 } },
    { id: 'social', label: '社会导向', state: { numParticles: 20, w: 0.7, c1: 0.5, c2: 2.5 } },
  ], [])

  const contours = useMemo(() => contourPaths(fn, X_RANGE, Y_RANGE, LEVELS), [])

  const computeStepsFn = useCallback((state) => {
    return computeSteps(state.numParticles, state.w, state.c1, state.c2)
  }, [])

  return (
    <PlaygroundShell
      initialState={{ numParticles: 20, w: 0.7, c1: 1.5, c2: 1.5 }}
      presets={presets}
      derivePayload={s => s}
      computeSteps={computeStepsFn}
      legend={[
        { color: '#3b82f6', label: '粒子' },
        { color: '#f59e0b', label: '全局最优' },
      ]}
      renderViz={({ current }) => (
        <VizCard>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <OptVizCanvas>
              <Axes xRange={X_RANGE} yRange={Y_RANGE} />
              {contours.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="var(--border)" strokeWidth="0.8" opacity="0.4" />
              ))}
              {/* 粒子 */}
              {current.particles.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={(p.x + 5) / 10 * 410 + 35}
                    cy={(5 - p.y) / 10 * 250 + 35}
                    r="4" fill="#3b82f6" opacity="0.7"
                  />
                  {/* 速度箭头 */}
                  <line
                    x1={(p.x + 5) / 10 * 410 + 35}
                    y1={(5 - p.y) / 10 * 250 + 35}
                    x2={(p.x + 5) / 10 * 410 + 35 + p.vx * 8}
                    y2={(5 - p.y) / 10 * 250 + 35 - p.vy * 8}
                    stroke="#3b82f6" strokeWidth="1" opacity="0.4"
                  />
                </g>
              ))}
              {/* 全局最优 */}
              <circle
                cx={(current.gx + 5) / 10 * 410 + 35}
                cy={(5 - current.gy) / 10 * 250 + 35}
                r="8" fill="none" stroke="#f59e0b" strokeWidth="2.5"
              >
                <animate attributeName="r" values="8;11;8" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </OptVizCanvas>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span>迭代: {current.iter}</span>
              <span>最优: <b>{current.gBest.toFixed(3)}</b></span>
              <span>w={current.w}, c1={current.c1}, c2={current.c2}</span>
            </div>
          </div>
        </VizCard>
      )}
    />
  )
}
