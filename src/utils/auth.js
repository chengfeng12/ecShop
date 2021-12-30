
import Cookies from 'js-cookie'

const TokenKey = 'TokenKey'
const RouterKey = 'RouterKey'
const RouterMsg = 'RouterMsg'
// 储存Token
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  
  return Cookies.set(TokenKey,token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 储存路由权限
export function getRouterKey() {
  return Cookies.get(RouterKey)
}

export function setRouterKey(routerdata) {
  return Cookies.set(RouterKey, routerdata)
}

export function removeRouterKey() {
  return Cookies.remove(RouterKey)
}


// 缓存路由
export function getRouterMsg() {
  return Cookies.get(RouterMsg)
}

export function setRouterMsg(routermsg) {
  return Cookies.set(RouterMsg, routermsg)
}

export function removeRouterMsg() {
  return Cookies.remove(RouterMsg)
}

