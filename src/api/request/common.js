// 引入请求文件
import api from '@/api/request'

const basePrefix = api.env() == 'DEV' ? '' : 'goods'
console.log(basePrefix)
/**
 * 图片的请求api集合
 */
let imgs = {
  /**
   * 获取分类
   */
  categoryLists(params) {
    return api.request(basePrefix + '/api/attachment/selPageList', 'POST', {
      ...params
    })
  },
  /**
   * 获取分类下的图片
   */
  categoods(params) {
    return api.request(basePrefix + '/api/file/selPageList', 'POST', {
      ...params
    })
  },
  /**
   * 新增图片分类
   */
  addCate(params) {
    return api.request(basePrefix + '/api/attachment/save', 'POST', {
      ...params
    })
  },
  /**
   * 删除图片
   */
  deleteImg(params) {
    return api.request(basePrefix + '/api/file/delete', 'POST', {
      ...params
    })
  },
  /**
   * 删除分类
   */
  deleteCategory(params) {
    return api.request(basePrefix + '/api/attachment/delete', 'POST', {
      ...params
    })
  },
  /**
   * 搜索图片
   */
  searchPic(params) {
    return api.request(basePrefix + '/api/file/selPageList', 'POST', {
      ...params
    })
  },
  /**
   * 保存自定义模板
   */
  saveTemplate(params) {
    return api.request(basePrefix + '/shop/diypage/saves', 'POST', {
      ...params
    })
  },
  /**
   * 编辑自定义模板
   */
  detailTemplate(params) {
    return api.request(basePrefix + '/shop/diypage/detail', 'POST', {
      ...params
    })
  },
  /**
   * 更新自定义模板
   */
  editTemplate(params) {
    return api.request(basePrefix + '/shop/diypage/update', 'POST', {
      ...params
    })
  }
}

export default imgs
