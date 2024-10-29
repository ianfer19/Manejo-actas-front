import type { RouteRecordRaw } from 'vue-router'
import SolicitantesCrear from '../views/manejoactas/solicitantes/SolicitantesCrear.vue'
import SolicitantesLista from '../views/manejoactas/solicitantes/SolicitantesLista.vue'
import SolicitantesDetalle from '../views/manejoactas/solicitantes/SolicitantesDetalle.vue'
import SolicitantesEditar from '../views/manejoactas/solicitantes/SolicitantesEditar.vue'

const solicitantesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/solicitantes-crear',
    name: 'solicitantes-crear',
    component: SolicitantesCrear
  },
  {
    path: '/solicitantes-lista',
    name: 'solicitantes-lista',
    component: SolicitantesLista
  },
  {
    path: '/solicitantes-detalle/:id',
    name: 'solicitantes-detalle',
    component: SolicitantesDetalle
  },
  {
    path: '/solicitantes-editar/:id',
    name: 'solicitantes-editar',
    component: SolicitantesEditar
  }
]

export default solicitantesRoutes
