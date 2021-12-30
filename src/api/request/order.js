// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'order'
    /**
     * 订单的请求api集合
     */
let orderApi = {
    /**
     * 用户查询订单
     */
    getUserOrder(params) {
        return api.request(basePrefix + '/api/order/getOrderByUserId', 'POST', {
            ...params
        })
    },
    /**
     * 用户查询收货地址
     */
    getUserOrderAdd(params) {
        return api.request(basePrefix + '/api/order/selectDeliveryAddressInfoByUserId', 'POST', {
            ...params
        })
    },
    /**
     * 获取订单概览 
     */
    getData(params) {
        return api.request(basePrefix + '/api/order/orderStatic', 'POST', {
            ...params
        })
    },

    /**
     * 获取订单信息
     */
    getOrderData(params) {
        return api.request(basePrefix + '/api/order/detail', 'POST', {
            ...params
        })
    },

    /**
     * 获取包裹信息
     */

    getdetailItem(params) {
        return api.request(basePrefix + '/api/order/detailItem', 'POST', {
            ...params
        })
    },

    /**
     * 修改订单收货信息
     */
    updateindent(params) {
        return api.request(basePrefix + '/api/order/update', 'POST', {
            ...params
        })
    },

    /**
     * 获取备注信息
     */
    addremarks(params) {
        return api.request(basePrefix + '/api/order/updateRemark', 'POST', {
            ...params
        })
    },

    /**
     * 更改状态
     */
    confirmupdate(params) {
        return api.request(basePrefix + '/api/order/updateStatus', 'POST', {
            ...params
        })
    },
    /**
     * 确认付款
     */
    confimPay(params) {
        return api.request(basePrefix + '/api/order/confimPay', 'POST', {
            ...params
        })
    },


    //确认收货 
    confimDelivery(params) {
        return api.request(basePrefix + '/api/order/confimDelivery', 'POST', {
            ...params
        })
    },
    /**
     * 取消发货
     */
    addcancelGoods(params) {
        return api.request(basePrefix + '/api/order/cancleDelivery', 'POST', {
            ...params
        })
    },

    // 获取订单列表
    getOrderlist(params) {
        return api.request(basePrefix + '/api/order/list', 'POST', {
            ...params
        })
    },

    // 修改订单价格
    updatePrice(params) {
        return api.request(basePrefix + '/api/order/updatePrice', 'POST', {
            ...params
        })
    },

    // 修改物流信息
    updateDelivery(params) {
        return api.request(basePrefix + '/api/order/update/delivery', 'POST', {
            ...params
        })
    },

    //关闭订单
    closeOrder(params) {
        return api.request(basePrefix + '/api/order/closeOrder', 'POST', {
            ...params
        })
    },

    // 确认发货
    Delivery(params) {
        return api.request(basePrefix + '/api/order/delivery', 'POST', {
            ...params
        })
    },

    //  lz

    /**
     * 修改支付设置
     */
    tradeUpdate(params) {
        return api.request(basePrefix + '/api/trade/update', 'POST', {
            ...params
        })
    },
    /**
     * 删除支付设置
     */
    tradeDelete(params) {
        return api.request(basePrefix + '/api/trade/delete', 'POST', {
            ...params
        })
    },
    /**
     * 查询支付设置列表
     */
    tradeList(params) {
        return api.request(basePrefix + '/api/trade/list', 'POST', {
            ...params
        })
    },

    /**
     * 查询单个支付
     */
    tradeSelectById(params) {
        return api.request(basePrefix + '/api/trade/selectById', 'POST', {
            ...params
        })
    },

    /**
     * 保存交易支付
     */
    tradeSave(params) {
        return api.request(basePrefix + '/api/trade/save', 'POST', {
            ...params
        })
    },

    /**
     * 保存交易设置
     */
    settingsSave(params) {
        return api.request(basePrefix + '/api/order/settings/save', 'POST', {
            ...params
        })
    },

    /**
     * 查看交易设置列表单个
     */
    settingsList(params) {
        return api.request(basePrefix + '/api/order/settings/list', 'POST', {
            ...params
        })
    },
    // 模板消息
    messageTemplate(params) {
        return api.request('/order/cor/message/selectAll', 'POST', {
            ...params
        })
    },

    /**
     *  小美盒活动列表
     */
    beautyBoxList(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/list', 'POST', {
            ...params
        })
    },
    /**
     *  小美盒活动删除
     */
    beautyBoxDel(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/delete', 'POST', {
            ...params
        })
    },
    /**
     *  新增小美盒定制活动
     */
    beautyBoxAdd(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/insert', 'POST', {
            ...params
        })
    },
    /**
     *  小美盒活动详情
     */
    beautyBoxDetail(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/detail', 'POST', {
            ...params
        })
    },
    /**
     *  修改小美盒定制活动
     */
    beautyBoxUpdate(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/update', 'POST', {
            ...params
        })
    },
    /**
     *  根据活动编号和阶段编号查询所有产品 列表
     */
    activityList(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/selProductList', 'POST', {
            ...params
        })
    },
    /**
     *  新增产品
     */
    activityAdd(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/insActivaty', 'POST', {
            ...params
        })
    },
    /**
     *  修改产品
     */
    // activityUpdate(params) {
    //     return api.request(basePrefix + '/api/smallBeautyBox/updActivaty', 'POST', {
    //         ...params
    //     })
    // },
    /**
     *  删除产品
     */
    activityDel(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/delActivaty', 'POST', {
            ...params
        })
    },
    /**
     *  查询礼盒
     */
    giftBoxList(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/selGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  新增礼盒
     */
    giftBoxAdd(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/insGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  查询礼盒详情
     */
    giftBoxDetail(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/detailGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  修改礼盒
     */
    giftBoxUpdate(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/updGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  删除礼盒
     */
    giftBoxDel(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/delGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  复制新增礼盒
     */
    giftBoxCopy(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/copyGiftBox', 'POST', {
            ...params
        })
    },
    /**
     *  查询所有活动
     */
    selectAllActivity(params) {
        return api.request(basePrefix + '/api/smallBeautyBox/selectActivaty', 'POST', {
            ...params
        })
    },

}
export default orderApi