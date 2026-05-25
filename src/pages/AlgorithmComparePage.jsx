import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ALGORITHM_LIST, ALGORITHMS, CATEGORIES } from '../data/algorithmMeta'
import { loadAlgorithmDetails } from '../data/algorithmDetails'
import { StepProvider } from '../contexts/StepContext'
import AlgorithmPlaygroundFor from '../components/learning/AlgorithmPlaygroundFor'
import InteractiveVisualization from '../components/learning/InteractiveVisualization'
import { preloadPlayground } from '../components/learning/playgroundRegistry'

const PRESETS = [
  { label: '冒泡 vs 插入', left: 'bubblesort', right: 'insertionsort' },
  { label: 'BFS vs DFS', left: 'bfs', right: 'dfs' },
  { label: 'Dijkstra vs Bellman-Ford', left: 'dijkstra', right: 'bellmanford' },
  { label: '快速排序 vs 归并排序', left: 'quicksort', right: 'mergesort' },
]

export default function AlgorithmComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const leftSlug = resolveSlug(searchParams.get('left'), 'bubblesort')
  const rightSlug = resolveDistinctSlug(searchParams.get('right'), leftSlug, 'insertionsort')

  const left = ALGORITHMS[leftSlug]
  const right = ALGORITHMS[rightSlug]
  const [detailMap, setDetailMap] = useState({})

  useEffect(() => {
    let cancelled = false
    const detailsPromise = loadAlgorithmDetails([leftSlug, rightSlug])
    const playgroundPromise = Promise.all([
      preloadPlayground(left.viz),
      preloadPlayground(right.viz),
    ]).catch(() => null)

    Promise.all([detailsPromise, playgroundPromise])
      .then(([details]) => {
        if (cancelled) return
        setDetailMap({
          [leftSlug]: details?.[0] || left,
          [rightSlug]: details?.[1] || right,
        })
      })
      .catch(() => {
        if (cancelled) return
        setDetailMap({
          [leftSlug]: left,
          [rightSlug]: right,
        })
      })
    return () => { cancelled = true }
  }, [leftSlug, rightSlug, left, right])

  function updatePair(nextLeft, nextRight) {
    let leftValue = resolveSlug(nextLeft, leftSlug)
    let rightValue = resolveDistinctSlug(nextRight, leftValue, rightSlug)
    if (leftValue === rightValue) {
      rightValue = resolveDistinctSlug(null, leftValue, rightValue)
    }
    setSearchParams({ left: leftValue, right: rightValue }, { replace: true })
  }

  const summary = buildSummary(left, right)

  return (
    <article>
      <section style={{ padding: '12px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
              color: 'var(--accent-light)', textTransform: 'uppercase', marginBottom: 8,
            }}>算法对比</div>
            <h1 style={{ fontSize: 'clamp(24px, 5.4vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', margin: 0, lineHeight: 1.1 }}>
              同屏对比两个算法
            </h1>
            <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 760, fontSize: 'clamp(13px, 2.6vw, 14.5px)' }}>
              通过动画、代码和复杂度并排比较，快速看清“为什么选这个算法”。适合教学、选型和复习。
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/algo/bubblesort" style={pillStyle}>打开算法页</Link>
            <Link to="/" style={pillStyle}>返回首页</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <AlgoSelect label="左侧算法" value={left.slug} onChange={v => updatePair(v, right.slug)} />
          <AlgoSelect label="右侧算法" value={right.slug} onChange={v => updatePair(left.slug, v)} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {PRESETS.map(preset => (
            <button key={preset.label} onClick={() => updatePair(preset.left, preset.right)} style={presetBtnStyle}>
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
          padding: 18, overflowX: 'auto',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>
            复杂度与特性对比
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720, fontSize: 13 }}>
            <thead>
              <tr>
                <th style={thStyle}>项目</th>
                <th style={thStyle}>{left.name}</th>
                <th style={thStyle}>{right.name}</th>
                <th style={thStyle}>结论</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['最好时间', left.timeComplexity?.best, right.timeComplexity?.best, compareComplexity(left.timeComplexity?.best, right.timeComplexity?.best, left.name, right.name)],
                ['平均时间', left.timeComplexity?.average, right.timeComplexity?.average, compareComplexity(left.timeComplexity?.average, right.timeComplexity?.average, left.name, right.name)],
                ['最坏时间', left.timeComplexity?.worst, right.timeComplexity?.worst, compareComplexity(left.timeComplexity?.worst, right.timeComplexity?.worst, left.name, right.name)],
                ['空间复杂度', left.spaceComplexity, right.spaceComplexity, compareComplexity(left.spaceComplexity, right.spaceComplexity, left.name, right.name)],
                ['稳定性', boolLabel(left.stable), boolLabel(right.stable), compareBoolean(left.stable, right.stable, left.name, right.name, '稳定性')],
                ['原地', boolLabel(left.inPlace), boolLabel(right.inPlace), compareBoolean(left.inPlace, right.inPlace, left.name, right.name, '原地')],
              ].map(([label, leftVal, rightVal, verdict]) => (
                <tr key={label}>
                  <td style={tdLabelStyle}>{label}</td>
                  <td style={tdStyle(leftVal, verdict.side === 'left')}>{leftVal}</td>
                  <td style={tdStyle(rightVal, verdict.side === 'right')}>{rightVal}</td>
                  <td style={{ ...tdStyle(verdict.text, false), color: 'var(--text-secondary)' }}>{verdict.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16, alignItems: 'start' }}>
        {[detailMap[leftSlug] || left, detailMap[rightSlug] || right].map((algo, index) => (
          <StepProvider key={algo.slug}>
            <ComparePanel algo={algo} side={index === 0 ? '左侧' : '右侧'} />
          </StepProvider>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <AdviceCard title="更适合追求速度" value={summary.speed} />
          <AdviceCard title="更适合节省空间" value={summary.space} />
          <AdviceCard title="稳定性更强" value={summary.stability} />
        </div>
      </section>
    </article>
  )
}

function ComparePanel({ algo, side }) {
  return (
    <div style={{
      background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: 16,
      padding: 16, backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur)',
      boxShadow: 'var(--glass-shine)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-light)', textTransform: 'uppercase' }}>
            {side}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 4 }}>{algo.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 4 }}>{algo.nameEn}</div>
        </div>
        <Link to={`/algo/${algo.slug}`} style={panelLinkStyle}>查看完整页</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <Tag>{CATEGORIES[algo.category]?.name || algo.category}</Tag>
        <Tag>{algo.difficulty}</Tag>
        {algo.stable !== undefined && <Tag>{algo.stable ? '稳定' : '不稳定'}</Tag>}
        {algo.inPlace !== undefined && <Tag>{algo.inPlace ? '原地' : '非原地'}</Tag>}
      </div>

      <div style={{ marginBottom: 14, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
        {algo.description}
      </div>

      <div style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
        {algo.fn ? (
          <InteractiveVisualization
            playground={<AlgorithmPlaygroundFor algo={algo} />}
            code={algo.code}
            slug={algo.slug}
            showCode={Boolean(algo.code)}
            forceStacked
          />
        ) : (
          <div style={{ minHeight: 240 }} aria-busy="true" />
        )}
      </div>
    </div>
  )
}

