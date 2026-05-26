// TreeViz — 通用 BST / AVL / Treap 可视化
// 现在是 SvgTreeViz 的轻量包装，仅保留向后兼容的组件名。
import SvgTreeViz, { DEFAULT_NODE_STYLE } from './svg/SvgTreeViz'

export default function TreeViz({ stepData }) {
  return (
    <SvgTreeViz
      stepData={stepData}
      getNodeStyle={DEFAULT_NODE_STYLE}
      pad={40}
      minH={200}
      transition="0.4s"
    />
  )
}
