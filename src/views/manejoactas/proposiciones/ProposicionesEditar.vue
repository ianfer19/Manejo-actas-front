<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const router = useRouter()

const proposicion = ref({
  IDMIEMBRO: null,
  DESCRIPCION: '',
  DESICION: '',
  SESION_IDSESION: null
})

// Función para obtener el token JWT desde el almacenamiento local
function obtenerToken() {
  return localStorage.getItem('token') // O la fuente donde almacenes el token
}

// Cargar la proposición por ID
const loadProposicion = async () => {
  const id = route.params.id
  if (!id) {
    alert('ID de proposición no proporcionado')
    return
  }

  try {
    const token = obtenerToken() // Obtener el token JWT
    const response = await axios.get(
      `http://localhost/manejo_actas/index.php?accion=proposicion_obtener_proposicion_por_id&idProposicion=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluir el token en la cabecera
        }
      }
    )
    proposicion.value = response.data
  } catch (error) {
    console.error('Error al cargar la proposición:', error)
    alert('Error al cargar la proposición')
  }
}

const updateProposicion = async () => {
  try {
    const token = obtenerToken() // Obtener el token JWT

    console.log(proposicion.value)

    // Mapear las claves del objeto `proposicion` a las que espera el servidor
    const data = {
      idProposicion: proposicion.value.ID_PROPOSICIONES, // Enviar id en el cuerpo
      descripcion: proposicion.value.DESCRIPCION,
      decision: proposicion.value.DESICION,
      miembroId: proposicion.value.MIEMBRO_IDMIEMBRO,
      sesionId: proposicion.value.SESION_IDSESION
    }

    console.log('DATA', data)

    const response = await axios.put(
      `http://localhost/manejo_actas/index.php?accion=proposicion_actualizar_proposicion`, // El id ya no está en la URL
      data, // Enviar los datos en el cuerpo
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Incluir el token en la cabecera
        }
      }
    )

    if (response.status === 200) {
      alert('Proposición actualizada correctamente')
      router.push({ name: 'proposiciones-lista' }) // Redirige a la lista de proposiciones
    } else {
      alert('Error al actualizar la proposición')
    }
  } catch (error) {
    console.error('Error al actualizar la proposición:', error)
    alert('Hubo un error al actualizar la proposición')
  }
}

// Cargar la proposición al montar el componente
onMounted(() => {
  loadProposicion()
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Proposiciones" accion="Editar" />

        <h2 class="text-2xl font-bold">Editar Proposición</h2>
        <div>
          <label for="descripcion">Descripción</label>
          <input type="text" v-model="proposicion.DESCRIPCION" />
        </div>
        <div>
          <label for="decision">Decisión</label>
          <input type="text" v-model="proposicion.DESICION" />
        </div>
        <div>
          <label for="miembroId">ID Miembro</label>
          <input type="number" v-model="proposicion.MIEMBRO_IDMIEMBRO" />
        </div>
        <div>
          <label for="sesionId">ID Sesión</label>
          <input type="number" v-model="proposicion.SESION_IDSESION" />
        </div>
        <button @click="updateProposicion" class="boton-1">Guardar Cambios</button>
      </main>
    </div>
  </div>
</template>
<style>
.input-field {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
}
.boton-1 {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
.boton-1:hover {
  background-color: #45a049;
}
</style>
