import type { RouteRecordRaw } from 'vue-router'
import ProposicionesCrear from '../views/manejoactas/proposiciones/ProposicionesCrear.vue'
import ProposicionesLista from '../views/manejoactas/proposiciones/ProposicionesLista.vue'
import ProposicionesDetalle from '../views/manejoactas/proposiciones/ProposicionesDetalle.vue'
import ProposicionesEditar from '../views/manejoactas/proposiciones/ProposicionesEditar.vue'

const proposicionesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/proposiciones-crear',
    name: 'proposiciones-crear',
    component: ProposicionesCrear
  },
  {
    path: '/proposiciones-lista',
    name: 'proposiciones-lista',
    component: ProposicionesLista
  },
  {
    path: '/proposiciones-detalle/:id',
    name: 'proposiciones-detalle',
    component: ProposicionesDetalle
  },
  {
    path: '/proposiciones-editar/:id',
    name: 'proposiciones-editar',
    component: ProposicionesEditar
  }
]

export default proposicionesRoutes