function AlgoSelect({ label, value, onChange }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)} style={selectStyle}>
        {Object.entries(CATEGORIES).map(([catKey, cat]) => {
          const options = ALGORITHM_LIST.filter(a => a.category === catKey)
          if (options.length === 0) return null
          return (
            <optgroup key={catKey} label={cat.name}>
              {options.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </optgroup>
          )
        })}
      </select>
    </label>
  )
}

function AdviceCard({ title, value }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}

function Tag({ children }) {
  return <span style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 11.5, color: 'var(--text-secondary)' }}>{children}</span>
}

function boolLabel(value) {
  if (value === true) return '是'
  if (value === false) return '否'
  return 'N/A'
}

function compareBoolean(left, right, leftName, rightName, label) {
  if (left === right) return { side: null, text: `${label}相同` }
  if (left === true && right === false) return { side: 'left', text: `${leftName} 的${label}更优` }
  if (left === false && right === true) return { side: 'right', text: `${rightName} 的${label}更优` }
  return { side: null, text: `${label}不可比` }
}

function compareComplexity(left, right, leftName, rightName) {
  const l = complexityScore(left)
  const r = complexityScore(right)
  if (l == null || r == null || l === r) return { side: null, text: '难以直接比较' }
  return l < r ? { side: 'left', text: `${leftName} 更优` } : { side: 'right', text: `${rightName} 更优` }
}

