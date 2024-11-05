import type { RouteRecordRaw } from 'vue-router'

import ActasLista from '../views/manejoactas/actas/ActasLista.vue'

const ActasRoutes: Array<RouteRecordRaw> = [
  {
    path: '/actas-lista',
    name: 'actas-lista',
    component: ActasLista
  }
]

export default ActasRoutes
