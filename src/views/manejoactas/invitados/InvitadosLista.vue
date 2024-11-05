<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const invitados = ref([]) // Usamos ref para la lista de invitados
const router = useRouter()

async function cargarInvitados() {
  try {
    const response = await fetch('http://localhost/manejo_actas/index.php?accion=obtener_invitados')
    if (!response.ok) throw new Error('Error al cargar invitados')
    invitados.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}

function verInvitado(id) {
  router.push({ name: 'invitados-detalle', params: { id } })
}

function editarInvitado(id) {
  router.push({ name: 'invitados-editar', params: { id } })
}

async function eliminarInvitado(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
    try {
      const response = await fetch('/ruta/api/invitados.php?action=eliminar_invitado', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      const result = await response.json()
      if (result.success) {
        invitados.value = invitados.value.filter((invitado) => invitado.id !== id)
        alert(`Invitado con ID ${id} eliminado`)
      } else {
        alert(result.error || 'No se pudo eliminar el invitado')
      }
    } catch (error) {
      console.error('Error eliminando el invitado:', error)
    }
  }
}

onMounted(() => {
  cargarInvitados()
})
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Listar" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Lista de Invitados</h2>
    </div>
    <div class="flex justify-end">
      <button @click="router.push({ name: 'invitados-crear' })" class="boton-1">
        Crear nuevo invitado
      </button>
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
          <td class="px-6 py-4">{{ invitado.NOMBRE }}</td>
          <td class="px-6 py-4">{{ invitado.DEPENDENCIA }}</td>
          <td class="px-6 py-4">{{ invitado.CARGO }}</td>
          <td class="px-6 py-4">
            <button @click="verInvitado(invitado.IDINVITADOS)" class="text-blue-600">
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
            <button @click="editarInvitado(invitado.IDINVITADOS)" class="text-yellow-600 ml-4">
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
            <button @click="eliminarInvitado(invitado.IDINVITADOS)" class="text-red-600 ml-4">
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
