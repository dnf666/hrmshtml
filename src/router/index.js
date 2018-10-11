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

Vue.use(Router)

export default new Router({
  routes: [
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
})
