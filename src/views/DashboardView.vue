<template>
  <v-container class="py-6" style="background: #e3f2fd;">
    <!-- Encabezado -->
    <v-row justify="center">
      <v-col cols="12" md="8" class="text-center">
        <h1 class="text-h4 font-weight-bold" style="color: #1565c0;">
          Bienvenido al Panel de Salud
        </h1>
        <p class="text-subtitle-1" style="color: #1e88e5;">
          Administra tus pacientes, citas y personal médico desde aquí.
        </p>
      </v-col>
    </v-row>

    <!-- Tarjetas dinámicas -->
    <v-row class="mt-6 g-4" justify="center" align="stretch">
      <v-col cols="12" md="6" lg="3" v-for="card in dashboardCards" :key="card.title">
        <v-card
          class="dashboard-card pa-6 d-flex flex-column align-center justify-center text-center"
          elevation="10"
          rounded="xl"
          style="background: #e8f5e9;"
        >
          <v-icon :icon="card.icon" size="44" color="#2e7d32" class="mb-3 bounce-icon" />
          <h3 class="text-subtitle-1 font-weight-bold mb-1" style="color: #1b5e20;">{{ card.title }}</h3>

          <div class="mt-2">
            <v-progress-circular
              v-if="card.percentage !== undefined"
              :model-value="card.percentage"
              size="70"
              width="7"
              color="#43a047"
            >
              {{ card.percentage }}%
            </v-progress-circular>
            <p v-else class="text-subtitle-2 font-weight-medium mt-2" style="color: #388e3c;">
              {{ card.value }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de citas recientes -->
    <v-row class="mt-10">
      <v-col cols="12">
        <v-card elevation="8" class="pa-6" style="border-radius: 12px;">
          <v-card-title class="text-h6 font-weight-bold d-flex align-center" style="color: #2e7d32;">
            <v-icon icon="mdi-calendar-clock" class="me-2" color="#388e3c" />
            Citas recientes
          </v-card-title>

          <v-data-table
            :items="citas"
            :headers="headers"
            class="mt-4"
            dense
            height="320"
          >
            <template #bottom>
              <v-btn variant="text" color="#2e7d32" class="mt-2">
                Ver más citas
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dashboardCards = ref([
  { title: 'Pacientes Hoy', value: '35', icon: 'mdi-account-multiple' },
  { title: 'Citas Confirmadas', value: '12', icon: 'mdi-calendar-check' },
  { title: 'Ocupación Consultorios', percentage: 70, icon: 'mdi-hospital-building' },
  { title: 'Personal Médico Activo', value: '8', icon: 'mdi-stethoscope' },
])

let intervalDashboard: ReturnType<typeof setInterval>

onMounted(() => {
  intervalDashboard = setInterval(() => {
    dashboardCards.value[2].percentage = Math.floor(Math.random() * 100)
    dashboardCards.value[1].value = Math.floor(Math.random() * 30).toString()
  }, 10000)
})

onBeforeUnmount(() => {
  clearInterval(intervalDashboard)
})

// Citas recientes simuladas
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Paciente', key: 'paciente' },
  { title: 'Consultorio', key: 'consultorio' },
  { title: 'Médico', key: 'medico' },
  { title: 'Hora', key: 'hora' },
  { title: 'Estado', key: 'estado' },
]

const citas = [
  { id: 201, paciente: 'Ana Ruiz', consultorio: '101', medico: 'Dr. López', hora: '09:30', estado: 'Confirmada' },
  { id: 202, paciente: 'Luis Gómez', consultorio: '105', medico: 'Dra. Pérez', hora: '10:15', estado: 'Pendiente' },
  { id: 203, paciente: 'Carlos M.', consultorio: '103', medico: 'Dr. Martínez', hora: '11:00', estado: 'Cancelada' },
  { id: 204, paciente: 'María P.', consultorio: '102', medico: 'Dra. Ramírez', hora: '11:30', estado: 'Confirmada' },
]
</script>

<style scoped>
.dashboard-card {
  min-height: 240px;
  transition: transform 0.3s ease;
  border-radius: 20px;
  cursor: default;
}
.dashboard-card:hover {
  transform: scale(1.05);
}

.bounce-icon {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
}

h1, h3, p {
  user-select: none;
}
</style>
