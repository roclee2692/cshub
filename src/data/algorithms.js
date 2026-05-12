import { bubbleSort } from '../algorithms/sorting/bubbleSort'
import { insertionSort } from '../algorithms/sorting/insertionSort'
import { selectionSort } from '../algorithms/sorting/selectionSort'
import { shellSort } from '../algorithms/sorting/shellSort'
import { countingSort } from '../algorithms/sorting/countingSort'
import { quickSort } from '../algorithms/sorting/quickSort'
import { mergeSort } from '../algorithms/sorting/mergeSort'
import { heapSort } from '../algorithms/sorting/heapSort'
import { bfs } from '../algorithms/graph/bfs'
import { dfs } from '../algorithms/graph/dfs'
import { dijkstra } from '../algorithms/graph/dijkstra'
import { bellmanFord } from '../algorithms/graph/bellmanFord'
import { floydWarshall } from '../algorithms/graph/floydWarshall'
import { topoSort } from '../algorithms/graph/topoSort'
import { prim } from '../algorithms/graph/prim'
import { kruskal } from '../algorithms/graph/kruskal'
import { bstInsertSequence } from '../algorithms/tree/bst'
import { rbInsertSequence } from '../algorithms/tree/redBlack'
import { avlInsertSequence } from '../algorithms/tree/avl'
import { treapInsertSequence } from '../algorithms/tree/treap'
import { knapsack01 } from '../algorithms/dp/knapsack'
import { lcs } from '../algorithms/dp/lcs'
import { lis } from '../algorithms/dp/lis'
import { fifo } from '../algorithms/pageReplacement/fifo'
import { lru } from '../algorithms/pageReplacement/lru'
import { opt } from '../algorithms/pageReplacement/opt'
import { naivePatternMatching } from '../algorithms/string/naive'
import { kmp } from '../algorithms/string/kmp'
import { nQueens } from '../algorithms/backtracking/nQueens'
import { fcfs as diskFcfs } from '../algorithms/disk/fcfs'
import { sstf as diskSstf } from '../algorithms/disk/sstf'
import { scan as diskScan } from '../algorithms/disk/scan'
import { unionFind } from '../algorithms/dataStructures/unionFind'
import { trieOps } from '../algorithms/dataStructures/trie'
import { linkedListOps } from '../algorithms/dataStructures/linkedList'
import { aStar } from '../algorithms/graph/aStar'
import { hashTable } from '../algorithms/dataStructures/hashTable'
import { segTree } from '../algorithms/dataStructures/segTree'

export const CATEGORIES = {
  sorting: { name: '排序算法', icon: '📊', color: '#8b5cf6', desc: '将数据按某种规则排列' },
  graph:   { name: '图算法',   icon: '🗺️', color: '#3b82f6', desc: '在节点和边构成的图上求解' },
  tree:    { name: '树结构',   icon: '🌳', color: '#10b981', desc: '层级数据的高效组织' },
  dp:      { name: '动态规划', icon: '🧩', color: '#f59e0b', desc: '将问题分解为重叠子问题' },
  backtracking: { name: '回溯算法', icon: '🔙', color: '#dc2626', desc: '通过穷举搜索解决决策问题' },
  pageReplacement: { name: '页面置换', icon: '🗂️', color: '#ec4899', desc: '操作系统的内存分页管理算法' },
  diskScheduling:  { name: '磁盘调度', icon: '💽', color: '#8b5cf6', desc: '操作系统的磁盘寻道管理' },
  string:  { name: '字符串匹配', icon: '📝', color: '#14b8a6', desc: '在文本中查找子串模式' },
  dataStructures: { name: '数据结构', icon: '🗄️', color: '#6366f1', desc: '高效组织和操作数据的基本结构' },
}

