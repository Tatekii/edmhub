import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		request: [],
		chats: [],
		changeNow:false
	},
	mutations: {
		login(state, userInfo) {
			state.hasLogin = true;
			state.userInfo = userInfo
		},
		update(state, payload) {
			for (let key in payload) {
				state.userInfo[key] = payload[key]
			}
		},
		commitMsg(state, payload) {
			console.log('commitMsg')
			state.request = payload.request
			state.chats = payload.chats
		},
		// updateLast(state,payload){
		// 	console.log('updateLast')
		// 	console.log(payload)
		// 	// 牛逼
		// 	Vue.set(state.chats.find(item => item.chatid === payload.chatid), 'last', payload.last)
		// 	console.log(state.chats)
		// },
		updateNow(state,payload){
			state.changeNow = payload
			setTimeout(()=>{
				state.changeNow = false
			},0)
		}
	},
	getters: {

	},
	actions: {}
})

export default store
