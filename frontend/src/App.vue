<script setup lang="ts">
import { provideDailyFlowState } from './composables/useDailyFlow'
import AppSidebar from './components/AppSidebar.vue'
import PageHeader from './components/PageHeader.vue'
import BudgetView from './views/BudgetView.vue'
import DashboardView from './views/DashboardView.vue'
import HabitsView from './views/HabitsView.vue'
import MealsView from './views/MealsView.vue'
import TasksView from './views/TasksView.vue'

const { activePage } = provideDailyFlowState()
</script>

<template>
  <div class="app-shell">
    <AppSidebar />

    <main class="main-content">
      <PageHeader />

      <div class="page-content">
        <DashboardView v-if="activePage === 'Aujourd’hui'" />
        <TasksView v-else-if="activePage === 'Mes tâches'" />
        <HabitsView v-else-if="activePage === 'Mes habitudes'" />
        <BudgetView v-else-if="activePage === 'Mon budget'" />
        <MealsView v-else />

        <footer class="page-footer">
          <span>Fait avec douceur <span class="heart" aria-hidden="true">♥</span></span>
          <span>DAILYFLOW · PRENDRE SOIN DE SON QUOTIDIEN</span>
        </footer>
      </div>
    </main>
  </div>
</template>
