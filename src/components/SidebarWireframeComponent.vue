<template>
<v-navigation-drawer
  expand-on-hover
  rail
  app
  color="green lighten-1"
>


    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Dashboard"
        to="/dashboard"
        exact
        link
      />
      <v-list-item
        prepend-icon="mdi-clipboard-list"
        title="especialistas"
        to="/especialistas"
        exact
        link
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts"></script>
