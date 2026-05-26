import { lazy, memo, Suspense } from 'react'
import { PLAYGROUND_LOADERS } from './playgroundRegistry'

// 模块级常量：lazy 对象在模块加载后稳定，不随渲染重建
const PLAYGROUND_COMPONENTS = Object.fromEntries(
  Object.entries(PLAYGROUND_LOADERS).map(([viz, loader]) => [viz, lazy(loader)])
)

function PlaygroundFallback() {
  return <div style={{ minHeight: 260 }} aria-busy="true" />
}

// memo：algo 对象引用稳定（slug 不变时不会重建），主题切换不应重渲染此组件
// Playground 内部使用 CSS 变量处理主题颜色，不读取 React theme context
const PlaygroundFor = memo(function PlaygroundFor({ algo }) {
  const Playground = PLAYGROUND_COMPONENTS[algo.viz]
  const props = { algoFn: algo.fn, algoSlug: algo.slug, viz: algo.viz }

  if (!Playground) {
    return <div>Unknown visualization type: {algo.viz}</div>
  }

  return (
    <Suspense fallback={<PlaygroundFallback />}>
      <Playground {...props} />
    </Suspense>
  )
})

export default PlaygroundFor
