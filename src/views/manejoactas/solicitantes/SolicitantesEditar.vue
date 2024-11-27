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

// Obtener el token de localStorage
const token = localStorage.getItem('token')

// Método para cargar el solicitante por ID
const loadSolicitante = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=solicitante_obtener_solicitante_por_id&idSolicitante=${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token aquí
        }
      }
    )
    const data = await response.json()

    if (response.ok) {
      solicitante.value = data // Asignamos los datos cargados a la referencia solicitante
    } else {
      alert('No se pudo cargar el solicitante.')
    }
  } catch (error) {
    console.error('Error al cargar el solicitante:', error)
  }
}

// Llamar a loadSolicitante al montar el componente
onMounted(loadSolicitante)

// Método para actualizar el solicitante
const updateSolicitante = async () => {
  const id = route.params.id // Obtener el ID desde la ruta
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=solicitante_actualizar_solicitante`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Agregar el token aquí
        },
        body: JSON.stringify({
          ...solicitante.value, // Incluir todos los datos del solicitante
          idSolicitante: id // Añadir idSolicitante
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
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Solicitantes" accion="Editar" />

        <h2 class="text-2xl font-bold">Editar Solicitante</h2>

        <div>
          <label for="nombre">Nombre</label>
          <input class="input-field" type="text" v-model="solicitante.NOMBRE" />
        </div>

        <div>
          <label for="tipo">Tipo de Solicitante</label>
          <input class="input-field" type="text" v-model="solicitante.TIPODESOLICITANTE" />
        </div>

        <div>
          <label for="email">Email</label>
          <input class="input-field" type="email" v-model="solicitante.EMAIL" />
        </div>

        <div>
          <label for="celular">Celular</label>
          <input class="input-field" type="text" v-model="solicitante.CELULAR" />
        </div>

        <button style="margin-top: 20px" @click="updateSolicitante" class="boton-1">
          Guardar Cambios
        </button>
      </main>
    </div>
  </div>
</template>
