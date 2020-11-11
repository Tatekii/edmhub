import Vue from 'vue'
import App from './App'

import store from './store'
import tools from './utils'

import mixin from './mixins'

Vue.use('uniIcon')

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$tools = tools

App.mpType = 'app'

const app = new Vue({
	store,
	...App,
	mixins:[mixin]
})
app.$mount()
