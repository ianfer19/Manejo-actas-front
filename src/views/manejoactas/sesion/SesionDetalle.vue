<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
let sesion = ref({})

// Implementar la lógica para cargar la sesión por ID
const loadSesion = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_sesion_por_id&idSesion=${id}`
    )
    if (!response.ok) throw new Error('Error al cargar la sesión')

    const data = await response.json()
    sesion.value = data // Asigna los datos recibidos a la variable sesion
  } catch (error) {
    console.error('Error al cargar la sesión:', error)
    alert('No se pudo cargar la sesión')
  }
}

const invitarMiembros = async () => {
  const idSesion = route.params.id
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=invitar_miembros',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idSesion })
      }
    )

    // Comprobar si la respuesta es OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    alert(result.message) // Mostrar el mensaje de respuesta
  } catch (error) {
    console.error('Error al invitar a los miembros:', error)
    alert('No se pudo invitar a los miembros: ' + error.message)
  }
}

// Llamar a loadSesion al montar el componente
loadSesion()
</script>

<template>
  <BreadCrumb modulo="Sesiones" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalles de la Sesión</h2>
  <p><strong>ID:</strong> {{ sesion.IDSESION }}</p>
  <p><strong>Lugar:</strong> {{ sesion.LUGAR }}</p>
  <p><strong>Fecha:</strong> {{ sesion.FECHA }}</p>
  <p><strong>Hora Inicio:</strong> {{ sesion.HORAINICIO }}</p>
  <p><strong>Hora Final:</strong> {{ sesion.HORAFINAL }}</p>
  <p><strong>Presidente:</strong> {{ sesion.PRESIDENTE }}</p>
  <p><strong>Secretario:</strong> {{ sesion.SECRETARIO }}</p>

  <button @click="invitarMiembros" class="boton-1">Invitar Miembros</button>
  <!-- Botón para invitar miembros -->
</template>

<style scoped>
.input-class {
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  width: 100%;
}

.boton-1 {
  background-color: #3b82f6; /* Azul */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.boton-1:hover {
  background-color: #2563eb; /* Azul más oscuro al pasar el mouse */
}
</style>
