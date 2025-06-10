<template>
  <v-container>
    <!-- Tabla de Especialistas Activos -->
    <v-card class="mb-4">
      <v-card-title>
        Especialistas Activos
        <v-spacer />
        <v-btn color="primary" @click="openCreateDialog">Agregar</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="activos"
        :sort-by="sortBy"
        class="elevation-1"
      >
        <template #item.disponibilidad="{ item }">
          <div v-if="item.disponibilidad.length">
            <div v-for="(d, i) in item.disponibilidad" :key="i">
              {{ d.dia }}: {{ d.horaInicio }} - {{ d.horaFin }}
            </div>
          </div>
          <div v-else>No asignada</div>
        </template>
        <template #item.acciones="{ item }">
          <v-btn icon="mdi-pencil" @click="edit(item)" color="primary" />
          <v-btn icon="mdi-delete" @click="softDelete(item)" color="error" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Tabla de Inactivos -->
    <v-card class="mb-4">
      <v-card-title>Especialistas Inactivos</v-card-title>
      <v-data-table
        :headers="headersInactivos"
        :items="inactivos"
        class="elevation-1"
      >
        <template #item.acciones="{ item }">
          <v-btn icon="mdi-backup-restore" @click="restore(item)" color="success" />
          <v-btn icon="mdi-delete-forever" @click="permanentDelete(item)" color="error" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Editar Especialista' : 'Agregar Especialista' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.nombre" label="Nombre" />
          <v-text-field v-model="form.especialidad" label="Especialidad" />
          <v-text-field v-model="form.registroProfesional" label="Registro Profesional" />
          <v-switch v-model="form.activo" label="Activo" />

          <h4>Disponibilidad</h4>
          <div v-for="(d, i) in form.disponibilidad" :key="i" class="d-flex mb-2 align-center">
            <v-select
              v-model="d.dia"
              :items="dias"
              label="Día"
              class="mr-2"
              style="max-width: 120px"
              :error="!!getDisponibilidadError(i)"
              :error-messages="getDisponibilidadError(i)"
            />
            <v-text-field
              v-model="d.horaInicio"
              label="Inicio"
              type="time"
              class="mr-2"
              style="max-width: 120px"
              :error="!!getDisponibilidadError(i)"
            />
            <v-text-field
              v-model="d.horaFin"
              label="Fin"
              type="time"
              class="mr-2"
              style="max-width: 120px"
              :error="!!getDisponibilidadError(i)"
            />
            <v-btn icon @click="removeDisponibilidad(i)" color="error">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
          <v-btn color="secondary" @click="addDisponibilidad">Agregar disponibilidad</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :disabled="!isFormValid" @click="save">Guardar</v-btn>
          <v-btn @click="closeDialog">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Disponibilidad {
  dia: string
  horaInicio: string
  horaFin: string
}

interface Especialista {
  id: number
  nombre: string
  especialidad: string
  registroProfesional: string
  activo: boolean
  disponibilidad: Disponibilidad[]
}

const especialistas = ref<Especialista[]>([
  {
    id: 1,
    nombre: 'Ana Gómez',
    especialidad: 'Cardiología',
    registroProfesional: 'RP-001',
    activo: true,
    disponibilidad: [
      { dia: 'Lunes', horaInicio: '08:00', horaFin: '12:00' }
    ]
  },
  {
    id: 2,
    nombre: 'Luis Pérez',
    especialidad: 'Neurología',
    registroProfesional: 'RP-002',
    activo: true,
    disponibilidad: []
  },
  {
    id: 3,
    nombre: 'María Torres',
    especialidad: 'Dermatología',
    registroProfesional: 'RP-003',
    activo: false,
    disponibilidad: []
  }
])

const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const sortBy = ref([{ key: 'nombre', order: 'asc' }])

const headers = [
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Especialidad', key: 'especialidad', sortable: true },
  { title: 'Registro Profesional', key: 'registroProfesional', sortable: true },
  { title: 'Disponibilidad', key: 'disponibilidad', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const headersInactivos = [
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Especialidad', key: 'especialidad', sortable: true },
  { title: 'Registro Profesional', key: 'registroProfesional', sortable: true },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const activos = computed(() => especialistas.value.filter(e => e.activo))
const inactivos = computed(() => especialistas.value.filter(e => !e.activo))

const dialog = ref(false)
const isEditing = ref(false)
const form = ref<Especialista>({
  id: 0,
  nombre: '',
  especialidad: '',
  registroProfesional: '',
  activo: true,
  disponibilidad: []
})

const resetForm = () => {
  form.value = {
    id: 0,
    nombre: '',
    especialidad: '',
    registroProfesional: '',
    activo: true,
    disponibilidad: []
  }
}

const openCreateDialog = () => {
  resetForm()
  isEditing.value = false
  dialog.value = true
}

const edit = (item: Especialista) => {
  form.value = {
    ...item,
    disponibilidad: JSON.parse(JSON.stringify(item.disponibilidad)) // deep copy
  }
  isEditing.value = true
  dialog.value = true
}

const save = () => {
  if (!isFormValid.value) return
  if (isEditing.value) {
    const index = especialistas.value.findIndex(e => e.id === form.value.id)
    if (index !== -1) {
      especialistas.value[index] = { ...form.value }
    }
  } else {
    form.value.id = Date.now()
    especialistas.value.push({ ...form.value })
  }
  closeDialog()
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const softDelete = (item: Especialista) => {
  const index = especialistas.value.findIndex(e => e.id === item.id)
  if (index !== -1) {
    especialistas.value[index].activo = false
  }
}

const restore = (item: Especialista) => {
  const index = especialistas.value.findIndex(e => e.id === item.id)
  if (index !== -1) {
    especialistas.value[index].activo = true
  }
}

const permanentDelete = (item: Especialista) => {
  especialistas.value = especialistas.value.filter(e => e.id !== item.id)
}

const addDisponibilidad = () => {
  form.value.disponibilidad.push({ dia: '', horaInicio: '', horaFin: '' })
}

const removeDisponibilidad = (index: number) => {
  form.value.disponibilidad.splice(index, 1)
}

const getDisponibilidadError = (index: number): string => {
  const d = form.value.disponibilidad[index]
  if (!d.dia || !d.horaInicio || !d.horaFin) return 'Completa todos los campos'
  if (d.horaInicio >= d.horaFin) return 'Hora fin debe ser mayor que hora inicio'
  return ''
}

const isFormValid = computed(() => {
  return (
    form.value.nombre.trim() !== '' &&
    form.value.especialidad.trim() !== '' &&
    form.value.registroProfesional.trim() !== '' &&
    form.value.disponibilidad.every((_, i) => getDisponibilidadError(i) === '')
  )
})
</script>

<style scoped>
.v-data-table {
  margin-bottom: 20px;
}
</style>
