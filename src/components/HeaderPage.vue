<template>
  <!-- HEADER -->
  <div class="md:flex md:flex-shrink-0 bg-blue-200">
    <div
      class="flex items-center justify-between px-6 py-4 bg-blue-200 md:flex-shrink-0 md:justify-center md:w-56"
    ></div>
    <img alt="Vue logo" class="logo bg-blue-200" src="@/assets/logo.png" width="125" height="125" />
    <div
      class="md:text-md flex items-center justify-between bg-blue-200 p-4 w-full text-sm border-b md:px-12 md:py-0"
    >
      <div class="mr-4 mt-1 text-black-700 text-4xl font-bold bg-blue-200">
        <b>Actas</b><br />
        <!-- Mostrar nombre y rol procesado -->
        <span v-if="userInfo"> ({{ userInfo?.name }} - {{ getRoleName(userInfo?.role) }}) </span>
      </div>

      <!-- Botón de Cerrar sesión -->
      <button @click="logout" class="text-white bg-red-500 p-2 rounded">Cerrar sesión</button>
    </div>
  </div>
  <!-- // HEADER -->
</template>

<script>
export default {
  data() {
    return {
      userInfo: null // Para almacenar la información del usuario
    }
  },
  mounted() {
    this.getUserInfo() // Llamamos a la función para obtener la información del usuario
  },
  methods: {
    // Obtener la información del usuario desde el token
    getUserInfo() {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          const tokenParts = token.split('.')

          if (tokenParts.length === 3) {
            const decodedPayload = atob(tokenParts[1])
            const decodedData = JSON.parse(decodedPayload)
            const userId = decodedData.userId
            this.fetchUser(userId)
          } else {
            console.error('Token JWT no tiene el formato esperado.')
          }
        } catch (error) {
          console.error('Error al decodificar el token', error)
        }
      }
    },
    // Obtener los datos del usuario desde la API
    async fetchUser(id) {
      try {
        const response = await fetch(
          `http://localhost/manejo_actas/index.php?accion=user_obtener_usuario_por_id&id=${id}`
        )
        if (response.ok) {
          const data = await response.json()
          this.userInfo = data // Asegúrate de que 'role' esté incluido en la respuesta
        } else {
          console.error('No se pudo obtener la información del usuario.')
        }
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error)
      }
    },
    // Convertir el rol a un nombre descriptivo
    getRoleName(role) {
      const roles = {
        admin: 'Coordinador',
        user: 'Miembro',
        viewer: 'Invitado'
      }
      return roles[role] || 'Desconocido'
    },
    // Cerrar sesión y redirigir
    logout() {
      localStorage.removeItem('token')
      this.$router.replace('/login')
    }
  }
}
</script>
