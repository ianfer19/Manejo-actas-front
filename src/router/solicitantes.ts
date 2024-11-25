import type { RouteRecordRaw } from 'vue-router'
import SolicitantesCrear from '../views/manejoactas/solicitantes/SolicitantesCrear.vue'
import SolicitantesLista from '../views/manejoactas/solicitantes/SolicitantesLista.vue'
import SolicitantesEditar from '../views/manejoactas/solicitantes/SolicitantesEditar.vue'

const solicitantesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/solicitantes-crear',
    name: 'solicitantes-crear',
    component: SolicitantesCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitantes-lista',
    name: 'solicitantes-lista',
    component: SolicitantesLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/solicitantes-editar/:id',
    name: 'solicitantes-editar',
    component: SolicitantesEditar,
    meta: { requiresAuth: true }
  }
]

export default solicitantesRoutes
