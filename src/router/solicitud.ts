import type { RouteRecordRaw } from 'vue-router'
import SolicitudCrear from '../views/manejoactas/solicitud/SolicitudCrear.vue'
import SolicitudLista from '../views/manejoactas/solicitud/SolicitudLista.vue'
import SolicitudEditar from '../views/manejoactas/solicitud/SolicitudEditar.vue'

const solicitudRoutes: Array<RouteRecordRaw> = [
  {
    path: '/solicitud-crear',
    name: 'solicitud-crear',
    component: SolicitudCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitud-lista',
    name: 'solicitud-lista',
    component: SolicitudLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitud-editar/:id',
    name: 'solicitud-editar',
    component: SolicitudEditar,
    meta: { requiresAuth: true }
  }
]

export default solicitudRoutes
