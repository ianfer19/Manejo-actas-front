<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const solicitud = ref({})

const loadSolicitud = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_solicitud_por_id&idSolicitud=${id}`
    )
    if (!response.ok) throw new Error('Error al obtener la solicitud')

    const data = await response.json()

    // Asumimos que `data` es el objeto que has mostrado en tu JSON
    solicitud.value = {
      ...data,
      // Aquí agregamos los textos correspondientes
      DESICION: getDecisionText(data.DESICION),
      SOLICITANTE_IDSOLICITANTE: data.nombre_solicitante,
      SESION_IDSESION: data.descripcion_sesion,
      DESCRIPCION_IDDESCRIPCION: data.evento_descripcion
    }
  } catch (error) {
    console.error('Error al cargar la solicitud:', error)
  }
}

// Función para obtener el texto correspondiente a la decisión
const getDecisionText = (decisionId) => {
  const decisiones = {
    1: 'Aprobada',
    2: 'Rechazada',
    3: 'En Proceso'
  }
  return decisiones[decisionId] || 'Desconocida'
}

onMounted(loadSolicitud)
</script>

<template>
  <BreadCrumb modulo="Solicitudes" accion="Detalles" />

  <h2 class="text-2xl font-bold mb-6">Detalles de la Solicitud</h2>
  <div class="details-container">
    <div class="detail-item">
      <p class="detail-label">ID:</p>
      <p class="detail-value">{{ solicitud.IDSOLICITUD }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Dependencia:</p>
      <p class="detail-value">{{ solicitud.DEPENDENCIA }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Asunto:</p>
      <p class="detail-value">{{ solicitud.ASUNTO }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Decisión:</p>
      <p class="detail-value">{{ solicitud.DESICION }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Fecha de Solicitud:</p>
      <p class="detail-value">{{ solicitud.FECHADESOLICITUD }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Solicitante:</p>
      <p class="detail-value">{{ solicitud.SOLICITANTE_IDSOLICITANTE }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Descripción de Sesión:</p>
      <p class="detail-value">{{ solicitud.SESION_IDSESION }}</p>
    </div>
    <div class="detail-item">
      <p class="detail-label">Evento Descripción:</p>
      <p class="detail-value">{{ solicitud.DESCRIPCION_IDDESCRIPCION }}</p>
    </div>
  </div>
</template>

<style>
.details-container {
  display: grid;
  gap: 1rem;
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #4a5568;
}

.detail-value {
  color: #2d3748;
}
</style>
