/**
 * 电费计算情景题
 * 电费计费方式分为3个档位
 * 第一档每天12:00到13:30，17:30到18:00，这是两个固定时间段，只有落在这两个时间段内的才计算第一档
 * 第二档为每天除第一档时间外的时间，最大时间上限为10个小时，最大值为600分钟
 * 第三档为排除第一档、第二档自我之外的剩余时间
 * 
 * 约束24小时制 从0:00到23:59，时间格式为HH:MM,分钟位强制补0
 * 结束时间不会早于开始时间，不存在跨天场景
 * 
 * 输入格式：
 * 时间字符串，用空格隔开，分别表示开始时间和结束时间
 * 输出格式：
 * 数组包含3个元素，分别表示第一档、第二档、第三档的用电时间，单位为分钟
 * 
 * 样例1：
 * 输入 "8:00 23:30"
 * 输出 [120, 600, 210]
 * 
 * 样例2：
 * 输入 "13:30 17:30"
 * 输出 [0, 240, 0]
 * 
 * 样例3：
 * 输入 "14:00 23:30"
 * 输出 [30, 540, 0]
 */

// 定义第一档的两个固定时间段，使用分钟表示。
const FIRST_LEVEL_RANGES = [
  // 第一段为 12:00 到 13:30。
  [12 * 60, 13 * 60 + 30],
  // 第二段为 17:30 到 18:00。
  [17 * 60 + 30, 18 * 60]
]

// 定义第二档最多可以统计的分钟数。
const SECOND_LEVEL_LIMIT = 10 * 60

// 定义时间解析函数，把 HH:MM 转成当天第几分钟。
const parseTimeToMinutes = (time) => {
  // 按冒号拆分小时和分钟。
  const [hourStr, minuteStr] = time.split(':')
  // 把小时字符串转成数字。
  const hour = Number(hourStr)
  // 把分钟字符串转成数字。
  const minute = Number(minuteStr)
  // 返回从当天 00:00 开始累计的分钟数。
  return hour * 60 + minute
}

// 定义计算两个区间重叠分钟数的函数。
const getOverlapMinutes = (startA, endA, startB, endB) => {
  // 计算两个区间重叠部分的开始位置。
  const start = Math.max(startA, startB)
  // 计算两个区间重叠部分的结束位置。
  const end = Math.min(endA, endB)
  // 如果结束位置大于开始位置，则说明存在重叠，否则重叠为 0。
  return Math.max(0, end - start)
}

// 定义计算单日片段第一档分钟数的函数。
const getFirstLevelMinutesInOneDay = (start, end) => {
  // 初始化第一档分钟数。
  let minutes = 0

  // 遍历第一档的两个固定时间段。
  for (let i = 0; i < FIRST_LEVEL_RANGES.length; i++) {
    // 取出当前第一档时间段。
    const [rangeStart, rangeEnd] = FIRST_LEVEL_RANGES[i]
    // 累加当前用电区间和第一档时间段的重叠分钟数。
    minutes += getOverlapMinutes(start, end, rangeStart, rangeEnd)
  }

  // 返回当前单日片段中的第一档分钟数。
  return minutes
}

// 定义主函数，timeRange 表示输入的开始时间和结束时间字符串。
const calculateElectricityMinutes = (timeRange) => {
  // 按空格拆分开始时间和结束时间。
  const [startTime, endTime] = timeRange.split(' ')
  // 把开始时间转换成分钟数。
  const startMinutes = parseTimeToMinutes(startTime)
  // 把结束时间转换成分钟数。
  const endMinutes = parseTimeToMinutes(endTime)
  // 由于题目约束不会跨天，所以直接计算同一天内的第一档重叠分钟数。
  const firstLevelMinutes = getFirstLevelMinutesInOneDay(startMinutes, endMinutes)

  // 计算总用电分钟数。
  const totalMinutes = endMinutes - startMinutes
  // 计算扣除第一档后的剩余分钟数。
  const restMinutes = totalMinutes - firstLevelMinutes
  // 第二档最多只能统计 600 分钟。
  const secondLevelMinutes = Math.min(restMinutes, SECOND_LEVEL_LIMIT)
  // 第三档为扣除第一档和第二档之后剩余的分钟数。
  const thirdLevelMinutes = Math.max(0, restMinutes - secondLevelMinutes)
  // 返回三个档位的用电时间。
  return [firstLevelMinutes, secondLevelMinutes, thirdLevelMinutes]
}

// 打印样例 1 的计算结果。
console.log(calculateElectricityMinutes('8:00 23:30'))

// 打印样例 2 的计算结果。
console.log(calculateElectricityMinutes('13:30 17:30'))

// 打印样例 3 的计算结果。
console.log(calculateElectricityMinutes('14:00 23:30'))
