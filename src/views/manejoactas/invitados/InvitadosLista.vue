<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { useRouter } from 'vue-router'

const invitados = [
  { id: 1, nombre: 'Juan Perez', dependencia: 'Recursos Humanos', cargo: 'Gerente' },
  { id: 2, nombre: 'Maria Lopez', dependencia: 'Marketing', cargo: 'Directora' }
  // Añadir más invitados aquí o cargar desde una API
]

const router = useRouter()
function verInvitado(id) {
  router.push({ name: 'invitados-detalle', params: { id } })
}

function editarInvitado(id) {
  router.push({ name: 'invitados-editar', params: { id } })
}

const eliminarInvitado = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
    // Lógica para eliminar el miembro (puedes implementar esto más adelante)
    alert(`Miembro con ID ${id} eliminado`)
  }
}
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Listar" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Lista de Invitados</h2>
    </div>
    <div class="flex justify-end">
      <button @click="crearNuevoInvitado" class="boton-1">Crear nuevo invitado</button>
    </div>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th scope="col" class="px-6 py-3">Nombre</th>
          <th scope="col" class="px-6 py-3">Dependencia</th>
          <th scope="col" class="px-6 py-3">Cargo</th>
          <th scope="col" class="px-6 py-3">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invitado in invitados" :key="invitado.id" class="bg-white border-b">
          <td class="px-6 py-4">{{ invitado.nombre }}</td>
          <td class="px-6 py-4">{{ invitado.dependencia }}</td>
          <td class="px-6 py-4">{{ invitado.cargo }}</td>
          <td class="px-6 py-4">
            <button @click="verInvitado(invitado.id)" class="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Ver
            </button>
            <button @click="editarInvitado(invitado.id)" class="text-yellow-600 ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>

              Editar
            </button>
            <button @click="eliminarInvitado(invitado.id)" class="text-red-600 ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
