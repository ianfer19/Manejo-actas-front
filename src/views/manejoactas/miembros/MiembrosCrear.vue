<script setup>
import { ref } from 'vue'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nombre = ref('')
const cargo = ref('')

const agregarMiembro = async () => {
  try {
    // Obtener el token del almacenamiento local o la fuente correspondiente
    const token = localStorage.getItem('token') // Ajusta según dónde guardes el token

    // Realizar la solicitud con el token incluido en los encabezados
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=miembro_crear_miembro',
      {
        nombre: nombre.value,
        cargo: cargo.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluye el token en el encabezado
        }
      }
    )
    router.push({ name: 'miembros-lista' })
  } catch (error) {
    console.error('Error al agregar miembro:', error)
    alert('Error al agregar miembro. Intente nuevamente.')
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Miembros" accion="Crear" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <div class="flex items-center">
            <h2 class="mb-1 text-4xl font-bold text-blue-700">Nuevo Miembro</h2>
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Nombre</label
            >
            <input
              v-model="nombre"
              type="text"
              id="nombre"
              class="input-field"
              placeholder="Ingrese el nombre del miembro"
            />
          </div>
          <div>
            <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Cargo</label
            >
            <input
              v-model="cargo"
              type="text"
              id="cargo"
              class="input-field"
              placeholder="Cargo del miembro"
            />
          </div>
        </div>

        <button @click="agregarMiembro" class="boton-1">Agregar Miembro</button>
      </main>
    </div>
  </div>
</template>
