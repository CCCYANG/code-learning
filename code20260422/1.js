/**
 * 完善核心代码编程 准备生日礼物
知识点  字符串、map

题目描述：
小明在一个充满人文关怀的公司上班，公司每个月都要为该月生日的同事送一份生日小礼物，该事项由小明负责，请帮助小明统计某一月份应该准备多少礼物，重复录入的员工生日以最后一次录入结果为准，请不要重复统计，避免浪费。

输入：
参数1，要发放礼物的月份，取值1到12。
参数2，员工列表。
参数3，员工生日日期列表，该列表和员工列表中的数据对应存在一一对应关系，长度一致。
输出：
该月份要准备的礼品个数。
补充说明：
1.小明公司的员工人数不超过100人。
2.员工姓名是字母和数字的组合，姓名长度大于0，小于16字节。
3.日期录入格式统一采用Year/Month/Day，Year长度为4，Month和Day长度为1到2，系统保证录入日期为合法日期。
4.不考虑同名多位员工的情况，名字一致即可认为是同一员工(在生产系统会通过工号区分，本系统简化处理)。

示例1
输入：5,["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],["1985/5/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"]
输出：3
说明：在5月份出生的员工有3人，因此返回为3。
示例2
输入：10,["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"],["1985/05/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/10/13", "2010/10/13", "2015/10/14", "2020/10/15"]
输出：6
说明：在10月份出生的员工有6人，因此返回6。
示例3
输入：5,["Alice", "Bob", "Charlie", "Alice", "Eve", "Frank", "Grace", "Helen"],["1985/5/10", "1990/10/11", "1995/10/11", "1985/7/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"]
输出：2
说明：5月份出生的员工有2个，因此返回2。
说明：Alice重复录入了，第一次录入出生月份为5月，第二次录入出生月份为7月，因此Alice不被统计到5月份。
 */

const getGiftCount = (month, employeeList, birthdayList) => {
  // 1. 遍历员工列表，将员工姓名和生日日期对应起来
  const map = new Map()
  let count = 0
  for (let i = 0; i < employeeList.length; i++) {
    const monthInBirthday = birthdayList[i].split('/')[1]
    const actualMonth = Number(monthInBirthday)
    if (!map.has(employeeList[i]) && month === actualMonth) {
      count++
    } else if (map.has(employeeList[i]) && month !== actualMonth) {
      count--
    }
    map.set(employeeList[i], actualMonth)
  }
  return count
}

const temp1 = getGiftCount(5, ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"], ["1985/5/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"])
console.log(temp1)

const temp2 = getGiftCount(10, ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace", "Helen"], ["1985/05/10", "1990/10/11", "1995/10/11", "2000/11/10", "2005/10/13", "2010/10/13", "2015/10/14", "2020/10/15"])
console.log(temp2)

const temp3 = getGiftCount(5, ["Alice", "Bob", "Charlie", "Alice", "Eve", "Frank", "Grace", "Helen"], ["1985/5/10", "1990/10/11", "1995/10/11", "1985/7/10", "2005/05/01", "2010/10/13", "2015/10/14", "2020/5/2"])
console.log(temp3)