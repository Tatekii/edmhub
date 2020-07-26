// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'dev-0033'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection(event.name).where({
      _openid : event._openid
    }).update({
      data:{
        ...event.updates
      }
    }).then(res=>{
      return res
    })
  }catch(e){
    return e
  }
}