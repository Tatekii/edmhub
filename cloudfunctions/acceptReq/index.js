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
  const target = event.openid

  try {

    await db.collection('users').where({
      _openid: wxContext.OPENID
    }).update({
      data: {
        friend: _.addToSet(target)
      }
    })

    await db.collection('users').where({
      _openid: target
    }).update({
      data: {
        friend: _.addToSet(wxContext.OPENID)
      }
    })

    return await db.collection('chats').add({
      data: {
        dialoge: [{
          content: '我接受了你的好友请求',          
          date: new Date(),
          speaker: wxContext.OPENID
        }]
      }
    }).then(async res => {
      // id
      const id = res._id
      await db.collection('message').where({
        user: wxContext.OPENID
      }).update({
        data: {
          chats: _.unshift({
            with: target,
            chatid: id,
            isNew: true,
            isRead:false
          }),
          // 删除请求
          request: _.pull({
            _openid: target
          })
        }
      })

      await db.collection('message').where({
        user: target
      }).update({
        data: {
          chats: _.unshift({
            with: wxContext.OPENID,
            chatid: id,
            isNew: true,
            isRead:false
          })
        }
      })

      return res
    })
  } catch (err) {
    return err
  }
}