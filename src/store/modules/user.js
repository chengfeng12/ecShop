// import { login, logout, getInfo } from '@/api/user'
import iView from 'iview';

import { getToken, setToken, removeToken,getRouterKey,setRouterKey,removeRouterKey} from '@/utils/auth'
import router, { resetRouter } from '@/router/router.js'
import jwt from "@/api/request/jwt.js";
import md5 from 'js-md5';


const state = {
  token: getToken(),
  name: '',
  roles: [],
  db:'',
  tenantId:'',
  errmsg:'',
  userInfo:''
}

const mutations = {
  // 全局token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  
  // 全局tenantId
  SET_TENANTID:(state, tenantId) => {
    console.log(tenantId)
    state.tenantId = tenantId
  },
  
  // 全局db
  SET_DB:(state, db) => {
    console.log(db)
    state.db = db
  },
  
  SET_NAME: (state, name) => {
    state.name = name
  },

  SET_ROLES: (state, roles) => {
    console.log(roles)
    state.roles = roles
  },

  SET_USERINFO:(state, user) => {
    state.userInfo = user
  }
}

const actions = {
  // 用户登录
  loginRole({ commit }, roles){

    console.log(roles)

    commit('SET_ROLES', roles)

    setRouterKey(roles) 

  },


  login({ commit }, userInfo) {

    return new Promise((resolve, reject) => {
      jwt.createToken({
        password: userInfo.password,
        username: userInfo.userName
      }).then(res => {

          commit('SET_TOKEN', res.data)

          setToken(res.data)
            
          if (res.code == 0) { 
            // 带入店铺ID

            console.log(res.data)
            jwt.platformUser({
                token: res.data
              })
              .then(res => {

                if (res.id) {

                  commit('SET_TENANTID', res.tenants[0].id)

                  commit('SET_DB', res.tenants[0].dbResourceId)

                  let userInfo = {
                    id:res.id,
                    username:res.username
                  }

                  userInfo = JSON.stringify(userInfo)

                  localStorage.setItem('user',userInfo)

                  localStorage.setItem('tenantId',res.tenants[0].id)

                  commit('SET_USERINFO',userInfo)

                  resolve()

                } else {

                  reject()
                  
                }
              }).catch(error => {

                reject()

              });

          } else {
            console.log(res.msg)
            iView.Message.error(res.msg)
            iView.LoadingBar.error();
          } 
        })
        .catch(error => {
          console.log(error)
          iView.Message.error("服务器错误")
          iView.LoadingBar.error();

        });

    })
  },


  // 处理用户权限
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        
        const { data } = response

        if (!data) {
          reject('验证失败，请重新登录。')
        }

        const { roles, name } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('角色必须是非空数组!')
        }

        commit('SET_ROLES', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_TENANTID', '')
        commit('SET_DB', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_TENANTID', '')
      commit('SET_DB', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 更改权限的操作
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      
      const token = role + '-token'

      commit('SET_TOKEN', token)

      commit('SET_TENANTID', tenantId)
      commit('SET_DB', db)

      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
