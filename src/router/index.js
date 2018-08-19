import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/Users'
import Roles from '@/components/Roles'
import Rights from '@/components/Rights'
import Categories from '@/components/Categories'
import Goods from '@/components/Goods'
import GoodsAdd from '@/components/Add'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goodsAdd',
          component: GoodsAdd
        }
      ]
    }
  ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('myToken')
  if (to.path === '/login') {
    next()
  }
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
