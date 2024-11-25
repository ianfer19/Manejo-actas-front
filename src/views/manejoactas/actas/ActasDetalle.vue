<template>
  <div class="acta-detalle">
    <div class="boton-container">
      <button @click="generatePDF" class="btn-verde">Descargar PDF</button>
      <button @click="abrirModalOrden" class="btn-verde">Agregar Orden del Día</button>
    </div>

    <!-- Contenedor a convertir en PDF -->
    <div ref="pdfContent">
      <!-- Página 1: Acta, Sesión, Tema, Miembros -->
      <div class="pdf-page">
        <img :src="plantillaInicio" alt="Plantilla Inicio" class="encabezado" />
        <div class="page-content">
          <!-- Tabla de Acta -->
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

          <!-- Tabla de Sesión -->
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
        </div>
        <img :src="plantillaFin" alt="Plantilla Fin" class="pie" />
      </div>

      <!-- Página 2: Invitados y Proposiciones -->
      <div class="pdf-page">
        <img :src="plantillaInicio" alt="Plantilla Inicio" class="encabezado" />
        <div class="page-content">
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

          <!-- Tabla de Órdenes del Día -->
          <div class="table-title">Órdenes del Día</div>
          <table>
            <thead>
              <tr>
                <th>ID Orden</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="orden in ordenDelDia" :key="orden.ID_ORDEN">
                <td>{{ orden.ID_ORDEN }}</td>
                <td>{{ orden.DESCRIPCION }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tabla de Proposiciones -->
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
      <img :src="plantillaFin" alt="Plantilla Fin" class="pie" />
    </div>

    <!-- Modal para agregar Orden del Día -->
    <div v-if="mostrarModalOrden" class="modal-overlay">
      <div class="modal">
        <h3>Agregar Orden del Día</h3>
        <textarea
          v-model="nuevaOrden.DESCRIPCION"
          placeholder="Escribe la descripción de la nueva orden..."
          rows="4"
        ></textarea>
        <div class="modal-actions">
          <button class="btn-verde" @click="agregarOrdenDia">Guardar</button>
          <button class="btn-rojo" @click="cerrarModalOrden">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import { useRoute } from 'vue-router'
import plantillaInicio from '@/assets/plantillas/plantilla_inicio.png'
import plantillaFin from '@/assets/plantillas/plantilla_fin.png'

export default {
  name: 'ActaDetalle',
  data() {
    return {
      acta: {},
      sesion: {},
      proposiciones: [],
      miembrosAsistentes: [],
      invitadosAsistentes: [],
      plantillaInicio: plantillaInicio,
      plantillaFin: plantillaFin,
      ordenDelDia: [], // Nuevos datos para el Orden del Día
      nuevaOrden: {
        DESCRIPCION: '' // Campo para nueva orden
      },
      mostrarModalOrden: false
    }
  },
  mounted() {
    const route = useRoute()
    const numActa = route.params.id
    const token = localStorage.getItem('token')
    fetch(
      `http://localhost/manejo_actas/index.php?accion=acta_obtener_completa&numActa=${numActa}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
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
    // Obtener las órdenes del día relacionadas con el acta
    fetch(
      `http://localhost/manejo_actas/index.php?accion=ordendia_obtener_ordenes_por_acta&actaNum=${numActa}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          this.ordenDelDia = data // Asignar las órdenes del día obtenidas
        } else {
          console.error('Error al obtener órdenes del día:', data.error)
        }
      })
      .catch((error) => {
        console.error('Error al obtener órdenes del día:', error)
      })
  },
  methods: {
    generatePDF() {
      const element = this.$refs.pdfContent
      const options = {
        margin: [0.0, 0.5],
        filename: `Acta_${this.acta.NUM_ACTAS}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }

      html2pdf().set(options).from(element).save()
    },

    formatTime(time) {
      return time ? time.slice(0, 8) : ''
    },
    abrirModalOrden() {
      this.mostrarModalOrden = true
    },
    cerrarModalOrden() {
      this.mostrarModalOrden = false
      this.nuevaOrden.DESCRIPCION = ''
    },
    agregarOrdenDia() {
      const token = localStorage.getItem('token')
      fetch(`http://localhost/manejo_actas/index.php?accion=ordendia_crear_orden_dia`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          actaNum: this.acta.NUM_ACTAS,
          descripcion: this.nuevaOrden.DESCRIPCION
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.mensaje) {
            this.ordenDelDia.push({
              ID_ORDEN: data.id_orden,
              DESCRIPCION: this.nuevaOrden.DESCRIPCION
            })
            this.cerrarModalOrden()
          } else {
            console.error('Error al agregar Orden del Día:', data.error)
          }
        })
        .catch((error) => console.error('Error en la solicitud:', error))
    }
  }
}
</script>

<style>
.acta-detalle {
  font-family: Arial, sans-serif;
  font-size: 12px; /* Tamaño de fuente general para reducir el texto en todo el componente */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 15px; /* Tamaño de fuente específico para el texto dentro de las tablas */
}

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 6px; /* Reducción de padding para una apariencia más compacta */
  text-align: left;
}

.boton-container {
  display: flex;
  justify-content: flex-end;
}

.btn-verde {
  background-color: green;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px; /* Tamaño de fuente más pequeño para el botón */
}

.btn-verde:hover {
  background-color: darkgreen;
}

.table-title {
  font-size: 18px; /* Ajuste del tamaño de fuente para los títulos de tabla */
  margin-bottom: 5px;
  margin-top: 5px;
}

.pdf-page {
  page-break-after: always;
}
.encabezado,
.pie {
  width: 100%;
  margin-bottom: -20;
}
.page-content {
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-top: 0;
  font-size: 18px;
}

.modal textarea {
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.btn-rojo {
  background-color: red;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.btn-rojo:hover {
  background-color: darkred;
}
</style>
