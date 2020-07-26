// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'dev-0033'
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try{
    db.collection('users').where({
      _openid:wxContext.OPENID
    }).update({
      data:{
        lastLogout:new Date()
      }
    })
  }catch(e){
    return e
  }
}