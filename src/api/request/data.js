// 引入请求文件
import api from '@/api/request'

const baseAdmin = api.env() == 'DEV' ? '' : 'order'


let admin = {
    /**
     * 交易分析 头部数据
     */
    screeningData(params) {
        return api.request(baseAdmin + '/api/data/trade/getHeadData','POST', {
            ...params
        })
    },
    /**
     * 交易分析的 交易数据
     */
    transactionData(params) {
        return api.request(baseAdmin + '/api/data/trade/getTradeData','POST', {
            ...params
        })
    },
    /**
     * 交易分析 详细数据 
     */
    detailData(params) {
        return api.request(baseAdmin + '/api/data/trade/getDetailData','POST', {
            ...params
        })
    }
}


export default admin
