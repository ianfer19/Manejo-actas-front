<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'

const tarea = ref({
  DESCRIPCION: '',
  SESION_IDSESION: '',
  FECHA_ENTREGA: '',
  FECHA_VERIFICACION: ''
})

const crearTarea = () => {
  // Implementar la lógica para crear la tarea (llamada API)
  alert('Tarea creada con éxito')
}
</script>

<template>
  <BreadCrumb modulo="Tareas" accion="Crear" />

  <h2 class="text-4xl font-bold">Crear Tarea</h2>

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

  <button @click="crearTarea" class="boton-1">Crear Tarea</button>
</template>
