<script setup lang="ts">
import HabitsPanel from '../components/HabitsPanel.vue'
import TasksPanel from '../components/TasksPanel.vue'
import { useDailyFlowState } from '../composables/useDailyFlow'

const dailyFlowState = useDailyFlowState()

const {
  completedHabits,
  completedTasks,
  habits,
  taskProgress,
  tasks,
} = dailyFlowState
</script>

<template>
  <div class="dashboard-page">
    <section class="welcome">
      <div>
        <div class="eyebrow"><span class="sun-dot" aria-hidden="true"></span> UN NOUVEAU DÉPART</div>
        <h1>Bonjour, toi. <span aria-hidden="true">✳</span></h1>
        <p class="welcome-subtitle">Chaque petite action compte. Organisons ta journée sereinement.</p>
      </div>
      <div class="date-card">
        <span class="date-icon" aria-hidden="true">☀</span>
        <div>
          <strong>{{ new Date().toLocaleDateString('fr-FR', { weekday: 'long' }) }}</strong>
          <span>{{ new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }}</span>
        </div>
      </div>
    </section>

    <section class="stats-grid" aria-label="Résumé de la journée">
      <article class="stat-card">
        <div class="stat-top"><span>Mes tâches</span><span class="stat-icon lavender" aria-hidden="true">✓</span></div>
        <div class="stat-number">{{ completedTasks }}<span> / {{ tasks.length }}</span></div>
        <div class="stat-caption">Tâches terminées</div>
        <div class="progress-track" role="progressbar" :aria-valuenow="taskProgress" aria-valuemin="0" aria-valuemax="100" aria-label="Progression des tâches"><div class="progress-fill purple-fill" :style="{ width: `${taskProgress}%` }"></div></div>
      </article>

      <article class="stat-card">
        <div class="stat-top"><span>Mes habitudes</span><span class="stat-icon mint" aria-hidden="true">✳</span></div>
        <div class="stat-number">{{ completedHabits }}<span> / {{ habits.length }}</span></div>
        <div class="stat-caption">Petites victoires du jour</div>
        <div class="progress-track" role="progressbar" :aria-valuenow="habits.length ? Math.round(completedHabits / habits.length * 100) : 0" aria-valuemin="0" aria-valuemax="100" aria-label="Progression des habitudes"><div class="progress-fill green-fill" :style="{ width: `${habits.length ? completedHabits / habits.length * 100 : 0}%` }"></div></div>
      </article>

      <article class="stat-card mood-card">
        <div class="stat-top"><span>Mon intention</span><span class="stat-icon peach" aria-hidden="true">♡</span></div>
        <div class="mood-title">Faire de mon mieux.</div>
        <div class="stat-caption">Et c’est déjà très bien.</div>
        <div class="mood-decoration" aria-hidden="true">✿</div>
      </article>
    </section>

    <section class="content-grid">
      <TasksPanel
        :tasks="tasks"
        :completed-count="completedTasks"
        @add="dailyFlowState.addTask"
        @remove="dailyFlowState.removeTask"
        @toggle="dailyFlowState.toggleTask"
      />
      <HabitsPanel :habits="habits" @toggle="dailyFlowState.toggleHabit" />
    </section>

    <section class="bottom-grid" aria-label="Autres espaces">
      <button class="feature-card budget-card" type="button" @click="dailyFlowState.setActivePage('Mon budget')">
        <span class="feature-icon" aria-hidden="true">€</span>
        <span class="feature-text">
          <span class="section-kicker">GARDER LE CAP</span>
          <strong>Mon budget</strong>
          <span>Garde un œil sur tes dépenses et tes projets.</span>
        </span>
        <span class="feature-arrow" aria-hidden="true">↗</span>
      </button>
      <button class="feature-card meals-card" type="button" @click="dailyFlowState.setActivePage('Mes repas')">
        <span class="feature-icon" aria-hidden="true">🍋</span>
        <span class="feature-text">
          <span class="section-kicker">SIMPLE ET BON</span>
          <strong>Mes repas</strong>
          <span>Planifie tes repas sans te compliquer la vie.</span>
        </span>
        <span class="feature-arrow" aria-hidden="true">↗</span>
      </button>
    </section>
  </div>
</template>
