const cloud = require('wx-server-sdk')

cloud.init({
  env: 'dev-0033'
})

const db = cloud.database()

exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  try {

    const openid = wxContext.OPENID

    return await db.collection('users').where({
      _openid: openid
    }).get().then(async res => {

      const userData = res.data[0]

      // 无该用户
      if (!userData) return

      await db.collection('users').where({
        _openid: openid
      }).update({
        data: {
          lastLogin: new Date()
        }
      })
      
      return userData
    })

  } catch (e) {
    return e
  }
}