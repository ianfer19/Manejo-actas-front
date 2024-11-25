import type { RouteRecordRaw } from 'vue-router'
import TareasCrear from '../views/manejoactas/tareas/TareasCrear.vue'
import TareasLista from '../views/manejoactas/tareas/TareasLista.vue'
import TareasEditar from '../views/manejoactas/tareas/TareasEditar.vue'

const tareasRoutes: Array<RouteRecordRaw> = [
  {
    path: '/tareas-crear',
    name: 'tareas-crear',
    component: TareasCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas-lista',
    name: 'tareas-lista',
    component: TareasLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/tareas-editar/:id',
    name: 'tareas-editar',
    component: TareasEditar,
    meta: { requiresAuth: true }
  }
]

export default tareasRoutes
