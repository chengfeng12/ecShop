// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : ''
    /**
     * 商品的请求api集合
     */
let jwt = {
    /**
     * 商品添加
     */
    //   第三方登录
    login(params) {
        return api.request(basePrefix + '/third/token', 'POST', {
            ...params
        })
    },
    //   token有效性
    createToken(params) {
        return api.request(basePrefix + '/jwt/token', 'POST', {
            ...params
        }, true)
    },

    platformUser(params) {
        return api.request(basePrefix + '/jwt/platformUser', 'POST', {
            ...params
        })
    },

    searchMenus(params) {
        return api.request(basePrefix + '/admin/menu/menus/left', 'POST', {
            ...params
        })
    }
}
export default jwt