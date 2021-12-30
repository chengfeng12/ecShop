// 引入请求文件
import api from '@/api/request'

const basePrefix = api.env() == 'DEV' ? '' : 'goods'

let shop = {
    /**
     * 店铺管理页面
     */
    pageAdminType(params) {
        return api.request(basePrefix + '/shop/diypage/selType','POST', {
            ...params
        })
    },
    /**
     * 店铺管理页面 店铺类型
     */
    pageAdmin(params) {
        return api.request(basePrefix + '/shop/diypage/selDiyPage','POST', {
            ...params
        })
    },
    /**
     * 店铺状态切换
     */
    pageAdminUpdate(params) {
        return api.request(basePrefix + '/shop/diypage/updStatus','POST', {
            ...params
        })
    },
    /**
     * 店铺删除
     */
    pageAdminDel(params) {
        return api.request(basePrefix + '/shop/diypage/delete','POST', {
            ...params
        })
    },
    /**
     * 店铺 启动广告图列表
     */
    advertisementList(params) {
        return api.request(basePrefix + '/api/advertising/select','POST', {
            ...params
        })
    },
    /**
     * 店铺 启动广告图列表
     */
    advertisementDel(params) {
        return api.request(basePrefix + '/api/advertising/delete','POST', {
            ...params
        })
    },
    /**
     * 店铺 启动广告新增
     */
    advertisementSave(params) {
        return api.request(basePrefix + '/api/advertising/save','POST', {
            ...params
        })
    },
    /**
     * 店铺 启动广告详情
     */
    advertisementDetial(params) {
        return api.request(basePrefix + '/api/advertising/detail','POST', {
            ...params
        })
    },
    /**
     * 店铺 启动广告修改
     */
    advertisementUpdata(params) {
        return api.request(basePrefix + '/api/advertising/update','POST', {
            ...params
        })
    },
    /**
     * 店铺 商品二维码
     */
    advertisementQrcode(params) {
        return api.request(basePrefix + '/api/advertising/selQRCode','POST', {
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
