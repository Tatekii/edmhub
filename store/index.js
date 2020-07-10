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
			state.request = payload.request
			state.chats = payload.chats
		},
		updateLast(state,payload){
			let id = payload.chatid
			let last = payload.last
			for(let item of state.chats){
				if(item.chatid===id){
					item = Object.assign(item,{last})
				}
			}
		}
	},
	getters: {

	},
	actions: {}
})

export default store
