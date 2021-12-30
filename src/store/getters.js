const getters = {

  routes: state => state.permission.routes,
  
  addRoutes: state => state.permission.addRoutes,

  routermsg: state => state.routermsg.routermsg,
  
  token:state => state.user.token,

  tenantId:state => state.user.tenantId || localStorage.getItem('tenantId'),
  
  db:state => state.user.db,
  
  name:state => state.user.name,
  
  roles:state => state.user.roles,
  
  msg:state => state.user.msg,

  user:state => state.user.userInfo || localStorage.getItem('user'),

  // createTime: state => state.user.createTime,
  // uptime: state => state.user.uptime,
  // downtime: state => state.user.downtime
}
export default getters
