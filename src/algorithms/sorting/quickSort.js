// Step shape:
// {
//   arr: [{id, value}, ...],
//   range: [low, high],
//   pivotId,                     // 当前 pivot 元素的 id（稳定）
//   pivotValue,
//   pivotLifted,                 // 是否将 pivot 视觉抬升
//   i, j,                        // 边界 / 扫描指针的绝对索引
//   fixedPivotIds: [...],       // 已最终归位的 pivot id 集合
//   compareIds: [jId, pivotId],  // 当前比较的两个 id（用于 j 圆的发光）
//   swapIds: [a, b],             // 本步发生交换的两个元素 id
//   phase,                       // 'enter' | 'compare' | 'swap' | 'place-pivot' | 'done-partition' | 'done'
//   description,
// }
export function quickSort(input) {
  const elements = input.map((v, i) => ({ id: i, value: v }))
  const arr = [...elements]
  const steps = []
  const fixedPivotIds = new Set()

  const snapshot = (state) => ({
    arr: arr.map(e => ({ id: e.id, value: e.value })),
    fixedPivotIds: [...fixedPivotIds],
    ...state,
  })

  function partition(low, high) {
    const pivotEl = arr[high]
    let i = low - 1

    steps.push(snapshot({
      range: [low, high],
      pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: true,
      i, j: low,
      compareIds: null, swapIds: null,
      phase: 'enter',
      description: `分区 [${low}, ${high}]，pivot = ${pivotEl.value}（抬升出主行）`,
    }))

    for (let j = low; j < high; j++) {
      const jEl = arr[j]
      steps.push(snapshot({
        range: [low, high],
        pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: true,
        i, j,
        compareIds: [jEl.id, pivotEl.id],
        swapIds: null,
        phase: 'compare',
        description: `j=${j}：比较 ${jEl.value} 与 pivot=${pivotEl.value}`,
      }))
      if (jEl.value <= pivotEl.value) {
        i++
        if (i !== j) {
          const aEl = arr[i], bEl = arr[j]
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push(snapshot({
            range: [low, high],
            pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: true,
            i, j,
            compareIds: null,
            swapIds: [aEl.id, bEl.id],
            phase: 'swap',
            description: `${jEl.value} ≤ pivot：i 前进到 ${i}，交换 ${aEl.value} ↔ ${bEl.value}`,
          }))
        } else {
          steps.push(snapshot({
            range: [low, high],
            pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: true,
            i, j,
            compareIds: null, swapIds: null,
            phase: 'swap',
            description: `${jEl.value} ≤ pivot：i 前进到 ${i}（i==j，无需交换）`,
          }))
        }
      } else {
        steps.push(snapshot({
          range: [low, high],
          pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: true,
          i, j,
          compareIds: null, swapIds: null,
          phase: 'compare',
          description: `${jEl.value} > pivot：i 不动，继续扫描`,
        }))
      }
    }

    // 把 pivot 落回到最终位置 i+1
    const finalPos = i + 1
    if (finalPos !== high) {
      const displaced = arr[finalPos]
      ;[arr[finalPos], arr[high]] = [arr[high], arr[finalPos]]
      fixedPivotIds.add(pivotEl.id)
      steps.push(snapshot({
        range: [low, high],
        pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: false,
        i, j: high,
        compareIds: null,
        swapIds: [pivotEl.id, displaced.id],
        phase: 'place-pivot',
        description: `pivot 落到位置 ${finalPos}，至此 [${low}, ${finalPos - 1}] 全 ≤ pivot ≤ [${finalPos + 1}, ${high}]`,
      }))
    } else {
      fixedPivotIds.add(pivotEl.id)
      steps.push(snapshot({
        range: [low, high],
        pivotId: pivotEl.id, pivotValue: pivotEl.value, pivotLifted: false,
        i, j: high,
        compareIds: null, swapIds: null,
        phase: 'place-pivot',
        description: `pivot 已在位置 ${finalPos}，分区结束`,
      }))
    }
    return finalPos
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    } else if (low === high) {
      fixedPivotIds.add(arr[low].id)
      steps.push(snapshot({
        range: [low, high],
        pivotId: null, pivotValue: null, pivotLifted: false,
        i: null, j: null,
        compareIds: null, swapIds: null,
        phase: 'done-partition',
        description: `子区间 [${low}] 仅含一个元素，已就位`,
      }))
    }
  }

  sort(0, arr.length - 1)
  steps.push(snapshot({
    range: null,
    pivotId: null, pivotValue: null, pivotLifted: false,
    i: null, j: null,
    compareIds: null, swapIds: null,
    phase: 'done',
    description: '排序完成',
  }))
  return steps
}
