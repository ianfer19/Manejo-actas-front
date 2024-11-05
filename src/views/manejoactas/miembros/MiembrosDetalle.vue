<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const miembro = ref({}) // Usar ref para reactividad

// Implementar la lógica para cargar el miembro por ID
const loadMiembro = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_miembro_por_id&idMiembro=${id}`
    )
    const data = await response.json() // Obtenemos el texto de la respuesta
    miembro.value = JSON.parse(data) // Convertimos la cadena JSON en un objeto
  } catch (error) {
    console.error('Error loading member:', error)
    alert('Error al cargar los datos del miembro. Intente nuevamente.')
  }
}

// Llamar a loadMiembro al montar el componente
onMounted(loadMiembro)
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalles del Miembro</h2>
  <p><strong>ID:</strong> {{ miembro.IDMIEMBRO }}</p>
  <p><strong>Nombre:</strong> {{ miembro.NOMBRE }}</p>
  <p><strong>Cargo:</strong> {{ miembro.CARGO }}</p>
</template>
