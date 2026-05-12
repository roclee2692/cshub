import { useState, useMemo } from 'react'
import CountingSortViz from '../CountingSortViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput, Legend } from './shared'

function randomArray(n = 10, max = 15) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * max) + 1)
}

const LEGEND = [
  { color: '#f59e0b', label: '当前处理元素' },
  { color: '#6366f1', label: '计数桶（有值）' },
  { color: '#8b5cf6', label: '输出中' },
  { color: '#10b981', label: '排序完成' },
]

export default function CountingSortPlayground({ algoFn }) {
  const [arr, setArr] = useState(() => randomArray())
  const [text, setText] = useState('')

  const steps = useMemo(() => algoFn(arr), [algoFn, arr])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function applyCustom() {
    const parsed = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0 && n <= 99)
    if (parsed.length >= 2) { setArr(parsed); ctrl.reset() }
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => { setArr(randomArray()); ctrl.reset() }}>🎲 随机 (10)</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(8, 8)); ctrl.reset() }}>小数组 (8)</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(12, 5)); ctrl.reset() }}>重复多</ToolbarBtn>
        <div style={{ flex: 1 }} />
        <TextInput value={text} onChange={setText} placeholder="自定义：3 1 4 1 5 9 2（值 ≤ 99）"
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
        <CountingSortViz stepData={current} />
      </div>

      <Legend items={LEGEND} />

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
