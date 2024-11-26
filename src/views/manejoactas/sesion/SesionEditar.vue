<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const lugar = ref('')
const fecha = ref('')
const horaInicio = ref('')
const horaFinal = ref('')
const presidente = ref('')
const secretario = ref('')
const contenido = ref('')
const tema = ref('')
const miembrosInvitados = ref([]) // Estado para los miembros invitados
const miembros = ref([]) // Estado para los miembros (invitados)

// Obtener el token del almacenamiento local
const token = localStorage.getItem('token')

// Implementar la lógica para cargar la sesión por ID
const loadSesion = async () => {
  const idSesion = route.params.id
  console.log('ID Sesión:', idSesion)
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=sesion_obtener_sesion_por_id&idSesion=${idSesion}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar la sesión')

    const data = await response.json()
    console.log('Datos de la sesión:', data)

    lugar.value = data.LUGAR
    fecha.value = data.FECHA
    horaInicio.value = data.HORAINICIO.split('.')[0] // Eliminamos los microsegundos
    horaFinal.value = data.HORAFINAL.split('.')[0] // Eliminamos los microsegundos
    presidente.value = data.PRESIDENTE
    secretario.value = data.SECRETARIO

    // Cargar contenido de la sesión
    await loadContenidoSesion(idSesion)

    // Cargar miembros invitados
    await loadMiembrosInvitados(idSesion)

    // Cargar invitados
    await loadInvitados(idSesion)
  } catch (error) {
    console.error('Error al cargar la sesión:', error)
    alert('No se pudo cargar la sesión')
  }
}

// Nueva función para cargar el contenido de la sesión
const loadContenidoSesion = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=sesion_obtener_contenido_sesion&idSesion=${idSesion}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar el contenido de la sesión')

    const data = await response.json()

    // Asegúrate de que hay datos antes de acceder a ellos
    if (data.length > 0) {
      contenido.value = data[0].DESCRIPCION || ''
      tema.value = data[0].TEMA || ''
    }
  } catch (error) {
    console.error('Error al cargar el contenido de la sesión:', error)
  }
}

// Nueva función para cargar los miembros invitados
const loadMiembrosInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_obtener_asistencia_por_sesion&idSesion=${idSesion}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar los miembros invitados')

    const data = await response.json()

    miembrosInvitados.value = data.filter(
      (miembro) =>
        miembro.INVITACION == 1 ||
        miembro.ESTADO_ASISTENCIA === 'X' ||
        miembro.ESTADO_ASISTENCIA === '-'
    )
  } catch (error) {
    console.error('Error al cargar los miembros invitados:', error)
  }
}

// Nueva función para cargar los invitados
const loadInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_obtener_asistencia_invitados_por_sesion&idSesion=${idSesion}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agrega el token aquí
        }
      }
    )

    if (!response.ok) throw new Error('Error al cargar los invitados')

    const data = await response.json()
    miembros.value = data
  } catch (error) {
    console.error('Error al cargar los invitados:', error)
  }
}

const actualizarAsistenciaMiembro = async (idMiembro, estadoAsistencia) => {
  const idSesion = route.params.id
  console.log(idMiembro, estadoAsistencia)
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_actualizar_asistencia_miembro`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sesionId: idSesion,
          miembroId: idMiembro,
          estadoAsistencia: estadoAsistencia
        })
      }
    )

    if (!response.ok) throw new Error('Error al actualizar la asistencia del miembro')

    alert('Estado de asistencia actualizado correctamente.')
  } catch (error) {
    console.error('Error al actualizar la asistencia del miembro:', error)
    alert('No se pudo actualizar el estado de asistencia.')
  }
}

const actualizarAsistenciaInvitado = async (idInvitado, estadoAsistencia) => {
  const idSesion = route.params.id
  console.log(idInvitado, estadoAsistencia)
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=asistencia_actualizar_asistencia_invitado`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sesionId: idSesion,
          invitadoId: idInvitado,
          estadoAsistencia: estadoAsistencia
        })
      }
    )

    if (!response.ok) throw new Error('Error al actualizar la asistencia del invitado')

    alert('Estado de asistencia actualizado correctamente.')
  } catch (error) {
    console.error('Error al actualizar la asistencia del invitado:', error)
    alert('No se pudo actualizar el estado de asistencia.')
  }
}

// Nueva función para invitar a los miembros
const invitarMiembros = async () => {
  const idSesion = route.params.id
  const dataInvitacion = { idSesion }

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=asistencia_crear_asistencia',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataInvitacion)
      }
    )

    if (!response.ok) throw new Error('Error al invitar a los miembros')

    const result = await response.json()
    alert(`Miembros invitados: ${result.message}`)
    await loadMiembrosInvitados(idSesion)
  } catch (error) {
    console.error('Error al invitar a los miembros:', error)
    alert('Ocurrió un error al invitar a los miembros.')
  }
}

