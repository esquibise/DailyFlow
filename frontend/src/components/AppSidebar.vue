<script setup lang="ts">
import { useDailyFlowState } from '../composables/useDailyFlow'

const { activePage, navigationItems, setActivePage, tasks } = useDailyFlowState()
</script>

<template>
  <aside class="sidebar">
    <a class="brand" href="#" @click.prevent="setActivePage('Aujourd’hui')">
      <span class="brand-icon" aria-hidden="true">d</span>
      <span>dailyflow<span class="brand-dot">.</span></span>
    </a>

    <div class="workspace-label">ESPACE PERSONNEL</div>

    <nav class="navigation" aria-label="Navigation principale">
      <button
        v-for="navigationItem in navigationItems"
        :key="navigationItem.label"
        class="nav-item"
        :class="{ active: activePage === navigationItem.label }"
        :aria-current="activePage === navigationItem.label ? 'page' : undefined"
        type="button"
        @click="setActivePage(navigationItem.label)"
      >
        <span class="nav-icon" aria-hidden="true">{{ navigationItem.icon }}</span>
        <span>{{ navigationItem.label }}</span>
        <span v-if="navigationItem.label === 'Mes tâches'" class="nav-count">{{ tasks.length }}</span>
      </button>
    </nav>

    <div class="sidebar-bottom">
      <div class="mini-profile">
        <div class="avatar" aria-hidden="true">M</div>
        <div>
          <strong>Mon espace</strong>
          <span>Mon quotidien, à mon rythme</span>
        </div>
      </div>
      <p class="sidebar-footer">Un jour à la fois. 🌷</p>
    </div>
  </aside>
</template>
