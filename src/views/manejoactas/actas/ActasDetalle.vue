<template>
  <div class="acta-detalle">
    <div class="boton-container">
      <button @click="generatePDF" class="btn-verde">Descargar PDF</button>
    </div>

    <!-- Contenedor a convertir en PDF -->
    <div ref="pdfContent">
      <!-- Tabla Acta -->

      <div class="table-title">ACTA</div>
      <table>
        <thead>
          <tr>
            <th>Número de Acta</th>
            <th>Estado</th>
            <th>ID Sesión</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ acta.NUM_ACTAS }}</td>
            <td>{{ acta.ESTADO }}</td>
            <td>{{ acta.SESION_IDSESION }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabla Sesión -->
      <div class="table-title">SESION</div>
      <table>
        <thead>
          <tr>
            <th>Lugar</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Final</th>
            <th>Presidente</th>
            <th>Secretario</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ sesion.LUGAR }}</td>
            <td>{{ sesion.FECHA }}</td>
            <td>{{ formatTime(sesion.HORAINICIO) }}</td>
            <td>{{ formatTime(sesion.HORAFINAL) }}</td>

            <td>{{ sesion.PRESIDENTE }}</td>
            <td>{{ sesion.SECRETARIO }}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <th>TEMA</th>
            <th>DESCRIPCION</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ sesion.TEMA }}</td>
            <td>{{ sesion.DESCRIPCION }}</td>
          </tr>
        </tbody>
      </table>
      <!-- Tabla Miembros Asistentes -->
      <div class="table-title">MIEMBROS ASISTENTES</div>
      <table>
        <thead>
          <tr>
            <th>ID Miembro</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Estado Asistencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="miembro in miembrosAsistentes" :key="miembro.IDMIEMBRO">
            <td>{{ miembro.IDMIEMBRO }}</td>
            <td>{{ miembro.NOMBRE }}</td>
            <td>{{ miembro.CARGO }}</td>
            <td>{{ miembro.ESTADO_ASISTENCIA }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabla Invitados Asistentes -->
      <div class="table-title">INVITADOS</div>
      <table>
        <thead>
          <tr>
            <th>ID Invitado</th>
            <th>Nombre</th>
            <th>Dependencia</th>
            <th>Cargo</th>
            <th>Estado Asistencia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invitado in invitadosAsistentes" :key="invitado.IDINVITADOS">
            <td>{{ invitado.IDINVITADOS }}</td>
            <td>{{ invitado.NOMBRE }}</td>
            <td>{{ invitado.DEPENDENCIA }}</td>
            <td>{{ invitado.CARGO }}</td>
            <td>{{ invitado.ESTADO_ASISTENCIA }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Tabla Proposiciones -->
      <div class="table-title">PROPOSICIONES</div>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Decisión</th>
            <th>Miembro</th>
            <th>ID Sesión</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proposicion in proposiciones" :key="proposicion.ID_PROPOSICIONES">
            <td>{{ proposicion.DESCRIPCION }}</td>
            <td>{{ proposicion.DESICION }}</td>
            <td>{{ proposicion.NOMBRE_MIEMBRO }}</td>
            <td>{{ proposicion.SESION_IDSESION }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import { useRoute } from 'vue-router'
export default {
  name: 'ActaDetalle',
  data() {
    return {
      acta: {},
      sesion: {},
      proposiciones: [],
      miembrosAsistentes: [],
      invitadosAsistentes: []
    }
  },
  mounted() {
    const route = useRoute()
    const numActa = route.params.id
    fetch(`http://localhost/manejo_actas/index.php?accion=obtener_completa&numActa=${numActa}`)
      .then((response) => response.json())
      .then((data) => {
        this.acta = data.acta
        this.sesion = data.sesion
        this.proposiciones = data.proposiciones
        this.miembrosAsistentes = data.miembrosAsistentes
        this.invitadosAsistentes = data.invitadosAsistentes
      })
      .catch((error) => {
        console.error('Error al obtener los datos del acta:', error)
      })
  },
  methods: {
    generatePDF() {
      const element = this.$refs.pdfContent
      const options = {
        margin: 1,
        filename: `Acta_${this.acta.NUM_ACTAS}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }
      html2pdf().set(options).from(element).save()
    },
    formatTime(time) {
      return time ? time.slice(0, 8) : ''
    }
  }
}
</script>

<style>
.table-title {
  font-size: 15px;
  margin-bottom: 5px; /* Ajusta el espacio debajo del título */
  margin-top: 5px; /* Ajusta el espacio encima del título */
}
.acta-detalle {
  font-family: Arial, sans-serif;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 8px;
  text-align: left;
}

.boton-container {
  display: flex;
  justify-content: flex-end;
}

.btn-verde {
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-verde:hover {
  background-color: darkgreen;
}
</style>
