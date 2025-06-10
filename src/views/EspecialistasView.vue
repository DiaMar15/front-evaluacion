<template>
  <v-container>
    <!-- Especialistas activos -->
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
            <div v-for="(h, i) in item.disponibilidad" :key="i">
              {{ h.dia }}: {{ h.horaInicio }} - {{ h.horaFin }}
            </div>
          </div>
          <div v-else>
            Sin horarios
          </div>
        </template>
        <template #item.acciones="{ item }">
          <v-btn icon="mdi-pencil" @click="edit(item)" color="primary" />
          <v-btn icon="mdi-delete" @click="softDelete(item)" color="error" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Especialistas inactivos -->
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

    <!-- Formulario -->
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

          <h4 class="mt-4 mb-2">Disponibilidad</h4>
          <div v-for="(item, index) in form.disponibilidad" :key="index" class="d-flex align-center mb-2">
            <v-select
              v-model="item.dia"
              :items="diasSemana"
              label="Día"
              class="me-2"
              style="width: 130px"
            />
            <v-text-field
              v-model="item.horaInicio"
              label="Desde"
              type="time"
              class="me-2"
              style="width: 110px"
            />
            <v-text-field
              v-model="item.horaFin"
              label="Hasta"
              type="time"
              class="me-2"
              style="width: 110px"
            />
            <v-btn icon="mdi-delete" color="error" @click="removeHorario(index)" />
          </div>
          <v-btn
            class="mt-2"
            color="secondary"
            @click="addHorario"
            prepend-icon="mdi-plus"
          >Agregar Horario</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="save">Guardar</v-btn>
          <v-btn @click="closeDialog">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Horario = {
  dia: string
  horaInicio: string
  horaFin: string
}

type Especialista = {
  id: number
  nombre: string
  especialidad: string
  registroProfesional: string
  disponibilidad: Horario[]
  activo: boolean
}

const especialistas = ref<Especialista[]>([
  {
    id: 1,
    nombre: 'Ana Gómez',
    especialidad: 'Cardiología',
    registroProfesional: 'RG-1234',
    disponibilidad: [
      { dia: 'Lunes', horaInicio: '08:00', horaFin: '10:00' },
      { dia: 'Lunes', horaInicio: '10:00', horaFin: '12:00' }
    ],
    activo: true
  },
  {
    id: 2,
    nombre: 'Luis Pérez',
    especialidad: 'Neurología',
    registroProfesional: 'RG-5678',
    disponibilidad: [],
    activo: true
  },
  {
    id: 3,
    nombre: 'María Torres',
    especialidad: 'Dermatología',
    registroProfesional: 'RG-9999',
    disponibilidad: [],
    activo: false
  }
])

const sortBy = ref([{ key: 'nombre', order: 'asc' }])

const headers = [
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Especialidad', key: 'especialidad', sortable: true },
  { title: 'Registro Profesional', key: 'registroProfesional', sortable: false },
  { title: 'Disponibilidad', key: 'disponibilidad', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false }
]

const headersInactivos = [...headers]

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const activos = computed(() => especialistas.value.filter(e => e.activo))
const inactivos = computed(() => especialistas.value.filter(e => !e.activo))

const dialog = ref(false)
const isEditing = ref(false)

const form = ref<Especialista>({
  id: 0,
  nombre: '',
  especialidad: '',
  registroProfesional: '',
  disponibilidad: [],
  activo: true
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

function showSnackbar(text: string, color: string = 'success') {
  snackbar.value.text = text
  snackbar.value.color = color
  snackbar.value.show = true
}

function resetForm() {
  form.value = {
    id: 0,
    nombre: '',
    especialidad: '',
    registroProfesional: '',
    disponibilidad: [],
    activo: true
  }
}

function openCreateDialog() {
  resetForm()
  isEditing.value = false
  dialog.value = true
}

function edit(item: Especialista) {
  form.value = JSON.parse(JSON.stringify(item))
  isEditing.value = true
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  resetForm()
}

function softDelete(item: Especialista) {
  const index = especialistas.value.findIndex(e => e.id === item.id)
  if (index !== -1) {
    especialistas.value[index].activo = false
    showSnackbar('Eliminado con éxito', 'info')
  }
}

function restore(item: Especialista) {
  const index = especialistas.value.findIndex(e => e.id === item.id)
  if (index !== -1) {
    especialistas.value[index].activo = true
    showSnackbar('Restaurado con éxito', 'success')
  }
}

function permanentDelete(item: Especialista) {
  especialistas.value = especialistas.value.filter(e => e.id !== item.id)
  showSnackbar('Eliminado definitivamente', 'error')
}

function addHorario() {
  form.value.disponibilidad.push({
    dia: '',
    horaInicio: '',
    horaFin: ''
  })
}

function removeHorario(index: number) {
  form.value.disponibilidad.splice(index, 1)
}

function horariosTraslapados(horarios: Horario[]): boolean {
  const porDia: Record<string, Horario[]> = {}

  for (const h of horarios) {
    if (!porDia[h.dia]) porDia[h.dia] = []
    porDia[h.dia].push(h)
  }

  for (const dia in porDia) {
    const ordenados = porDia[dia].slice().sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
    for (let i = 0; i < ordenados.length - 1; i++) {
      if (ordenados[i + 1].horaInicio < ordenados[i].horaFin) {
        return true
      }
    }
  }

  return false
}

function save() {
  if (horariosTraslapados(form.value.disponibilidad)) {
    showSnackbar('Hay traslapes en los horarios. Revise disponibilidad.', 'error')
    return
  }

  if (isEditing.value) {
    const index = especialistas.value.findIndex(e => e.id === form.value.id)
    if (index !== -1) {
      especialistas.value[index] = JSON.parse(JSON.stringify(form.value))
      showSnackbar('Actualizado con éxito')
    }
  } else {
    form.value.id = Date.now()
    especialistas.value.push(JSON.parse(JSON.stringify(form.value)))
    showSnackbar('Agregado con éxito')
  }

  closeDialog()
}
</script>

<style scoped>
.v-data-table {
  margin-bottom: 20px;
}
</style>