export const ALGORITHMS = {
  bubblesort: {
    slug: 'bubblesort',
    name: '冒泡排序',
    nameEn: 'Bubble Sort',
    category: 'sorting',
    difficulty: '基础',
    fn: bubbleSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: '相邻元素两两比较，每轮把当前最大值"冒泡"到末尾。',
    intuition: `想象一杯汽水中的气泡：较大的气泡会从底部"冒泡"上升到顶部。冒泡排序的工作方式与此类似——每一轮遍历都会将当前未排序部分的最大元素"冒泡"到末尾。

核心思想是：通过比较相邻元素并交换错误顺序的对，使得每一轮遍历后至少有一个元素到达最终位置。

虽然时间复杂度较高，但它实现简单、稳定，且在数组接近有序时可以通过提前终止（一轮无交换则停止）退化为 O(n)。`,
    pseudocode: `procedure bubbleSort(A):
    n ← length(A)
    repeat:
        swapped ← false
        for i from 0 to n-2:
            if A[i] > A[i+1]:
                swap(A[i], A[i+1])
                swapped ← true
        n ← n - 1
    until not swapped`,
    code: {
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // 已经有序，提前结束
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # 已经有序，提前结束
    return arr`,
    },
    applications: [
      '教学场景：演示比较排序最直观的算法',
      '小规模数据排序（n < 50）',
      '近乎有序的数据（提前终止优化使其接近 O(n)）',
    ],
  },

  selectionsort: {
    slug: 'selectionsort',
    name: '选择排序',
    nameEn: 'Selection Sort',
    category: 'sorting',
    difficulty: '基础',
    fn: selectionSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: '每轮在剩余部分选出最小值，与当前位置交换。',
    intuition: `选择排序的思路非常直白：每一轮从未排序部分选出最小值，放到已排序部分的末尾。

具体来说，第 i 轮在 [i..n-1] 中扫描找到最小元素的位置，然后与 arr[i] 交换。这样每一轮固定一个元素的最终位置，n-1 轮后整个数组有序。

它的特点是**交换次数极少**（最多 n-1 次），但**比较次数固定**为 O(n²)，无论输入是否有序——这是它与冒泡排序最大的区别。

由于交换时可能跨越相等元素，选择排序是不稳定的。例如 [5a, 5b, 3]，第一轮 5a 与 3 交换，结果 5a 跑到了 5b 的右侧。`,
    pseudocode: `procedure selectionSort(A):
    n ← length(A)
    for i from 0 to n-2:
        minIdx ← i
        for j from i+1 to n-1:
            if A[j] < A[minIdx]:
                minIdx ← j
        if minIdx ≠ i:
            swap(A[i], A[minIdx])`,
    code: {
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    },
    applications: [
      '交换成本远高于比较成本的场景（如外存元素移动昂贵）',
      '小规模数据 + 想要最少写入次数的场景',
      '教学：演示"每轮固定一个元素"的思想',
    ],
  },

  shellsort: {
    slug: 'shellsort',
    name: '希尔排序',
    nameEn: 'Shell Sort',
    category: 'sorting',
    difficulty: '中等',
    fn: shellSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n^1.3)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: '以递减的 gap 序列做多轮插入排序，使数组逐渐接近有序。',
    intuition: `希尔排序是插入排序的改进版，核心思想是"让离最终位置很远的元素能快速移动"。

普通插入排序每次只能移动相邻元素，如果一个很小的元素在最右端，需要 n-1 步才能到头部。希尔排序用一个递减的 gap 序列（如 Knuth 序列：1, 4, 13, 40, …）解决了这个问题：

- 第一轮用大 gap（如 13），让每个元素与 13 步之外的元素比较并交换——大跳步移动，快速将元素移到大致正确的区域。
- 逐步缩小 gap，每轮做一次 gap-插入排序，让数组越来越有序。
- 最后一轮 gap=1，就是普通插入排序，但此时数组已接近有序，几乎不需要移动，非常快。

复杂度取决于 gap 序列的选取，Knuth 序列在实践中约为 O(n^1.3)，比普通插入排序 O(n²) 好很多，同时保持原地、无需额外空间。`,
    pseudocode: `procedure shellSort(A):
    gap ← 1
    while gap < length(A)/3: gap ← gap*3 + 1  // Knuth sequence
    while gap ≥ 1:
        for i from gap to length(A)-1:
            key ← A[i]
            j ← i
            while j ≥ gap and A[j-gap] > key:
                A[j] ← A[j-gap]
                j ← j - gap
            A[j] ← key
        gap ← ⌊gap/3⌋`,
    code: {
      cpp: `void shellSort(vector<int>& arr) {
    int n = arr.size();
    int gap = 1;
    while (gap < n / 3) gap = gap * 3 + 1;  // Knuth sequence

    while (gap >= 1) {
        for (int i = gap; i < n; i++) {
            int key = arr[i];
            int j = i;
            while (j >= gap && arr[j - gap] > key) {
                arr[j] = arr[j - gap];
                j -= gap;
            }
            arr[j] = key;
        }
        gap /= 3;
    }
}`,
      python: `def shell_sort(arr):
    n = len(arr)
    gap = 1
    while gap < n // 3:
        gap = gap * 3 + 1  # Knuth sequence

    while gap >= 1:
        for i in range(gap, n):
            key = arr[i]
            j = i
            while j >= gap and arr[j - gap] > key:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = key
        gap //= 3
    return arr`,
    },
    applications: [
      '嵌入式系统：内存极度受限时的排序',
      'Introsort 的小数组后备（替换插入排序）',
      '链表不方便随机访问时，希尔排序比归并更实用',
      '了解"gap 序列影响复杂度"的最直观案例',
    ],
  },

  insertionsort: {
    slug: 'insertionsort',
    name: '插入排序',
    nameEn: 'Insertion Sort',
    category: 'sorting',
    difficulty: '基础',
    fn: insertionSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
    description: '把元素一个一个插入到左侧已排序区的正确位置。',
    intuition: `想象你在打扑克牌，左手抓到的牌按顺序排好，每抓到一张新牌就插到合适的位置。插入排序的思路就是这样。

把数组的左半部分视为"已排序手牌"（最初只有 arr[0]），然后从 arr[1] 开始，依次取出每个元素 key，与已排序部分从右往左比较：比 key 大的元素都向右移动一位，直到找到 key 的合适位置插入。

它在**接近有序**的数组上极快——每次插入只需移动很少元素，最好情况 O(n)。这一优势让它成为许多复杂排序的"小数组优化"分支：例如 Timsort、introsort 在子数组小于一定阈值时切换到插入排序。

它是**稳定**的：相等元素不会跨越彼此，因为只在 A[j] > key 时才后移。`,
    pseudocode: `procedure insertionSort(A):
    n ← length(A)
    for i from 1 to n-1:
        key ← A[i]
        j ← i - 1
        while j ≥ 0 and A[j] > key:
            A[j+1] ← A[j]
            j ← j - 1
        A[j+1] ← key`,
    code: {
      cpp: `void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    },
    applications: [
      '小规模或近乎有序的数据（最好 O(n)）',
      'Timsort、introsort 等混合排序的小数组优化',
      '在线排序：流式接收数据并保持有序',
      '链表排序（向已排序前缀插入只需 O(1) 移动）',
    ],
  },

  countingsort: {
    slug: 'countingsort',
    name: '计数排序',
    nameEn: 'Counting Sort',
    category: 'sorting',
    difficulty: '基础',
    fn: countingSort,
    viz: 'counting',
    timeComplexity: { best: 'O(n+k)', average: 'O(n+k)', worst: 'O(n+k)' },
    spaceComplexity: 'O(n+k)',
    stable: true,
    inPlace: false,
    description: '计数每个值出现次数，再用前缀和确定每个元素的输出位置。',
    intuition: `计数排序不基于比较，因此可以突破 O(n log n) 下界，达到线性时间 O(n+k)（k 为值域范围）。

三步走：
1. **计数**：遍历输入，对每个值 v，counts[v]++。时间 O(n)。
2. **前缀和**：counts[i] += counts[i-1]，将计数数组变为"位置数组"——counts[v] 表示值 ≤ v 的元素共有多少个，也就是最后一个值为 v 的元素在输出中的（右边界）位置。时间 O(k)。
3. **反向填充**（保证稳定性）：从右向左遍历输入，对元素 v，放到 output[counts[v]-1]，然后 counts[v]--。时间 O(n)。

关键限制：值域 k 不能太大，否则 O(k) 的空间开销不划算。整数值域适合；浮点数或字符串不适合直接用。`,
    pseudocode: `procedure countingSort(A, maxVal):
    counts ← array of 0 with size maxVal+1
    // Step 1: count
    for each v in A: counts[v]++
    // Step 2: prefix sum
    for i from 1 to maxVal: counts[i] += counts[i-1]
    // Step 3: output (reverse for stability)
    output ← array of size n
    for i from n-1 down to 0:
        output[counts[A[i]]-1] ← A[i]
        counts[A[i]]--
    copy output back to A`,
    code: {
      cpp: `void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int maxVal = *max_element(arr.begin(), arr.end());
    vector<int> counts(maxVal + 1, 0);

    // Step 1: count
    for (int v : arr) counts[v]++;

    // Step 2: prefix sum
    for (int i = 1; i <= maxVal; i++) counts[i] += counts[i - 1];

    // Step 3: fill output (reverse for stability)
    vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[--counts[arr[i]]] = arr[i];
    }
    arr = output;
}`,
      python: `def counting_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    counts = [0] * (max_val + 1)

    # Step 1: count
    for v in arr:
        counts[v] += 1

    # Step 2: prefix sum
    for i in range(1, max_val + 1):
        counts[i] += counts[i - 1]

    # Step 3: fill output (reverse for stability)
    output = [0] * len(arr)
    for v in reversed(arr):
        counts[v] -= 1
        output[counts[v]] = v
    return output`,
    },
    applications: [
      '整数值域小的排序（学生成绩 0-100、年龄等）',
      '基数排序的内部子程序',
      '桶排序的特殊情况（每桶最多一个元素）',
      '需要稳定、线性时间排序的特定场景',
    ],
  },

  quicksort: {
    slug: 'quicksort',
    name: '快速排序',
    nameEn: 'Quick Sort',
    category: 'sorting',
    difficulty: '进阶',
    fn: quickSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
    description: '分治思想：选 pivot 划分数组，递归排序两侧。',
    intuition: `快排的核心是"分而治之"。每一轮选定一个基准值（pivot），通过一次扫描把数组重新排列：所有小于 pivot 的元素移到它左侧，大于的移到右侧。这一步称为 partition（划分）。

划分完成后，pivot 已经在最终位置，左右两部分独立递归即可。

实践中快排通常比归并、堆排序更快，因为常数因子小、缓存友好。最坏情况 O(n²) 出现在 pivot 选取不当（如总是选最大或最小）的有序数组上，工业实现会通过随机化或三数取中规避。`,
    pseudocode: `procedure quickSort(A, low, high):
    if low < high:
        p ← partition(A, low, high)
        quickSort(A, low, p-1)
        quickSort(A, p+1, high)

procedure partition(A, low, high):
    pivot ← A[high]
    i ← low - 1
    for j from low to high-1:
        if A[j] ≤ pivot:
            i ← i + 1
            swap(A[i], A[j])
    swap(A[i+1], A[high])
    return i + 1`,
    code: {
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    },
    applications: [
      '通用排序：C 标准库 qsort、Java 基本类型排序',
      'Quickselect：寻找第 k 大元素，平均 O(n)',
      '需要原地、缓存友好排序的场景',
    ],
  },

  mergesort: {
    slug: 'mergesort',
    name: '归并排序',
    nameEn: 'Merge Sort',
    category: 'sorting',
    difficulty: '中等',
    fn: mergeSort,
    viz: 'sorting',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
    description: '分治：递归拆分至单元素，然后两两有序合并。',
    intuition: `归并排序也是分治算法，但与快排相反：它先无脑拆分，难点在合并。

把数组从中间拆成两半，递归排序左右两半，得到两个有序子数组。然后用双指针把两个有序子数组合并成一个有序数组——这一步是 O(n)。

主定理告诉我们 T(n) = 2T(n/2) + O(n) = O(n log n)，且与输入分布无关，因此最坏情况也保证 O(n log n)。代价是需要 O(n) 的额外空间存放合并结果。

它是稳定的，且天然适合外部排序（处理无法装入内存的大文件）。`,
    pseudocode: `procedure mergeSort(A, left, right):
    if left < right:
        mid ← ⌊(left + right) / 2⌋
        mergeSort(A, left, mid)
        mergeSort(A, mid+1, right)
        merge(A, left, mid, right)

procedure merge(A, left, mid, right):
    L ← A[left..mid], R ← A[mid+1..right]
    i ← j ← 0, k ← left
    while i < |L| and j < |R|:
        if L[i] ≤ R[j]: A[k++] ← L[i++]
        else: A[k++] ← R[j++]
    copy remaining from L or R`,
    code: {
      cpp: `void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> L(arr.begin() + left, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + right + 1);
    int i = 0, j = 0, k = left;
    while (i < L.size() && j < R.size()) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < L.size()) arr[k++] = L[i++];
    while (j < R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(L, R):
    result = []
    i = j = 0
    while i < len(L) and j < len(R):
        if L[i] <= R[j]:
            result.append(L[i])
            i += 1
        else:
            result.append(R[j])
            j += 1
    result.extend(L[i:])
    result.extend(R[j:])
    return result`,
    },
    applications: [
      '需要稳定排序的场景（保留相等元素相对顺序）',
      '外部排序：磁盘大文件排序',
      '链表排序（无需随机访问，O(1) 额外空间）',
      '逆序对计数等分治问题',
    ],
  },

  heapsort: {
    slug: 'heapsort',
    name: '堆排序',
    nameEn: 'Heap Sort',
    category: 'sorting',
    difficulty: '进阶',
    fn: heapSort,
    viz: 'heap',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
    description: '建大顶堆 → 反复取堆顶交换尾部 → 重新堆化。',
    intuition: `堆排序基于二叉堆数据结构。大顶堆是一棵完全二叉树，满足"父节点 ≥ 子节点"。它可以用数组紧凑存储（节点 i 的左右孩子分别是 2i+1 和 2i+2）。

算法分两阶段：
1. **建堆**：从最后一个非叶节点开始，自下而上对每个节点 sift down（下沉），把无序数组变为大顶堆，O(n)。
2. **排序**：堆顶就是当前最大值，把它与堆末尾交换，堆大小减 1，再对新堆顶 sift down 恢复堆性质。重复 n-1 次。

堆排序保证 O(n log n) 且原地（O(1) 空间），但缓存不友好（跳跃访问），实际比快排慢。它在嵌入式或对最坏情况敏感的场景有优势。`,
    pseudocode: `procedure heapSort(A):
    n ← length(A)
    for i from ⌊n/2⌋-1 down to 0:
        siftDown(A, i, n-1)         // 建堆
    for i from n-1 down to 1:
        swap(A[0], A[i])             // 取出最大值放到末尾
        siftDown(A, 0, i-1)          // 缩小堆并恢复

procedure siftDown(A, start, end):
    root ← start
    while 2*root+1 ≤ end:
        child ← 2*root+1
        if child+1 ≤ end and A[child+1] > A[child]:
            child ← child+1
        if A[root] ≥ A[child]: return
        swap(A[root], A[child])
        root ← child`,
    code: {
      cpp: `void siftDown(vector<int>& arr, int start, int end) {
    int root = start;
    while (root * 2 + 1 <= end) {
        int child = root * 2 + 1;
        if (child + 1 <= end && arr[child + 1] > arr[child]) child++;
        if (arr[root] >= arr[child]) return;
        swap(arr[root], arr[child]);
        root = child;
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    // 建堆：从最后一个非叶节点开始 sift down
    for (int i = n / 2 - 1; i >= 0; i--) siftDown(arr, i, n - 1);
    // 反复取堆顶放到末尾
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        siftDown(arr, 0, i - 1);
    }
}`,
      python: `def sift_down(arr, start, end):
    root = start
    while root * 2 + 1 <= end:
        child = root * 2 + 1
        if child + 1 <= end and arr[child + 1] > arr[child]:
            child += 1
        if arr[root] >= arr[child]:
            return
        arr[root], arr[child] = arr[child], arr[root]
        root = child

def heap_sort(arr):
    n = len(arr)
    # 建堆：从最后一个非叶节点开始 sift down
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n - 1)
    # 反复取堆顶放到末尾
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, 0, i - 1)
    return arr`,
    },
    applications: [
      '优先队列实现（事件调度、任务队列）',
      'Top-K 问题（用小顶堆维护 k 个最大值）',
      '保证最坏 O(n log n) 且原地的排序需求',
      'Dijkstra、Prim 等图算法的内部数据结构',
    ],
  },

  bfs: {
    slug: 'bfs',
    name: 'BFS 广度优先搜索',
    nameEn: 'Breadth-First Search',
    category: 'graph',
    difficulty: '基础',
    fn: bfs,
    viz: 'graph',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description: '使用队列逐层展开，先访问近的，再访问远的。',
    intuition: `BFS 像水波在水面上扩散：从起点开始，先访问所有距离为 1 的节点，再访问距离为 2 的，以此类推。

实现的核心是队列（FIFO）：起点入队 → 反复出队节点、访问它、把它的未访问邻居入队，直到队列为空。

由于按距离分层访问，BFS 在**无权图**上能直接给出最短路径（最少边数）。但在带权图上不行——这种情况要用 Dijkstra。

需要 visited 标记防止重复入队，否则有环图会死循环。`,
    pseudocode: `procedure BFS(graph, start):
    queue ← [start]
    visited ← {start}
    while queue is not empty:
        u ← queue.dequeue()
        process(u)
        for each neighbor v of u:
            if v not in visited:
                visited.add(v)
                queue.enqueue(v)`,
    code: {
      cpp: `vector<int> bfs(unordered_map<int, vector<int>>& graph, int start) {
    queue<int> q;
    unordered_set<int> visited;
    vector<int> order;
    q.push(start);
    visited.insert(start);
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        order.push_back(u);
        for (int v : graph[u]) {
            if (visited.find(v) == visited.end()) {
                visited.insert(v);
                q.push(v);
            }
        }
    }
    return order;
}`,
      python: `from collections import deque

def bfs(graph, start):
    queue = deque([start])
    visited = {start}
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                queue.append(v)
    return order`,
    },
    applications: [
      '无权图最短路径（迷宫、社交网络度数）',
      '层次遍历（树的逐层打印）',
      '连通性检查、二部图判定',
      '网络爬虫的页面发现',
    ],
  },

  dfs: {
    slug: 'dfs',
    name: 'DFS 深度优先搜索',
    nameEn: 'Depth-First Search',
    category: 'graph',
    difficulty: '基础',
    fn: dfs,
    viz: 'graph',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description: '使用栈一路到底，回溯后再访问其他分支。',
    intuition: `DFS 像走迷宫：选一条路一直走到底，遇到死路就回退一步，再尝试另一条岔路。

实现可以用递归（系统栈）或显式栈。从起点开始，把它压入栈 → 反复弹出栈顶节点、访问它、把未访问邻居压栈。

DFS 与 BFS 是图论的两大基础工具。它的特点是会"深入"某个分支直到尽头，因此天然适合需要探索路径或回溯的问题。`,
    pseudocode: `procedure DFS(graph, start):
    stack ← [start]
    visited ← {}
    while stack is not empty:
        u ← stack.pop()
        if u in visited: continue
        visited.add(u)
        process(u)
        for each neighbor v of u (in reverse order):
            if v not in visited:
                stack.push(v)

// 递归形式
procedure DFSRec(u):
    visited.add(u)
    for each neighbor v of u:
        if v not in visited: DFSRec(v)`,
    code: {
      cpp: `vector<int> dfs(unordered_map<int, vector<int>>& graph, int start) {
    stack<int> st;
    unordered_set<int> visited;
    vector<int> order;
    st.push(start);
    while (!st.empty()) {
        int u = st.top();
        st.pop();
        if (visited.count(u)) continue;
        visited.insert(u);
        order.push_back(u);
        // 反向压栈，让较小邻居先弹出
        for (auto it = graph[u].rbegin(); it != graph[u].rend(); ++it) {
            if (!visited.count(*it)) st.push(*it);
        }
    }
    return order;
}

// 递归形式
void dfsRec(int u, unordered_map<int, vector<int>>& graph,
            unordered_set<int>& visited) {
    visited.insert(u);
    for (int v : graph[u]) {
        if (!visited.count(v)) dfsRec(v, graph, visited);
    }
}`,
      python: `def dfs(graph, start):
    stack = [start]
    visited = set()
    order = []
    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        order.append(u)
        # 反向压栈，让较小邻居先弹出
        for v in reversed(graph.get(u, [])):
            if v not in visited:
                stack.append(v)
    return order

# 递归形式
def dfs_rec(u, graph, visited):
    visited.add(u)
    for v in graph.get(u, []):
        if v not in visited:
            dfs_rec(v, graph, visited)`,
    },
    applications: [
      '拓扑排序（依赖关系排序）',
      '连通分量、强连通分量（Tarjan/Kosaraju）',
      '回溯算法骨架（八皇后、数独、生成排列）',
      '环检测、二分图判定',
    ],
  },

 
  dijkstra: {
    slug: 'dijkstra',
    name: 'Dijkstra 最短路径',
    nameEn: "Dijkstra's Algorithm",
    category: 'graph',
    difficulty: '进阶',
    fn: dijkstra,
    viz: 'graph',
    timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
    spaceComplexity: 'O(V)',
    description: '贪心选取距离最小的未访问节点，松弛其邻居。',
    intuition: `Dijkstra 维护从起点到每个节点的"已知最短距离" dist[]。初始 dist[start]=0，其余为 ∞。

每一轮，从未访问节点中挑出 dist 最小的节点 u，把它标记为已访问。然后**松弛** u 的所有边：对每个邻居 v，如果 dist[u] + w(u,v) < dist[v]，就更新 dist[v]。

直觉：一旦节点被选中（dist 最小），它的距离就确定了，因为任何绕道的路径都会更长。这一保证依赖**边权非负**——这也是 Dijkstra 的限制（负权要用 Bellman-Ford）。

朴素实现 O(V²)，用优先队列优化到 O((V+E) log V)。`,
    pseudocode: `procedure Dijkstra(graph, start):
    dist[v] ← ∞ for all v; dist[start] ← 0
    PQ ← {(0, start)}
    while PQ is not empty:
        (d, u) ← PQ.extractMin()
        if d > dist[u]: continue
        for each (v, w) in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] ← dist[u] + w
                PQ.insert((dist[v], v))
    return dist`,
    code: {
      cpp: `unordered_map<int, int> dijkstra(
    unordered_map<int, vector<pair<int, int>>>& graph, int start) {
    unordered_map<int, int> dist;
    for (auto& [u, _] : graph) dist[u] = INT_MAX;
    dist[start] = 0;

    // 小顶堆：(距离, 节点)
    priority_queue<pair<int, int>,
                   vector<pair<int, int>>,
                   greater<>> pq;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d > dist[u]) continue;  // 过期记录
        for (auto& [v, w] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}`,
      python: `import heapq

def dijkstra(graph, start):
    dist = {u: float('inf') for u in graph}
    dist[start] = 0
    pq = [(0, start)]  # 小顶堆：(距离, 节点)

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue  # 过期记录
        for v, w in graph.get(u, []):
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
    },
    applications: [
      '路径规划（地图导航、网络路由 OSPF）',
      '游戏 AI 寻路（A* 是其加权扩展）',
      '图论问题的最短距离基础组件',
      '注意：边权必须非负，否则用 Bellman-Ford',
    ],
  },

    prim: {
        slug: 'prim',
        name: 'Prim 最小生成树',
        nameEn: "Prim's Minimum Spanning Tree",
        category: 'graph',
        difficulty: '中等',
        fn: prim,
        viz: 'graph',
        timeComplexity: { best: 'O(E + V log V)', average: 'O(E log V)', worst: 'O(E log V)' },
        spaceComplexity: 'O(V+E)',
        description: '从某一顶点出发，贪心选择连接已构造树与剩余顶点的最小权值边，直至所有顶点被连接。',
        intuition: '想象逐步扩张一棵树：每一步都挑选与当前树相连的最短边，保证局部最优最终构成全局最优的生成树（在无向连通图上）。',
        pseudocode: `procedure Prim(graph, start):
        visited ← {start}
        while visited.size < |V|:
                choose edge (u,v) with minimal weight where u ∈ visited, v ∉ visited
                add v to visited; add (u,v) to MST`,
        code: {
            cpp: `// see src/algorithms/graph/prim.js for JS implementation`,
            python: `# see src/algorithms/graph/prim.js for JS implementation`,
        },
        applications: [
            '网络设计（最小化电缆成本）',
            '聚类分析的近似构造',
        ],
    },

    kruskal: {
        slug: 'kruskal',
        name: 'Kruskal 最小生成树',
        nameEn: "Kruskal's Minimum Spanning Tree",
        category: 'graph',
        difficulty: '中等',
        fn: kruskal,
        viz: 'graph',
        timeComplexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
        spaceComplexity: 'O(V+E)',
        description: '将边按权重从小到大排序，依次选择不会形成环的边加入生成树（使用并查集检测连通性）。',
        intuition: '按权重贪心地挑边，利用并查集避免形成环，直到树包含所有顶点。',
        pseudocode: `procedure Kruskal(graph):
        sort edges by weight
        for edge in edges:
                if edge.u and edge.v not connected: union(u,v); add edge to MST`,
        code: {
            cpp: `// see src/algorithms/graph/kruskal.js for JS implementation`,
            python: `# see src/algorithms/graph/kruskal.js for JS implementation`,
        },
        applications: [
            '最小代价的连通网络构建',
        ],
    },

  bellmanford: {
    slug: 'bellmanford',
    name: 'Bellman-Ford 最短路径',
    nameEn: 'Bellman-Ford Algorithm',
    category: 'graph',
    difficulty: '进阶',
    fn: bellmanFord,
    viz: 'graph',
    timeComplexity: { best: 'O(V·E)', average: 'O(V·E)', worst: 'O(V·E)' },
    spaceComplexity: 'O(V)',
    description: '迭代松弛所有边 V-1 次，可处理负权并检测负环。',
    intuition: `Bellman-Ford 与 Dijkstra 都求单源最短路径，但选择策略完全不同：Dijkstra 贪心地选当前最近的节点，而 Bellman-Ford 暴力地"松弛所有边" V-1 次。

**核心观察：** 如果存在最短路径，它最多有 V-1 条边（不会有环，因为环只会让路径变长）。所以经过 V-1 轮、每轮松弛所有 E 条边后，所有最短距离都已收敛。

**松弛操作：** 对每条边 (u,v,w)，如果 dist[u] + w < dist[v]，就更新 dist[v]。

**关键能力：** 与 Dijkstra 不同，Bellman-Ford 能正确处理**负权边**。第 V 轮再扫一遍，如果还能松弛，说明图中存在**负权环**——这种情况下最短路径无意义（绕环可以无限缩短）。

代价是时间复杂度 O(V·E)，比 Dijkstra 的 O((V+E)logV) 慢得多。所以：边权全非负用 Dijkstra，含负权或要检测负环用 Bellman-Ford。`,
    pseudocode: `procedure BellmanFord(graph, start):
    dist[v] ← ∞ for all v; dist[start] ← 0
    repeat V-1 times:
        for each edge (u, v, w) in graph:
            if dist[u] + w < dist[v]:
                dist[v] ← dist[u] + w
    // 负环检测
    for each edge (u, v, w) in graph:
        if dist[u] + w < dist[v]:
            report "negative cycle exists"
    return dist`,
    code: {
      cpp: `struct Edge { int u, v, w; };

bool bellmanFord(int V, vector<Edge>& edges, int start,
                 vector<int>& dist) {
    dist.assign(V, INT_MAX);
    dist[start] = 0;

    for (int i = 1; i < V; i++) {
        bool updated = false;
        for (auto& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                updated = true;
            }
        }
        if (!updated) break;  // 提前收敛
    }

    // 负环检测
    for (auto& e : edges) {
        if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
            return false;  // 存在负环
        }
    }
    return true;
}`,
      python: `def bellman_ford(V, edges, start):
    """edges: [(u, v, w), ...]; 返回 (dist, has_negative_cycle)"""
    dist = [float('inf')] * V
    dist[start] = 0

    for _ in range(V - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break  # 提前收敛

    # 负环检测
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            return dist, True
    return dist, False`,
    },
    applications: [
      '含负权边的最短路径（货币套利、博弈收益）',
      '网络路由协议 RIP（基于距离向量）',
      '检测图中的负权环',
      'SPFA 等基于松弛思想的算法的基础',
    ],
  },

  floydwarshall: {
    slug: 'floydwarshall',
    name: 'Floyd-Warshall 全源最短路',
    nameEn: 'Floyd-Warshall Algorithm',
    category: 'graph',
    difficulty: '进阶',
    fn: floydWarshall,
    viz: 'floyd',
    timeComplexity: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' },
    spaceComplexity: 'O(V²)',
    description: '三重循环 DP，枚举中间节点松弛所有点对最短距离。',
    intuition: `Floyd-Warshall 与 Dijkstra/Bellman-Ford 最大的区别是：它一次性求出**所有点对**之间的最短路径，而不是单源最短路。

核心思想是动态规划：让 dist[i][j] 表示"只允许经过编号 1..k 的中间节点时，i 到 j 的最短距离"。

状态转移：dist_k[i][j] = min(dist_{k-1}[i][j], dist_{k-1}[i][k] + dist_{k-1}[k][j])

逻辑是：要么不经过 k，要么经过 k（i→k + k→j）。逐步把所有 V 个节点都纳入"可用中间节点"集合，最终 dist[i][j] 就是真实最短距离。

与 Bellman-Ford 一样，它支持负权边，但不能有负权环。可以用主对角线 dist[i][i] < 0 来检测负权环。`,
    pseudocode: `procedure FloydWarshall(W):
    dist ← W  // 初始为邻接矩阵
    for k from 0 to V-1:
        for i from 0 to V-1:
            for j from 0 to V-1:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] ← dist[i][k] + dist[k][j]
    return dist`,
    code: {
      cpp: `void floydWarshall(vector<vector<int>>& dist, int V) {
    // dist 初始化：直接边权，自身为 0，无边为 INT_MAX/2
    for (int k = 0; k < V; k++) {
        for (int i = 0; i < V; i++) {
            for (int j = 0; j < V; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }
    // 负环检测：dist[i][i] < 0
}`,
      python: `def floyd_warshall(dist, V):
    """dist: V×V 矩阵，float('inf') 表示无边"""
    for k in range(V):
        for i in range(V):
            for j in range(V):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    # 负环检测: 任意 dist[i][i] < 0
    return dist`,
    },
    applications: [
      '需要所有节点对最短路径的场景（传递闭包、网络延迟矩阵）',
      '小规模图（V ≤ 500）的全源最短路',
      '检测负权环',
      '求图的直径（最远的最短路径对）',
    ],
  },

  toposort: {
    slug: 'toposort',
    name: '拓扑排序',
    nameEn: "Topological Sort (Kahn's)",
    category: 'graph',
    difficulty: '中等',
    fn: topoSort,
    viz: 'topo',
    timeComplexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    spaceComplexity: 'O(V)',
    description: '基于入度的 BFS：反复取出入度为 0 的节点输出，并删除其出边。',
    intuition: `拓扑排序将有向无环图（DAG）的节点排成一个序列，使得对每条边 u→v，u 在 v 之前出现。直觉上就是"依赖关系的合法执行顺序"——比如穿衣服、编译依赖、课程先修关系。

Kahn 算法（BFS 版）：
1. 计算所有节点的入度
2. 把入度为 0 的节点全部入队（无依赖，可立即执行）
3. 每次出队一个节点 u，加入拓扑序列，然后把 u 的所有出边删除（邻居入度各 -1），如果邻居入度变为 0 就入队
4. 重复直到队列为空。如果输出序列长度 < V，说明图中存在环，无法拓扑排序。

另一种方法是 DFS 后序（逆序）——两者等价，Kahn 更直观，DFS 版更容易检测环。`,
    pseudocode: `procedure KahnTopoSort(graph):
    inDegree[v] ← 0 for all v
    for each edge (u, v): inDegree[v]++
    queue ← all v with inDegree[v] = 0
    order ← []
    while queue not empty:
        u ← queue.dequeue()
        order.append(u)
        for each neighbor v of u:
            inDegree[v]--
            if inDegree[v] = 0: queue.enqueue(v)
    if len(order) < V: "cycle detected"
    return order`,
    code: {
      cpp: `vector<int> topoSort(int V, vector<vector<int>>& adj) {
    vector<int> inDeg(V, 0);
    for (int u = 0; u < V; u++)
        for (int v : adj[u]) inDeg[v]++;

    queue<int> q;
    for (int v = 0; v < V; v++)
        if (inDeg[v] == 0) q.push(v);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--inDeg[v] == 0) q.push(v);
        }
    }
    if ((int)order.size() < V) throw runtime_error("cycle detected");
    return order;
}`,
      python: `from collections import deque

def topo_sort(V, adj):
    in_deg = [0] * V
    for u in range(V):
        for v in adj[u]:
            in_deg[v] += 1

    queue = deque(v for v in range(V) if in_deg[v] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_deg[v] -= 1
            if in_deg[v] == 0:
                queue.append(v)

    if len(order) < V:
        raise ValueError("cycle detected")
    return order`,
    },
    applications: [
      '编译器：依赖关系排序（Makefile、Maven、Gradle）',
      '课程排课：有先修条件的课程安排',
      '任务调度：有前置任务的流水线排序',
      '电子表格：公式的计算顺序（检测循环引用）',
    ],
  },

  bst: {
    slug: 'bst',
    name: '二叉搜索树 BST',
    nameEn: 'Binary Search Tree',
    category: 'tree',
    difficulty: '基础',
    fn: bstInsertSequence,
    viz: 'bst',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description: '左子树都比根小，右子树都比根大。',
    intuition: `BST 是有序数据结构，关键不变量是：对任意节点，左子树所有值 < 节点值 < 右子树所有值。

查找时，与当前节点比较，小则向左、大则向右，每次砍掉一半。插入沿同样路径走到 null 处挂上新节点。

BST 的性能取决于树高。理想平衡时高度 O(log n)，但**插入顺序决定形状**——按升序插入会退化为链表，所有操作变 O(n)。

为解决退化问题，工业实现使用自平衡 BST：红黑树、AVL 树等。`,
    pseudocode: `procedure insert(root, value):
    if root is null: return new Node(value)
    if value < root.value:
        root.left ← insert(root.left, value)
    else:
        root.right ← insert(root.right, value)
    return root

procedure search(root, value):
    if root is null or root.value = value: return root
    if value < root.value: return search(root.left, value)
    else: return search(root.right, value)`,
    code: {
      cpp: `struct Node {
    int value;
    Node *left, *right;
    Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int value) {
    if (!root) return new Node(value);
    if (value < root->value)
        root->left = insert(root->left, value);
    else if (value > root->value)
        root->right = insert(root->right, value);
    return root;
}

Node* search(Node* root, int value) {
    if (!root || root->value == value) return root;
    return value < root->value
        ? search(root->left, value)
        : search(root->right, value);
}`,
      python: `class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if not root:
        return Node(value)
    if value < root.value:
        root.left = insert(root.left, value)
    elif value > root.value:
        root.right = insert(root.right, value)
    return root

def search(root, value):
    if not root or root.value == value:
        return root
    if value < root.value:
        return search(root.left, value)
    return search(root.right, value)`,
    },
    applications: [
      '有序集合的基础结构（思想被红黑树/AVL 继承）',
      '范围查询、k-th 元素查询',
      '理解所有平衡 BST 的前置基础',
    ],
  },

  redblack: {
    slug: 'redblack',
    name: '红黑树',
    nameEn: 'Red-Black Tree',
    category: 'tree',
    difficulty: '进阶',
    fn: rbInsertSequence,
    viz: 'rb',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    description: '通过颜色和旋转规则保证树高不超过 2log(n+1)。',
    intuition: `红黑树是自平衡 BST，通过给每个节点染色（红或黑）并强制以下五条性质，把高度限制在 O(log n)：

1. 每个节点要么红，要么黑
2. 根节点是黑的
3. 所有叶子（NIL）是黑的
4. 红节点的孩子必须是黑的（不能有连续红节点）
5. 任一节点到其后代叶子的所有路径包含相同数量的黑节点

插入新节点时染红（不破坏性质 5），可能破坏性质 4（红红冲突）。修复（fixup）通过三种 case：
- **Case 1**：叔叔是红色 → 父叔变黑，祖父变红，问题上移
- **Case 2**：叔叔是黑色，z 是父的"内侧"孩子 → 旋转父变成 Case 3
- **Case 3**：叔叔是黑色，z 是父的"外侧"孩子 → 父变黑、祖父变红、对祖父旋转`,
    pseudocode: `procedure rbInsert(T, z):
    BST insert z, color z RED
    rbInsertFixup(T, z)

procedure rbInsertFixup(T, z):
    while z.parent.color = RED:
        if z.parent = z.parent.parent.left:
            uncle ← z.parent.parent.right
            if uncle.color = RED:                    # Case 1
                z.parent.color ← BLACK
                uncle.color ← BLACK
                z.parent.parent.color ← RED
                z ← z.parent.parent
            else:
                if z = z.parent.right:                # Case 2
                    z ← z.parent
                    leftRotate(T, z)
                z.parent.color ← BLACK                # Case 3
                z.parent.parent.color ← RED
                rightRotate(T, z.parent.parent)
        else: # symmetric
            ...
    T.root.color ← BLACK`,
    code: {
      cpp: `enum Color { RED, BLACK };

struct RBNode {
    int value;
    Color color;
    RBNode *left, *right, *parent;
    RBNode(int v) : value(v), color(RED),
                    left(nullptr), right(nullptr), parent(nullptr) {}
};

void rotateLeft(RBNode*& root, RBNode* x) {
    RBNode* y = x->right;
    x->right = y->left;
    if (y->left) y->left->parent = x;
    y->parent = x->parent;
    if (!x->parent) root = y;
    else if (x == x->parent->left) x->parent->left = y;
    else x->parent->right = y;
    y->left = x;
    x->parent = y;
}

void rbInsertFixup(RBNode*& root, RBNode* z) {
    while (z->parent && z->parent->color == RED) {
        RBNode* gp = z->parent->parent;
        if (z->parent == gp->left) {
            RBNode* uncle = gp->right;
            if (uncle && uncle->color == RED) {        // Case 1
                z->parent->color = BLACK;
                uncle->color = BLACK;
                gp->color = RED;
                z = gp;
            } else {
                if (z == z->parent->right) {           // Case 2
                    z = z->parent;
                    rotateLeft(root, z);
                }
                z->parent->color = BLACK;              // Case 3
                gp->color = RED;
                rotateRight(root, gp);
            }
        } else {
            // 对称情况：左右互换
        }
    }
    root->color = BLACK;
}`,
      python: `RED, BLACK = 'RED', 'BLACK'

class RBNode:
    def __init__(self, value):
        self.value = value
        self.color = RED
        self.left = None
        self.right = None
        self.parent = None

def rotate_left(tree, x):
    y = x.right
    x.right = y.left
    if y.left:
        y.left.parent = x
    y.parent = x.parent
    if not x.parent:
        tree['root'] = y
    elif x is x.parent.left:
        x.parent.left = y
    else:
        x.parent.right = y
    y.left = x
    x.parent = y

def rb_insert_fixup(tree, z):
    while z.parent and z.parent.color == RED:
        gp = z.parent.parent
        if z.parent is gp.left:
            uncle = gp.right
            if uncle and uncle.color == RED:        # Case 1
                z.parent.color = BLACK
                uncle.color = BLACK
                gp.color = RED
                z = gp
            else:
                if z is z.parent.right:             # Case 2
                    z = z.parent
                    rotate_left(tree, z)
                z.parent.color = BLACK              # Case 3
                gp.color = RED
                rotate_right(tree, gp)
        else:
            pass  # 对称情况：左右互换
    tree['root'].color = BLACK`,
    },

        avl: {
            slug: 'avl',
            name: 'AVL 树',
            nameEn: 'AVL Tree',
            category: 'tree',
            difficulty: '中等',
            fn: avlInsertSequence,
            viz: 'tree',
            description: 'AVL 树插入并通过旋转保持平衡（示例化）。',
        },

        treap: {
            slug: 'treap',
            name: 'Treap',
            nameEn: 'Treap',
            category: 'tree',
            difficulty: '中等',
            fn: treapInsertSequence,
            viz: 'tree',
            description: 'Treap（随机化 BST）插入演示，展示堆优先级影响。',
        },
    applications: [
      'C++ STL 的 std::map / std::set',
      'Java 的 TreeMap / TreeSet / HashMap（链表过长时）',
      'Linux 内核的 CFS 调度器、epoll、虚拟内存管理',
      '对最坏 O(log n) 有要求的有序数据结构场景',
    ],
  },

  knapsack: {
    slug: 'knapsack',
    name: '0-1 背包问题',
    nameEn: '0/1 Knapsack',
    category: 'dp',
    difficulty: '中等',
    fn: knapsack01,
    viz: 'knapsack',
    timeComplexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    description: '每件物品要么取要么不取，求容量限制下的最大价值。',
    intuition: `给定 n 件物品（每件有重量 w 和价值 v）和背包容量 W，每件物品最多取一次，求最大价值。

定义 dp[i][w] 为"前 i 件物品在容量 w 下的最大价值"。对第 i 件物品：
- **不取**：dp[i][w] = dp[i-1][w]
- **取**（前提是 w ≥ wᵢ）：dp[i][w] = dp[i-1][w-wᵢ] + vᵢ

转移方程：dp[i][w] = max(dp[i-1][w], dp[i-1][w-wᵢ] + vᵢ)

逐行填表，最终答案是 dp[n][W]。

可以用滚动数组优化空间到 O(W)，关键是 w 要**逆序**遍历（保证用的是上一行的值）。`,
    pseudocode: `procedure knapsack01(items, W):
    n ← length(items)
    dp ← (n+1) × (W+1) array of 0
    for i from 1 to n:
        for w from 0 to W:
            dp[i][w] ← dp[i-1][w]                       // 不取
            if items[i-1].weight ≤ w:
                take ← dp[i-1][w - items[i-1].weight] + items[i-1].value
                dp[i][w] ← max(dp[i][w], take)
    return dp[n][W]`,
    code: {
      cpp: `int knapsack01(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                dp[i][w] = max(dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
    }
    return dp[n][W];
}

// 滚动数组优化版（O(W) 空间）
int knapsack01Optimized(vector<int>& weights, vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    int n = weights.size();
    for (int i = 0; i < n; i++) {
        // w 必须逆序，保证用的是上一行的值
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}`,
      python: `def knapsack_01(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                dp[i][w] = max(
                    dp[i][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
    return dp[n][W]

# 滚动数组优化版（O(W) 空间）
def knapsack_01_optimized(weights, values, W):
    dp = [0] * (W + 1)
    for weight, value in zip(weights, values):
        # w 必须逆序，保证用的是上一行的值
        for w in range(W, weight - 1, -1):
            dp[w] = max(dp[w], dp[w - weight] + value)
    return dp[W]`,
    },
    applications: [
      '资源分配：预算固定下选择项目组合',
      '装载问题：货车装箱、内存分页',
      '密码学的子集和问题',
      'DP 入门必经之路，是无数变种的基石',
    ],
  },

  lcs: {
    slug: 'lcs',
    name: '最长公共子序列 LCS',
    nameEn: 'Longest Common Subsequence',
    category: 'dp',
    difficulty: '中等',
    fn: lcs,
    viz: 'lcs',
    timeComplexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
    spaceComplexity: 'O(mn)',
    description: '在两个序列中寻找最长的公共子序列（不要求连续）。',
    intuition: `子序列与子串不同——子序列允许跳过字符但保持相对顺序。例如 "ACBDAB" 和 "BDCABA" 的 LCS 是 "BCBA" 或 "BDAB"，长度 4。

定义 dp[i][j] 为 "s1 的前 i 个字符与 s2 的前 j 个字符的 LCS 长度"。

- 若 s1[i-1] == s2[j-1]：dp[i][j] = dp[i-1][j-1] + 1（这个字符可以同时匹配）
- 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（跳过 s1 或 s2 的当前字符）

填表后 dp[m][n] 即为 LCS 长度。要还原 LCS 字符串，从 dp[m][n] 回溯：相同字符则记录并左上走；否则走值更大的方向。`,
    pseudocode: `procedure LCS(s1, s2):
    m ← length(s1), n ← length(s2)
    dp ← (m+1) × (n+1) array of 0
    for i from 1 to m:
        for j from 1 to n:
            if s1[i-1] = s2[j-1]:
                dp[i][j] ← dp[i-1][j-1] + 1
            else:
                dp[i][j] ← max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`,
    code: {
      cpp: `pair<int, string> lcs(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i - 1] == s2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    // 回溯构造 LCS 字符串
    int i = m, j = n;
    string result;
    while (i > 0 && j > 0) {
        if (s1[i - 1] == s2[j - 1]) {
            result = s1[i - 1] + result;
            i--; j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return {dp[m][n], result};
}`,
      python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # 回溯构造 LCS 字符串
    i, j = m, n
    chars = []
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            chars.append(s1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return dp[m][n], ''.join(reversed(chars))`,
    },
    applications: [
      'diff 工具（git diff、文件比较）',
      '生物信息学：DNA / 蛋白质序列比对',
      '版本控制中的合并算法',
      '语音识别、抄袭检测',
    ],
  },

  lis: {
    slug: 'lis',
    name: '最长递增子序列 LIS',
    nameEn: 'Longest Increasing Subsequence',
    category: 'dp',
    difficulty: '中等',
    fn: lis,
    viz: 'lis',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    description: '找序列中最长的严格递增子序列（可不连续）。',
    intuition: `LIS 是经典的 DP 问题：在数组中找一个最长的严格递增子序列（子序列不要求连续，但要保持相对顺序）。

定义 dp[i] = "以 arr[i] 结尾的最长递增子序列长度"，初始全为 1（每个元素自身就是长度 1 的 LIS）。

转移：对每个 i，向左扫描所有 j < i，若 arr[j] < arr[i]，则 arr[j] 可以接在 arr[i] 前面：dp[i] = max(dp[i], dp[j] + 1)。

最终答案 = max(dp[0..n-1])，回溯 prev 数组可还原具体的 LIS 序列。

O(n²) 的 DP 已足够理解，实际上 LIS 有基于二分搜索的 O(n log n) 解法（patience sorting），思想更精妙但稍难理解。`,
    pseudocode: `procedure LIS(A):
    n ← length(A)
    dp ← array of 1 with size n
    prev ← array of -1 with size n
    for i from 1 to n-1:
        for j from 0 to i-1:
            if A[j] < A[i] and dp[j]+1 > dp[i]:
                dp[i] ← dp[j] + 1
                prev[i] ← j
    best ← argmax(dp)
    // trace back from best using prev[]
    return dp[best]`,
    code: {
      cpp: `int lis(vector<int>& arr) {
    int n = arr.size();
    vector<int> dp(n, 1), prev(n, -1);
    int best = 0;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                prev[i] = j;
            }
        }
        if (dp[i] > dp[best]) best = i;
    }
    // Trace back
    vector<int> result;
    for (int cur = best; cur != -1; cur = prev[cur])
        result.push_back(arr[cur]);
    reverse(result.begin(), result.end());
    return dp[best];  // or return result for the sequence
}`,
      python: `def lis(arr):
    n = len(arr)
    dp = [1] * n
    prev = [-1] * n
    best = 0
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                prev[i] = j
        if dp[i] > dp[best]:
            best = i
    # Trace back
    result = []
    cur = best
    while cur != -1:
        result.append(arr[cur])
        cur = prev[cur]
    return dp[best], list(reversed(result))`,
    },
    applications: [
      'diff 工具中的最长公共子序列核心组件',
      '股票最多买卖次数问题的变种',
      '俄罗斯套娃信封问题（二维 LIS）',
      '理解 patience sorting 和 O(n log n) 解法的前置',
    ],
  },

  fifo: {
    slug: 'fifo',
    name: '先进先出',
    nameEn: 'FIFO Replacement',
    category: 'pageReplacement',
    difficulty: '基础',
    fn: fifo,
    viz: 'pageReplacement',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(Capacity)',
    description: '淘汰最早进入内存的页面，最简单但可能发生 Belady 异常。',
    intuition: '类似超市排队结账，最早来排队的顾客最先结账离开。在页面置换中，内存就是容量有限的队伍，新页面加入队尾，当队列满时，将队头的页面（最早进来的页面）淘汰即可。它实现非常简单，通常可以用一个队列来维护。',
    pseudocode: `procedure FIFO(pages, capacity):
  frames = empty list
  queue = empty queue
  faults = 0
  
  for page in pages:
    if page not in frames:
      faults = faults + 1
      if length(frames) < capacity:
        frames.append(page)
        queue.enqueue(page)
      else:
        replaced = queue.dequeue()
        replace 'replaced' with 'page' in frames
        queue.enqueue(page)
        
  return faults`,
    code: {
      cpp: `int fifo(vector<int>& pages, int capacity) {
    unordered_set<int> frames;
    queue<int> q;
    int faults = 0;
    
    for (int page : pages) {
        if (frames.find(page) == frames.end()) {
            faults++;
            if (frames.size() == capacity) {
                int replaced = q.front();
                q.pop();
                frames.erase(replaced);
            }
            frames.insert(page);
            q.push(page);
        }
    }
    return faults;
}`,
      python: `def fifo(pages, capacity):
    frames = set()
    queue = []
    faults = 0
    
    for page in pages:
        if page not in frames:
            faults += 1
            if len(frames) == capacity:
                replaced = queue.pop(0)
                frames.remove(replaced)
            frames.add(page)
            queue.append(page)
            
    return faults`,
    },
    applications: [
      '对缺页率要求不高的简单系统',
      '早期操作系统',
      '可以和其他算法结合（如 Second Chance）',
    ],
  },
  
  lru: {
    slug: 'lru',
    name: '最近最少使用',
    nameEn: 'LRU Replacement',
    category: 'pageReplacement',
    difficulty: '进阶',
    fn: lru,
    viz: 'pageReplacement',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    spaceComplexity: 'O(Capacity)',
    description: '淘汰最久未被使用的页面，基于局部性原理。',
    intuition: '因为程序常常会循环或集中访问某一部分数据（时间局部性），所以如果一个页面很久没有被访问过，那么它在未来被访问的可能性也很小。LRU 每次将最近被访问的页面移到最前面，当缺页时淘汰最后面的页面。它是实际系统中最常用的缓存淘汰策略之一。',
    pseudocode: `procedure LRU(pages, capacity):
  frames = empty list
  RU_list = empty list
  faults = 0
  
  for page in pages:
    if page not in frames:
      faults = faults + 1
      if length(frames) < capacity:
        frames.append(page)
      else:
        replaced = RU_list.first() # least recently used
        replace 'replaced' with 'page' in frames
        RU_list.remove_first()
      RU_list.append(page)
    else:
      RU_list.remove(page)
      RU_list.append(page)
      
  return faults`,
    code: {
      cpp: `int lru(vector<int>& pages, int capacity) {
    list<int> lq; 
    unordered_map<int, list<int>::iterator> m; 
    int faults = 0; 
  
    for (int page : pages) { 
        if (m.find(page) == m.end()) { 
            faults++; 
            if (lq.size() == capacity) { 
                int last = lq.back(); 
                lq.pop_back(); 
                m.erase(last); 
            } 
        } 
        else {
            lq.erase(m[page]); 
        }
        lq.push_front(page); 
        m[page] = lq.begin(); 
    } 
    return faults; 
}`,
      python: `from collections import OrderedDict
def lru(pages, capacity):
    cache = OrderedDict()
    faults = 0
    
    for page in pages:
        if page not in cache:
            faults += 1
            if len(cache) == capacity:
                cache.popitem(last=False)
        else:
            cache.move_to_end(page)
        cache[page] = True
            
    return faults`,
    },
    applications: [
      '现代操作系统内存分页',
      'Redis/Memcached 等数据库缓存',
      'CDN 内容分发网络缓存',
    ],
  },
  
  opt: {
    slug: 'opt',
    name: '最佳置换',
    nameEn: 'OPT Replacement',
    category: 'pageReplacement',
    difficulty: '进阶',
    fn: opt,
    viz: 'pageReplacement',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(Capacity)',
    description: '淘汰未来最久不使用的页面，理论最优但无法实现。',
    intuition: '拥有预知未来的能力，通过向后看整个访问序列，找出当前在内存中但在未来最长时间内不会被访问的页面进行淘汰。这能保证绝对的最少缺页率。然而在现实中无法预知程序的未来访问，所以 OPT 算法只被用作理论上的天花板，用于衡量其他算法（如 LRU）的优劣。',
    pseudocode: `procedure OPT(pages, capacity):
  frames = empty list
  faults = 0
  
  for i from 0 to length(pages)-1:
    page = pages[i]
    if page not in frames:
      faults = faults + 1
      if length(frames) < capacity:
        frames.append(page)
      else:
        farthest = -1
        replaced_idx = -1
        for j from 0 to length(frames)-1:
          next_use = find_next_occurrence(pages, i+1, frames[j])
          if next_use == -1:
            replaced_idx = j
            break
          if next_use > farthest:
            farthest = next_use
            replaced_idx = j
        frames[replaced_idx] = page
        
  return faults`,
    code: {
      cpp: `int opt(vector<int>& pages, int capacity) {
    vector<int> frames;
    int faults = 0;
    
    for (int i = 0; i < pages.size(); i++) {
        int page = pages[i];
        if (find(frames.begin(), frames.end(), page) == frames.end()) {
            faults++;
            if (frames.size() < capacity) {
                frames.push_back(page);
            } else {
                int res = -1, farthest = -1;
                for (int j = 0; j < frames.size(); j++) {
                    int next_use = -1;
                    for (int k = i + 1; k < pages.size(); k++) {
                        if (frames[j] == pages[k]) {
                            next_use = k;
                            break;
                        }
                    }
                    if (next_use == -1) {
                        res = j;
                        break;
                    }
                    if (next_use > farthest) {
                        farthest = next_use;
                        res = j;
                    }
                }
                frames[res] = page;
            }
        }
    }
    return faults;
}`,
      python: `def opt(pages, capacity):
    frames = []
    faults = 0
    
    for i in range(len(pages)):
        page = pages[i]
        if page not in frames:
            faults += 1
            if len(frames) < capacity:
                frames.append(page)
            else:
                farthest = -1
                replaced_idx = -1
                for j in range(len(frames)):
                    try:
                        next_use = pages.index(frames[j], i + 1)
                    except ValueError:
                        replaced_idx = j
                        break
                    
                    if next_use > farthest:
                        farthest = next_use
                        replaced_idx = j
                frames[replaced_idx] = page
                
    return faults`,
    },
    applications: [
      '理论上的最优解',
      '对比其他算法的基准线',
    ],
  },
  
  diskfcfs: {
    slug: 'diskfcfs',
    name: '先来先服务',
    nameEn: 'FCFS Disk Scheduling',
    category: 'diskScheduling',
    difficulty: '基础',
    fn: diskFcfs,
    viz: 'disk',
    timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    description: '按请求到达的先后顺序进行服务，不考虑磁头移动距离。',
    intuition: '最简单的磁盘调度算法，维护一个队列，请求按顺序加入队列，磁头依次访问队列中的磁道。优点是公平，不会饿死任何请求；缺点是可能会导致总寻道距离非常大（例如频繁在内外磁道之间来回移动）。',
    pseudocode: `procedure FCFS(requests, initialHead):
    currentHead ← initialHead
    totalSeek ← 0
    for track in requests:
        totalSeek ← totalSeek + |track - currentHead|
        currentHead ← track
    return totalSeek`,
    code: {
      cpp: `int fcfs(vector<int>& requests, int initialHead) {
    int currentHead = initialHead;
    int totalSeek = 0;
    for (int track : requests) {
        totalSeek += abs(track - currentHead);
        currentHead = track;
    }
    return totalSeek;
}`,
      python: `def fcfs(requests, initial_head):
    current_head = initial_head
    total_seek = 0
    for track in requests:
        total_seek += abs(track - current_head)
        current_head = track
    return total_seek`,
    },
    applications: [
      '对系统负载较轻的情况',
      '作为其他算法的基准比较',
    ],
  },

  sstf: {
    slug: 'sstf',
    name: '最短寻道时间优先',
    nameEn: 'SSTF Disk Scheduling',
    category: 'diskScheduling',
    difficulty: '中等',
    fn: diskSstf,
    viz: 'disk',
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(n)',
    description: '每次选择距离当前磁头最近的请求进行服务。',
    intuition: '贪心策略。每次都在未完成的请求中找到离当前磁头位置最近的那个磁道并移过去。这可以大幅度减少总的寻道时间。但也带来了一个问题：可能会导致"饥饿"（Starvation）现象，即如果不断有靠近当前磁头的新请求到来，远处磁道的请求就可能永远得不到服务。',
    pseudocode: `procedure SSTF(requests, initialHead):
    queue ← copy(requests)
    currentHead ← initialHead
    totalSeek ← 0
    while queue is not empty:
        target ← find_closest(queue, currentHead)
        totalSeek ← totalSeek + |target - currentHead|
        currentHead ← target
        queue.remove(target)
    return totalSeek`,
    code: {
      cpp: `int sstf(vector<int>& requests, int initialHead) {
    vector<int> q = requests;
    int currentHead = initialHead;
    int totalSeek = 0;
    while (!q.empty()) {
        int closestIdx = -1;
        int minSeek = INT_MAX;
        for (int i = 0; i < q.size(); ++i) {
            int seek = abs(q[i] - currentHead);
            if (seek < minSeek) {
                minSeek = seek;
                closestIdx = i;
            }
        }
        totalSeek += minSeek;
        currentHead = q[closestIdx];
        q.erase(q.begin() + closestIdx);
    }
    return totalSeek;
}`,
      python: `def sstf(requests, initial_head):
    q = list(requests)
    current_head = initial_head
    total_seek = 0
    while q:
        closest_track = min(q, key=lambda x: abs(x - current_head))
        total_seek += abs(closest_track - current_head)
        current_head = closest_track
        q.remove(closest_track)
    return total_seek`,
    },
    applications: [
      '追求较少寻道时间的场景',
    ],
  },

  scan: {
    slug: 'scan',
    name: '电梯调度 (SCAN)',
    nameEn: 'SCAN Disk Scheduling',
    category: 'diskScheduling',
    difficulty: '中等',
    fn: diskScan,
    viz: 'elevator',
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description: '像电梯一样，磁头单向移动，直到碰到尽头才会折返。',
    intuition: '想象电梯的运行规则：电梯总是先向一个方向运行，直到该方向的顶端或者底端，停下后再反向运行。SCAN算法就是把磁头当成了电梯。由于需要对请求进行排序，并分半处理，避免了 SSTF 的饥饿现象，表现比较均匀。',
    pseudocode: `procedure SCAN(requests, initialHead, maxTrack, direction):
    sort(requests)
    left ← elements in requests < initialHead
    right ← elements in requests ≥ initialHead
    
    if direction == 'up':
        for target in right: visit(target)
        if left is not empty:
            visit(maxTrack)
            for target in reverse(left): visit(target)
    else:
        for target in reverse(left): visit(target)
        if right is not empty:
            visit(0)
            for target in right: visit(target)
    
    return totalSeek`,
    code: {
      cpp: `int scan(vector<int>& requests, int initialHead, int maxTrack, string direction) {
    vector<int> left, right;
    for (int r : requests) {
        if (r < initialHead) left.push_back(r);
        else right.push_back(r);
    }
    sort(left.begin(), left.end());
    sort(right.begin(), right.end());
    
    int totalSeek = 0, currentHead = initialHead;
    vector<int> seq;
    
    if (direction == "up") {
        for (int r : right) seq.push_back(r);
        if (!left.empty()) {
            seq.push_back(maxTrack);
            for (int i = left.size()-1; i >= 0; i--) seq.push_back(left[i]);
        }
    } else {
        for (int i = left.size()-1; i >= 0; i--) seq.push_back(left[i]);
        if (!right.empty()) {
            seq.push_back(0);
            for (int r : right) seq.push_back(r);
        }
    }
    
    for (int t : seq) {
        totalSeek += abs(t - currentHead);
        currentHead = t;
    }
    return totalSeek;
}`,
      python: `def scan(requests, initial_head, max_track, direction='up'):
    left = sorted([r for r in requests if r < initial_head])
    right = sorted([r for r in requests if r >= initial_head])
    
    seq = []
    if direction == 'up':
        seq.extend(right)
        if left:
            seq.append(max_track)
            seq.extend(reversed(left))
    else:
        seq.extend(reversed(left))
        if right:
            seq.append(0)
            seq.extend(right)
            
    total_seek = 0
    current_head = initial_head
    for t in seq:
        total_seek += abs(t - current_head)
        current_head = t
    return total_seek`,
    },
    applications: [
      '普通的操作系统磁盘调度',
      '消除饥饿的改良策略',
    ],
  },

  naive: {
    slug: 'naive',
    name: '朴素字符串匹配',
    nameEn: 'Naive Pattern Matching',
    category: 'string',
    difficulty: '基础',
    fn: naivePatternMatching,
    viz: 'string',
    timeComplexity: { best: 'O(n)', average: 'O(m*(n-m+1))', worst: 'O(m*(n-m+1))' },
    spaceComplexity: 'O(1)',
    description: '通过两层循环，依次对比主串的每一个起始位置是否与模式串匹配。',
    intuition: '最直观的暴力匹配法。像是在主串上滑动一个和模式串一样长的窗口，每次窗口和模式串的字符逐一对比。如果中间有字符不匹配了，就放弃当前起始位置，把窗口向右移动1位，重新开始比较。实现简单，不需要预处理，但在最坏情况下（比如主串是 "AAAA...AB"，模式串是 "AAAAB"），会做大量无用功的重复对比。',
    pseudocode: `procedure naivePatternMatch(text, pattern):
    n ← length(text), m ← length(pattern)
    for s from 0 to n - m:
        match ← true
        for j from 0 to m - 1:
            if text[s + j] ≠ pattern[j]:
                match ← false
                break
        if match:
            return s
    return -1`,
    code: {
      cpp: `int naivePatternMatch(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    if (m == 0) return 0;
    
    for (int s = 0; s <= n - m; s++) {
        bool match = true;
        for (int j = 0; j < m; j++) {
            if (text[s + j] != pattern[j]) {
                match = false;
                break;
            }
        }
        if (match) return s;
    }
    return -1;
}`,
      python: `def naive_pattern_match(text, pattern):
    n = len(text)
    m = len(pattern)
    if m == 0:
        return 0
        
    for s in range(n - m + 1):
        match = True
        for j in range(m):
            if text[s + j] != pattern[j]:
                match = False
                break
        if match:
            return s
    return -1`,
    },
    applications: [
      '简单文本查找（如大多数语言内置的 indexOf）',
      '模式串极短的场景',
    ],
  },
  
  kmp: {
    slug: 'kmp',
    name: 'KMP 算法',
    nameEn: 'Knuth-Morris-Pratt',
    category: 'string',
    difficulty: '进阶',
    fn: kmp,
    viz: 'string',
    timeComplexity: { best: 'O(n)', average: 'O(n + m)', worst: 'O(n + m)' },
    spaceComplexity: 'O(m)',
    description: '利用已匹配的部分信息，避免主串指针回退，实现线性时间匹配。',
    intuition: '当匹配失败时，由于前面一部分字符已经匹配过了，我们其实知道主串这部分是什么。KMP的核心就是"不回退主串指针"，而是利用模式串自身的特点（最长公共前后缀），把模式串尽可能多地向右滑动。\n\n需要先花 O(m) 的时间预处理模式串，计算 Next 数组（也就是 LPS 数组，最长公共前后缀长度）。发生失配时，通过 Next 数组快速将模式串的指针 j 移动到一个合适的位置继续比较，而主串的指针 i 永远只增不减。',
    pseudocode: `procedure computeLPS(pattern, m):
    lps ← array of m zeros
    len ← 0, i ← 1
    while i < m:
        if pattern[i] = pattern[len]:
            len ← len + 1, lps[i] ← len, i ← i + 1
        else:
            if len ≠ 0: len ← lps[len - 1]
            else: lps[i] ← 0, i ← i + 1
    return lps

procedure kmpMatch(text, pattern):
    n ← length(text), m ← length(pattern)
    if m = 0: return 0
    lps ← computeLPS(pattern, m)
    i ← 0, j ← 0
    while n - i >= m - j:
        if text[i] = pattern[j]:
            i ← i + 1, j ← j + 1
            if j = m:
                return i - j // Match found
        else:
            if j ≠ 0: j ← lps[j - 1]
            else: i ← i + 1
    return -1`,
    code: {
      cpp: `vector<int> computeLPS(string pattern) {
    int m = pattern.length();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) {
            len++; lps[i] = len; i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0; i++;
            }
        }
    }
    return lps;
}

