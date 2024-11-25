import type { RouteRecordRaw } from 'vue-router'

import ActasLista from '../views/manejoactas/actas/ActasLista.vue'
import ActasEditar from '../views/manejoactas/actas/ActasEditar.vue'
import ActasDetalle from '../views/manejoactas/actas/ActasDetalle.vue'

const ActasRoutes: Array<RouteRecordRaw> = [
  {
    path: '/actas-lista',
    name: 'actas-lista',
    component: ActasLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/acta-editar/:id',
    name: 'acta-editar',
    component: ActasEditar,
    meta: { requiresAuth: true }
  },
  {
    path: '/acta-detalle/:id',
    name: 'acta-detalle',
    component: ActasDetalle,
    meta: { requiresAuth: true }
  }
]

export default ActasRoutes
