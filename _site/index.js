var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];
function flatArr(arr,nodeList = []){
  return arr.reduce((total,item)=>{
    if(Array.isArray(item)){
      flatArr(item,total)
    }else{
      total.push(item)
    }
    return total
  },nodeList)
}
给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]。

let set = new Set()
