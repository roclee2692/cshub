import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { StepProvider, useStepData } from '../contexts/StepContext'
import { ALGORITHMS, ALGORITHM_LIST } from '../data/algorithms'
import AlgorithmHeader from '../components/learning/AlgorithmHeader'
import ComplexityCards from '../components/learning/ComplexityCards'
import Section, { Prose } from '../components/learning/Section'
import CodeBlock from '../components/learning/CodeBlock'
import InteractiveVisualization from '../components/learning/InteractiveVisualization'
import CategoryComparison from '../components/learning/CategoryComparison'
import Quiz from '../components/learning/Quiz'
import { COMPLEXITY_NOTES } from '../data/complexityNotes'
import { QUIZZES } from '../data/quizzes'
import SortingPlayground from '../components/playgrounds/SortingPlayground'
import HeapPlayground from '../components/playgrounds/HeapPlayground'
import GraphPlayground from '../components/playgrounds/GraphPlayground'
import TreePlayground from '../components/playgrounds/TreePlayground'
import KnapsackPlayground from '../components/playgrounds/KnapsackPlayground'
import LCSPlayground from '../components/playgrounds/LCSPlayground'
import CountingSortPlayground from '../components/playgrounds/CountingSortPlayground'
import FloydPlayground from '../components/playgrounds/FloydPlayground'
import TopoPlayground from '../components/playgrounds/TopoPlayground'
import LISPlayground from '../components/playgrounds/LISPlayground'
import PageReplacementPlayground from '../components/playgrounds/PageReplacementPlayground'
import DiskPlayground from '../components/playgrounds/DiskPlayground'
import ElevatorPlayground from '../components/playgrounds/ElevatorPlayground'
import StringPlayground from '../components/playgrounds/StringPlayground'
import NQueensPlayground from '../components/playgrounds/NQueensPlayground'
import UnionFindPlayground from '../components/playgrounds/UnionFindPlayground'
import TriePlayground from '../components/playgrounds/TriePlayground'
import LinkedListPlayground from '../components/playgrounds/LinkedListPlayground'
import AStarPlayground from '../components/playgrounds/AStarPlayground'
import HashTablePlayground from '../components/playgrounds/HashTablePlayground'
import SegTreePlayground from '../components/playgrounds/SegTreePlayground'

export default function AlgorithmPage() {
  const { slug } = useParams()
  const algo = ALGORITHMS[slug]

  if (!algo) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>算法不存�?/h2>
        <Link to="/" style={{ color: 'var(--accent-light)' }}>返回首页 �?/Link>
      </div>
    )
  }

  return (
    <StepProvider>
      <AlgorithmPageContent algo={algo} />
    </StepProvider>
  )
}

function PseudocodeBlock({ code }) {
  // 伪代码保持静态，不跟动画同步
  // 可以让用户在需要时查看完整的伪代码逻辑
  return (
    <CodeBlock code={code} lang="pseudo" title="pseudocode.txt"
      highlightLine={null} noAutoScroll={true} />
  )
}

// 定义哪些可视化类型适合并排显示代码
const VIZ_WITH_CODE = new Set(['sorting', 'heap', 'counting'])

