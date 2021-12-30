// 引入请求文件
import api from '@/api/request'
const basePrefix = api.env() == 'DEV' ? '' : 'member'
/**
 * 短信的请求api集合
 */

let member = {
      /**
       * 查询短信模块列表
       */
      smsList(params){
        console.log('aaa')
        console.log(params)
        return api.request(basePrefix + '/api/sms/list','POST',{
          ...params
        })
      },

      /**
       * 保存短信模板
       */
      smsSave(params){
        return api.request(basePrefix + '/api/sms/save','POST',{
          ...params
        })
      },
      /**
       * 删除短信模板
       */
      smsDelete(params){
        return api.request(basePrefix + '/api/sms/delete','POST',{
          ...params
        })
      },
    /**
     * 修改短信模板
     */
    smsUpdate(params){
      return api.request(basePrefix + '/api/sms/update','POST',{
        ...params
      })
    },
    /**
     * 根据id查询某个短信模板
     */
    smsSelectById(params){
      return api.request(basePrefix + '/api/sms/selectById','POST',{
        ...params
      })
    },

  /**
   * 查询短信类型列表
   */
  smsSelSmsTypeList(params){
    return api.request(basePrefix + '/api/sms/selSmsTypeList','POST',{
      ...params
    })
  },

  /**
   * 查询短信签名列表
   */
  smsSelSmsSignList(params){
    return api.request(basePrefix + '/api/sms/selSmsSignList','POST',{
      ...params
    })
  },

  /**
   * 查询短信服务商列表
   */
  smsSelSmsServerList(params){
    return api.request(basePrefix + '/api/sms/selSmsServerList','POST',{
      ...params
    })
  },
  /**
   * 查询短信类型列表
   */
  smsSelSmstypeList(params){
    return api.request(basePrefix + '/api/sms/selSmsTypeList','POST',{
      ...params
    })
  },
  /**
   * 查询短信类型列表 根据id查下面的按钮
   */
  smsSelSmstypeBtnsList(params){
    return api.request(basePrefix + '/api/sms/selSmsFuncListById','POST',{
      ...params
    })
  },

  /**
   * 保存服务商信息
   */
  saveSmsServer(params){
    return api.request(basePrefix + '/api/sms/saveSmsServerList','POST',{
      ...params
    })
  }

}

export default member
