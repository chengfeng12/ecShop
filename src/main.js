import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from "axios";
import VueQuillEditor from 'vue-quill-editor'
import Vuex from 'vuex'
import { hasRole } from "./utils/hasRole"
import '@/components/templatePage/static/common/common.less'



Vue.use(Vuex)
require('./mock/mock.js')
Vue.use(iView);
Vue.prototype.hasRole = hasRole
Vue.config.productionTip = false

// 全局样式
import '@/assets/style/index.css'
import '@/assets/style/icon.css'

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})