// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'member'

/**
 * 用户的请求api集合
 */

let users = {
  /** 
   * 用户列表
   */
  usersList(params) {
    return api.request(basePrefix + '/api/member/list', 'POST', {
      ...params
    })
  },
  /** 
   * 用户详情
   */
  usersDetail(params) {
    return api.request(basePrefix + '/api/member/detail', 'POST', {
      ...params
    })
  },
  /** 
   * 订单数量
   */
  usersBuyCount(params) {
    return api.request(basePrefix + '/api/member/updateMemberOrderInfo', 'POST', {
      ...params
    })
  },

     /**
     * 客群分析 查询访问数据 
     */
    visitData(params) {
      return api.request(basePrefix + '/api/data/custGroup/getVisitedData','POST', {
          ...params
      })
  },

       /**
   * 客群分析 查询客户分析数据 
   */
  selCustAnalyData(params) {
      return api.request(basePrefix + '/api/data/custGroup/selCustAnalyData','POST', {
          ...params
      })
  },

        /**
   * 客群分析 成交客户分析 
   */
  getTradeScuInfo(params) {
      return api.request(basePrefix + '/api/data/custGroup/getTradeScuInfo','POST', {
          ...params
      })
  }, 

         /**
   * 客群分析 客户趋势图
   */
  getTendencyMapData(params) {
      return api.request(basePrefix + '/api/data/custGroup/getTendencyMapData','POST', {
          ...params
      })
  }, 
}

export default users
