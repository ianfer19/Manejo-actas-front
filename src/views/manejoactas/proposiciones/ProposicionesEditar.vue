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

        <h2 class="text-2xl font-bold mb-4">Editar Proposición</h2>

        <div class="mb-4">
          <label for="descripcion" class="form-label">Descripción</label>
          <textarea
            v-model="proposicion.DESCRIPCION"
            id="descripcion"
            class="form-control"
            rows="4"
            placeholder="Escriba la descripción aquí"
          ></textarea>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <label for="decision" class="form-label">Decisión</label>
            <input
              type="text"
              v-model="proposicion.DESICION"
              id="decision"
              class="form-control"
              placeholder="Ingrese la decisión"
            />
          </div>
          <div class="col-md-3">
            <label for="miembroId" class="form-label">ID Miembro</label>
            <input
              type="number"
              v-model="proposicion.MIEMBRO_IDMIEMBRO"
              id="miembroId"
              class="form-control"
              placeholder="Ingrese el ID"
            />
          </div>
          <div class="col-md-3">
            <label for="sesionId" class="form-label">ID Sesión</label>
            <input
              type="number"
              v-model="proposicion.SESION_IDSESION"
              id="sesionId"
              class="form-control"
              placeholder="Ingrese el ID"
            />
          </div>
        </div>

        <button @click="updateProposicion" class="btn btn-primary">Guardar Cambios</button>
      </main>
    </div>
  </div>
</template>

<style>
.flex {
  display: flex;
}

.flex-grow {
  flex-grow: 1;
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
