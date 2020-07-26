// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'dev-0033'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 消息
  const msg = event.msg
  // 对话id
  const chatid = event.chatid
  // 收到消息的另一人呢
  const target = event.target

  try{
    await db.collection('chats').doc(chatid).update({
      data:{
        dialoge:_.push({
          content:msg,
          date:new Date(),
          speaker:wxContext.OPENID
        })
      }
    }).then(async res=>{
      await db.collection('message').where({
        user:target,
        'chats.chatid':chatid
      }).update({
        data:{
          'chats.$.isNew':true,
          'chats.$.isRead':false
        }
      })
      // await db.collection('message').where({
      //   user:wxContext.OPENID,
      //   'chats.chatid':chatid
      // }).update({
      //   data:{
      //     'chats.$.isNew':true
      //   }
      // })
      return res
    })
  }catch(e){
    return e
  }
}