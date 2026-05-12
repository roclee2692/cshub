import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import CodeBlock from './CodeBlock'
import { useStepData } from '../../contexts/StepContext'

const LANGS = [
  { key: 'cpp', label: 'C++', ext: 'cpp' },
  { key: 'python', label: 'Python', ext: 'py' },
]

/**
 * InteractiveVisualization 组件
 * 并排显示动画和代码，让学习者能够同时看到执行过程和对应代码
 * 在小屏幕上自动切换为单列布局
 * 当侧栏折叠时，自动调整并排显示的宽度
 */
export default function InteractiveVisualization({ playground, code, slug, showCode = true }) {
  const [lang, setLang] = useState('cpp')
  const [stackedMode, setStackedMode] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const stepData = useStepData()
  const outletContext = useOutletContext() || {}
  const sidebarCollapsed = outletContext.sidebarCollapsed || false
  
  // 检测屏幕宽度，当侧栏折叠时调整阈值
  useEffect(() => {
    const checkWidth = () => {
      // 侧栏宽度为 248px，折叠时增加 248px 可用空间
      // 当侧栏展开时，更高的阈值触发竖排 (1400px)
      // 当侧栏折叠时，更低的阈值 (1200px)，因为已经有更多空间
      const threshold = sidebarCollapsed ? 1100 : 1400
      setIsNarrow(window.innerWidth < threshold)
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [sidebarCollapsed])
  
  // 从步骤数据中提取代码行号
  let highlightLine = null
  if (stepData?.current && showCode) {
    const current = stepData.current
    if (lang === 'cpp' && current.cppLine) {
      highlightLine = current.cppLine
    } else if (lang === 'python' && current.pythonLine) {
      highlightLine = current.pythonLine
    } else if (current.codeLines && current.codeLines[lang]) {
      highlightLine = current.codeLines[lang]
    }
  }
  
  const shouldStackCode = stackedMode || isNarrow || !showCode
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: !shouldStackCode ? '1fr 1fr' : '1fr',
      gap: 16,
      alignItems: 'start',
    }}>
      {/* 左侧：动画可视化 */}
      <div style={{
        minWidth: 0,
      }}>
        {playground}
      </div>
      
      {/* 右侧：代码 */}
      {showCode && code && (
        <div style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          height: 'fit-content',
          position: shouldStackCode ? 'relative' : 'sticky',
          top: shouldStackCode ? 'auto' : 20,
        }}>
          {/* 代码语言标签 + 布局切换 */}
          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <div style={{
              display: 'flex',
              gap: 2,
              padding: 4,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              width: 'fit-content',
            }}>
              {LANGS.map(l => {
                const active = lang === l.key
                return (
                  <button key={l.key} onClick={() => setLang(l.key)}
                    style={{
                      padding: '6px 18px',
                      fontSize: 12.5,
                      fontWeight: 600,
                      borderRadius: 5,
                      border: 'none',
                      background: active ? 'var(--bg)' : 'transparent',
                      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                      boxShadow: active ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 0.15s',
                      cursor: 'pointer',
                    }}>
                    {l.label}
                  </button>
                )
              })}
            </div>
            
            {/* 布局切换按钮 */}
            {!isNarrow && (
              <button
                onClick={() => setStackedMode(!stackedMode)}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 5,
                  border: '1px solid var(--border)',
                  background: stackedMode ? 'var(--accent-soft)' : 'var(--surface)',
                  color: stackedMode ? 'var(--accent-light)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                title={stackedMode ? '切换到并排显示' : '切换到竖排显示'}
              >
                {stackedMode ? '⬅️ 并排' : '⬇️ 竖排'}
              </button>
            )}
          </div>
          
          {/* 代码块 */}
          <CodeBlock
            code={code[lang]}
            lang={lang}
            title={`${slug}.${LANGS.find(x => x.key === lang).ext}`}
            highlightLine={highlightLine}
            noAutoScroll={false}
          />
        </div>
      )}
    </div>
  )
}
