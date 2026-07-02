// extras 条目完整性抽查(临时)
const m = await import('../src/data/extraAlgorithms.js')
const q = await import('../src/data/quizzes.js')
const quizzes = q.QUIZZES
const bad = []
for (const [slug, a] of Object.entries(m.EXTRA_ALGORITHMS)) {
  if (!a.code?.python || a.code.python.length < 100) bad.push(slug + ':py')
  if (!a.code?.cpp || a.code.cpp.length < 100) bad.push(slug + ':cpp')
  if (!a.intuition || a.intuition.length < 200) bad.push(slug + ':intu')
  if (!quizzes[slug] || quizzes[slug].length !== 3) bad.push(slug + ':quiz')
}
console.log('extras 条目数:', Object.keys(m.EXTRA_ALGORITHMS).length)
console.log(bad.length ? '仍有缺口: ' + bad.join(', ') : '全部达标 OK')
