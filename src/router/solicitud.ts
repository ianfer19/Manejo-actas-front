import type { RouteRecordRaw } from 'vue-router'
import SolicitudCrear from '../views/manejoactas/solicitud/SolicitudCrear.vue'
import SolicitudLista from '../views/manejoactas/solicitud/SolicitudLista.vue'
import SolicitudDetalle from '../views/manejoactas/solicitud/SolicitudDetalle.vue'
import SolicitudEditar from '../views/manejoactas/solicitud/SolicitudEditar.vue'

const solicitudRoutes: Array<RouteRecordRaw> = [
  {
    path: '/solicitud-crear',
    name: 'solicitud-crear',
    component: SolicitudCrear
  },
  {
    path: '/solicitud-lista',
    name: 'solicitud-lista',
    component: SolicitudLista
  },
  {
    path: '/solicitud-detalle/:id',
    name: 'solicitud-detalle',
    component: SolicitudDetalle
  },
  {
    path: '/solicitud-editar/:id',
    name: 'solicitud-editar',
    component: SolicitudEditar
  }
]

export default solicitudRoutes
