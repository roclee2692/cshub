// AI 可视化颜色常量
// 与 vizTokens.js 保持一致的 CSS 变量风格

export const AI_COLORS = {
  // 数据点
  dataPoint: 'var(--accent)',
  dataPointAlt: '#f59e0b',

  // 模型
  modelLine: '#8b5cf6',
  modelFill: 'rgba(139, 92, 246, 0.1)',

  // 损失
  lossLine: '#ef4444',
  lossFill: 'rgba(239, 68, 68, 0.08)',

  // 梯度
  gradientArrow: '#f97316',
  gradientPath: '#f97316',

  // 聚类
  clusterColors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'],

  // 神经网络
  nodeActive: '#8b5cf6',
  nodeInactive: 'var(--surface)',
  edgeActive: '#8b5cf6',
  edgeInactive: 'var(--border)',
  weightPositive: '#10b981',
  weightNegative: '#ef4444',

  // 注意力
  attentionHigh: '#ef4444',
  attentionLow: 'rgba(239, 68, 68, 0.05)',

  // 决策边界
  classA: '#8b5cf6',
  classB: '#3b82f6',
  boundary: '#f59e0b',

  // Q-Learning
  stateDefault: 'var(--surface)',
  stateVisited: '#10b981',
  stateCurrent: '#f59e0b',
  stateGoal: '#8b5cf6',
  rewardPositive: '#10b981',
  rewardNegative: '#ef4444',
}

export const AI_LEGEND = {
  regression: [
    { color: AI_COLORS.dataPoint, label: '数据点' },
    { color: AI_COLORS.modelLine, label: '拟合线' },
  ],
  classification: [
    { color: AI_COLORS.classA, label: '类别 A' },
    { color: AI_COLORS.classB, label: '类别 B' },
    { color: AI_COLORS.boundary, label: '决策边界' },
  ],
  clustering: [
    { color: '#8b5cf6', label: '簇 1' },
    { color: '#3b82f6', label: '簇 2' },
    { color: '#10b981', label: '簇 3' },
    { color: '#f59e0b', label: '质心' },
  ],
  neuralNetwork: [
    { color: AI_COLORS.nodeActive, label: '激活节点' },
    { color: AI_COLORS.edgeActive, label: '激活连接' },
    { color: AI_COLORS.weightPositive, label: '正权重' },
    { color: AI_COLORS.weightNegative, label: '负权重' },
  ],
  loss: [
    { color: AI_COLORS.lossLine, label: '损失值' },
    { color: AI_COLORS.gradientPath, label: '优化路径' },
  ],
}
