import HeapViz from '../HeapViz'
import PlaygroundShell from './PlaygroundShell'
import { attachStableIds } from '../SortingViz'
import { randomArray, ArrayTextInput } from './inputs/ArrayInput'

const PRESETS = [
  { id: 'random10', label: '🎲 随机',     state: () => ({ arr: randomArray(10) }) },
  { id: 'short7',   label: '短数组 (7)',  state: () => ({ arr: randomArray(7) }) },
  { id: 'long15',   label: '长数组 (15)', state: () => ({ arr: randomArray(15) }) },
]

const LEGEND = [
  { color: 'var(--accent)', label: '堆中节点' },
  { color: 'var(--yellow)', label: '比较中' },
  { color: 'var(--red)', label: '交换' },
  { color: 'var(--green)', label: '已排序' },
  { color: 'var(--bar-inactive)', label: '堆外' },
]

export default function HeapPlayground({ algoFn }) {
  return (
    <PlaygroundShell
      initialState={{ arr: randomArray(10), text: '' }}
      presets={PRESETS}
      derivePayload={s => s.arr}
      // attachStableIds 标注元素身份 → 上浮/下沉时节点沿树边游动(见 HeapViz)
      computeSteps={arr => attachStableIds(algoFn(arr))}
      extraToolbar={({ state, setState, ctrl }) => (
        <ArrayTextInput state={state} setState={setState} ctrl={ctrl}
          placeholder="3 1 6 5 2 4" positiveOnly={false} />
      )}
      renderViz={({ current, ctrl }) => (
        <>
          <HeapViz stepData={current} speedMs={ctrl.speed} />
          <div style={{ height: 16 }} />
        </>
      )}
      legend={LEGEND}
    />
  )
}
