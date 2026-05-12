import { Link } from 'react-router-dom'
import { CATEGORIES, ALGORITHM_LIST, getAlgorithmsByCategory } from '../data/algorithms'
import { useProgress } from '../contexts/ProgressContext'

function useCategoryProgress() {
  const { isCompleted } = useProgress()
  const result = {}
  for (const key of Object.keys(CATEGORIES)) {
    const algos = getAlgorithmsByCategory(key)
    result[key] = { done: algos.filter(a => isCompleted(a.slug)).length, total: algos.length }
  }
  return result
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ProgressPanel />
      <CategorySection />
      <FeatureSection />
    </div>
  )
}

function ProgressPanel() {
  const { favorites, completed, clearAll } = useProgress()
  const total = ALGORITHM_LIST.length
  const doneCount = completed.size
  const favCount = favorites.size
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const favList = ALGORITHM_LIST.filter(a => favorites.has(a.slug))
  const doneList = ALGORITHM_LIST.filter(a => completed.has(a.slug))

  if (doneCount === 0 && favCount === 0) {
    return (
      <section className="home-section" style={{ padding: '8px 48px 8px' }}>
        <div style={{
          padding: '20px 22px',
          background: 'var(--surface)',
          border: '1px dashed var(--border-strong)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--accent-soft)', color: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>📚</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>开始你的学习之旅</div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
              在算法详情页点击「标记已学」或「收藏」，进度会自动保存在本地。
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="home-section" style={{ padding: '12px 48px 0' }}>
      <div style={{
        padding: '22px 24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-light)', textTransform: 'uppercase' }}>
            我的进度
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => {
            if (confirm('清空所有收藏与学习进度？')) clearAll()
          }} style={{
            fontSize: 11.5,
            padding: '4px 10px',
            borderRadius: 5,
            background: 'transparent',
            color: 'var(--text-tertiary)',
            border: '1px solid var(--border)',
          }}>清空</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {doneCount}<span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}> / {total}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            已学完 · 收藏 {favCount} 个
          </div>
        </div>

        <div style={{
          height: 8, borderRadius: 99,
          background: 'var(--surface-2)',
          overflow: 'hidden',
          marginBottom: 18,
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--pink))',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {favList.length > 0 && (
          <ProgressRow label="收藏" items={favList} accent="var(--yellow)" />
        )}
        {doneList.length > 0 && (
          <ProgressRow label="已学完" items={doneList} accent="var(--green)" />
        )}
      </div>
    </section>
  )
}

function ProgressRow({ label, items, accent }) {
  return (
    <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <span style={{
        fontSize: 11, fontWeight: 600, letterSpacing: '0.05em',
        color: accent, padding: '3px 0',
        flexShrink: 0, width: 56,
      }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flex: 1 }}>
        {items.slice(0, 16).map(a => (
          <Link key={a.slug} to={`/algo/${a.slug}`} style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 99,
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
            {a.name}
          </Link>
        ))}
        {items.length > 16 && (
          <span style={{ fontSize: 12, color: 'var(--text-tertiary)', padding: '4px 6px' }}>
            +{items.length - 16}
          </span>
        )}
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero-section" style={{
      position: 'relative',
      padding: '88px 48px 64px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236,72,153,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          fontSize: 12,
          color: 'var(--text-secondary)',
          marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
          {ALGORITHM_LIST.length} 个算法 · 持续更新中
        </div>

        <h1 className="hero-title" style={{
          fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em',
          marginBottom: 18, lineHeight: 1.1,
        }}>
          一步一步，<br/>
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>看懂</span>每个算法
        </h1>

        <p style={{
          maxWidth: 580, margin: '0 auto 36px',
          fontSize: 17, lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}>
          交互式可视化、详尽的复杂度分析、伪代码与 JavaScript 实现，<br/>
          为数据结构课程而生的学习平台。
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link to="/algo/bubblesort" style={{
            padding: '11px 24px',
            background: 'linear-gradient(135deg, var(--accent), var(--pink))',
            color: 'white',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(139,92,246,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(139,92,246,0.4)' }}>
            开始学习 →
          </Link>
          <Link to="/algo/dijkstra" style={{
            padding: '11px 24px',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            border: '1px solid var(--border)',
          }}>
            浏览算法库
          </Link>
        </div>
      </div>
    </section>
  )
}

function CategorySection() {
  const catProgress = useCategoryProgress()
  return (
    <section className="home-section" style={{ padding: '48px 48px 32px' }}>
      <SectionLabel>算法分类</SectionLabel>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>按主题学习</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const algos = getAlgorithmsByCategory(key)
          const { done, total } = catProgress[key] || { done: 0, total: algos.length }
          const pct = total ? Math.round((done / total) * 100) : 0
          return (
            <div key={key} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `${cat.color}22`, color: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {done > 0 ? `${done}/${total} 已学完` : `${total} 个算法`}
                  </div>
                </div>
                {done > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: done === total ? 'var(--green)' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}>{pct}%</span>
                )}
              </div>

              {done > 0 && (
                <div style={{ height: 3, borderRadius: 99, background: 'var(--surface-2)', marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: done === total ? 'var(--green)' : cat.color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              )}

              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 14, lineHeight: 1.6 }}>
                {cat.desc}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {algos.map(a => (
                  <li key={a.slug}>
                    <Link to={`/algo/${a.slug}`} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 10px',
                      borderRadius: 6,
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                      <AlgoLink a={a} />
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {a.timeComplexity?.average}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function AlgoLink({ a }) {
  const { isCompleted } = useProgress()
  const done = isCompleted(a.slug)
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {done && (
        <span style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--green-soft)', color: 'var(--green)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {a.name}
    </span>
  )
}

function FeatureSection() {
  const features = [
    { icon: '⚡', title: '逐步可视化', desc: '每个步骤都可暂停回放，速度可调，让算法的执行过程完全透明。' },
    { icon: '📊', title: '复杂度分析', desc: '最好/平均/最坏时间复杂度与空间复杂度一目了然。' },
    { icon: '🔬', title: '原理讲解', desc: '中文撰写的算法直觉与思路，不是单纯的代码搬运。' },
    { icon: '💻', title: '可读代码', desc: '伪代码 + JavaScript 实现并排对照，复制即用。' },
  ]
  return (
    <section className="home-section" style={{ padding: '32px 48px 80px' }}>
      <SectionLabel>核心特性</SectionLabel>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>不只是 Demo</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {features.map(f => (
          <div key={f.title} style={{
            padding: '20px 18px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.12em',
      color: 'var(--accent-light)',
      textTransform: 'uppercase',
      marginBottom: 8,
    }}>{children}</div>
  )
}
