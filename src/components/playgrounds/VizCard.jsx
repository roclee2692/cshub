// ─────────────────────────────────────────────────────────────
// VizCard · Playground 内可视化区域的标准容器
//
// 消除了 SortingPlayground、KnapsackPlayground 等大量 Playground 中
// 重复书写的下列片段：
//
//   <div style={{
//     background: 'var(--surface)',
//     border: '1px solid var(--border)',
//     borderRadius: '16px',
//     marginBottom: 16,
//     overflow: 'hidden',
//   }}>
//     <div style={{ padding: '24px 12px', overflowX: 'auto', overflowY: 'hidden' }}>
//       <SomeVizComponent />
//     </div>
//   </div>
//
// 使用示例：
//
//   import VizCard from './VizCard'
//
//   <VizCard>
//     <SortingViz stepData={current} maxVal={maxVal} />
//   </VizCard>
//
//   // 紧凑内边距（适合 SVG 已内置 padding 的场景）
//   <VizCard padding="12px 0">
//     <GraphViz graph={graph} stepData={current} />
//   </VizCard>
//
//   // 无外边距（紧接 toolbar 时）
//   <VizCard marginBottom={0}>
//     ...
//   </VizCard>
// ─────────────────────────────────────────────────────────────

/**
 * VizCard — Playground 可视化区域标准包装容器。
 *
 * Props：
 *   padding      — 内层滚动区的 CSS padding（默认 '24px 12px'）
 *   marginBottom — 外层 div 的 margin-bottom（默认 16）
 *   borderRadius — 外层 div 的圆角（默认 16）
 *   overflowX    — 内层 X 方向溢出处理（默认 'auto'；SVG 已 viewBox 时可改 'hidden'）
 *   minHeight    — 内层最小高度（默认 undefined）
 *   noInner      — 不渲染内层 padding/overflow 包装（外层直接挂 children；适合内部已有自己布局的 Viz）
 *   style        — 外层 div 额外样式覆盖
 *   innerStyle   — 内层 div 额外样式覆盖
 *   children     — 可视化内容（通常是 SVG 组件或 Canvas）
 */
export default function VizCard({
  children,
  padding = '24px 12px',
  marginBottom = 16,
  borderRadius = 16,
  overflowX = 'auto',
  minHeight,
  noInner = false,
  style,
  innerStyle,
}) {
  const outer = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius,
    marginBottom,
    ...style,
  }

  // noInner 模式：外层直接渲染 children，自身承担 padding + 滚动行为
  if (noInner) {
    return (
      <div style={{
        ...outer,
        padding,
        minHeight,
        overflowX,
        overflowY: 'hidden',
      }}>
        {children}
      </div>
    )
  }

  // 默认模式：外层 overflow: hidden 保证圆角；内层 padding + overflowX
  return (
    <div style={{ ...outer, overflow: 'hidden' }}>
      <div
        style={{
          padding,
          overflowX,
          overflowY: 'hidden',
          minHeight,
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  )
}
