<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const proposicion = ref({})

// Implementar la lógica para cargar la proposición por ID y actualizarla
const loadProposicion = () => {
  const id = route.params.id
  // Cargar la proposición desde la base de datos usando el id
}

// Llamar a loadProposicion al montar el componente
loadProposicion()

const updateProposicion = () => {
  // Implementar la lógica para actualizar la proposición en la base de datos
}
</script>

<template>
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
</template>
