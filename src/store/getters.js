const getters = {
  isCollapse: state => state.nav.isCollapse,
  isLogin: state => state.login.isLogin,
  companyId:state=> state.companyId.companyId,
  permission:state=> state.permission.permission
}

export default getters
