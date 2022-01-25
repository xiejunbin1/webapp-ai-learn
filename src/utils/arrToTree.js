// 将数组转为tree
export function arrToTree(arr, key1, key2) {
  const tempObj = {}
  const result = []
  // 构造一个对象，该对象的key是所有节点的某个值，比如id，value是对应节点
  for (let i = 0, l = arr.length; i < l; i++) {
    tempObj[arr[i][key1]] = arr[i]
  }
  //
  // 遍历 寻找父节点
  for (let i = 0, l = arr.length; i < l; i++) {
    // pNode 父节点
    const pNode = tempObj[arr[i][key2]]
    // 父节点存在
    if (pNode) {
      if (!pNode.children) {
        pNode.children = []
        pNode.children.push(arr[i])
      } else {
        pNode.children.push(arr[i])
      }
    } else {
      // 不存在父节点 直接推入result 一级菜单
      result.push(arr[i])
    }
  }
  return result
}
