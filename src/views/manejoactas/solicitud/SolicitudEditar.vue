<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const solicitud = ref({})
const errorMessage = ref('') // Variable para almacenar el mensaje de error

const loadSolicitud = async () => {
  const id = route.params.id
  errorMessage.value = '' // Reinicia el mensaje de error
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_solicitud_por_id&idSolicitud=${id}`
    )
    if (!response.ok) {
      throw new Error('Error al obtener la solicitud')
    }
    const data = await response.json()
    solicitud.value = data // Asigna los datos obtenidos
  } catch (error) {
    console.error('Error al cargar la solicitud:', error)
    errorMessage.value = error.message // Almacena el mensaje de error
  }
}

const actualizarSolicitud = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=actualizar_solicitud',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idSolicitud: solicitud.value.IDSOLICITUD,
          dependencia: solicitud.value.DEPENDENCIA,
          asunto: solicitud.value.ASUNTO,
          decision: solicitud.value.DESICION,
          fechaDeSolicitud: solicitud.value.FECHADESOLICITUD,
          solicitanteId: solicitud.value.SOLICITANTE_IDSOLICITANTE,
          sesionId: solicitud.value.SESION_IDSESION,
          descripcionId: solicitud.value.DESCRIPCION_IDDESCRIPCION
        })
      }
    )

    const data = await response.json()
    alert(data.message)
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error)
    alert('Error al actualizar la solicitud')
  }
}

onMounted(loadSolicitud)
</script>

<template>
  <BreadCrumb modulo="Solicitudes" accion="Editar" />

  <h2 class="text-4xl font-bold mb-6">Editar Solicitud</h2>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-700"
        >Dependencia</label
      >
      <input
        type="text"
        id="dependencia"
        v-model="solicitud.DEPENDENCIA"
        class="input-field"
        placeholder="Ingrese la dependencia"
      />
    </div>
    <div>
      <label for="asunto" class="block mb-2 text-sm font-medium text-gray-700">Asunto</label>
      <input
        type="text"
        id="asunto"
        v-model="solicitud.ASUNTO"
        class="input-field"
        placeholder="Ingrese el asunto"
      />
    </div>
    <div>
      <label for="decision" class="block mb-2 text-sm font-medium text-gray-700">Decisión</label>
      <input
        type="text"
        id="decision"
        v-model="solicitud.DESICION"
        class="input-field"
        placeholder="Ingrese la decisión"
      />
    </div>
    <div>
      <label for="fecha" class="block mb-2 text-sm font-medium text-gray-700"
        >Fecha de Solicitud</label
      >
      <input type="date" id="fecha" v-model="solicitud.FECHADESOLICITUD" class="input-field" />
    </div>
    <div>
      <label for="solicitante" class="block mb-2 text-sm font-medium text-gray-700"
        >ID del Solicitante</label
      >
      <input
        type="number"
        id="solicitante"
        v-model="solicitud.SOLICITANTE_IDSOLICITANTE"
        class="input-field"
        placeholder="Ingrese el ID del solicitante"
        readonly
      />
    </div>
    <div>
      <label for="sesion" class="block mb-2 text-sm font-medium text-gray-700">ID de Sesión</label>
      <input
        type="number"
        id="sesion"
        v-model="solicitud.SESION_IDSESION"
        class="input-field"
        placeholder="Ingrese el ID de sesión"
        readonly
      />
    </div>
    <div>
      <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-700"
        >ID de Descripción</label
      >
      <input
        type="number"
        id="descripcion"
        v-model="solicitud.DESCRIPCION_IDDESCRIPCION"
        class="input-field"
        placeholder="Ingrese el ID de descripción"
        readonly
      />
    </div>
    <div>
      <label for="descripcion_sesion" class="block mb-2 text-sm font-medium text-gray-700"
        >Descripción de Sesión</label
      >

      <p class="detail-value">{{ solicitud.descripcion_sesion }}</p>
    </div>
    <div>
      <label for="evento_descripcion" class="block mb-2 text-sm font-medium text-gray-700"
        >Evento</label
      >
      <input
        type="text"
        id="evento_descripcion"
        v-model="solicitud.evento_descripcion"
        class="input-field"
        placeholder="Evento"
        readonly
      />
    </div>
    <div>
      <label for="nombre_solicitante" class="block mb-2 text-sm font-medium text-gray-700"
        >Nombre del Solicitante</label
      >
      <input
        type="text"
        id="nombre_solicitante"
        v-model="solicitud.nombre_solicitante"
        class="input-field"
        placeholder="Nombre del solicitante"
        readonly
      />
    </div>
  </div>

  <button
    @click="actualizarSolicitud"
    class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
  >
    Actualizar Solicitud
  </button>
</template>

<style>
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #333;
  background-color: #f9f9f9;
  outline: none;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #3182ce;
  background-color: #fff;
}
</style>
