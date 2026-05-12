export function kruskal(graph) {
  const steps = [];
  const nodes = graph.nodes.map(n => n.id);
  const edges = graph.edges.map(e => ({ from: e.from, to: e.to, weight: e.weight ?? 1 }));

  // union-find
  const parent = {};
  nodes.forEach(n => parent[n] = n);
  function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
  function union(a, b) { parent[find(a)] = find(b); }

  steps.push({ visited: [], current: null, highlightEdges: [], description: 'Kruskal 初始化：按权重排序边' });

  edges.sort((a, b) => a.weight - b.weight);

  const mst = [];
  let total = 0;

  for (const e of edges) {
    steps.push({ visited: [...new Set(mst.flat())], current: null, highlightEdges: [[e.from, e.to]], description: `考虑边 ${e.from} - ${e.to}（权重 ${e.weight}）` });
    const ra = find(e.from), rb = find(e.to);
    if (ra !== rb) {
      union(ra, rb);
      mst.push([e.from, e.to]);
      total += e.weight;
      steps.push({ visited: [...new Set(mst.flat())], current: null, highlightEdges: [[e.from, e.to]], description: `边加入 MST：${e.from} - ${e.to}（权重 ${e.weight}）` });
    } else {
      steps.push({ visited: [...new Set(mst.flat())], current: null, highlightEdges: [[e.from, e.to]], description: `跳过（形成环）: ${e.from} - ${e.to}` });
    }
    if (mst.length === nodes.length - 1) break;
  }
  steps.push({ visited: [...new Set(mst.flat())], current: null, highlightEdges: mst.slice(), description: `Kruskal 完成，总权重=${total}`, mstEdges: mst.slice(), totalWeight: total });
  return steps;
}
