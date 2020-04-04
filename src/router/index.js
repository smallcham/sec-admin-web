import Vue from 'vue'
import Router from 'vue-router'
import Assets from '../components/assets/Assets'
import AssetsCreate from '../components/assets/AssetsCreate'
import Plugins from '../components/plugins/Plugins'
import PluginCreate from '../components/plugins/PluginCreate'
import Dashboard from '../components/Dashboard'
import Dict from '../components/dict/Dict'
import Tasks from '../components/task/Tasks'
import Users from '../components/user/Users'
import UserCreate from '../components/user/UserCreate'
import UserPwd from '../components/user/UserPwd'
import Login from '../components/user/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/assets/list',
      name: 'Assets',
      component: Assets
    },
    {
      path: '/assets/add',
      name: 'AssetsCreate',
      component: AssetsCreate
    },
    {
      path: '/plugins/list',
      name: 'Plugins',
      component: Plugins
    },
    {
      path: '/task/list/:type?',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/plugins/add/:id?',
      name: 'PluginCreate',
      component: PluginCreate
    },
    {
      path: '/dict/list',
      name: 'Dict',
      component: Dict
    },
    {
      path: '/user/list',
      name: 'Users',
      component: Users
    },
    {
      path: '/user/add',
      name: 'UserCreate',
      component: UserCreate
    },
    {
      path: '/user/pwd',
      name: 'UserPwd',
      component: UserPwd
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
