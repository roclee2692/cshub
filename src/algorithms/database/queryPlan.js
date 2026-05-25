// 查询计划（Query Plan）可视化
// queryId: 'select' | 'join' | 'group'
//
// 计划树节点：{ id, type, label, cost, rows, children: [], tuples: [] }
// 每步 step：
// {
//   nodes: [{ id, type, label, cost, rows, status: 'idle'|'active'|'done', outputCount }],
//   edges: [{ from, to }],   // from=子节点 id, to=父节点 id
//   activeNodeId: string,
//   tupleFlow: [{ fromId, toId, value }],
//   description: string,
// }

function cloneNodes(nodes) {
  return nodes.map(n => ({ ...n }))
}

function buildSteps(planDef) {
  const { nodes: nodeDefs, edges, executionScript } = planDef
  const steps = []

  // 初始状态：所有节点 idle
  let nodes = nodeDefs.map(n => ({
    ...n,
    status: 'idle',
    outputCount: 0,
  }))

  function push(activeNodeId, tupleFlow, description) {
    steps.push({
      nodes: cloneNodes(nodes),
      edges: edges.slice(),
      activeNodeId,
      tupleFlow: tupleFlow || [],
      description,
    })
  }

  // 初始快照
  push(null, [], planDef.initialDescription)

  // 执行脚本：按顺序执行每个操作
  for (const op of executionScript) {
    const { nodeId, action, tupleFlow, description, outputDelta } = op

    // 更新节点状态
    nodes = nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          status: action,
          outputCount: n.outputCount + (outputDelta || 0),
        }
      }
      return n
    })

    push(nodeId, tupleFlow || [], description)
  }

  return steps
}

// ─── 计划 1：SELECT * FROM orders WHERE amount > 100 ────────────
function selectPlan() {
  const nodes = [
    { id: 'filter', type: 'Filter', label: 'amount > 100', cost: 12, rows: 47 },
    { id: 'seqscan', type: 'SeqScan', label: 'orders', cost: 8, rows: 120 },
  ]
  const edges = [
    { from: 'seqscan', to: 'filter' },
  ]

  const executionScript = [
    {
      nodeId: 'seqscan', action: 'active',
      description: 'SeqScan(orders)：开始全表顺序扫描 orders 表，逐页读取磁盘数据块。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 20,
      tupleFlow: [
        { fromId: 'seqscan', toId: 'filter', value: 'rows 1-20' },
      ],
      description: 'SeqScan 读取前 20 行（第 1 页），将原始元组推送给 Filter 节点。',
    },
    {
      nodeId: 'filter', action: 'active', outputDelta: 8,
      description: 'Filter(amount>100)：对收到的 20 行应用谓词，8 行满足条件，其余 12 行丢弃。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 30,
      tupleFlow: [
        { fromId: 'seqscan', toId: 'filter', value: 'rows 21-50' },
      ],
      description: 'SeqScan 继续读取第 2-3 页（第 21-50 行），推送给 Filter。',
    },
    {
      nodeId: 'filter', action: 'active', outputDelta: 11,
      description: 'Filter 处理 30 行，11 行满足 amount>100，继续累积输出。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 40,
      tupleFlow: [
        { fromId: 'seqscan', toId: 'filter', value: 'rows 51-90' },
      ],
      description: 'SeqScan 读取第 4-5 页（第 51-90 行）。',
    },
    {
      nodeId: 'filter', action: 'active', outputDelta: 16,
      description: 'Filter 处理 40 行，16 行通过过滤。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 30,
      tupleFlow: [
        { fromId: 'seqscan', toId: 'filter', value: 'rows 91-120' },
      ],
      description: 'SeqScan 读取最后 30 行（第 91-120 行），扫描完毕。',
    },
    {
      nodeId: 'filter', action: 'active', outputDelta: 12,
      description: 'Filter 处理最后 30 行，再筛出 12 行。',
    },
    {
      nodeId: 'seqscan', action: 'done',
      description: 'SeqScan 完成：共扫描 120 行，cost=8。',
    },
    {
      nodeId: 'filter', action: 'done',
      description: 'Filter 完成：输出 47 行（满足 amount>100），cost=12。查询结果返回客户端。',
    },
  ]

  return buildSteps({
    nodes, edges, executionScript,
    initialDescription: '查询计划：SELECT * FROM orders WHERE amount > 100。'
      + '计划树：SeqScan(orders) → Filter(amount>100)。从叶子节点 SeqScan 开始执行。',
  })
}

