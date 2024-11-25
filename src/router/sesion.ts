import type { RouteRecordRaw } from 'vue-router'
import SesionCrear from '../views/manejoactas/sesion/SesionCrear.vue'
import SesionLista from '../views/manejoactas/sesion/SesionLista.vue'
import SesionEditar from '../views/manejoactas/sesion/SesionEditar.vue'
import SesionDetalle from '../views/manejoactas/sesion/SesionDetalle.vue'

const sesionRoutes: Array<RouteRecordRaw> = [
  {
    path: '/sesion-crear',
    name: 'sesion-crear',
    component: SesionCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/sesion-lista',
    name: 'sesion-lista',
    component: SesionLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/sesion-detalle/:id',
    name: 'sesion-detalle',
    component: SesionDetalle,
    meta: { requiresAuth: true }
  },
  {
    path: '/sesion-editar/:id',
    name: 'sesion-editar',
    component: SesionEditar,
    meta: { requiresAuth: true }
  }
]

export default sesionRoutes
