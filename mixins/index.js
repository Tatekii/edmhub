import {
	mapState,
	mapMutations
} from 'vuex'

const mixin = {
	computed: {
		...mapState(['userInfo', 'chats', 'hasLogin', 'request', 'changeNow'])
	},
	methods: {
		...mapMutations(['login', 'commitMsg', 'update', 'updateNow']),
	}
}
export default mixin
