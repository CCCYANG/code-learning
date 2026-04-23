/**
 * 题目描述
在星球争霸篮球赛对抗赛中，最大的宇宙战队希望每个人都能拿到MVP，MVP的条件是单场最高分得分获得者。
可以并列所以宇宙战队决定在比赛中尽可能让更多队员上场，并且让所有得分的选手得分都相同，
然而比赛过程中的每1分钟的得分都只能由某一个人包揽。

输入描述
输入第一行为一个数字 t ，表示为有得分的分钟数 1 ≤ t ≤ 50
第二行为 t 个数字，代表每一分钟的得分 p， 1 ≤ p ≤ 50

输出描述
输出有得分的队员都是MVP时，最少得MVP得分。

用例
输入  9 5 2 1 5 2 1 5 2 1
输出  6
说明  样例解释 一共 4 人得分，分别都是 6 分 5 + 1 ， 5 + 1 ， 5 + 1 ， 2 + 2 + 2
 */

// 定义辅助函数，用来判断当前分数数组能否被划分为若干组且每组和都等于 target。
const canSplitToTarget = (scores, target) => {
  // 计算所有分数的总和。
  const total = scores.reduce((sum, score) => sum + score, 0)
  // 计算最终需要分成多少组。
  const groupCount = total / target
  // 创建一个长度为 51 的频次数组，用来统计每种分数出现了多少次。
  const counts = new Array(51).fill(0)

  // 遍历所有分数。
  for (let i = 0; i < scores.length; i++) {
    // 统计当前分数的出现次数。
    counts[scores[i]]++
  }

  // 提前收集所有实际出现过的分数值，并按从大到小排序，方便 DFS 剪枝。
  const values = []

  // 从大到小遍历所有可能的分数值。
  for (let score = 50; score >= 1; score--) {
    // 如果当前分数值确实出现过。
    if (counts[score] > 0) {
      // 就把它加入候选分数数组。
      values.push(score)
    }
  }

  // 定义深度优先搜索函数。
  const dfs = (startIndex, currentSum, finishedGroups) => {
    // 如果已经成功凑出了 groupCount - 1 组。
    if (finishedGroups === groupCount - 1) {
      // 那么剩下的分数一定自动构成最后一组，直接返回 true。
      return true
    }

    // 如果当前这一组已经凑满 target。
    if (currentSum === target) {
      // 就开始递归构造下一组，并把已完成组数加 1。
      return dfs(0, 0, finishedGroups + 1)
    }

    // 记录本层递归上一次尝试过的分数值，用来避免同层重复搜索。
    let lastTried = -1

    // 从 startIndex 开始枚举可以放进当前组的分数。
    for (let i = startIndex; i < values.length; i++) {
      // 取出当前正在尝试的分数值。
      const score = values[i]

      // 如果当前分数已经没有剩余可用次数。
      if (counts[score] === 0) {
        // 就跳过这次尝试。
        continue
      }

      // 如果当前分数和上一轮同层尝试的分数相同。
      if (score === lastTried) {
        // 说明会产生重复搜索，直接跳过。
        continue
      }

      // 如果把当前分数加入后会超过目标值。
      if (currentSum + score > target) {
        // 就说明这条分支不合法，直接跳过。
        continue
      }

      // 先消耗一个当前分数。
      counts[score]--

      // 递归尝试把当前分数放进当前组后，剩余分数是否还能成功划分。
      if (dfs(i, currentSum + score, finishedGroups)) {
        // 如果可以成功划分，则直接返回 true。
        return true
      }

      // 如果当前方案失败，则回溯恢复当前分数的使用次数。
      counts[score]++

      // 记录当前层已经尝试过这个分数值。
      lastTried = score

      // 如果当前组还是空的，并且把这个数作为开头都失败了。
      if (currentSum === 0) {
        // 说明当前组没必要再试别的同层开头方案了，直接返回 false。
        return false
      }

      // 如果当前分数恰好把这一组填满但仍失败。
      if (currentSum + score === target) {
        // 说明以这种方式结束当前组也不行，可以直接剪枝返回 false。
        return false
      }
    }

    // 如果所有候选分数都尝试过仍然失败，则返回 false。
    return false
  }

  // 从第 0 个候选分数开始，当前组和为 0，已完成组数为 0。
  return dfs(0, 0, 0)
}

// 定义主函数，scores 表示每一分钟的得分列表。
const getMinMvpScore = (scores) => {
  // 先把分数按从大到小排序，方便后续剪枝。
  const sortedScores = [...scores].sort((a, b) => b - a)
  // 计算总得分。
  const total = sortedScores.reduce((sum, score) => sum + score, 0)
  // 取单分钟最大得分，它是目标分组和的下界。
  const maxScore = sortedScores[0]

  // 从最小可能目标值 maxScore 开始，依次尝试到 total。
  for (let target = maxScore; target <= total; target++) {
    // 如果总和不能被 target 整除。
    if (total % target !== 0) {
      // 说明不可能平均分成若干组，直接跳过。
      continue
    }

    // 如果当前 target 可以把所有分数划分成若干组且每组和都等于 target。
    if (canSplitToTarget(sortedScores, target)) {
      // 那么这个 target 就是最少的 MVP 得分，直接返回。
      return target
    }
  }

  // 理论上总能至少分成一组 total，这里兜底返回 total。
  return total
}

// 构造题目示例中的每分钟得分数组。
const scores1 = [5, 2, 1, 5, 2, 1, 5, 2, 1]

// 打印题目示例对应的最少 MVP 得分。
console.log(getMinMvpScore(scores1))
