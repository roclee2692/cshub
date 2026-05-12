// pseudoLine: 1:procedure  2:queue←[start]  3:visited←{start}
// 4:while queue  5:node←dequeue  6:for neighbor  7:if not visited
// 8:visited.add  9:queue.enqueue  10:return visited
export function bfs(graph, startId) {
  const steps = []
  const visited = new Set()
  const queue = [startId]
  const parent = {}
  visited.add(startId)

  const adjList = {}
  graph.nodes.forEach(n => (adjList[n.id] = []))
  graph.edges.forEach(e => {
    adjList[e.from].push(e.to)
    adjList[e.to].push(e.from)
  })

  steps.push({
    visited: [...visited], queue: [...queue], current: null, highlightEdges: [],
    pseudoLine: 2,
    description: `从节点 ${startId} 开始 BFS，初始化队列和 visited 集合`,
  })

  while (queue.length > 0) {
    const node = queue.shift()
    steps.push({
      visited: [...visited], queue: [...queue], current: node, highlightEdges: [],
      pseudoLine: 5,
      description: `出队，访问节点 ${node}`,
    })
    for (const neighbor of adjList[node]) {
      steps.push({
        visited: [...visited], queue: [...queue], current: node,
        highlightEdges: [[node, neighbor]],
        pseudoLine: 7,
        description: `检查邻居 ${neighbor}：${visited.has(neighbor) ? '已访问，跳过' : '未访问'}`,
      })
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        parent[neighbor] = node
        queue.push(neighbor)
        steps.push({
          visited: [...visited], queue: [...queue], current: node,
          highlightEdges: [[node, neighbor]],
          pseudoLine: 9,
          description: `发现邻居 ${neighbor}，加入队列`,
        })
      }
    }
  }
  steps.push({
    visited: [...visited], queue: [], current: null, highlightEdges: [],
    pseudoLine: 10,
    description: 'BFS 完成，所有可达节点已访问',
  })
  return steps
}