// Nueva función para invitar a los invitados
const invitarInvitados = async () => {
  const idSesion = route.params.id
  const dataInvitacion = { idSesion }

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=asistencia_crear_asistencia_invitados',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataInvitacion)
      }
    )

    if (!response.ok) throw new Error('Error al invitar a los invitados')

    const result = await response.json()
    alert(`Invitados: ${result.message}`)
    await loadInvitados(idSesion)
  } catch (error) {
    console.error('Error al invitar a los invitados:', error)
    alert('Ocurrió un error al invitar a los invitados.')
  }
}

// Llamar a loadSesion al montar el componente
loadSesion()
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Sesiones" accion="Editar" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <h2 class="mb-1 text-4xl font-bold text-blue-700">Editar Sesión</h2>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="lugar" class="block mb-2 text-sm font-medium text-gray-900">Lugar</label>
            <input v-model="lugar" type="text" id="lugar" class="input-class" />
          </div>
          <div>
            <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900">Fecha</label>
            <input v-model="fecha" type="date" id="fecha" class="input-class" />
          </div>
          <div>
            <label for="horaInicio" class="block mb-2 text-sm font-medium text-gray-900"
              >Hora Inicio</label
            >
            <input v-model="horaInicio" type="time" id="horaInicio" class="input-class" />
          </div>
          <div>
            <label for="horaFinal" class="block mb-2 text-sm font-medium text-gray-900"
              >Hora Final</label
            >
            <input v-model="horaFinal" type="time" id="horaFinal" class="input-class" />
          </div>
          <div>
            <label for="presidente" class="block mb-2 text-sm font-medium text-gray-900"
              >Presidente</label
            >
            <input v-model="presidente" type="text" id="presidente" class="input-class" />
          </div>
          <div>
            <label for="secretario" class="block mb-2 text-sm font-medium text-gray-900"
              >Secretario</label
            >
            <input v-model="secretario" type="text" id="secretario" class="input-class" />
          </div>
        </div>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Contenido de la Sesión</h3>
          <label for="tema" class="block mb-2 text-sm font-medium text-gray-900">Tema</label>
          <input v-model="tema" type="text" id="tema" class="input-class" />
          <label for="contenido" class="block mb-2 text-sm font-medium text-gray-900"
            >Descripción</label
          >
          <textarea v-model="contenido" id="contenido" class="input-class"></textarea>
        </div>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Miembros Invitados</h3>
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="py-2 px-4 border-b">Nombre</th>
                <th class="py-2 px-4 border-b">Cargo</th>
                <th class="py-2 px-4 border-b">Estado Asistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="miembro in miembrosInvitados" :key="miembro.MIEMBROS_IDMIEMBRO">
                <td class="py-2 px-4 border-b">{{ miembro.NOMBRE }}</td>
                <td class="py-2 px-4 border-b">{{ miembro.CARGO }}</td>
                <td class="py-2 px-4 border-b">
                  <select
                    v-model="miembro.ESTADO_ASISTENCIA"
                    @change="
                      actualizarAsistenciaMiembro(
                        miembro.MIEMBROS_IDMIEMBRO,
                        miembro.ESTADO_ASISTENCIA
                      )
                    "
                    class="input-class"
                  >
                    <option value="X">X</option>
                    <option value="-">-</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="boton-1" @click="invitarMiembros">Invitar Miembros</button>
        </div>

        <div class="my-6">
          <h3 class="mb-2 text-lg font-bold">Invitados</h3>
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="py-2 px-4 border-b">Nombre</th>
                <th class="py-2 px-4 border-b">Cargo</th>
                <th class="py-2 px-4 border-b">Estado Asistencia</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invitado in miembros" :key="invitado.INVITADO_IDINVITADO">
                <td class="py-2 px-4 border-b">{{ invitado.NOMBRE }}</td>
                <td class="py-2 px-4 border-b">{{ invitado.CARGO }}</td>
                <td class="py-2 px-4 border-b">
                  <select
                    v-model="invitado.ESTADO_ASISTENCIA"
                    @change="
                      actualizarAsistenciaInvitado(
                        invitado.INVITADO_IDINVITADO,
                        invitado.ESTADO_ASISTENCIA
                      )
                    "
                    class="input-class"
                  >
                    <option value="ASISTIO">Asistió</option>
                    <option value="NO ASISTIO">No Asistió</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="boton-1" @click="invitarInvitados">Invitar Invitados</button>
        </div>

        <div class="flex justify-end">
          <button class="boton-1">Guardar Cambios</button>
        </div>
      </main>
    </div>
  </div>
</template>
