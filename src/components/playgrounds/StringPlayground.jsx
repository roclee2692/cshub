import { useState, useMemo } from 'react'
import StringViz from '../StringViz'
import StepController, { useStepController } from '../StepController'
import { Toolbar, TextInput, Legend } from './shared'

const LEGEND = [
  { color: 'var(--blue)', label: '正在比较 / 指针位置' },
  { color: 'var(--red)', label: '字符不匹配' },
  { color: 'var(--green)', label: '字符匹配' },
  { color: 'var(--purple)', label: 'LPS 辅助指针' },
]

export default function StringPlayground({ algoFn, algoSlug }) {
  const [text, setText] = useState('ABC ABCDAB ABCDABCDABDE')
  const [pattern, setPattern] = useState('ABCDABD')

  const [inputT, setInputT] = useState(text)
  const [inputP, setInputP] = useState(pattern)

  const steps = useMemo(() => algoFn({ text, pattern }), [algoFn, text, pattern])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function applyCustom() {
    if (inputT && inputP) {
      setText(inputT)
      setPattern(inputP)
      ctrl.reset()
    }
  }

  function setExample(t, p) {
    setInputT(t)
    setInputP(p)
    setText(t)
    setPattern(p)
    ctrl.reset()
  }

  return (
    <div>
      <Toolbar>
        <button className="btn" onClick={() => setExample('AABAACAADAABAABA', 'AABA')} style={{ marginRight: 8 }}>
          示例 1
        </button>
        <button className="btn" onClick={() => setExample('THIS IS A TEST TEXT', 'TEST')} style={{ marginRight: 8 }}>
          示例 2
        </button>
        <button className="btn" onClick={() => setExample('AAAAABAAABA', 'AAAA')} style={{ marginRight: 8 }}>
          示例 3
        </button>
        
        <div style={{ flex: 1 }} />
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Text:</span>
          <TextInput value={inputT} onChange={setInputT} placeholder="主串" />
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Pattern:</span>
          <TextInput value={inputP} onChange={setInputP} placeholder="模式串" />
          <button className="btn btn-primary" onClick={applyCustom}>应用</button>
        </div>
      </Toolbar>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginBottom: 16,
        padding: '30px 20px',
        overflowX: 'auto',
        minHeight: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {steps.length > 0 ? (
          <StringViz stepData={current} />
        ) : (
          <div style={{ color: 'var(--text-dim)' }}>请输入有效的主串和模式串</div>
        )}
      </div>

      <Legend items={LEGEND} />

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}
