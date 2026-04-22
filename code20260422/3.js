/**
 * 完善核心代码编程 ：直捣黄龙
知识点 图、广搜
题目描述：
小王在玩一款叫做直捣黄龙的小游戏，在该游戏中他需要从入口位置进入敌营，绕过哨兵的层层封锁，达到敌军司令部实施斩首行动。
敌军阵营是一个n*n的矩阵，入口在坐标(0, n/2), 敌军司令部在坐标(n-1,n/2), 每个哨兵警戒以自己为中心的9宫格，一旦被哨兵发现则行动失败。
同时穿越敌营耗时越长，被发现的概率越高，因此小王需要寻找到可以绕过警戒到达敌军司令部的最短路径。
请你设计一个小程序，帮助小王统计这样的路径有多少条，以及路径长度。

规则说明：
1. 其中n为大于1的奇数且取值小于30，坐标x，y取值均从0开始，敌营左下角定义为(0,0),  右上角定义为(n-1, n-1)。
2. 敌营入口在坐标(0, n/2),  敌军司令部在坐标(n-1, n/2)。
3. 游戏角色的行动方向只包含上、下、左、右四个方向，即一次行动x、y坐标不可同时变化。
4. 在没有满足题目要求的可达路径时，需要返回{0,0}。

输入：
参数1，敌军阵营的边长n。
参数2，哨兵位置列表Point{x, y}， x表示行坐标， y表示列坐标。
输出：
两个成员的数组， 第一个成员为最短路径条数，第二个成员为最短路径长度。 

补充说明：
示例1
输入：3,[(1,1)]
输出：[0,0]
说明：
// 无路径场景，S表示哨兵位置, A 表示起点，E表示终点，哨兵警戒了全图
// 无可达路径，因此返回为{0, 0}
// 矩阵图如下：
0 0 0
A S E
0 0 0
示例2
输入：5,[(2,1)]
输出：[1,7]
说明：
// 单一最短路径场景，S表示哨兵位置, A 表示起点，E表示终点
// 最短路径: [(0,2),(0,3),(1,3),(2,3),(3,3),(4,3),(4,2)]
// 因此返回值为{1, 7}
// 矩阵图如下：
0 0 0 0 0
0 0 0 0 0
A 0 0 0 E
0 0 S 0 0
0 0 0 0 0
示例3
输入：5,[(2,2)]
输出：[2,9]
说明：
// 两条最短路径,  S表示哨兵位置, A 表示起点，E表示终点
// 路径1：[(0,2),(0,1),(0,0),(1,0),(2,0),(3,0),(4,0),(4,1),(4,2)]
// 路径2：[(0,2),(0,3),(0,4),(1,4),(2,4),(3,4),(4,4),(4,3),(4,2)]
// 因此返回值为{2,9}
矩阵图如下：
0 0 0 0 0
0 0 0 0 0
A 0 S 0 E
0 0 0 0 0
0 0 0 0 0
 */

const getCell = (n, rect, x, y) => rect[n - 1 - y][x]

const getNeighbors = (n, rect, x, y) => {
  const neighbors = []
  if (x > 0 && !getCell(n, rect, x - 1, y).disable) {
    neighbors.push(getCell(n, rect, x - 1, y))
  }
  if (x < n - 1 && !getCell(n, rect, x + 1, y).disable) {
    neighbors.push(getCell(n, rect, x + 1, y))
  }
  if (y > 0 && !getCell(n, rect, x, y - 1).disable) {
    neighbors.push(getCell(n, rect, x, y - 1))
  }
  if (y < n - 1 && !getCell(n, rect, x, y + 1).disable) {
    neighbors.push(getCell(n, rect, x, y + 1))
  }
  return neighbors
}

const getShortestPath = (n, soldiers) => {
  if (n <= 1 || n >= 30 || n % 2 === 0) {
    return [0, 0, []]
  }

  const rect = new Array(n).fill(0).map((_, row) =>
    new Array(n).fill(0).map((_, col) => ({
      x: col,
      y: n - 1 - row,
      disable: false,
      distance: Infinity,
      pathCount: 0,
      prevNodes: []
    }))
  )
  const points = soldiers.map((item) => {
    const [x, y] = item
      .split(',')
      .map((el) => parseInt(el.replace('(', '').replace(')', ''), 10))
    return { x, y }
  })

  const start = {x: 0, y: Math.floor(n / 2)}
  const end = {x: n - 1, y: Math.floor(n / 2)}

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      for (let k = 0; k < points.length; k++) {
        const disableX = Math.abs(rect[row][col].x - points[k].x) <= 1
        const disableY = Math.abs(rect[row][col].y - points[k].y) <= 1
        if (disableX && disableY) {
          rect[row][col].disable = true
          break
        }
      }

      if (rect[row][col].x === start.x && rect[row][col].y === start.y) {
        rect[row][col].start = true
      }
      if (rect[row][col].x === end.x && rect[row][col].y === end.y) {
        rect[row][col].end = true
      }
    }
  }

  const startCell = getCell(n, rect, start.x, start.y)
  const endCell = getCell(n, rect, end.x, end.y)

  if (startCell.disable || endCell.disable) {
    return [0, 0, []]
  }

  const queue = [[start.x, start.y]]
  startCell.distance = 0
  startCell.pathCount = 1

  for (let head = 0; head < queue.length; head++) {
    const [x, y] = queue[head]
    const current = getCell(n, rect, x, y)
    const neighbors = getNeighbors(n, rect, x, y)

    for (let k = 0; k < neighbors.length; k++) {
      const next = neighbors[k]
      const nextDistance = current.distance + 1

      if (next.distance === Infinity) {
        next.distance = nextDistance
        next.pathCount = current.pathCount
        next.prevNodes = [{x: current.x, y: current.y}]
        queue.push([next.x, next.y])
      } else if (next.distance === nextDistance) {
        next.pathCount += current.pathCount
        next.prevNodes.push({x: current.x, y: current.y})
      }
    }
  }

  if (endCell.distance === Infinity) {
    return [0, 0, []]
  }

  const buildPaths = (cell) => {
    if (cell.x === start.x && cell.y === start.y) {
      return [[[cell.x, cell.y]]]
    }

    const paths = []
    for (let i = 0; i < cell.prevNodes.length; i++) {
      const prev = cell.prevNodes[i]
      const prevCell = getCell(n, rect, prev.x, prev.y)
      const prevPaths = buildPaths(prevCell)

      for (let j = 0; j < prevPaths.length; j++) {
        paths.push([...prevPaths[j], [cell.x, cell.y]])
      }
    }

    return paths
  }

  return [endCell.pathCount, endCell.distance + 1, buildPaths(endCell)]
}

const temp1 = getShortestPath(3, ['(1,1)'])
console.log(temp1)

const temp2 = getShortestPath(5, ['(2,1)'])
console.log(temp2)

const temp3 = getShortestPath(5, ['(2,2)'])
console.log(temp3)
