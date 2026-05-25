import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const MARKET_CARDS = [
  {
    mark: 'A-SHARE',
    title: 'A 股',
    body: '以人民币计价、主要在上海和深圳交易所上市交易。它更贴近中国经济和政策周期，行业风格切换明显，普通投资者常通过宽基指数、行业指数或公募基金参与。',
  },
  {
    mark: 'US',
    title: '美股',
    body: '覆盖全球化程度高的公司和成熟资本市场，交易机制、信息披露和指数产品更丰富。参与前要理解汇率、税务、时差、券商和跨境资金规则。',
  },
  {
    mark: 'INDEX',
    title: '指数',
    body: '指数不是一家公司，而是一篮子股票的组合。沪深 300、标普 500、纳斯达克 100 这类指数常被用来观察市场整体或某类资产的表现。',
  },
]

const LESSONS = [
  {
    number: '01',
    title: '先分清股票、基金和指数',
    body: '股票代表单家公司的一部分所有权；基金是把很多人的钱交给基金组合管理；指数是市场样本的统计口径。新手如果没能力研究公司，通常先理解指数和基金更稳妥。',
  },
  {
    number: '02',
    title: '长期持有不等于永远不管',
    body: '长期持有的核心是减少短期情绪交易，但仍然要定期检查资产配置、费用、风险暴露和自己的现金流。如果买入理由消失，也需要重新评估。',
  },
  {
    number: '03',
    title: '收益来自承担风险',
    body: '股市长期可能有回报，是因为投资者承担了波动、亏损和不确定性。真正的问题不是“会不会跌”，而是跌的时候你是否还有现金流和心理承受力。',
  },
]

const CHECKLIST = [
  '先准备应急资金，再谈投资仓位。',
  '不要用短期要花的钱买高波动资产。',
  '看年化收益时，同时看最大回撤和持有周期。',
  '不要把单一股票当成“稳赚”的储蓄替代品。',
  '任何市场都不要满仓押注一个故事。',
]

export default function StockMarketPage() {
  const navigate = useNavigate()
  const contentRef = useRef(null)

  function scrollToContent() {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="finance-page stock-market-root">
      <div className="finance-backdrop" aria-hidden="true" />

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

      <section className="stock-market-hero">
        <div className="stock-market-hero-inner">
          <div className="stock-market-kicker">STOCK MARKET / LONG-TERM HOLDING</div>
          <h1 className="stock-market-title">股市入门</h1>
          <p className="stock-market-manifesto">
            先理解市场，再谈长期持有。
          </p>
          <p className="stock-market-desc">
            A 股和美股不是两个简单的涨跌符号，而是不同交易制度、经济结构、投资者结构和风险来源的集合。
          </p>
        </div>

        <button
          type="button"
          onClick={scrollToContent}
          aria-label="滚动至股市内容"
          className="finance-hero-chevron stock-market-chevron"
        >
          <span className="finance-hero-chevron-label">Scroll</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      <main ref={contentRef} className="stock-market-content">
        <section className="stock-market-disclaimer">
          <strong>学习提示</strong>
          <p>
            本页用于建立金融常识，不构成投资建议。股票市场有亏损风险，任何决定都要结合个人现金流、风险承受能力和投资期限。
          </p>
        </section>

        <section className="stock-market-section">
          <div className="stock-market-section-header">
            <span>MARKETS</span>
            <h2>A 股、美股和指数到底是什么</h2>
          </div>
          <div className="stock-market-card-grid">
            {MARKET_CARDS.map(card => (
              <article className="stock-market-card" key={card.mark}>
                <div>{card.mark}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="stock-market-section">
          <div className="stock-market-section-header">
            <span>FRAMEWORK</span>
            <h2>长期持有之前，先建立三个判断</h2>
          </div>
          <div className="stock-market-lesson-list">
            {LESSONS.map(item => (
              <article className="stock-market-lesson" key={item.number}>
                <em>{item.number}</em>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="stock-market-section stock-market-checklist">
          <div className="stock-market-section-header">
            <span>CHECKLIST</span>
            <h2>入场前的底线清单</h2>
          </div>
          <ul>
            {CHECKLIST.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
