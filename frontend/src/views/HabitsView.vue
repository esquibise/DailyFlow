<script setup lang="ts">
import HabitsPanel from '../components/HabitsPanel.vue'
import { useDailyFlowState } from '../composables/useDailyFlow'

const dailyFlowState = useDailyFlowState()

const { completedHabits, habits } = dailyFlowState
</script>

<template>
  <div class="simple-page">
    <section class="welcome">
      <div>
        <div class="eyebrow"><span class="sun-dot" aria-hidden="true"></span> LES PETITES ROUTINES</div>
        <h1>Mes habitudes <span aria-hidden="true">🌱</span></h1>
        <p class="welcome-subtitle">Les petits pas comptent. Coche tes habitudes du jour.</p>
      </div>
      <div class="date-card"><strong>{{ completedHabits }} sur {{ habits.length }} accomplies</strong></div>
    </section>
    <HabitsPanel :habits="habits" @toggle="dailyFlowState.toggleHabit" />
  </div>
</template>
