// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'dev-0033'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const chatid = event.chatid
  

  try{

    return await db.collection('message').where({
      user:wxContext.OPENID,
      'chats.chatid':chatid
    }).update({
      data:{
        'chats.$.isRead':true
      }
    })
  }catch(e){
    return e
  }
}