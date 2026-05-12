function hashFn(key, m) {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % m
  return h
}

export function hashTable(m, ops) {
  const buckets = Array.from({ length: m }, () => [])
  const steps = []

  function snapshot(action, bucket, key, value, desc) {
    steps.push({
      buckets: buckets.map(b => [...b]),
      action, bucket, key, value,
      description: desc,
    })
  }

  snapshot('init', -1, '', '', `初始化哈希表，${m} 个桶，使用链地址法（Chaining）处理冲突。`)

  for (const op of ops) {
    const { key } = op
    const h = hashFn(key, m)

    if (op.type === 'insert') {
      const { value } = op
      snapshot('hash', h, key, value, `插入 "${key}"：hash("${key}") = ${h}，定位到桶 ${h}。`)

      const existing = buckets[h].findIndex(e => e.key === key)
      if (existing >= 0) {
        buckets[h][existing].value = value
        snapshot('update', h, key, value, `桶 ${h} 中已存在键 "${key}"，更新值为 "${value}"。`)
      } else {
        buckets[h].push({ key, value })
        snapshot('insert', h, key, value,
          buckets[h].length > 1
            ? `桶 ${h} 发生哈希冲突，使用链地址法追加到链表末尾：${buckets[h].map(e => e.key).join(' → ')}。`
            : `将 "${key}" → "${value}" 插入桶 ${h}。`)
      }
    } else if (op.type === 'lookup') {
      snapshot('hash', h, key, '', `查找 "${key}"：hash("${key}") = ${h}，访问桶 ${h}。`)

      const idx = buckets[h].findIndex(e => e.key === key)
      if (idx >= 0) {
        snapshot('found', h, key, buckets[h][idx].value,
          `在桶 ${h} 第 ${idx + 1} 个节点找到 "${key}"，值为 "${buckets[h][idx].value}"。`)
      } else {
        snapshot('miss', h, key, '', `桶 ${h} 中不存在键 "${key}"。`)
      }
    } else if (op.type === 'delete') {
      snapshot('hash', h, key, '', `删除 "${key}"：hash("${key}") = ${h}，访问桶 ${h}。`)
      const idx = buckets[h].findIndex(e => e.key === key)
      if (idx >= 0) {
        buckets[h].splice(idx, 1)
        snapshot('delete', h, key, '', `从桶 ${h} 删除键 "${key}"。`)
      } else {
        snapshot('miss', h, key, '', `桶 ${h} 中不存在键 "${key}"，删除失败。`)
      }
    }
  }

  return steps
}
