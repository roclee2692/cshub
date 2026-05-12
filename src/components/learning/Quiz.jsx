import { useState } from 'react'

export default function Quiz({ questions }) {
  const [answers, setAnswers] = useState({})   // index → chosen option index
  const [revealed, setRevealed] = useState({}) // index → bool
  const [allDone, setAllDone] = useState(false)

  if (!questions || questions.length === 0) return null

  const handlePick = (qi, oi) => {
    if (revealed[qi]) return
    setAnswers(a => ({ ...a, [qi]: oi }))
  }

  const handleCheck = (qi) => {
    if (answers[qi] === undefined) return
    setRevealed(r => ({ ...r, [qi]: true }))
    const newRevealed = { ...revealed, [qi]: true }
    if (Object.keys(newRevealed).length === questions.length) setAllDone(true)
  }

  const handleReset = () => {
    setAnswers({})
    setRevealed({})
    setAllDone(false)
  }

  const score = allDone
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const isRevealed = revealed[qi]
        const correct = q.answer

        return (
          <div key={qi} style={{
            padding: '18px 20px',
            background: 'var(--bg-elev)',
            border: `1px solid ${isRevealed
              ? (chosen === correct ? 'var(--green)' : 'var(--red)')
              : 'var(--border)'}`,
            borderRadius: 10,
            transition: 'border-color 0.2s',
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600, marginBottom: 14,
              color: 'var(--text-primary)', lineHeight: 1.5,
              display: 'flex', gap: 10,
            }}>
              <span style={{
                flexShrink: 0, width: 22, height: 22,
                background: 'var(--accent-soft)', color: 'var(--accent-light)',
                borderRadius: 5, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700,
              }}>
                {qi + 1}
              </span>
              <span>{q.q}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {q.options.map((opt, oi) => {
                let bg = 'var(--surface)'
                let border = 'var(--border)'
                let color = 'var(--text-secondary)'
                let icon = null

                if (isRevealed) {
                  if (oi === correct) {
                    bg = 'var(--green-soft)'; border = 'var(--green)'; color = 'var(--green)'
                    icon = '✓'
                  } else if (oi === chosen && chosen !== correct) {
                    bg = 'var(--red-soft)'; border = 'var(--red)'; color = 'var(--red)'
                    icon = '✗'
                  } else {
                    color = 'var(--text-tertiary)'
                  }
                } else if (oi === chosen) {
                  bg = 'var(--accent-soft)'; border = 'var(--accent)'; color = 'var(--accent-light)'
                }

                return (
                  <button key={oi} onClick={() => handlePick(qi, oi)}
                    disabled={isRevealed}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px',
                      background: bg,
                      border: `1px solid ${border}`,
                      borderRadius: 6,
                      fontSize: 12.5,
                      color,
                      textAlign: 'left',
                      cursor: isRevealed ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      opacity: isRevealed && oi !== correct && oi !== chosen ? 0.5 : 1,
                    }}>
                    <span style={{
                      flexShrink: 0, width: 20, height: 20, borderRadius: 4,
                      background: oi === chosen || (isRevealed && oi === correct)
                        ? border : 'var(--surface-2)',
                      border: `1px solid ${oi === chosen ? border : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: oi === chosen || (isRevealed && oi === correct) ? 'white' : 'transparent',
                    }}>
                      {icon || (oi === chosen ? '●' : '')}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                )
              })}
            </div>

            {!isRevealed ? (
              <button onClick={() => handleCheck(qi)}
                disabled={chosen === undefined}
                style={{
                  fontSize: 12, fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 5,
                  background: chosen !== undefined ? 'var(--accent)' : 'var(--surface-2)',
                  color: chosen !== undefined ? 'white' : 'var(--text-tertiary)',
                  border: 'none',
                  transition: 'all 0.15s',
                }}>
                确认答案
              </button>
            ) : (
              <div style={{
                fontSize: 12.5, fontWeight: 500,
                color: chosen === correct ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {chosen === correct ? '✓ 回答正确！' : `✗ 正确答案是：${q.options[correct]}`}
              </div>
            )}
          </div>
        )
      })}

      {allDone && (
        <div style={{
          padding: '16px 20px',
          background: score === questions.length ? 'var(--green-soft)' : 'var(--accent-soft)',
          border: `1px solid ${score === questions.length ? 'var(--green)' : 'var(--accent-border)'}`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
              {score === questions.length ? '全部答对！🎉' : `答对 ${score} / ${questions.length}`}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {score === questions.length
                ? '你已掌握这个算法的核心知识点。'
                : '建议再复习一遍算法原理后重新挑战。'}
            </div>
          </div>
          <button onClick={handleReset} style={{
            fontSize: 12, fontWeight: 600,
            padding: '7px 16px',
            borderRadius: 6,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}>重新答题</button>
        </div>
      )}
    </div>
  )
}
