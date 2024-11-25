import type { RouteRecordRaw } from 'vue-router'
import InvitadosCrear from '../views/manejoactas/invitados/InvitadosCrear.vue'
import InvitadosLista from '../views/manejoactas/invitados/InvitadosLista.vue'

import InvitadosEditar from '../views/manejoactas/invitados/InvitadosEditar.vue'

const invitadosRoutes: Array<RouteRecordRaw> = [
  {
    path: '/invitados-crear',
    name: 'invitados-crear',
    component: InvitadosCrear,
    meta: { requiresAuth: true }
  },
  {
    path: '/invitados-lista',
    name: 'invitados-lista',
    component: InvitadosLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/invitados-editar/:id',
    name: 'invitados-editar',
    component: InvitadosEditar,
    props: true,
    meta: { requiresAuth: true }
  }
]

export default invitadosRoutes
