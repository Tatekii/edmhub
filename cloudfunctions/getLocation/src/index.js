// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const md5 = require('md5')

cloud.init({
  env: 'dev-0033'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const key = 'HTZBZ-5EMCJ-3Y5FA-FWVC3-MHBHF-WVBFL'
  const url = 'https://apis.map.qq.com/ws/geocoder/v1?location='
  const sk = 'wyXG6m3qnPy9DZVMjFz2bSdy0QD8Pl5'
  const a = `key=${key}&location=${event.latitude},${event.longitude}`
  const sig = md5(`/ws/geocoder/v1?${a}${sk}`) 

  return await rp(`${url}${event.latitude},${event.longitude}&key=${key}&sig=${sig}`).then(res=>JSON.parse(res)).catch(err=>err)
}