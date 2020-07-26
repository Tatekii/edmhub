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

    // 该用户有点赞集合？
    const res = await db.collection('likes').where({
      user:event.target
    }).get()

    // 新建该用户的点赞集合
    if(!res.data.length){
      await db.collection('likes').add({
        data:{
          user: event.target,
          record:[
            {
              _openid: wxContext.OPENID,
              due: new Date()
            }
          ]
        }
      })

      await db.collection('users').where({
          _openid: event.target
        }).update({
          data:{
            like:_.inc(1),
            newLike:true
          }
        }).then(res=>{
          return res
        })

      return
    }

    // 点过赞没？
    const flag = await db.collection('likes').where({
      user: event.target,
      record:_.elemMatch({
        _openid:wxContext.OPENID
      })
      }).get()

    console.log(flag.data)

    if(flag.data.length){
      //点过赞了
      return 'alreadty'
    }else{
      //没点过
      await db.collection('likes').where({
        user: event.target
      }).update({
        data:{
          record: _.push({
            'due': Date.now(),
            '_openid': wxContext.OPENID
          })
        }
      })

      await db.collection('users').where({
        _openid: event.target
      }).update({
        data: {
          like: _.inc(1),
          newLike:true
        }
      }).then(res => {
        return res
      })
    }



  }catch(err){
    return err
  }
}