// ─── 计划 2：JOIN 查询 ─────────────────────────────────────────
function joinPlan() {
  const nodes = [
    { id: 'topfilter', type: 'Filter', label: 'city = BJ', cost: 45, rows: 30 },
    { id: 'hashjoin', type: 'HashJoin', label: 'uid = id', cost: 38, rows: 120 },
    { id: 'seqscan_users', type: 'SeqScan', label: 'users', cost: 5, rows: 50 },
    { id: 'indexscan_orders', type: 'IndexScan', label: 'orders(uid)', cost: 15, rows: 120 },
  ]
  const edges = [
    { from: 'seqscan_users', to: 'hashjoin' },
    { from: 'indexscan_orders', to: 'hashjoin' },
    { from: 'hashjoin', to: 'topfilter' },
  ]

  const executionScript = [
    {
      nodeId: 'seqscan_users', action: 'active',
      description: 'HashJoin 第一阶段：SeqScan(users) 全扫 users 表（50 行），用于构建哈希表（Build Phase）。',
    },
    {
      nodeId: 'seqscan_users', action: 'active', outputDelta: 50,
      tupleFlow: [
        { fromId: 'seqscan_users', toId: 'hashjoin', value: '50 users' },
      ],
      description: 'SeqScan(users) 扫描完毕，50 行用户数据全部推送给 HashJoin，cost=5。',
    },
    {
      nodeId: 'hashjoin', action: 'active',
      description: 'HashJoin Build Phase：对 users.id 字段建立内存哈希表，O(n) 时间。',
    },
    {
      nodeId: 'seqscan_users', action: 'done',
      description: 'SeqScan(users) 完成（done）。哈希表已就绪。',
    },
    {
      nodeId: 'indexscan_orders', action: 'active',
      description: 'HashJoin Probe Phase：IndexScan(orders, uid) 开始扫描订单表（利用 uid 上的索引）。',
    },
    {
      nodeId: 'indexscan_orders', action: 'active', outputDelta: 40,
      tupleFlow: [
        { fromId: 'indexscan_orders', toId: 'hashjoin', value: 'rows 1-40' },
      ],
      description: 'IndexScan 读取前 40 行订单，每行用 uid 在哈希表中探测（Probe），匹配则输出。',
    },
    {
      nodeId: 'hashjoin', action: 'active', outputDelta: 38,
      description: 'HashJoin 输出前 38 个匹配对（orders.uid = users.id），推送给 Filter。',
    },
    {
      nodeId: 'topfilter', action: 'active', outputDelta: 10,
      description: 'Filter(city=BJ) 处理前 38 行，10 行满足 city=\'BJ\'。',
    },
    {
      nodeId: 'indexscan_orders', action: 'active', outputDelta: 80,
      tupleFlow: [
        { fromId: 'indexscan_orders', toId: 'hashjoin', value: 'rows 41-120' },
      ],
      description: 'IndexScan 读取剩余 80 行订单继续 Probe。',
    },
    {
      nodeId: 'hashjoin', action: 'active', outputDelta: 82,
      description: 'HashJoin 输出更多匹配对，共积累 120 行 join 结果。',
    },
    {
      nodeId: 'topfilter', action: 'active', outputDelta: 20,
      description: 'Filter 处理剩余 82 行，再筛出 20 行（累计输出 30 行）。',
    },
    {
      nodeId: 'indexscan_orders', action: 'done',
      description: 'IndexScan(orders) 完成，cost=15。',
    },
    {
      nodeId: 'hashjoin', action: 'done',
      description: 'HashJoin 完成：共输出 120 行 join 结果，cost=38。',
    },
    {
      nodeId: 'topfilter', action: 'done',
      description: 'Filter(city=BJ) 完成：最终输出 30 行，cost=45。查询结束，结果返回客户端。',
    },
  ]

  return buildSteps({
    nodes, edges, executionScript,
    initialDescription: '查询计划：SELECT * FROM orders JOIN users ON orders.uid=users.id WHERE users.city=\'BJ\'。'
      + '计划树：SeqScan(users) → HashJoin ← IndexScan(orders) → Filter(city=BJ)。',
  })
}

