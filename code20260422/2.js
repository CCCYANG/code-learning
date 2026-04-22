/**
 * 完善核心代码编程 ：配置操作失败数量统计
知识点   字符串、输入的读取解析

题目描述：
模拟一个系统的命令行配置，包含添加、修改、删除三项操作，详情如下：
添加操作命令：add_rule rule_id=1 rule_index=18
修改操作命令：mod_rule rule_id=1 rule_index=100
删除操作命令：del_rule rule_id=1
其中：add_rule、mod_rule、del_rule是操作关键字，rule_id、rule_index是属性关键字且属性取值范围为数字1-9999之间，操作、属性之间都用空格进行分割；

1、在进行所有操作时，如果缺少关键字，或者相应的rule_id、rule_index的取值不符合要求，则操作失败。
2、在进行添加操作时，参数必须包含rule_id和rule_index，如果添加的rule_id当前不存在，则添加成功，如果添加已经存在的rule_id，则操作失败。
3、在进行修改操作时，参数必须包含rule_id和rule_index，如果当前rule_id不存在，或前后rule_index没有变化，则操作失败。
4、在进行删除操作时，参数必须包含rule_id，如果当前rule_id不存在，，则操作失败。

在进行批量操作时，一个命令失败后可以继续一下条命令的操作。现给有一组批量操作的字符串，包括不超过1000条连续的操作指令，格式为[cmd][cmd][cmd]，请将字符串解析后按照顺序进入你实现的系统，统计出配置失败的次数。

补充说明：
示例1
输入："[add_rule rule_id=1 rule_index=9999][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]"
输出：0
说明：所有操作都成功
示例2
输入："[add_rule rule_id=1][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]"
输出：3
说明：add操作不包含rule_index，添加失败，后续修改和删除操作，对应的rule_id无数据，操作也失败，累计失败3次。
示例3
输入："[add_rule rule_id=1 rule_index=10000]"
输出：1
说明：rule_index不符合规范
 */

const getFailCount = (cmdStr) => {
  const ruleMap = new Map()
  const cmdList = cmdStr.match(/\[[^\]]*\]/g) || []
  let failCount = 0

  const parsePositiveNum = (raw) => {
    if (!/^\d+$/.test(raw)) {
      return null
    }

    const value = Number(raw)
    if (value < 1 || value > 9999) {
      return null
    }

    return value
  }

  for (let i = 0; i < cmdList.length; i++) {
    const cmd = cmdList[i].slice(1, -1).trim()
    const parts = cmd.split(' ').filter(Boolean)
    const action = parts[0]

    if (!['add_rule', 'mod_rule', 'del_rule'].includes(action)) {
      failCount++
      continue
    }

    const params = {}
    let isInvalid = false

    for (let j = 1; j < parts.length; j++) {
      const item = parts[j]
      if (!item.includes('=')) {
        isInvalid = true
        break
      }

      const [key, value] = item.split('=')
      if (!['rule_id', 'rule_index'].includes(key) || value === '' || params[key] !== undefined) {
        isInvalid = true
        break
      }

      params[key] = value
    }

    if (isInvalid) {
      failCount++
      continue
    }

    const ruleId = parsePositiveNum(params.rule_id ?? '')
    const ruleIndex = params.rule_index !== undefined ? parsePositiveNum(params.rule_index) : null

    if (ruleId === null) {
      failCount++
      continue
    }

    if (action === 'add_rule') {
      if (ruleIndex === null || ruleMap.has(ruleId)) {
        failCount++
        continue
      }

      ruleMap.set(ruleId, ruleIndex)
      continue
    }

    if (action === 'mod_rule') {
      if (ruleIndex === null || !ruleMap.has(ruleId) || ruleMap.get(ruleId) === ruleIndex) {
        failCount++
        continue
      }

      ruleMap.set(ruleId, ruleIndex)
      continue
    }

    if (parts.length !== 2 || params.rule_index !== undefined || !ruleMap.has(ruleId)) {
      failCount++
      continue
    }

    ruleMap.delete(ruleId)
  }

  return failCount
}

const temp1 = getFailCount('[add_rule rule_id=1 rule_index=9999][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]')
console.log(temp1)

const temp2 = getFailCount('[add_rule rule_id=1][mod_rule rule_id=1 rule_index=10][del_rule rule_id=1]')
console.log(temp2)

const temp3 = getFailCount('[add_rule rule_id=1 rule_index=10000]')
console.log(temp3)
