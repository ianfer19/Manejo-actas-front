<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
const router = useRouter()
const route = useRoute()
const solicitante = ref({
  NOMBRE: '',
  TIPODESOLICITANTE: '',
  EMAIL: '',
  CELULAR: ''
})

// Método para cargar el solicitante por ID
const loadSolicitante = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_solicitante_por_id&idSolicitante=${id}`
    )
    const data = await response.json()

    if (response.ok) {
      solicitante.value = data // Asignamos los datos cargados a la referencia solicitante
    } else {
      alert('No se pudo cargar el solicitante.')
    }
  } catch (error) {}
}

// Llamar a loadSolicitante al montar el componente
onMounted(loadSolicitante)

// Método para actualizar el solicitante
const updateSolicitante = async () => {
  const id = route.params.id // Get the id from the route
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=actualizar_solicitante`, // No need for id in the query string
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...solicitante.value, // Include all data from solicitante
          idSolicitante: id // Add idSolicitante here
        })
      }
    )

    const result = await response.json()

    if (response.ok) {
      alert('Solicitante actualizado con éxito')
      router.push({ name: 'solicitantes-lista' })
    } else {
      alert('Error al actualizar el solicitante: ' + result.message)
    }
  } catch (error) {
    console.error('Error al actualizar el solicitante:', error)
    alert('Hubo un problema al actualizar el solicitante.')
  }
}
</script>

<template>
  <BreadCrumb modulo="Solicitantes" accion="Editar" />

  <h2 class="text-2xl font-bold">Editar Solicitante</h2>

  <div>
    <label for="nombre">Nombre</label>
    <input type="text" v-model="solicitante.NOMBRE" />
  </div>

  <div>
    <label for="tipo">Tipo de Solicitante</label>
    <input type="text" v-model="solicitante.TIPODESOLICITANTE" />
  </div>

  <div>
    <label for="email">Email</label>
    <input type="email" v-model="solicitante.EMAIL" />
  </div>

  <div>
    <label for="celular">Celular</label>
    <input type="text" v-model="solicitante.CELULAR" />
  </div>

  <button @click="updateSolicitante" class="boton-1">Guardar Cambios</button>
</template>
