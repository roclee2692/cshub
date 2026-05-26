// ─────────────────────────────────────────────────────────────
// tones · 语义"音调"配色 token —— 用于 InfoCard / Banner / ErrorBox /
// Toast / Badge 等需要按 tip / info / warning / danger / success 区分的 UI。
//
// 把同一份 TONES 表收拢到这里，避免每个组件文件各自重写一遍同样的
// rgba 色卡。
//
// 用法：
//
//   import { getTone, TONES } from '../../styles/tones'
//
//   function MyAlert({ type = 'info', children }) {
//     const tone = getTone(type)
//     return (
//       <div style={{
//         background: tone.bg,
//         border: `1px solid ${tone.border}`,
//         color: tone.color,
//       }}>
//         <span>{tone.icon}</span>
//         <span>{tone.label}</span>
//         {children}
//       </div>
//     )
//   }
//
// 设计：
// - bg / border / glow / color / icon / label 6 个字段。
// - color 是该 tone 的"主色"（文字、强调线条、light text 等场景）。
// - bg / border / glow 已预降不透明，可直接用作大面积背景而不刺眼。
// ─────────────────────────────────────────────────────────────

export const TONES = {
  tip: {
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.25)',
    glow: 'rgba(52,211,153,0.12)',
    icon: '💡',
    label: '技巧',
    color: '#34d399',
  },
  warning: {
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.25)',
    glow: 'rgba(251,191,36,0.12)',
    icon: '⚠️',
    label: '注意',
    color: '#fbbf24',
  },
  info: {
    bg: 'rgba(96,165,250,0.06)',
    border: 'rgba(96,165,250,0.25)',
    glow: 'rgba(96,165,250,0.12)',
    icon: 'ℹ️',
    label: '说明',
    color: '#60a5fa',
  },
  danger: {
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.25)',
    glow: 'rgba(248,113,113,0.12)',
    icon: '🚨',
    label: '重要',
    color: '#f87171',
  },
  success: {
    bg: 'rgba(52,211,153,0.06)',
    border: 'rgba(52,211,153,0.25)',
    glow: 'rgba(52,211,153,0.12)',
    icon: '✅',
    label: '完成',
    color: '#34d399',
  },
}

/**
 * 根据 type 拿到 tone 对象；未知 type 回退到 info。
 * @param {keyof TONES} type
 * @returns {typeof TONES['info']}
 */
export function getTone(type) {
  return TONES[type] || TONES.info
}
