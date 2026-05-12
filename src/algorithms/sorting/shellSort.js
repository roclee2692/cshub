// Step shape: { array, comparing[], swapped[], sorted[], gap, description }
export function shellSort(input) {
  const arr = [...input]
  const n = arr.length
  const steps = []

  // Knuth sequence: 1, 4, 13, 40, …
  let gap = 1
  while (gap < Math.floor(n / 3)) gap = gap * 3 + 1

  const snap = (extra) => ({ array: [...arr], ...extra })

  steps.push(snap({
    comparing: [], swapped: [], sorted: [],
    gap,
    description: `希尔排序开始，初始 gap = ${gap}（Knuth 序列）`,
  }))

  while (gap >= 1) {
    for (let i = gap; i < n; i++) {
      const key = arr[i]
      let j = i

      steps.push(snap({
        comparing: [i], swapped: [], sorted: [],
        gap,
        description: `gap=${gap}，取出 arr[${i}]=${key}，向前每隔 ${gap} 步比较`,
      }))

      while (j >= gap && arr[j - gap] > key) {
        steps.push(snap({
          comparing: [j - gap, j], swapped: [], sorted: [],
          gap,
          description: `arr[${j - gap}]=${arr[j - gap]} > ${key}，后移`,
        }))
        arr[j] = arr[j - gap]
        steps.push(snap({
          comparing: [], swapped: [j], sorted: [],
          gap,
          description: `arr[${j}] ← ${arr[j]}（后移完成）`,
        }))
        j -= gap
      }

      arr[j] = key
      if (j !== i) {
        steps.push(snap({
          comparing: [], swapped: [j], sorted: [],
          gap,
          description: `arr[${j}] ← ${key} 插入完成`,
        }))
      }
    }

    const prevGap = gap
    gap = Math.floor(gap / 3)
    if (gap >= 1) {
      steps.push(snap({
        comparing: [], swapped: [], sorted: [],
        gap,
        description: `gap ${prevGap} → ${gap}，再次全量插入排序`,
      }))
    }
  }

  steps.push(snap({
    comparing: [], swapped: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    gap: 0,
    description: '排序完成，所有元素就位',
  }))

  return steps
}
