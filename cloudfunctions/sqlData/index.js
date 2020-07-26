// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-0033'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection(event.name).doc(event._id).get().then(res=>{
    return res
  })
}