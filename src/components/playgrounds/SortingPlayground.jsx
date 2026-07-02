import SortingViz, { attachStableIds } from '../SortingViz'
import MergeSortViz from '../MergeSortViz'
import QuickSortViz from '../QuickSortViz'
import PlaygroundShell from './PlaygroundShell'
import VizCard from './VizCard'
import { randomArray, ArrayTextInput } from './inputs/ArrayInput'
import { VIZ_COLORS, SORTING_LEGEND } from '../../styles/vizTokens'

const VIZ_FOR = {
  mergesort: MergeSortViz,
  quicksort: QuickSortViz,
}

// MergeSort / QuickSort 用算法专属配色，其他排序统一走 SORTING_LEGEND（compare/swap/sorted）
const LEGEND_FOR = {
  mergesort: [
    { color: VIZ_COLORS.active,                 label: '正在划分 ▼' },
    { color: VIZ_COLORS.merge,                  label: '左半' },
    { color: VIZ_COLORS.target,                 label: '右半' },
    { color: VIZ_COLORS.path,                   label: '已归并到父层 ▲' },
    { color: 'var(--accent-light)',             label: '归并目标 slot' },
    { color: VIZ_COLORS.sorted,                 label: '排序完成' },
  ],
  quicksort: [
    { color: VIZ_COLORS.pivot,                  label: '当前 Pivot' },
    { color: 'rgba(16, 185, 129, 0.55)',        label: '≤ Pivot 已分组' },
    { color: 'rgba(139, 92, 246, 0.4)',         label: '待扫描' },
    { color: VIZ_COLORS.compare,                label: '正在比较' },
    { color: '#059669',                         label: '已最终归位' },
  ],
}

export default function SortingPlayground({ algoFn, algoSlug }) {
  const startSize = (algoSlug === 'mergesort' || algoSlug === 'quicksort') ? 10 : 14
  const VizComponent = VIZ_FOR[algoSlug] || SortingViz
  const legend = LEGEND_FOR[algoSlug] || SORTING_LEGEND

  const presets = [
    { id: 'random',  label: '🎲 随机数组',  state: () => ({ arr: randomArray(14) }) },
    { id: 'short8',  label: '短数组 (8)',   state: () => ({ arr: randomArray(8) }) },
    { id: 'sorted',  label: '已排序',       state: (s) => ({ arr: [...s.arr].sort((a, b) => a - b) }) },
    { id: 'reverse', label: '逆序',         state: (s) => ({ arr: [...s.arr].sort((a, b) => b - a) }) },
  ]

  return (
    <PlaygroundShell
      initialState={{ arr: randomArray(startSize), text: '' }}
      presets={presets}
      derivePayload={s => s.arr}
      // attachStableIds 给每步标注元素身份 → 柱子滑动动画(见 SortingViz)
      computeSteps={arr => attachStableIds(algoFn(arr))}
      extraToolbar={({ state, setState, ctrl }) => (
        <ArrayTextInput state={state} setState={setState} ctrl={ctrl}
          placeholder="自定义：5 3 8 1 9 2" />
      )}
      renderViz={({ current, state, ctrl }) => (
        <VizCard>
          <VizComponent stepData={current} maxVal={Math.max(...state.arr)} speedMs={ctrl.speed} />
        </VizCard>
      )}
      legend={legend}
    />
  )
}
