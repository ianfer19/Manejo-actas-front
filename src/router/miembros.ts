import type { RouteRecordRaw } from 'vue-router'

const miembrosRoutes: Array<RouteRecordRaw> = [
  {
    path: '/miembros-crear',
    name: 'miembros-crear',
    component: () => import('../views/manejoactas/miembros/MiembrosCrear.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/miembros-lista',
    name: 'miembros-lista',
    component: () => import('../views/manejoactas/miembros/MiembrosLista.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/miembros-editar/:id',
    name: 'miembros-editar',
    component: () => import('../views/manejoactas/miembros/MiembrosEditar.vue'),
    meta: { requiresAuth: true }
  }
]

export default miembrosRoutes
