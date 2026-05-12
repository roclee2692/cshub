import { useState, useMemo } from 'react'
import LISViz from '../LISViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput } from './shared'

function randomArray(n = 10) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 20) + 1)
}

export default function LISPlayground({ algoFn }) {
  const [arr, setArr] = useState(() => randomArray())
  const [text, setText] = useState('')

  const steps = useMemo(() => algoFn(arr), [algoFn, arr])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function applyCustom() {
    const parsed = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0)
    if (parsed.length >= 2) { setArr(parsed); ctrl.reset() }
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => { setArr(randomArray()); ctrl.reset() }}>🎲 随机 (10)</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(8)); ctrl.reset() }}>短数组 (8)</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr([1, 3, 5, 7, 9, 2, 4, 6, 8]); ctrl.reset() }}>经典示例</ToolbarBtn>
        <div style={{ flex: 1 }} />
        <TextInput value={text} onChange={setText} placeholder="自定义：10 9 2 5 3 7 101 18"
          onSubmit={applyCustom} submitLabel="应用" />
      </Toolbar>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginBottom: 16,
        padding: '20px 12px',
        overflowX: 'auto',
      }}>
        <LISViz stepData={current} />
      </div>

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
