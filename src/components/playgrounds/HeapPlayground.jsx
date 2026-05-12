import { useState, useMemo } from 'react'
import HeapViz from '../HeapViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput, Legend } from './shared'

function randomArray(n = 10) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10)
}

export default function HeapPlayground({ algoFn }) {
  const [arr, setArr] = useState(() => randomArray())
  const [text, setText] = useState('')

  const steps = useMemo(() => algoFn(arr), [algoFn, arr])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function apply() {
    const parsed = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (parsed.length >= 2) { setArr(parsed); ctrl.reset() }
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => { setArr(randomArray()); ctrl.reset() }}>🎲 随机</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(7)); ctrl.reset() }}>短数组 (7)</ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(15)); ctrl.reset() }}>长数组 (15)</ToolbarBtn>
        <div style={{ flex: 1 }} />
        <TextInput value={text} onChange={setText} placeholder="3 1 6 5 2 4"
          onSubmit={apply} />
      </Toolbar>

      <HeapViz stepData={current} />

      <div style={{ height: 16 }} />

      <Legend items={[
        { color: 'var(--accent)', label: '堆中节点' },
        { color: 'var(--yellow)', label: '比较中' },
        { color: 'var(--red)', label: '交换' },
        { color: 'var(--green)', label: '已排序' },
        { color: 'var(--bar-inactive)', label: '堆外' },
      ]} />

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