int kmpMatch(string text, string pattern) {
    int n = text.length(), m = pattern.length();
    if (m == 0) return 0;
    
    vector<int> lps = computeLPS(pattern);
    int i = 0, j = 0;
    while (n - i >= m - j) {
        if (text[i] == pattern[j]) {
            i++; j++;
            if (j == m) return i - j;
        } else {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
    return -1;
}`,
      python: `def compute_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        else:
            if length != 0:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
    return lps

def kmp_match(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0:
        return 0
        
    lps = compute_lps(pattern)
    i = j = 0
    while n - i >= m - j:
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == m:
                return i - j
        else:
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return -1`,
    },
    applications: [
      '生物信息学：DNA 序列分析匹配',
      '文本编辑器中的整词搜索',
      '网络入侵检测系统（基于签名的匹配）',
    ],
  },
  
  nqueens: {
    slug: 'nqueens',
    name: 'N皇后问题',
    nameEn: 'N-Queens',
    category: 'backtracking',
    difficulty: '中等',
    fn: nQueens,
    viz: 'backtracking',
    timeComplexity: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
    spaceComplexity: 'O(N)',
    stable: false,
    inPlace: false,
    description: '在 N×N 的棋盘上放置 N 个皇后，使其不能互相攻击。',
    intuition: `N皇后问题是回溯算法的经典应用。我们需要在棋盘上放置皇后，使得没有任何两个皇后占据同一行、同一列或同一对角线。
    
算法采用逐行放置的策略，在每一行尝试所有列，如果放置当前位置不会与之前的皇后冲突，则继续递归放置下一行；如果发生冲突或之后的行无法成功放置，则撤销当前选择（回溯），尝试下一个位置。`,
    pseudocode: `procedure solveNQueens(board, row):
    if row == n:
        add board to solutions
        return
        
    for col from 0 to n-1:
        if isValid(board, row, col):
            place queen at (row, col)
            solveNQueens(board, row + 1)
            remove queen from (row, col)

procedure isValid(board, row, col):
    for i from 0 to row-1:
        if board[i] == col or
           abs(board[i] - col) == abs(i - row):
            return false
    return true`,
    code: {
      cpp: `void solveNQueens(int row, int n, vector<int>& queens, vector<vector<string>>& res) {
    if (row == n) {
        vector<string> board(n, string(n, '.'));
        for (int i = 0; i < n; i++) board[i][queens[i]] = 'Q';
        res.push_back(board);
        return;
    }
    for (int col = 0; col < n; col++) {
        if (isValid(queens, row, col)) {
            queens[row] = col;
            solveNQueens(row + 1, n, queens, res);
        }
    }
}

bool isValid(const vector<int>& queens, int row, int col) {
    for (int i = 0; i < row; i++) {
        if (queens[i] == col || abs( queens[i] - col) == abs(i - row))
            return false;
    }
    return true;
}`,
      python: `def solveNQueens(n):
    def backtrack(row, queens):
        if row == n:
            res.append(queens[:])
            return
        for col in range(n):
            if is_valid(queens, row, col):
                queens.append(col)
                backtrack(row + 1, queens)
                queens.pop()
                
    def is_valid(queens, row, col):
        for r, c in enumerate(queens):
            if c == col or abs(r - row) == abs(c - col):
                return False
        return True
        
    res = []
    backtrack(0, [])
    return res`,
    },
    applications: [
      '约束满足问题（Constraint Satisfaction Problem）的经典模型',
      '回溯算法与递归思想的入门教学',
      '在很多复杂调度、排课等问题上的原理运用',
    ],
  },

  unionfind: {
    slug: 'unionfind',
    name: '并查集',
    nameEn: 'Union-Find',
    category: 'dataStructures',
    difficulty: '中等',
    fn: unionFind,
    viz: 'unionfind',
    timeComplexity: { best: 'O(α(n))', average: 'O(α(n))', worst: 'O(α(n))' },
    spaceComplexity: 'O(n)',
    stable: null,
    description: '用"按大小合并+路径压缩"实现近乎常数时间的集合合并与查询。',
    intuition: `并查集（Disjoint Set Union，DSU）是一种专门处理"动态连通性"问题的数据结构：给定一组元素，支持两种操作——合并两个集合、查询两个元素是否属于同一集合。

朴素实现用数组存储每个元素的"父节点"，根节点的父节点指向自己。但链状结构会让 Find 退化到 O(n)。

两种关键优化让并查集几乎变成 O(1)：
1. **按大小合并（Union by Size）**：总是把小树挂到大树上，保证树高 ≤ log n。
2. **路径压缩（Path Compression）**：Find 时把路径上所有节点直接指向根节点，使后续 Find 更快。

两者结合后，每次操作均摊代价为 **O(α(n))**，α 是反阿克曼函数，对任何实际数据 α(n) ≤ 4，可视为常数。`,
    pseudocode: `procedure MakeSet(x):
    parent[x] ← x;  size[x] ← 1

procedure Find(x):           // 路径压缩
    if parent[x] ≠ x:
        parent[x] ← Find(parent[x])
    return parent[x]

procedure Union(x, y):       // 按大小合并
    rx ← Find(x);  ry ← Find(y)
    if rx = ry: return       // 已同集
    if size[rx] < size[ry]: swap(rx, ry)
    parent[ry] ← rx
    size[rx] ← size[rx] + size[ry]`,
    code: {
      cpp: `class UnionFind {
    vector<int> parent, sz;
public:
    UnionFind(int n) : parent(n), sz(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // 路径压缩
        return parent[x];
    }
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (sz[rx] < sz[ry]) swap(rx, ry);
        parent[ry] = rx;
        sz[rx] += sz[ry];
        return true;
    }
    bool connected(int x, int y) { return find(x) == find(y); }
};`,
      python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 路径压缩
        return self.parent[x]

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False
        if self.size[rx] < self.size[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx
        self.size[rx] += self.size[ry]
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)`,
    },
    applications: [
      '图的连通性检测（如 Kruskal 最小生成树算法的核心组件）',
      '社交网络中"朋友的朋友"类型的连通关系查询',
      'LeetCode 200 岛屿数量、721 账户合并、684 冗余连接等经典题',
      '在线算法处理动态网络中节点的实时合并',
    ],
  },

  trie: {
    slug: 'trie',
    name: 'Trie（前缀树）',
    nameEn: 'Trie',
    category: 'dataStructures',
    difficulty: '中等',
    fn: trieOps,
    viz: 'trie',
    timeComplexity: { best: 'O(m)', average: 'O(m)', worst: 'O(m)' },
    spaceComplexity: 'O(n·m)',
    stable: null,
    description: '用多叉树存储字符串集合，每个节点代表一个字符，支持 O(m) 插入与前缀查询。',
    intuition: `Trie（读作 "try"，来自 re**trie**val）是一种专为字符串设计的树形数据结构。每个节点表示字符串的一个字符，从根到某个标记节点的路径拼成一个完整单词。

核心优势在于**前缀共享**：所有以相同前缀开头的单词共享同一段路径，避免重复存储。例如 "app"、"apple"、"apt" 共享 "ap" 路径。

每次插入或查询的时间复杂度为 **O(m)**（m 为字符串长度），与字典中单词数量无关。

常见变体：
- **压缩 Trie**：合并只有一个子节点的链式节点，节省空间
- **后缀树**：存储字符串所有后缀，用于高效子串查询`,
    pseudocode: `procedure Insert(root, word):
    curr ← root
    for ch in word:
        if ch not in curr.children:
            curr.children[ch] ← new TrieNode
        curr ← curr.children[ch]
    curr.isEnd ← true

procedure Search(root, word):
    curr ← root
    for ch in word:
        if ch not in curr.children: return false
        curr ← curr.children[ch]
    return curr.isEnd

procedure StartsWith(root, prefix):
    curr ← root
    for ch in prefix:
        if ch not in curr.children: return false
        curr ← curr.children[ch]
    return true`,
    code: {
      cpp: `struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();
public:
    void insert(const string& word) {
        auto* curr = root;
        for (char c : word) {
            if (!curr->children.count(c))
                curr->children[c] = new TrieNode();
            curr = curr->children[c];
        }
        curr->isEnd = true;
    }
    bool search(const string& word) {
        auto* curr = root;
        for (char c : word) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return curr->isEnd;
    }
    bool startsWith(const string& prefix) {
        auto* curr = root;
        for (char c : prefix) {
            if (!curr->children.count(c)) return false;
            curr = curr->children[c];
        }
        return true;
    }
};`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                curr.children[ch] = TrieNode()
            curr = curr.children[ch]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for ch in word:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return curr.is_end

    def starts_with(self, prefix: str) -> bool:
        curr = self.root
        for ch in prefix:
            if ch not in curr.children:
                return False
            curr = curr.children[ch]
        return True`,
    },
    applications: [
      '搜索引擎自动补全/拼写检查（输入前缀快速给出候选词）',
      'IP 路由表中最长前缀匹配（路由器核心操作）',
      'LeetCode 208 实现 Trie、212 单词搜索 II 等高频题',
      '敏感词过滤系统（多模式匹配的基础）',
    ],
  },

  linkedlist: {
    slug: 'linkedlist',
    name: '链表',
    nameEn: 'Linked List',
    category: 'dataStructures',
    difficulty: '基础',
    fn: linkedListOps,
    viz: 'linkedlist',
    timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    stable: null,
    description: '每个节点持有值和指向下一节点的指针，插入/删除 O(1)，但随机访问 O(n)。',
    intuition: `链表是最基础的线性数据结构之一。与数组不同，链表的节点在内存中**不连续**——每个节点除了存储数据，还包含一个指向下一节点的指针。

这带来了关键权衡：
- **优点**：在已知位置插入/删除只需修改指针，O(1)；动态扩容无需预分配内存。
- **缺点**：随机访问需要从头遍历，O(n)；额外的指针开销增加内存占用；缓存不友好。

常见变体：
- **双向链表**：每节点额外持有 prev 指针，支持 O(1) 的前向遍历与删除
- **循环链表**：尾节点指向头节点，适合队列/轮转算法
- **跳表**：多层索引链表，实现 O(log n) 查找

链表反转是面试高频题：维护 prev/curr 两个指针，逐节点将 next 方向反转。`,
    pseudocode: `// 头插法
procedure Prepend(head, val):
    node ← new Node(val)
    node.next ← head
    head ← node

// 在 pos 位置插入
procedure InsertAt(head, pos, val):
    node ← new Node(val)
    curr ← head;  i ← 0
    while i < pos-1: curr ← curr.next; i++
    node.next ← curr.next
    curr.next ← node

// 反转链表
procedure Reverse(head):
    prev ← null;  curr ← head
    while curr ≠ null:
        nxt ← curr.next
        curr.next ← prev
        prev ← curr;  curr ← nxt
    return prev`,
    code: {
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// 头插法 O(1)
ListNode* prepend(ListNode* head, int val) {
    auto* node = new ListNode(val);
    node->next = head;
    return node;
}

// 删除第一个值为 val 的节点 O(n)
ListNode* deleteVal(ListNode* head, int val) {
    auto dummy = new ListNode(0);
    dummy->next = head;
    auto* prev = dummy;
    while (prev->next) {
        if (prev->next->val == val) {
            prev->next = prev->next->next;
            break;
        }
        prev = prev->next;
    }
    return dummy->next;
}

// 反转链表 O(n)
ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    auto* curr = head;
    while (curr) {
        auto* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def prepend(head, val):
    node = ListNode(val)
    node.next = head
    return node

def delete_val(head, val):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next:
        if prev.next.val == val:
            prev.next = prev.next.next
            break
        prev = prev.next
    return dummy.next

def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    },
    applications: [
      '操作系统内存管理的空闲块链表',
      'LRU 缓存淘汰算法（双向链表 + 哈希表实现 O(1) 操作）',
      '浏览器前进/后退历史记录（双向链表）',
      '多项式表示与大数乘法',
    ],
  },

  astar: {
    slug: 'astar',
    name: 'A* 搜索',
    nameEn: 'A* Search',
    category: 'graph',
    difficulty: '进阶',
    fn: aStar,
    viz: 'astar',
    timeComplexity: { best: 'O(E)', average: 'O(b^d)', worst: 'O(b^d)' },
    spaceComplexity: 'O(b^d)',
    stable: null,
    description: '带启发函数的最短路搜索，f(n)=g(n)+h(n)，比 Dijkstra 更快到达目标。',
    intuition: `A*（A-Star）是游戏 AI 和路径规划中最广泛使用的寻路算法。它在 Dijkstra 的基础上加入了**启发函数 h(n)**，通过估计当前节点到目标的距离来优先探索"更有希望"的路径。

A* 的估价函数：**f(n) = g(n) + h(n)**
- **g(n)**：从起点到节点 n 的已知实际代价
- **h(n)**：从 n 到终点的**启发式估计**（如曼哈顿距离、欧几里得距离）
- **f(n)**：总估计代价

关键性质：若 h(n) 是**可采纳的**（admissible，即永不高估实际代价），则 A* 能找到最优路径。

与 Dijkstra 的区别：Dijkstra 的 h(n)=0，均匀向四周扩展；A* 优先向目标方向扩展，跳过大量无关节点，实际更快。

与贪心最优优先搜索的区别：后者只用 h(n)，可能找到次优路径；A* 同时考虑 g(n) 保证最优性。`,
    pseudocode: `procedure AStar(start, goal, h):
    open ← PriorityQueue({start: f=h(start)})
    g[start] ← 0

    while open not empty:
        curr ← open.pop_min_f()
        if curr = goal: return reconstruct_path()

        closed.add(curr)
        for each neighbor of curr:
            if neighbor in closed: continue
            newG ← g[curr] + cost(curr, neighbor)
            if newG < g[neighbor]:
                g[neighbor] ← newG
                f[neighbor] ← newG + h(neighbor)
                open.push(neighbor, f[neighbor])
                cameFrom[neighbor] ← curr

    return failure  // 无路径`,
    code: {
      cpp: `struct Cell { int r, c, f, g; };
auto cmp = [](Cell a, Cell b){ return a.f > b.f; };

vector<pair<int,int>> aStar(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> goal) {
    int rows = grid.size(), cols = grid[0].size();
    auto h = [&](int r, int c){ return abs(r-goal.first)+abs(c-goal.second); };
    vector<vector<int>> g(rows, vector<int>(cols, INT_MAX));
    vector<vector<pair<int,int>>> came(rows, vector<pair<int,int>>(cols, {-1,-1}));
    priority_queue<Cell, vector<Cell>, decltype(cmp)> pq(cmp);
    g[start.first][start.second] = 0;
    pq.push({start.first, start.second, h(start.first, start.second), 0});
    int dr[]={-1,1,0,0}, dc[]={0,0,-1,1};
    while (!pq.empty()) {
        auto [r, c, f, gv] = pq.top(); pq.pop();
        if (r==goal.first && c==goal.second) {
            vector<pair<int,int>> path;
            for (auto [pr,pc]=goal; pr!=-1; tie(pr,pc)=came[pr][pc])
                path.push_back({pr, pc});
            reverse(path.begin(), path.end());
            return path;
        }
        if (gv > g[r][c]) continue;
        for (int d=0;d<4;d++) {
            int nr=r+dr[d], nc=c+dc[d];
            if (nr<0||nr>=rows||nc<0||nc>=cols||grid[nr][nc]) continue;
            int ng = g[r][c]+1;
            if (ng < g[nr][nc]) {
                g[nr][nc]=ng; came[nr][nc]={r,c};
                pq.push({nr, nc, ng+h(nr,nc), ng});
            }
        }
    }
    return {};
}`,
      python: `import heapq

def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    h = lambda r, c: abs(r - goal[0]) + abs(c - goal[1])
    g = [[float('inf')] * cols for _ in range(rows)]
    came_from = [[None] * cols for _ in range(rows)]
    g[start[0]][start[1]] = 0
    pq = [(h(*start), 0, start)]  # (f, g, pos)

    while pq:
        f, gv, (r, c) = heapq.heappop(pq)
        if (r, c) == goal:
            path = []
            while (r, c) is not None:
                path.append((r, c))
                rc = came_from[r][c]
                if rc is None: break
                r, c = rc
            return path[::-1]
        if gv > g[r][c]:
            continue
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and not grid[nr][nc]:
                ng = g[r][c] + 1
                if ng < g[nr][nc]:
                    g[nr][nc] = ng
                    came_from[nr][nc] = (r, c)
                    heapq.heappush(pq, (ng + h(nr, nc), ng, (nr, nc)))
    return []`,
    },
    applications: [
      '游戏中的 NPC 寻路（《魔兽争霸》《星际争霸》等 RTS 游戏）',
      '地图导航软件的路径规划（结合实际道路权重）',
      '机器人路径规划与自动驾驶障碍物绕行',
      '迷宫求解与拼图游戏（如 15-Puzzle 的最优解）',
    ],
  },

  hashtable: {
    slug: 'hashtable',
    name: '哈希表',
    nameEn: 'Hash Table',
    category: 'dataStructures',
    difficulty: '中等',
    fn: hashTable,
    viz: 'hashtable',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
    spaceComplexity: 'O(n)',
    stable: null,
    description: '通过哈希函数将键映射到桶，配合链地址法解决冲突，均摊 O(1) 的插入与查找。',
    intuition: `哈希表是实现关联数组（键值对）的核心数据结构，也是几乎所有高级语言标准库中 Map/Dict/Object 的底层实现。

核心思想：用**哈希函数** h(key) 把任意键映射到 [0, m) 区间内的桶索引，直接通过数组下标 O(1) 定位。

**哈希冲突**不可避免（鸽巢原理），有两种主流解决方案：
1. **链地址法（Chaining）**：每个桶存储一条链表，冲突元素追加到链尾。平均情况下链表长度为 n/m（装载因子 α），查找 O(1+α)。
2. **开放寻址法（Open Addressing）**：冲突时按某规则探测下一个空桶（线性探测、二次探测、双散列）。

**负载因子 α = n/m** 是性能关键：通常保持 α < 0.75，超过时扩容（重哈希，将数组扩大一倍）以保持均摊 O(1)。`,
    pseudocode: `function hash(key, m):
    h ← 0
    for ch in key: h ← (h × 31 + ord(ch)) mod m
    return h

procedure Insert(T, key, value):
    i ← hash(key, m)
    for node in T[i]:
        if node.key = key: node.value ← value; return
    T[i].append({key, value})

procedure Lookup(T, key):
    i ← hash(key, m)
    for node in T[i]:
        if node.key = key: return node.value
    return NOT_FOUND

procedure Delete(T, key):
    i ← hash(key, m)
    T[i].remove(node where node.key = key)`,
    code: {
      cpp: `template<typename K, typename V>
class HashMap {
    int m;
    vector<list<pair<K,V>>> table;
    int hash(const K& k) {
        size_t h = std::hash<K>{}(k);
        return h % m;
    }
public:
    HashMap(int m = 16) : m(m), table(m) {}

    void insert(const K& key, const V& val) {
        int i = hash(key);
        for (auto& [k, v] : table[i])
            if (k == key) { v = val; return; }
        table[i].push_back({key, val});
    }

    V* lookup(const K& key) {
        int i = hash(key);
        for (auto& [k, v] : table[i])
            if (k == key) return &v;
        return nullptr;
    }

    bool remove(const K& key) {
        int i = hash(key);
        auto& chain = table[i];
        for (auto it = chain.begin(); it != chain.end(); ++it)
            if (it->first == key) { chain.erase(it); return true; }
        return false;
    }
};`,
      python: `class HashMap:
    def __init__(self, m=16):
        self.m = m
        self.table = [[] for _ in range(m)]

    def _hash(self, key):
        h = 0
        for ch in str(key):
            h = (h * 31 + ord(ch)) % self.m
        return h

    def insert(self, key, value):
        i = self._hash(key)
        for item in self.table[i]:
            if item[0] == key:
                item[1] = value
                return
        self.table[i].append([key, value])

    def lookup(self, key):
        i = self._hash(key)
        for k, v in self.table[i]:
            if k == key:
                return v
        return None

    def delete(self, key):
        i = self._hash(key)
        self.table[i] = [(k, v) for k, v in self.table[i] if k != key]`,
    },
    applications: [
      '编程语言运行时的变量符号表（Python dict、Java HashMap）',
      '数据库索引结构（等值查询的哈希索引）',
      '缓存系统（Redis 的 hash 数据类型）',
      '去重与频次统计（Two Sum、Top K Frequent Elements 等经典题）',
    ],
  },

  segtree: {
    slug: 'segtree',
    name: '线段树',
    nameEn: 'Segment Tree',
    category: 'dataStructures',
    difficulty: '进阶',
    fn: segTree,
    viz: 'segtree',
    timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(n)',
    stable: null,
    description: '将数组区间映射为二叉树节点，支持 O(log n) 的区间查询与单点更新。',
    intuition: `线段树（Segment Tree）是一种用于高效处理**区间查询**与**区间/单点更新**的二叉树数据结构。

核心思想：将数组 [0, n-1] 划分为递归的子区间，每个节点存储其对应区间的**聚合信息**（如区间和、最大值、最小值）。

树的结构：
- 根节点对应整个数组
- 每个内部节点 [l, r] 分裂为左子 [l, mid] 和右子 [mid+1, r]
- 叶节点对应单个元素
- 共 **O(n)** 个节点（通常开 4n 大小数组）

**区间查询 O(log n)**：若当前节点区间完全在查询范围内，直接返回；否则分别查询左右子树并合并。最多访问 **4 log n** 个节点。

**单点更新 O(log n)**：从叶节点开始，沿路径向上更新所有祖先节点。

高级变体：懒标记（Lazy Propagation）支持区间整体更新，仍保持 O(log n)。`,
    pseudocode: `// 建树（求区间和）
procedure Build(node, start, end):
    if start = end:
        tree[node] ← arr[start]; return
    mid ← (start + end) / 2
    Build(2·node, start, mid)
    Build(2·node+1, mid+1, end)
    tree[node] ← tree[2·node] + tree[2·node+1]

// 区间查询 [l, r]
procedure Query(node, start, end, l, r):
    if r < start or end < l: return 0    // 不相交
    if l ≤ start and end ≤ r: return tree[node]  // 完全包含
    mid ← (start + end) / 2
    return Query(2·node,start,mid,l,r) + Query(2·node+1,mid+1,end,l,r)

// 单点更新 arr[idx] ← val
procedure Update(node, start, end, idx, val):
    if start = end: tree[node] ← val; return
    mid ← (start + end) / 2
    if idx ≤ mid: Update(2·node, start, mid, idx, val)
    else:         Update(2·node+1, mid+1, end, idx, val)
    tree[node] ← tree[2·node] + tree[2·node+1]`,
    code: {
      cpp: `class SegTree {
    int n;
    vector<int> tree;
public:
    SegTree(vector<int>& a) : n(a.size()), tree(4*a.size()) {
        build(1, 0, n-1, a);
    }
    void build(int node, int s, int e, vector<int>& a) {
        if (s == e) { tree[node] = a[s]; return; }
        int mid = (s+e)/2;
        build(2*node, s, mid, a);
        build(2*node+1, mid+1, e, a);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    int query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[node];
        int mid = (s+e)/2;
        return query(2*node,s,mid,l,r) + query(2*node+1,mid+1,e,l,r);
    }
    void update(int node, int s, int e, int idx, int val) {
        if (s == e) { tree[node] = val; return; }
        int mid = (s+e)/2;
        if (idx <= mid) update(2*node, s, mid, idx, val);
        else update(2*node+1, mid+1, e, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    int query(int l, int r) { return query(1, 0, n-1, l, r); }
    void update(int idx, int val) { update(1, 0, n-1, idx, val); }
};`,
      python: `class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(1, 0, self.n - 1, arr)

    def _build(self, node, s, e, arr):
        if s == e:
            self.tree[node] = arr[s]
            return
        mid = (s + e) // 2
        self._build(2*node, s, mid, arr)
        self._build(2*node+1, mid+1, e, arr)
        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]

    def query(self, l, r):
        return self._query(1, 0, self.n-1, l, r)

    def _query(self, node, s, e, l, r):
        if r < s or e < l: return 0
        if l <= s <= e <= r: return self.tree[node]
        mid = (s + e) // 2
        return self._query(2*node, s, mid, l, r) + \
               self._query(2*node+1, mid+1, e, l, r)

    def update(self, idx, val):
        self._update(1, 0, self.n-1, idx, val)

    def _update(self, node, s, e, idx, val):
        if s == e:
            self.tree[node] = val
            return
        mid = (s + e) // 2
        if idx <= mid: self._update(2*node, s, mid, idx, val)
        else: self._update(2*node+1, mid+1, e, idx, val)
        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]`,
    },
    applications: [
      '区间求和/最值查询（数据库聚合、统计分析）',
      '动态规划优化（DP 中的区间最值查询）',
      '计算几何（扫描线算法中的区间覆盖计数）',
      'LeetCode 307 区域和检索、315 计算右侧小于当前元素的个数等进阶题',
    ],
  },
}

export const ALGORITHM_LIST = Object.values(ALGORITHMS)


export function getAlgorithmsByCategory(catKey) {
  return ALGORITHM_LIST.filter(a => a.category === catKey)
}
