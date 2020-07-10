import Vue from 'vue'
import App from './App'

import store from './store'
import uniIcons from "@/components/uni-icons/uni-icons.vue"
import tools from './utils'

Vue.use('uniIcon')

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$tools = tools

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()