function complexityScore(value) {
  if (!value) return null
  const v = String(value).toLowerCase().replace(/\s+/g, '')
  if (/o\(1\)/.test(v)) return 0
  if (/log/.test(v) && !/n²|n\^2|n\*n|n·n/.test(v)) return 1
  if (/o\(n\+k\)|o\(k\+n\)|o\(v\+e\)|o\(e\+v\)/.test(v)) return 2.2
  if (/o\(n\)|o\(v\+e\)|o\(e\+v\)|o\(n\+e\)|o\(n\+m\)/.test(v)) return 2
  if (/n\^1\.[0-9]+|n\^1\.3|n\^1\.4|n\^1\.5/.test(v)) return 2.6
  if (/nlogn|n\*logn|n·logn|nlog\(n\)|n\s*log\s*n/.test(v)) return 3
  if (/n²|n\^2|n\*n|n·n|v·e|n\*m|nm/.test(v)) return 4
  if (/n³|n\^3|v³|v\^3/.test(v)) return 5
  if (/2\^n|n!/.test(v)) return 6
  return 3.5
}

function resolveSlug(slug, fallback) {
  if (slug && ALGORITHMS[slug]) return slug
  return fallback
}

function resolveDistinctSlug(slug, avoidSlug, fallback) {
  if (slug && ALGORITHMS[slug] && slug !== avoidSlug) return slug
  if (fallback && ALGORITHMS[fallback] && fallback !== avoidSlug) return fallback
  return ALGORITHM_LIST.find(a => a.slug !== avoidSlug)?.slug || avoidSlug
}

const pillStyle = {
  padding: '8px 14px',
  borderRadius: 999,
  background: 'var(--glass-bg)',
  border: '1px solid var(--glass-border)',
  color: 'var(--text-secondary)',
  fontSize: 12.5,
  fontWeight: 600,
}

const panelLinkStyle = {
  padding: '7px 12px',
  borderRadius: 999,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  fontSize: 12,
  fontWeight: 600,
}

const presetBtnStyle = {
  padding: '7px 12px',
  borderRadius: 999,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text-secondary)',
  fontSize: 12,
  fontWeight: 600,
}

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-primary)',
  fontSize: 13,
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  color: 'var(--text-tertiary)',
  fontSize: 11,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

const tdLabelStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--border)',
  fontWeight: 700,
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
}

function tdStyle(value, highlight) {
  return {
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
    color: highlight ? 'var(--accent-light)' : 'var(--text-secondary)',
    fontWeight: highlight ? 700 : 500,
    background: highlight ? 'var(--accent-soft)' : 'transparent',
    whiteSpace: 'nowrap',
  }
}

function buildSummary(left, right) {
  const speed = compareComplexity(left.timeComplexity?.average, right.timeComplexity?.average, left.name, right.name)
  const space = compareComplexity(left.spaceComplexity, right.spaceComplexity, left.name, right.name)
  const stability = compareBoolean(left.stable, right.stable, left.name, right.name, '稳定性')
  return {
    speed: speed.side === 'left' ? `${left.name} 平均更快` : speed.side === 'right' ? `${right.name} 平均更快` : '两者平均复杂度相近',
    space: space.side === 'left' ? `${left.name} 更省空间` : space.side === 'right' ? `${right.name} 更省空间` : '两者空间复杂度相近',
    stability: stability.side === 'left' ? `${left.name} 更稳定` : stability.side === 'right' ? `${right.name} 更稳定` : '稳定性没有明显差异',
  }
}
