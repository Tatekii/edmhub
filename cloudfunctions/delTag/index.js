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
    // for (let i of event.delArr) {
    //   console.log(i)
    //   let res = await db.collection('tags').where({
    //     title: i
    //   }).update({
    //     data:{
    //       users:_.pull
    //     }
    //   })
    // }
    return await db.collection('tags').where({
      title: _.in(['EDC', 'ULTRA'])
    }).update({
      data: {
        users: _.pull(wxContext.OPENID)
      }
    })
  } catch (e) {
    return e
  }
}