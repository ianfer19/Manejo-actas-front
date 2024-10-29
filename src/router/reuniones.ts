import type { RouteRecordRaw } from 'vue-router'
import ReunionesLista from '../views/manejoactas/reuniones/ReunionLista.vue'
import ReunionesCrear from '../views/manejoactas/reuniones/ReunionCrear.vue'
import ReunionesEditar from '../views/manejoactas/reuniones/ReunionEditar.vue'
import ReunionesDetalle from '../views/manejoactas/reuniones/ReunionDetalle.vue'

const reunionesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/reuniones-crear',
    name: 'reuniones-crear',
    component: ReunionesCrear
  },
  {
    path: '/reuniones-lista',
    name: 'reuniones-lista',
    component: ReunionesLista
  },
  {
    path: '/reuniones-editar/:id',
    name: 'reuniones-editar',
    component: ReunionesEditar
  },
  {
    path: '/reuniones-detalle/:id',
    name: 'reuniones-detalle',
    component: ReunionesDetalle
  }
]

export default reunionesRoutes
