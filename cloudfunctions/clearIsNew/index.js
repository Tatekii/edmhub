// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-0033'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const list = event.list

  try {

    let res1 = await db.collection('message').where({
      user: wxContext.OPENID,
      'chats.chatid': _.in(list)
    }).update({
      data: {
        'chats.$.isNew': false
      }
    })

    let res2 = await db.collection('chats').where({
      _id: _.in(list)
    }).update({
      data: {
        dialoge: []
      }
    })

    return res1,res2

  } catch (e) {
    return e
  }
}