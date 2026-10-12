<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '../types'

defineProps<{
  tasks: Task[]
  completedCount: number
}>()

const emit = defineEmits<{
  add: [title: string, time: string]
  remove: [id: number]
  toggle: [id: number]
}>()

const newTaskTitle = ref('')
const newTaskTime = ref('12:00')

function submitTask(): void {
  emit('add', newTaskTitle.value, newTaskTime.value)
  newTaskTitle.value = ''
}
</script>

<template>
  <article class="panel tasks-panel">
    <div class="panel-heading">
      <div>
        <div class="section-kicker">ON AVANCE EN DOUCEUR</div>
        <h2>Les tâches du jour <span class="heading-emoji">✍️</span></h2>
      </div>
      <span class="soft-count">{{ completedCount }}/{{ tasks.length }}</span>
    </div>

    <form class="add-task-form" @submit.prevent="submitTask">
      <input v-model="newTaskTitle" aria-label="Nouvelle tâche" placeholder="Ajouter une tâche…" required />
      <input v-model="newTaskTime" aria-label="Heure de la tâche" type="time" />
      <button type="submit" class="add-button" aria-label="Ajouter la tâche">+</button>
    </form>

    <ul v-if="tasks.length" class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-row" :class="{ completed: task.done }">
        <button
          class="task-check"
          :class="{ checked: task.done }"
          :aria-label="task.done ? 'Marquer comme non terminée' : 'Terminer la tâche'"
          :aria-pressed="task.done"
          type="button"
          @click="emit('toggle', task.id)"
        >{{ task.done ? '✓' : '' }}</button>
        <div class="task-info">
          <span class="task-title">{{ task.title }}</span>
          <span class="task-category">{{ task.category }}</span>
        </div>
        <span class="task-time">{{ task.time }}</span>
        <button class="delete-task" type="button" :aria-label="`Supprimer la tâche ${task.title}`" @click="emit('remove', task.id)">×</button>
      </li>
    </ul>
    <div v-else class="empty-state">Aucune tâche pour le moment. Profite de ce moment. 🌼</div>
    <div class="panel-bottom"><span aria-hidden="true">🌷</span> Avance à ton rythme, c’est suffisant.</div>
  </article>
</template>
