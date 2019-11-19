import {
  baseUrl
} from 'global.js'

export default {
  method: 'get',
  // 基础url前缀
  baseUrl: baseUrl,
  // 请求头
  headers: {
    'Content-type': 'application/json;charset=UTF-8',
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 10000,
  // 凭证
  withCredentials: false,
  // 返回数据类型
  responseType: 'json'

}
