// 引入请求文件
import api from '@/api/request'

const baseAdmin = api.env() == 'DEV' ? '' : 'admin'


let admin = {
    /**
     * 系统店铺 编辑
     */
    shopAdminUpdate(params) {
        return api.request(baseAdmin + '/api/shop/update','POST', {
            ...params
        })
    },
     /**
   * 商城设置详情
   */
  shopSelShopDetail(params) {
    return api.request(baseAdmin + '/api/shop/selShopDetail','POST', {
      ...params
    })
  },
}


export default admin
