import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { wealthFramework } from '../data/wealth'

// ─────────────────────────────────────────────────────────────
// 理财 · 人赚不到认知以外的钱
//   - 全屏翻页（fullPage 风格），与首页逻辑学一致
//   - 第 1 屏：Hero（理财 + 宣言 + 信号柱）
//   - 第 2 屏：Content（免责声明 + 三步内容）
//   - 在第 2 屏内，若内容超出视口高度，先让内层 div 消化滚动，
//     滚到底/顶后才触发翻页（使用 contentScrollRef 边界判断）
// ─────────────────────────────────────────────────────────────

const {
  disclaimer,
  manifesto,
  antifragile,
  assetClasses,
  allocationSystem,
  investorProfile,
  psychologySystem,
  riskManagement,
  phases,
  books,
  financeBasics,
  closing,
} = wealthFramework

const PAGES    = 2
const ANIM_MS  = 800
const LOCK_MS  = ANIM_MS + 220
const WHEEL_THRESHOLD = 28
const GESTURE_GAP_MS  = 220

export default function FinancePage() {
  const [page, setPage]             = useState(0)
  const [contentKey, setContentKey] = useState(0)
  const navigate                    = useNavigate()
  const containerRef                = useRef(null)
  const contentScrollRef            = useRef(null)   // inner scroll on page 2
  const lockRef                     = useRef(false)
  const accumRef                    = useRef(0)
  const lastWheelRef                = useRef(0)
  const pageRef                     = useRef(0)
  const touchStartRef               = useRef(0)
  useEffect(() => { pageRef.current = page }, [page])
  // Re-mount page-2 content each time it becomes visible → CSS animations replay
  useEffect(() => { if (page === 1) setContentKey(k => k + 1) }, [page])

  const goTo = useCallback((next) => {
    if (lockRef.current) return
    const target = Math.max(0, Math.min(PAGES - 1, next))
    setPage(prev => {
      if (prev === target) return prev
      lockRef.current = true
      // reset inner scroll when going back to hero
      if (target === 0 && contentScrollRef.current) {
        contentScrollRef.current.scrollTop = 0
      }
      setTimeout(() => { lockRef.current = false }, LOCK_MS)
      return target
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheelRef.current > GESTURE_GAP_MS) accumRef.current = 0
      lastWheelRef.current = now

      // 翻页动画期间冻结所有输入（含内层滚动），防止手势残留把第二页顶部滚走
      if (lockRef.current) return

      // 在内容页：先让内层 div 消化滚轮，到顶/底边界才触发翻页
      if (pageRef.current === 1) {
        const inner = contentScrollRef.current
        if (inner) {
          const canScrollDown = inner.scrollTop < inner.scrollHeight - inner.clientHeight - 1
          const canScrollUp   = inner.scrollTop > 1
          if ((e.deltaY > 0 && canScrollDown) || (e.deltaY < 0 && canScrollUp)) {
            inner.scrollTop += e.deltaY
            return
          }
        }
      }
      accumRef.current += e.deltaY
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return

      const dir = accumRef.current > 0 ? 1 : -1
      accumRef.current = 0
      goTo(pageRef.current + dir)
    }

    const onKey = (e) => {
      const k = e.key
      if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') {
        e.preventDefault()
        goTo(pageRef.current + 1)
      } else if (k === 'ArrowUp' || k === 'PageUp') {
        e.preventDefault()
        goTo(pageRef.current - 1)
      } else if (k === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (k === 'End') {
        e.preventDefault()
        goTo(PAGES - 1)
      }
    }

    const onTouchStart = (e) => {
      touchStartRef.current = e.touches[0].clientY
    }

    const onTouchEnd = (e) => {
      if (lockRef.current) return
      const deltaY = touchStartRef.current - e.changedTouches[0].clientY
      if (Math.abs(deltaY) < 40) return

      // On page 2, only flip when inner scroll has hit its boundary
      if (pageRef.current === 1) {
        const inner = contentScrollRef.current
        if (inner) {
          const canScrollDown = inner.scrollTop < inner.scrollHeight - inner.clientHeight - 1
          const canScrollUp   = inner.scrollTop > 1
          if ((deltaY > 0 && canScrollDown) || (deltaY < 0 && canScrollUp)) return
        }
      }
      goTo(pageRef.current + (deltaY > 0 ? 1 : -1))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [goTo])

  return (
    <div ref={containerRef} className="finance-page finance-snap-pager">
      <div className="finance-backdrop" aria-hidden="true" />

      <div
        className="finance-snap-track"
        style={{
          transform: `translate3d(0, -${page * 100}vh, 0)`,
          transition: `transform ${ANIM_MS}ms cubic-bezier(0.86, 0, 0.07, 1)`,
        }}
      >
        {/* ── Page 1: Hero ── */}
        <div className="finance-snap-page">
          <section className="finance-hero">
            <div className="finance-hero-inner">
              <div className="finance-kicker">WEALTH OS / COGNITION FIRST</div>
              <h1 className="finance-title">理财</h1>
              <p className="finance-manifesto">人赚不到认知以外的钱</p>
              <div className="finance-signal" aria-hidden="true">
                <span /><span /><span />
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="向下翻页"
            className="finance-hero-chevron"
          >
            <span className="finance-hero-chevron-label">Scroll</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* ── Page 2: Content ── */}
        <div className="finance-snap-page">
          <main
            key={contentKey}
            ref={contentScrollRef}
            className="finance-content finance-content-scrollable"
            aria-label="长期财富课程"
          >
            <section className="finance-disclaimer" aria-label="免责声明">
              <strong>{disclaimer.label}</strong>
              <p>{disclaimer.body}</p>
            </section>

            <section className="finance-course-section finance-why-section" aria-label="为什么要理财">
              <div className="finance-section-header">
                <span>{manifesto.eyebrow}</span>
                <h2>{manifesto.title}</h2>
                <p>{manifesto.lead}</p>
              </div>
              <div className="finance-why-grid">
                {manifesto.points.map((point, index) => (
                  <article className="finance-principle-card" key={point}>
                    <em>{String(index + 1).padStart(2, '0')}</em>
                    <p>{point}</p>
                  </article>
                ))}
              </div>
              <p className="finance-section-note">{manifesto.note}</p>
            </section>

            <section className="finance-course-section finance-antifragile-section" aria-label="反脆弱北极星">
              <div className="finance-section-header finance-section-header-split">
                <div>
                  <span>{antifragile.eyebrow}</span>
                  <h2>{antifragile.title}</h2>
                </div>
                <p>{antifragile.lead}</p>
              </div>
              <div className="finance-principle-grid">
                {antifragile.principles.map((item, index) => (
                  <article className="finance-principle-card" key={item}>
                    <em>{String(index + 1).padStart(2, '0')}</em>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="finance-course-section" aria-label="认识资产类别">
              <div className="finance-section-header">
                <span>ASSET MAP</span>
                <h2>认识不同资产的角色</h2>
                <p>
                  资产没有绝对最好，只有风险、收益来源、流动性和使用场景的差异。先理解角色，再决定比例。
                </p>
              </div>
              <div className="finance-asset-grid">
                {assetClasses.map(asset => (
                  <article className="finance-asset-card" key={asset.name}>
                    <div className="finance-asset-card-head">
                      <span>{asset.name}</span>
                      <strong>{asset.role}</strong>
                    </div>
                    <dl>
                      <div>
                        <dt>收益来源</dt>
                        <dd>{asset.returnSource}</dd>
                      </div>
                      <div>
                        <dt>主要风险</dt>
                        <dd>{asset.risks}</dd>
                      </div>
                      <div>
                        <dt>适用场景</dt>
                        <dd>{asset.suitableFor}</dd>
                      </div>
                    </dl>
                    <p>{asset.warning}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="finance-course-section" aria-label="资产配置系统">
              <div className="finance-section-header finance-section-header-split">
                <div>
                  <span>{allocationSystem.eyebrow}</span>
                  <h2>{allocationSystem.title}</h2>
                </div>
                <p>{allocationSystem.lead}</p>
              </div>

              <div className="finance-principle-grid finance-principle-grid-tight">
                {allocationSystem.principles.map(item => (
                  <article className="finance-principle-card" key={item}>
                    <p>{item}</p>
                  </article>
                ))}
              </div>

              <div className="finance-allocation-layout">
                <div className="finance-numbered-panel">
                  <h3>核心动作</h3>
                  <ol>
                    {allocationSystem.steps.map(step => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="finance-portfolio-grid">
                  {allocationSystem.examplePortfolios.map(portfolio => (
                    <article className="finance-portfolio-card" key={portfolio.name}>
                      <span>{portfolio.name}</span>
                      <h3>{portfolio.ratio}</h3>
                      <p>{portfolio.fit}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="finance-rule-list" aria-label="再平衡规则">
                <h3>再平衡规则</h3>
                <ul>
                  {allocationSystem.rebalanceRules.map(rule => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
              <p className="finance-section-note">{allocationSystem.disclaimer}</p>
            </section>

            <section className="finance-course-section" aria-label="长期价值投资者画像">
              <div className="finance-section-header">
                <span>{investorProfile.eyebrow}</span>
                <h2>{investorProfile.title}</h2>
                <p>{investorProfile.lead}</p>
              </div>
              <div className="finance-profile-grid">
                <FinanceListCard title="服务谁" items={investorProfile.forWhom} />
                <FinanceListCard title="不适合谁" items={investorProfile.notForWhom} />
                <FinanceListCard title="本课程不教什么" items={investorProfile.courseDoesNotTeach} featured />
              </div>
            </section>

            <section className="finance-course-section" aria-label="金钱心理学与个人操作系统">
              <div className="finance-section-header finance-section-header-split">
                <div>
                  <span>{psychologySystem.eyebrow}</span>
                  <h2>{psychologySystem.title}</h2>
                </div>
                <p>{psychologySystem.lead}</p>
              </div>
              <div className="finance-psychology-layout">
                <div className="finance-rule-list">
                  <h3>核心观念</h3>
                  <ul>
                    {psychologySystem.coreIdeas.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="finance-question-panel">
                  <h3>写下你的个人原则</h3>
                  <ol>
                    {psychologySystem.personalQuestions.map(question => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="finance-behavior-row">
                {psychologySystem.behaviorRules.map(rule => (
                  <span key={rule}>{rule}</span>
                ))}
              </div>
            </section>

            <section className="finance-course-section" aria-label="风险管理">
              <div className="finance-section-header">
                <span>{riskManagement.eyebrow}</span>
                <h2>{riskManagement.title}</h2>
                <p>{riskManagement.lead}</p>
              </div>
              <div className="finance-risk-grid">
                {riskManagement.riskTypes.map(risk => (
                  <article className="finance-risk-card" key={risk.name}>
                    <h3>{risk.name}</h3>
                    <p>{risk.body}</p>
                  </article>
                ))}
              </div>
              <div className="finance-risk-bottom">
                <FinanceListCard title="生存规则" items={riskManagement.survivalRules} />
                <FinanceListCard title="危险信号" items={riskManagement.redFlags} featured />
              </div>
            </section>

            <section className="finance-course-section" aria-label="三阶段路径">
              <div className="finance-section-header">
                <span>PHASES</span>
                <h2>三阶段路径</h2>
                <p>认知、持有和健康是这个财富框架的三条底层主线。先把基础系统搭稳，再谈具体工具。</p>
              </div>
              <div className="finance-step-grid">
                {phases.map((step, index) => {
                  const isStockStep = index === 1
                  const isHealthStep = index === 2
                  const target = isStockStep ? '/finance/stocks' : isHealthStep ? '/health' : null
                  const clickableClass = target ? 'finance-step-link' : ''
                  const goldClass = isStockStep ? 'finance-step-link-gold' : ''

                  return (
                    <section
                      className={`finance-step ${clickableClass} ${goldClass}`}
                      key={step.number}
                      role={target ? 'button' : undefined}
                      tabIndex={target ? 0 : undefined}
                      aria-label={target ? `进入 ${step.title} 详情页` : undefined}
                      onClick={target ? () => navigate(target) : undefined}
                      onKeyDown={target ? e => (e.key === 'Enter' || e.key === ' ') && navigate(target) : undefined}
                    >
                      <div className="finance-step-index">{step.number}</div>
                      <div className="finance-step-copy">
                        <h2>{step.title}</h2>
                        <p>{step.body}</p>
                      </div>
                      {target && <FinanceArrow />}
                    </section>
                  )
                })}
              </div>
            </section>

            <section className="finance-basics" aria-label="金融常识">
              <div className="finance-basics-header">
                <span>FINANCE BASICS</span>
                <h2>金融常识：先算清代价，再谈拥有</h2>
                <p>
                  房、车和投资不是单纯的“该不该”，而是现金流、风险和机会成本的权衡。做决定前，先把隐性成本写出来。
                </p>
              </div>
              <div className="finance-basic-grid">
                {financeBasics.map(item => (
                  <article className="finance-basic-card" key={item.title}>
                    <div className="finance-basic-mark">{item.mark}</div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="finance-course-section finance-books-section" aria-label="推荐书摘">
              <div className="finance-section-header">
                <span>BOOK NOTES</span>
                <h2>书摘入口：从《金钱心理学》开始</h2>
                <p>书摘模块继续保留。优先理解行为、耐心和风险，再进入资产工具与价值投资框架。</p>
              </div>
              <div className="finance-books" aria-label="推荐书单">
                {books.map((book, index) => (
                  <article
                    key={book.title}
                    className={`finance-book finance-book-link ${book.slug === 'money-psychology' ? 'finance-book-emphasis' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`进入 ${book.title} 书摘页`}
                    onClick={() => navigate(`/books/${book.slug}`)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/books/${book.slug}`)}
                  >
                    <div
                      className={`finance-book-cover finance-book-cover-${book.tone}`}
                      role="img"
                      aria-label={`${book.title} 书籍封面`}
                    >
                      <div className="finance-book-cover-head">
                        <span>{book.mark}</span>
                        <em>{String(index + 1).padStart(2, '0')}</em>
                      </div>
                      <div className="finance-book-cover-body">
                        <strong>{book.coverTitle}</strong>
                        <p>{book.coverSubtitle}</p>
                      </div>
                      <div className="finance-book-cover-foot">
                        <span>{book.coverAuthor}</span>
                      </div>
                    </div>
                    <p className="finance-book-spotlight">{book.spotlight}</p>
                    <div className="finance-book-link-hint" aria-hidden="true">读书摘 →</div>
                  </article>
                ))}
              </div>
            </section>

            <section className="finance-course-section finance-closing-section" aria-label="最终宣言">
              <div className="finance-section-header">
                <span>{closing.eyebrow}</span>
                <h2>{closing.title}</h2>
                <p>{closing.body}</p>
              </div>
              <div className="finance-principle-grid">
                {closing.principles.map(item => (
                  <article className="finance-principle-card" key={item}>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
              <p className="finance-section-note">{closing.disclaimer}</p>
            </section>
          </main>
        </div>
      </div>

      <FinancePageDots count={PAGES} active={page} onSelect={goTo} />
    </div>
  )
}

function FinanceListCard({ title, items, featured = false }) {
  return (
    <article className={`finance-list-card ${featured ? 'finance-list-card-featured' : ''}`}>
      <h3>{title}</h3>
      <ul>
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

function FinanceArrow() {
  return (
    <div className="finance-step-link-arrow" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  )
}

function FinancePageDots({ count, active, onSelect }) {
  return (
    <div
      aria-label="页面导航"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 40,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active
        return (
          <button
            key={i}
            type="button"
            aria-label={`跳到第 ${i + 1} 屏`}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => onSelect(i)}
            style={{
              width: isActive ? 12 : 10,
              height: isActive ? 12 : 10,
              padding: 0,
              borderRadius: 999,
              border: '1.5px solid',
              background: isActive ? 'var(--finance-gold, #d7b56d)' : 'transparent',
              borderColor: isActive ? 'transparent' : 'rgba(215, 181, 109, 0.45)',
              boxShadow: isActive ? '0 6px 18px rgba(215, 181, 109, 0.45)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          />
        )
      })}
    </div>
  )
}
