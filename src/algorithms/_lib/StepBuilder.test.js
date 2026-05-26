import { describe, it, expect } from 'vitest'
import { ArrayStepBuilder, GraphStepBuilder, DPStepBuilder, BaseStepBuilder } from './StepBuilder'

describe('BaseStepBuilder', () => {
  it('records description and clears pending state on push', () => {
    const b = new BaseStepBuilder()
    b.set('x', 1).set('y', 2).push('first')
    b.set('x', 3).push('second')
    const steps = b.toSteps()
    expect(steps.length).toBe(2)
    expect(steps[0]).toEqual({ x: 1, y: 2, description: 'first' })
    expect(steps[1]).toEqual({ x: 3, description: 'second' })
  })

  it('expands .line() into cppLine / pythonLine / pseudoLine', () => {
    const b = new BaseStepBuilder()
    b.line({ cpp: 5, py: 4, pseudo: 3 }).push('s')
    const step = b.toSteps()[0]
    expect(step.cppLine).toBe(5)
    expect(step.pythonLine).toBe(4)
    expect(step.pseudoLine).toBe(3)
  })

  it('sameLine sets cpp/py/pseudo to the same value', () => {
    const b = new BaseStepBuilder()
    b.sameLine(7).push('s')
    const step = b.toSteps()[0]
    expect(step.cppLine).toBe(7)
    expect(step.pythonLine).toBe(7)
    expect(step.pseudoLine).toBe(7)
  })

  it('lineMap and extras do not leak to the next push', () => {
    const b = new BaseStepBuilder()
    b.line({ cpp: 5 }).set('mark', true).push('first')
    b.push('second')
    expect(b.toSteps()[1].cppLine).toBeUndefined()
    expect(b.toSteps()[1].mark).toBeUndefined()
  })
})

describe('ArrayStepBuilder', () => {
  it('produces step shape compatible with SortingViz', () => {
    const arr = [3, 1, 2]
    const b = new ArrayStepBuilder(arr)
    b.compare(0, 1).sameLine(2).push('compare')
    const step = b.toSteps()[0]
    expect(step.array).toEqual([3, 1, 2])
    expect(step.comparing).toEqual([0, 1])
    expect(step.swapped).toEqual([])
    expect(step.sorted).toEqual([])
    expect(step.cppLine).toBe(2)
    expect(step.description).toBe('compare')
  })

  it('snapshots array independently from caller mutations', () => {
    const arr = [3, 1, 2]
    const b = new ArrayStepBuilder(arr)
    b.compare(0, 1).push('s1')
    ;[arr[0], arr[1]] = [arr[1], arr[0]]   // 模拟交换
    b.swap(0, 1).push('s2')

    const [s1, s2] = b.toSteps()
    expect(s1.array).toEqual([3, 1, 2])   // 第一步快照不受后续 mutation 影响
    expect(s2.array).toEqual([1, 3, 2])
  })

  it('markSorted persists across steps', () => {
    const b = new ArrayStepBuilder([5, 4, 3])
    b.markSorted(2).push('first')
    b.markSorted([0, 1]).push('second')
    const steps = b.toSteps()
    expect(new Set(steps[0].sorted)).toEqual(new Set([2]))
    expect(new Set(steps[1].sorted)).toEqual(new Set([0, 1, 2]))
  })

  it('pivot and mergeRange become per-step fields', () => {
    const b = new ArrayStepBuilder([1, 2, 3])
    b.pivot(1).push('s')
    b.mergeRange(0, 2).push('m')
    const steps = b.toSteps()
    expect(steps[0].pivot).toBe(1)
    expect(steps[0].mergeRange).toBeUndefined()
    expect(steps[1].mergeRange).toEqual([0, 2])
    expect(steps[1].pivot).toBeUndefined()
  })
})

describe('GraphStepBuilder', () => {
  it('produces step shape compatible with GraphViz', () => {
    const b = new GraphStepBuilder()
    b.visit('A').focus('A').sameLine(3).push('start')
    b.visit('B').focus('B').highlightEdge('A', 'B').push('explore B')
    const steps = b.toSteps()
    expect(steps[0].visited).toEqual(['A'])
    expect(steps[0].current).toBe('A')
    expect(steps[1].visited).toEqual(['A', 'B'])
    expect(steps[1].highlightEdges).toEqual([['A', 'B']])
    expect(steps[0].highlightEdges).toBeUndefined()
  })

  it('dist updates are persistent and snapshotted', () => {
    const b = new GraphStepBuilder({ dist: { A: 0, B: Infinity } })
    b.updateDist('B', 5).push('relax')
    b.updateDist('C', 9).push('discover')
    const steps = b.toSteps()
    expect(steps[0].dist).toEqual({ A: 0, B: 5 })
    expect(steps[1].dist).toEqual({ A: 0, B: 5, C: 9 })
    // 修改 builder 内部不会回写到已 push 的 step
    b.updateDist('A', 999)
    expect(steps[0].dist.A).toBe(0)
  })

  it('mstEdges accumulate and snapshot independently', () => {
    const b = new GraphStepBuilder()
    b.addMstEdge('A', 'B').push('e1')
    b.addMstEdge('B', 'C').push('e2')
    const steps = b.toSteps()
    expect(steps[0].mstEdges).toEqual([['A', 'B']])
    expect(steps[1].mstEdges).toEqual([['A', 'B'], ['B', 'C']])
  })
})

describe('DPStepBuilder', () => {
  it('deep-clones 2D dp array on each push', () => {
    const dp = [[0, 0], [0, 0]]
    const b = new DPStepBuilder(dp)
    b.highlight(0, 1).push('start')
    dp[0][1] = 99
    b.highlight(1, 0).push('next')
    const steps = b.toSteps()
    expect(steps[0].dp).toEqual([[0, 0], [0, 0]])  // first step independent from mutation
    expect(steps[1].dp).toEqual([[0, 99], [0, 0]])
    expect(steps[0].highlight).toEqual([0, 1])
    expect(steps[1].highlight).toEqual([1, 0])
  })

  it('clones 1D dp arrays too', () => {
    const dp = [0, 0, 0]
    const b = new DPStepBuilder(dp)
    b.highlight(1).push('s')
    dp[1] = 7
    b.push('next')
    const steps = b.toSteps()
    expect(steps[0].dp).toEqual([0, 0, 0])
    expect(steps[1].dp).toEqual([0, 7, 0])
  })

  it('phase is sticky until changed', () => {
    const b = new DPStepBuilder([[0]], { phase: 'init' })
    b.push('s1')
    b.phase('fill').push('s2')
    b.push('s3')
    b.phase('done').push('s4')
    const steps = b.toSteps()
    expect(steps.map(s => s.phase)).toEqual(['init', 'fill', 'fill', 'done'])
  })
})
