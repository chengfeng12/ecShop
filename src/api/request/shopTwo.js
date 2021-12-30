    // 引入请求文件
import api from '@/api/request'

const basePrefix = api.env() == 'DEV' ? '' : 'admin'

let shop = {
    /**
     * 系统店铺最下面
     */
    shopAdminList(params) {
        return api.request(basePrefix + '/api/shop/list','POST', {
            ...params
        })
    },
    /**
     * 系统店铺 编辑获取信息
     */
    getShopAdminList(params) {
        return api.request(basePrefix + '/api/shop/selectById','POST', {
            ...params
        })
    },
    /**
     * 系统店铺 获取品牌列表
     */
    brandList(params) {
        return api.request(basePrefix + '/api/shop/getBrandList','POST', {
            ...params
        })
    },
    /**
     * 系统店铺 添加
     */
    shopAdminSave(params) {
        return api.request(basePrefix + '/api/shop/save','POST', {
            ...params
        })
    },
    /**
     * 系统店铺 编辑
     */
    shopAdminUpdate(params) {
        return api.request(basePrefix + '/api/shop/update','POST', {
            ...params
        })
    },
    /**
     * 系统店铺 删除
     */
    shopAdminDel(params) {
        return api.request(basePrefix + '/api/shop/delete','POST', {
            ...params
        })
    },
    // lz
    /**
     * 商城设置详情
    */
    shopSelShopDetail(params) {
        return api.request(basePrefix + '/api/shop/selShopDetail','POST', {
          ...params
        })
    },
}

export default shop