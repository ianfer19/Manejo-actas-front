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

onMounted(loadSolicitud)
</script>

<template>
  <BreadCrumb modulo="Solicitudes" accion="Detalles" />

  <h2 class="text-2xl font-bold">Detalles de la Solicitud</h2>
  <div>
    <p><strong>ID:</strong> {{ solicitud.IDSOLICITUD }}</p>
    <p><strong>Dependencia:</strong> {{ solicitud.DEPENDENCIA }}</p>
    <p><strong>Asunto:</strong> {{ solicitud.ASUNTO }}</p>
    <p><strong>Decisión:</strong> {{ solicitud.DESICION }}</p>
    <p><strong>Fecha de Solicitud:</strong> {{ solicitud.FECHADESOLICITUD }}</p>
    <p><strong>ID del Solicitante:</strong> {{ solicitud.SOLICITANTE_IDSOLICITANTE }}</p>
    <p><strong>ID de Sesión:</strong> {{ solicitud.SESION_IDSESION }}</p>
    <p><strong>ID de Descripción:</strong> {{ solicitud.DESCRIPCION_IDDESCRIPCION }}</p>
  </div>
</template>
