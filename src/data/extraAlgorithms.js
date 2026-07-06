import { memoryTopic, osTopic, protocolTopic, cryptoTopic, structureTopic } from '../algorithms/p0Topics'

// 2026-07 内容补全：每个条目提供真实教学代码（python + cpp）与
// 小白友好的多段 intuition，不再共用占位代码。
function entry({
  slug,
  name,
  nameEn,
  category,
  difficulty = '中等',
  fn,
  viz,
  desc,
  intuition,
  pseudo,
  code,
  time = 'O(1)',
  space = 'O(1)',
  apps = [],
}) {
  return {
    slug,
    name,
    nameEn,
    category,
    difficulty,
    fn,
    viz,
    timeComplexity: { best: time, average: time, worst: time },
    spaceComplexity: space,
    description: desc,
    intuition,
    pseudocode: pseudo,
    code,
    applications: apps,
  }
}

export const EXTRA_ALGORITHMS = {
  // pipelinehazard 曾在这里有一份占位代码的瘦版定义，与 algorithms/co.js 的
  // 完整版（真实 forwarding/stall 代码 + pipelineHazard 步骤函数）冲突：
  // 元数据取 co.js 版、运行时聚合取本文件版，页面内容与目录不一致。已删除，
  // 以 co.js 为唯一来源。generateAlgorithmMeta.cjs 现在会对重复 slug 报错。
  instructioncycle: entry({
    slug: 'instructioncycle',
    name: '指令执行周期',
    nameEn: 'Instruction Cycle',
    category: 'co',
    fn: memoryTopic('instructioncycle'),
    viz: 'memory',
    desc: '按取指、译码、执行、访存、写回展示一条指令如何在 CPU 中完成。',
    intuition: `**把 CPU 想成一位在厨房工作的厨师**：菜谱（程序）放在架子上（内存），厨师并不是"看一眼就把菜变出来"，而是每道菜都严格走五个步骤——**拿菜谱（取指）→ 看懂这一步要做什么（译码）→ 动手切炒（执行）→ 需要时去冰箱取食材（访存）→ 把成品摆上盘（写回）**。

每一步的主角不同：**PC（程序计数器）**像书签，永远指着"下一条该执行的指令在哪"；**IR（指令寄存器）**是厨师手里正在看的那一行菜谱；**ALU** 是案板和炒锅，真正干活的地方；**寄存器组**是触手可及的调料架——比跑一趟冰箱（内存）快得多。

一条指令走完五步，PC 自动指向下一条，周而复始——你电脑上每秒发生几十亿次这样的循环。理解了这个节拍，后面的**流水线**（让五个步骤像工厂流水线一样重叠起来）就是水到渠成的优化。`,
    pseudo: `IR = memory[PC]
decode(IR)
result = execute()
if needs_memory: access_memory()
write_back(result)
PC = next_pc`,
    code: {
      python: `# 迷你 CPU：演示取指-译码-执行-写回的循环
def run(program, memory):
    regs = {'R0': 0, 'R1': 0, 'R2': 0}
    pc = 0
    while pc < len(program):
        instr = program[pc]              # 1. 取指：按 PC 拿指令
        op, *args = instr.split()        # 2. 译码：认出操作和操作数
        if op == 'LOAD':                 # 3+4. 执行（含访存）
            reg, addr = args
            regs[reg] = memory[int(addr)]
        elif op == 'ADD':
            dst, a, b = args
            regs[dst] = regs[a] + regs[b]   # 5. 写回：结果进寄存器
        elif op == 'STORE':
            reg, addr = args
            memory[int(addr)] = regs[reg]
        pc += 1                          # 书签移到下一条
    return regs, memory

program = ['LOAD R0 0', 'LOAD R1 1', 'ADD R2 R0 R1', 'STORE R2 2']
print(run(program, [7, 35, 0]))  # R2 = 42, memory[2] = 42`,
      cpp: `#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

// 迷你 CPU：取指-译码-执行-写回
void run(const std::vector<std::string>& program,
         std::vector<int>& memory) {
    std::unordered_map<std::string, int> regs{{"R0",0},{"R1",0},{"R2",0}};
    size_t pc = 0;
    while (pc < program.size()) {
        std::istringstream ir(program[pc]);   // 1. 取指
        std::string op; ir >> op;             // 2. 译码
        if (op == "LOAD") {
            std::string reg; int addr; ir >> reg >> addr;
            regs[reg] = memory[addr];         // 3+4. 执行 + 访存
        } else if (op == "ADD") {
            std::string dst, a, b; ir >> dst >> a >> b;
            regs[dst] = regs[a] + regs[b];    // 5. 写回
        } else if (op == "STORE") {
            std::string reg; int addr; ir >> reg >> addr;
            memory[addr] = regs[reg];
        }
        pc++;                                 // PC 指向下一条
    }
}`,
    },
    apps: ['组成原理指令周期', '理解 CPU 如何执行程序', '流水线的前置知识'],
  }),

  mainmemorydecode: entry({
    slug: 'mainmemorydecode',
    name: '主存地址译码',
    nameEn: 'Memory Address Decoding',
    category: 'co',
    fn: memoryTopic('mainmemorydecode'),
    viz: 'memory',
    desc: '展示地址线如何经过译码器选择存储芯片与片内单元。',
    intuition: `**找一个内存地址，就像按门牌号找住户**："5 栋 302 室"分两段用——先看"5 栋"找到那幢楼（**片选**），再看"302"在楼内找到房间（**片内偏移**）。内存地址也一样：**高位比特选中某块存储芯片，低位比特在芯片内部定位具体单元**。

为什么要分段？因为一块芯片容量有限，大内存由多块芯片拼成。**译码器**就是"看高位、点亮对应芯片"的选择电路：n 位高地址经过译码器产生 2ⁿ 根片选线，同一时刻只有一根有效——只有被选中的芯片会响应读写，其他芯片保持沉默。

**做题秘诀**：考试常问"用 8K×8 位的芯片组成 64K×8 位内存，需要几根地址线做片选？"套路是——64K 总空间需要 16 根地址线（2¹⁶=64K），每片 8K 用掉低 13 根（2¹³=8K），剩下高 **3 根**接译码器选 8 块芯片（2³=8）。动画里可以直观看到高低位如何分工。`,
    pseudo: `chip_select = decode(high_address_bits)
offset = low_address_bits
data = selected_chip[offset]`,
    code: {
      python: `# 64K 地址空间 = 8 片 8K 芯片：高 3 位片选，低 13 位片内偏移
CHIP_SIZE = 8 * 1024                       # 每片 8K
chips = [[0] * CHIP_SIZE for _ in range(8)]  # 8 块芯片

def read(address):
    chip_id = address >> 13          # 高 3 位：选哪块芯片（译码）
    offset  = address & 0x1FFF       # 低 13 位：片内哪个单元
    return chips[chip_id][offset]

def write(address, value):
    chip_id = address >> 13
    offset  = address & 0x1FFF
    chips[chip_id][offset] = value

write(0x2005, 42)        # 0x2005 = 0010 0000 0000 0101
print(read(0x2005))      # 芯片 1（高3位=001），偏移 0x0005 → 42`,
      cpp: `#include <array>
#include <cstdint>

// 64K 地址空间 = 8 片 8K 芯片：高 3 位片选，低 13 位片内偏移
constexpr int CHIP_SIZE = 8 * 1024;
std::array<std::array<uint8_t, CHIP_SIZE>, 8> chips{};

uint8_t read(uint16_t address) {
    int chipId = address >> 13;        // 译码器：高 3 位点亮某块芯片
    int offset = address & 0x1FFF;     // 低 13 位定位片内单元
    return chips[chipId][offset];
}

void write(uint16_t address, uint8_t value) {
    int chipId = address >> 13;
    int offset = address & 0x1FFF;
    chips[chipId][offset] = value;
}`,
    },
    apps: ['主存扩展题', '地址线/片选信号计算', '理解位运算拆地址'],
  }),

  tlbtranslation: entry({
    slug: 'tlbtranslation',
    name: 'TLB 地址转换',
    nameEn: 'TLB Translation',
    category: 'memoryManagement',
    fn: memoryTopic('tlbtranslation'),
    viz: 'memory',
    desc: '展示虚拟页号查询 TLB、未命中后查页表并回填 TLB 的过程。',
    intuition: `**你会把常打的电话贴在冰箱上**，而不是每次都翻厚厚的通讯录。TLB 就是 CPU 的"冰箱贴"：完整的**页表**（虚拟地址→物理地址的对照表）躺在慢速内存里，每次查它都要多跑一趟；TLB 把**最近用过的几十条**对照关系存进 CPU 里的高速小表格，下次直接秒查。

**没有 TLB 会有多亏？** 分页机制下，程序每访问一次数据，都得先查页表——而页表本身在内存里。等于**每次访存实际要访问两次内存**，速度直接减半。TLB 命中时省掉查页表这一趟，而程序访问有很强的局部性（总在附近打转），**命中率通常高达 99%**，这笔投资极其划算。

**流程只有三步**（动画演示的就是它）：① 虚拟地址拆成"页号 + 页内偏移"；② 拿页号查 TLB——**命中**则立即得到物理页框号；**未命中**才去内存查页表，并把结果**回填**进 TLB（挤掉一条旧记录）；③ 物理页框号拼上偏移 = 物理地址。和 Cache 的思想同源：**快的存最近常用的，慢的存全部**——计算机存储体系从上到下全是这一招。`,
    pseudo: `vpn, offset = split(virtual_address)
if TLB has vpn:
    ppn = TLB[vpn]
else:
    ppn = page_table[vpn]
    TLB.insert(vpn, ppn)
physical_address = ppn + offset`,
    code: {
      python: `# TLB：页表的高速缓存（FIFO 淘汰的教学版）
PAGE_SIZE = 4096
page_table = {0: 5, 1: 9, 2: 3, 3: 7}   # 完整页表（住在慢速内存）
tlb = {}                                  # TLB（CPU 内的高速小表）
TLB_CAPACITY = 2
hits = misses = 0

def translate(vaddr):
    global hits, misses
    vpn, offset = divmod(vaddr, PAGE_SIZE)  # 拆成 页号 + 页内偏移
    if vpn in tlb:
        hits += 1                        # TLB 命中：免查页表
        ppn = tlb[vpn]
    else:
        misses += 1                      # 未命中：多跑一趟内存查页表
        ppn = page_table[vpn]
        if len(tlb) >= TLB_CAPACITY:     # 回填 TLB，挤掉最早的一条
            tlb.pop(next(iter(tlb)))
        tlb[vpn] = ppn
    return ppn * PAGE_SIZE + offset      # 物理页框号 拼 偏移

for a in [0x0010, 0x0020, 0x1010, 0x0030]:  # 局部性 → 大多命中
    translate(a)
print(f"命中 {hits} 次, 未命中 {misses} 次")`,
      cpp: `#include <deque>
#include <unordered_map>

constexpr int PAGE_SIZE = 4096;
std::unordered_map<int, int> pageTable = {{0,5},{1,9},{2,3},{3,7}};
std::unordered_map<int, int> tlb;    // TLB：页表的高速缓存
std::deque<int> fifo;                // 记录进入顺序，容量满时淘汰最旧
constexpr size_t TLB_CAPACITY = 2;

long translate(long vaddr) {
    int vpn = vaddr / PAGE_SIZE, offset = vaddr % PAGE_SIZE;
    auto it = tlb.find(vpn);
    int ppn;
    if (it != tlb.end()) {
        ppn = it->second;                // 命中：免查页表
    } else {
        ppn = pageTable[vpn];            // 未命中：查慢速页表
        if (tlb.size() >= TLB_CAPACITY) {  // 回填，FIFO 淘汰
            tlb.erase(fifo.front());
            fifo.pop_front();
        }
        tlb[vpn] = ppn;
        fifo.push_back(vpn);
    }
    return (long)ppn * PAGE_SIZE + offset;
}`,
    },
    apps: ['OS 虚拟内存', '组成原理存储层次', '地址转换面试题'],
  }),

  virtualphysical: entry({
    slug: 'virtualphysical',
    name: '虚拟地址到物理地址',
    nameEn: 'Virtual to Physical Address',
    category: 'memoryManagement',
    fn: memoryTopic('virtualphysical'),
    viz: 'memory',
    desc: '展示页号查页表、页框号拼接偏移得到物理地址的过程。',
    intuition: `**每个程序都以为自己独占一台"整洁的电脑"**：地址从 0 开始、连续、想用多少用多少。这是操作系统精心营造的幻觉——就像酒店给每位客人的房卡上印着"你的 1 号房、2 号房……"，而实际入住的物理房间可能是 507、1214，分散在各层。**虚拟地址是房卡上的号，物理地址是真实房间号，页表就是前台的对照登记簿**。

**翻译过程只有一次查表**：把虚拟地址切成两半——**页号**（第几页）和**页内偏移**（页内第几个字节）。拿页号去页表里查出**页框号**（真实内存里的第几块），页框号拼上原封不动的偏移，就是物理地址。注意偏移不用翻译：页和页框一样大（通常 4KB），"房间内部的布局"是一样的。

**如果查到的表项标着"无效"呢？** 那就是**缺页 (page fault)**——这页可能还在磁盘上没装进内存。CPU 会暂停程序，让操作系统把这页从磁盘搬进来、更新页表，再重新执行刚才那条指令。这套机制的了不起之处：**程序可以使用比物理内存更大的地址空间**,不够的部分自动在磁盘和内存之间倒腾——这就是"虚拟内存"名字的由来。`,
    pseudo: `page, offset = split(VA)
pte = page_table[page]
if not pte.valid: page_fault()
PA = pte.frame * page_size + offset`,
    code: {
      python: `# 分页地址转换：页号查表 → 页框号拼偏移
PAGE_SIZE = 4096

# 页表：每项 = (是否在内存, 页框号)
page_table = [
    (True, 5),    # 虚拟页 0 → 物理页框 5
    (True, 2),    # 虚拟页 1 → 物理页框 2
    (False, -1),  # 虚拟页 2 不在内存 → 访问会缺页
    (True, 8),
]

def translate(vaddr):
    vpn, offset = divmod(vaddr, PAGE_SIZE)   # 拆：页号 + 页内偏移
    valid, frame = page_table[vpn]
    if not valid:
        raise RuntimeError(f"缺页！虚拟页 {vpn} 不在内存，需从磁盘调入")
    return frame * PAGE_SIZE + offset        # 页框号拼偏移

print(hex(translate(0x1234)))  # 页1偏移0x234 → 页框2 → 0x2234
translate(0x2000)              # 页2 → 触发缺页异常`,
      cpp: `#include <stdexcept>
#include <vector>

constexpr int PAGE_SIZE = 4096;

struct PTE { bool valid; int frame; };   // 页表项
std::vector<PTE> pageTable = {
    {true, 5}, {true, 2}, {false, -1}, {true, 8},
};

long translate(long vaddr) {
    int vpn    = vaddr / PAGE_SIZE;      // 页号：查表用
    int offset = vaddr % PAGE_SIZE;      // 偏移：原样保留
    const PTE& pte = pageTable[vpn];
    if (!pte.valid)
        throw std::runtime_error("page fault: 该页不在内存");
    return (long)pte.frame * PAGE_SIZE + offset;
}`,
    },
    apps: ['页表计算题', '缺页异常理解', '虚拟内存原理'],
  }),

  contiguousfit: entry({
    slug: 'contiguousfit',
    name: '连续内存分配 First/Best/Worst Fit',
    nameEn: 'Contiguous Memory Fit',
    category: 'memoryManagement',
    fn: memoryTopic('contiguousfit'),
    viz: 'memory',
    desc: '比较首次适应、最佳适应、最坏适应如何选择空闲分区。',
    intuition: `**在停车场找车位**：场里散布着大小不一的空位，你的车要停进某一个。三种性格的司机对应三种经典策略——**首次适应 (First Fit)**：从入口开始，见到第一个塞得下的就停,省时省力；**最佳适应 (Best Fit)**：把全场扫一遍，挑"刚好塞下、浪费最少"的那个；**最坏适应 (Worst Fit)**：专挑最大的空位停，理由是"剩下的空间还够停别的车"。

**没有全赢的策略,只有不同的代价**：Best Fit 看似节俭，却会留下一地"塞不进任何车的窄缝"——这就是**外部碎片**：空闲总量明明够，却因为不连续而谁也用不了。First Fit 快,但入口附近会被切得越来越碎。Worst Fit 避免了窄缝,却消耗掉了珍贵的大空位,大作业来了反而没地方。

**外部碎片是连续分配的宿命**——只要要求"一整块连续空间"，切来切去必然产生边角料。根治办法有两个方向：定期"挪车归整"（**紧凑/compaction**，代价是搬移开销），或者干脆放弃连续性——把内存切成固定大小的页,允许离散存放,这就通向了**分页机制**。`,
    pseudo: `for block in free_list according to strategy:
    if block.size >= request:
        allocate block
        split remainder
        break`,
    code: {
      python: `# 三种连续分配策略：free 是 [起址, 大小] 的空闲分区表
def allocate(free, request, strategy='first'):
    candidates = [b for b in free if b[1] >= request]
    if not candidates:
        return None                        # 没有洞塞得下：分配失败
    if strategy == 'first':
        chosen = candidates[0]             # 第一个塞得下的
    elif strategy == 'best':
        chosen = min(candidates, key=lambda b: b[1])  # 最合身的
    else:  # 'worst'
        chosen = max(candidates, key=lambda b: b[1])  # 最大的
    start = chosen[0]
    chosen[0] += request                   # 切走前半段
    chosen[1] -= request
    if chosen[1] == 0:
        free.remove(chosen)                # 恰好用完，洞消失
    return start

free = [[0, 100], [200, 50], [300, 220]]
print(allocate(free, 40, 'best'))   # 200：挑 50 的洞，剩 10 的碎片
print(free)                          # [[0,100],[240,10],[300,220]]`,
      cpp: `#include <vector>

struct Block { int start, size; };

// strategy: 0=First Fit  1=Best Fit  2=Worst Fit
int allocate(std::vector<Block>& free, int request, int strategy) {
    int chosen = -1;
    for (int i = 0; i < (int)free.size(); i++) {
        if (free[i].size < request) continue;
        if (chosen == -1) { chosen = i; if (strategy == 0) break; }
        else if (strategy == 1 && free[i].size < free[chosen].size)
            chosen = i;                    // Best：更小且塞得下
        else if (strategy == 2 && free[i].size > free[chosen].size)
            chosen = i;                    // Worst：更大
    }
    if (chosen == -1) return -1;           // 外部碎片：总量够也可能失败
    int addr = free[chosen].start;
    free[chosen].start += request;         // 切走前半段
    free[chosen].size  -= request;
    if (free[chosen].size == 0) free.erase(free.begin() + chosen);
    return addr;
}`,
    },
    apps: ['OS 内存管理', '外部碎片分析', 'malloc 实现思想'],
  }),

  buddy: entry({
    slug: 'buddy',
    name: '伙伴系统 Buddy',
    nameEn: 'Buddy System',
    category: 'memoryManagement',
    fn: memoryTopic('buddy'),
    viz: 'memory',
    desc: '展示按 2 的幂拆分和释放时伙伴合并的内存分配过程。',
    intuition: `**切蛋糕规则**：一整块蛋糕只允许**对半切**。有人要一小块？把整块切成两半，还大就再对半切……直到切出"刚好够大"的一块给他。每次对半切出的两块互为**伙伴 (buddy)**——它们大小相同、位置相邻,而且"谁是谁的伙伴"永远固定。

**为什么规定只能对半切？** 好处全在"归还"时显现:一块内存被释放后,**只需看它唯一的伙伴是否也空闲**——是,就合并回大块,合并后继续看更大的伙伴,层层往上合;否,就先留着。不用像通用分配器那样扫描左右邻居,**伙伴的地址一个异或运算就能算出来**（addr XOR size）,判断合并 O(1)。

**代价是内部碎片**:申请 65KB 会拿到 128KB（向上取整到 2 的幂）,浪费近一半。但换来的是极简的管理逻辑和高效的分裂/合并——**Linux 内核的物理页分配器（Buddy System）至今就是这么管理全部物理内存的**,你每开一个程序,背后都在跑这套"切蛋糕"算法。`,
    pseudo: `need = next_power_of_two(request)
while no free block of need:
    split larger block into two buddies
allocate one block
on free: merge with free buddy`,
    code: {
      python: `# 伙伴系统教学版：free_lists[k] 存所有大小为 2^k 的空闲块起址
MAX_ORDER = 5                       # 管理 2^5 = 32 单位的内存
free_lists = {k: [] for k in range(MAX_ORDER + 1)}
free_lists[MAX_ORDER] = [0]         # 初始：一整块 32

def alloc(size):
    k = max(size - 1, 0).bit_length()    # 向上取整到 2^k
    j = k
    while j <= MAX_ORDER and not free_lists[j]:
        j += 1                            # 找更大的块来切
    if j > MAX_ORDER:
        return None
    while j > k:                          # 对半切，切到刚好 2^k
        addr = free_lists[j].pop()
        j -= 1
        free_lists[j] += [addr, addr + (1 << j)]  # 两个伙伴入表
    return free_lists[k].pop()

def free(addr, size):
    k = max(size - 1, 0).bit_length()
    while k < MAX_ORDER:
        buddy = addr ^ (1 << k)           # 伙伴地址 = 异或块大小！
        if buddy not in free_lists[k]:
            break                         # 伙伴还在用，不能合并
        free_lists[k].remove(buddy)       # 伙伴也空闲 → 合并成大块
        addr = min(addr, buddy)
        k += 1
    free_lists[k].append(addr)

a = alloc(5)    # 要 5，实得 8（2^3）——内部碎片是代价
free(a, 5)      # 释放后逐层与伙伴合并，恢复整块 32`,
      cpp: `#include <algorithm>
#include <vector>

constexpr int MAX_ORDER = 5;              // 管理 2^5 = 32 单位
std::vector<int> freeLists[MAX_ORDER + 1];

int orderOf(int size) {                   // 向上取整到 2^k 的 k
    int k = 0;
    while ((1 << k) < size) k++;
    return k;
}

int alloc(int size) {
    int k = orderOf(size), j = k;
    while (j <= MAX_ORDER && freeLists[j].empty()) j++;
    if (j > MAX_ORDER) return -1;
    while (j > k) {                       // 大块对半切
        int addr = freeLists[j].back(); freeLists[j].pop_back();
        j--;
        freeLists[j].push_back(addr);
        freeLists[j].push_back(addr + (1 << j));
    }
    int addr = freeLists[k].back(); freeLists[k].pop_back();
    return addr;
}

void freeBlock(int addr, int size) {
    int k = orderOf(size);
    while (k < MAX_ORDER) {
        int buddy = addr ^ (1 << k);      // 伙伴地址：一个异或搞定
        auto& lst = freeLists[k];
        auto it = std::find(lst.begin(), lst.end(), buddy);
        if (it == lst.end()) break;       // 伙伴在用，停止合并
        lst.erase(it);
        addr = std::min(addr, buddy);     // 合并成上一级大块
        k++;
    }
    freeLists[k].push_back(addr);
}`,
    },
    apps: ['Linux 物理页分配器', '内部碎片与合并', 'jemalloc 等分配器基础'],
  }),

  deadlockgraph: entry({
    slug: 'deadlockgraph',
    name: '死锁检测资源分配图',
    nameEn: 'Resource Allocation Graph',
    category: 'synchronization',
    fn: osTopic('deadlockgraph'),
    viz: 'memory',
    desc: '用资源分配图展示持有边、请求边和等待环。',
    intuition: `**经典僵局**：小明拿着筷子等勺子,小红拿着勺子等筷子——谁都不肯先放手,谁都吃不上饭。这就是**死锁**:每个人都持有对方需要的东西,又都在等对方先让步。操作系统里,"人"是进程,"餐具"是资源(打印机、锁、文件……),一模一样的僵局每天都可能发生。

**资源分配图把僵局画出来**:进程画成圆圈,资源画成方块;**持有边**(资源→进程,"这东西在他手里")和**请求边**(进程→资源,"他在等这东西")。上面的僵局画出来就是:筷子→小明→勺子→小红→筷子——**一个环**!

**环就是死锁的信号**:每类资源只有一个实例时,**有环 ⇔ 必死锁**;资源有多个实例时,有环只是"可能死锁"(还要进一步算)。所以死锁检测的核心就是**在图里找环**——把资源节点"收缩"掉得到进程间的等待图 (wait-for graph),跑一遍 DFS,发现"走着走着回到了正在访问的节点"即有环。找到死锁后的处置通常很粗暴:挑一个受害进程杀掉,释放它的资源,打破循环。`,
    pseudo: `build wait-for graph
if graph has cycle:
    report deadlock`,
    code: {
      python: `# 死锁检测：在"等待图"里找环（DFS 三色标记法）
# wait_for[p] = p 正在等待的进程列表（经资源边收缩而来）
def has_deadlock(wait_for):
    WHITE, GRAY, BLACK = 0, 1, 2       # 未访问 / 正在访问 / 已完成
    color = {p: WHITE for p in wait_for}

    def dfs(p):
        color[p] = GRAY                # 进入 p 的访问路径
        for q in wait_for.get(p, []):
            if color[q] == GRAY:       # 撞上"正在访问"的节点 → 有环！
                return True
            if color[q] == WHITE and dfs(q):
                return True
        color[p] = BLACK               # p 的所有路都走完，无环
        return False

    return any(color[p] == WHITE and dfs(p) for p in wait_for)

# 小明等小红（要她的勺子），小红等小明（要他的筷子）
print(has_deadlock({'小明': ['小红'], '小红': ['小明']}))  # True
print(has_deadlock({'A': ['B'], 'B': ['C'], 'C': []}))      # False`,
      cpp: `#include <unordered_map>
#include <vector>

// 等待图找环：0=未访问 1=正在访问 2=已完成
using Graph = std::unordered_map<int, std::vector<int>>;

bool dfs(int p, const Graph& g, std::unordered_map<int, int>& color) {
    color[p] = 1;                       // 标记"正在访问"
    auto it = g.find(p);
    if (it != g.end())
        for (int q : it->second) {
            if (color[q] == 1) return true;   // 环：死锁！
            if (color[q] == 0 && dfs(q, g, color)) return true;
        }
    color[p] = 2;
    return false;
}

bool hasDeadlock(const Graph& waitFor) {
    std::unordered_map<int, int> color;
    for (auto& [p, _] : waitFor)
        if (color[p] == 0 && dfs(p, waitFor, color)) return true;
    return false;
}`,
    },
    apps: ['OS 死锁检测', '银行家算法前置知识', '数据库锁等待分析'],
  }),

  producerconsumer: entry({
    slug: 'producerconsumer',
    name: '生产者消费者',
    nameEn: 'Producer Consumer',
    category: 'synchronization',
    fn: osTopic('producerconsumer'),
    viz: 'memory',
    desc: '展示 empty/full/mutex 三个信号量如何协调有界缓冲区。',
    intuition: `**包子铺的蒸笼**:师傅(生产者)不停做包子放进蒸笼,顾客(消费者)不停从蒸笼取包子。蒸笼格子有限——**满了师傅就得歇手,空了顾客就得排队等**。另外蒸笼口窄,同一时刻只能一个人伸手,否则会撞。这三条规矩,就是并发编程最经典的"生产者-消费者问题"。

**三个信号量各管一条规矩**(信号量=带等待功能的计数器,P/wait 减一、不够就睡,V/signal 加一、唤醒等的人):
- **empty**(初值=格子数):还剩几个空格。师傅放包子前 P(empty)——没空格就睡
- **full**(初值=0):现有几个包子。顾客取包子前 P(full)——没包子就睡
- **mutex**(初值=1):蒸笼口的独占权,保证同一时刻只有一个人在操作

**最容易考的坑:P 的顺序不能反!** 正确顺序是"先 P(empty/full) 再 P(mutex)"。反过来会怎样?师傅先抢到蒸笼口(P(mutex)),再发现没空格(P(empty) 睡着)——**他抱着蒸笼口睡着了**,顾客想取包子腾格子却进不去,全店僵死。这就是死锁,而且是考试和真实代码里都极常见的死锁。`,
    pseudo: `producer:
    wait(empty); wait(mutex)
    put()
    signal(mutex); signal(full)
consumer:
    wait(full); wait(mutex)
    get()
    signal(mutex); signal(empty)`,
    code: {
      python: `# 生产者-消费者：三个信号量守护有界缓冲区
import threading, queue, time

BUF_SIZE = 3
buffer = []
empty = threading.Semaphore(BUF_SIZE)  # 空格数，初值=格子数
full  = threading.Semaphore(0)         # 包子数，初值=0
mutex = threading.Lock()               # 蒸笼口独占

def producer():
    for i in range(5):
        empty.acquire()        # P(empty)：没空格就等（顺序不能反！）
        with mutex:            # P(mutex)：独占蒸笼口
            buffer.append(i)
            print(f"放入 {i}, 蒸笼: {buffer}")
        full.release()         # V(full)：喊醒等包子的顾客

def consumer():
    for _ in range(5):
        full.acquire()         # P(full)：没包子就等
        with mutex:
            item = buffer.pop(0)
            print(f"取走 {item}, 蒸笼: {buffer}")
        empty.release()        # V(empty)：喊醒等空格的师傅

t1 = threading.Thread(target=producer)
t2 = threading.Thread(target=consumer)
t1.start(); t2.start(); t1.join(); t2.join()`,
      cpp: `#include <condition_variable>
#include <mutex>
#include <queue>

// C++ 惯用做法：mutex + 两个条件变量（语义与信号量版一致）
template <typename T>
class BoundedBuffer {
    std::queue<T> buf;
    size_t cap;
    std::mutex m;
    std::condition_variable notFull, notEmpty;
public:
    explicit BoundedBuffer(size_t capacity) : cap(capacity) {}

    void put(T item) {
        std::unique_lock<std::mutex> lk(m);
        notFull.wait(lk, [&]{ return buf.size() < cap; }); // 满则睡
        buf.push(std::move(item));
        notEmpty.notify_one();          // 喊醒等包子的消费者
    }

    T get() {
        std::unique_lock<std::mutex> lk(m);
        notEmpty.wait(lk, [&]{ return !buf.empty(); });    // 空则睡
        T item = std::move(buf.front());
        buf.pop();
        notFull.notify_one();           // 喊醒等空格的生产者
        return item;
    }
};`,
    },
    apps: ['PV 操作', '并发同步经典题', '消息队列的原理雏形'],
  }),

  readerswriters: entry({
    slug: 'readerswriters',
    name: '读者写者问题',
    nameEn: 'Readers Writers',
    category: 'synchronization',
    fn: osTopic('readerswriters'),
    viz: 'memory',
    desc: '展示多个读者可并发、写者必须独占的同步规则。',
    intuition: `**图书馆阅览室的规矩**:看书的人(读者)可以同时进来一百个——你看你的我看我的,互不打扰。但装修队(写者)进场时必须**清场**:一个读者都不能留,更不允许两支装修队同时开工。这就是读者-写者问题的全部规则:**读读共享,读写互斥,写写互斥**。

**巧妙之处在"集体钥匙"**:如果每个读者都单独去抢锁,读者之间就白白互斥了。经典解法让读者们**共享一把锁**——用计数器 readCount 记录场内人数:**第一个进门的读者负责替全体拿锁**(把装修队挡在门外),中间进出的读者只改计数,**最后一个离场的读者负责还锁**(放装修队进场)。当然,改 readCount 本身也要一把小锁保护,不然两人同时"进门"会把计数改乱。

**隐藏的坑:写者可能饿死**。读者络绎不绝的话,readCount 永远降不到 0,装修队等到天荒地老——这叫**饥饿 (starvation)**。"读者优先"版本(本页演示的)有这个问题;工程里常用"写者优先"或公平排队来救,比如数据库的读写锁就要仔细权衡:读多写少用读优先吞吐高,写操作重要就得防饿。`,
    pseudo: `reader:
    readCount++
    if readCount == 1: wait(rwMutex)
    read()
    readCount--
    if readCount == 0: signal(rwMutex)
writer:
    wait(rwMutex); write(); signal(rwMutex)`,
    code: {
      python: `# 读者-写者（读者优先版）：第一个读者拿锁，最后一个读者还锁
import threading

rw_mutex   = threading.Lock()   # 读写互斥的"大锁"
count_lock = threading.Lock()   # 保护 read_count 的"小锁"
read_count = 0

def reader(name):
    global read_count
    with count_lock:
        read_count += 1
        if read_count == 1:      # 第一个读者：替全体挡住写者
            rw_mutex.acquire()
    print(f"{name} 正在读（场内读者 {read_count} 人）")
    with count_lock:
        read_count -= 1
        if read_count == 0:      # 最后一个读者：放写者进场
            rw_mutex.release()

def writer(name):
    with rw_mutex:               # 写者必须独占
        print(f"{name} 正在写（独占）")

threads = [threading.Thread(target=reader, args=(f"读者{i}",)) for i in range(3)]
threads.append(threading.Thread(target=writer, args=("写者A",)))
for t in threads: t.start()
for t in threads: t.join()`,
      cpp: `#include <mutex>
#include <shared_mutex>
#include <string>

// 现代 C++ 直接内置了读写锁：shared_mutex
std::shared_mutex rwLock;
std::string document = "v1";

void reader() {
    std::shared_lock lock(rwLock);   // 共享锁：多个读者可同时持有
    auto snapshot = document;        // 并发读，互不阻塞
}

void writer() {
    std::unique_lock lock(rwLock);   // 独占锁：清场后才能写
    document = "v2";                 // 此刻没有任何读者/其他写者
}
// 教学版"第一个/最后一个读者管锁"的手工实现见 Python 侧；
// 生产代码优先用标准库读写锁，注意读多写少时写者的饥饿问题。`,
    },
    apps: ['数据库读写锁', 'OS 同步互斥', 'RWLock/shared_mutex 原理'],
  }),

  dnsresolve: entry({
    slug: 'dnsresolve',
    name: 'DNS 递归 / 迭代解析',
    nameEn: 'DNS Resolution',
    category: 'network',
    fn: protocolTopic('dnsresolve'),
    viz: 'protocol',
    desc: '展示本地 DNS 向根、顶级域、权威 DNS 逐级查询的过程。',
    intuition: `**你在浏览器输入 www.example.com,电脑其实一脸茫然**——网络世界只认 IP 地址(如 93.184.216.34),不认名字。DNS 就是全球的"电话簿查询系统",把好记的域名翻译成机器要的 IP。但这本电话簿太大了,没有任何一台服务器存得下全部,于是它被设计成**分层打听**的体系。

**打听的过程像问路**:你(浏览器)只问身边的**本地 DNS**(通常是运营商的);本地 DNS 替你跑腿——先问**根服务器**,根说"com 的事去问 com 顶级域服务器";再问**顶级域**,它说"example.com 归这台权威服务器管";最后问**权威服务器**,拿到真正的 IP。注意两种问法的名字:你对本地 DNS 是**递归查询**("你必须给我最终答案"),本地 DNS 对外是**迭代查询**("你告诉我下一个该问谁就行")。

**为什么平时感觉不到这一长串?** 因为**缓存**无处不在:浏览器、操作系统、本地 DNS 都会记住最近查过的结果(按 TTL 过期)。第一次访问一个网站可能要走完全程几十毫秒,之后几乎瞬间命中缓存。面试高频题"输入 URL 后发生了什么"——DNS 解析就是这故事的第一章。`,
    pseudo: `query local DNS
ask root        → "去问 com 顶级域"
ask TLD         → "去问 example.com 的权威服务器"
ask authoritative → 拿到 IP
cache result（按 TTL 过期）`,
    code: {
      python: `# DNS 迭代解析模拟：本地 DNS 逐级打听，层层缓存
ROOT = {'com': 'TLD-com', 'org': 'TLD-org'}
TLD  = {'example.com': 'NS-example', 'test.com': 'NS-test'}
AUTH = {'www.example.com': '93.184.216.34'}

cache = {}

def resolve(domain):
    if domain in cache:                    # 缓存命中：秒回
        return cache[domain], '缓存'
    # 迭代查询：每一级只告诉你"下一个该问谁"
    suffix = domain.split('.', 1)[1]       # www.example.com → example.com
    tld_key = suffix.split('.')[-1]        # → com
    hops = []
    hops.append(f"问根服务器 → 去问 {ROOT[tld_key]}")
    hops.append(f"问顶级域   → 去问 {TLD[suffix]}")
    ip = AUTH[domain]
    hops.append(f"问权威服务器 → {ip}")
    cache[domain] = ip                     # 回填缓存（真实世界带 TTL）
    return ip, ' | '.join(hops)

print(resolve('www.example.com'))  # 三跳拿到 IP
print(resolve('www.example.com'))  # 第二次：缓存直接命中`,
      cpp: `#include <optional>
#include <string>
#include <unordered_map>

// DNS 迭代解析骨架：root → TLD → 权威，结果进缓存
std::unordered_map<std::string, std::string> cache;
std::unordered_map<std::string, std::string> authoritative = {
    {"www.example.com", "93.184.216.34"},
};

std::optional<std::string> resolve(const std::string& domain) {
    auto hit = cache.find(domain);
    if (hit != cache.end()) return hit->second;   // 缓存命中

    // 真实实现：依次向根/TLD/权威服务器发 UDP 53 查询，
    // 每级应答告知"下一个该问谁"（迭代），此处直接查表示意
    auto it = authoritative.find(domain);
    if (it == authoritative.end()) return std::nullopt;
    cache[domain] = it->second;                   // 回填缓存（带 TTL）
    return it->second;
}`,
    },
    apps: ['输入 URL 后发生了什么（第一章）', '计算机网络高频题', 'CDN 调度原理'],
  }),
  httpflow: entry({
    slug: 'httpflow',
    name: 'HTTP 请求响应',
    nameEn: 'HTTP Request Response',
    category: 'network',
    fn: protocolTopic('httpflow'),
    viz: 'protocol',
    desc: '展示浏览器发请求、服务器处理并返回响应的完整链路。',
    intuition: `**HTTP 就是一次"点外卖"**:你(浏览器)下单——"我要 example.com 家的 /index.html 这道菜";商家(服务器)接单、备餐,把菜连同小票送回来。**一问一答,答完这单就结束**——HTTP 的全部骨架就这么简单,整个万维网都建立在这一问一答之上。

**订单(请求)和外卖(响应)都有固定格式**:
请求 = **请求行**(GET /index.html HTTP/1.1——做什么+要哪个)+ **头部**(Host、Cookie 等备注信息)+ 可选**正文**(POST 提交的表单数据)。
响应 = **状态行**(HTTP/1.1 200 OK)+ **头部**(Content-Type 告诉你这是 HTML 还是图片)+ **正文**(真正的页面内容)。

**状态码是商家的答复暗号**,按第一位数字分家族:**2xx 成功**(200 OK);**3xx 转移**(301/302 "搬家了,去新地址");**4xx 你的锅**(404 没这道菜,403 不卖你);**5xx 商家的锅**(500 后厨着火了)。排查任何 Web 问题,第一件事永远是打开 F12 看状态码——它直接告诉你该找谁负责。另外注意 HTTP 本身**无状态**(商家不记得你是谁),所以需要 Cookie/Session 来"办会员卡"。`,
    pseudo: `建立 TCP 连接（HTTPS 再加 TLS 握手）
浏览器发送: 请求行 + 头部 + [正文]
服务器处理: 路由 → 业务逻辑 → 组装响应
服务器返回: 状态行 + 头部 + 正文
浏览器渲染 / 根据状态码处理`,
    code: {
      python: `# 用原生 socket 手写一次 HTTP 请求，看清"报文原文"
import socket

def http_get(host, path='/'):
    s = socket.create_connection((host, 80))
    # 请求 = 请求行 + 头部 + 空行（\\r\\n\\r\\n 表示头部结束）
    request = (f"GET {path} HTTP/1.1\\r\\n"
               f"Host: {host}\\r\\n"
               f"Connection: close\\r\\n"
               f"\\r\\n")
    s.sendall(request.encode())
    response = b''
    while chunk := s.recv(4096):
        response += chunk
    s.close()
    head, _, body = response.partition(b'\\r\\n\\r\\n')
    status_line = head.split(b'\\r\\n')[0].decode()
    return status_line, body[:100]

status, body = http_get('example.com')
print(status)   # HTTP/1.1 200 OK ← 状态码在这
print(body)     # 响应正文（HTML 开头）`,
      cpp: `// HTTP 报文的最小解析器：从状态行提取状态码
#include <sstream>
#include <string>

struct HttpResponse {
    int status = 0;
    std::string statusText;
    std::string body;
};

HttpResponse parse(const std::string& raw) {
    HttpResponse r;
    std::istringstream in(raw);
    std::string version;
    in >> version >> r.status;           // "HTTP/1.1" "200"
    std::getline(in, r.statusText);      // " OK"
    // 头部到空行为止，其后是正文
    auto pos = raw.find("\\r\\n\\r\\n");
    if (pos != std::string::npos) r.body = raw.substr(pos + 4);
    return r;
}
// 2xx 成功 / 3xx 重定向 / 4xx 客户端错 / 5xx 服务器错——
// 排查 Web 问题第一步永远是看状态码。`,
    },
    apps: ['Web 基础', 'URL 到页面全过程', 'F12 抓包排错'],
  }),
  tlshandshake: entry({
    slug: 'tlshandshake',
    name: 'TLS 握手',
    nameEn: 'TLS Handshake',
    category: 'network',
    fn: protocolTopic('tlshandshake'),
    viz: 'protocol',
    desc: '展示 ClientHello、证书验证、密钥交换和加密通信建立。',
    intuition: `**浏览器地址栏那把小锁,是这样挂上的**。HTTP 是明文裸奔——路上任何一个节点都能偷看、篡改你的数据。HTTPS = HTTP + TLS,而 TLS 开场的"握手",要在**完全公开的信道上**解决两个难题:①对面真的是银行官网,不是骗子冒充的?②怎么当着偷听者的面商量出一把只有我俩知道的密钥?

**难题一靠证书(身份证+介绍信)**:服务器出示证书——里面有它的公钥,并由**CA(证书颁发机构)**用私钥签过名。浏览器出厂就内置了受信任 CA 的公钥,验一下签名就知道证书真伪。这是一条**信任链**:你信浏览器→浏览器信 CA→CA 担保这个网站。骗子伪造不出 CA 的签名,冒充即败露。

**难题二靠密钥交换的数学魔法**(如 Diffie-Hellman):双方各自公开一个"混合值",偷听者全程看得见,却因为**离散对数难题**算不出双方最终合成的共享密钥。**为什么之后要换对称加密?** 非对称加密安全但慢几百倍——所以只用它完成"验明正身+商量钥匙",之后的大量 HTTP 数据全部改用协商出的对称密钥(如 AES)加密,又快又安全。握手一次,受益整个会话。`,
    pseudo: `ClientHello（我支持这些加密算法 + 随机数）
ServerHello + Certificate（选定算法 + 出示证书）
浏览器验证证书（CA 签名 → 信任链）
密钥交换（DH/ECDHE → 双方算出相同会话密钥）
Finished（切换对称加密，开始安全传输）`,
    code: {
      python: `# TLS 握手骨架模拟：证书验证 + DH 密钥交换 → 会话密钥
import hashlib

# ── 难题一：验证书（简化为"CA 签名对得上就信"）──
def verify_certificate(cert, ca_public_key):
    expected = hashlib.sha256(
        (cert['domain'] + cert['server_pub']).encode()).hexdigest()
    return cert['ca_signature'] == expected[:16]  # 教学简化

# ── 难题二：DH 密钥交换（公开信道上算出共享密钥）──
p, g = 23, 5                    # 公开参数（真实场景是大素数）
client_secret = 6               # 双方各自的私密数字，绝不发送
server_secret = 15

client_public = pow(g, client_secret, p)   # 8  ← 偷听者看得见
server_public = pow(g, server_secret, p)   # 19 ← 偷听者看得见

# 各自用"对方的公开值 + 自己的秘密"合成——结果神奇地相同
session_key_client = pow(server_public, client_secret, p)
session_key_server = pow(client_public, server_secret, p)
print(session_key_client == session_key_server)  # True → 会话密钥 2
# 偷听者知道 p,g,8,19，却因离散对数难题算不出 2
# 此后所有 HTTP 数据用这把对称密钥加密（AES 等）`,
      cpp: `#include <cstdint>

// DH 密钥交换核心：模幂运算（快速幂）
uint64_t powMod(uint64_t base, uint64_t exp, uint64_t mod) {
    uint64_t result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

// 握手骨架：双方各自持有 secret，只交换 public 值
// 偷听者看得到 p、g、两个 public，却算不出 sessionKey
void handshakeDemo() {
    uint64_t p = 23, g = 5;                    // 公开参数
    uint64_t clientSecret = 6, serverSecret = 15;
    uint64_t clientPublic = powMod(g, clientSecret, p);
    uint64_t serverPublic = powMod(g, serverSecret, p);
    uint64_t keyAtClient = powMod(serverPublic, clientSecret, p);
    uint64_t keyAtServer = powMod(clientPublic, serverSecret, p);
    // keyAtClient == keyAtServer → 之后切换 AES 等对称加密
}`,
    },
    apps: ['HTTPS 原理', '网络安全基础', '中间人攻击防御'],
  }),
  ipv4fragment: entry({
    slug: 'ipv4fragment',
    name: 'IPv4 分片重组',
    nameEn: 'IPv4 Fragmentation',
    category: 'network',
    fn: protocolTopic('ipv4fragment'),
    viz: 'protocol',
    desc: '展示超过 MTU 的 IP 数据报如何分片并在目标主机重组。',
    intuition: `**寄一张大床垫,快递说"单件不能超 1 米"怎么办?** 拆!拆成三个包裹分别寄,每个包裹上写清楚:同一订单号、这是第几段、后面还有没有。收件人凑齐所有包裹按顺序拼回床垫。IPv4 分片一模一样:链路对单个数据包有尺寸上限(**MTU**,以太网通常 1500 字节),超大的 IP 数据报就得拆开传。

**"包裹单"上的三个字段**(都在 IP 头部里):
- **标识 (ID)**:订单号——同一个原始数据报拆出的所有分片共用一个 ID,收方靠它归类
- **片偏移 (offset)**:这段数据在原报文中的起始位置(**以 8 字节为单位**,考试爱考这个换算!)
- **MF 标志 (More Fragments)**:后面还有没有——最后一片 MF=0,其余都是 1

**两个重要的坑**:①重组**只在最终目的主机**做,路上的路由器只管转发甚至继续拆小,绝不代劳拼装(那会拖垮路由器);②**丢一片,全报废**——任何一个分片丢失,整个原始数据报都得作废重传,分片越多风险越高。所以现代网络尽量**避免分片**:TCP 用 MSS 协商一次发多大,IPv6 干脆禁止路由器分片,改在源头做"路径 MTU 发现"。`,
    pseudo: `if packet > MTU:
    按 MTU 切数据（8 字节对齐）
    每片: 同一 ID + offset(÷8) + MF(最后一片=0)
路由器只转发不重组
目的主机: 按 ID 归类 → 按 offset 排序 → MF=0 收尾拼装`,
    code: {
      python: `# IPv4 分片与重组
MTU = 1500
IP_HEADER = 20
CHUNK = (MTU - IP_HEADER) // 8 * 8   # 每片数据量（8 字节对齐）→ 1480

def fragment(packet_id, data):
    frags = []
    for start in range(0, len(data), CHUNK):
        chunk = data[start:start + CHUNK]
        frags.append({
            'id': packet_id,                    # 同一订单号
            'offset': start // 8,               # 偏移以 8 字节为单位！
            'MF': 1 if start + CHUNK < len(data) else 0,  # 还有后续?
            'data': chunk,
        })
    return frags

def reassemble(frags):
    frags = sorted(frags, key=lambda f: f['offset'])
    if frags[-1]['MF'] != 0:
        raise ValueError('缺最后一片，整个数据报作废')
    return b''.join(f['data'] for f in frags)

data = b'x' * 4000                    # 4000 字节，超过 MTU
frags = fragment(1, data)
print([(f['offset'], f['MF'], len(f['data'])) for f in frags])
# [(0,1,1480), (185,1,1480), (370,0,1040)] ← 185 = 1480/8
print(len(reassemble(frags)))         # 4000，完整复原`,
      cpp: `#include <vector>
#include <cstdint>

constexpr int MTU = 1500, IP_HEADER = 20;
constexpr int CHUNK = (MTU - IP_HEADER) / 8 * 8;   // 1480，8 字节对齐

struct Fragment {
    uint16_t id;        // 同一原始报文的分片共用 ID
    uint16_t offset;    // 片偏移：以 8 字节为单位
    bool mf;            // More Fragments：最后一片为 false
    std::vector<uint8_t> data;
};

std::vector<Fragment> fragment(uint16_t id,
                               const std::vector<uint8_t>& data) {
    std::vector<Fragment> frags;
    for (size_t start = 0; start < data.size(); start += CHUNK) {
        size_t end = std::min(start + (size_t)CHUNK, data.size());
        frags.push_back({
            id,
            (uint16_t)(start / 8),             // 考点：偏移 ÷ 8
            end < data.size(),                  // 非最后一片 MF=1
            {data.begin() + start, data.begin() + end},
        });
    }
    return frags;
}
// 重组只发生在目的主机：按 id 归类、按 offset 排序、
// 见到 MF=0 且无空洞才算凑齐——丢任何一片则整包作废。`,
    },
    apps: ['IP 层考点（偏移换算）', 'MTU 问题定位', '理解 IPv6 为何禁路由器分片'],
  }),
  ripdistance: entry({
    slug: 'ripdistance',
    name: '距离向量 RIP',
    nameEn: 'RIP Distance Vector',
    category: 'network',
    fn: protocolTopic('ripdistance'),
    viz: 'protocol',
    desc: '展示路由器交换距离向量并逐步收敛路由表。',
    intuition: `**新搬来的邻居问路**:"去火车站多远?"你不知道,但隔壁老王说他知道:"从我家走 10 分钟。"你到老王家 2 分钟,那你就记下"经老王,12 分钟"。改天对门老李说他有条 8 分钟的路,你到老李家 3 分钟——11 分钟,更近!更新记录。**每个路由器都这样打听:定期把自己的"距离清单"发给邻居,邻居拿来跟自己的比,发现更近的路就更新**。这就是 RIP 距离向量协议的全部日常。

**更新规则一行字**:到目的地 d 的距离 = min(现在的记录, 到某邻居的开销 + 该邻居到 d 的距离)。这正是 **Bellman-Ford 算法**的分布式版本——没有任何路由器知道全网地图,大家只跟邻居聊天,聊着聊着全网路由表就**收敛**到最短路了。

**但"道听途说"有个著名毛病——坏消息传得慢**:火车站塌了(链路断了),老王还没来得及告诉你,你却先把"我 12 分钟能到"告诉了老王——老王一看:"咦,经你 14 分钟能到?"记下了。你再从老王那听说 14 分钟的路……两人互相引用,距离 12→14→16→…慢慢数到 16(RIP 规定 16=无穷远)才醒悟,这叫**计数到无穷/路由环路**。缓解招数:**水平分割**(从谁那学来的路,不再报告给谁)、**毒性逆转**(直接告诉他"此路不通")。这也是为什么大型网络改用链路状态协议(OSPF)——大家共享完整地图,各自算最短路,不再传话。`,
    pseudo: `每 30 秒: 把自己的距离向量发给所有邻居
收到邻居 n 的向量:
    for 每个目的地 d:
        if cost(n) + n.dist[d] < dist[d]:
            dist[d] = cost(n) + n.dist[d]
            nextHop[d] = n
距离 16 视为不可达（防环上限）`,
    code: {
      python: `# 距离向量路由：分布式 Bellman-Ford
INF = 16                       # RIP: 16 即"无穷远"

# 网络: A-B 开销1, B-C 开销1, A-C 开销5
neighbors = {'A': {'B': 1, 'C': 5}, 'B': {'A': 1, 'C': 1},
             'C': {'A': 5, 'B': 1}}
# 初始路由表：只认识直连邻居
dist = {r: {d: (0 if d == r else neighbors[r].get(d, INF))
            for d in 'ABC'} for r in 'ABC'}

def exchange_round():
    """一轮交换：每个路由器接收所有邻居的距离向量并松弛"""
    updated = False
    for r in dist:
        for n, cost in neighbors[r].items():   # 听每个邻居的
            for d in 'ABC':
                if cost + dist[n][d] < dist[r][d]:
                    dist[r][d] = cost + dist[n][d]  # 发现更近的路
                    updated = True
    return updated

rounds = 0
while exchange_round():
    rounds += 1
print(f"{rounds} 轮后收敛: A 的路由表 {dist['A']}")
# A→C 不走直连的 5，而是经 B 的 1+1=2`,
      cpp: `#include <unordered_map>
#include <string>

constexpr int INF = 16;   // RIP 的"无穷远"：防计数到无穷的上限
using Table = std::unordered_map<char, int>;

// 一轮距离向量交换：r 收到邻居 n 的表，做 Bellman-Ford 松弛
bool receiveVector(Table& mine, const Table& neighborTable,
                   int costToNeighbor) {
    bool updated = false;
    for (auto& [dest, dThroughN] : neighborTable) {
        int candidate = costToNeighbor + dThroughN;
        if (candidate < INF && (!mine.count(dest) || candidate < mine[dest])) {
            mine[dest] = candidate;    // 经邻居走更近 → 更新
            updated = true;
        }
    }
    return updated;   // 全网所有路由器都不再更新 = 收敛
}
// 坏消息传得慢：断链后两邻居可能互相"引用"对方的旧路，
// 距离一步步涨到 16 才承认不可达（计数到无穷问题）。`,
    },
    apps: ['路由协议入门', 'Bellman-Ford 的分布式应用', '路由环路与水平分割'],
  }),

  monotonicstack: entry({
    slug: 'monotonicstack',
    name: '单调栈',
    nameEn: 'Monotonic Stack',
    category: 'dataStructures',
    fn: structureTopic('monotonicstack'),
    viz: 'advancedstructure',
    desc: '维护单调栈来在线求下一个更大/更小元素。',
    intuition: `**问题长这样**:给每一天的温度,问"每天还要等几天才会更暖和?"暴力做法是每天都向后扫一遍找第一个更大值,O(n²)。单调栈把它做到 O(n),核心是换个视角:**不替每一天向后找答案,而是让"更暖的那天"到来时,回头结算所有在等它的日子**。

**想象一排人在等一个"比自己高的人"**:矮个子进来,排在队尾等着;来了个高个子——队尾比他矮的人**全部得到答案**("等到了!就是他"),依次出队;高个子自己再排进去继续等。注意队伍里的人**从队首到队尾永远一个比一个矮**(高的进来时矮的都被清走了)——"单调"之名由此而来。

**为什么是 O(n)?** 每个元素**一进一出栈最多各一次**,总操作 2n 次。那句"while 栈顶更小就弹出"看着像嵌套循环,实际所有弹出加起来不超过 n 次——这种"均摊分析"的思维在算法里非常常用。**什么时候想到单调栈?** 题面出现"下一个更大/更小元素""左右第一个比我高/低的位置"这类关键词时:每日温度、柱状图最大矩形、接雨水,全是它的经典战场。`,
    pseudo: `for i, x in enumerate(nums):
    while 栈非空 且 x > 栈顶元素:
        j = 栈顶出栈        # j 的"下一个更大"就是 x
        answer[j] = i
    x 入栈（此时栈内保持递减）`,
    code: {
      python: `# 每日温度：等几天才更暖？——单调栈 O(n)
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                       # 存下标；栈内温度从底到顶递减
    for i, t in enumerate(temps):
        # 新温度更高 → 结算所有在等它的日子
        while stack and t > temps[stack[-1]]:
            j = stack.pop()
            answer[j] = i - j        # 等了 i-j 天
        stack.append(i)              # 自己入栈，继续等更暖的
    return answer                    # 栈里剩下的：再也等不到，保持 0

print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))
# [1, 1, 4, 2, 1, 1, 0, 0]
# 每个下标至多进出栈一次 → 均摊 O(n)`,
      cpp: `#include <stack>
#include <vector>

// 每日温度：单调栈求"下一个更大元素"距离
std::vector<int> dailyTemperatures(const std::vector<int>& temps) {
    int n = temps.size();
    std::vector<int> answer(n, 0);
    std::stack<int> st;                    // 存下标，栈内温度递减
    for (int i = 0; i < n; i++) {
        while (!st.empty() && temps[i] > temps[st.top()]) {
            int j = st.top(); st.pop();    // j 等到了更暖的一天 i
            answer[j] = i - j;
        }
        st.push(i);
    }
    return answer;   // while 看似嵌套，均摊仍是 O(n)
}`,
    },
    apps: ['每日温度', '柱状图最大矩形', '接雨水', '下一个更大元素系列'],
  }),
  monotonicqueue: entry({
    slug: 'monotonicqueue',
    name: '单调队列',
    nameEn: 'Monotonic Queue',
    category: 'dataStructures',
    fn: structureTopic('monotonicqueue'),
    viz: 'advancedstructure',
    desc: '维护窗口最大/最小值候选队列。',
    intuition: `**问题**:一个长度为 k 的窗口在数组上滑动,实时报告窗口内的最大值。暴力做法每滑一步扫一遍窗口,O(nk);单调队列 O(n) 搞定,靠的是一个冷酷的裁员逻辑:**又老又弱的候选人,永远不可能当选,立即淘汰**。

**把窗口内的元素看作选秀候选人**:新人 x 入场时,凡是**比 x 弱(值更小)且比 x 早入场(更早过期)**的候选人——他们这辈子都没机会了:只要他们还在窗口里,x 也一定在,而 x 比他们强。**从队尾把这些人全部请走**,x 再排入队尾。另一头,队首的人若已滑出窗口(过期),从队首请走。这样队首永远是当前窗口的最大值,而且队列从头到尾天然保持递减——"单调队列"之名由此而来。

**和单调栈的关系**:一对孪生兄弟——都靠"新元素淘汰不可能成为答案的旧元素"实现均摊 O(n)。区别是栈只在一端进出(解决"下一个更大"),队列两端都操作(队尾淘汰弱者+队首淘汰过期者,解决"滑动窗口最值")。进阶用途:**DP 的单调队列优化**——当转移方程形如"从最近 k 个状态里取最值"时,用它把 O(nk) 的 DP 压到 O(n),竞赛常客。`,
    pseudo: `for i, x in enumerate(nums):
    while 队尾比 x 弱: 队尾出队   # 又老又弱，永无出头之日
    x 入队尾
    if 队首已滑出窗口: 队首出队   # 过期离场
    if 窗口就位: 队首即最大值`,
    code: {
      python: `# 滑动窗口最大值：单调队列 O(n)
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()                     # 存下标；对应值从队首到队尾递减
    result = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()                 # 队尾又老又弱 → 淘汰
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()             # 队首滑出窗口 → 过期离场
        if i >= k - 1:
            result.append(nums[dq[0]])   # 队首就是窗口最大值
    return result

print(max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))
# [3, 3, 5, 5, 6, 7]`,
      cpp: `#include <deque>
#include <vector>

// 滑动窗口最大值：双端队列维护"仍有希望的候选人"
std::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {
    std::deque<int> dq;              // 存下标，对应值单调递减
    std::vector<int> result;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!dq.empty() && nums[dq.back()] <= nums[i])
            dq.pop_back();           // 比新人弱且更早过期 → 出局
        dq.push_back(i);
        if (dq.front() <= i - k)
            dq.pop_front();          // 队首过期 → 离场
        if (i >= k - 1)
            result.push_back(nums[dq.front()]);  // 队首 = 窗口最大
    }
    return result;                   // 每元素至多进出各一次：O(n)
}`,
    },
    apps: ['滑动窗口最大值', 'DP 单调队列优化', '流式数据实时最值'],
  }),
  heapops: entry({
    slug: 'heapops',
    name: '堆的插入 / 删除',
    nameEn: 'Heap Insert Delete',
    category: 'dataStructures',
    fn: structureTopic('heapops'),
    viz: 'advancedstructure',
    desc: '展示二叉堆插入上浮、删除堆顶下沉。',
    intuition: `**堆解决一个朴素需求**:一群任务各有优先级,我永远只想立刻拿到**最要紧的那个**。排序太贵(每来一个新任务都重排?),堆的答案是:**不用全体有序,只维持一条家规——父节点永远优先于子节点**。这样根节点(堆顶)必然是全场最值,而兄弟之间谁大谁小?不管!正是这份"松弛",让插入删除都只要 O(log n)。

**插入 = 新人上浮**:新元素先站到队伍最末尾,然后反复跟自己的**父节点**比较——比父节点更优就交换,一路"上浮"直到家规恢复。**删除堆顶 = 末位顶替 + 下沉**:堆顶被取走后,把**最后一个元素**搬到根的位置(保持树的完全形状),然后它反复跟**两个孩子中更优的那个**比较,不如就交换,一路"下沉"到该待的位置。两条路径都只沿树高走,而完全二叉树高只有 log n。

**最漂亮的工程细节:不需要指针,一个数组就是一棵树**。按层从左到右把节点存进数组,下标关系自动成立:节点 i 的孩子是 2i+1 和 2i+2,父亲是 (i-1)/2。省内存、缓存友好、代码短。你用过的**优先队列**(Python heapq、C++ priority_queue)、**堆排序**、Dijkstra 里"取当前最近的点",底下全是这套上浮/下沉。`,
    pseudo: `insert(x):
    x 放到数组末尾
    siftUp: 比父节点优就交换，直到不再违规
deleteTop():
    末尾元素搬到根
    siftDown: 与更优的孩子交换，直到不再违规
数组即树: children(i)=2i+1,2i+2  parent(i)=(i-1)/2`,
    code: {
      python: `# 小顶堆：上浮 / 下沉 手工实现
class MinHeap:
    def __init__(self):
        self.a = []                    # 数组即完全二叉树

    def push(self, x):                 # 插入：末尾 + 上浮
        self.a.append(x)
        i = len(self.a) - 1
        while i > 0:
            parent = (i - 1) // 2
            if self.a[i] >= self.a[parent]:
                break                  # 家规已恢复
            self.a[i], self.a[parent] = self.a[parent], self.a[i]
            i = parent

    def pop(self):                     # 删顶：末位顶替 + 下沉
        top = self.a[0]
        last = self.a.pop()
        if self.a:
            self.a[0] = last
            i, n = 0, len(self.a)
            while True:
                child = 2 * i + 1      # 先看左孩子
                if child >= n: break
                if child + 1 < n and self.a[child+1] < self.a[child]:
                    child += 1         # 挑两个孩子中更小的
                if self.a[i] <= self.a[child]: break
                self.a[i], self.a[child] = self.a[child], self.a[i]
                i = child
        return top

h = MinHeap()
for x in [5, 2, 8, 1, 9]: h.push(x)
print([h.pop() for _ in range(5)])   # [1, 2, 5, 8, 9]`,
      cpp: `#include <utility>
#include <vector>

// 小顶堆：数组即树，children(i)=2i+1,2i+2  parent(i)=(i-1)/2
class MinHeap {
    std::vector<int> a;
public:
    void push(int x) {                 // 插入：末尾 + 上浮
        a.push_back(x);
        int i = a.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (a[i] >= a[parent]) break;
            std::swap(a[i], a[parent]);
            i = parent;
        }
    }
    int pop() {                        // 删顶：末位顶替 + 下沉
        int top = a[0];
        a[0] = a.back(); a.pop_back();
        int i = 0, n = a.size();
        while (true) {
            int child = 2 * i + 1;
            if (child >= n) break;
            if (child + 1 < n && a[child+1] < a[child]) child++;
            if (a[i] <= a[child]) break;
            std::swap(a[i], a[child]);
            i = child;
        }
        return top;                    // 上浮/下沉都只走树高 O(log n)
    }
};`,
    },
    apps: ['优先队列', '堆排序', 'Dijkstra/Prim 的取最值', 'Top-K 问题'],
  }),
  dagshortest: entry({
    slug: 'dagshortest',
    name: 'DAG 最短路',
    nameEn: 'DAG Shortest Path',
    category: 'graph',
    fn: structureTopic('dagshortest'),
    viz: 'advancedstructure',
    desc: '按拓扑序对有向无环图做一次松弛。',
    intuition: `**DAG(有向无环图)= 一张"不走回头路"的图**:任务依赖图、课程先修图、工程流程图都是——箭头永远向前,绝不绕圈。在这种图上求最短路,不需要 Dijkstra 的优先队列,有一个更简单更快的办法,而且**负权边也毫无压力**。

**关键洞察**:既然没有环,就能把所有节点排成一个**拓扑序**——"被依赖的排前面"(先修课在前,后续课在后)。**按这个顺序逐个处理节点时,每处理到一个点,通往它的所有路径必然都已经算完了**(它的所有前驱都排在它前面)——所以它的最短距离已是定局,放心用它去更新(松弛)它指向的邻居即可。一遍扫完,全部搞定,O(V+E)。

**对比着记**:Dijkstra 靠优先队列**动态发现**"下一个已成定局的点",代价是 O(E log V) 且**不容许负权边**;DAG 上拓扑序**免费送**了这个顺序,所以既快又不怕负权。另一个隐藏彩蛋:把 min 换成 max,同一套流程直接求**最长路**——这就是工程管理里的**关键路径**(决定项目最短工期的那条链),也是"拓扑序 DP"的标准形态:很多 DP 本质上就是在隐式 DAG 上按拓扑序递推。`,
    pseudo: `topo = topological_sort(G)   # 被依赖者在前
dist[s] = 0, 其余 = ∞
for u in topo:                # 轮到 u 时其最短路已成定局
    for (u → v, w):
        dist[v] = min(dist[v], dist[u] + w)`,
    code: {
      python: `# DAG 最短路：拓扑排序 + 一遍松弛，O(V+E)，负权也 OK
from collections import deque

def dag_shortest(n, edges, source):
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    for u, v, w in edges:
        graph[u].append((v, w))
        indegree[v] += 1

    # Kahn 拓扑排序：反复摘"没有前置依赖"的点
    queue = deque(i for i in range(n) if indegree[i] == 0)
    topo = []
    while queue:
        u = queue.popleft()
        topo.append(u)
        for v, _ in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    INF = float('inf')
    dist = [INF] * n
    dist[source] = 0
    for u in topo:                     # 轮到 u 时它已是定局
        if dist[u] == INF: continue
        for v, w in graph[u]:
            dist[v] = min(dist[v], dist[u] + w)   # 松弛
    return dist

edges = [(0,1,1), (0,2,4), (1,2,-2), (1,3,5), (2,3,1)]
print(dag_shortest(4, edges, 0))   # [0, 1, -1, 0] ← 负权无压力`,
      cpp: `#include <queue>
#include <vector>
#include <climits>

// DAG 最短路：拓扑序 + 一遍松弛（负权安全）
std::vector<long long> dagShortest(
    int n, const std::vector<std::array<int,3>>& edges, int source) {
    std::vector<std::vector<std::pair<int,int>>> g(n);
    std::vector<int> indeg(n, 0);
    for (auto& [u, v, w] : edges) { g[u].push_back({v, w}); indeg[v]++; }

    std::queue<int> q;                       // Kahn 拓扑排序
    for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
    std::vector<int> topo;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        topo.push_back(u);
        for (auto& [v, w] : g[u]) if (--indeg[v] == 0) q.push(v);
    }

    const long long INF = LLONG_MAX / 2;
    std::vector<long long> dist(n, INF);
    dist[source] = 0;
    for (int u : topo)                       // 按拓扑序松弛一遍
        if (dist[u] < INF)
            for (auto& [v, w] : g[u])
                dist[v] = std::min(dist[v], dist[u] + w);
    return dist;   // min 换 max 即最长路（关键路径）
}`,
    },
    apps: ['拓扑序 DP', '项目关键路径', '课程依赖规划', '编译依赖分析'],
  }),
  binaryanswer: entry({
    slug: 'binaryanswer',
    name: '二分答案',
    nameEn: 'Binary Search on Answer',
    category: 'dataStructures',
    fn: structureTopic('binaryanswer'),
    viz: 'advancedstructure',
    desc: '把优化问题转化为单调判定并二分边界。',
    intuition: `**"猜价格"游戏的算法版**:主持人心里有个数,你每猜一次,他只说"高了"或"低了"——聪明人每次猜区间正中间,几轮就锁定答案。**二分答案把这招用在优化问题上:不去"求"最优解,而是去"猜"最优解**,每猜一个值只需回答一个简单得多的判定题:"这个值行不行?"

**成立的前提是单调性**:可行性必须随答案单调变化——"10 天能送完所有包裹,那 11 天当然也能"(时间越宽越可行);"载重 50 能运走,载重 60 更能"。一旦有这种"跨过某个门槛就从不行变成行"的结构,答案空间就像被排好了序:❌❌❌✅✅✅,**二分找第一个 ✅ 即可**。

**解题三步走**:①确认单调性;②写 check(mid)——"若答案是 mid,可行吗?"(通常一个贪心扫描,O(n));③二分套模板。**威力在于降维**:直接求"最小的最大载重"无从下手,但"载重 55 行不行"只需模拟装货数一数船次——**把优化题变成判定题**,难度骤降。经典应用:分割数组最小化最大和、운送包裹最低运力、跳石头最大化最短跳距——题面里看到"**最小化最大值/最大化最小值**",几乎就是二分答案的暗号。`,
    pseudo: `low, high = 答案可能的最小值, 最大值
while low < high:
    mid = (low + high) // 2
    if check(mid):        # "答案为 mid 可行吗?" 通常是贪心
        high = mid        # 可行 → 试试更小的
    else:
        low = mid + 1     # 不可行 → 必须放宽
return low                # 第一个可行值`,
    code: {
      python: `# 经典例题：传送带 days 天内送完所有包裹，最低运力是多少？
def ship_within_days(weights, days):
    def check(capacity):
        """运力为 capacity 时，几天能送完？（贪心装船）"""
        d, load = 1, 0
        for w in weights:
            if load + w > capacity:
                d += 1               # 装不下 → 开新的一天
                load = 0
            load += w
        return d <= days

    low, high = max(weights), sum(weights)  # 答案的上下界
    while low < high:
        mid = (low + high) // 2
        if check(mid):
            high = mid               # 可行 → 收紧，试更小运力
        else:
            low = mid + 1            # 不可行 → 放宽
    return low                       # 第一个可行运力

print(ship_within_days([1,2,3,4,5,6,7,8,9,10], 5))  # 15
# 可行性单调：运力 15 行，16、17…必然都行 → 二分成立`,
      cpp: `#include <algorithm>
#include <numeric>
#include <vector>

// days 天送完所有包裹的最低运力：二分答案 + 贪心判定
int shipWithinDays(const std::vector<int>& weights, int days) {
    auto check = [&](int capacity) {     // 判定：容量够不够
        int d = 1, load = 0;
        for (int w : weights) {
            if (load + w > capacity) { d++; load = 0; }
            load += w;
        }
        return d <= days;
    };
    int low  = *std::max_element(weights.begin(), weights.end());
    int high = std::accumulate(weights.begin(), weights.end(), 0);
    while (low < high) {
        int mid = low + (high - low) / 2;
        if (check(mid)) high = mid;      // 可行 → 试更小
        else            low = mid + 1;   // 不可行 → 放宽
    }
    return low;   // "最小化最大值"题型的标准解法
}`,
    },
    apps: ['最小化最大值 / 最大化最小值', '运力/容量规划', '跳石头类竞赛题'],
  }),
  prefixdiff: entry({
    slug: 'prefixdiff',
    name: '前缀和 / 差分',
    nameEn: 'Prefix Sum and Difference',
    category: 'dataStructures',
    fn: structureTopic('prefixdiff'),
    viz: 'advancedstructure',
    desc: '展示区间查询和区间批量修改的两个基础技巧。',
    intuition: `**前缀和:汽车里程表的智慧**。想知道 3 月 5 日到 3 月 20 日开了多少公里,不用把每天的里程一天天加——**拿 20 日的总里程表读数,减去 4 日的读数**,一步到位。前缀和数组就是"里程表":prefix[i] = 前 i 个元素之和,任何区间和 = 两个读数相减,**预处理一遍 O(n),之后每次查询 O(1)**。查询很多时,比每次现加快出几个数量级。

**差分:只记变化,不记全量**。物业要给 3~7 层每层加装一盏灯,15~20 层也加——笨办法挨层登记;聪明办法只在**边界**做记号:"从 3 层开始多 1 盏(diff[3]+=1),从 8 层开始恢复(diff[8]-=1)"。**每次区间修改只动两个端点,O(1)**;所有修改做完后,对差分数组求一遍前缀和,就还原出每层的真实盏数。

**一对互逆的运算**:差分是前缀和的逆(先差分再前缀和=原数组),就像微分之于积分。**使用口诀:查询多用前缀和,修改多用差分**;若修改和查询交错出现,这两招就不够了——那是树状数组/线段树的地盘。这对"双子星"是无数竞赛题的第一块积木:子数组和、二维区域和、公交上下车人数统计、日程安排冲突检测,处处可见。`,
    pseudo: `# 前缀和：查询快
prefix[i] = prefix[i-1] + a[i]
sum(l, r) = prefix[r] - prefix[l-1]

# 差分：修改快
区间 [l,r] 全体 +v:  diff[l] += v; diff[r+1] -= v
最终数组 = 对 diff 求前缀和`,
    code: {
      python: `# 前缀和：一次预处理，区间求和 O(1)
def build_prefix(a):
    prefix = [0] * (len(a) + 1)
    for i, x in enumerate(a):
        prefix[i + 1] = prefix[i] + x       # 里程表累计
    return prefix

a = [3, 1, 4, 1, 5, 9, 2, 6]
prefix = build_prefix(a)
def range_sum(l, r):                        # 闭区间 [l, r]
    return prefix[r + 1] - prefix[l]        # 两个读数相减
print(range_sum(2, 5))    # 4+1+5+9 = 19

# 差分：区间批量修改，每次 O(1)
n = 8
diff = [0] * (n + 1)
def range_add(l, r, v):                     # [l, r] 全体 +v
    diff[l] += v                            # 从 l 开始多 v
    diff[r + 1] -= v                        # 从 r+1 开始恢复

range_add(1, 4, 10)
range_add(3, 6, 5)
result, cur = [], 0
for i in range(n):                          # 前缀和还原真实值
    cur += diff[i]
    result.append(cur)
print(result)   # [0, 10, 10, 15, 15, 5, 5, 0]`,
      cpp: `#include <vector>

// 前缀和：查询 O(1)
struct PrefixSum {
    std::vector<long long> prefix;
    explicit PrefixSum(const std::vector<int>& a)
        : prefix(a.size() + 1, 0) {
        for (size_t i = 0; i < a.size(); i++)
            prefix[i + 1] = prefix[i] + a[i];
    }
    long long query(int l, int r) const {   // 闭区间 [l, r]
        return prefix[r + 1] - prefix[l];
    }
};

// 差分：区间修改 O(1)，最后一次性还原
struct Diff {
    std::vector<long long> d;
    explicit Diff(int n) : d(n + 1, 0) {}
    void rangeAdd(int l, int r, int v) { d[l] += v; d[r + 1] -= v; }
    std::vector<long long> materialize() const {
        std::vector<long long> res(d.size() - 1);
        long long cur = 0;
        for (size_t i = 0; i + 1 < d.size(); i++)
            res[i] = (cur += d[i]);          // 前缀和还原
        return res;
    }
};`,
    },
    apps: ['子数组和问题', '批量区间更新', '二维区域和', '上下车/日程统计'],
  }),
  btree: entry({
    slug: 'btree',
    name: 'B 树 / B+ 树',
    nameEn: 'B Tree and B+ Tree',
    category: 'tree',
    fn: structureTopic('btree'),
    viz: 'advancedstructure',
    desc: '展示多路平衡搜索树的节点分裂与 B+ 树叶子链。',
    intuition: `**为什么数据库不用二叉搜索树?** 因为数据在磁盘上,而磁盘读取是**按块**进行的(一次读 4KB~16KB),且一次寻道要几毫秒——比内存慢十万倍。二叉树每个节点只存 1 个键,查一次要跳十几二十层,**每层都是一次昂贵的磁盘读**。B 树的对策粗暴而有效:**一个节点塞几百个键,正好填满一个磁盘块**——树高从 20 层压到 3~4 层,查询从二十次磁盘读变成三四次。

**"分裂上浮"维持平衡**:插入新键时先落到叶子;叶子满了就**从中间劈开**,中间那个键**上浮**到父节点当"分界牌";父节点也满了就继续劈、继续上浮——**树只会从根部长高**,天然保持所有叶子等深,永不失衡。这是本页动画的主角。

**B+ 树是数据库的定制款**,两处改造:①**数据全部下沉到叶子**,内部节点只留"路标"——路标不带数据,同样大小的节点能塞更多路标,分叉更多、树更矮;②**叶子之间串成有序链表**——范围查询(WHERE age BETWEEN 20 AND 30)只需定位到起点,然后沿链表"平推",不用在树上来回爬。**MySQL(InnoDB)、PostgreSQL 的索引,操作系统的文件系统(NTFS/ext4),全是 B+ 树**——你每一次数据库查询背后都是它在跑。`,
    pseudo: `insert key into leaf
if node overflows (> M-1 keys):
    split at middle
    middle key promotes to parent
    (parent overflow → 递归分裂，树从根长高)
B+ 树: 数据仅在叶子，叶子串成有序链表`,
    code: {
      python: `# B 树（教学版，阶 M=4）：插入 + 分裂上浮
M = 4                                # 每节点最多 M-1 = 3 个键

class Node:
    def __init__(self, leaf=True):
        self.keys, self.children, self.leaf = [], [], leaf

def insert(root, key):
    if len(root.keys) == M - 1:      # 根满了：树从根部长高
        new_root = Node(leaf=False)
        new_root.children.append(root)
        split_child(new_root, 0)
        root = new_root
    _insert_nonfull(root, key)
    return root

def split_child(parent, i):
    """孩子满了：从中间劈开，中间键上浮到 parent"""
    full = parent.children[i]
    mid = (M - 1) // 2
    right = Node(leaf=full.leaf)
    right.keys = full.keys[mid + 1:]
    parent.keys.insert(i, full.keys[mid])      # 中间键上浮
    full.keys = full.keys[:mid]
    if not full.leaf:
        right.children = full.children[mid + 1:]
        full.children = full.children[:mid + 1]
    parent.children.insert(i + 1, right)

def _insert_nonfull(node, key):
    if node.leaf:
        node.keys.append(key)
        node.keys.sort()             # 教学简化：真实实现是有序插入
    else:
        i = sum(1 for k in node.keys if key > k)   # 选下降分支
        if len(node.children[i].keys) == M - 1:
            split_child(node, i)
            if key > node.keys[i]: i += 1
        _insert_nonfull(node.children[i], key)

root = Node()
for k in [10, 20, 5, 6, 12, 30, 7, 17]:
    root = insert(root, k)
print(root.keys)   # 根只剩少量"分界牌"，树矮而宽`,
      cpp: `#include <algorithm>
#include <memory>
#include <vector>

// B 树节点（教学版，阶 M=4）：一个节点多个键 → 树矮，磁盘读少
constexpr int M = 4;

struct Node {
    std::vector<int> keys;
    std::vector<std::unique_ptr<Node>> children;
    bool leaf = true;
};

// 孩子 i 已满：从中间劈开，中间键上浮到 parent
void splitChild(Node* parent, int i) {
    Node* full = parent->children[i].get();
    int mid = (M - 1) / 2;
    auto right = std::make_unique<Node>();
    right->leaf = full->leaf;
    right->keys.assign(full->keys.begin() + mid + 1, full->keys.end());
    parent->keys.insert(parent->keys.begin() + i, full->keys[mid]);
    full->keys.resize(mid);
    if (!full->leaf) {
        for (int j = mid + 1; j < (int)full->children.size(); j++)
            right->children.push_back(std::move(full->children[j]));
        full->children.resize(mid + 1);
    }
    parent->children.insert(parent->children.begin() + i + 1,
                            std::move(right));
}
// B+ 树在此基础上：数据全在叶子 + 叶子串链表 → 范围查询平推`,
    },
    apps: ['MySQL/PostgreSQL 索引', '文件系统 (NTFS/ext4)', '为什么不用二叉树做索引（面试高频）'],
  }),

  hashavalanche: entry({
    slug: 'hashavalanche',
    name: '哈希雪崩效应',
    nameEn: 'Hash Avalanche',
    category: 'security',
    fn: cryptoTopic('hashavalanche'),
    viz: 'crypto',
    desc: '展示输入微小变化如何让摘要大幅改变。',
    intuition: `**哈希函数是"内容的指纹机"**:任意长度的输入进去,固定长度的"指纹"(摘要)出来。同一份文件永远得到同一个指纹,但好的密码学哈希必须再满足一个苛刻要求——**雪崩效应:输入哪怕只改动 1 个比特,输出的指纹要有大约一半的比特翻转**,变得面目全非。"合同金额 100 元"和"合同金额 700 元"只差几个比特,指纹却毫无相似之处。

**为什么必须"雪崩"?** 假如输入小改、指纹只小变,攻击者就能玩"温水煮青蛙":逐比特微调伪造文件,观察指纹逐渐逼近目标——相似性成了导航仪。雪崩效应把这条路堵死:**指纹之间的"距离"不携带任何关于输入距离的信息**,攻击者面对的是一片毫无梯度的荒原,只能瞎蒙(暴力穷举 2²⁵⁶ 种可能)。

**你每天都在享受它的保护**:下载软件后校验 SHA-256(内容被篡改一个字节,指纹立刻对不上);Git 用哈希标识每一次提交;数字签名先对文件求哈希再签名;网站存的是你密码的哈希而非明文。**顺带一个重要区分**:普通哈希表用的哈希函数(如乘法散列)只求快和均匀,**不防人为攻击**;密码学哈希(SHA-256 等)为对抗恶意伪造而生,雪崩效应是它的必修课。`,
    pseudo: `digest1 = H(message)
digest2 = H(message ⊕ 1 bit)     # 只翻转一个比特
diff = popcount(digest1 XOR digest2)
理想: diff ≈ 输出位数的一半（256 位 → ~128 位翻转）`,
    code: {
      python: `# 亲眼见证雪崩：翻转 1 个输入比特，数输出翻了多少比特
import hashlib

def bit_diff(a: bytes, b: bytes) -> int:
    """两个摘要相差多少个比特"""
    return sum(bin(x ^ y).count('1') for x, y in zip(a, b))

msg1 = b"transfer 100 yuan to Alice"
msg2 = bytearray(msg1)
msg2[9] ^= 0x01                     # 只翻转 1 个比特！

d1 = hashlib.sha256(msg1).digest()
d2 = hashlib.sha256(bytes(msg2)).digest()

print(hashlib.sha256(msg1).hexdigest()[:32], '...')
print(hashlib.sha256(bytes(msg2)).hexdigest()[:32], '...')
print(f"输入差 1 比特 → 输出 256 位中翻转了 {bit_diff(d1, d2)} 位")
# 典型输出 ≈ 128 位（恰约一半）——面目全非，无迹可寻`,
      cpp: `#include <bitset>
#include <cstdint>

// 教学演示：一个"故意没有雪崩"的坏哈希 vs 理想行为
// 坏哈希：简单求和——输入小变，输出也只小变（可被利用！）
uint32_t badHash(const uint8_t* data, size_t n) {
    uint32_t h = 0;
    for (size_t i = 0; i < n; i++) h += data[i];   // 无扩散
    return h;
}

// 统计两个摘要相差多少比特（衡量雪崩的指标）
int bitDiff(uint32_t a, uint32_t b) {
    return std::bitset<32>(a ^ b).count();
}
// badHash("...100...") 与 badHash("...700...") 只差几比特 → 危险
// 真实密码学哈希（SHA-256）靠多轮混淆+扩散做到 ~50% 翻转，
// 生产代码请使用成熟库（OpenSSL 等），永远不要自造哈希。`,
    },
    apps: ['下载文件完整性校验', 'Git 提交标识', '数字签名前置摘要', '密码存储'],
  }),
  aesround: entry({
    slug: 'aesround',
    name: 'AES 教学版轮结构',
    nameEn: 'AES Round Structure',
    category: 'security',
    fn: cryptoTopic('aesround'),
    viz: 'crypto',
    desc: '用教学视角展示 AES 一轮中的替换、移位、列混合和轮密钥异或。',
    intuition: `**AES 是全世界用得最多的加密算法**——WiFi 密码、HTTPS 会话、手机存储加密,背后都是它。它把明文切成 16 字节一组(排成 4×4 表格,称为"状态"),然后像**反复揉面团**一样对这个表格做 10 轮变换,每轮四个步骤,直到明文和密钥的关系被彻底"揉"得无法分析。

**一轮四步,各司其职**:
- **SubBytes(查表替换)**:每个字节按一张精心设计的替换表(S 盒)换成另一个字节——制造**混淆**,让输出和输入不再有线性关系
- **ShiftRows(行移位)**:表格第 2/3/4 行分别左转 1/2/3 格——字节离开原来的列,为跨列扩散铺路
- **MixColumns(列混合)**:每一列四个字节做一次数学搅拌,任何一个字节的改动波及整列——制造**扩散**
- **AddRoundKey(异或轮密钥)**:整个表格与本轮的子密钥逐位异或——**密钥就在这一步渗入**,没有它前三步只是公开的洗牌

**混淆 + 扩散,香农提出的加密两大支柱**在这里配合得天衣无缝:替换提供非线性(防代数分析),移位+列混合让**一个明文比特的影响在两轮内扩散到全部 128 位**(雪崩!)。单独看每步都简单得像小学生游戏,叠加 10 轮后,已知最好的攻击也只比暴力穷举快一点点——而穷举 2¹²⁸ 个密钥,把全宇宙的计算机跑到宇宙热寂也算不完。`,
    pseudo: `for round in 1..9:
    state = SubBytes(state)     # 查 S 盒替换（混淆）
    state = ShiftRows(state)    # 行循环左移（错位）
    state = MixColumns(state)   # 列内搅拌（扩散）
    state = AddRoundKey(state)  # 异或轮密钥（密钥渗入）
最后一轮省略 MixColumns`,
    code: {
      python: `# AES 单轮教学版（真实 S 盒/列混合系数从简，看结构为主）
S_BOX = [(i * 7 + 99) % 256 for i in range(256)]   # 教学替代品

def sub_bytes(state):
    """混淆：每个字节查表替换（非线性的来源）"""
    return [[S_BOX[b] for b in row] for row in state]

def shift_rows(state):
    """错位：第 i 行循环左移 i 格"""
    return [row[i:] + row[:i] for i, row in enumerate(state)]

def mix_columns(state):
    """扩散（简化版）：列内字节互相搅拌，一字节改动波及整列"""
    out = [[0] * 4 for _ in range(4)]
    for c in range(4):
        col = [state[r][c] for r in range(4)]
        for r in range(4):
            out[r][c] = col[r] ^ col[(r + 1) % 4] ^ col[(r + 2) % 4]
    return out

def add_round_key(state, round_key):
    """密钥渗入：逐字节异或"""
    return [[state[r][c] ^ round_key[r][c] for c in range(4)]
            for r in range(4)]

state = [[i * 4 + j for j in range(4)] for i in range(4)]
key   = [[0x2b, 0x7e, 0x15, 0x16]] * 4
state = add_round_key(mix_columns(shift_rows(sub_bytes(state))), key)
print(state)  # 一轮后已面目全非；真实 AES 揉 10 轮`,
      cpp: `#include <array>
using State = std::array<std::array<uint8_t, 4>, 4>;

// AES 单轮骨架（教学简化，生产请用成熟库如 OpenSSL）
void subBytes(State& s, const std::array<uint8_t, 256>& sbox) {
    for (auto& row : s)
        for (auto& b : row) b = sbox[b];      // 混淆：非线性替换
}

void shiftRows(State& s) {
    for (int r = 1; r < 4; r++) {             // 第 r 行左转 r 格
        State tmp = s;
        for (int c = 0; c < 4; c++) s[r][c] = tmp[r][(c + r) % 4];
    }
}

void mixColumnsLite(State& s) {               // 扩散（简化系数）
    for (int c = 0; c < 4; c++) {
        std::array<uint8_t, 4> col{s[0][c], s[1][c], s[2][c], s[3][c]};
        for (int r = 0; r < 4; r++)
            s[r][c] = col[r] ^ col[(r + 1) % 4] ^ col[(r + 2) % 4];
    }
}

void addRoundKey(State& s, const State& key) {
    for (int r = 0; r < 4; r++)
        for (int c = 0; c < 4; c++) s[r][c] ^= key[r][c];  // 密钥渗入
}`,
    },
    apps: ['WiFi/HTTPS/磁盘加密', '对称加密基础', '混淆与扩散（香农两大支柱）'],
  }),
  rsaflow: entry({
    slug: 'rsaflow',
    name: 'RSA 加解密流程',
    nameEn: 'RSA Encrypt Decrypt',
    category: 'security',
    fn: cryptoTopic('rsaflow'),
    viz: 'crypto',
    desc: '用小参数展示 RSA 公钥加密和私钥解密的数学流程。',
    intuition: `**先想一个奇怪的邮筒**:任何人都能往里投信(投递口是公开的),但只有邮筒主人有钥匙开箱取信。RSA 就是数学造的这个邮筒——**公钥**(邮筒口)满世界公开,谁都能用它加密;**私钥**(开箱钥匙)只有你有,只有它能解密。这解决了对称加密的世纪难题:**不用提前见面交换密钥,陌生人也能给你发密信**。

**安全性押在一个不对称的数学事实上**:把两个大素数乘起来易如反掌(97 × 89 = 8633,秒算);但反过来,给你 8633 问它是哪两个素数的乘积,就得一个个试(**大数分解难题**)。真实 RSA 用 2048 位的 n——分解它,现有最好的算法和全球算力加起来也要天文数字的时间。**造钥匙的人知道 p、q(所以能算出私钥),外人只见到乘积 n(拆不开,算不出)**——不对称性就藏在这里。

**流程三步**(动画用小数字演示):①**造钥匙**:挑素数 p、q,算 n=pq 和 φ=(p-1)(q-1),选公钥指数 e,算出 d 使 e·d ≡ 1 (mod φ)——(n,e) 公开,d 私藏;②**加密**:密文 c = mᵉ mod n,谁都会算;③**解密**:m = cᵈ mod n,数论(欧拉定理)保证一定还原。**一个诚实的提醒**:RSA 比 AES 慢上千倍,实际系统只用它"递钥匙/签名",大批量数据仍交给对称加密——这正是 TLS 的架构。`,
    pseudo: `密钥生成: p,q 素数 → n=pq, φ=(p-1)(q-1)
           选 e (与 φ 互质) → 求 d: e·d ≡ 1 (mod φ)
           公钥 (n,e) 公开，私钥 d 保密
加密: c = m^e mod n     # 谁都能算
解密: m = c^d mod n     # 只有持 d 者能算`,
    code: {
      python: `# RSA 全流程（教学用小素数；真实场景 n 为 2048 位）
p, q = 61, 53                  # ① 挑两个素数（现实中几百位）
n = p * q                      # 3233 —— 公开
phi = (p - 1) * (q - 1)        # 3120 —— 造钥匙的秘密材料
e = 17                         # 公钥指数（与 phi 互质）
d = pow(e, -1, phi)            # 2753：e 关于 phi 的模逆 → 私钥

# ② 加密：任何人拿公钥 (n, e) 就能做
m = 65                         # 明文（必须 < n）
c = pow(m, e, n)               # 密文 2790
print(f"加密: {m} → {c}")

# ③ 解密：只有私钥 d 的主人能做
m2 = pow(c, d, n)
print(f"解密: {c} → {m2}")      # 65，完美还原

# 攻击者视角：只见 n=3233, e=17, c=2790——
# 想求 d 必须先把 n 分解回 61×53（大数下不可行）`,
      cpp: `#include <cstdint>

// 快速幂：RSA 加解密的核心运算 m^e mod n
uint64_t powMod(uint64_t base, uint64_t exp, uint64_t mod) {
    uint64_t result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}

// 教学参数（真实 RSA: n 为 2048 位大整数，需大数库）
void rsaDemo() {
    uint64_t n = 3233, e = 17;    // 公钥：全世界可见
    uint64_t d = 2753;            // 私钥：由 p=61,q=53 算出，绝不外泄
    uint64_t m = 65;
    uint64_t c  = powMod(m, e, n);   // 加密: 65 → 2790
    uint64_t m2 = powMod(c, d, n);   // 解密: 2790 → 65
    // 安全性 = 大数分解难题：由 n 反推 p,q 不可行
}`,
    },
    apps: ['非对称加密', '数字签名基石', 'TLS 证书体系', '大数分解难题'],
  }),
  diffiehellman: entry({
    slug: 'diffiehellman',
    name: 'Diffie-Hellman 密钥交换',
    nameEn: 'Diffie-Hellman',
    category: 'security',
    fn: cryptoTopic('diffiehellman'),
    viz: 'crypto',
    desc: '展示双方如何在公开信道上协商相同共享密钥。',
    intuition: `**一个看似无解的题**:Alice 和 Bob 从未见过面,只能通过一条**人人都能偷听**的线路通话,却要商量出一个只有他俩知道的密码。听起来不可能?1976 年 Diffie 和 Hellman 用一个漂亮的数学戏法做到了,直接开创了现代密码学。

**调颜料的比喻**(最经典的解释):两人先公开约定一种**共同底色**(黄色——偷听者也知道)。各自在家兑入自己的**秘密颜色**(Alice 兑红→得橙色;Bob 兑蓝→得绿色),把**混合后的颜色**寄给对方——偷听者看得到橙和绿,但**颜料混合无法拆解**,他分离不出红或蓝。最后各自把自己的秘密色兑进收到的混合色:Alice 往绿里兑红,Bob 往橙里兑蓝——**两人都得到"黄+红+蓝",颜色完全相同**!而偷听者只有橙和绿,无论怎么混都凑不出这三合一。

**数学版把"混颜料"换成模幂运算**:公开参数 g 和大素数 p;Alice 私藏 a,公开发送 gᵃ mod p;Bob 私藏 b,发送 gᵇ mod p;各自再对收到的值做一次自己的幂——双方都算出 gᵃᵇ mod p,这就是共享密钥。**"拆不开"的保证叫离散对数难题**:由 gᵃ mod p 反推 a,在大素数下不可行。**今天每一次 HTTPS 连接的开头**,你的浏览器都在和服务器跑一遍它的椭圆曲线版(ECDHE)——你正在用的这个网页,就是这么建立加密的。`,
    pseudo: `公开: 底数 g, 大素数 p
Alice: 私藏 a → 发送 A = g^a mod p
Bob:   私藏 b → 发送 B = g^b mod p
Alice 算 K = B^a mod p ┐
Bob   算 K = A^b mod p ┘ 两者相等 = g^(ab) mod p
偷听者有 g,p,A,B，但离散对数难题挡住了 a,b`,
    code: {
      python: `# Diffie-Hellman：当着偷听者的面商量出共享密钥
p = 23      # 公开的大素数（真实场景 2048 位）
g = 5       # 公开的底数

a = 6       # Alice 的秘密，从不发送
b = 15      # Bob 的秘密，从不发送

A = pow(g, a, p)     # Alice 公开发送 8   ← 偷听者看得见
B = pow(g, b, p)     # Bob   公开发送 19  ← 偷听者看得见

key_alice = pow(B, a, p)   # Alice: 19^6  mod 23 = 2
key_bob   = pow(A, b, p)   # Bob:   8^15  mod 23 = 2
print(key_alice == key_bob)   # True！共享密钥 = 2

# 偷听者拥有 p=23, g=5, A=8, B=19
# 想求密钥必须先由 8 = 5^a mod 23 解出 a —— 离散对数难题
# 小数字可以穷举，2048 位下宇宙级算力也无望`,
      cpp: `#include <cstdint>

uint64_t powMod(uint64_t base, uint64_t exp, uint64_t mod) {
    uint64_t r = 1; base %= mod;
    while (exp) {
        if (exp & 1) r = r * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return r;
}

// DH 密钥交换：公开信道上算出共享密钥
void diffieHellman() {
    uint64_t p = 23, g = 5;          // 公开参数
    uint64_t a = 6, b = 15;          // 双方各自的秘密（不传输）

    uint64_t A = powMod(g, a, p);    // Alice 发出 8
    uint64_t B = powMod(g, b, p);    // Bob 发出 19

    uint64_t keyAlice = powMod(B, a, p);   // 2
    uint64_t keyBob   = powMod(A, b, p);   // 2 —— 相同！
    // 注意：裸 DH 挡不住"中间人"各自握手冒充双方，
    // 所以 TLS 里 DH 必须配合证书（身份验证）一起用。
}`,
    },
    apps: ['TLS/HTTPS 密钥协商 (ECDHE)', '端到端加密 (Signal 等)', '离散对数难题'],
  }),
  digitalsignature: entry({
    slug: 'digitalsignature',
    name: '数字签名与验签',
    nameEn: 'Digital Signature',
    category: 'security',
    fn: cryptoTopic('digitalsignature'),
    viz: 'crypto',
    desc: '展示哈希、私钥签名、公钥验签如何保证身份和完整性。',
    intuition: `**先纠正一个常见误会**:数字签名**不是加密**,不为隐藏内容——消息本身可以公开;它要回答的是另外两个问题:**"这确实是他发的吗?"(身份)和"内容被人改过吗?"(完整性)**。就像古代的火漆蜡封:信谁都能读,但封印只有印章主人盖得出,拆过必留痕。

**巧妙之处:把 RSA 反过来用**。加密是"公钥加密、私钥解密";签名恰好倒转——**用私钥"盖章"(签名),用公钥"验章"(验签)**。私钥全世界只有你有,所以能通过你公钥验证的签名,必然出自你手。具体流程:①对消息求哈希得"指纹"(直接签大文件太慢,签 32 字节的指纹一样有效);②**用私钥对指纹签名**;③接收方用你的**公钥**从签名中恢复指纹,再自己对收到的消息算一遍指纹——**两者一致 = 确系你发 + 未被篡改**,任何一处对不上都会立刻暴露(还记得哈希的雪崩效应吗?改一个字节,指纹面目全非)。

**三重保证与无处不在的应用**:身份认证(私钥唯一)、完整性(哈希敏感)、**不可否认**(你赖不掉——只有你的私钥能生成它,这是纸质签名都做不到的)。你手机每次装 App(应用商店验开发者签名)、每次系统更新(验厂商签名)、每一笔区块链交易(验持币人签名)、每一张 HTTPS 证书(CA 的签名),背后都是这套"哈希→私钥签→公钥验"。`,
    pseudo: `发送方:
    digest = H(message)          # 指纹
    sig = digest^d mod n         # 私钥"盖章"
    发送 (message, sig)
接收方:
    digest' = H(message)         # 自己重算指纹
    recovered = sig^e mod n      # 公钥"验章"
    recovered == digest' ? 真身+未篡改 : 拒收`,
    code: {
      python: `# 数字签名 = 哈希 + "反着用"的 RSA
import hashlib

# RSA 钥匙对（教学小参数）
n, e, d = 3233, 17, 2753     # (n,e) 公开验签用；d 私藏签名用

def sign(message: bytes) -> int:
    """发送方：哈希取指纹 → 私钥盖章"""
    digest = int.from_bytes(
        hashlib.sha256(message).digest()[:2], 'big') % n
    return pow(digest, d, n)          # 私钥签名

def verify(message: bytes, signature: int) -> bool:
    """接收方：公钥验章 → 与自算指纹比对"""
    digest = int.from_bytes(
        hashlib.sha256(message).digest()[:2], 'big') % n
    recovered = pow(signature, e, n)  # 公钥恢复指纹
    return recovered == digest

msg = b"pay Bob 100 yuan"
sig = sign(msg)
print(verify(msg, sig))                    # True：验签通过
print(verify(b"pay Bob 900 yuan", sig))    # False：内容被篡改
print(verify(msg, sig + 1))               # False：签名是伪造的`,
      cpp: `#include <cstdint>

uint64_t powMod(uint64_t base, uint64_t exp, uint64_t mod) {
    uint64_t r = 1; base %= mod;
    while (exp) {
        if (exp & 1) r = r * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return r;
}

// 教学参数：(n,e) 公开，d 私藏（真实场景用 OpenSSL + SHA-256）
constexpr uint64_t N = 3233, E = 17, D = 2753;

uint64_t toyHash(const char* msg) {         // 教学用超简哈希
    uint64_t h = 0;
    while (*msg) h = (h * 131 + *msg++) % N;
    return h;
}

uint64_t sign(const char* msg) {
    return powMod(toyHash(msg), D, N);      // 私钥盖章
}

bool verify(const char* msg, uint64_t sig) {
    return powMod(sig, E, N) == toyHash(msg);  // 公钥验章
}
// 身份 + 完整性 + 不可否认——App 签名/系统更新/区块链全靠它`,
    },
    apps: ['App/软件包签名', 'HTTPS 证书体系', '区块链交易', '不可否认性'],
  }),
}
