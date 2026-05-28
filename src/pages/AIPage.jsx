import { Link } from 'react-router-dom'
import { AI_CURRICULUM, AI_TOTAL_LESSONS } from '../data/ai/curriculum'
import { useCourseProgress } from '../features/music/hooks/useCourseProgress'

const LEFT_FORMULAS = [
  'θ := θ - α ∇J(θ)',
  'J(θ) = 1/2 Σ (h(x) - y)²',
  'σ(x) = 1 / (1 + e^-x)',
  'ReLU(x) = max(0, x)',
]

const RIGHT_FORMULAS = [
  'Attention(Q,K,V) = softmax(QKᵀ / √dₖ)V',
  'σ(z)ᵢ = e^{zᵢ} / Σⱼ e^{zⱼ}',
  'L = -Σ yᵢ log(pᵢ)',
  '∂L/∂W = ...',
]

const PARTICLES = [
  ['12%', '18%', '0s'], ['18%', '72%', '1.2s'], ['28%', '32%', '2.4s'],
  ['38%', '82%', '0.8s'], ['58%', '22%', '1.8s'], ['68%', '68%', '2.8s'],
  ['78%', '35%', '0.4s'], ['86%', '76%', '2s'], ['92%', '20%', '3.2s'],
]

export default function AIPage() {
  const { progress, isCompleted } = useCourseProgress(AI_CURRICULUM.id, AI_TOTAL_LESSONS)

  const firstLesson = AI_CURRICULUM.chapters[0].lessons[0]
  const nextLesson = findNextLesson(AI_CURRICULUM, isCompleted)

  return (
    <div className="min-h-screen pb-24">
      <AIHero progress={progress} firstLesson={firstLesson} nextLesson={nextLesson} />

      {/* Chapters */}
      <div id="ai-course-chapters" className="max-w-3xl mx-auto px-6 pt-14">
        <div className="flex flex-col gap-6">
          {AI_CURRICULUM.chapters.map((chapter, ci) => {
            const chapterDone = chapter.lessons.filter(l => isCompleted(l.id)).length
            return (
              <section key={chapter.id} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-fg-faint mb-0.5">
                      第 {ci + 1} 章
                    </div>
                    <h2 className="text-lg font-bold text-fg">{chapter.title}</h2>
                  </div>
                  <span className="text-xs text-fg-faint font-mono">
                    {chapterDone}/{chapter.lessons.length}
                  </span>
                </div>

                <ul className="flex flex-col gap-1">
                  {chapter.lessons.map((lesson, li) => {
                    const done = isCompleted(lesson.id)
                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/ai-course/lesson/${lesson.id}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface transition-colors group"
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors"
                            style={{
                              background: done ? '#8b5cf622' : 'var(--surface)',
                              color: done ? '#8b5cf6' : 'var(--text-tertiary)',
                              border: `1px solid ${done ? '#8b5cf644' : 'var(--border)'}`,
                            }}
                          >
                            {done ? '✓' : `${ci + 1}.${li + 1}`}
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-fg group-hover:text-accent transition-colors">
                              {lesson.title}
                            </span>
                            {lesson.summary && (
                              <span className="block text-xs text-fg-faint truncate mt-0.5">
                                {lesson.summary}
                              </span>
                            )}
                          </span>
                          {lesson.exercise && (
                            <span className="text-xs text-fg-faint flex-shrink-0">🎮</span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AIHero({ progress, firstLesson, nextLesson }) {
  const startLabel = progress.count === 0 ? '开始系统学习' : '继续系统学习'

  return (
    <section className="ai-course-hero relative min-h-[84vh] overflow-hidden px-6 text-center">
      <HeroStyles />
      <div className="ai-course-hero-bg" aria-hidden="true" />
      <div className="ai-course-grid" aria-hidden="true" />
      <div className="ai-course-glow ai-course-glow-main" aria-hidden="true" />
      <div className="ai-course-glow ai-course-glow-side" aria-hidden="true" />
      <FormulaWall side="left" formulas={LEFT_FORMULAS} />
      <FormulaWall side="right" formulas={RIGHT_FORMULAS} />
      <ParticleField />
      <HeroTrajectories />

      <div className="relative z-10 mx-auto flex min-h-[84vh] max-w-5xl flex-col items-center justify-center pb-20 pt-24">
        <div
          className="ai-hero-kicker text-[10px] font-bold uppercase text-[#f4b8df]/70"
          style={{ animationDelay: '0.08s' }}
        >
          PROFESSIONAL CURRICULUM · 30+ INTERACTIVE VISUALIZATIONS
        </div>

        <h1 className="ai-hero-title mt-8 flex flex-col items-center leading-none" style={{ animationDelay: '0.32s' }}>
          <span className="ai-hero-title-ai">AI</span>
          <span className="ai-hero-title-cn">专业课</span>
        </h1>

        <p className="ai-hero-copy mt-8 text-[20px] leading-[2.05] text-[#f8dbc2]/88 sm:text-[23px]" style={{ animationDelay: '0.64s' }}>
          从优化理论到大语言模型。<br />
          用可视化真正理解现代人工智能。
        </p>

        <div className="ai-hero-progress mt-9 w-full max-w-[680px]" style={{ animationDelay: '0.9s' }}>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-[#f8cfe9]/70">
            <span>学习进度</span>
            <span>{progress.count} / {progress.total}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-black/35 shadow-[inset_0_1px_10px_rgba(0,0,0,0.55)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#d946ef] via-[#f472b6] to-[#fb7185] shadow-[0_0_22px_rgba(244,114,182,0.55)] transition-all duration-500"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>

        <div className="ai-hero-actions mt-8 flex flex-wrap justify-center gap-4" style={{ animationDelay: '1.08s' }}>
          <Link
            to={`/ai-course/lesson/${nextLesson.id}`}
            className="ai-hero-primary inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-extrabold text-white"
          >
            {startLabel} →
          </Link>
          <Link
            to={`/ai-course/lesson/${firstLesson.id}`}
            className="ai-hero-secondary inline-flex items-center justify-center rounded-2xl px-7 py-4 text-sm font-bold text-[#f7d9ee]"
          >
            从第一课开始
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="ai-hero-scroll absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[#f4b8df]/70"
        onClick={() => document.getElementById('ai-course-chapters')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span>Scroll</span>
        <span aria-hidden="true">↓</span>
      </button>
    </section>
  )
}

function FormulaWall({ side, formulas }) {
  return (
    <div className={`ai-formula-wall ai-formula-wall-${side} hidden lg:block`} aria-hidden="true">
      {formulas.map((formula, index) => (
        <div
          key={formula}
          className="ai-formula"
          style={{
            animationDelay: `${index * 0.7}s`,
            transform: `translateY(${index % 2 === 0 ? 0 : 18}px) rotate(${side === 'left' ? -3 : 3}deg)`,
          }}
        >
          {formula}
        </div>
      ))}
    </div>
  )
}

function ParticleField() {
  return (
    <div className="ai-particles" aria-hidden="true">
      {PARTICLES.map(([left, top, delay], index) => (
        <span key={index} style={{ left, top, animationDelay: delay }} />
      ))}
    </div>
  )
}

function HeroTrajectories() {
  return (
    <svg className="ai-hero-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 72 C 22 54, 36 86, 54 61 S 78 35, 96 52" />
      <path d="M7 34 C 28 17, 41 42, 62 28 S 84 10, 96 23" />
      <path d="M16 90 C 35 74, 58 76, 86 64" />
    </svg>
  )
}

function HeroStyles() {
  return (
    <style>{`
      .ai-course-hero {
        background:
          radial-gradient(circle at 50% 34%, rgba(168, 85, 247, 0.22), transparent 34%),
          radial-gradient(circle at 24% 22%, rgba(236, 72, 153, 0.16), transparent 28%),
          radial-gradient(circle at 78% 18%, rgba(129, 140, 248, 0.16), transparent 30%),
          linear-gradient(180deg, #080713 0%, #0c0818 48%, #070610 100%);
        color: white;
        isolation: isolate;
      }

      .ai-course-hero-bg {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 50% 44%, rgba(255,255,255,0.06), transparent 18%),
          radial-gradient(circle at 50% 108%, rgba(244,114,182,0.11), transparent 30%);
        pointer-events: none;
      }

      .ai-course-grid {
        position: absolute;
        inset: 0;
        opacity: 0.22;
        background-image:
          linear-gradient(rgba(255, 215, 238, 0.11) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 215, 238, 0.11) 1px, transparent 1px);
        background-size: 42px 42px;
        mask-image: radial-gradient(ellipse at center, black 0%, black 54%, transparent 86%);
        -webkit-mask-image: radial-gradient(ellipse at center, black 0%, black 54%, transparent 86%);
      }

      .ai-course-glow {
        position: absolute;
        border-radius: 999px;
        filter: blur(36px);
        animation: pulseGlow 5.8s ease-in-out infinite;
        pointer-events: none;
      }

      .ai-course-glow-main {
        width: 520px;
        height: 520px;
        left: calc(50% - 260px);
        top: 18%;
        background: rgba(217, 70, 239, 0.18);
      }

      .ai-course-glow-side {
        width: 360px;
        height: 360px;
        right: 8%;
        bottom: 7%;
        background: rgba(244, 114, 182, 0.12);
        animation-delay: 1.2s;
      }

      .ai-formula-wall {
        position: absolute;
        top: 13%;
        z-index: 1;
        width: min(34vw, 560px);
        color: rgba(255, 216, 238, 0.24);
        font-family: "Times New Roman", Georgia, serif;
        text-align: left;
        text-shadow: 0 0 22px rgba(244, 114, 182, 0.22);
        filter: blur(0.25px);
        pointer-events: none;
      }

      .ai-formula-wall-left {
        left: max(28px, 3vw);
      }

      .ai-formula-wall-right {
        right: max(28px, 3vw);
        text-align: right;
      }

      .ai-formula {
        margin: 30px 0;
        font-size: clamp(26px, 2.6vw, 46px);
        line-height: 1.18;
        letter-spacing: 0.015em;
        animation: floatSlow 8s ease-in-out infinite;
      }

      .ai-particles span {
        position: absolute;
        z-index: 1;
        width: 4px;
        height: 4px;
        border-radius: 999px;
        background: rgba(244, 184, 223, 0.6);
        box-shadow: 0 0 16px rgba(244, 114, 182, 0.8);
        animation: floatSlow 6.4s ease-in-out infinite;
      }

      .ai-hero-lines {
        position: absolute;
        inset: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        pointer-events: none;
      }

      .ai-hero-lines path {
        fill: none;
        stroke: rgba(248, 207, 233, 0.26);
        stroke-width: 0.22;
        filter: drop-shadow(0 0 8px rgba(244, 114, 182, 0.22));
      }

      .ai-hero-kicker,
      .ai-hero-title,
      .ai-hero-copy,
      .ai-hero-progress,
      .ai-hero-actions {
        opacity: 0;
        animation: fadeUp 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }

      .ai-hero-kicker {
        letter-spacing: 0.45em;
      }

      .ai-hero-title {
        text-shadow:
          0 0 28px rgba(244, 114, 182, 0.22),
          0 14px 56px rgba(0, 0, 0, 0.55);
      }

      .ai-hero-title-ai {
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(84px, 9vw, 128px);
        font-weight: 700;
        letter-spacing: 0.02em;
        background: linear-gradient(180deg, #fff8ef 0%, #ffd8ee 44%, #d8b4fe 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .ai-hero-title-cn {
        margin-top: -0.08em;
        font-family: "KaiTi", "STKaiti", "Kaiti SC", "楷体", serif;
        font-size: clamp(72px, 8vw, 118px);
        font-weight: 700;
        letter-spacing: 0.05em;
        background: linear-gradient(180deg, #fff7e8 0%, #f8cfe9 54%, #d8b4fe 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .ai-hero-copy {
        font-family: "Songti SC", "STSong", Georgia, serif;
        text-shadow: 0 0 18px rgba(244, 114, 182, 0.16);
      }

      .ai-hero-primary {
        background: linear-gradient(135deg, #c026d3, #ec4899 48%, #fb7185);
        border: 1px solid rgba(255,255,255,0.18);
        box-shadow:
          0 0 34px rgba(236, 72, 153, 0.38),
          0 16px 42px rgba(0, 0, 0, 0.42),
          inset 0 1px 0 rgba(255,255,255,0.24);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        animation: pulseGlow 4.8s ease-in-out infinite;
      }

      .ai-hero-primary:hover {
        transform: translateY(-2px);
        box-shadow:
          0 0 44px rgba(236, 72, 153, 0.52),
          0 18px 48px rgba(0, 0, 0, 0.48),
          inset 0 1px 0 rgba(255,255,255,0.28);
      }

      .ai-hero-secondary {
        background: rgba(12, 8, 24, 0.46);
        border: 1px solid rgba(248, 207, 233, 0.22);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.09);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      }

      .ai-hero-secondary:hover {
        transform: translateY(-2px);
        border-color: rgba(244, 114, 182, 0.62);
        box-shadow: 0 0 28px rgba(168, 85, 247, 0.24), inset 0 1px 0 rgba(255,255,255,0.12);
      }

      .ai-hero-scroll {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        border: 0;
        background: transparent;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.22em;
        cursor: pointer;
        animation: scrollHint 1.9s ease-in-out infinite;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes floatSlow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }

      @keyframes pulseGlow {
        0%, 100% { opacity: 0.82; filter: brightness(1); }
        50% { opacity: 1; filter: brightness(1.12); }
      }

      @keyframes scrollHint {
        0%, 100% { transform: translate(-50%, 0); opacity: 0.58; }
        50% { transform: translate(-50%, 8px); opacity: 0.95; }
      }

      @media (max-width: 767px) {
        .ai-course-hero {
          min-height: 82vh;
        }
        .ai-hero-kicker {
          letter-spacing: 0.22em;
          line-height: 1.8;
        }
        .ai-hero-title-ai {
          font-size: 72px;
        }
        .ai-hero-title-cn {
          font-size: 64px;
        }
        .ai-hero-copy {
          font-size: 17px;
        }
      }
    `}</style>
  )
}

function findNextLesson(curriculum, isCompleted) {
  for (const ch of curriculum.chapters) {
    for (const lesson of ch.lessons) {
      if (!isCompleted(lesson.id)) return lesson
    }
  }
  return curriculum.chapters[0].lessons[0]
}
