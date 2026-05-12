import React from 'react'

export default function StringViz({ stepData }) {
  if (!stepData) return null

  const {
    text,
    pattern,
    textIdx,
    patternIdx,
    shift,
    status,
    lps,
    lpsI,
    lpsLen
  } = stepData

  // For KMP lps building phase
  const isBuildingLPS = status && status.includes('lps')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
      
      {/* LPS Array visualization if KMP && LPS array exists */}
      {lps && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ marginBottom: 8, color: 'var(--text-dim)' }}>Next (LPS) 数组</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {pattern.split('').map((char, i) => {
              let bg = 'var(--surface-sunken)'
              let border = '1px solid var(--border)'
              if (isBuildingLPS) {
                if (i === lpsI) {
                  border = '2px solid var(--blue)'
                  bg = 'var(--blue-light)'
                } else if (i === lpsLen && status !== 'lps_complete') {
                  border = '2px solid var(--purple)'
                  bg = 'var(--purple-light)'
                }
              }

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>{char}</div>
                  <div style={{
                    width: 32, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: bg, border, borderRadius: 4,
                    fontWeight: 600
                  }}>
                    {lps[i]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Text visualization */}
      {!isBuildingLPS && text && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, width: '100%' }}>
          {text.split('').map((char, i) => {
            let bg = 'var(--surface-sunken)'
            let border = '1px solid var(--border)'
            let color = 'var(--text)'

            if (i === textIdx) {
              if (status === 'match' || status === 'comparing') {
                border = '2px solid var(--blue)'
                bg = 'var(--blue-light)'
              } else if (status === 'mismatch') {
                border = '2px solid var(--red)'
                bg = 'var(--red-light)'
              }
            } else if (shift !== undefined && shift !== -1 && i >= shift && i < shift + pattern.length) {
              // Highlight matched prefix or matched portion
              if (status === 'match') {
                border = '2px solid var(--green)'
                bg = 'var(--green-light)'
              }
            }

            return (
              <div key={i} style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>{i}</div>
                <div style={{
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: bg, border, borderRadius: 6,
                  color, fontSize: 18, fontWeight: 600
                }}>
                  {char}
                </div>
                {i === textIdx && (
                  <div style={{ position: 'absolute', bottom: -20, fontSize: 12, color: 'var(--blue)' }}>
                    ↑ i
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pattern visualization */}
      {!isBuildingLPS && pattern && text && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-start', 
          gap: 4, 
          width: text.length * 44, // rough width
          position: 'relative',
          paddingLeft: shift !== -1 && shift !== undefined ? shift * 44 : 0,
          transition: 'padding-left 0.3s'
        }}>
          {pattern.split('').map((char, j) => {
            let bg = 'var(--surface-sunken)'
            let border = '1px solid var(--border)'
            
            if (status === 'match') {
              border = '2px solid var(--green)'
              bg = 'var(--green-light)'
            } else if (j === patternIdx) {
              if (status === 'mismatch') {
                border = '2px solid var(--red)'
                bg = 'var(--red-light)'
              } else {
                border = '2px solid var(--blue)'
                bg = 'var(--blue-light)'
              }
            } else if (j < patternIdx) {
              border = '2px solid var(--green)'
            }

            return (
              <div key={j} style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                <div style={{
                  width: 40, height: 40,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: bg, border, borderRadius: 6,
                  fontSize: 18, fontWeight: 600
                }}>
                  {char}
                </div>
                {j === patternIdx && (
                  <div style={{ position: 'absolute', bottom: -20, fontSize: 12, color: 'var(--blue)' }}>
                    ↑ j
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 22 }}>{j}</div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
