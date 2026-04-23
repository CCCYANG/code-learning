/**
 * 题目描述
AI识别到面板上有N（1 ≤ N ≤ 100）个指示灯，灯大小一样，任意两个之间无重叠。

由于AI识别误差，每次别到的指示灯位置可能有差异，以4个坐标值描述AI识别的指示灯的大小和位置(左上角x1,y1，右下角x2,y2)，

请输出先行后列排序的指示灯的编号，排序规则：

每次在尚未排序的灯中挑选最高的灯作为的基准灯，
找出和基准灯属于同一行所有的灯进行排序。两个灯高低偏差不超过灯半径算同一行（即两个灯坐标的差 ≤ 灯高度的一半）。
输入描述
第一行为N，表示灯的个数
接下来N行，每行为1个灯的坐标信息，格式为：

编号 x1 y1 x2 y2

编号全局唯一
1 ≤ 编号 ≤ 100
0 ≤ x1 < x2 ≤ 1000
0  ≤  y1 < y2 ≤ 1000
输出描述
排序后的编号列表，编号之间以空格分隔
 */

// 定义主函数，lights 表示所有指示灯的坐标信息列表。
const sortLights = (lights) => {
  // 如果没有灯，则直接返回空数组。
  if (lights.length === 0) {
    // 返回空结果。
    return []
  }

  // 把输入的灯信息补充出高度、中心点坐标等辅助字段。
  const normalizedLights = lights.map(([id, x1, y1, x2, y2]) => ({
    // 保存灯的编号。
    id,
    // 保存左上角横坐标。
    x1,
    // 保存左上角纵坐标。
    y1,
    // 保存右下角横坐标。
    x2,
    // 保存右下角纵坐标。
    y2,
    // 保存灯的高度。
    height: y2 - y1,
    // 保存灯中心点的横坐标。
    centerX: (x1 + x2) / 2,
    // 保存灯中心点的纵坐标。
    centerY: (y1 + y2) / 2
  }))

  // 由于所有灯大小一样，所以直接取第一盏灯的高度作为统一高度。
  const lightHeight = normalizedLights[0].height
  // 根据题意，纵向偏差不超过灯高度的一半即可视为同一行。
  const rowThreshold = lightHeight / 2
  // 用 remaining 保存还没有被分组排序的灯。
  let remaining = [...normalizedLights]
  // 用 result 保存最终排序后的编号。
  const result = []

  // 当仍然有未处理的灯时，持续分行处理。
  while (remaining.length > 0) {
    // 先按“越高越前、越左越前、编号越小越前”对剩余灯排序。
    remaining.sort((a, b) => {
      // 先比较纵向中心点，纵坐标更小的灯更靠上。
      if (a.centerY !== b.centerY) {
        // 返回纵向升序结果。
        return a.centerY - b.centerY
      }

      // 如果纵坐标相同，则比较横向位置。
      if (a.centerX !== b.centerX) {
        // 返回横向升序结果。
        return a.centerX - b.centerX
      }

      // 如果位置也相同，则按编号升序兜底。
      return a.id - b.id
    })

    // 取当前剩余灯里最靠上的一盏灯作为基准灯。
    const baseLight = remaining[0]
    // 用 currentRow 保存当前这一行的所有灯。
    const currentRow = []
    // 用 nextRemaining 保存剔除当前行之后剩余的灯。
    const nextRemaining = []

    // 遍历所有尚未排序的灯，判断是否与基准灯属于同一行。
    for (let i = 0; i < remaining.length; i++) {
      // 取出当前这盏灯。
      const light = remaining[i]
      // 计算当前灯和基准灯在纵向中心点上的偏差。
      const deltaY = Math.abs(light.centerY - baseLight.centerY)

      // 如果纵向偏差不超过阈值，则判定它们属于同一行。
      if (deltaY <= rowThreshold) {
        // 把这盏灯放进当前行。
        currentRow.push(light)
      } else {
        // 否则留到后面继续分组。
        nextRemaining.push(light)
      }
    }

    // 对当前行内的灯按照从左到右排序。
    currentRow.sort((a, b) => {
      // 先比较横向中心点，横坐标更小的更靠左。
      if (a.centerX !== b.centerX) {
        // 返回横向升序结果。
        return a.centerX - b.centerX
      }

      // 如果横坐标一致，则按编号升序兜底。
      return a.id - b.id
    })

    // 把当前这一行排序后的灯编号依次加入最终结果。
    for (let i = 0; i < currentRow.length; i++) {
      // 取出当前行中的一盏灯。
      const light = currentRow[i]
      // 把它的编号加入结果数组。
      result.push(light.id)
    }

    // 更新 remaining，继续处理下一行。
    remaining = nextRemaining
  }

  // 返回最终排序后的编号数组。
  return result
}

// 构造一个简单示例，第一行有 1、2，第二行有 3、4。
const lights1 = [
  // 编号 1，位于第一行左侧。
  [1, 10, 10, 30, 30],
  // 编号 2，位于第一行右侧。
  [2, 60, 12, 80, 32],
  // 编号 3，位于第二行左侧。
  [3, 12, 60, 32, 80],
  // 编号 4，位于第二行右侧。
  [4, 62, 58, 82, 78]
]

// 打印示例排序结果。
console.log(sortLights(lights1))
