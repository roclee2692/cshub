// ─────────────────────────────────────────────────────────────
// StepBuilder · 算法步骤建造者（Builder + 多态）
//
// 项目内 57 个算法文件共 217 处 `steps.push({...})`，每个文件自由
// 发明字段名、复制 [...arr]、手写行号映射。本模块用建造者模式封装这些
// 重复样板，并通过子类多态适配不同类型的算法。
//
// 核心思想：
//   - 同一份「上下文」对象（如排序的 arr / sortedIndices）只声明一次
//   - 每一步的「场内事件」用链式 API 累积（compare / swap / mark / ...）
//   - 行号映射用一个 `.line({ cpp, py, pseudo })` 调用统一表达
//   - `.push(description)` 真正生成一个 step 并清理本步事件累积
//
// 三个内置 Builder：
//   - BaseStepBuilder   通用基类：description / line / extra fields
//   - ArrayStepBuilder  数组类：array / comparing / swapped / sorted
//   - GraphStepBuilder  图类：visited / current / highlightEdges / dist
//   - DPStepBuilder     表格 DP 类：dp / highlight / phase
//
// 调用示例（重写 bubbleSort 内层循环）：
//
//   const b = new ArrayStepBuilder(arr, sortedIndices)
//   for (let j = 0; j < n - i - 1; j++) {
//     b.compare(j, j + 1).line({ cpp: 6, py: 6, pseudo: 6 })
//      .push(`比较 arr[${j}]=${arr[j]} 与 arr[${j+1}]=${arr[j+1]}`)
//     if (arr[j] > arr[j + 1]) {
//       [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
//       b.swap(j, j + 1).line({ cpp: 7, py: 7, pseudo: 7 })
//        .push(`交换 → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}`)
//     }
//   }
//   return b.toSteps()
//
// 向后兼容：toSteps() 返回的对象形状与现有 viz 组件期望完全一致，
// 旧算法可以无痛迁移；不迁移的算法继续按 steps.push({...}) 写也没问题。
// ─────────────────────────────────────────────────────────────

/** 通用基类 —— 处理 description / 行号映射 / 额外字段 / 收集 steps */
export class BaseStepBuilder {
  constructor() {
    this._steps = []
    this._pending = {}      // 当前积累的事件（未 push）
    this._lineMap = null    // { cpp, py, pseudo, java? } 仅本步生效
    this._extra = null      // 仅本步生效的额外字段
  }

  /** 设置当前步骤命中的源代码行号；接受 { cpp, py, pseudo, java? } */
  line(map) {
    this._lineMap = { ...(this._lineMap || {}), ...map }
    return this
  }

  /** 同上的便捷写法 —— 多个语言同行号 */
  sameLine(n) {
    this._lineMap = { cpp: n, py: n, pseudo: n }
    return this
  }

  /** 任意键值对附加到当前步骤上（仅本步） */
  set(key, value) {
    if (!this._extra) this._extra = {}
    this._extra[key] = value
    return this
  }

  /** 一次设置多个字段（仅本步） */
  setAll(obj) {
    if (!this._extra) this._extra = {}
    Object.assign(this._extra, obj)
    return this
  }

  /** 子类覆写：返回每步的"上下文快照"对象 */
  _snapshot() {
    return {}
  }

  /** push 一个 step 并清理本步累积 */
  push(description) {
    const step = {
      ...this._snapshot(),
      ...this._pending,
      ...(this._extra || {}),
      description,
    }
    if (this._lineMap) {
      if (this._lineMap.cpp    != null) step.cppLine    = this._lineMap.cpp
      if (this._lineMap.py     != null) step.pythonLine = this._lineMap.py
      if (this._lineMap.python != null) step.pythonLine = this._lineMap.python
      if (this._lineMap.pseudo != null) step.pseudoLine = this._lineMap.pseudo
      if (this._lineMap.java   != null) step.javaLine   = this._lineMap.java
    }
    this._steps.push(step)
    this._pending = {}
    this._lineMap = null
    this._extra = null
    return this
  }

  /** 返回 steps 数组（算法函数的最终返回值） */
  toSteps() {
    return this._steps
  }

  /** 已 push 的步数（调试用） */
  get length() {
    return this._steps.length
  }
}

