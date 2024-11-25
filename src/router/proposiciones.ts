import type { RouteRecordRaw } from 'vue-router'
import ProposicionesCrear from '../views/manejoactas/proposiciones/ProposicionesCrear.vue'
import ProposicionesLista from '../views/manejoactas/proposiciones/ProposicionesLista.vue'

import ProposicionesEditar from '../views/manejoactas/proposiciones/ProposicionesEditar.vue'

const proposicionesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/proposiciones-crear',
    name: 'proposiciones-crear',
    component: ProposicionesCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/proposiciones-lista',
    name: 'proposiciones-lista',
    component: ProposicionesLista,
    meta: { requiresAuth: true }
  },

  {
    path: '/proposiciones-editar/:id',
    name: 'proposiciones-editar',
    component: ProposicionesEditar,
    meta: { requiresAuth: true }
  }
]

export default proposicionesRoutes
