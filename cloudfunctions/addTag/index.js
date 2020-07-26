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
  try{
    for(let i of event.addArr){
      let res =await db.collection('tags').where({
        title: i
      }).get()
      if(res.data.length){
        await db.collection('tags').where({
          title: i
        }).update({
          data: {
            users: _.addToSet(wxContext.OPENID)
          }
        })
      }else{
        // 新增
        await db.collection('tags').add({
          data: {
            title: i,
            users: [wxContext.OPENID],
            founder: wxContext.OPENID,
            due: new Date()
          }
        })
      }
    }
  }catch(e){
    return e
  }
}