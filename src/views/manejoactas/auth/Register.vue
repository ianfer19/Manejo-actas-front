<template>
  <div class="register-container">
    <h2>Registro</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="name">Nombre</label>
        <input id="name" v-model="form.name" type="text" required placeholder="Nombre completo" />
      </div>
      <div class="input-group">
        <label for="email">Correo</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="Correo electrónico"
        />
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Contraseña"
        />
      </div>
      <div class="input-group">
        <label for="cargo">Cargo</label>
        <input
          id="cargo"
          v-model="form.cargo"
          type="text"
          required
          placeholder="Cargo del usuario"
        />
      </div>
      <div class="input-group">
        <label for="tipo">Tipo de usuario</label>
        <select id="tipo" v-model="form.tipo" required>
          <option value="miembro">Miembro</option>
          <option value="invitado">Invitado</option>
        </select>
      </div>
      <button type="submit">Registrar</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div class="action-buttons">
      <p>¿Ya tienes una cuenta?</p>
      <router-link to="/login">
        <button class="login-btn">¡Inicia sesión aquí!</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        cargo: '',
        tipo: 'miembro' // Por defecto se selecciona 'miembro'
      },
      error: '' // Para mostrar errores en pantalla
    }
  },
  methods: {
    async register() {
      try {
        // Determinar el rol basado en el tipo de usuario
        const role = this.form.tipo === 'miembro' ? 'user' : 'viewer'

        // Crear usuario y obtener su ID
        const userResponse = await axios.post(
          'http://localhost/manejo_actas/index.php?accion=auth_registro',
          {
            nombre: this.form.name,
            email: this.form.email,
            password: this.form.password,
            role // Enviar el rol adecuado
          }
        )
        const userId = userResponse.data.id // ID del usuario creado

        if (this.form.tipo === 'miembro') {
          // Crear miembro asociado al usuario
          await axios.post(
            'http://localhost/manejo_actas/index.php?accion=miembro_crear_miembro_id',
            {
              nombre: this.form.name,
              cargo: this.form.cargo,
              idMiembro: userId
            }
          )
        } else if (this.form.tipo === 'invitado') {
          // Crear invitado asociado al usuario
          await axios.post(
            'http://localhost/manejo_actas/index.php?accion=invitado_crear_invitado_id',
            {
              nombre: this.form.name,
              dependencia: 'Dependencia default', // Cambiar según necesidades
              cargo: this.form.cargo,
              idMiembro: userId
            }
          )
        }

        // Redirigir al login tras el éxito
        this.$router.push('/login')
      } catch (err) {
        // Capturar errores del servidor y mostrarlos
        this.error = err.response?.data?.error || 'Error en el registro'
      }
    }
  }
}
</script>

<style scoped>
/* Igual que en el ejemplo anterior */
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #333;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-size: 0.9em;
  text-align: center;
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.login-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  text-decoration: none;
}

.login-btn:hover {
  background-color: #0056b3;
}
</style>
