export function prim(graph, startId) {
  const steps = [];
  const nodes = graph.nodes.map(n => n.id);
  const adj = {};
  graph.nodes.forEach(n => (adj[n.id] = []));
  graph.edges.forEach(e => {
    const w = e.weight ?? 1;
    adj[e.from].push({ id: e.to, weight: w });
    adj[e.to].push({ id: e.from, weight: w });
  });

  const visited = new Set();
  const mstEdges = [];
  let totalWeight = 0;

  steps.push({ visited: [], current: null, highlightEdges: [], description: `Prim 初始化，起点 ${startId}` });

  visited.add(startId);
  steps.push({ visited: [...visited], current: startId, highlightEdges: [], description: `选择起点 ${startId}` });

  while (visited.size < nodes.length) {
    // find min weight edge crossing cut
    let best = null;
    for (const u of visited) {
      for (const { id: v, weight } of adj[u]) {
        if (visited.has(v)) continue;
        // consider edge u-v
        steps.push({ visited: [...visited], current: u, highlightEdges: [[u, v]], description: `考虑边 ${u} - ${v}（权重 ${weight}）` });
        if (!best || weight < best.weight) {
          best = { u, v, weight };
        }
      }
    }
    if (!best) break; // disconnected
    // add best
    mstEdges.push([best.u, best.v]);
    totalWeight += best.weight;
    visited.add(best.v);
    steps.push({ visited: [...visited], current: best.v, highlightEdges: [[best.u, best.v]], description: `加入最小生成树：${best.u} - ${best.v}（权重 ${best.weight}）` });
  }
  steps.push({ visited: [...visited], current: null, highlightEdges: [], description: `Prim 完成，总权重=${totalWeight}`, mstEdges: mstEdges.slice(), totalWeight });
  return steps;
}
