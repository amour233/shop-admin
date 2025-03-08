import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/layout/cms-admin.vue'
import type { menus } from '@/types'

  // 默认路由
const routes = [
  {
    path: '/',
    name: 'admin',
    component: Admin,
  },
  {
    path: '/login',
    name: '登录页',
    component: () => import('../views/user-login.vue'),
  },
  {
    path: '/about',
    name: '关于页',
    component: () => import('../views/cms-about.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404-notfound.vue'),
  },
]

const asyncRoutes = [
  {
    path: '/',
    name: '/',
    component: () => import('../views/cms-main.vue'),
    meta:{
      title: 'admin'
    }
  },
  {
    path: '/goods/list',
    name: '/goods/list',
    component: () => import('../views/goods/goods-list.vue'),
    meta:{
      title:'商品分类'
    }
  },
  {
    path: '/category/list',
    name: '/category/list',
    component: () => import('../views/category/category-list.vue'),
    meta:{
      title:'分类列表'
    }
  },
  {
    path: '/user/list',
    name: '/user/list',
    component: () => import('../views/user/user-list.vue'),
    meta:{
      title:'用户列表'
    }
  },
  {
    path: '/order/list',
    name: '/order/list',
    component: () => import('../views/order/order-list.vue'),
    meta:{
      title:'订单列表'
    }
  },
  {
    path: '/comment/list',
    name: '/comment/list',
    component: () => import('../views/comment/comment-list.vue'),
    meta:{
      title:'评价列表'
    }
  },
  {
    path: '/image/list',
    name: '/image/list',
    component: () => import('../views/image/image-list.vue'),
    meta:{
      title:'图库管理'
    }
  },
  {
    path: '/notice/list',
    name: '/notice/list',
    component: () => import('../views/notice/notice-list.vue'),
    meta:{
      title:'公告列表'
    }
  },
  {
    path: '/setting/base',
    name: '/setting/base',
    component: () => import('../views/setting/setting-list.vue'),
    meta:{
      title:'配置列表'
    }
  },
  {
    path: '/coupon/list',
    name: '/coupon/list',
    component: () => import('../views/coupon/coupon-list.vue'),
    meta:{
      title:'优惠券列表'
    }
  },
  {
    path: '/manager/list',
    name: '/manager/list',
    component: () => import('../views/manager/manager-list.vue'),
    meta:{
      title:'管理员管理'
    }
  },
  {
    path: '/access/list',
    name: '/access/list',
    component: () => import('../views/access/access-list.vue'),
    meta:{
      title:'菜单权限管理'
    }
  },
  {
    path: '/role/list',
    name: '/role/list',
    component: () => import('../views/role/role-list.vue'),
    meta:{
      title:'角色管理'
    }
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// 动态添加路由
export function addRoutes(menus: Array<menus>){
  let  hasNewRoutes = false
  const findAddRoutes = (arr: Array<menus>) => {
    arr.forEach((e) => {
      const item = asyncRoutes.find(o => o?.path == e.frontpath)
      if (item && !router.hasRoute(item.path)) {
        router.addRoute('admin', item)
        hasNewRoutes = true
      }
      if (e.child && e.child.length > 0) {
        findAddRoutes(e.child)
      }
    })
  }
  findAddRoutes(menus)
  return hasNewRoutes
}
