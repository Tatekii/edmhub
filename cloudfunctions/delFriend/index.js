// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-0033'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const target = event.openid

  try {
    return await db.collection('users').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        friend: _.pull(target)
      }

    }).then(res => {
      return res
    })
  } catch (e) {
    return e
  }
}