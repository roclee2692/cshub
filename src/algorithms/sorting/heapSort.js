// Heap sort with detailed steps
// step: { array, heapSize, comparing, swapped, sorted, phase, description }
export function heapSort(input) {
  const steps = []
  const arr = [...input]
  const n = arr.length
  const sorted = new Set()

  function snap(extra) {
    return {
      array: [...arr],
      heapSize: extra.heapSize,
      comparing: extra.comparing || [],
      swapped: extra.swapped || [],
      sorted: [...sorted],
      phase: extra.phase,
      description: extra.description,
    }
  }

  function siftDown(start, end) {
    let root = start
    while (root * 2 + 1 <= end) {
      const left = root * 2 + 1
      const right = root * 2 + 2
      let swap = root
      steps.push(snap({
        heapSize: end + 1,
        comparing: right <= end ? [root, left, right] : [root, left],
        phase: 'sift',
        description: `比较 root=${arr[root]} 与子节点`,
      }))
      if (arr[swap] < arr[left]) swap = left
      if (right <= end && arr[swap] < arr[right]) swap = right
      if (swap === root) {
        steps.push(snap({
          heapSize: end + 1,
          comparing: [root],
          phase: 'sift',
          description: `堆性质满足，停止下沉`,
        }))
        return
      }
      ;[arr[root], arr[swap]] = [arr[swap], arr[root]]
      steps.push(snap({
        heapSize: end + 1,
        swapped: [root, swap],
        phase: 'sift',
        description: `交换 arr[${root}] 与 arr[${swap}]`,
      }))
      root = swap
    }
  }

  steps.push(snap({ heapSize: n, phase: 'init', description: '开始建堆（自下而上 sift down）' }))
  // build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push(snap({
      heapSize: n,
      comparing: [i],
      phase: 'build',
      description: `从 index ${i} 开始 sift down`,
    }))
    siftDown(i, n - 1)
  }
  steps.push(snap({ heapSize: n, phase: 'built', description: '建堆完成，开始排序' }))

  // sort
  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    steps.push(snap({
      heapSize: i + 1,
      swapped: [0, i],
      phase: 'extract',
      description: `堆顶 ↔ arr[${i}]，最大值归位`,
    }))
    sorted.add(i)
    steps.push(snap({
      heapSize: i,
      phase: 'extract',
      description: `堆大小缩小为 ${i}`,
    }))
    siftDown(0, i - 1)
  }
  sorted.add(0)
  steps.push(snap({ heapSize: 0, phase: 'done', description: '排序完成！' }))
  return steps
}
