// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'marking'
    /**
     * 商品的请求api集合
     */
let marking = {
    // 李亚飞
    // 优惠券管理
    /**
     * 导出文件
     */
    exportFile(params) {
        return api.exportFile(basePrefix + '/api/order/export', 'GET', {
            ...params
        })
    },
    /*
     *新增活动
     */
    addActivaty(params) {
        return api.request(basePrefix + '/api/activaty/save', 'POST', {
            ...params
        })
    },
    /*
     *抽奖活动列表
     */
    Activatylist(params) {
        return api.request(basePrefix + '/api/activaty/list', 'POST', {
            ...params
        })
    },
    /*
     *删除抽奖列表项
     */
    ActivatyDelete(params) {
        return api.request(basePrefix + '/api/activaty/delete', 'POST', {
            ...params
        })
    },

    activatyQRCode(params) {
        return api.request(basePrefix + '/api/activaty/activatyQRCode', 'POST', {
            ...params
        })
    },

    /*
     *查询抽奖活动详情
     */
    activatyDetail(params) {
        return api.request(basePrefix + '/api/activaty/detail', 'POST', {
            ...params
        })
    },

    /*
     *更新抽奖活动
     */
    activatyUpdate(params) {
        return api.request(basePrefix + '/api/activaty/update', 'POST', {
            ...params
        })
    },

    // 刷新满额立减
    refreshFull(params) {
        return api.request(basePrefix + '/updateManJianOrderInfo', 'POST', {
            ...params
        })
    },

    // 刷新限时折扣
    refreshDiscount(params) {
        return api.request(basePrefix + '/updateDiscountOrderInfo', 'POST', {
            ...params
        })
    },

    // 全部优惠券
    Allcouponlist(params) {
        return api.request(basePrefix + '/api/coupon/list', 'POST', {
            ...params
        })
    },

    // 添加优惠券
    Addcoupon(params) {
        return api.request(basePrefix + '/api/coupon/save', 'POST', {
            ...params
        })
    },

    // 优惠券选择查询
    Discountslist(params) {
        return api.request(basePrefix + '/api/coupon/couponselection', 'POST', {
            ...params
        })
    },

    // 新人发券
    Addcouponnew(params) {
        return api.request(basePrefix + '/api/couponnew/save', 'POST', {
            ...params
        })
    },

    // 新人发券明细
    listCouponnew(params) {
        return api.request(basePrefix + '/api/couponnew/listCouponnew', 'POST', {
            ...params
        })
    },

    // 新人发券修改保存
    couponnewUpdate(params) {
        return api.request(basePrefix + '/api/couponnew/update', 'POST', {
            ...params
        })
    },

    Deletecoupon(params) {
        return api.request(basePrefix + '/api/coupon/delete', 'POST', {
            ...params
        })
    },


    // 详情
    Discountsdetail(params) {
        return api.request(basePrefix + '/api/coupon/detail', 'POST', {
            ...params
        })
    },

    // 优惠状态修改
    Discountsupdatestatus(params) {
        return api.request(basePrefix + '/api/coupon/updatestatus', 'POST', {
            ...params
        })
    },

    // 优惠券ID
    coupongoods(params) {
        return api.request(basePrefix + '/api/coupon/coupongoods', 'POST', {
            ...params
        })
    },

    //编辑
    Discountsupdate(params) {
        return api.request(basePrefix + '/api/coupon/update', 'POST', {
            ...params
        })
    },
    /**
     * 发券记录
     */
    memberCouponLisetMemberCoupon(params) {
        return api.request(basePrefix + '/api/membercoupon/lisetmembercoupon', 'POST', {
            ...params
        })
    },

    /**发放记录数量显示
     */
    memberCouponRecord(params) {
        return api.request(basePrefix + '/api/membercoupon/record', 'POST', {
            ...params
        })
    },
    // 查询赠品券
    selectcoupongoods(params) {
        return api.request(basePrefix + '/api/coupon/selectcoupongoods', 'POST', {
            ...params
        })
    },





    // LZ
    /**
     * 满额立减添加
     */
    manJianSave(params) {
        return api.request(basePrefix + '/api/manJian/save', 'POST', {
            ...params
        })
    },

    /**
     * 设置规格
     */
    GoodsSelGoddsSKU(params) {
        return api.request(basePrefix + '/api/goods/selGoddsSKU', 'POST', {
            ...params
        })
    },


    /**
     * 满额管理更改
     */
    manJianUpdate(params) {
        return api.request(basePrefix + '/api/manJian/update', 'POST', {
            ...params
        })
    },
    /**
     * 满减管理列表查询
     */
    manJianList(params) {
        return api.request(basePrefix + '/api/manJian/list', 'POST', {
            ...params
        })
    },
    /**
     * 满减管理删除
     */
    manJianDelete(params) {
        return api.request(basePrefix + '/api/manJian/delete', 'POST', {
            ...params
        })
    },

    /**
     * 满减管理周期
     */
    manJianWorke(params) {
        return api.request(basePrefix + '/api/manJian/worke', 'POST', {
            ...params
        })
    },
    /**
     * 满减管理明细
     */
    manJianDetail(params) {
        return api.request(basePrefix + '/api/manJian/detail', 'POST', {
            ...params
        })
    },
    /**
     * 满减管理修改状态
     */
    manJianUpdateStatus(params) {
        return api.request(basePrefix + '/api/manJian/updateStatus', 'POST', {
            ...params
        })
    },

    /**
     * 满减管理状态查询
     */
    manJianStatus(params) {
        return api.request(basePrefix + '/api/manJian/Status', 'POST', {
            ...params
        })
    },
    /**
     * 满减管理优惠明细
     */
    manJianDetailCouponId(params) {
        return api.request(basePrefix + '/api/manJian/detailcouponid', 'POST', {
            ...params
        })
    },
    /**
     *  满减管理商品明细
     */
    manJianDetailGoods(params) {
        return api.request(basePrefix + '/api/manJian/detailgoods', 'POST', {
            ...params
        })
    },

    /**
     * 限时折扣管理优惠修改
     */
    discountDetailCouponId(params) {
        return api.request(basePrefix + '/api/discount/detailcouponid', 'POST', {
            ...params
        })
    },

    /**
     * 限时折扣管理添加
     */
    discountSave(params) {
        return api.request(basePrefix + '/api/discount/save', 'POST', {
            ...params
        })
    },

    /**
     * 显示折扣管理状态查询
     */
    discountStatus(params) {
        return api.request(basePrefix + '/api/discount/Status', 'POST', {
            ...params
        })
    },
    /**
     * 限时折扣管理查询
     */
    discountList(params) {
        return api.request(basePrefix + '/api/discount/list', 'POST', {
            ...params
        })
    },
    /**
     * 限时折扣管理删除
     */
    discountDelete(params) {
        return api.request(basePrefix + '/api/discount/delete', 'POST', {
            ...params
        })
    },
    /**
     * 限时折扣管理修改
     */
    discountUpdete(params) {
        return api.request(basePrefix + '/api/discount/update', 'POST', {
            ...params
        })
    },
    /**
     * 限时折扣管理明细
     */
    discountDetail(params) {
        return api.request(basePrefix + '/api/discount/detail', 'POST', {
            ...params
        })
    },
    /**
     * 限时折扣管理状态修改
     */
    discountUpdeteStatus(params) {
        return api.request(basePrefix + '/api/discount/updateStatus', 'POST', {
            ...params
        })
    },

    /**
     * 限时折扣商品明细
     */
    discountGoodDetail(params) {
        return api.request(basePrefix + '/api/discount/detailgoods', 'POST', {
            ...params
        })
    },

    /**
     * 新增首购礼
     */
    firstPurchaseSave(params) {
        return api.request(basePrefix + '/api/firstPurchase/save', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼修改
     */
    firstPurchaseUpdate(params) {
        return api.request(basePrefix + '/api/firstPurchase/update', 'POST', {
            ...params
        })
    },

    /**
     * 首购礼赠品明细
     */
    firstPurchaseDetailCouponId(params) {
        return api.request(basePrefix + '/api/firstPurchase/detailcouponid', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼明细
     */
    firstPurchaseDetail(params) {
        return api.request(basePrefix + '/api/firstPurchase/detail', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼商品明细
     */
    firstPurchaseDetailGoods(params) {
        return api.request(basePrefix + '/api/firstPurchase/detailgoods', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼删除
     */
    firstPurchaseDelete(params) {
        return api.request(basePrefix + '/api/firstPurchase/delete', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼商品删除
     */
    firstPurchaseDeleteGoodsId(params) {
        return api.request(basePrefix + '/api/firstPurchase/deletegoodsid', 'POST', {
            ...params
        })
    },

    singleGiftDetailSingGoods3(params) {
        return api.request(basePrefix + '/api/singleGift/detailsinggoods3', 'POST', {
            ...params
        })
    },

    /**
     * 首购礼状态修改
     */
    firstPurchaseUpdateStatus(params) {
        return api.request(basePrefix + '/api/firstPurchase/updateStatus', 'POST', {
            ...params
        })
    },


    /**
     * 首购礼查询
     */
    firstPurchaseList(params) {
        return api.request(basePrefix + '/api/firstPurchase/list', 'POST', {
            ...params
        })
    },
    /**
     * 首购礼优惠删除
     */
    firstPurchaseDeleteGiftsId(params) {
        return api.request(basePrefix + '/api/firstPurchase/deletegiftsid', 'POST', {
            ...params
        })
    },
    /**
     * 满赠礼查询
     */
    fullGiftList(params) {
        return api.request(basePrefix + '/api/fullGift/list', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼查询
     */
    selGiftList(params) {
        return api.request(basePrefix + '/api/choose/chooselist', 'POST', {
            ...params
        })
    },

    /**
     * 满赠礼添加
     */
    fullGiftSave(params) {
        return api.request(basePrefix + '/api/fullGift/save', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼添加
     */
    selGiftSave(params) {
        return api.request(basePrefix + '/api/choose/choosesave', 'POST', {
            ...params
        })
    },

    /**
     * 满赠礼管理状态查询
     */
    fullGiftStatus(params) {
        return api.request(basePrefix + '/api/fullGift/Status', 'POST', {
            ...params
        })
    },
    fullGiftStatusTwo(params) {
        return api.request(basePrefix + '/api/fullGift/Status2', 'POST', {
            ...params
        })
    },
    /**
     * 满赠礼修改
     */
    fullGiftUpdate(params) {
        return api.request(basePrefix + '/api/fullGift/update', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼修改
     */
    selGiftUpdate(params) {
        return api.request(basePrefix + '/api/choose/chooseupdate', 'POST', {
            ...params
        })
    },

    /**
     * 满赠礼明细
     */
    fullGiftDetail(params) {
        return api.request(basePrefix + '/api/fullGift/detail', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼明细
     */
    selGiftDetail(params) {
        return api.request(basePrefix + '/api/choose/choosedetail', 'POST', {
            ...params
        })
    },
    /**
     * 满赠礼商品明细
     */
    detailGiftGoods(params) {
        return api.request(basePrefix + '/api/fullGift/detailgiftgoods', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼商品明细
     */
    seldetailGiftGoods(params) {
        return api.request(basePrefix + '/api/choose/choosedetailgoods', 'POST', {
            ...params
        })
    },
    /**
     * 满赠礼明细
     */
    fullGiftDetailGiftGift(params) {
        return api.request(basePrefix + '/api/fullGift/detailgiftgift', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼明细
     */
    selGiftDetailGiftGift(params) {
        return api.request(basePrefix + '/api/choose/choosedetailgift', 'POST', {
            ...params
        })
    },



    /**
     * 满赠礼删除
     */
    fullGiftDelete(params) {
        return api.request(basePrefix + '/api/fullGift/delete', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼删除
     */
    selGiftDelete(params) {
        return api.request(basePrefix + '/api/choose/choosedelete', 'POST', {
            ...params
        })
    },

    /**
     * 满赠礼状态修改
     */
    fullGiftUpdateStatus(params) {
        return api.request(basePrefix + '/api/fullGift/updateStatus', 'POST', {
            ...params
        })
    },
    /**
     * 选赠礼状态修改
     */
    selGiftUpdateStatus(params) {
        return api.request(basePrefix + '/api/choose/chooseupdateStatus', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼添加
     */
    singleGiftSave(params) {
        return api.request(basePrefix + '/api/singleGift/save', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼规格设置
     */
    singleGiftDetailSing(params) {
        return api.request(basePrefix + '/api/singleGift/detailsing', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼修改
     */
    singleGiftUpdate(params) {
        return api.request(basePrefix + '/api/singleGift/update', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼明细
     */
    singleGiftDetail(params) {
        return api.request(basePrefix + '/api/singleGift/detail', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼删除
     */
    singleGiftDelete(params) {
        return api.request(basePrefix + '/api/singleGift/delete', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼状态
     */
    singleGiftUpdateStatus(params) {
        return api.request(basePrefix + '/api/singleGift/updateStatus', 'POST', {
            ...params
        })
    },
    /**
     * 单品赠礼状态
     */
    singleGiftDetailGoods(params) {
        return api.request(basePrefix + '/api/singleGift/detailsinggoods', 'POST', {
            ...params
        })
    },

    /**
     * 单品赠礼查询
     */
    singleGiftList(params) {
        return api.request(basePrefix + '/api/singleGift/list', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼添加
     */
    codeGiftSave(params) {
        return api.request(basePrefix + '/api/codeGift/save', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼修改
     */
    codeGiftUpdate(params) {
        return api.request(basePrefix + '/api/codeGift/update', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼明细
     */
    codeGiftDetail(params) {
        return api.request(basePrefix + '/api/codeGift/codeselect', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼删除
     */
    codeGiftDelete(params) {
        return api.request(basePrefix + '/api/codeGift/delete', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼状态修改
     */
    codeGiftUpdateStatus(params) {
        return api.request(basePrefix + '/api/codeGift/updateStatus', 'POST', {
            ...params
        })
    },

    /**
     * 验证码赠礼 列表
     */
    codeGiftList(params) {
        return api.request(basePrefix + '/api/codeGift/list', 'POST', {
            ...params
        })
    },

    /**
     * 规则商品列表
     */
    ruleGoodsList(params) {
        return api.request(basePrefix + '/api/rules/list', 'POST', {
            ...params
        })
    }, // 
    /**
     * 规则商品删除
     */
    ruleGoodsDel(params) {
        return api.request(basePrefix + '/api/rules/delete', 'POST', {
            ...params
        })
    },

    /**
     * 规则商品添加
     */
    ruleGoodsAdd(params) {
        return api.request(basePrefix + '/api/rules/save', 'POST', {
            ...params
        })
    },

    /**
     * 规则商品明细
     */
    ruleGoodsDetail(params) {
        return api.request(basePrefix + '/api/rules/detail', 'POST', {
            ...params
        })
    },

    /**
     * 规则商品明细
     */
    ruleGoodsSpecs(params) {
        return api.request(basePrefix + '/api/rules/detailgoods', 'POST', {
            ...params
        })
    },

    /**
     * 规则商品更新
     */
    ruleGoodsUpdate(params) {
        return api.request(basePrefix + '/api/rules/update', 'POST', {
            ...params
        })
    },
    /**
     * 套餐商品列表
     */
    mealGoodsList(params) {
        return api.request(basePrefix + '/api/packagegoods/list', 'POST', {
            ...params
        })
    },
    /**
     * 套餐商品添加
     */
    mealGoodsAdd(params) {
        return api.request(basePrefix + '/api/packagegoods/save', 'POST', {
            ...params
        })
    },
    /**
     * 套餐商品查看
     */
    mealGoodsDetail(params) {
        return api.request(basePrefix + '/api/packagegoods/detail', 'POST', {
            ...params
        })
    },
    /**
     * 套餐商品删除
     */
    mealGoodsDelete(params) {
        return api.request(basePrefix + '/api/packagegoods/delete', 'POST', {
            ...params
        })
    },
    /**
     * 套餐商品编辑
     */
    mealGoodsUpdate(params) {
        return api.request(basePrefix + '/api/packagegoods/update', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 列表
     */
    fullCouponList(params) {
        return api.request(basePrefix + '/api/coupontopup/selecttopup', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 状态切换
     */
    fullCouponStatus(params) {
        return api.request(basePrefix + '/api/coupontopup/updatestatusid', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 删除
     */
    fullCouponDel(params) {
        return api.request(basePrefix + '/api/coupontopup/deletetopup', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 详情
     */
    fullCouponDetail(params) {
        return api.request(basePrefix + '/api/coupontopup/selecttopupid', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 添加
     */
    fullCouponSave(params) {
        return api.request(basePrefix + '/api/coupontopup/save', 'POST', {
            ...params
        })
    },
    /**
     * 满额发券 编辑
     */
    fullCouponUpdate(params) {
        return api.request(basePrefix + '/api/coupontopup/update', 'POST', {
            ...params
        })
    },

    /**
     * 购物发券 列表
     */
    shoppingVoucherslist(params) {
        return api.request(basePrefix + '/api/couponshopping/selectshopping', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 状态切换
     */
    shoppingVouchersStatus(params) {
        return api.request(basePrefix + '/api/couponshopping/updatestatusid', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 删除
     */
    shoppingVouchersDel(params) {
        return api.request(basePrefix + '/api/couponshopping/deleteshopping', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 添加
     */
    shoppingVouchersSave(params) {
        return api.request(basePrefix + '/api/couponshopping/save', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 编辑
     */
    shoppingVouchersUp(params) {
        return api.request(basePrefix + '/api/couponshopping/update', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 详情
     */
    shoppingVouchersDetail(params) {
        return api.request(basePrefix + '/api/couponshopping/selectshopid', 'POST', {
            ...params
        })
    },
    /**
     * 购物发券 商品信息
     */
    shoppingVouchersDetailId(params) {
        return api.request(basePrefix + '/api/couponshopping/selectgoodsid', 'POST', {
            ...params
        })
    },

    /**
     * 手动发券 列表
     */
    manualVouchersList(params) {
        return api.request(basePrefix + '/api/manual/list', 'POST', {
            ...params
        })
    },
    /**
     * 手动发券 状态切换
     */
    manualVouchersStatus(params) {
        return api.request(basePrefix + '/api/manual/statusManual', 'POST', {
            ...params
        })
    },
    /**
     * 手动发券 删除
     */
    manualVouchersDel(params) {
        return api.request(basePrefix + '/api/manual/deleteManual', 'POST', {
            ...params
        })
    },
    /**
     * 手动发券 添加
     */
    manualVouchersAdd(params) {
        return api.request(basePrefix + '/api/manual/save', 'POST', {
            ...params
        })
    },
    /**
     * 手动发券 编辑
     */
    manualVouchersUp(params) {
        return api.request(basePrefix + '/api/manual/update', 'POST', {
            ...params
        })
    },
    /**
     * 手动发券 详情
     */
    manualVouchersDetail(params) {
        return api.request(basePrefix + '/api/manual/selectCoupon', 'POST', {
            ...params
        })
    },
    // 实物券
    physicalgoods(params) {
        return api.request(basePrefix + '/api/coupon/physicalgoods', 'POST', {
            ...params
        })
    },
    /**
     *  朋友代付  /api/paid/detail
     */
    friendSave(params) {
        return api.request(basePrefix + '/api/paid/save', 'POST', {
            ...params
        })
    },
    /**
     *  朋友代付详情的
     */
    friendDetail(params) {
        return api.request(basePrefix + '/api/paid/detail', 'POST', {
            ...params
        })
    },
    /**
     *  批量查询所有优惠券
     */
    AllcouponDetail(params) {
        return api.request(basePrefix + '/api/coupon/couponbacth', 'POST', {
            ...params
        })
    },
    /**
     *  查询用户抽奖记录列表
     */
    selPageListMember(params) {
        return api.request(basePrefix + '/api/activaty/selPageListMember', 'POST', {
            ...params
        })
    },
    /**
     *  导出列表
     */
    excelDownloads(params) {
        return api.request(basePrefix + '/api/activaty/excelDownloads', 'POST', {
            ...params
        })
    },
    /**
     *  好友赠礼添加
     */
    friendgiftSave(params) {
        return api.request(basePrefix + '/api/friendgift/save', 'POST', {
            ...params
        })
    },
    /**
     *  赠礼修改
     */
    friendgiftUpdate(params) {
        return api.request(basePrefix + '/api/friendgift/update', 'POST', {
            ...params
        })
    },
    /**
     *  查询好友赠礼
     */
    friendgiftSearch(params) {
        return api.request(basePrefix + '/api/friendgift/list', 'POST', {
            ...params
        })
    },
    /**
     *  分享助力添加
     */
    addhelpshare(params) {
        return api.request(basePrefix + '/api/Share/save', 'POST', {
            ...params
        })
    },
    /**
     *  分享列表
     */
    helpsharelist(params) {
        return api.request(basePrefix + '/api/Share/list', 'POST', {
            ...params
        })
    },
    /**
     *  修改分享活动状态
     */
    updatestatus(params) {
        return api.request(basePrefix + '/api/Share/updatestatus', 'POST', {
            ...params
        })
    },
    /**
     *  分享助力二维码
     */
    shareCode(params) {
        return api.request(basePrefix + '/api/Share/shareCode', 'POST', {
            ...params
        })
    },
    /**
     *  删除分享助力
     */
    shareDelete(params) {
        return api.request(basePrefix + '/api/Share/delete', 'POST', {
            ...params
        })
    },
    /**
     *  分享助力详情
     */
    shareDetail(params) {
        return api.request(basePrefix + '/api/Share/detail', 'POST', {
            ...params
        })
    },
    /**
     *  编辑分享助力
     */
    updateShare(params) {
        return api.request(basePrefix + '/api/Share/update', 'POST', {
            ...params
        })
    },
    /**
     *  判断分享助力活动是否可以开启
     */
    selectStatus(params) {
        return api.request(basePrefix + '/api/Share/selectStatus', 'POST', {
            ...params
        })
    }


}
export default marking