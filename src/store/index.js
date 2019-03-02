import Vue from 'vue'
import Vuex from 'vuex'
import nav from './modules/nav'
import login from './modules/login'
import companyId from './modules/companyId'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    nav,
    login,
    companyId,
    permission
  },
  getters
})
export default store
