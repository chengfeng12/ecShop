// 引入请求文件
import api from '@/api/request'

const basePrefix = api.env() == 'DEV' ? '' : 'order'

const shop = {
    /**
     * 店铺 小程序查询
     */
    getSmallAdmin(params) {
        return api.request(basePrefix + '/cor/miniprogram/selMiniprogram','POST', {
            ...params
        })
    },
    /**
     * 店铺 小程序添加
     */
    smallAdminSave(params) {
        return api.request(basePrefix + '/appletset/save','POST', {
            ...params
        })
    },
    /**
     * 编辑添加
     */
    smallAdminUpdate(params) {
        return api.request(basePrefix + '/cor/miniprogram/updMiniprogram','POST', {
            ...params
        })
    },
    /**
     * 模板消息
     */
    shopTemplateMessage(params) {
        return api.request(basePrefix + '/cor/message/selectMessageTemplate','POST', {
        ...params
        })
    },
    /**
     * 模板消息的状态切换
    */
    shopTemplateMessageUpdate(params) {
        return api.request(basePrefix + '/cor/message/templUpdStatus','POST', {
            ...params
        })
    },
    /**
     * 模板消息的删除
     */
    shopTemplateMessageDel(params) {
        return api.request(basePrefix + '/cor/message/delete','POST', {
            ...params
        })
    },
    /**
     * 模板消息的类型查询
     */
    shopTemplateMessageType(params) {
        return api.request(basePrefix + '/api/appletTemplates/selectAll','POST', {
            ...params
        })
    },
    /**
     * 模板消息的详情
     */
    shopTemplateMessageDetail(params) {
        return api.request(basePrefix + '/cor/message/detail','POST', {
            ...params
        })
    },
    /**
     * 模板消息修改
     */
    shopTemplateMessageUpdata(params) {
        return api.request(basePrefix + '/cor/message/update','POST', {
            ...params
        })
    },
    /**
     * 模板消息的添加
     */
    shopTemplateMessageAdd(params) {
        return api.request(basePrefix + '/cor/message/save','POST', {
            ...params
        })
    },
    /**
     * 模板消息库的列表
     */
    templateMessagesList(params) {
        return api.request(basePrefix + '/api/appletTemplates/list','POST', {
            ...params
        })
    },
    /**
    * 模板消息库的列表
    */
   templateMessagesDel(params) {
       return api.request(basePrefix + '/api/appletTemplates/delete','POST', {
           ...params
       })
   },
   /**
    * 模板消息库的详情
    */
   templateMessagesDetail(params) {
        return api.request(basePrefix + '/api/appletTemplates/detail','POST', {
            ...params
        })
    },
    /**
    * 模板消息库的同步 
    */
   templateMessagesSynchro(params) {
        return api.request(basePrefix + '/api/appletTemplates/syncTempl','POST', {
            ...params
        })
    },
    /**
    * 模板全部不分页 
    */
   templateList(params) {
        return api.request(basePrefix + '/cor/message/selectAll','POST', {
            ...params
        })
    },
    
}
export default shop