import type { RouteRecordRaw } from 'vue-router'
import InvitadosCrear from '../views/manejoactas/invitados/InvitadosCrear.vue'
import InvitadosLista from '../views/manejoactas/invitados/InvitadosLista.vue'
import InvitadosDetalle from '../views/manejoactas/invitados/InvitadosDetalle.vue'
import InvitadosEditar from '../views/manejoactas/invitados/InvitadosEditar.vue'

const invitadosRoutes: Array<RouteRecordRaw> = [
  {
    path: '/invitados-crear',
    name: 'invitados-crear',
    component: InvitadosCrear
  },
  {
    path: '/invitados-lista',
    name: 'invitados-lista',
    component: InvitadosLista
  },
  {
    path: '/invitados-detalle/:id',
    name: 'invitados-detalle',
    component: InvitadosDetalle,
    props: true
  },
  {
    path: '/invitados-editar/:id',
    name: 'invitados-editar',
    component: InvitadosEditar,
    props: true
  }
]

export default invitadosRoutes
