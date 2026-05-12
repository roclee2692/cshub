import { useState, useMemo } from 'react'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput } from './shared'

export default function LCSPlayground({ algoFn }) {
  const [s1, setS1] = useState('ABCBDAB')
  const [s2, setS2] = useState('BDCABA')
  const [t1, setT1] = useState('ABCBDAB')
  const [t2, setT2] = useState('BDCABA')

  const steps = useMemo(() => algoFn(s1, s2), [algoFn, s1, s2])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function apply() {
    if (t1 && t2 && t1.length <= 10 && t2.length <= 10) {
      setS1(t1); setS2(t2); ctrl.reset()
    }
  }

  function preset(a, b) {
    setS1(a); setS2(b); setT1(a); setT2(b); ctrl.reset()
  }

  const { dp, highlight, matchLine, backtrack = [], result } = current || {}

  function inBacktrack(i, j) {
    return backtrack.some(([bi, bj]) => bi === i && bj === j)
  }

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => preset('ABCBDAB', 'BDCABA')}>经典示例</ToolbarBtn>
        <ToolbarBtn onClick={() => preset('AGGTAB', 'GXTXAYB')}>DNA 示例</ToolbarBtn>
        <ToolbarBtn onClick={() => preset('PROGRAM', 'ALGORITHM')}>单词示例</ToolbarBtn>
        <div style={{ flex: 1 }} />
      </Toolbar>

      <Toolbar>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>s1：</span>
        <TextInput value={t1} onChange={v => setT1(v.toUpperCase())} onSubmit={apply} width={140} submitLabel="" />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>s2：</span>
        <TextInput value={t2} onChange={v => setT2(v.toUpperCase())} onSubmit={apply} width={140} submitLabel="应用" />
      </Toolbar>

      {result !== undefined && (
        <div style={{
          padding: '12px 16px', marginBottom: 16, borderRadius: 8,
          background: 'var(--green-soft)', border: '1px solid rgba(16,185,129,0.3)',
          fontSize: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>当前 LCS</span>
          <span style={{
            fontFamily: 'var(--font-mono)', color: 'var(--text-primary)',
            fontWeight: 700, fontSize: 16, letterSpacing: '0.05em',
          }}>
            {result || '(空)'}
          </span>
        </div>
      )}

      {dp && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 16,
          marginBottom: 16,
          overflowX: 'auto',
        }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 13, fontFamily: 'var(--font-mono)', margin: '0 auto' }}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>∅</th>
                {s2.split('').map((c, j) => (
                  <th key={j} style={{
                    ...thStyle,
                    background: matchLine && matchLine[1] === j ? 'var(--yellow)' : 'var(--surface-2)',
                    color: matchLine && matchLine[1] === j ? '#000' : 'var(--text-secondary)',
                    transition: 'all 0.3s',
                  }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <th style={{
                    ...thStyle,
                    background: matchLine && matchLine[0] === i - 1 ? 'var(--yellow)' : 'var(--surface-2)',
                    color: matchLine && matchLine[0] === i - 1 ? '#000' : 'var(--text-secondary)',
                    transition: 'all 0.3s',
                  }}>{i === 0 ? '∅' : s1[i - 1]}</th>
                  {row.map((val, j) => {
                    const isHL = highlight && highlight[0] === i && highlight[1] === j
                    const isBack = inBacktrack(i, j)
                    let bg = 'transparent', color = 'var(--text-primary)'
                    if (isHL) { bg = 'var(--yellow)'; color = '#000' }
                    else if (isBack) { bg = 'rgba(16,185,129,0.35)' }
                    else if (val > 0) bg = 'rgba(139,92,246,0.12)'
                    return (
                      <td key={j} style={{
                        ...tdStyle, background: bg, color,
                        fontWeight: isHL || isBack ? 700 : 500,
                        transition: 'all 0.25s',
                      }}>{val}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', fontSize: 11, color: 'var(--text-secondary)' }}>
        {[
          { color: 'var(--yellow)', label: '当前格' },
          { color: 'rgba(139,92,246,0.4)', label: 'dp > 0' },
          { color: 'rgba(16,185,129,0.6)', label: '回溯路径' },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}

const thStyle = { padding: '6px 10px', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-secondary)', textAlign: 'center', minWidth: 38, fontWeight: 600 }
const tdStyle = { padding: '6px 10px', border: '1px solid var(--border)', textAlign: 'center', minWidth: 38 }
