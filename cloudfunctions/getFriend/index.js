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
  try {
    let arr = await db.collection('users').where({
      _openid: wxContext.OPENID
    }).field({
      friend:1
    }).get()

    arr = arr.data[0].friend
    
    return await db.collection('users').where({
      _openid: _.in(arr)
    }).get()
    
  } catch (e) {
    return e
  }

}