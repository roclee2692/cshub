import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────
// 书摘页 · /books/:slug
//   - 从理财页书籍卡片跳转进入
//   - 正常下拉滚动（不翻页）
//   - 第一屏：Book Hero（书名 + 封面色 + 作者 + 一句话描述）
//   - 后续：核心主张 / 精彩书摘 / 我的思考
// ─────────────────────────────────────────────────────────────

const BOOK_META = {
  'money-psychology': {
    title:      '《金钱心理学》',
    titleEn:    'The Psychology of Money',
    author:     'Morgan Housel',
    mark:       'MONEY',
    tone:       'amber',
    accentHex:  '#d7b56d',
    accentRgb:  '215, 181, 109',
    tagline:    '关于财富、贪婪与幸福的永恒真理',
    coverGrad:  'linear-gradient(145deg, rgba(215,181,109,0.38) 0%, rgba(7,20,15,0.82) 100%)',
  },
  'salary-millions': {
    title:      '《拿工薪，三十几岁你也能赚到600万》',
    titleEn:    'Salary Millions',
    author:     '江上治',
    mark:       'SALARY',
    tone:       'green',
    accentHex:  '#4c9769',
    accentRgb:  '76, 151, 105',
    tagline:    '用工薪收入实现财务自由的实践路径',
    coverGrad:  'linear-gradient(145deg, rgba(76,151,105,0.42) 0%, rgba(7,20,15,0.82) 100%)',
  },
  'intelligent-investor': {
    title:      '《聪明的投资者》',
    titleEn:    'The Intelligent Investor',
    author:     'Benjamin Graham',
    mark:       'VALUE',
    tone:       'blue',
    accentHex:  '#4a7097',
    accentRgb:  '74, 112, 151',
    tagline:    '价值投资的圣经，格雷厄姆的投资智慧',
    coverGrad:  'linear-gradient(145deg, rgba(74,112,151,0.44) 0%, rgba(7,20,15,0.82) 100%)',
  },
}

// 书摘内容（待填充）
const BOOK_NOTES = {
  'money-psychology':    { themes: [], quotes: [], reflections: [] },
  'salary-millions':     { themes: [], quotes: [], reflections: [] },
  'intelligent-investor':{ themes: [], quotes: [], reflections: [] },
}

export default function BookNotesPage() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const contentRef  = useRef(null)

  const book  = BOOK_META[slug]
  const notes = BOOK_NOTES[slug]

  // 未知 slug → 回到理财页
  if (!book || !notes) {
    navigate('/finance', { replace: true })
    return null
  }

  function scrollToContent() {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isEmpty = (arr) => !arr || arr.length === 0

  return (
    <div
      className="finance-page book-notes-root"
      style={{ '--book-accent': book.accentHex, '--book-accent-rgb': book.accentRgb }}
    >
      {/* 背景 */}
      <div className="finance-backdrop" aria-hidden="true" />

      {/* 返回按钮 */}
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

      {/* ── Hero ── */}
      <section className="book-notes-hero">
        {/* 封面卡片 */}
        <div
          className={`book-notes-cover finance-book-cover finance-book-cover-${book.tone}`}
          aria-hidden="true"
          style={{ background: book.coverGrad }}
        >
          <span>{book.mark}</span>
          <em>BOOK NOTES</em>
        </div>

        <div className="book-notes-hero-text">
          <div className="book-notes-kicker">
            {book.titleEn.toUpperCase()} · {book.author}
          </div>
          <h1 className="book-notes-title">{book.title}</h1>
          <p className="book-notes-tagline">{book.tagline}</p>

          <button
            type="button"
            onClick={scrollToContent}
            aria-label="滚动至书摘内容"
            className="book-notes-scroll-btn"
          >
            读书摘
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </section>

      {/* ── 内容区 ── */}
      <div ref={contentRef} className="book-notes-content">

        {/* 核心主张 */}
        <section className="book-notes-section">
          <div className="book-notes-section-eyebrow">CORE THEMES</div>
          <h2 className="book-notes-section-title">核心主张</h2>

          {isEmpty(notes.themes) ? (
            <Placeholder label="核心主张即将更新" />
          ) : (
            <div className="book-notes-theme-grid">
              {notes.themes.map((theme, i) => (
                <div key={i} className="book-notes-theme-card">
                  <em className="book-notes-card-num">
                    {String(i + 1).padStart(2, '0')}
                  </em>
                  <h3>{theme.title}</h3>
                  <p>{theme.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 精彩书摘 */}
        <section className="book-notes-section">
          <div className="book-notes-section-eyebrow">HIGHLIGHTS</div>
          <h2 className="book-notes-section-title">精彩书摘</h2>

          {isEmpty(notes.quotes) ? (
            <Placeholder label="书摘内容即将更新" />
          ) : (
            <div className="book-notes-quote-list">
              {notes.quotes.map((q, i) => (
                <blockquote key={i} className="book-notes-quote">
                  <p>{q.text}</p>
                  {q.chapter && (
                    <footer className="book-notes-quote-src">— {q.chapter}</footer>
                  )}
                </blockquote>
              ))}
            </div>
          )}
        </section>

        {/* 我的思考 */}
        <section className="book-notes-section">
          <div className="book-notes-section-eyebrow">MY REFLECTIONS</div>
          <h2 className="book-notes-section-title">我的思考</h2>

          {isEmpty(notes.reflections) ? (
            <Placeholder label="思考笔记即将更新" />
          ) : (
            <div className="book-notes-reflection-list">
              {notes.reflections.map((r, i) => (
                <div key={i} className="book-notes-reflection">
                  <div className="book-notes-reflection-bar" aria-hidden="true" />
                  <div>
                    {r.title && <h3>{r.title}</h3>}
                    <p>{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

// ── 占位符组件 ──────────────────────────────────────────────
function Placeholder({ label }) {
  return (
    <div className="book-notes-placeholder">
      <span className="book-notes-placeholder-dots" aria-hidden="true">· · ·</span>
      <span>{label}</span>
    </div>
  )
}
