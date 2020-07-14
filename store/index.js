import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
		request: [],
		chats: []
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
		updateLast(state,payload){
			console.log('updateLast')
			let id = payload.chatid
			let last = payload.last
			// for(let item of state.chats){
			// 	if(item.chatid===id){
			// 		item = Object.assign(item,{last})
			// 	}
			// }
			// console.log(state.chats)
			
			
			// 牛逼
			Vue.set(state.chats.find(item => item.chatid === payload.chatid), 'last', payload.last)
		}
	},
	getters: {

	},
	actions: {}
})

export default store
