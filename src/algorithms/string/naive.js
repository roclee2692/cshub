export function naivePatternMatching({ text, pattern }) {
  const steps = []
  const n = text.length
  const m = pattern.length

  if (m === 0) {
    return steps
  }

  for (let s = 0; s <= n - m; s++) {
    let match = true
    let j = 0
    for (j = 0; j < m; j++) {
      steps.push({
        text,
        pattern,
        textIdx: s + j,
        patternIdx: j,
        shift: s,
        status: 'comparing',
        description: `Compare text[${s + j}] ('${text[s + j]}') with pattern[${j}] ('${pattern[j]}')`
      })

      if (text[s + j] !== pattern[j]) {
        steps.push({
          text,
          pattern,
          textIdx: s + j,
          patternIdx: j,
          shift: s,
          status: 'mismatch',
          description: `Mismatch at position ${j}. Shift pattern by 1.`
        })
        match = false
        break
      }
    }

    if (match) {
      steps.push({
        text,
        pattern,
        textIdx: s + m - 1,
        patternIdx: m - 1,
        shift: s,
        status: 'match',
        description: `Pattern found at shift ${s}!`
      })
      // If we only want the first match, we can break or continue
      // we can continue to find all matches
    }
  }

  steps.push({
    text,
    pattern,
    textIdx: -1,
    patternIdx: -1,
    shift: -1,
    status: 'complete',
    description: 'String matching complete.'
  })

  return steps
}
