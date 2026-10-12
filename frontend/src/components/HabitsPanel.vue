<script setup lang="ts">
import type { Habit } from '../types'

defineProps<{
  habits: Habit[]
}>()

const emit = defineEmits<{
  toggle: [id: number]
}>()
</script>

<template>
  <article class="panel habits-panel">
    <div class="panel-heading">
      <div>
        <div class="section-kicker">LES PETITES ROUTINES</div>
        <h2>Mes habitudes <span class="heading-emoji">🌱</span></h2>
      </div>
    </div>
    <p class="panel-description">Pas besoin d’être parfaite. Juste régulière, à ta façon.</p>

    <button
      v-for="habit in habits"
      :key="habit.id"
      class="habit-row"
      :class="{ 'habit-done': habit.done }"
      :aria-pressed="habit.done"
      type="button"
      @click="emit('toggle', habit.id)"
    >
      <span class="habit-emoji" aria-hidden="true">{{ habit.emoji }}</span>
      <span class="habit-title">{{ habit.title }}</span>
      <span class="habit-check" aria-hidden="true">{{ habit.done ? '✓' : '+' }}</span>
    </button>

    <div class="habit-quote">
      <span aria-hidden="true">“</span>
      <p>Les petits pas d’aujourd’hui sont les grands changements de demain.</p>
    </div>
  </article>
</template>
