<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const proposicion = ref({})

// Implementar la lógica para cargar la proposición por ID
const loadProposicion = () => {
  const id = route.params.id
  // Cargar la proposición desde la base de datos usando el id
  // Aquí debes implementar la lógica para obtener la proposición de la base de datos
  // Ejemplo de datos de prueba:
  proposicion.value = {
    ID_PROPOSICIONES: id,
    DESCRIPCION: 'Ejemplo de descripción de la proposición',
    DECISION: 'ACEPTADA',
    MIEMBRO_IDMIEMBRO: 111,
    SESION_IDSESION: 1
  }
}

// Llamar a loadProposicion al montar el componente
loadProposicion()
</script>

<template>
  <BreadCrumb modulo="Proposiciones" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalle de la Proposición</h2>
  <div>
    <p><strong>ID:</strong> {{ proposicion.ID_PROPOSICIONES }}</p>
    <p><strong>Descripción:</strong> {{ proposicion.DESCRIPCION }}</p>
    <p><strong>Decisión:</strong> {{ proposicion.DECISION }}</p>
    <p><strong>ID Miembro:</strong> {{ proposicion.MIEMBRO_IDMIEMBRO }}</p>
    <p><strong>ID Sesión:</strong> {{ proposicion.SESION_IDSESION }}</p>
  </div>
  <button @click="$router.push({ name: 'proposiciones-lista' })" class="boton-1">
    Volver a la Lista
  </button>
</template>
