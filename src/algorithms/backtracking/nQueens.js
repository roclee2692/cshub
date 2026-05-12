export function nQueens({ n = 8 }) {
  const steps = []
  const queens = [] 
  let solutionCount = 0

  function isValid(row, col) {
    for (let r = 0; r < row; r++) {
      const c = queens[r]
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
        return false
      }
    }
    return true
  }

  function backtrack(row) {
    if (row === n) {
      solutionCount++
      steps.push({
        queens: [...queens],
        row: -1,
        col: -1,
        status: 'solved',
        solutionCount,
        n
      })
      return
    }

    for (let col = 0; col < n; col++) {
      steps.push({
        queens: [...queens],
        row,
        col,
        status: 'trying',
        solutionCount,
        n
      })

      if (isValid(row, col)) {
        steps.push({
          queens: [...queens, col], // temporarily show it there to highlight green
          row,
          col,
          status: 'valid',
          solutionCount,
          n
        })
        
        queens.push(col)
        backtrack(row + 1)
        queens.pop()
        
        steps.push({
          queens: [...queens],
          row,
          col,
          status: 'backtrack',
          solutionCount,
          n
        })
      } else {
        steps.push({
          queens: [...queens],
          row,
          col,
          status: 'invalid',
          solutionCount,
          n
        })
      }
    }
  }

  backtrack(0)
  
  steps.push({
    queens: [],
    row: -1,
    col: -1,
    status: 'finish',
    solutionCount,
    n
  })

  return steps
}