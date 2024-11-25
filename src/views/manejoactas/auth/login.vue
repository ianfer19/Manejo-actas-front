<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div class="input-group">
        <label for="email">Correo</label>
        <div class="input-box">
          <i class="fa fa-envelope"></i>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Correo electrónico"
          />
        </div>
      </div>
      <div class="input-group">
        <label for="password">Contraseña</label>
        <div class="input-box">
          <i class="fa fa-lock"></i>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Contraseña"
          />
        </div>
      </div>
      <button type="submit">Ingresar</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <div class="action-buttons">
      <p>¿No estás registrado?</p>
      <router-link to="/register">
        <button class="register-btn">¡Regístrate aquí!</button>
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
        email: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        // Hacemos la solicitud POST al endpoint de autenticación
        const response = await axios.post(
          'http://localhost/manejo_actas/index.php?accion=auth_login',
          this.form
        )

        // Si la respuesta tiene un token, lo guardamos en el localStorage
        const { token } = response.data
        if (token) {
          console.log(token)
          localStorage.setItem('token', token) // Guardamos el token en el localStorage
          this.$router.push('/actas-lista') // Redirige a un dashboard u otra página
        } else {
          this.error = 'Error al iniciar sesión. Token no recibido.'
        }
      } catch (err) {
        // Manejamos los posibles errores
        if (err.response) {
          this.error = err.response.data.error || 'Error al iniciar sesión'
        } else {
          this.error = 'Error de conexión'
        }
      }
    }
  }
}
</script>

<style scoped>
.login-container {
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

.input-box {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: #f9f9f9;
}

.input-box i {
  margin-right: 10px;
  color: #888;
}

input {
  border: none;
  outline: none;
  width: 100%;
  padding: 10px;
  font-size: 1em;
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

.register-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  text-decoration: none;
}

.register-btn:hover {
  background-color: #0056b3;
}
</style>
