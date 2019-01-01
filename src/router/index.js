import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import CompanyInfo from '@/components/Company-information'
import MemberMangement from '@/components/Member-mangement'
import Editor from '@/components/editorMember'
import BookManagement from '@/components/BookManagement'
import ProjectManagement from '@/components/ProjectManagement'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Fristregister'
import Fristregister from '@/components/Fristregister'
import Secondregister from '@/components/Secondregister'
import EditorProject from '@/components/editorProject'
import EditorBook from '@/components/BookEdit'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Login',
    meta: {
      requiresAuth: false
    },
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    children: [
      {
        path: '/',
        name: 'Fristregister',
        meta: {
          requiresAuth: true
        },
        component: Fristregister
      }
    ]
  },
  {
    path: '/register/Secondregister',
    name: 'Secondregister',
    meta: {
      requiresAuth: true
    },
    component: Secondregister
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home,
    redirect: '/CompanyInfo',
    children: [
      {
        path: '/CompanyInfo',
        name: 'CompanyInfo',
        meta: {
          requiresAuth: true
        },
        component: CompanyInfo
      },
      {
        path: '/MemberMangement',
        name: 'MemberMangement',
        meta: {
          requiresAuth: true
        },
        component: MemberMangement
      },
      {
        path: '/BookMangement/Editor',
        name: 'EditorBook',
        meta: {
          requiresAuth: true
        },
        component: EditorBook
      },
      {
        path: '/MemberMangement/Editor',
        name: 'Editor',
        meta: {
          requiresAuth: true
        },
        component: Editor
      },
      {
        path: '/ProjectManagement',
        name: 'ProjectManagement',
        meta: {
          requiresAuth: true
        },
        component: ProjectManagement
      },
      {
        path: '/ProjectManagement/Editor',
        name: 'EnditorProject',
        meta: {
          requiresAuth: true
        },
        component: EditorProject
      },
      {
        path: '/BookManagement',
        name: 'BookManagement',
        meta: {
          requiresAuth: true
        },
        component: BookManagement
      },
    ]
  }

]

// 页面刷新时，重新赋值有没登录
if (window.sessionStorage.getItem('isLogin')) {
  store.commit('setIsLogin', window.sessionStorage.getItem('isLogin'))
}

const router = new Router({
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(r => r.meta.requiresAuth)) { // 判断该路由是否需要登录权限
//     console.log(store.getters.isLogin)
//     if (store.getters.isLogin) { // 通过vuex 如果当前有登录
//       next()
//     } else {
//       console.log('没有登录吖')
//       next({
//         path: '/',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next()
//   }
// })

export default router
