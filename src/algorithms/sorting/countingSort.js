// Step shape:
// {
//   input: [{id, value}, ...],   // original array (stable)
//   counts: number[],            // count bucket for each value 0..max
//   prefix: number[],            // prefix-sum version of counts
//   output: (null|{id,value})[], // output array being filled
//   phase: 'count'|'prefix'|'output'|'done',
//   activeInputIdx: number|null,
//   activeCountVal: number|null,
//   activeOutputIdx: number|null,
//   description,
// }
export function countingSort(input) {
  const n = input.length
  const elements = input.map((v, i) => ({ id: i, value: v }))
  const maxVal = Math.max(...input)

  const counts = new Array(maxVal + 1).fill(0)
  const output = new Array(n).fill(null)
  const steps = []

  const snap = (phase, extra) => ({
    input: elements.map(e => ({ ...e })),
    counts: [...counts],
    prefix: [...counts],
    output: output.map(x => (x ? { ...x } : null)),
    phase,
    activeInputIdx: null,
    activeCountVal: null,
    activeOutputIdx: null,
    ...extra,
  })

  steps.push(snap('count', {
    description: `计数排序开始，值域 [0, ${maxVal}]，建立大小为 ${maxVal + 1} 的计数桶`,
  }))

  // Phase 1: count
  for (let i = 0; i < n; i++) {
    const v = elements[i].value
    steps.push(snap('count', {
      activeInputIdx: i,
      activeCountVal: v,
      description: `统计 arr[${i}]=${v}，counts[${v}]++ → ${counts[v] + 1}`,
    }))
    counts[v]++
    steps.push(snap('count', {
      activeInputIdx: i,
      activeCountVal: v,
      description: `counts[${v}] = ${counts[v]}`,
    }))
  }

  // Phase 2: prefix sum
  steps.push(snap('prefix', {
    description: '前缀和：counts[i] += counts[i-1]，得到每个值在输出中的结束位置',
  }))
  for (let i = 1; i <= maxVal; i++) {
    steps.push(snap('prefix', {
      activeCountVal: i,
      description: `counts[${i}] += counts[${i - 1}]：${counts[i]} + ${counts[i - 1]} = ${counts[i] + counts[i - 1]}`,
    }))
    counts[i] += counts[i - 1]
    steps.push(snap('prefix', {
      activeCountVal: i,
      description: `counts[${i}] = ${counts[i]}（该值及以下元素共 ${counts[i]} 个）`,
    }))
  }

  // Phase 3: output (reverse for stability)
  steps.push(snap('output', {
    description: '从右向左遍历原数组，根据前缀和放入输出数组（保证稳定性）',
  }))
  for (let i = n - 1; i >= 0; i--) {
    const v = elements[i].value
    const pos = counts[v] - 1
    steps.push(snap('output', {
      activeInputIdx: i,
      activeCountVal: v,
      activeOutputIdx: pos,
      description: `arr[${i}]=${v}，counts[${v}]=${counts[v]}，放入 output[${pos}]`,
    }))
    output[pos] = elements[i]
    counts[v]--
    steps.push(snap('output', {
      activeInputIdx: i,
      activeCountVal: v,
      activeOutputIdx: pos,
      description: `output[${pos}] ← ${v}，counts[${v}]-- → ${counts[v]}`,
    }))
  }

  steps.push(snap('done', {
    description: '排序完成，输出数组即为有序结果',
  }))

  return steps
}
