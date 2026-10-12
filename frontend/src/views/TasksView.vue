<script setup lang="ts">
import TasksPanel from '../components/TasksPanel.vue'
import { useDailyFlowState } from '../composables/useDailyFlow'

const dailyFlowState = useDailyFlowState()

const { completedTasks, tasks } = dailyFlowState
</script>

<template>
  <div class="simple-page">
    <section class="welcome">
      <div>
        <div class="eyebrow"><span class="sun-dot" aria-hidden="true"></span> UNE CHOSE À LA FOIS</div>
        <h1>Mes tâches <span aria-hidden="true">✍️</span></h1>
        <p class="welcome-subtitle">Note tes priorités et avance à ton rythme.</p>
      </div>
      <div class="date-card"><strong>{{ completedTasks }} sur {{ tasks.length }} terminées</strong></div>
    </section>
    <TasksPanel
      :tasks="tasks"
      :completed-count="completedTasks"
      @add="dailyFlowState.addTask"
      @remove="dailyFlowState.removeTask"
      @toggle="dailyFlowState.toggleTask"
    />
  </div>
</template>
