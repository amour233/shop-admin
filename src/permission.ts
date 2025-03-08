import { router, addRoutes } from '@/router'
import { getToken } from './composables/auth'
import { toast, showFullLoading, hideFullLoading } from './composables/utils'
import { useUserStore } from './stores/user'


let hasGetInfo = false
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 显示loading
  showFullLoading()
  const userStore = useUserStore()
  const token = getToken()
  // 没有登录强制跳转登录
  if (!token && to.path != '/login') {
    toast('请先登录', 'error')
    return next({ path: '/login' })
  }
  // 防止重复登陆
  if (token && to.path === '/login') {
    return next({ path: from.path ? from.path : '/' })
  }
  // 如果用户登录了，自动获取用户信息,并存储在store中
  let hasNewRoutes = false
  if (token && !hasGetInfo) {
    await userStore.getUserInfo()
    hasNewRoutes = addRoutes(userStore.menus)
    hasGetInfo = true
  }
  // 设置页面标题
  document.title = to.meta.title ? `${String(to.meta.title)}` : ' ' + '商城后台页面'
  if (hasNewRoutes) next(to.fullPath)
  else next()
})
// 全局后置守卫
router.afterEach(() => hideFullLoading())
