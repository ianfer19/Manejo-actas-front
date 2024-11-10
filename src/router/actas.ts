import type { RouteRecordRaw } from 'vue-router'

import ActasLista from '../views/manejoactas/actas/ActasLista.vue'
import ActasEditar from '../views/manejoactas/actas/ActasEditar.vue'

const ActasRoutes: Array<RouteRecordRaw> = [
  {
    path: '/actas-lista',
    name: 'actas-lista',
    component: ActasLista
  },
  {
    path: '/acta-editar/:id',
    name: 'acta-editar',
    component: ActasEditar
  }
]

export default ActasRoutes
