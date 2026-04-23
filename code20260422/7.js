/**
 * 题目描述
有一个特异性的双端队列，该队列可以从头部或尾部添加数据，但是只能从头部移出数据。

小A依次执行2n个指令往队列中添加数据和移出数据。其中n个指令是添加数据（可能从头部添加、也可能从尾部添加），依次添加1到n；n个指令是移出数据。

现在要求移除数据的顺序为1到n。

为了满足最后输出的要求，小A可以在任何时候调整队列中数据的顺序。

请问 小A 最少需要调整几次才能够满足移除数据的顺序正好是1到n。

输入描述
第一行一个数据n，表示数据的范围。

接下来的2n行，其中有n行为添加数据，指令为：

head add x表示从头部添加数据 x，
tail add x 表示从尾部添加数据x，
另外 n 行为移出数据指令，指令为：remove 的形式，表示移出1个数据；

1 ≤ n ≤ 3 * 10^5。

所有的数据均合法。

输出描述
一个整数，表示 小A 要调整的最小次数。

示例1
输入

5
head add 1
tail add 2
remove
head add 3
tail add 4
head add 5
remove
remove
remove
remove
输出

1
 */

// 定义主函数，commands 表示按顺序执行的 2n 条指令。
const getMinAdjustCount = (commands) => {
  // 记录最少需要调整多少次，初始值为 0。
  let adjustCount = 0
  // 记录当前队列里元素的数量。
  let size = 0
  // 记录当前队列顺序是否已经被破坏。
  let dirty = false

  // 按顺序遍历所有指令。
  for (let i = 0; i < commands.length; i++) {
    // 取出当前这一条指令。
    const command = commands[i]

    // 如果当前指令是移出操作。
    if (command === 'remove') {
      // 如果当前队列顺序已经被破坏。
      if (dirty) {
        // 那么在本次移出前必须调整一次。
        adjustCount++
        // 调整完成后，队列重新恢复为正确顺序。
        dirty = false
      }

      // 执行一次移出后，队列中的元素数量减 1。
      size--
      // 当前指令处理完成，进入下一轮循环。
      continue
    }

    // 将添加指令按空格拆分成数组。
    const parts = command.split(' ')
    // 取出添加位置，它只可能是 head 或 tail。
    const position = parts[0]

    // 如果当前是从头部添加，并且队列当前不是空的。
    if (position === 'head' && size > 0) {
      // 由于加入的数据越来越大，放在头部会破坏从小到大的移出顺序。
      dirty = true
    }

    // 无论从头部还是尾部添加，队列元素数量都要加 1。
    size++
  }

  // 返回最少需要调整的次数。
  return adjustCount
}

// 构造题目示例中的指令列表。
const commands1 = [
  // 从头部添加 1。
  'head add 1',
  // 从尾部添加 2。
  'tail add 2',
  // 执行一次移出操作。
  'remove',
  // 从头部添加 3。
  'head add 3',
  // 从尾部添加 4。
  'tail add 4',
  // 从头部添加 5。
  'head add 5',
  // 执行一次移出操作。
  'remove',
  // 执行一次移出操作。
  'remove',
  // 执行一次移出操作。
  'remove',
  // 执行一次移出操作。
  'remove'
]

// 打印题目示例对应的最少调整次数。
console.log(getMinAdjustCount(commands1))
