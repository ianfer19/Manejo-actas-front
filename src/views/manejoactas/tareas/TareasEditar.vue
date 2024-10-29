<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tarea = ref({})

const loadTarea = () => {
  const id = route.params.id
  // Simulación de obtener la tarea por ID (reemplaza esto con una llamada API real)
  tarea.value = {
    ID_TAREAS: id,
    DESCRIPCION: 'REVISION SOLICITUDES SALIDAS INTERNACIONALES',
    SESION_IDSESION: 1,
    FECHA_ENTREGA: '2014-04-17',
    FECHA_VERIFICACION: '2014-05-17'
  }
}

const actualizarTarea = () => {
  // Implementar la lógica para actualizar la tarea (llamada API)
  alert(`Tarea con ID ${tarea.value.ID_TAREAS} actualizada`)
}

onMounted(loadTarea)
</script>

<template>
  <BreadCrumb modulo="Tareas" accion="Editar" />

  <h2 class="text-4xl font-bold">Editar Tarea</h2>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
        >Descripción</label
      >
      <input type="text" id="descripcion" v-model="tarea.DESCRIPCION" class="input-field" />
    </div>
    <div>
      <label for="sesion" class="block mb-2 text-sm font-medium text-gray-900">ID de Sesión</label>
      <input type="number" id="sesion" v-model="tarea.SESION_IDSESION" class="input-field" />
    </div>
    <div>
      <label for="fechaEntrega" class="block mb-2 text-sm font-medium text-gray-900"
        >Fecha de Entrega</label
      >
      <input type="date" id="fechaEntrega" v-model="tarea.FECHA_ENTREGA" class="input-field" />
    </div>
    <div>
      <label for="fechaVerificacion" class="block mb-2 text-sm font-medium text-gray-900"
        >Fecha de Verificación</label
      >
      <input
        type="date"
        id="fechaVerificacion"
        v-model="tarea.FECHA_VERIFICACION"
        class="input-field"
      />
    </div>
  </div>

  <button @click="actualizarTarea" class="boton-1">Actualizar Tarea</button>
</template>