function AlgorithmPageContent({ algo }) {
  const playground = <PlaygroundFor key={algo.slug} algo={algo} />
  // 只有特定的可视化类型才显示并排代�?  const showCode = VIZ_WITH_CODE.has(algo.viz) && algo.code
  
  return (
    <article>
      <AlgorithmHeader algo={algo} />
      <ComplexityCards algo={algo} />

      <Section title="交互式可视化" icon="�? accent="var(--accent-soft)">
        <InteractiveVisualization 
          playground={playground}
          code={algo.code}
          slug={algo.slug}
          showCode={showCode}
        />
      </Section>

      <Section title="算法原理" icon="💡" accent="var(--yellow-soft)">
        <Prose text={algo.intuition} />
      </Section>

      <Section title="伪代�? icon="📝" accent="var(--blue-soft)">
        <PseudocodeBlock code={algo.pseudocode} />
      </Section>

      {COMPLEXITY_NOTES[algo.slug] && (
        <Section title="复杂度推�? icon="📐" accent="var(--blue-soft)">
          <ComplexityNote text={COMPLEXITY_NOTES[algo.slug]} />
        </Section>
      )}

      <Section title="应用场景" icon="🎯" accent="var(--accent-soft)">
        <ul style={{
          margin: 0, padding: 0, listStyle: 'none',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {algo.applications.map((app, i) => (
            <li key={i} style={{
              padding: '12px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 14,
              color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'flex-start', gap: 10,
            }}>
              <span style={{
                width: 18, height: 18, flexShrink: 0,
                borderRadius: 4,
                background: 'var(--accent-soft)',
                color: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                marginTop: 1,
              }}>{i + 1}</span>
              <span>{app}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="同类算法对比" icon="⚖️" accent="var(--surface)">
        <CategoryComparison algo={algo} />
      </Section>

      {QUIZZES[algo.slug] && (
        <Section title="课后测验" icon="🧪" accent="var(--yellow-soft)">
          <Quiz questions={QUIZZES[algo.slug]} />
        </Section>
      )}

      <RelatedNav algo={algo} />
    </article>
  )
}

function PlaygroundFor({ algo }) {
  const props = { algoFn: algo.fn, algoSlug: algo.slug, viz: algo.viz }
  switch (algo.viz) {
    case 'sorting':   return <SortingPlayground {...props} />
    case 'heap':      return <HeapPlayground {...props} />
    case 'graph':     return <GraphPlayground {...props} />
    case 'bst':
    case 'rb':        return <TreePlayground {...props} />
    case 'knapsack':  return <KnapsackPlayground {...props} />
    case 'lcs':       return <LCSPlayground {...props} />
    case 'counting':  return <CountingSortPlayground {...props} />
    case 'floyd':     return <FloydPlayground {...props} />
    case 'topo':      return <TopoPlayground {...props} />
    case 'lis':       return <LISPlayground {...props} />
    case 'pageReplacement': return <PageReplacementPlayground {...props} />
    case 'disk':      return <DiskPlayground {...props} />
    case 'elevator':  return <ElevatorPlayground {...props} />
    case 'string':    return <StringPlayground {...props} />
    case 'backtracking': return <NQueensPlayground {...props} />
    case 'unionfind':   return <UnionFindPlayground {...props} />
    case 'trie':        return <TriePlayground {...props} />
    case 'linkedlist':  return <LinkedListPlayground {...props} />
    case 'astar':       return <AStarPlayground {...props} />
    case 'hashtable':   return <HashTablePlayground {...props} />
    case 'segtree':     return <SegTreePlayground {...props} />
    default: return <div>未知可视化类�? {algo.viz}</div>
  }
}

function ComplexityNote({ text }) {
  // Render **bold** inline markdown
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <p style={{
      fontSize: 14, lineHeight: 1.8,
      color: 'var(--text-secondary)',
      padding: '14px 16px',
      background: 'var(--bg-elev)',
      borderRadius: 8,
      border: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)',
      margin: 0,
    }}>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </p>
  )
}

function RelatedNav({ algo }) {
  const sameCategory = ALGORITHM_LIST.filter(a => a.category === algo.category)
  const idx = sameCategory.findIndex(a => a.slug === algo.slug)
  const prev = idx > 0 ? sameCategory[idx - 1] : null
  const next = idx < sameCategory.length - 1 ? sameCategory[idx + 1] : null

  if (!prev && !next) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      marginTop: 32,
      paddingTop: 32,
      borderTop: '1px solid var(--border)',
    }}>
      {prev ? (
        <NavCard to={`/algo/${prev.slug}`} dir="�? label="上一�? name={prev.name} />
      ) : <div />}
      {next ? (
        <NavCard to={`/algo/${next.slug}`} dir="�? label="下一�? name={next.name} align="right" />
      ) : <div />}
    </div>
  )
}

  }
  
  return (
    <div>
      <div style={{
        display: 'flex',
        gap: 2,
        marginBottom: 12,
        padding: 4,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        width: 'fit-content',
      }}>
        {LANGS.map(l => {
          const active = lang === l.key
          return (
            <button key={l.key} onClick={() => setLang(l.key)}
              style={{
                padding: '6px 18px',
                fontSize: 12.5,
                fontWeight: 600,
                borderRadius: 5,
                border: 'none',
                background: active ? 'var(--bg)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s',
              }}>
              {l.label}
            </button>
          )
        })}
      </div>
      <CodeBlock
        code={code[lang]}
        lang={lang}
        title={`${slug}.${LANGS.find(x => x.key === lang).ext}`}
        highlightLine={highlightLine}
        noAutoScroll={false}
      />
    </div>
  )
}

function NavCard({ to, dir, label, name, align = 'left' }) {
  return (
    <Link to={to} style={{
      padding: '14px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      textAlign: align,
      transition: 'all 0.2s',
      display: 'block',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--surface-2)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em' }}>
        {align === 'right' ? `${label} →` : `�?${label}`}
      </div>
      <div style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
        {name}
      </div>
    </Link>
  )
}