// ─────────────────────────────────────────────────────────────
// ArrayStepBuilder · 排序 / 数组类算法
//
// 上下文：array（每步深拷贝）、sortedIndices（已排序索引集合）
// 链式事件：compare / swap / mark / unmark / pivot / mergeRange
// ─────────────────────────────────────────────────────────────
export class ArrayStepBuilder extends BaseStepBuilder {
  /**
   * @param {Array}   arr            被排序数组的"活引用"（builder 不会修改它，但每次 push 会深拷贝）
   * @param {Set|Array} [sorted]    已排序索引（Set 或可迭代）
   */
  constructor(arr, sorted = new Set()) {
    super()
    this._arr = arr
    this._sorted = sorted instanceof Set ? sorted : new Set(sorted)
  }

  /** 标记 i / j 正在比较 */
  compare(i, j) {
    this._pending.comparing = j != null ? [i, j] : [i]
    return this
  }

  /** 标记 i / j 正在交换 */
  swap(i, j) {
    this._pending.swapped = j != null ? [i, j] : [i]
    return this
  }

  /** 标记当前 pivot */
  pivot(i) {
    this._pending.pivot = i
    return this
  }

  /** 标记归并区间 [l, r] */
  mergeRange(l, r) {
    this._pending.mergeRange = [l, r]
    return this
  }

  /** 把索引加入 sortedIndices（持久，影响后续所有 step） */
  markSorted(i) {
    if (Array.isArray(i)) i.forEach(x => this._sorted.add(x))
    else this._sorted.add(i)
    return this
  }

  _snapshot() {
    return {
      array: [...this._arr],
      comparing: [],
      swapped: [],
      sorted: [...this._sorted],
    }
  }
}

// ─────────────────────────────────────────────────────────────
// GraphStepBuilder · 图遍历 / 最短路径
//
// 上下文：visited（Set 引用）、current、dist、mstEdges
// 链式事件：visit / focus / highlightEdge / updateDist
// ─────────────────────────────────────────────────────────────
export class GraphStepBuilder extends BaseStepBuilder {
  constructor({ visited = new Set(), dist = null, mstEdges = [] } = {}) {
    super()
    this._visited = visited instanceof Set ? visited : new Set(visited)
    this._dist = dist
    this._mstEdges = mstEdges
  }

  /** 把节点加入 visited（持久） */
  visit(nodeId) {
    if (Array.isArray(nodeId)) nodeId.forEach(n => this._visited.add(n))
    else this._visited.add(nodeId)
    return this
  }

  /** 当前关注节点（仅本步） */
  focus(nodeId) {
    this._pending.current = nodeId
    return this
  }

  /** 高亮边（仅本步），支持单条或多条 */
  highlightEdge(from, to) {
    if (!this._pending.highlightEdges) this._pending.highlightEdges = []
    this._pending.highlightEdges.push([from, to])
    return this
  }

  /** 更新距离表（持久） */
  updateDist(node, value) {
    if (!this._dist) this._dist = {}
    this._dist[node] = value
    return this
  }

  /** 加入 MST 边（持久） */
  addMstEdge(from, to) {
    this._mstEdges.push([from, to])
    return this
  }

  _snapshot() {
    return {
      visited: [...this._visited],
      ...(this._dist ? { dist: { ...this._dist } } : {}),
      ...(this._mstEdges.length ? { mstEdges: [...this._mstEdges] } : {}),
    }
  }
}

// ─────────────────────────────────────────────────────────────
// DPStepBuilder · 动态规划表格类
//
// 上下文：dp（二维数组深拷贝）、phase
// 链式事件：highlight（[i, j]）、result
// ─────────────────────────────────────────────────────────────
export class DPStepBuilder extends BaseStepBuilder {
  constructor(dp, { phase = 'init' } = {}) {
    super()
    this._dp = dp
    this._phase = phase
  }

  /** 切换阶段（持久）："init" / "fill" / "trace" / "done" 等 */
  phase(p) {
    this._phase = p
    return this
  }

  /** 当前活动单元格（仅本步） */
  highlight(i, j) {
    this._pending.highlight = j != null ? [i, j] : i
    return this
  }

  /** 设置 result（持久） */
  result(value) {
    this._pending.result = value
    return this
  }

  _snapshot() {
    // 二维数组深拷贝；如果是一维数组也兼容
    const dp = Array.isArray(this._dp?.[0])
      ? this._dp.map(row => [...row])
      : Array.isArray(this._dp) ? [...this._dp] : this._dp
    return { dp, phase: this._phase }
  }
}
