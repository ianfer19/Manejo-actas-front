<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
let solicitante = ref({})

// Implementar la lógica para cargar el solicitante por ID
const loadSolicitante = () => {
  const id = route.params.id
  // Cargar el solicitante desde la base de datos usando el id
}

// Llamar a loadSolicitante al montar el componente
loadSolicitante()
</script>

<template>
  <BreadCrumb modulo="Solicitantes" accion="Detalles" />

  <h2 class="text-2xl font-bold">Detalles del Solicitante</h2>
  <div>
    <p><strong>ID:</strong> {{ solicitante.IDSOLICITANTE }}</p>
    <p><strong>Nombre:</strong> {{ solicitante.NOMBRE }}</p>
    <p><strong>Tipo de Solicitante:</strong> {{ solicitante.TIPODESOLICITANTE }}</p>
    <p><strong>Email:</strong> {{ solicitante.EMAIL }}</p>
    <p><strong>Celular:</strong> {{ solicitante.CELULAR }}</p>
  </div>
</template>
