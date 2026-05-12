// Steps: { array, comparing, swapped, sorted, description }
// C++ code line mapping: 3:for(int i=0...) 4:int minIdx=i 5:for(int j=i+1...) 6:if(arr[j]<arr[minIdx]) 7:minIdx=j 8:if(minIdx!=i) 9:swap(...)
// Python code line mapping: 3:for i in range(n-1): 4:min_idx=i 5:for j in range(i+1,n): 6:if arr[j]<arr[min_idx]: 7:min_idx=j 8:if min_idx!=i: 9:arr[i],arr[min_idx]=...
export function selectionSort(input) {
  const steps = []
  const arr = [...input]
  const n = arr.length
  const sorted = new Set()

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({
      array: [...arr],
      comparing: [minIdx],
      swapped: [],
      sorted: [...sorted],
      cppLine: 4, pythonLine: 4,
      description: `第 ${i + 1} 轮：在 [${i}..${n - 1}] 中寻找最小值，初始假设 arr[${i}]=${arr[i]} 最小`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIdx, j],
        swapped: [],
        sorted: [...sorted],
        cppLine: 6, pythonLine: 6,
        description: `比较 arr[${j}]=${arr[j]} 与当前最小 arr[${minIdx}]=${arr[minIdx]}`,
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapped: [],
          sorted: [...sorted],
          cppLine: 7, pythonLine: 7,
          description: `更新最小值索引为 ${minIdx}（值 ${arr[minIdx]}）`,
        })
      }
    }

    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [i, minIdx],
        sorted: [...sorted],
        cppLine: 9, pythonLine: 9,
        description: `交换 arr[${i}] 与 arr[${minIdx}]，最小值就位`,
      })
    } else {
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: [...sorted],
        description: `arr[${i}] 已是最小，无需交换`,
      })
    }
    sorted.add(i)
  }
  sorted.add(n - 1)

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...Array(n).keys()],
    description: '排序完成',
  })
  return steps
}
