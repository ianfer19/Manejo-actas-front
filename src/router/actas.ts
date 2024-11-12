import type { RouteRecordRaw } from 'vue-router'

import ActasLista from '../views/manejoactas/actas/ActasLista.vue'
import ActasEditar from '../views/manejoactas/actas/ActasEditar.vue'
import ActasDetalle from '../views/manejoactas/actas/ActasDetalle.vue'

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
  },
  {
    path: '/acta-detalle/:id',
    name: 'acta-detalle',
    component: ActasDetalle
  }
]

export default ActasRoutes
