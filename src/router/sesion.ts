import type { RouteRecordRaw } from 'vue-router'
import SesionCrear from '../views/manejoactas/sesion/SesionCrear.vue'
import SesionLista from '../views/manejoactas/sesion/SesionLista.vue'
import SesionDetalle from '../views/manejoactas/sesion/SesionDetalle.vue'
import SesionEditar from '../views/manejoactas/sesion/SesionEditar.vue'

const sesionRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sesion-crear',
    name: 'sesion-crear',
    component: SesionCrear
  },
  {
    path: '/sesion-lista',
    name: 'sesion-lista',
    component: SesionLista
  },
  {
    path: '/sesion-detalle/:id',
    name: 'sesion-detalle',
    component: SesionDetalle
  },
  {
    path: '/sesion-editar/:id',
    name: 'sesion-editar',
    component: SesionEditar
  }
]

export default sesionRoutes
