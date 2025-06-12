<template>
  <v-container>
    <!-- Especialistas Activos -->
    <v-card class="mb-4">
      <v-card-title>
        <span class="text-h6">Especialistas Activos</span>
        <v-spacer />
        <v-btn color="primary" @click="openCreateDialog">Agregar</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="activos"
        class="elevation-1"
        item-value="id"
        no-data-text="No hay especialistas activos"
      >
        <template #item.disponibilidades="{ item }">
          <div v-if="item.disponibilidades?.length">
            <div v-for="(h, i) in item.disponibilidades" :key="i">
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

    <!-- Especialistas Inactivos -->
    <v-card class="mb-4">
      <v-card-title>
        <span class="text-h6">Especialistas Inactivos</span>
      </v-card-title>
      <v-data-table
        :headers="headersInactivos"
        :items="inactivos"
        class="elevation-1"
        item-value="id"
        no-data-text="No hay especialistas inactivos"
      >
        <template #item.acciones="{ item }">
          <v-btn icon="mdi-backup-restore" @click="restore(item)" color="success" />
          <v-btn icon="mdi-delete-forever" @click="permanentDelete(item)" color="error" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo Formulario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h6">
            {{ isEditing ? 'Editar Especialista' : 'Agregar Especialista' }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="form.nombreCompleto" label="Nombre" />
          <v-text-field v-model="form.especialidad" label="Especialidad" />
          <v-text-field v-model="form.registroProfesional" label="Registro Profesional" />
          <v-switch v-model="form.activo" label="Activo" />

          <h4 class="mt-4 mb-2">Disponibilidad</h4>
          <div
            v-for="(item, index) in form.disponibilidades"
            :key="index"
            class="d-flex align-center mb-2"
          >
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
          <v-btn class="mt-2" color="secondary" @click="addHorario" prepend-icon="mdi-plus">
            Agregar Horario
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="save">Guardar</v-btn>
          <v-btn @click="closeDialog">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EspecialistaService from '@/services/EspecialistaService'

const dialog = ref(false)
const isEditing = ref(false)
const form = ref({
  nombreCompleto: '',
  especialidad: '',
  registroProfesional: '',
  activo: true,
  disponibilidades: []
})

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'sabado', 'Domingo']

const activos = ref([])
const inactivos = ref([])

const snackbar = ref({ show: false, text: '', color: '' })

const headers = [
  { title: 'Nombre', key: 'nombreCompleto' },
  { title: 'Especialidad', key: 'especialidad' },
  { title: 'Registro', key: 'registroProfesional' },
  { title: 'Disponibilidad', key: 'disponibilidades' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

const headersInactivos = [
  { title: 'Nombre', key: 'nombreCompleto' },
  { title: 'Especialidad', key: 'especialidad' },
  { title: 'Registro', key: 'registroProfesional' },
  { title: 'Acciones', key: 'acciones', sortable: false },
]

function openCreateDialog() {
  resetForm()
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function resetForm() {
  form.value = {
    nombreCompleto: '',
    especialidad: '',
    registroProfesional: '',
    activo: true,
    disponibilidades: []
  }
  isEditing.value = false
}

function addHorario() {
  form.value.disponibilidades.push({ dia: '', horaInicio: '', horaFin: '' })
}

function removeHorario(index) {
  form.value.disponibilidades.splice(index, 1)
}

async function save() {
  // Validar horarios inválidos individuales
  for (const { dia, horaInicio, horaFin } of form.value.disponibilidades) {
    if (!horaInicio || !horaFin) continue // Saltar si está incompleto
    if (horaFin <= horaInicio) {
      snackbar.value = {
        show: true,
        text: `Horario inválido en ${dia}: "${horaInicio} - ${horaFin}". La hora final debe ser mayor a la inicial.`,
        color: 'error'
      }
      return
    }
  }

  // Validar traslapes internos
  const porDia = new Map<string, { inicio: string; fin: string }[]>()

  for (const d of form.value.disponibilidades) {
    if (!porDia.has(d.dia)) {
      porDia.set(d.dia, [])
    }
    porDia.get(d.dia)!.push({ inicio: d.horaInicio, fin: d.horaFin })
  }

  for (const [dia, rangos] of porDia.entries()) {
    rangos.sort((a, b) => a.inicio.localeCompare(b.inicio))

    for (let i = 0; i < rangos.length - 1; i++) {
      const actual = rangos[i]
      const siguiente = rangos[i + 1]

      if (actual.fin > siguiente.inicio) {
        snackbar.value = {
          show: true,
          text: `Traslape detectado en ${dia}: ${actual.inicio}-${actual.fin} con ${siguiente.inicio}-${siguiente.fin}`,
          color: 'error',
        }
        return
      }
    }
  }

  try {
    const payload = {
      nombre_completo: form.value.nombreCompleto,
      especialidad: form.value.especialidad,
      registro_profesional: form.value.registroProfesional,
      activo: form.value.activo,
      disponibilidades: form.value.disponibilidades.map(d => ({
        dia: d.dia,
        hora_inicio: d.horaInicio,
        hora_fin: d.horaFin,
      }))
    }

    if (isEditing.value) {
      await EspecialistaService.actualizarEspecialista(form.value.id, payload)
      snackbar.value = { show: true, text: 'Especialista actualizado', color: 'success' }
    } else {
      await EspecialistaService.crearEspecialista(payload)
      snackbar.value = { show: true, text: 'Especialista creado', color: 'success' }
    }

    cargarEspecialistas()
    dialog.value = false
  } catch (e) {
    snackbar.value = { show: true, text: 'Error al guardar', color: 'error' }
    console.error(e)
  }
}



function edit(item) {
  form.value = JSON.parse(JSON.stringify(item))
  isEditing.value = true
  dialog.value = true
}

function softDelete(item) {
  EspecialistaService.actualizarEspecialista(item.id, { activo: false }).then(cargarEspecialistas)
}

function restore(item) {
  EspecialistaService.actualizarEspecialista(item.id, { activo: true }).then(cargarEspecialistas)
}

function permanentDelete(item) {
  EspecialistaService.eliminarEspecialistaPermanentemente(item.id).then(cargarEspecialistas)
}

async function cargarEspecialistas() {
  const data = await EspecialistaService.obtenerEspecialistas()
  activos.value = data.filter(e => e.activo)
  inactivos.value = data.filter(e => !e.activo)
}

onMounted(cargarEspecialistas)
</script>
