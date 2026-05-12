import { useState, useMemo } from 'react'
import SortingViz from '../SortingViz'
import MergeSortViz from '../MergeSortViz'
import QuickSortViz from '../QuickSortViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput, Legend } from './shared'

function randomArray(n = 14) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10)
}

const VIZ_FOR = {
  mergesort: MergeSortViz,
  quicksort: QuickSortViz,
}

const LEGEND_FOR = {
  mergesort: [
    { color: '#f59e0b', label: '正在划分 ▼' },
    { color: '#3b82f6', label: '左半' },
    { color: '#ec4899', label: '右半' },
    { color: '#8b5cf6', label: '已归并到父层 ▲' },
    { color: 'var(--accent-light)', label: '归并目标 slot' },
    { color: '#10b981', label: '排序完成' },
  ],
  quicksort: [
    { color: 'var(--pink)', label: '当前 Pivot' },
    { color: 'rgba(16, 185, 129, 0.55)', label: '≤ Pivot 已分组' },
    { color: 'rgba(139, 92, 246, 0.4)', label: '待扫描' },
    { color: 'var(--yellow)', label: '正在比较' },
    { color: '#059669', label: '已最终归位' },
  ],
}

const DEFAULT_LEGEND = [
  { color: 'var(--yellow)', label: '比较中' },
  { color: 'var(--red)', label: '交换' },
  { color: 'var(--green)', label: '已排序' },
  { color: 'var(--accent-light)', label: 'Pivot' },
  { color: 'var(--blue)', label: '归并区间' },
]

export default function SortingPlayground({ algoFn, algoSlug }) {
  const [arr, setArr] = useState(() => randomArray(algoSlug === 'mergesort' || algoSlug === 'quicksort' ? 10 : 14))
  const [text, setText] = useState('')

  const steps = useMemo(() => algoFn(arr), [algoFn, arr])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]
  const max = Math.max(...arr)

  const VizComponent = VIZ_FOR[algoSlug] || SortingViz
  const legend = LEGEND_FOR[algoSlug] || DEFAULT_LEGEND

  function applyCustom() {
    const parsed = text.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n > 0)
    if (parsed.length >= 2) { setArr(parsed); ctrl.reset() }
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => { setArr(randomArray()); ctrl.reset() }}>
          🎲 随机数组
        </ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr(randomArray(8)); ctrl.reset() }}>
          短数组 (8)
        </ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr([...arr].sort((a,b)=>a-b)); ctrl.reset() }}>
          已排序
        </ToolbarBtn>
        <ToolbarBtn onClick={() => { setArr([...arr].sort((a,b)=>b-a)); ctrl.reset() }}>
          逆序
        </ToolbarBtn>
        <div style={{ flex: 1 }} />
        <TextInput value={text} onChange={setText} placeholder="自定义：5 3 8 1 9 2"
          onSubmit={applyCustom} submitLabel="应用" />
      </Toolbar>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginBottom: 16,
        padding: '24px 12px',
        overflowX: 'auto',
      }}>
        <VizComponent stepData={current} maxVal={max} />
      </div>

      <Legend items={legend} />

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
