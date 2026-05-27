export const AI_CURRICULUM = {
  id: 'ai-masters',
  title: 'AI 专业课',
  instrument: 'ai',
  icon: '🤖',
  color: '#8b5cf6',
  chapters: [
    {
      id: 'optim',
      title: '最优化方法',
      lessons: [
        {
          id: 'optim-gd-variants',
          title: '梯度下降变体对比',
          summary: 'BGD、SGD、Mini-batch 的收敛行为差异',
          theory: `## 梯度下降变体

三种梯度下降的核心区别在于**每步使用多少数据**计算梯度。

| 方法 | 每步数据量 | 梯度质量 | 速度 |
|------|-----------|---------|------|
| BGD | 全部 N 个 | 精确 | 最慢 |
| SGD | 1 个 | 噪声大 | 最快 |
| Mini-batch | B 个 | 折中 | 折中 |

### 更新规则

$$\\theta \\leftarrow \\theta - \\alpha \\nabla L(\\theta)$$

SGD 的噪声反而有好处——能跳出局部最优。
`,
          exercise: { type: 'playground', viz: 'gdVariants' },
        },
        {
          id: 'optim-momentum',
          title: 'Momentum 动量法',
          summary: '物理直觉：小球滚下山坡，积累速度',
          theory: `## Momentum

普通梯度下降像一个无摩擦的小球，每步只看当前梯度。Momentum 加入"惯性"：

$$v_t = \\beta v_{t-1} + \\nabla L(\\theta_t)$$
$$\\theta_{t+1} = \\theta_t - \\alpha v_t$$

### 为什么有效？

- 在一致方向上**加速**（积累动量）
- 在震荡方向上**抑制**（正负梯度互相抵消）
- $\\beta$ 通常取 0.9
`,
          exercise: { type: 'playground', viz: 'momentum' },
        },
        {
          id: 'optim-rmsprop',
          title: 'RMSProp',
          summary: '自适应学习率：梯度大的方向步长小',
          theory: `## RMSProp

RMSProp 为每个参数维护一个**自适应学习率**：

$$s_t = \\beta s_{t-1} + (1-\\beta) g_t^2$$
$$\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{s_t} + \\epsilon} g_t$$

### 直觉

- 梯度一直很大 → $s_t$ 大 → 步长变小（防止冲过头）
- 梯度一直很小 → $s_t$ 小 → 步长变大（加速收敛）
`,
          exercise: { type: 'playground', viz: 'rmsprop' },
        },
        {
          id: 'optim-adam',
          title: 'Adam 优化器',
          summary: '结合 Momentum + RMSProp，最常用的优化器',
          theory: `## Adam (Adaptive Moment Estimation)

Adam 同时维护**一阶矩估计**（动量）和**二阶矩估计**（自适应学习率）：

$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$$
$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$$

偏差修正：
$$\\hat{m}_t = \\frac{m_t}{1-\\beta_1^t}, \\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t}$$

更新：
$$\\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$$

### 默认超参

$\\alpha=0.001, \\beta_1=0.9, \\beta_2=0.999, \\epsilon=10^{-8}$
`,
          exercise: { type: 'playground', viz: 'adam' },
        },
        {
          id: 'optim-lr-compare',
          title: '学习率对比实验',
          summary: '同一出发点，不同学习率的收敛轨迹',
          theory: `## 学习率的重要性

学习率 $\\alpha$ 是最敏感的超参数：

| 学习率 | 效果 |
|--------|------|
| 太小 | 收敛极慢，浪费计算 |
| 适中 | 快速收敛到最优 |
| 太大 | 震荡，可能发散 |
| 极大 | 直接飞出去 |

### 学习率调度

实践中常用衰减策略：
- Step Decay: 每 N 轮乘以 0.1
- Cosine Annealing: 余弦曲线衰减
- Warmup: 先升后降
`,
          exercise: { type: 'playground', viz: 'lrCompare' },
        },
        {
          id: 'optim-newton',
          title: '牛顿法',
          summary: '二阶优化：用 Hessian 矩阵实现二次收敛',
          theory: `## 牛顿法

利用二阶导数信息，收敛速度比梯度下降快得多：

$$\\theta_{t+1} = \\theta_t - H^{-1} \\nabla L(\\theta_t)$$

其中 $H$ 是 Hessian 矩阵（二阶偏导数矩阵）。

### 优缺点

- **优点**: 二次收敛（误差平方级下降）
- **缺点**: 需要计算和存储 $H^{-1}$，$O(n^2)$ 复杂度
- **改进**: 拟牛顿法（BFGS、L-BFGS）用近似 Hessian
`,
          exercise: { type: 'playground', viz: 'newtonMethod' },
        },
        {
          id: 'optim-conjugate-gradient',
          title: '共轭梯度法',
          summary: '求解线性系统，n 步收敛',
          theory: `## 共轭梯度法

用于求解 $Ax = b$ 形式的线性系统，或等价地最小化二次函数：

$$f(x) = \\frac{1}{2} x^T A x - b^T x$$

### 核心思想

选择一组 $A$-共轭方向 $d_0, d_1, \\ldots$，使得在每个方向上只搜索一次。

### 性质

- 最多 $n$ 步精确收敛（$n$ 为维度）
- 每步只需矩阵-向量乘法
- 比最速下降法快得多
`,
          exercise: { type: 'playground', viz: 'conjugateGradient' },
        },
        {
          id: 'optim-line-search',
          title: '线搜索策略',
          summary: '黄金分割法与回溯线搜索',
          theory: `## 线搜索

确定梯度下降的**步长** $\\alpha$：

### 精确线搜索

找到使 $f(\\theta - \\alpha d)$ 最小的 $\\alpha$。

### 黄金分割法

在区间 $[a, b]$ 内用黄金比例 0.618 缩小区间，$O(\\log n)$ 收敛。

### 回溯线搜索（Armijo）

从大步长开始，不断缩小直到满足 Armijo 条件：

$$f(\\theta - \\alpha d) \\leq f(\\theta) - c \\alpha \\nabla f^T d$$

$c$ 通常取 $10^{-4}$。
`,
          exercise: { type: 'playground', viz: 'lineSearch' },
        },
        {
          id: 'optim-ga',
          title: '遗传算法 (GA)',
          summary: '模拟自然选择：选择、交叉、变异',
          theory: `## 遗传算法

受生物进化启发的全局优化算法。

### 流程

1. **初始化**: 随机生成种群
2. **适应度评估**: 计算每个个体的适应度
3. **选择**: 轮盘赌 / 锦标赛选择优秀个体
4. **交叉**: 两个父代交换基因产生子代
5. **变异**: 随机改变部分基因
6. 重复 2-5 直到收敛

### 关键参数

| 参数 | 作用 | 典型值 |
|------|------|--------|
| 种群大小 | 多样性 vs 计算量 | 50-200 |
| 交叉率 | 搜索范围 | 0.7-0.9 |
| 变异率 | 防止早熟收敛 | 0.01-0.1 |
`,
          exercise: { type: 'playground', viz: 'geneticAlgorithm' },
        },
        {
          id: 'optim-pso',
          title: '粒子群优化 (PSO)',
          summary: '模拟鸟群觅食：个体最优 + 全局最优',
          theory: `## 粒子群优化

每个粒子有位置和速度，受两个"吸引力"影响：

$$v_t = w v_{t-1} + c_1 r_1 (p_{best} - x) + c_2 r_2 (g_{best} - x)$$
$$x_{t+1} = x_t + v_t$$

### 直觉

- $w$: 惯性，保持原来方向
- $c_1 r_1 (p_{best} - x)$: 个体记忆，飞向自己历史最优
- $c_2 r_2 (g_{best} - x)$: 社会学习，飞向全局最优

### 参数

$w=0.7, c_1=c_2=1.5$ 是常用起点。
`,
          exercise: { type: 'playground', viz: 'pso' },
        },
        {
          id: 'optim-sa',
          title: '模拟退火 (SA)',
          summary: 'Metropolis 准则：高温探索，低温收敛',
          theory: `## 模拟退火

模拟金属退火过程的随机优化算法。

### 核心：Metropolis 准则

接受更优解总是接受；接受更差解的概率：

$$P = \\exp\\left(-\\frac{\\Delta E}{T}\\right)$$

- $T$ 高 → 大概率接受差解（探索）
- $T$ 低 → 小概率接受差解（收敛）

### 降温策略

$$T_{t+1} = \\alpha T_t, \\quad \\alpha \\in [0.9, 0.99]$$

### 优点

- 能跳出局部最优
- 理论上能收敛到全局最优
- 实现简单
`,
          exercise: { type: 'playground', viz: 'simulatedAnnealing' },
        },
      ],
    },
    {
      id: 'ml',
      title: '机器学习基础',
      lessons: [
        {
          id: 'ml-linear-regression',
          title: '线性回归',
          summary: '最小二乘法、梯度下降求解线性模型参数',
          theory: `## 线性回归

线性回归是最基础的监督学习算法，目标是找到一条直线（或超平面）来拟合数据。

### 模型

$$\\hat{y} = wx + b$$

其中 $w$ 是权重（斜率），$b$ 是偏置（截距）。

### 损失函数（均方误差）

$$L(w, b) = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2$$

### 梯度下降更新规则

$$w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}$$
$$b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}$$

其中 $\\alpha$ 是学习率。

### 关键概念

| 概念 | 说明 |
|------|------|
| 学习率 | 控制每步更新的步长，太大会震荡，太小收敛慢 |
| 迭代次数 | 梯度下降重复更新的次数 |
| 收敛 | 当损失变化足够小时停止迭代 |
`,
          exercise: { type: 'playground', viz: 'linearRegression' },
        },
        {
          id: 'ml-logistic-regression',
          title: '逻辑回归',
          summary: 'Sigmoid 函数、二分类决策边界',
          theory: `## 逻辑回归

逻辑回归虽然名字里有"回归"，实际上是一个**分类算法**，用于二分类问题。

### 模型

$$\\hat{y} = \\sigma(w^T x + b) = \\frac{1}{1 + e^{-(w^T x + b)}}$$

Sigmoid 函数将任意实数映射到 (0, 1) 区间，输出可解释为概率。

### 损失函数（交叉熵）

$$L = -\\frac{1}{n} \\sum_{i=1}^{n} [y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i)]$$

### 决策边界

当 $\\hat{y} \\geq 0.5$ 时预测为正类，即 $w^T x + b \\geq 0$。
`,
          exercise: { type: 'playground', viz: 'logisticRegression' },
        },
        {
          id: 'ml-gradient-descent',
          title: '梯度下降优化器',
          summary: 'BGD、SGD、Mini-batch、Momentum、Adam',
          theory: `## 梯度下降家族

梯度下降是神经网络训练的核心优化算法。

### 变体

| 方法 | 每步使用数据 | 特点 |
|------|-------------|------|
| BGD | 全部数据 | 稳定但慢 |
| SGD | 1 个样本 | 快但噪声大 |
| Mini-batch | 小批量 | 折中方案 |
| Momentum | 加入动量 | 加速收敛 |
| Adam | 自适应学习率 | 最常用 |

### Adam 更新规则

$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t$$
$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2$$
$$\\theta_t = \\theta_{t-1} - \\alpha \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\epsilon}$$
`,
          exercise: { type: 'playground', viz: 'gradientDescent' },
        },
        {
          id: 'ml-knn',
          title: 'K 近邻 (KNN)',
          summary: '距离度量、投票机制、K 值选择',
          theory: `## K 近邻算法

KNN 是一种惰性学习算法，不需要训练过程。

### 算法流程

1. 计算待预测点与所有训练样本的距离
2. 选取距离最近的 K 个邻居
3. 分类：多数投票；回归：取均值

### 距离度量

- **欧氏距离**: $d = \\sqrt{\\sum (x_i - y_i)^2}$
- **曼哈顿距离**: $d = \\sum |x_i - y_i|$
`,
          exercise: { type: 'playground', viz: 'knn' },
        },
        {
          id: 'ml-kmeans',
          title: 'K-Means 聚类',
          summary: '质心迭代、肘部法则、聚类评估',
          theory: `## K-Means 聚类

K-Means 是最经典的无监督聚类算法。

### 算法流程

1. 随机初始化 K 个质心
2. 将每个点分配到最近的质心
3. 重新计算每个簇的质心
4. 重复 2-3 直到收敛

### 评估

- **肘部法则**: 绘制不同 K 值的 WCSS，找拐点
- **轮廓系数**: 衡量簇内紧密度和簇间分离度
`,
          exercise: { type: 'playground', viz: 'kmeans' },
        },
        {
          id: 'ml-decision-tree',
          title: '决策树',
          summary: '信息增益、基尼不纯度、剪枝',
          theory: `## 决策树

决策树通过递归分裂特征空间来构建分类/回归模型。

### 分裂准则

| 准则 | 公式 | 用途 |
|------|------|------|
| 信息增益 | $IG = H(parent) - \\sum \\frac{n_k}{n} H(child_k)$ | ID3 |
| 基尼不纯度 | $Gini = 1 - \\sum p_i^2$ | CART |

### 剪枝

- **预剪枝**: 限制最大深度、最小样本数
- **后剪枝**: 先长满再修剪
`,
          exercise: { type: 'playground', viz: 'decisionTree' },
        },
        {
          id: 'ml-svm',
          title: '支持向量机 (SVM)',
          summary: '最大间隔、核技巧、软间隔',
          theory: `## 支持向量机

SVM 通过找到最大间隔超平面来分类数据。

### 核心概念

- **支持向量**: 离决策边界最近的样本点
- **间隔**: 支持向量到超平面距离的 2 倍
- **核技巧**: 将数据映射到高维空间以处理非线性

### 常用核函数

| 核 | 公式 | 适用场景 |
|-----|------|---------|
| 线性核 | $K(x,y) = x^T y$ | 线性可分 |
| RBF 核 | $K(x,y) = e^{-\\gamma\|x-y\|^2}$ | 通用 |
| 多项式核 | $K(x,y) = (x^T y + c)^d$ | 特定场景 |
`,
          exercise: { type: 'playground', viz: 'svm' },
        },
      ],
    },
    {
      id: 'dl',
      title: '深度学习',
      lessons: [
        {
          id: 'dl-neural-network',
          title: '神经网络基础',
          summary: '感知机、前向传播、反向传播',
          theory: `## 神经网络

神经网络由多层神经元组成，通过前向传播和反向传播学习。

### 前向传播

$$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$$
$$a^{[l]} = g(z^{[l]})$$

### 反向传播

$$dz^{[l]} = da^{[l]} * g'(z^{[l]})$$
$$dW^{[l]} = dz^{[l]} a^{[l-1]T}$$
$$db^{[l]} = dz^{[l]}$$

### 激活函数

| 函数 | 公式 | 特点 |
|------|------|------|
| Sigmoid | $\\sigma(z) = \\frac{1}{1+e^{-z}}$ | 输出 (0,1)，梯度消失 |
| ReLU | $\\max(0, z)$ | 训练快，可能死神经元 |
| Tanh | $\\frac{e^z - e^{-z}}{e^z + e^{-z}}$ | 输出 (-1,1) |
`,
          exercise: { type: 'playground', viz: 'neuralNetwork' },
        },
        {
          id: 'dl-cnn',
          title: '卷积神经网络 (CNN)',
          summary: '卷积层、池化层、特征图',
          theory: `## CNN

卷积神经网络专门处理网格结构数据（如图像）。

### 核心层

- **卷积层**: 用滤波器提取局部特征
- **池化层**: 降维，增强平移不变性
- **全连接层**: 最终分类

### 卷积计算

输出尺寸 = $(N - F + 2P) / S + 1$

其中 N=输入尺寸, F=滤波器尺寸, P=填充, S=步长
`,
          exercise: { type: 'playground', viz: 'cnn' },
        },
        {
          id: 'dl-rnn',
          title: '循环神经网络 (RNN)',
          summary: '序列建模、LSTM、GRU',
          theory: `## RNN

循环神经网络处理序列数据，具有记忆能力。

### LSTM 门控机制

- **遗忘门**: 决定丢弃哪些信息
- **输入门**: 决定存储哪些新信息
- **输出门**: 决定输出哪些信息
`,
          exercise: { type: 'playground', viz: 'rnn' },
        },
      ],
    },
    {
      id: 'nlp',
      title: '自然语言处理',
      lessons: [
        {
          id: 'nlp-word-embedding',
          title: '词嵌入',
          summary: 'Word2Vec、GloVe、词向量空间',
          theory: `## 词嵌入

将离散的词语映射为连续的向量空间。

### Word2Vec

- **CBOW**: 用上下文预测中心词
- **Skip-gram**: 用中心词预测上下文

### 词向量的神奇性质

$$vec("King") - vec("Man") + vec("Woman") \\approx vec("Queen")$$
`,
          exercise: { type: 'playground', viz: 'wordEmbedding' },
        },
        {
          id: 'nlp-attention',
          title: '注意力机制',
          summary: 'Self-Attention、Multi-Head Attention',
          theory: `## 注意力机制

注意力让模型关注输入中最相关的部分。

### Self-Attention

$$Attention(Q, K, V) = softmax(\\frac{QK^T}{\\sqrt{d_k}}) V$$

其中 Q=查询, K=键, V=值
`,
          exercise: { type: 'playground', viz: 'attention' },
        },
        {
          id: 'nlp-transformer',
          title: 'Transformer 架构',
          summary: '编码器-解码器、位置编码、多头注意力',
          theory: `## Transformer

基于注意力机制的序列模型，抛弃了 RNN 的循环结构。

### 核心组件

- Multi-Head Self-Attention
- Position-wise Feed-Forward
- Positional Encoding
- Layer Normalization
`,
          exercise: { type: 'playground', viz: 'transformer' },
        },
      ],
    },
    {
      id: 'cv',
      title: '计算机视觉',
      lessons: [
        {
          id: 'cv-image-classification',
          title: '图像分类',
          summary: '经典网络架构：LeNet、ResNet、VGG',
          theory: `## 图像分类

使用 CNN 对图像进行类别预测。

### 经典架构

| 网络 | 年份 | 创新 |
|------|------|------|
| LeNet | 1998 | 卷积+池化 |
| AlexNet | 2012 | ReLU、Dropout |
| VGG | 2014 | 小卷积核堆叠 |
| ResNet | 2015 | 残差连接 |
`,
          exercise: { type: 'playground', viz: 'imageClassification' },
        },
        {
          id: 'cv-object-detection',
          title: '目标检测',
          summary: 'YOLO、R-CNN、锚框机制',
          theory: `## 目标检测

在图像中定位并分类多个目标。

### 方法分类

- **两阶段**: R-CNN → Fast R-CNN → Faster R-CNN
- **单阶段**: YOLO、SSD
`,
          exercise: { type: 'playground', viz: 'objectDetection' },
        },
      ],
    },
    {
      id: 'rl',
      title: '强化学习',
      lessons: [
        {
          id: 'rl-qlearning',
          title: 'Q-Learning',
          summary: 'Q 表、贝尔曼方程、ε-greedy 策略',
          theory: `## Q-Learning

基于值函数的无模型强化学习算法。

### Q 值更新

$$Q(s, a) \\leftarrow Q(s, a) + \\alpha [r + \\gamma \\max_{a'} Q(s', a') - Q(s, a)]$$

### 关键参数

- $\\alpha$: 学习率
- $\\gamma$: 折扣因子
- $\\epsilon$: 探索率（ε-greedy）
`,
          exercise: { type: 'playground', viz: 'qlearning' },
        },
        {
          id: 'rl-policy-gradient',
          title: '策略梯度',
          summary: 'REINFORCE 算法、Actor-Critic',
          theory: `## 策略梯度

直接优化策略函数，而非值函数。

### REINFORCE

$$\\nabla J(\\theta) = \\mathbb{E}[\\nabla \\log \\pi_\\theta(a|s) \\cdot G_t]$$
`,
          exercise: { type: 'playground', viz: 'policyGradient' },
        },
      ],
    },
    {
      id: 'llm',
      title: '大语言模型',
      lessons: [
        {
          id: 'llm-pretraining',
          title: '预训练与微调',
          summary: '语言模型预训练、SFT、RLHF',
          theory: `## 大模型训练流程

### 三阶段

1. **预训练**: 在海量文本上学习语言知识
2. **SFT (监督微调)**: 用指令数据微调
3. **RLHF**: 通过人类反馈对齐

### 语言模型目标

$$L = -\\sum \\log P(x_t | x_{<t})$$
`,
          exercise: { type: 'playground', viz: 'pretraining' },
        },
        {
          id: 'llm-rag',
          title: 'RAG 检索增强生成',
          summary: '向量数据库、语义检索、上下文注入',
          theory: `## RAG

将外部知识库与 LLM 结合，减少幻觉。

### 流程

1. 文档切片 → Embedding → 向量数据库
2. 用户查询 → 语义检索 → Top-K 相关片段
3. 将片段注入 Prompt → LLM 生成回答
`,
          exercise: { type: 'playground', viz: 'rag' },
        },
        {
          id: 'llm-agent',
          title: 'AI Agent',
          summary: '工具调用、规划、记忆、多智能体协作',
          theory: `## AI Agent

让 LLM 具备自主行动能力。

### 核心能力

- **规划**: 将复杂任务分解为子步骤
- **工具调用**: 使用 API、代码执行等外部工具
- **记忆**: 短期（上下文）和长期（向量存储）记忆
- **反思**: 评估结果并调整策略
`,
          exercise: { type: 'playground', viz: 'agent' },
        },
      ],
    },
  ],
}

// 构建扁平查找表
export const AI_LESSON_MAP = Object.fromEntries(
  AI_CURRICULUM.chapters.flatMap(ch =>
    ch.lessons.map(l => [l.id, l])
  )
)

// 总课节数
export const AI_TOTAL_LESSONS = AI_CURRICULUM.chapters.reduce(
  (sum, ch) => sum + ch.lessons.length, 0
)
