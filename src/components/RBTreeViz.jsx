// RBTreeViz — 红黑树可视化
// 现在是 SvgTreeViz 的轻量包装，仅传入红黑树专用的颜色策略。
import SvgTreeViz, { RB_NODE_STYLE } from './svg/SvgTreeViz'

export default function RBTreeViz({ stepData }) {
  return (
    <SvgTreeViz
      stepData={stepData}
      getNodeStyle={RB_NODE_STYLE}
      pad={50}
      minH={240}
      transition="0.5s"
    />
  )
}
