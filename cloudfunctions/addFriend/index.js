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
  const target = event._openid

  try {

    const flag = await db.collection('message').where({
      user: target,
      request: _.elemMatch({
        _openid: wxContext.OPENID
      })
    }).get()

    // return flag
    // 有请求记录
    if (flag.data.length) {
      return 'requested'
    } else {
      // 没有请求记录
      // 新增记录
      return await db.collection('message').where({
        user: target
      }).update({
        data: {
          request: _.unshift({
            _openid: wxContext.OPENID,
            word:event.words,
            date: new Date()
          })
        }
      }).then(res=>{
        return res
      })
    }

  } catch (err) {
    return err
  }
}