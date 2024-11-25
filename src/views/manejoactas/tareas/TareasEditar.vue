<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const tarea = ref({})
const miembros = ref([])
const miembrosAsignados = ref([])
const miembroSeleccionado = ref(null)
const token = localStorage.getItem('token') // Asumimos que el token está almacenado en localStorage

// Cargar tarea por ID
const loadTarea = async () => {
  const id = route.params.id
  try {
    const response = await axios.get(
      'http://localhost/manejo_actas/index.php?accion=tarea_obtener_tarea_por_id',
      {
        params: { idTarea: id },
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    tarea.value = response.data
    // Obtener los miembros asignados a la tarea
    await loadMiembrosAsignados(id)
  } catch (error) {
    console.error('Error al obtener la tarea:', error)
    alert('No se pudo obtener la tarea.')
  }
}

// Cargar miembros asignados a la tarea
const loadMiembrosAsignados = async () => {
  const idTarea = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=miembrotarea_obtener_miembro_tarea_por_id&idTareas=${idTarea}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    const data = await response.json() // Obtenemos el texto de la respuesta
    miembrosAsignados.value = data
  } catch (error) {
    console.error('Error al obtener miembros asignados:', error)
  }
}

async function loadMiembros() {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=miembro_obtener_miembros',
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.ok) throw new Error('Error al cargar miembros')

    const data = await response.json() // Obtenemos el texto de la respuesta
    miembros.value = JSON.parse(data) // Convertimos la cadena JSON en un objeto
  } catch (error) {
    console.error('Error:', error)
  }
}

// Asignar miembro a la tarea
const asignarMiembro = async () => {
  if (miembroSeleccionado.value) {
    try {
      const response = await axios.post(
        'http://localhost/manejo_actas/index.php?accion=miembrotarea_asignar_miembro_tarea',
        {
          idMiembro: miembroSeleccionado.value.IDMIEMBRO,
          idTareas: tarea.value.ID_TAREAS,
          fechaAsignacion: new Date().toISOString()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      alert('Se ha asignado correctamente')
      loadMiembrosAsignados(tarea.value.ID_TAREAS) // Recargar miembros asignados
    } catch (error) {
      console.error('Error al asignar miembro:', error)
      alert('No se pudo asignar el miembro.')
    }
  } else {
    alert('Por favor, selecciona un miembro.')
  }
}

// Actualizar la tarea con los nuevos datos
const actualizarTarea = async () => {
  try {
    const response = await axios.put(
      'http://localhost/manejo_actas/index.php?accion=tarea_actualizar_tarea',
      {
        ID_TAREAS: tarea.value.ID_TAREAS,
        DESCRIPCION: tarea.value.DESCRIPCION,
        SESION_IDSESION: tarea.value.SESION_IDSESION,
        FECHA_ENTREGA: tarea.value.FECHA_ENTREGA,
        FECHA_VERIFICACION: tarea.value.FECHA_VERIFICACION
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    alert(response.data.message)
    router.push('/tareas-lista') // Redirigir a la lista de tareas después de actualizar
  } catch (error) {
    console.error('Error al actualizar la tarea:', error)
    alert('No se pudo actualizar la tarea.')
  }
}

onMounted(() => {
  loadTarea()
  loadMiembros()
})
</script>

<template>
  <BreadCrumb modulo="Tareas" accion="Editar" />

  <h2 class="text-4xl font-bold">Editar Tarea</h2>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
        >Descripción</label
      >
      <input type="text" id="descripcion" v-model="tarea.DESCRIPCION" class="input-field" />
    </div>
    <div>
      <label for="sesion" class="block mb-2 text-sm font-medium text-gray-900">ID de Sesión</label>
      <input type="number" id="sesion" v-model="tarea.SESION_IDSESION" class="input-field" />
    </div>
    <div>
      <label for="fechaEntrega" class="block mb-2 text-sm font-medium text-gray-900"
        >Fecha de Entrega</label
      >
      <input type="date" id="fechaEntrega" v-model="tarea.FECHA_ENTREGA" class="input-field" />
    </div>
    <div>
      <label for="fechaVerificacion" class="block mb-2 text-sm font-medium text-gray-900"
        >Fecha de Verificación</label
      >
      <input
        type="date"
        id="fechaVerificacion"
        v-model="tarea.FECHA_VERIFICACION"
        class="input-field"
      />
    </div>
  </div>

  <button @click="actualizarTarea" class="boton-1">Actualizar Tarea</button>

  <h3 class="text-2xl font-bold mt-8">Miembros Asignados</h3>

  <table class="min-w-full table-auto border-collapse mt-4">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2 text-left">Nombre</th>
        <th class="px-4 py-2 text-left">Cargo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="miembro in miembrosAsignados" :key="miembro.IDMIEMBRO">
        <td class="border px-4 py-2">{{ miembro.NOMBRE }}</td>
        <td class="border px-4 py-2">{{ miembro.CARGO }}</td>
      </tr>
    </tbody>
  </table>

  <h3 class="text-2xl font-bold mt-8">Asignar Miembro</h3>
  <select v-model="miembroSeleccionado" class="input-field">
    <option v-for="miembro in miembros" :key="miembro.IDMIEMBRO" :value="miembro">
      {{ miembro.NOMBRE }} ({{ miembro.CARGO }})
    </option>
  </select>
  <button @click="asignarMiembro" class="boton-1 mt-2">Asignar Miembro</button>
</template>
