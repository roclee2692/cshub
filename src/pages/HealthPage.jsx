import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────
// 健康 · 健康是复利的本金
//   - 正常下拉滚动页面（不翻页）
//   - 第一屏：Hero 全屏封面
//   - 后续：健康内容区（内容待填充）
// ─────────────────────────────────────────────────────────────

const HEALTH_PILLARS = [
  { id: 'sleep',     mark: 'SLEEP', index: '01', tone: 'emerald', title: '睡眠' },
  { id: 'exercise',  mark: 'MOVE',  index: '02', tone: 'teal',    title: '运动' },
  { id: 'nutrition', mark: 'EAT',   index: '03', tone: 'lime',    title: '饮食' },
]

export default function HealthPage() {
  const navigate    = useNavigate()
  const scrollRef   = useRef(null)
  const contentRef  = useRef(null)

  function scrollToContent() {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={scrollRef} className="health-page health-scroll-root">
      {/* 固定背景光晕（随滚动不动） */}
      <div className="health-backdrop" aria-hidden="true" />

      {/* 返回按钮（固定在左上角） */}
      <button
        type="button"
        onClick={() => navigate('/finance')}
        aria-label="返回理财页"
        className="health-back-btn"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        返回
      </button>

      {/* ── Hero：第一屏封面 ── */}
      <section className="health-hero">
        <div className="health-hero-inner">
          <div className="health-kicker">LONGEVITY OS / BODY FIRST</div>
          <h1 className="health-title">健康</h1>
          <p className="health-manifesto">健康是复利的本金</p>
          <p className="health-sub-manifesto">
            时间是复利的燃料，而健康决定你能燃烧多久。
          </p>
          <div className="health-signal" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
        </div>

        {/* 向下滚动提示 */}
        <button
          type="button"
          onClick={scrollToContent}
          aria-label="滚动至内容区"
          className="health-hero-chevron"
        >
          <span className="health-hero-chevron-label">Scroll</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      {/* ── 内容区（正常流，向下滚动） ── */}
      <div ref={contentRef} className="health-content-area">

        {/* 三大支柱概览 */}
        <section className="health-step health-step-featured">
          <div className="health-step-index">核心</div>
          <div className="health-step-copy">
            <h2>三大健康支柱</h2>
            <p>
              睡眠、运动、饮食——构成长期健康的三角支撑。
              缺少任何一角，复利的时钟都会悄悄变慢。
            </p>
          </div>
          <div className="health-pillars" aria-label="健康支柱">
            {HEALTH_PILLARS.map(p => (
              <article className="health-pillar" key={p.id}>
                <div
                  className={`health-pillar-icon health-pillar-icon-${p.tone}`}
                  role="img"
                  aria-label={p.title}
                >
                  <span>{p.mark}</span>
                  <em>{p.index}</em>
                </div>
                <strong>{p.title}</strong>
              </article>
            ))}
          </div>
        </section>

        {/* 内容板块网格 */}
        <div className="health-step-grid">

          <section className="health-step">
            <div className="health-step-index">01</div>
            <div className="health-step-copy">
              <h2>睡眠</h2>
              {/* TODO: 填充睡眠板块内容 */}
              <p className="health-placeholder-hint">· · · 内容即将填充 · · ·</p>
            </div>
          </section>

          <section className="health-step">
            <div className="health-step-index">02</div>
            <div className="health-step-copy">
              <h2>运动</h2>
              {/* TODO: 填充运动板块内容 */}
              <p className="health-placeholder-hint">· · · 内容即将填充 · · ·</p>
            </div>
          </section>

          <section className="health-step">
            <div className="health-step-index">03</div>
            <div className="health-step-copy">
              <h2>饮食</h2>
              {/* TODO: 填充饮食板块内容 */}
              <p className="health-placeholder-hint">· · · 内容即将填充 · · ·</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
