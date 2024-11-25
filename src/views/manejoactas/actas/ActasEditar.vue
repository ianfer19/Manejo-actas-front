<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const acta = ref({}) // Contendrá los datos del acta
const errorMessage = ref('') // Variable para almacenar el mensaje de error

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Función para cargar los datos del acta
const loadActa = async () => {
  const numActa = route.params.id
  console.log(numActa)
  errorMessage.value = '' // Reinicia el mensaje de error
  try {
    const token = getToken()

    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=acta_obtener_acta_por_numero&numActa=${numActa}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error al obtener el acta')
    }
    const data = await response.json()
    acta.value = data // Asigna los datos obtenidos al objeto `acta`
  } catch (error) {
    console.error('Error al cargar el acta:', error)
    errorMessage.value = error.message // Almacena el mensaje de error
  }
}

// Función para actualizar el acta
const actualizarActa = async () => {
  const num = acta.value.NUM_ACTAS
  try {
    const token = getToken()

    const response = await fetch('http://localhost/manejo_actas/index.php?accion=actualizar_acta', {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numActa: acta.value.NUM_ACTAS,
        estado: acta.value.ESTADO,
        sesionId: acta.value.SESION_IDSESION
      })
    })

    const data = await response.json()
    router.push({ name: 'actas-lista' })
  } catch (error) {
    console.error('Error al actualizar el acta:', error)
    alert('Error al actualizar el acta')
  }
}

// Carga los datos del acta al montar el componente
onMounted(loadActa)
</script>

<template>
  <BreadCrumb modulo="Actas" accion="Editar" />

  <h2 class="text-4xl font-bold mb-6">Editar Acta</h2>

  <!-- Mostrar mensaje de error si existe -->
  <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="numActa" class="block mb-2 text-sm font-medium text-gray-700"
        >Número de Acta</label
      >
      <input
        type="text"
        id="numActa"
        v-model="acta.NUM_ACTAS"
        class="input-field"
        placeholder="Número de Acta"
        readonly
      />
    </div>

    <!-- Estado con select condicional -->
    <div>
      <label for="estado" class="block mb-2 text-sm font-medium text-gray-700">Estado</label>
      <template v-if="acta.ESTADO !== 'FIRMADA'">
        <select id="estado" v-model="acta.ESTADO" class="input-field" required>
          <option value="NO FIRMADA">NO FIRMADA</option>
          <option value="FIRMADA">FIRMADA</option>
        </select>
      </template>
      <template v-else>
        <input
          type="text"
          id="estado"
          v-model="acta.ESTADO"
          class="input-field"
          placeholder="Estado"
          readonly
        />
      </template>
    </div>

    <div>
      <label for="sesionId" class="block mb-2 text-sm font-medium text-gray-700"
        >ID de Sesión</label
      >
      <input
        type="number"
        id="sesionId"
        v-model="acta.SESION_IDSESION"
        class="input-field"
        placeholder="ID de sesión"
      />
    </div>
  </div>

  <button
    @click="actualizarActa"
    class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
  >
    Actualizar Acta
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
