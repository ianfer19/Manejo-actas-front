import type { RouteRecordRaw } from 'vue-router'

const miembrosRoutes: Array<RouteRecordRaw> = [
  {
    path: '/miembros-crear',
    name: 'miembros-crear',
    component: () => import('../views/manejoactas/miembros/MiembrosCrear.vue')
  },
  {
    path: '/miembros-lista',
    name: 'miembros-lista',
    component: () => import('../views/manejoactas/miembros/MiembrosLista.vue')
  },
  {
    path: '/miembros-detalle/:id',
    name: 'miembros-detalle',
    component: () => import('../views/manejoactas/miembros/MiembrosDetalle.vue')
  },
  {
    path: '/miembros-editar/:id',
    name: 'miembros-editar',
    component: () => import('../views/manejoactas/miembros/MiembrosEditar.vue')
  }
]

export default miembrosRoutes
