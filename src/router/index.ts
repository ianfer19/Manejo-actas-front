import { createRouter, createWebHistory } from 'vue-router'
import invitadosRoutes from './invitados'
import miembrosRoutes from './miembros'
import proposicionesRoutes from './proposiciones'
import sesionRoutes from './sesion'
import solicitantesRoutes from './solicitantes'
import solicitudRoutes from './solicitud'
import tareasRoutes from './tareas'
import actasRoutes from './actas'

const routes = [
  ...invitadosRoutes,
  ...miembrosRoutes,
  ...proposicionesRoutes,
  ...sesionRoutes,
  ...solicitantesRoutes,
  ...solicitudRoutes,
  ...tareasRoutes,
  ...actasRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
