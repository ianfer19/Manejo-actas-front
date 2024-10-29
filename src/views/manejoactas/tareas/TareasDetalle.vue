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

onMounted(loadTarea)
</script>

<template>
  <BreadCrumb modulo="Tareas" accion="Detalles" />

  <h2 class="text-2xl font-bold">Detalles de la Tarea</h2>
  <div>
    <p><strong>ID:</strong> {{ tarea.ID_TAREAS }}</p>
    <p><strong>Descripción:</strong> {{ tarea.DESCRIPCION }}</p>
    <p><strong>ID de Sesión:</strong> {{ tarea.SESION_IDSESION }}</p>
    <p><strong>Fecha de Entrega:</strong> {{ tarea.FECHA_ENTREGA }}</p>
    <p><strong>Fecha de Verificación:</strong> {{ tarea.FECHA_VERIFICACION }}</p>
  </div>
</template>
