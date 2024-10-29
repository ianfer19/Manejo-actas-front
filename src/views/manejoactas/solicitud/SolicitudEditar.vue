<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const solicitud = ref({})

const loadSolicitud = () => {
  const id = route.params.id
  // Simulación de obtener la solicitud por ID (reemplaza esto con una llamada API real)
  solicitud.value = {
    IDSOLICITUD: id,
    DEPENDENCIA: 'ADMON FINANZAS',
    ASUNTO: 'SALIDA INTERNACIONAL',
    DESICION: '1',
    FECHADESOLICITUD: '2014-04-13',
    SOLICITANTE_IDSOLICITANTE: 1,
    SESION_IDSESION: 1,
    DESCRIPCION_IDDESCRIPCION: 1
  }
}

const actualizarSolicitud = () => {
  // Implementar la lógica para actualizar la solicitud
  alert(`Solicitud con ID ${solicitud.value.IDSOLICITUD} actualizada`)
}

onMounted(loadSolicitud)
</script>

<template>
  <BreadCrumb modulo="Solicitudes" accion="Editar" />

  <h2 class="text-4xl font-bold">Editar Solicitud</h2>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
        >Dependencia</label
      >
      <input type="text" id="dependencia" v-model="solicitud.DEPENDENCIA" class="input-field" />
    </div>
    <div>
      <label for="asunto" class="block mb-2 text-sm font-medium text-gray-900">Asunto</label>
      <input type="text" id="asunto" v-model="solicitud.ASUNTO" class="input-field" />
    </div>
    <div>
      <label for="decision" class="block mb-2 text-sm font-medium text-gray-900">Decisión</label>
      <input type="text" id="decision" v-model="solicitud.DESICION" class="input-field" />
    </div>
    <div>
      <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900"
        >Fecha de Solicitud</label
      >
      <input type="date" id="fecha" v-model="solicitud.FECHADESOLICITUD" class="input-field" />
    </div>
    <div>
      <label for="solicitante" class="block mb-2 text-sm font-medium text-gray-900"
        >ID del Solicitante</label
      >
      <input
        type="number"
        id="solicitante"
        v-model="solicitud.SOLICITANTE_IDSOLICITANTE"
        class="input-field"
      />
    </div>
    <div>
      <label for="sesion" class="block mb-2 text-sm font-medium text-gray-900">ID de Sesión</label>
      <input type="number" id="sesion" v-model="solicitud.SESION_IDSESION" class="input-field" />
    </div>
    <div>
      <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
        >ID de Descripción</label
      >
      <input
        type="number"
        id="descripcion"
        v-model="solicitud.DESCRIPCION_IDDESCRIPCION"
        class="input-field"
      />
    </div>
  </div>

  <button @click="actualizarSolicitud" class="boton-1">Actualizar Solicitud</button>
</template>
