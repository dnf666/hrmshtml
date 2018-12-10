import Vue from 'vue'
import Vuex from 'vuex'
import nav from './modules/nav'
import login from './modules/login'
import companyId from './modules/companyId'
// import app from './modules/app';
// import user from './modules/user';
// import menu from './modules/menu';
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    nav,
    login,
    companyId
    // app,
    // user,
    // menu
  },
  getters
})
export default store
