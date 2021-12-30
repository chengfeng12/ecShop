import Vue from 'vue'
import axios from 'axios'
import store from "@/store"
import router from '../router/router.js'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import { removeToken } from '@/utils/auth'
import jwt from './request/jwt'

const Qs = require('qs');
// 王磊

// const baseURL = 'http://10.10.10.177:8997'
// 模板消息的
// const baseURL = 'http://192.168.2.127:8995'
// 朋友代付
// const baseURL = 'http://192.168.2.127:8996'

// 温家豪
// const baseURL = 'http://192.168.2.117:8072/'
// const baseURL = 'http://192.168.1.105:8997/'
// 邓湘虎
// const baseURL = 'http://192.168.2.117:8995/'
// const baseURL = 'https://sit-api.ec.widiazine.cn'
const baseURL = 'https://sit-admin.ec.widiazine.cn'
// uat
// const baseURL = 'https://uat-ec-arvato.arvatocrm.cn'
// const env_data = 'DEV'
const env_data = 'PRO'
const api = {
    env() {
        return env_data
    },
    // 上传图片
    async uploadImg(type, params) {
        let url = '/api/file/upload'
        url = env_data == 'DEV' ? url : '/goods' + url
        let ajax = axios.create({
            baseURL: baseURL,
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
            method: type ? type : 'POST',
            data: params
        })

        let response = await ajax()
        if (response.status == 200) {
            return response.data
        } else {
            return 'error'
        }
    },

    // 上传视频 音频 文件
    async uploadFile(type, params) {
        let url = '/api/file/uploadFile'
        url = env_data == 'DEV' ? url : '/zuul/goods' + url
        let ajax = axios.create({
            baseURL: baseURL,
            url: url,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
            method: type ? type : 'POST',
            data: params
        })

        let response = await ajax()
        if (response.status == 200) {
            return response.data
        } else {
            return 'error'
        }
    },

    // 导出文件
    async exportFile(url, prefix, parmas) {

        url = env_data == 'DEV' ? url : '/' + prefix + '/' + url

        jwt.platformUser({
            token: store.getters.token
        }).then((res) => {
            console.log(res)
            if (res.username) {
                var form = document.createElement('form');
                form.id = 'form'
                form.name = 'form'
                document.body.appendChild(form);

                let params = {
                    ...parmas,
                    token: store.getters.token,
                    tenantId: store.getters.tenantId
                }

                for (var obj in params) {
                    if (params.hasOwnProperty(obj)) {
                        console.log(params[obj])
                        var input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = obj;
                        input.value = params[obj];
                        form.appendChild(input)
                    }
                }

                form.method = "POST"; //请求方式
                form.action = baseURL + url;
                form.submit();

                document.body.removeChild(form);
            }
        })
    },
    /**
     * 
     * @param {请求的后置url} url 
     * @param {请求的类型：根据java那边的来} type 
     * @param {请求的参数} parmas
     * 使用方式：
     * api.request(url,{params},type).then((res) => {
          // do something
        }).catch((error) => {
          // error solution
        })
     */
    async request(url, type, parmas, isJson) {
        isJson = isJson || false
        console.log('请求', parmas)
        for (const key in parmas) {
            if (parmas.hasOwnProperty(key)) {
                let typeParam = typeof(parmas[key])
                if (typeParam == 'object') {
                    parmas[key] = JSON.stringify(parmas[key])
                    if (parmas[key].substr(0, 2) == '[{' && parmas[key].substr(-2) == '}]') {
                        parmas[key] = parmas[key]
                    } else if (parmas[key].substr(0, 1) == '[' && parmas[key].substr(-1) == ']') {
                        parmas[key] = parmas[key].substring(1, parmas[key].length - 1)
                        parmas[key] = parmas[key].replace(/\"/g, "");
                    }
                }
            }
        }
        let ajax
        if (isJson) {
            ajax = axios.create({
                baseURL: baseURL,
                url: url,
                method: type ? type : 'POST',
                params: {
                    ...parmas,
                    token: store.getters.token,
                    tenantId: store.getters.tenantId
                }
            })
        } else {
            ajax = axios.create({
                baseURL: baseURL,
                url: url,
                method: type ? type : 'POST',
                data: Qs.stringify({
                    ...parmas,
                    token: store.getters.token,
                    tenantId: store.getters.tenantId
                })
            })
        }
        let response = await ajax()
        if (response.status == 200) {
            if (response.data.code == 40101) {
                console.log(iView.Message)
                iView.Message.error(response.data.msg)
                setTimeout(() => {
                    removeToken()
                    localStorage.clear()
                    router.push('/')
                }, 1000);
                return false

            } else {
                return response.data
            }
        } else {
            return 'error'
        }
    }

}

export default api