// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'payment'
/**
 * 商品的请求api集合
 */
let paymentApi = {
  tradeSet(params) {
    return api.request(basePrefix + '/api/trade/list', 'POST', {
      ...params
    })
  }
}
export default paymentApi
