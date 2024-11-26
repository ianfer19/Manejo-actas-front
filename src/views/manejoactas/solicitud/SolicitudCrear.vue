<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const dependencia = ref('')
const asunto = ref('')
const decision = ref('')
const fechaDeSolicitud = ref('')
const solicitanteId = ref(1) // Establecer un ID de solicitante predeterminado
const sesionId = ref(1) // Establecer un ID de sesión predeterminado
const descripcionId = ref(1) // Establecer un ID de descripción predeterminado

const agregarSolicitud = async () => {
  const solicitudData = {
    idSolicitud: Date.now(), // Genera un ID único temporal
    dependencia: dependencia.value,
    asunto: asunto.value,
    decision: decision.value,
    fechaDeSolicitud: fechaDeSolicitud.value,
    solicitanteId: solicitanteId.value,
    sesionId: sesionId.value,
    descripcionId: descripcionId.value
  }

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('No se encontró un token de autenticación. Por favor, inicie sesión nuevamente.')
      return router.push({ name: 'login' }) // Redirigir al inicio de sesión si no hay token
    }

    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=solicitud_crear_solicitud',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(solicitudData)
      }
    )

    const result = await response.json()

    if (response.ok) {
      router.push({ name: 'solicitud-lista' }) // Redirigir si la solicitud es exitosa
    } else {
      alert(`Error: ${result.message}`)
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error)
    alert('Hubo un problema al enviar la solicitud.')
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Solicitudes" accion="Crear" />

        <h2 class="text-4xl font-bold text-blue-700">Nueva Solicitud</h2>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
              >Dependencia</label
            >
            <input
              type="text"
              id="dependencia"
              v-model="dependencia"
              class="input-field"
              placeholder="Ingrese la dependencia"
            />
          </div>
          <div>
            <label for="asunto" class="block mb-2 text-sm font-medium text-gray-900">Asunto</label>
            <input
              type="text"
              id="asunto"
              v-model="asunto"
              class="input-field"
              placeholder="Ingrese el asunto"
            />
          </div>
          <div>
            <label for="decision" class="block mb-2 text-sm font-medium text-gray-900"
              >Decisión</label
            >
            <input
              type="text"
              id="decision"
              v-model="decision"
              class="input-field"
              placeholder="Ingrese la decisión"
            />
          </div>
          <div>
            <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900"
              >Fecha de Solicitud</label
            >
            <input type="date" id="fecha" v-model="fechaDeSolicitud" class="input-field" />
          </div>
          <div>
            <label for="solicitante" class="block mb-2 text-sm font-medium text-gray-900"
              >ID del Solicitante</label
            >
            <input type="number" id="solicitante" v-model="solicitanteId" class="input-field" />
          </div>
          <div>
            <label for="sesion" class="block mb-2 text-sm font-medium text-gray-900"
              >ID de Sesión</label
            >
            <input type="number" id="sesion" v-model="sesionId" class="input-field" />
          </div>
          <div>
            <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
              >ID de Descripción</label
            >
            <input type="number" id="descripcion" v-model="descripcionId" class="input-field" />
          </div>
        </div>

        <button @click="agregarSolicitud" class="boton-1">Agregar Solicitud</button>
      </main>
    </div>
  </div>
</template>
