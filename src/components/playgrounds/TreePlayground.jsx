import { useState, useMemo } from 'react'
import TreeViz from '../TreeViz'
import RBTreeViz from '../RBTreeViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput, Legend } from './shared'

const DEFAULTS = {
  bst: [50, 30, 70, 20, 40, 60, 80, 10, 25],
  rb: [10, 20, 30, 15, 25, 5, 1],
}

export default function TreePlayground({ algoFn, viz }) {
  const defaults = DEFAULTS[viz]
  const [values, setValues] = useState(defaults)
  const [text, setText] = useState(defaults.join(' '))

  const steps = useMemo(() => algoFn(values), [algoFn, values])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function apply() {
    const parsed = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (parsed.length >= 1) { setValues(parsed); ctrl.reset() }
  }

  function preset(arr) {
    setValues(arr); setText(arr.join(' ')); ctrl.reset()
  }

  return (
    <div>
      <Toolbar>
        {viz === 'bst' && (
          <>
            <ToolbarBtn onClick={() => preset([50, 30, 70, 20, 40, 60, 80])}>平衡示例</ToolbarBtn>
            <ToolbarBtn onClick={() => preset([10, 20, 30, 40, 50])}>退化示例</ToolbarBtn>
          </>
        )}
        {viz === 'rb' && (
          <>
            <ToolbarBtn onClick={() => preset([10, 20, 30, 15, 25, 5, 1])}>典型示例</ToolbarBtn>
            <ToolbarBtn onClick={() => preset([1, 2, 3, 4, 5, 6, 7])}>升序插入</ToolbarBtn>
          </>
        )}
        <div style={{ flex: 1 }} />
        <TextInput value={text} onChange={setText} placeholder="50 30 70 20"
          onSubmit={apply} />
      </Toolbar>

      <div style={{ marginBottom: 16 }}>
        {viz === 'rb' ? <RBTreeViz stepData={current} /> : <TreeViz stepData={current} />}
      </div>

      {viz === 'rb' && (
        <Legend items={[
          { color: '#ef4444', label: '红色节点' },
          { color: '#1f2937', label: '黑色节点' },
          { color: 'var(--yellow)', label: '当前操作' },
        ]} />
      )}

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
