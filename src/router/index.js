import Vue from 'vue'
import Router from 'vue-router'
import CompanyInfo from '@/components/Company-information'
import MemberMangement from '@/components/Member-mangement'
import MemberWhereabouts from '@/components/Member-whereabouts'
import Editor from '@/components/editorMember'
import EditorWhereabouts from '@/components/editorMemberWhereabouts'
import BookManagement from '@/components/BookManagement'
import ProjectManagement from '@/components/ProjectManagement'
import RentManagement from '@/components/RentManagement'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Fristregister from '@/components/Fristregister'
import Secondregister from '@/components/Secondregister'
import EditorProject from '@/components/editorProject'
import EditorBook from '@/components/BookEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
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
          component: Fristregister
        }
      ]
    },
    {
      path: '/register/Secondregister',
      name: 'Secondregister',
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
          component: CompanyInfo
        },
        {
          path: '/MemberMangement',
          name: 'MemberMangement',
          component: MemberMangement
        },
        {
          path: '/MemberWhereabouts',
          name: 'MemberWhereabouts',
          component: MemberWhereabouts
        },
        {
          path: '/BookMangement/Editor',
          name: 'EditorBook',
          component: EditorBook
        },
        {
          path: '/MemberMangement/Editor',
          name: 'Editor',
          component: Editor
        },
        {
          path: '/MemberWhereabouts/EditorWhereabouts',
          name: 'EditorWhereabouts',
          component: EditorWhereabouts
        },
        {
          path: '/ProjectManagement',
          name: 'ProjectManagement',
          component: ProjectManagement
        },
        {
          path: '/ProjectManagement/Editor',
          name: 'EnditorProject',
          component: EditorProject
        },
        {
          path: '/BookManagement',
          name: 'BookManagement',
          component: BookManagement
        },
        {
          path: '/RentManagement',
          name: 'RentManagement',
          component: RentManagement
        }
      ]
    }

  ]
})
