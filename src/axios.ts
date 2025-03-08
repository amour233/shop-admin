import axios from 'axios'
import { getToken } from '@/composables/auth'
import { toast } from '@/composables/utils'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: '/api'
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 添加cookie
    const token = getToken()
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)
// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    const msg = error.response.data.msg
    if (msg == '非法token，请先登录！') {
      const userStore = useUserStore()
      userStore.logout()
      location.reload()
    }
    toast(msg, 'error')
    return Promise.reject(error)
  },
)

export default service
