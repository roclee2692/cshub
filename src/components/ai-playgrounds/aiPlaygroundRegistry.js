// AI Playground 注册表 · viz key → Playground lazy loader
// 仿照 src/components/learning/playgroundRegistry.js 的模式

let modules
try {
  modules = import.meta.glob('./*Playground.jsx')
} catch {
  modules = null
}

const byName = modules
  ? Object.fromEntries(
      Object.entries(modules).map(([p, loader]) => {
        const name = p.split('/').pop().replace('.jsx', '')
        return [name, loader]
      })
    )
  : null

const stubCache = new Map()
function lookup(name) {
  if (byName) return byName[name] || null
  if (!stubCache.has(name)) {
    stubCache.set(name, () => Promise.resolve({ default: () => null }))
  }
  return stubCache.get(name)
}

export const AI_VIZ_TO_NAME = {
  // 最优化
  gdVariants: 'GDVariants',
  momentum: 'Momentum',
  rmsprop: 'RMSProp',
  adam: 'Adam',
  lrCompare: 'LRCompare',
  newtonMethod: 'NewtonMethod',
  conjugateGradient: 'ConjugateGradient',
  lineSearch: 'LineSearch',
  geneticAlgorithm: 'GeneticAlgorithm',
  pso: 'PSO',
  simulatedAnnealing: 'SimulatedAnnealing',
  // ML
  linearRegression: 'LinearRegression',
  logisticRegression: 'LogisticRegression',
  gradientDescent: 'GradientDescent',
  knn: 'KNN',
  kmeans: 'KMeans',
  decisionTree: 'DecisionTree',
  svm: 'SVM',
  // DL
  neuralNetwork: 'NeuralNetwork',
  cnn: 'CNN',
  rnn: 'RNN',
  // NLP
  wordEmbedding: 'WordEmbedding',
  attention: 'Attention',
  transformer: 'Transformer',
  // CV
  imageClassification: 'ImageClassification',
  objectDetection: 'ObjectDetection',
  // RL
  qlearning: 'QLearning',
  policyGradient: 'PolicyGradient',
  // LLM
  pretraining: 'Pretraining',
  rag: 'RAG',
  agent: 'Agent',
}

export const AI_PLAYGROUND_LOADERS = Object.fromEntries(
  Object.entries(AI_VIZ_TO_NAME).map(([viz, name]) => [viz, lookup(`${name}Playground`)])
)

export function getAIPlaygroundLoader(viz) {
  return AI_PLAYGROUND_LOADERS[viz] || null
}
