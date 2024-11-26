import { createRouter, createWebHistory } from 'vue-router'
import invitadosRoutes from './invitados'
import miembrosRoutes from './miembros'
import proposicionesRoutes from './proposiciones'
import sesionRoutes from './sesion'
import solicitantesRoutes from './solicitantes'
import solicitudRoutes from './solicitud'
import tareasRoutes from './tareas'
import actasRoutes from './actas'
import authRoutes from './auth'
import AuthLayout from '../components/layouts/AuthLayout.vue' // Layout para el login y autenticación

const routes = [
  {
    path: '/login',
    component: () => import('../views/manejoactas/auth/login.vue') // Componente de Login
  },
  {
    path: '/register',
    component: () => import('../views/manejoactas/auth/register.vue') // Componente de Register
  },
  {
    path: '/',
    children: [
      ...invitadosRoutes,
      ...miembrosRoutes,
      ...proposicionesRoutes,
      ...sesionRoutes,
      ...solicitantesRoutes,
      ...solicitudRoutes,
      ...tareasRoutes,
      ...actasRoutes
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token') // Comprueba si el usuario está autenticado

  // Si el usuario no está autenticado y la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    if (to.path !== '/login') {
      return next({ path: '/login' }) // Redirige al login solo si no estás ya ahí
    }
  }

  // Si el usuario está autenticado y trata de ir a /login o /register
  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return next({ path: '/actas-lista' }) // Redirige al dashboard u otra ruta protegida
  }

  // Permite la navegación normal si no aplica ninguna condición anterior
  next()
})

export default router
