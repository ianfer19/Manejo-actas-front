import type { RouteRecordRaw } from 'vue-router'
import Login from '../views/manejoactas/auth/Login.vue'
import Register from '../views/manejoactas/auth/Register.vue'

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

export default authRoutes
