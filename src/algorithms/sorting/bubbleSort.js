// Bubble Sort —— 使用 ArrayStepBuilder 重构后，业务逻辑清晰，
// 行号映射 / array 快照 / sorted 集合维护全部交给 builder。
//
// pseudoLine maps to pseudocode line numbers (1-indexed):
// 1:procedure  2:n←length  3:repeat  4:swapped←false  5:for i
// 6:if A[i]>A[i+1]  7:swap  8:swapped←true  9:n←n-1  10:until
// C++ code line mapping (1-indexed):
//   2:int n=arr.size(); 3:for(int i...) 4:bool swapped=false; 5:for(int j...)
//   6:if(arr[j]>arr[j+1]) 7:swap(...) 8:swapped=true; 10:if(!swapped)break;
// Python code line mapping (1-indexed):
//   2:n=len(arr) 3:for i in range(n-1): 4:swapped=False 5:for j in range(n-i-1):
//   6:if arr[j]>arr[j+1]: 7:arr[j],arr[j+1]=... 8:swapped=True 10:if not swapped: 11:break

import { ArrayStepBuilder } from '../_lib/StepBuilder'

export function bubbleSort(input) {
  const arr = [...input]
  const n = arr.length
  const b = new ArrayStepBuilder(arr)

  // 边界情况：空数组或单元素
  if (n <= 1) {
    if (n === 1) {
      b.markSorted(0).sameLine(1)
        .push('单元素数组，已排序')
    } else {
      b.sameLine(1).push('空数组，无需排序')
    }
    return b.toSteps()
  }

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false

    b.set('i', i).set('j', null).sameLine(4)
      .push(`第 ${i + 1} 轮开始，swapped ← false`)

    for (let j = 0; j < n - i - 1; j++) {
      b.compare(j, j + 1).set('i', i).set('j', j).sameLine(6)
        .push(
          `比较 arr[${j}]=${arr[j]} 与 arr[${j + 1}]=${arr[j + 1]}` +
          (arr[j] === arr[j + 1] ? ' （相等，无需交换）' : ''),
        )

      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        swappedAny = true
        b.swap(j, j + 1).set('i', i).set('j', j).sameLine(7)
          .push(`交换 → arr[${j}]=${arr[j]}, arr[${j + 1}]=${arr[j + 1]}`)
      }
    }

    b.markSorted(n - 1 - i)
      .set('i', i).set('j', null)
      .line({ cpp: 11, py: 9, pseudo: 9 })
      .push(`本轮结束，${swappedAny ? '有交换，继续' : '无交换，提前退出'}`)

    if (!swappedAny) break
  }

  // 最后一步：所有索引都标记为已排序
  b.markSorted(Array.from({ length: n }, (_, k) => k))
    .line({ cpp: 13, py: 11, pseudo: 10 })
    .push('排序完成')

  return b.toSteps()
}
