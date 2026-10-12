<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDailyFlowState } from '../composables/useDailyFlow'

const dailyFlowState = useDailyFlowState()

const { groceries, mealDays, mealSlots, meals, remainingGroceries } = dailyFlowState
const selectedDayOfWeek = ref('Lundi')
const newMealTitle = ref('')
const newMealSlot = ref('Déjeuner')
const newGroceryItemName = ref('')
const mealsForSelectedDay = computed(() => dailyFlowState.getMealsForDay(selectedDayOfWeek.value))

function addPlannedMeal(): void {
  dailyFlowState.addMeal(selectedDayOfWeek.value, newMealSlot.value, newMealTitle.value)
  newMealTitle.value = ''
}

function addShoppingListItem(): void {
  dailyFlowState.addGrocery(newGroceryItemName.value)
  newGroceryItemName.value = ''
}
</script>

<template>
  <div class="meals-page">
    <section class="welcome meals-welcome">
      <div>
        <div class="eyebrow"><span class="sun-dot" aria-hidden="true"></span> SIMPLE ET BON</div>
        <h1>Mes repas <span aria-hidden="true">🍋</span></h1>
        <p class="welcome-subtitle">Une petite idée à la fois : prépare ta semaine à ton rythme.</p>
      </div>
      <div class="meal-note"><span aria-hidden="true">✦</span> Pas besoin que tout soit parfait, juste pratique pour toi.</div>
    </section>

    <section class="meal-planner panel">
      <div class="panel-heading">
        <div>
          <div class="section-kicker">TON ORGANISATION TOUTE DOUCE</div>
          <h2>Le menu de la semaine <span class="heading-emoji">🥗</span></h2>
        </div>
        <span class="soft-count">{{ meals.length }} idées</span>
      </div>

      <div class="meal-day-tabs" role="group" aria-label="Choisir un jour">
        <button
          v-for="day in mealDays"
          :key="day"
          class="meal-day-tab"
          :class="{ selected: selectedDayOfWeek === day }"
          :aria-pressed="selectedDayOfWeek === day"
          type="button"
          @click="selectedDayOfWeek = day"
        >{{ day }}</button>
      </div>

      <div class="meal-slots">
        <section v-for="slot in mealSlots" :key="slot" class="meal-slot">
          <div class="meal-slot-icon" aria-hidden="true">{{ slot === 'Petit-déjeuner' ? '☕' : slot === 'Déjeuner' ? '☀️' : '🌙' }}</div>
          <div class="meal-slot-content">
            <h3>{{ slot }}</h3>
            <ul v-if="mealsForSelectedDay.some(meal => meal.slot === slot)" class="meal-items">
              <li v-for="meal in mealsForSelectedDay.filter(plannedMeal => plannedMeal.slot === slot)" :key="meal.id" class="meal-item">
                <span>{{ meal.title }}</span>
                <button type="button" :aria-label="`Supprimer ${meal.title}`" @click="dailyFlowState.removeMeal(meal.id)">×</button>
              </li>
            </ul>
            <p v-else class="meal-empty">Rien de prévu pour le moment</p>
          </div>
        </section>
      </div>

      <form class="add-meal-form" @submit.prevent="addPlannedMeal">
        <label class="meal-input-label">
          <span>Ajouter une idée pour {{ selectedDayOfWeek.toLowerCase() }}</span>
          <input v-model="newMealTitle" aria-label="Nom du repas" placeholder="Ex. Curry de légumes et riz" required />
        </label>
        <label class="meal-select-label">
          <span>Moment</span>
          <select v-model="newMealSlot" aria-label="Moment du repas">
            <option v-for="slot in mealSlots" :key="slot" :value="slot">{{ slot }}</option>
          </select>
        </label>
        <button class="add-meal-button" type="submit">Ajouter le repas <span aria-hidden="true">+</span></button>
      </form>
    </section>

    <section class="meal-tip-card">
      <span class="meal-tip-icon" aria-hidden="true">🌿</span>
      <div><strong>Un petit conseil</strong><p>Prévoir quelques repas à l’avance peut aider à faire les courses plus sereinement.</p></div>
    </section>

    <section class="grocery-list panel">
      <div class="panel-heading">
        <div>
          <div class="section-kicker">POUR NE RIEN OUBLIER</div>
          <h2>Ma liste de courses <span class="heading-emoji">🛒</span></h2>
        </div>
        <span class="soft-count">{{ remainingGroceries }} à acheter</span>
      </div>

      <form class="add-grocery-form" @submit.prevent="addShoppingListItem">
        <input v-model="newGroceryItemName" aria-label="Article à ajouter" placeholder="Ajouter un article…" required />
        <button class="add-button" type="submit" aria-label="Ajouter à la liste de courses">+</button>
      </form>

      <ul v-if="groceries.length" class="grocery-items">
        <li v-for="item in groceries" :key="item.id" class="grocery-item" :class="{ 'grocery-checked': item.checked }">
          <label>
            <input v-model="item.checked" type="checkbox" />
            <span>{{ item.name }}</span>
          </label>
          <button type="button" :aria-label="`Supprimer ${item.name}`" @click="dailyFlowState.removeGrocery(item.id)">×</button>
        </li>
      </ul>
      <p v-else class="grocery-empty">Ta liste est vide. Ajoute les ingrédients dont tu as besoin.</p>
      <p class="grocery-footer">Ta liste est enregistrée automatiquement sur cet appareil.</p>
    </section>
  </div>
</template>
