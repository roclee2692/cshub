import { useState, useMemo } from 'react'
import StepController, { useStepController } from '../StepController'
import { Toolbar, ToolbarBtn, TextInput } from './shared'

const DEFAULT_ITEMS = [
  { weight: 2, value: 6 },
  { weight: 2, value: 10 },
  { weight: 3, value: 12 },
]
const DEFAULT_CAP = 5

export default function KnapsackPlayground({ algoFn }) {
  const [items, setItems] = useState(DEFAULT_ITEMS)
  const [capacity, setCapacity] = useState(DEFAULT_CAP)
  const [itemText, setItemText] = useState(DEFAULT_ITEMS.map(i => `${i.weight},${i.value}`).join(' '))
  const [capText, setCapText] = useState(String(DEFAULT_CAP))

  const steps = useMemo(() => algoFn(items, capacity), [items, capacity, algoFn])
  const ctrl = useStepController(steps)
  const current = steps[ctrl.step]

  function apply() {
    const parsed = itemText.trim().split(/\s+/).map(s => {
      const [w, v] = s.split(',').map(Number)
      return { weight: w, value: v }
    }).filter(i => !isNaN(i.weight) && !isNaN(i.value))
    const cap = parseInt(capText)
    if (parsed.length && cap > 0 && cap <= 20) {
      setItems(parsed); setCapacity(cap); ctrl.reset()
    }
  }

  const { dp, highlight } = current || {}

  return (
    <div>
      <Toolbar>
        <ToolbarBtn onClick={() => {
          setItems(DEFAULT_ITEMS); setCapacity(DEFAULT_CAP)
          setItemText('2,6 2,10 3,12'); setCapText('5'); ctrl.reset()
        }}>示例 1</ToolbarBtn>
        <ToolbarBtn onClick={() => {
          const it = [{weight:1,value:1},{weight:3,value:4},{weight:4,value:5},{weight:5,value:7}]
          setItems(it); setCapacity(7)
          setItemText(it.map(i => `${i.weight},${i.value}`).join(' ')); setCapText('7'); ctrl.reset()
        }}>示例 2</ToolbarBtn>
        <div style={{ flex: 1 }} />
      </Toolbar>

      <Toolbar>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>物品 (重量,价值)：</span>
        <TextInput value={itemText} onChange={setItemText} placeholder="2,6 2,10 3,12"
          onSubmit={apply} width={220} />
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>容量：</span>
        <TextInput value={capText} onChange={setCapText} onSubmit={apply} width={60} submitLabel="应用" />
      </Toolbar>

      <div style={{
        display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '8px 12px', borderRadius: 6,
            background: 'var(--surface)', border: '1px solid var(--border)',
            fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ color: 'var(--text-tertiary)' }}>物品{i + 1}</span>{' '}
            <span style={{ color: 'var(--blue)' }}>w={item.weight}</span>{' '}
            <span style={{ color: 'var(--green)' }}>v={item.value}</span>
          </div>
        ))}
      </div>

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
                <th style={thStyle}>i\w</th>
                {Array.from({ length: capacity + 1 }, (_, w) => (
                  <th key={w} style={thStyle}>{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dp.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, color: 'var(--accent-light)', fontWeight: 600 }}>
                    {i === 0 ? '∅' : `物品${i}`}
                  </td>
                  {row.map((val, w) => {
                    const isHL = highlight && highlight[0] === i && highlight[1] === w
                    return (
                      <td key={w} style={{
                        ...tdStyle,
                        background: isHL ? 'var(--yellow)' : val > 0 ? 'rgba(139,92,246,0.15)' : 'transparent',
                        color: isHL ? '#000' : 'var(--text-primary)',
                        fontWeight: isHL ? 700 : 500,
                        transition: 'background 0.3s, color 0.3s',
                      }}>{val}</td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StepController total={steps.length} step={ctrl.step} playing={ctrl.playing}
        speed={ctrl.speed} setSpeed={ctrl.setSpeed}
        play={ctrl.play} stop={ctrl.stop} prev={ctrl.prev} goNext={ctrl.goNext} reset={ctrl.reset} seek={ctrl.seek}
        description={current?.description} />
    </div>
  )
}

const thStyle = { padding: '6px 10px', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-secondary)', textAlign: 'center', minWidth: 38, fontWeight: 600 }
const tdStyle = { padding: '6px 10px', border: '1px solid var(--border)', textAlign: 'center', minWidth: 38 }
