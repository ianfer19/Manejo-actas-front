<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const lugar = ref('')
const fecha = ref('')
const horaInicio = ref('')
const horaFinal = ref('')
const presidente = ref('')
const secretario = ref('')
const contenido = ref('')
const tema = ref('')
const miembrosInvitados = ref([]) // Estado para los miembros invitados

// Implementar la lógica para cargar la sesión por ID
const loadSesion = async () => {
  const idSesion = route.params.id
  console.log('ID Sesión:', idSesion)
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_sesion_por_id&idSesion=${idSesion}`
    )

    if (!response.ok) throw new Error('Error al cargar la sesión')

    const data = await response.json()
    console.log('Datos de la sesión:', data)

    lugar.value = data.LUGAR
    fecha.value = data.FECHA
    horaInicio.value = data.HORAINICIO.split('.')[0] // Eliminamos los microsegundos
    horaFinal.value = data.HORAFINAL.split('.')[0] // Eliminamos los microsegundos
    presidente.value = data.PRESIDENTE
    secretario.value = data.SECRETARIO

    // Cargar contenido de la sesión
    await loadContenidoSesion(idSesion)

    // Cargar miembros invitados
    await loadMiembrosInvitados(idSesion)
  } catch (error) {
    console.error('Error al cargar la sesión:', error)
    alert('No se pudo cargar la sesión')
  }
}

// Nueva función para cargar el contenido de la sesión
const loadContenidoSesion = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_contenido_sesion&idSesion=${idSesion}`
    )

    if (!response.ok) throw new Error('Error al cargar el contenido de la sesión')

    const data = await response.json()

    // Asegúrate de que hay datos antes de acceder a ellos
    if (data.length > 0) {
      // Asignar valores a tema y contenido desde el primer objeto del array
      contenido.value = data[0].DESCRIPCION || '' // Asignar el contenido
      tema.value = data[0].TEMA || '' // Asignar el tema
    }
  } catch (error) {
    console.error('Error al cargar el contenido de la sesión:', error)
  }
}

// Nueva función para cargar los miembros invitados
const loadMiembrosInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_asistencia_por_sesion&idSesion=${idSesion}`
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

// Nueva función para invitar a los miembros
const invitarMiembros = async () => {
  const idSesion = route.params.id
  const dataInvitacion = {
    idSesion: idSesion
  }

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=crear_asistencia',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataInvitacion)
      }
    )

    console.log(response)

    if (!response.ok) throw new Error('Error al invitar a los miembros')

    const result = await response.json()
    alert(`Miembros invitados: ${result.message}`) // Muestra un mensaje de éxito
    await loadMiembrosInvitados(idSesion) // Recargar miembros invitados después de invitar
  } catch (error) {
    console.error('Error al invitar a los miembros:', error)
    alert('Ocurrió un error al invitar a los miembros.')
  }
}

const editarSesion = async () => {
  const id = route.params.id
  const dataSesion = {
    idSesion: id,
    lugar: lugar.value,
    fecha: fecha.value,
    horaInicio: horaInicio.value,
    horaFinal: horaFinal.value,
    presidente: presidente.value,
    secretario: secretario.value
  }

  // Primero, actualizamos o creamos el contenido de la sesión
  await saveContenidoSesion(id, tema.value, contenido.value)

  // Luego, actualizamos la sesión
  await updateSesion(dataSesion)
}

const saveContenidoSesion = async (idSesion, tema, contenido) => {
  const dataContenido = {
    sesionId: idSesion,
    tema: tema,
    descripcion: contenido
  }

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=definir_contenido',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataContenido)
      }
    )

    if (!response.ok) throw new Error('Error al definir el contenido de la sesión')

    const result = await response.json()
    console.log(result.message) // Muestra el mensaje de éxito en la consola
  } catch (error) {
    console.error('Error al guardar el contenido de la sesión:', error)
  }
}

// Nueva función para actualizar la sesión
const updateSesion = async (dataSesion) => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=actualizar_sesion',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataSesion)
      }
    )

    const result = await response.json()
    alert(`Sesión actualizada: ${result.message}`)
  } catch (error) {
    console.error('Error al actualizar la sesión:', error)
    alert('Ocurrió un error al actualizar la sesión.')
  }
}

// Llamar a loadSesion al montar el componente
loadSesion()
</script>
<template>
  <BreadCrumb modulo="Sesiones" accion="Editar" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <h2 class="mb-1 text-4xl font-bold text-blue-700">Editar Sesión</h2>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="lugar" class="block mb-2 text-sm font-medium text-gray-900">Lugar</label>
      <input v-model="lugar" type="text" id="lugar" class="input-class" />
    </div>
    <div>
      <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900">Fecha</label>
      <input v-model="fecha" type="date" id="fecha" class="input-class" />
    </div>
    <div>
      <label for="horaInicio" class="block mb-2 text-sm font-medium text-gray-900"
        >Hora Inicio</label
      >
      <input v-model="horaInicio" type="time" id="horaInicio" class="input-class" />
    </div>
    <div>
      <label for="horaFinal" class="block mb-2 text-sm font-medium text-gray-900">Hora Final</label>
      <input v-model="horaFinal" type="time" id="horaFinal" class="input-class" />
    </div>
    <div>
      <label for="presidente" class="block mb-2 text-sm font-medium text-gray-900"
        >Presidente</label
      >
      <input v-model="presidente" type="text" id="presidente" class="input-class" />
    </div>
    <div>
      <label for="secretario" class="block mb-2 text-sm font-medium text-gray-900"
        >Secretario</label
      >
      <input v-model="secretario" type="text" id="secretario" class="input-class" />
    </div>
  </div>

  <div class="my-6">
    <h3 class="mb-2 text-lg font-bold">Contenido de la Sesión</h3>
    <label for="tema" class="block mb-2 text-sm font-medium text-gray-900">Tema</label>
    <input v-model="tema" type="text" id="tema" class="input-class" />
    <label for="contenido" class="block mb-2 text-sm font-medium text-gray-900">Descripción</label>
    <textarea v-model="contenido" id="contenido" class="input-class"></textarea>
  </div>

  <div class="my-6">
    <h3 class="mb-2 text-lg font-bold">Miembros Invitados</h3>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr class="bg-gray-200 text-gray-700">
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Cargo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="miembro in miembrosInvitados" :key="miembro.ID">
          <td class="py-2 px-4 border-b">{{ miembro.NOMBRE }}</td>
          <td class="py-2 px-4 border-b">{{ miembro.CARGO }}</td>
        </tr>
      </tbody>
    </table>
    <button class="boton-1" @click="invitarMiembros">Invitar Miembros</button>
  </div>

  <button class="boton-1" @click="editarSesion">Guardar Cambios</button>
</template>

<style scoped>
.input-class {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  width: 100%;
}

.boton-1 {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.boton-1:hover {
  background-color: #2563eb;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  text-align: left;
  padding: 0.75rem;
}

th {
  background-color: #3b82f6;
  color: white;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #e2e8f0;
}
</style>