// ─── 计划 3：GROUP BY + ORDER BY + LIMIT ─────────────────────
function groupPlan() {
  const nodes = [
    { id: 'limit', type: 'Limit', label: 'LIMIT 5', cost: 60, rows: 5 },
    { id: 'sort', type: 'Sort', label: 'sum DESC', cost: 55, rows: 80 },
    { id: 'aggregate', type: 'Aggregate', label: 'SUM(amount) GROUP BY uid', cost: 40, rows: 80 },
    { id: 'seqscan', type: 'SeqScan', label: 'orders', cost: 8, rows: 500 },
  ]
  const edges = [
    { from: 'seqscan', to: 'aggregate' },
    { from: 'aggregate', to: 'sort' },
    { from: 'sort', to: 'limit' },
  ]

  const executionScript = [
    {
      nodeId: 'seqscan', action: 'active',
      description: 'SeqScan(orders)：全表扫描 orders 表（500 行），将所有元组推送给 Aggregate 节点。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 200,
      tupleFlow: [{ fromId: 'seqscan', toId: 'aggregate', value: 'rows 1-200' }],
      description: 'SeqScan 读取前 200 行，推送给 Aggregate 进行流式聚合。',
    },
    {
      nodeId: 'aggregate', action: 'active',
      description: 'Aggregate(SUM, GROUP BY uid)：维护一个哈希表 {uid → sum}，对每行做 sum += amount。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 200,
      tupleFlow: [{ fromId: 'seqscan', toId: 'aggregate', value: 'rows 201-400' }],
      description: 'SeqScan 继续推送第 201-400 行。',
    },
    {
      nodeId: 'aggregate', action: 'active',
      description: 'Aggregate 持续更新各 uid 的累加和。内存中哈希表已有约 60 个 uid 分组。',
    },
    {
      nodeId: 'seqscan', action: 'active', outputDelta: 100,
      tupleFlow: [{ fromId: 'seqscan', toId: 'aggregate', value: 'rows 401-500' }],
      description: 'SeqScan 推送最后 100 行。',
    },
    {
      nodeId: 'seqscan', action: 'done',
      description: 'SeqScan 完成，共扫描 500 行，cost=8。',
    },
    {
      nodeId: 'aggregate', action: 'active', outputDelta: 80,
      tupleFlow: [{ fromId: 'aggregate', toId: 'sort', value: '80 groups' }],
      description: 'Aggregate 完成：所有 500 行处理完毕，输出 80 个 (uid, sum) 分组，推送给 Sort，cost=40。',
    },
    {
      nodeId: 'aggregate', action: 'done',
      description: 'Aggregate 节点完成（done），哈希表已全部输出。',
    },
    {
      nodeId: 'sort', action: 'active',
      description: 'Sort(sum DESC)：对 80 行按 sum 降序排序（内存快速排序），cost=55。',
    },
    {
      nodeId: 'sort', action: 'active', outputDelta: 80,
      tupleFlow: [{ fromId: 'sort', toId: 'limit', value: 'sorted 80 rows' }],
      description: 'Sort 排序完成，将有序的 80 行推送给 Limit 节点。',
    },
    {
      nodeId: 'sort', action: 'done',
      description: 'Sort 节点完成（done）。',
    },
    {
      nodeId: 'limit', action: 'active', outputDelta: 5,
      description: 'Limit(5)：从 Sort 的输出中取前 5 行即停止，无需读完全部 80 行，cost=60。',
    },
    {
      nodeId: 'limit', action: 'done',
      description: 'Limit 完成：输出 top-5 uid（按 SUM(amount) 降序）。查询执行结束，结果返回客户端。',
    },
  ]

  return buildSteps({
    nodes, edges, executionScript,
    initialDescription: '查询计划：SELECT uid, SUM(amount) FROM orders GROUP BY uid ORDER BY sum DESC LIMIT 5。'
      + '计划树（从叶到根）：SeqScan → Aggregate → Sort → Limit。',
  })
}

export function queryPlanSteps(queryId) {
  if (queryId === 'select') return selectPlan()
  if (queryId === 'join') return joinPlan()
  if (queryId === 'group') return groupPlan()
  return selectPlan()
}
