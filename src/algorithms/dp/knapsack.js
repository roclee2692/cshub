// 0-1 背包，返回步骤数组
// items: [{weight, value}], capacity: number
export function knapsack01(items, capacity) {
  const n = items.length
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))
  const steps = []

  steps.push({
    dp: dp.map(r => [...r]),
    highlight: null,
    items,
    capacity,
    description: '初始化 dp 表，所有值为 0',
  })

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const item = items[i - 1]
      if (item.weight > w) {
        dp[i][w] = dp[i - 1][w]
        steps.push({
          dp: dp.map(r => [...r]),
          highlight: [i, w],
          items,
          capacity,
          description: `物品${i}(w=${item.weight})放不下，dp[${i}][${w}]=dp[${i-1}][${w}]=${dp[i][w]}`,
        })
      } else {
        const skip = dp[i - 1][w]
        const take = dp[i - 1][w - item.weight] + item.value
        dp[i][w] = Math.max(skip, take)
        steps.push({
          dp: dp.map(r => [...r]),
          highlight: [i, w],
          items,
          capacity,
          description: `物品${i}: 不取=${skip}, 取=${take} → dp[${i}][${w}]=${dp[i][w]}`,
        })
      }
    }
  }
  steps.push({
    dp: dp.map(r => [...r]),
    highlight: [n, capacity],
    items,
    capacity,
    description: `最优解 = dp[${n}][${capacity}] = ${dp[n][capacity]}`,
  })
  return steps
}
