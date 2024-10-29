import type { RouteRecordRaw } from 'vue-router'
import TareasCrear from '../views/manejoactas/tareas/TareasCrear.vue'
import TareasLista from '../views/manejoactas/tareas/TareasLista.vue'
import TareasDetalle from '../views/manejoactas/tareas/TareasDetalle.vue'
import TareasEditar from '../views/manejoactas/tareas/TareasEditar.vue'

const tareasRoutes: Array<RouteRecordRaw> = [
  {
    path: '/tareas-crear',
    name: 'tareas-crear',
    component: TareasCrear
  },
  {
    path: '/tareas-lista',
    name: 'tareas-lista',
    component: TareasLista
  },
  {
    path: '/tareas-detalle/:id',
    name: 'tareas-detalle',
    component: TareasDetalle
  },
  {
    path: '/tareas-editar/:id',
    name: 'tareas-editar',
    component: TareasEditar
  }
]

export default tareasRoutes
