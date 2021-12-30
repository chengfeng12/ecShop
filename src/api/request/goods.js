// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'goods'
/**
 * 商品的请求api集合
 */
let goods = {
  /**
   * 商品添加
   */
  goodsAdd(params) {
    return api.request(basePrefix + '/api/goods/save', 'POST', {
      ...params
    })
  },

  /**
   * 商品更新
   */
  goodsUpdate(params) {
    return api.request(basePrefix + '/api/goods/update', 'POST', {
      ...params
    })
  },
  /**
   * 商品编辑查看商品详情
   */
  goodsEdit(params) {
    return api.request(basePrefix + '/api/goods/detail', 'POST', {
      ...params
    })
  },
  /**
   * 一级分类
   */
  goodsOneClass(params) {
    return api.request(basePrefix + '/api/goods/selShopGoodsCategoryOne', 'POST', {
      ...params
    })
  },
  /**
   * 一级分类启用的
   */
  goodsOneClassEnable(params) {
    return api.request(basePrefix + '/api/goods/selCategory', 'POST', {
      ...params
    })
  },
  /**
   * 二级分类
   */
  goodsTwoClass(params) {
    return api.request(basePrefix + '/api/goods/selShopGoodsCategoryTwo', 'POST', {
      ...params
    })
  },
  /**
   * 查询所有分类
   */
  goodsClassAll(params) {
    return api.request(basePrefix + '/api/goodsCategory/selectAll', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表 没有赠品
   */
  goodsList(params) {
    return api.request(basePrefix + '/api/goods/lists', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表
   */
  goodsLists(params) {
    return api.request(basePrefix + '/api/goods/list', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表,当前行修该排序
   */
  goodsListDis(params) {
    return api.request(basePrefix + '/api/goods/updDisplayOrder', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表 上下架
   */
  singleUpper(params) {
    return api.request(basePrefix + '/api/goods/updStatus', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表 上下架(多选)
   */
  goodsMuiltiple(params) {
    return api.request(basePrefix + '/api/goods/updStatus', 'POST', {
      ...params
    })
  },
  /**
   * 商品列表 删除(到回收站和彻底删除)
   */
  goodsSingleRemove(params, url) {
    return api.request(basePrefix + url, 'POST', {
      ...params
    })
  },
  /**
   * 商品列表 单个恢复和多选恢复 
   */
  goodsRecovery(params, url) {
    return api.request(basePrefix + '/api/goods/updRecycleShopStatus', 'POST', {
      ...params
    })
  },
  /**
   * 商品添加的一级地区
   */
  goodsArea(params) {
    return api.request(basePrefix + '/api/goods/selEsCoreAddress', 'POST', {
      ...params
    })
  },
  /**
   * 商品删除规格
   */
  specDel(params) {
    return api.request(basePrefix + '/api/goods/delSpec', 'POST', {
      ...params
    })
  },
  /**
   * 商品删除规格项
   */
  specItemDel(params) {
    return api.request(basePrefix + '/api/goods/delSpecItem', 'POST', {
      ...params
    })
  },
  /**
   * 商品 sku 的详情数据
   */
  skuDetail(params) {
    return api.request(basePrefix + '/api/goods/selOptionList', 'POST', {
      ...params
    })
  },
  /**
   * 商品 sku 的详情数据
   */
  skuSaveAll(params) {
    return api.request(basePrefix + '/api/goods/updOptionList', 'POST', {
      ...params
    })
  },
  /**
   * 商品分类保存
   */
  categorySave(params) {
    return api.request(basePrefix + '/api/goodsCategory/save', 'POST', {
      ...params
    })
  },
  /**
   * 商品分类的编辑
   */
  categoryDetail(params) {
    return api.request(basePrefix + '/api/goodsCategory/detail', 'POST', {
      ...params
    })
  },
  /**
   * 商品分类的更新
   */
  categoryUpdate(params) {
    return api.request(basePrefix + '/api/goodsCategory/update', 'POST', {
      ...params
    })
  },
  /**
   * 获取商品详情中定制服务的数据
   */
  customizedServiceList(params) {
    return api.request(basePrefix + '/api/goods/selCustService', 'POST', {
      ...params
    })
  },
  /**
   * 商品组 
   */
  goodsGroupList(params) {
    return api.request(basePrefix + '/api/goodsGroup/goodsLists', 'POST', {
      ...params
    })
  },
  /**
   * 商品组状态更改(批量和单个)
   */
  goodsGroupUpdate(params) {
    return api.request(basePrefix + '/api/goodsGroup/updStatus', 'POST', {
      ...params
    })
  },
  /**
   * 商品组删除(批量和单个)
   */
  goodsGroupDel(params) {
    return api.request(basePrefix + '/api/goodsGroup/delete', 'POST', {
      ...params
    })
  },
  /**
   * 商品组查询明细
   */
  goodsGroupDetil(params) {
    return api.request(basePrefix + '/api/goodsGroup/detail', 'POST', {
      ...params
    })
  },
  /**
   * 商品组保存
   */
  goodsGroupAdd(params, title) {
    let saveurl = title == 'add' ? '/api/goodsGroup/save' : '/api/goodsGroup/update'
    return api.request(basePrefix + saveurl, 'POST', {
      ...params
    })
  },


  /**
   * 商品分类列表
   */
  goodsCategorylist(params) {
    return api.request(basePrefix + '/api/goodsCategory/list', 'POST', {
      ...params
    })
  },


  
  /**
   * 删除分类
   */
  delGoodsCategory(params) {
    return api.request(basePrefix + '/api/goodsCategory/delGoodsCategory', 'POST', {
      ...params
    })
  },
  /**
   * 保存分类
   */
  updateDisplayOrder(params) {
    return api.request(basePrefix + '/api/goodsCategory/updateDisplayOrder', 'POST', {
      ...params
    })
  },

  /**
   * 添加分类详情
   */
  goodsCategoryDetail(params) {
    return api.request(basePrefix + '/api/goodsCategory/detail', 'POST', {
      ...params
    })
  },

  /**
   * 添加分类保存
   */
  goodsCategorySave(params) {
    return api.request(basePrefix + '/api/goodsCategory/save', 'POST', {
      ...params
    })
  },

  /**
   * 添加分类保存
   */
  goodsCategoryUpdate(params) {
    return api.request(basePrefix + '/api/goodsCategory/update', 'POST', {
      ...params
    })
  },

  /**
   * 更新显示状态
   */
  updGoodsCategoryStatus(params) {
    return api.request(basePrefix + '/api/goodsCategory/updGoodsCategoryStatus', 'POST', {
      ...params
    })
  },
  // 批量查询商品
  selGoodsIds(params) {
    return api.request(basePrefix + '/api/goods/selGoodsIds', 'POST', {
      ...params
    })
  },
  // ID查规格
  selGoodsSKU(params) {
    return api.request(basePrefix + '/api/goods/selGoodsSKU', 'POST', {
      ...params
    })
  },
  // 查询模板
  getTems(params) {
    return api.request(basePrefix + '/api/goods/selDiyPage', 'POST', {
      ...params
    })
  },
  getGifts(params) {
    return api.request(basePrefix + '/api/goods/gifts', 'POST', {
      ...params
    })
  },
  // 查询上架和已售商品
  getGoodsUpper(params) {
    return api.request(basePrefix + '/api/goods/selGoodsPutaway', 'POST', {
      ...params
    })
  },
  // 根据商品详情的自定义模板
  shopCustomData(params) {
    return api.request(basePrefix + '/shop/diypage/selCustom','POST', {
      ...params
    })
  },
  // 查询所有启用的分组
  queryGroupList(params) {
    return api.request(basePrefix + '/api/goodsGroup/selectAll','POST', {
      ...params
    })
  },




  // 商品分析 数据的
  goodsAnalyseHead(params) {
    return api.request(basePrefix + '/api/data/goods/goodsStatic','POST', {
      ...params
    })
  },

  // 商品分析 数据的
  goodsAnalyseMain(params) {
    return api.request(basePrefix + '/api/data/goods/goodsTrendMap','POST', {
      ...params
    })
  },
  // 商品分析 销量排行榜的
  goodsAnalyseTableOne(params) {
      return api.request(basePrefix + '/api/data/goods/goodsRankTopBySaleCount','POST', {
        ...params
      })
  },
    // 商品分析 支付金额排行榜的
    goodsAnalyseTableTwo(params) {
      return api.request(basePrefix + '/api/data/goods/goodsRankTopByPrice','POST', {
        ...params
      })
    },
     // 商品分析 商品明细的
     goodsAnalyseTableThree(params) {
      return api.request(basePrefix + '/api/data/goods/goodsRankTopDetail','POST', {
        ...params
      })
    },
  }
export default goods
