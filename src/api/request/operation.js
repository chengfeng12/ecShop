// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'goods'
/**
 * 刻字服务的请求api集合
 */
let operationApi = {
  /**
   * 刻字服务列表
   */
  getLetterList(params){
    return api.request(basePrefix + '/shop/basic/list', 'POST', {
      ...params
    })
  },
  /**
   * 刻字服务 修改样图
   */
  getUpdateLegend(params){
    return api.request(basePrefix + '/shop/basic/updateLegend', 'POST', {
      ...params
    })
  },
    /**
   * 刻字服务 新增样图上传
   */
  getInsertLegend(params){
    return api.request(basePrefix + '/shop/basic/insertLegend', 'POST', {
      ...params
    })
  },
/**
   * 刻字服务 查询样图上传详情
   */
  getDetailLegend(params){
    return api.request(basePrefix + '/shop/basic/detailLegend', 'POST', {
      ...params
    })
  },
  /**
   * 刻字服务 查询刻字服务基本信息
   */
  getDetailBasic(params){
    return api.request(basePrefix + '/shop/basic/detailBasic', 'POST', {
      ...params
    })
  },
 /**
   * 刻字服务 新增查询刻字服务信息
   */
  getSaveBasic(params){
    return api.request(basePrefix + '/shop/basic/saveBasic', 'POST', {
      ...params
    })
  },
  /**
   * 刻字服务 修改刻字服务基本信息
   */
  getUpdateBasic(params){
    return api.request(basePrefix + '/shop/basic/updateBasic', 'POST', {
      ...params
    })
  },
 /**
   * 刻字服务 删除样图
   */
  getDeleteLegend(params){
    return api.request(basePrefix + '/shop/basic/deletLegend', 'POST', {
      ...params
    })
  },
  /**
   * 定制卡片列表
   */
  getCardList(params) {
    return api.request(basePrefix + '/shop/card/list', 'POST', {
      ...params
    })
  },

  /**
   * 新增定制卡片
   */
  getSaveCard(params) {
    return api.request(basePrefix + '/shop/card/save', 'POST', {
      ...params
    })
  },
   /**
   * 定制卡片详情
   */
  getDetailCard(params) {
    return api.request(basePrefix + '/shop/card/detail', 'POST', {
      ...params
    })
  },
 /**
   * 修改定制卡片
   */
  getUpdateCard(params) {
    return api.request(basePrefix + '/shop/card/update', 'POST', {
      ...params
    })
  },
/**
   * 删除定制卡片
   */
  getDeleteList(params) {
    return api.request(basePrefix + '/shop/card/delete', 'POST', {
      ...params
    })
  },
  /**
   * 修改卡片描述
   */
  getUpdateDetailList(params) {
    return api.request(basePrefix + '/shop/card/updateDetail', 'POST', {
      ...params
    })
  },
    /**
   * 修改卡片描述
   */
  getSelectDetailList(params) {
    return api.request(basePrefix + '/shop/card/selectDetail', 'POST', {
      ...params
    })
  },
        /**
   * 特殊封套列表管理：查询列表
   */
  getSpecialList(params) {
    return api.request(basePrefix + '/shop/package/list', 'POST', {
      ...params
    })
  },
      /**
   * 特殊封套列表管理：新增
   */
  getSpecialSave(params) {
    return api.request(basePrefix + '/shop/package/save', 'POST', {
      ...params
    })
  },
      /**
   * 特殊封套列表管理：删除
   */
  getSpecialDelete(params) {
    return api.request(basePrefix + '/shop/package/delete', 'POST', {
      ...params
    })
  },
       /**
   * 套装包装列表管理：新增
   */
  getSpecialUpdate(params) {
    return api.request(basePrefix + '/shop/package/update', 'POST', {
      ...params
    })
  },
      /**
   * 套装包装列表管理：查询列表
   */
  getPackageList(params) {
    return api.request(basePrefix + '/shop/package/list', 'POST', {
      ...params
    })
  },
  
      /**
   * 套装包装列表管理：新增
   */
  getPackageSave(params) {
    return api.request(basePrefix + '/shop/package/save', 'POST', {
      ...params
    })
  },
      /**
   * 套装包装列表管理：新增
   */
  getPackageUpdate(params) {
    return api.request(basePrefix + '/shop/package/update', 'POST', {
      ...params
    })
  },
   /**
   * 套装包装列表管理：详情
   */
  getPackageDetail(params) {
    return api.request(basePrefix + '/shop/package/detail', 'POST', {
      ...params
    })
  },
    /**
   * 套装包装列表管理：删除
   */
  getPackageDelete(params) {
    return api.request(basePrefix + '/shop/package/delete', 'POST', {
      ...params
    })
  },
 /**
   * 卡片寄语管理：修改
   */
  getUpdCardMessage(params) {
    return api.request(basePrefix + '/shop/card/updCardMessage', 'POST', {
      ...params
    })
  },
   /**
   * 卡片寄语：新增
   */
  getInsCardMessage(params) {
    return api.request(basePrefix + '/shop/card/insCardMessage', 'POST', {
      ...params
    })
  },
  getSelCardMessage(params) {
    return api.request(basePrefix + '/shop/card/selCardMessage', 'POST', {
      ...params
    })
  },
}
export default operationApi
