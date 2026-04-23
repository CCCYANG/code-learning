/**
 * 题目描述
给定一个非空字符串S，其被N个‘-’分隔成N+1的子串，给定正整数K，要求除第一个子串外，其余的子串每K个字符组成新的子串，并用‘-’分隔。

对于新组成的每一个子串，如果它含有的小写字母比大写字母多，则将这个子串的所有大写字母转换为小写字母；

反之，如果它含有的大写字母比小写字母多，则将这个子串的所有小写字母转换为大写字母；大小写字母的数量相等时，不做转换。

输入描述
输入为两行，第一行为参数K，第二行为字符串S。

输出描述
输出转换后的字符串。

示例1
输入

3
12abc-abCABc-4aB@
输出

12abc-abc-ABC-4aB-@
说明

子串为12abc、abCABc、4aB@，第一个子串保留，
后面的子串每3个字符一组为abC、ABc、4aB、@，
abC中小写字母较多，转换为abc，
ABc中大写字母较多，转换为ABC，
4aB中大小写字母都为1个，不做转换，
@中没有字母，连起来即12abc-abc-ABC-4aB-@

示例2
输入

12
12abc-abCABc-4aB@
输出

12abc-abCABc4aB@

说明

子串为12abc、abCABc、4aB@，第一个子串保留，
后面的子串每12个字符一组为abCABc4aB@，
这个子串中大小写字母都为4个，不做转换，
连起来即12abc-abCABc4aB@

解题思路
这个题目的目标是对字符串进行重新分组和大小写转换。题目的关键点和步骤如下：

字符串分组：

给定一个字符串 S，这个字符串用 '-' 分隔成了多个子串。假设有 N 个 '-'，那么 S 被分隔成 N+1 个子串。
给定一个正整数 K，要求除第一个子串外，其余的子串按照每 K 个字符重新分组。
大小写转换：

对于新分组后的每个子串，如果小写字母的数量比大写字母多，就将这个子串的所有大写字母转换为小写字母；
如果大写字母的数量比小写字母多，就将这个子串的所有小写字母转换为大写字母；
如果大小写字母数量相等，则保持不变。
输出要求：

第一个子串保持不变。
后面的子串根据重新分组和大小写转换后的结果，再次用 '-' 分隔，形成最终的输出字符串。
示例1解析：
输入：K=3，字符串为 12abc-abCABc-4aB@
初始子串分割结果：12abc、abCABc、4aB@
分组处理：
第一个子串 12abc 保持不变。
第二个子串 abCABc 按照每 3 个字符重新分组：abC、ABc。分别统计大小写字母数量，abC 中小写字母较多，因此将 abC 转换为 abc；ABc 中大写字母较多，因此将 ABc 转换为 ABC。
第三个子串 4aB@ 按照每 3 个字符重新分组：4aB、@。4aB 中大小写字母数量相等，因此保持不变。
最终输出：12abc-abc-ABC-4aB-@
示例2解析：
输入：K=12，字符串为 12abc-abCABc-4aB@
初始子串分割结果：12abc、abCABc、4aB@
分组处理：
第一个子串 12abc 保持不变。
第二个子串 abCABc 和 4aB@ 加起来不超过 12 个字符，所以它们合并为一个子串：abCABc4aB@，大小写字母数量相等，因此保持不变。
最终输出：12abc-abCABc4aB@
 */
// 定义辅助函数，用来根据大小写字母数量规范化当前分组。
const normalizeGroup = (group) => {
  // 初始化小写字母数量。
  let lowerCount = 0
  // 初始化大写字母数量。
  let upperCount = 0

  // 遍历当前分组中的每一个字符。
  for (let i = 0; i < group.length; i++) {
    // 取出当前位置字符。
    const char = group[i]
    // 如果当前字符是小写字母。
    if (char >= 'a' && char <= 'z') {
      // 小写字母计数加 1。
      lowerCount++
    } else if (char >= 'A' && char <= 'Z') {
      // 如果当前字符是大写字母，则大写字母计数加 1。
      upperCount++
    }
  }

  // 如果小写字母数量大于大写字母数量。
  if (lowerCount > upperCount) {
    // 把整个分组转成小写后返回。
    return group.toLowerCase()
  }

  // 如果大写字母数量大于小写字母数量。
  if (upperCount > lowerCount) {
    // 把整个分组转成大写后返回。
    return group.toUpperCase()
  }

  // 如果大小写字母数量相等，则原样返回。
  return group
}

// 定义主函数，k 表示重新分组的长度，s 表示原始字符串。
const formatStringByK = (k, s) => {
  // 先按 '-' 拆分原始字符串。
  const parts = s.split('-')
  // 第一个子串按照题意保持不变。
  const firstPart = parts[0]
  // 把剩余所有子串拼接成一个连续字符串。
  const merged = parts.slice(1).join('')
  // 初始化结果数组，并先放入第一个保留不变的子串。
  const result = [firstPart]

  // 从左到右每次取 k 个字符进行重新分组。
  for (let i = 0; i < merged.length; i += k) {
    // 截取当前这一组字符串。
    const group = merged.slice(i, i + k)
    // 对当前分组做大小写规则转换后放入结果数组。
    result.push(normalizeGroup(group))
  }

  // 用 '-' 把所有分组重新拼接起来并返回。
  return result.join('-')
}

// 打印示例 1 的运行结果。
console.log(formatStringByK(3, '12abc-abCABc-4aB@'))

// 打印示例 2 的运行结果。
console.log(formatStringByK(12, '12abc-abCABc-4aB@'))
