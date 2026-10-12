<script setup lang="ts">
import { useDailyFlowState } from '../composables/useDailyFlow'

const { activePage } = useDailyFlowState()
</script>

<template>
  <header class="topbar">
    <div class="breadcrumb">Mon espace <span aria-hidden="true">/</span> {{ activePage }}</div>
    <div class="topbar-right">
      <span class="today-label">MON ESPACE PERSONNEL</span>
      <div class="avatar small" aria-label="Profil de Mon espace">M</div>
    </div>
  </header>
</template>
