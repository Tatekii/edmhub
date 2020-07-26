// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-0033'
})

// 云函数入口函数
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {

    const flag = await db.collection('message').where({
      user: wxContext.OPENID
    }).get()

    if (!flag.length) {
      await db.collection('message').add({
        data: {
          user: wxContext.OPENID,
          request: [],
          chats:[]
        }
      })
    }

    return await db.collection('users').add({
      data: {
        due: new Date(),
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        coverUrl: '',
        gender: event.gender,
        city: event.city,
        tags: ['这里可以放你关于音乐，艺人，风格的tag'],
        footMark: ['这里可以放你关于常去的club，嘉年华，音乐节的足迹'],
        like: 0,
        newLike:false,
        age: "年龄保密",
        motto: "这里可以像ins一样写简介",
        _openid: wxContext.OPENID,
        friend: [],
        lastLogin:new Date()
      }
    }).then(res => {
      return res
    })

  } catch (e) {
    console.log(e)
  }
}