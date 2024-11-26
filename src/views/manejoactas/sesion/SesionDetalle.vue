<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import axios from 'axios'

const route = useRoute()
let sesion = ref({})
const miembrosInvitados = ref([]) // Estado para los miembros invitados
const miembros = ref([]) // Estado para los invitados
const token = localStorage.getItem('token') // Obtener el token desde el almacenamiento local

// Implementar la lógica para cargar la sesión por ID
const loadSesion = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=sesion_obtener_sesion_por_id&idSesion=${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )
    if (!response.ok) throw new Error('Error al cargar la sesión')

    const data = await response.json()
    sesion.value = data // Asigna los datos recibidos a la variable sesion

    // Cargar miembros invitados y convidados después de obtener la sesión
    await loadMiembrosInvitados(id)
    await loadInvitados(id)
  } catch (error) {
    console.error('Error al cargar la sesión:', error)
    alert('No se pudo cargar la sesión')
  }
}

const crearActa = async () => {
  const id = route.params.id
  console.log('ID de la sesión:', id)

  if (
    !sesion.value.LUGAR ||
    !sesion.value.FECHA ||
    !sesion.value.HORAINICIO ||
    !sesion.value.HORAFINAL
  ) {
    alert('Por favor, carga los datos de la sesión antes de crear el acta.')
    return
  }

  try {
    console.log('Creando acta en el servidor...')
    await axios.post(
      'http://localhost/manejo_actas/index.php?accion=acta_crear_acta',
      {
        sesionId: id
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )
    console.log('Acta creada en el servidor.')

    alert('Acta creada exitosamente.')
  } catch (error) {
    console.error('Error al crear el acta:', error)
    alert(
      'Error al crear el acta: ' +
        (error.response ? error.response.data.message : error.message || error)
    )
  }
}

// Función para cargar los miembros invitados
const loadMiembrosInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_obtener_asistencia_por_sesion&idSesion=${idSesion}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar token
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar los miembros invitados')

    const data = await response.json()

    // Filtrar los miembros que están invitados
    miembrosInvitados.value = data.filter(
      (miembro) =>
        miembro.INVITACION == 1 ||
        miembro.ESTADO_ASISTENCIA === 'X' ||
        miembro.ESTADO_ASISTENCIA === '-'
    )
  } catch (error) {
    console.error('Error al cargar los miembros invitados:', error)
  }
}

// Función para cargar los invitados
const loadInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_obtener_asistencia_invitados_por_sesion&idSesion=${idSesion}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar token
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar los invitados')

    const data = await response.json()
    miembros.value = data // Asignar los datos de invitados al estado
  } catch (error) {
    console.error('Error al cargar los invitados:', error)
  }
}

// Llamar a loadSesion al montar el componente
loadSesion()
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Sesiones" accion="Detalle" />

        <h2 class="text-2xl font-bold">Detalles de la Sesión</h2>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Información de la Sesión</h3>
          <p><strong>Lugar:</strong> {{ sesion.LUGAR }}</p>
          <p><strong>Fecha Inicio:</strong> {{ sesion.FECHA }}</p>
          <p><strong>Hora Inicio:</strong> {{ sesion.HORAINICIO }}</p>
          <p><strong>Hora Final:</strong> {{ sesion.HORAFINAL }}</p>
          <p><strong>Presidente:</strong> {{ sesion.PRESIDENTE }}</p>
          <p><strong>Secretario:</strong> {{ sesion.SECRETARIO }}</p>
        </div>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Miembros Invitados</h3>
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="py-2 px-4 border-b">Nombre</th>
                <th class="py-2 px-4 border-b">Cargo</th>
                <th class="py-2 px-4 border-b">Estado Asistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="miembro in miembrosInvitados" :key="miembro.ID">
                <td class="py-2 px-4 border-b">{{ miembro.NOMBRE }}</td>
                <td class="py-2 px-4 border-b">{{ miembro.CARGO }}</td>
                <td class="py-2 px-4 border-b">{{ miembro.ESTADO_ASISTENCIA }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Invitados</h3>
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="py-2 px-4 border-b">Nombre</th>
                <th class="py-2 px-4 border-b">Cargo</th>
                <th class="py-2 px-4 border-b">Asistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invitado in miembros" :key="invitado.ID">
                <td class="py-2 px-4 border-b">{{ invitado.NOMBRE }}</td>
                <td class="py-2 px-4 border-b">{{ invitado.CARGO }}</td>
                <td class="py-2 px-4 border-b">{{ invitado.ESTADO_ASISTENCIA }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button @click="crearActa" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Crear Acta
        </button>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estilos aquí */
</style>
