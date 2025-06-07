<template>
  <v-container class="pa-6" style="max-width: 900px; background: white; border-radius: 12px;">
    <h2 class="text-h5 font-weight-bold mb-6" style="color: #1565c0;">Especialistas Guardados</h2>

    <v-data-table
      :headers="headers"
      :items="especialistas"
      item-value="id"
      class="elevation-2"
      dense
      :items-per-page="5"
      :loading="loading"
    >
      <template #item.activo="{ item }">
        <v-chip :color="item.activo ? 'green' : 'red'" dark small>
          {{ item.activo ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>

      <template #item.disponibilidades="{ item }">
        <div v-if="item.disponibilidades.length === 0">Sin disponibilidades</div>
        <v-list dense two-line>
          <v-list-item v-for="(disp, i) in item.disponibilidades" :key="i" class="pa-0">
            <v-list-item-content>
              <v-list-item-title>
                {{ disp.dia }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ disp.hora_inicio }} - {{ disp.hora_fin }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn @click="eliminarDisponibilidad(item, i)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <!-- Formulario para agregar disponibilidad -->
        <v-form v-if="formVisible[item.id]" @submit.prevent="agregarDisponibilidad(item, item.id)">
          <v-select
            v-model="newDisponibilidad.dia"
            :items="diasDisponibles"
            label="Selecciona un día"
            required
          ></v-select>
          <v-time-picker
            v-model="newDisponibilidad.hora_inicio"
            label="Hora de inicio"
            required
          ></v-time-picker>
          <v-time-picker
            v-model="newDisponibilidad.hora_fin"
            label="Hora de fin"
            required
          ></v-time-picker>
          <v-btn type="submit" color="primary">Agregar Disponibilidad</v-btn>
        </v-form>

        <!-- Botón para mostrar el formulario -->
        <v-btn @click="toggleForm(item.id)" color="secondary" small>
          {{ formVisible[item.id] ? 'Cancelar' : 'Agregar Disponibilidad' }}
        </v-btn>
      </template>

      <template #item.guardar="{ item }">
        <v-btn @click="guardarEspecialista(item)" color="success" small>
          Guardar Cambios
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)

const headers = [
  { title: 'Nombre Completo', key: 'nombre_completo', align: 'start', sortable: true },
  { title: 'Especialidad', key: 'especialidad', sortable: true },
  { title: 'Registro Profesional', key: 'registro_profesional' },
  { title: 'Activo', key: 'activo' },
  { title: 'Disponibilidades', key: 'disponibilidades' },
  { title: 'Acción', key: 'guardar' },
]

const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const especialistas = ref([
  {
    id: 1,
    nombre_completo: 'Juan Pérez',
    especialidad: 'Cardiología',
    registro_profesional: '12345',
    activo: true,
    disponibilidades: [
      { dia: 'Lunes', hora_inicio: '08:00', hora_fin: '12:00' },
      { dia: 'Miércoles', hora_inicio: '14:00', hora_fin: '18:00' },
    ],
  },
  {
    id: 2,
    nombre_completo: 'Ana Gómez',
    especialidad: 'Neurología',
    registro_profesional: '67890',
    activo: false,
    disponibilidades: [
      { dia: 'Martes', hora_inicio: '09:00', hora_fin: '13:00' },
    ],
  },
])

const formVisible = ref<{ [key: number]: boolean }>({}) // Controlar la visibilidad del formulario para cada especialista
const newDisponibilidad = ref({
  dia: '',
  hora_inicio: '',
  hora_fin: ''
})

// Función para agregar una nueva disponibilidad
const agregarDisponibilidad = (especialista: any, id: number) => {
  if (!newDisponibilidad.value.dia || !newDisponibilidad.value.hora_inicio || !newDisponibilidad.value.hora_fin) {
    alert('Por favor, completa todos los campos.')
    return
  }

  especialista.disponibilidades.push({
    dia: newDisponibilidad.value.dia,
    hora_inicio: newDisponibilidad.value.hora_inicio,
    hora_fin: newDisponibilidad.value.hora_fin
  })

  // Limpiar el formulario
  newDisponibilidad.value = { dia: '', hora_inicio: '', hora_fin: '' }
  formVisible.value[id] = false // Ocultar el formulario después de agregar
}

// Función para eliminar una disponibilidad
const eliminarDisponibilidad = (especialista: any, index: number) => {
  especialista.disponibilidades.splice(index, 1)
}

// Función para guardar los cambios de un especialista (simulada)
const guardarEspecialista = async (especialista: any) => {
  loading.value = true
  // Aquí se simula el proceso de guardar el especialista, por ejemplo, haciendo una petición HTTP
  console.log('Guardando especialista', especialista)
  // Simulación de llamada API para guardar cambios
  setTimeout(() => {
    loading.value = false
    alert('Cambios guardados con éxito!')
  }, 1000)
}

// Función para alternar la visibilidad del formulario
const toggleForm = (id: number) => {
  formVisible.value[id] = !formVisible.value[id]
}
</script>

<style scoped>
/* Puedes personalizar más estilos si es necesario */
</style>
