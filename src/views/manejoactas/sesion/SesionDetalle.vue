<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx'
import axios from 'axios'

const route = useRoute()
let sesion = ref({})
const miembrosInvitados = ref([]) // Estado para los miembros invitados
const miembros = ref([]) // Estado para los invitados

// Implementar la lógica para cargar la sesión por ID
const loadSesion = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_sesion_por_id&idSesion=${id}`
    )
    if (!response.ok) throw new Error('Error al cargar la sesión')

    const data = await response.json()
    sesion.value = data // Asigna los datos recibidos a la variable sesion

    // Cargar miembros invitados y convidados después de obtener la sesión
    await loadMiembrosInvitados(id)
    await loadInvitados(id)
  } catch (error) {
    console.error('Error al cargar la sesión:', error)
    alert('No se pudo cargar la sesión')
  }
}
const crearActa = async () => {
  const id = route.params.id
  console.log('ID de la sesión:', id)

  if (
    !sesion.value.LUGAR ||
    !sesion.value.FECHA ||
    !sesion.value.HORAINICIO ||
    !sesion.value.HORAFINAL
  ) {
    alert('Por favor, carga los datos de la sesión antes de crear el acta.')
    return
  }

  try {
    console.log('Creando acta en el servidor...')
    await axios.post('http://localhost/manejo_actas/index.php?accion=crear_acta', { sesionId: id })
    console.log('Acta creada en el servidor.')

    console.log('Obteniendo la última acta...')
    const response = await fetch(`http://localhost/manejo_actas/index.php?accion=obtener_actas`)

    const data = await response.json()
    console.log('Datos de la última acta:', data)

    // Verificar la estructura de los datos
    let numeroActa = data

    // Si numeroActa sigue siendo undefined, manejar el error
    if (!numeroActa) {
      alert('No se pudo obtener el número de acta.')
      return
    }

    // Crear un nuevo documento
    console.log('Creando nuevo documento...')
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Acta de Sesión',
              heading: 'Heading1',
              bold: true,
              alignment: 'center'
            }),
            new Paragraph({ text: `Número de Acta: ${numeroActa}`, bold: true }),
            new Paragraph({ text: `Lugar: ${sesion.value.LUGAR}`, bold: true }),
            new Paragraph({ text: `Fecha Inicio: ${sesion.value.FECHA}`, bold: true }),
            new Paragraph({ text: `Hora de Inicio: ${sesion.value.HORAINICIO}`, bold: true }),
            new Paragraph({ text: `Hora de Fin: ${sesion.value.HORAFINAL}`, bold: true })
          ]
        }
      ]
    })

    // Crear tabla para miembros invitados
    console.log('Creando tabla para miembros invitados...')
    const miembrosTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('CARGO')] }),
            new TableCell({ children: [new Paragraph('NOMBRE')] }),
            new TableCell({ children: [new Paragraph('ASISTIÓ')] }),
            new TableCell({ children: [new Paragraph('NO ASISTIÓ')] }),
            new TableCell({ children: [new Paragraph('EXCUSA')] })
          ]
        }),
        ...miembrosInvitados.value.map((miembro, index) => {
          console.log(`Miembro ${index + 1}:`, miembro) // Mostrar datos de cada miembro
          return new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(miembro.CARGO || '')] }),
              new TableCell({ children: [new Paragraph(miembro.NOMBRE || '')] }),
              new TableCell({
                children: [new Paragraph(miembro.ESTADO_ASISTENCIA === 'X' ? 'Sí' : '')]
              }),
              new TableCell({
                children: [new Paragraph(miembro.ESTADO_ASISTENCIA === '-' ? 'No' : '')]
              }),
              new TableCell({ children: [new Paragraph(miembro.excusa || '')] })
            ]
          })
        })
      ]
    })

    doc.addSection({
      children: [
        new Paragraph({ text: 'Miembros Asistentes', bold: true, heading: 'Heading1' }),
        miembrosTable
      ]
    })

    // Crear y añadir tabla de invitados
    console.log('Creando tabla de invitados...')
    const invitadosTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph('CARGO')] }),
            new TableCell({ children: [new Paragraph('NOMBRE')] })
          ]
        }),
        ...miembros.value.map((invitado, index) => {
          console.log(`Invitado ${index + 1}:`, invitado) // Mostrar datos de cada invitado
          return new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(invitado.CARGO || '')] }),
              new TableCell({ children: [new Paragraph(invitado.NOMBRE || '')] })
            ]
          })
        })
      ]
    })

    doc.addSection({
      children: [
        new Paragraph({ text: 'Invitados', bold: true, heading: 'Heading1' }),
        invitadosTable
      ]
    })

    // Guardar el documento como un blob
    console.log('Guardando el documento como un blob...')
    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)

    // Crear un enlace para descargar el archivo
    const a = document.createElement('a')
    a.href = url
    a.download = `Acta_${numeroActa}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    console.log('Descarga del acta completada.')
  } catch (error) {
    console.error('Error al crear el acta:', error)
    alert(
      'Error al crear el acta: ' +
        (error.response ? error.response.data.message : error.message || error)
    )
  }
}

// Función para cargar los miembros invitados
const loadMiembrosInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_asistencia_por_sesion&idSesion=${idSesion}`
    )

    if (!response.ok) throw new Error('Error al cargar los miembros invitados')

    const data = await response.json()

    // Filtrar los miembros que están invitados
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

// Función para cargar los invitados
const loadInvitados = async (idSesion) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_asistencia_invitados_por_sesion&idSesion=${idSesion}`
    )

    if (!response.ok) throw new Error('Error al cargar los invitados')

    const data = await response.json()
    miembros.value = data // Asignar los datos de invitados al estado
  } catch (error) {
    console.error('Error al cargar los invitados:', error)
  }
}

// Llamar a loadSesion al montar el componente
loadSesion()
</script>

<template>
  <BreadCrumb modulo="Sesiones" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalles de la Sesión</h2>

  <div class="my-6">
    <h3 class="mb-2 text-lg font-bold">Información de la Sesión</h3>
    <p><strong>Lugar:</strong> {{ sesion.LUGAR }}</p>
    <p><strong>Fecha Inicio:</strong> {{ sesion.FECHA }}</p>
    <p><strong>Hora Inicio:</strong> {{ sesion.HORAINICIO }}</p>
    <p><strong>Hora Final:</strong> {{ sesion.HORAFINAL }}</p>
    <p><strong>Presidente:</strong> {{ sesion.PRESIDENTE }}</p>
    <p><strong>Secretario:</strong> {{ sesion.SECRETARIO }}</p>
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
        <tr v-for="miembro in miembrosInvitados" :key="miembro.ID">
          <td class="py-2 px-4 border-b">{{ miembro.NOMBRE }}</td>
          <td class="py-2 px-4 border-b">{{ miembro.CARGO }}</td>
          <td class="py-2 px-4 border-b">{{ miembro.ESTADO_ASISTENCIA }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="my-6">
    <h3 class="mb-2 text-lg font-bold">Invitados</h3>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr class="bg-gray-200 text-gray-700">
          <th class="py-2 px-4 border-b">Nombre</th>
          <th class="py-2 px-4 border-b">Cargo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="invitado in miembros" :key="invitado.ID">
          <td class="py-2 px-4 border-b">{{ invitado.NOMBRE }}</td>
          <td class="py-2 px-4 border-b">{{ invitado.CARGO }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <button @click="crearActa" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
    Crear Acta
  </button>
</template>

<style scoped>
/* Estilos aquí */
</style>
