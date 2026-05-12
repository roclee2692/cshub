export function dfs(graph, startId) {
  const steps = []
  const visited = new Set()
  const stack = [startId]

  const adjList = {}
  graph.nodes.forEach(n => (adjList[n.id] = []))
  graph.edges.forEach(e => {
    adjList[e.from].push(e.to)
    adjList[e.to].push(e.from)
  })
  // sort neighbors for deterministic order
  Object.keys(adjList).forEach(k => adjList[k].sort())

  steps.push({
    visited: [],
    stack: [startId],
    current: null,
    highlightEdges: [],
    description: `从节点 ${startId} 入栈，准备 DFS`,
  })

  while (stack.length > 0) {
    const node = stack.pop()
    if (visited.has(node)) continue
    visited.add(node)
    steps.push({
      visited: [...visited],
      stack: [...stack],
      current: node,
      highlightEdges: [],
      description: `弹出栈顶 ${node}，标记为已访问`,
    })

    // push neighbors in reverse so smallest is popped first
    const neighbors = [...adjList[node]].reverse()
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        stack.push(nb)
        steps.push({
          visited: [...visited],
          stack: [...stack],
          current: node,
          highlightEdges: [[node, nb]],
          description: `邻居 ${nb} 未访问，入栈`,
        })
      }
    }
  }
  steps.push({
    visited: [...visited],
    stack: [],
    current: null,
    highlightEdges: [],
    description: 'DFS 完成',
  })
  return steps
}
