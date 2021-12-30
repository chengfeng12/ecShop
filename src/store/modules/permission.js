import { asyncRoutes, constantRoutes } from '@/router/router.js'
import { getToken, setToken, removeToken,getRouterKey,setRouterKey,setRouterMsg} from '@/utils/auth'
  // 通过meta.role判断是否与当前用户权限匹配 

  function hasPermission(roles, route) {
  // 路由权限值
   
    if (route.meta && route.meta.roles) {

      return roles.includes(route.meta.roles)

    } else {

      return true
    
    }

  }
// 递归过滤异步路由表，返回符合用户角色权限的路由表
export function filterAsyncRoutes(routes,roles) {

  const res = []
  
  routes.forEach(route => {
    
    const tmp = { ...route }

    if (hasPermission(roles, tmp)) {

      if (tmp.children) {
         
          tmp.children = filterAsyncRoutes(tmp.children, roles) 
          
      }

      res.push(tmp)
    
    }
  })
  return res
}

const state = {

  routes: [],

  addRoutes: []

}

const mutations = {

  SET_ROUTES: (state, routes) => {
    
    state.addRoutes = routes
    
    state.routes = constantRoutes.concat(routes)
    
  }

}

const actions = {

  // 动态加载路由信息

  generateRoutes({ commit }, roles) {

  

    return new Promise(resolve => {

      let accessedRoutes

      // 调用过滤函数添加动态路由
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            
      commit('SET_ROUTES', accessedRoutes)
 
    

      resolve(accessedRoutes)

    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
