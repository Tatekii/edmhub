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

  // 排除已经是好友的
  let friends = await db.collection('users').where({
    _openid:wxContext.OPENID
  }).field({
    friend:true
  }).get()

  if(friends.data.length){
    friends = friends.data[0].friend
  }else{
    friends = []
  }
  
  try {
    return await db.collection('users').where({
      _openid: _.nin([wxContext.OPENID,...friends])
    }).field({
      _openid: true,
      avatarUrl: true,
      footMark: true,
      gender: true,
      like: true,
      nickName: true,
      tags: true
    }).get().then(res => {
      return res
    })
  } catch (e) {
    return e
  }
}