import { useMemo } from 'react'
import FloydViz from '../FloydViz'
import GraphViz from '../GraphViz'
import StepController, { useStepController } from '../StepController'

const FLOYD_GRAPH = {
  nodes: [
    { id: 'A', x: 300, y: 60 },
    { id: 'B', x: 120, y: 200 },
    { id: 'C', x: 480, y: 200 },
    { id: 'D', x: 200, y: 340 },
    { id: 'E', x: 400, y: 340 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 3 },
    { from: 'A', to: 'C', weight: 8 },
    { from: 'A', to: 'D', weight: -4 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'B', to: 'E', weight: 7 },
    { from: 'C', to: 'B', weight: 4 },
    { from: 'D', to: 'E', weight: 6 },
    { from: 'E', to: 'C', weight: 2 },
    { from: 'E', to: 'A', weight: 2 },
  ],
}

export default function FloydPlayground({ algoFn }) {
  const steps = useMemo(() => algoFn(FLOYD_GRAPH), [algoFn])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  // Build visited/active sets for GraphViz coloring
  const graphStep = current ? {
    visited: current.phase === 'done' ? FLOYD_GRAPH.nodes.map(n => n.id) : (current.k != null ? [FLOYD_GRAPH.nodes[current.k]?.id] : []),
    current: current.i != null ? FLOYD_GRAPH.nodes[current.i]?.id : null,
    dist: current.dist ? buildDistObj(current.nodes, current.dist) : null,
  } : null

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Graph view */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 12px',
          overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>
            图结构
          </div>
          <GraphViz graph={FLOYD_GRAPH} stepData={graphStep} />
        </div>

        {/* Matrix view */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 12px',
          overflow: 'auto',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 8 }}>
            距离矩阵 dist[i][j]
          </div>
          <FloydViz stepData={current} />
        </div>
      </div>

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}

function buildDistObj(nodes, dist) {
  const obj = {}
  nodes.forEach((id, i) => {
    let minDist = Infinity
    nodes.forEach((_, j) => { if (dist[j][i] < minDist) minDist = dist[j][i] })
    obj[id] = minDist === Infinity ? Infinity : minDist
  })
  return obj
}
