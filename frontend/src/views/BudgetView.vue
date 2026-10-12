<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDailyFlowState } from '../composables/useDailyFlow'

const dailyFlowState = useDailyFlowState()

const {
  budgetCategories,
  budgetProgress,
  categorySpending,
  expenses,
  formatDate,
  formatEuro,
  monthlyBudget,
  remainingBudget,
  totalSpent,
} = dailyFlowState

const expenseTitle = ref('')
const expenseCategory = ref('Alimentation')
const expenseAmount = ref<number | null>(null)
const newCategoryName = ref('')
const categoryError = ref('')
const budgetUsagePercentage = computed(() => Math.round(totalSpent.value / (monthlyBudget.value || 1) * 100))

function addBudgetExpense(): void {
  const amountInEuros = Number(expenseAmount.value)
  if (!expenseTitle.value.trim() || !Number.isFinite(amountInEuros) || amountInEuros <= 0) return

  dailyFlowState.addExpense(expenseTitle.value, expenseCategory.value, amountInEuros)
  expenseTitle.value = ''
  expenseAmount.value = null
}

function addBudgetCategory(): void {
  const categoryName = newCategoryName.value.trim()
  if (!dailyFlowState.addBudgetCategory(categoryName)) {
    categoryError.value = 'Cette catégorie est vide ou existe déjà.'
    return
  }

  expenseCategory.value = categoryName
  newCategoryName.value = ''
  categoryError.value = ''
}

function categoryColorClass(category: string): string {
  const index = budgetCategories.value.indexOf(category)
  return `category-color-${index < 0 ? 0 : index % 5}`
}

function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Alimentation: '🥑',
    Logement: '🏠',
    Transport: '🚲',
    Loisirs: '🎨',
  }
  return icons[category] ?? '✦'
}
</script>

<template>
  <div class="budget-page">
    <section class="welcome budget-welcome">
      <div>
        <div class="eyebrow"><span class="sun-dot" aria-hidden="true"></span> GARDER LE CAP, SANS PRESSION</div>
        <h1>Mon budget <span aria-hidden="true">€</span></h1>
        <p class="welcome-subtitle">Un aperçu clair de tes dépenses pour le mois, à ton rythme.</p>
      </div>
      <div class="budget-month-card">
        <span>CE MOIS-CI</span>
        <strong>{{ new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }}</strong>
      </div>
    </section>

    <section class="budget-summary-grid" aria-label="Résumé du budget">
      <article class="budget-summary-card budget-limit-card">
        <div class="budget-summary-label"><span>Budget mensuel</span><span class="budget-summary-icon" aria-hidden="true">◎</span></div>
        <label class="budget-limit-input">
          <input v-model.number="monthlyBudget" aria-label="Budget mensuel en euros" type="number" min="1" step="50" />
          <span aria-hidden="true">€</span>
        </label>
        <div class="budget-summary-hint">Ton objectif pour le mois</div>
      </article>
      <article class="budget-summary-card">
        <div class="budget-summary-label"><span>Déjà dépensé</span><span class="budget-summary-icon spent-icon" aria-hidden="true">↗</span></div>
        <div class="budget-summary-amount">{{ formatEuro(totalSpent) }}</div>
        <div class="budget-summary-hint">{{ expenses.length }} dépenses enregistrées</div>
      </article>
      <article class="budget-summary-card" :class="{ 'over-budget': remainingBudget < 0 }">
        <div class="budget-summary-label"><span>Il te reste</span><span class="budget-summary-icon remaining-icon" aria-hidden="true">♡</span></div>
        <div class="budget-summary-amount">{{ formatEuro(remainingBudget) }}</div>
        <div class="budget-summary-hint">{{ remainingBudget < 0 ? 'Au-delà de ton objectif mensuel' : 'Tu avances à ton rythme' }}</div>
      </article>
    </section>

    <section class="budget-progress-panel panel">
      <div class="panel-heading">
        <div>
          <div class="section-kicker">TON RYTHME DU MOIS</div>
          <h2>Où en es-tu ? <span class="heading-emoji">🌿</span></h2>
        </div>
        <span class="soft-count">{{ budgetUsagePercentage }} % utilisé</span>
      </div>
      <div class="budget-progress-track" role="progressbar" :aria-valuenow="Math.round(budgetProgress)" aria-valuemin="0" aria-valuemax="100" aria-label="Part du budget dépensée">
        <div class="budget-progress-fill" :class="{ 'budget-progress-warning': totalSpent > monthlyBudget }" :style="{ width: `${budgetProgress}%` }"></div>
      </div>
      <div class="budget-progress-caption"><span>{{ formatEuro(totalSpent) }} dépensés</span><span>Objectif : {{ formatEuro(monthlyBudget || 0) }}</span></div>
    </section>

    <section class="budget-details-grid">
      <article class="budget-categories panel">
        <div class="panel-heading">
          <div>
            <div class="section-kicker">EN UN COUP D’ŒIL</div>
            <h2>Par catégorie</h2>
          </div>
        </div>
        <div class="category-list">
          <div v-for="category in categorySpending" :key="category.name" class="category-row">
            <div class="category-row-heading"><span><i class="category-dot" :class="categoryColorClass(category.name)"></i>{{ category.name }}</span><strong>{{ formatEuro(category.total) }}</strong></div>
            <div class="category-track"><div class="category-fill" :class="categoryColorClass(category.name)" :style="{ width: `${totalSpent ? category.total / totalSpent * 100 : 0}%` }"></div></div>
          </div>
        </div>
        <form class="add-category-form" @submit.prevent="addBudgetCategory">
          <label class="sr-only" for="new-budget-category">Nouvelle catégorie</label>
          <input id="new-budget-category" v-model="newCategoryName" aria-describedby="category-feedback" placeholder="Nouvelle catégorie…" required />
          <button type="submit" aria-label="Ajouter la catégorie">+</button>
        </form>
        <p v-if="categoryError" id="category-feedback" class="form-error" role="alert">{{ categoryError }}</p>
      </article>

      <article class="budget-add-panel panel">
        <div class="panel-heading">
          <div>
            <div class="section-kicker">GARDER UNE TRACE</div>
            <h2>Ajouter une dépense <span class="heading-emoji">✍️</span></h2>
          </div>
        </div>
        <form class="expense-form" @submit.prevent="addBudgetExpense">
          <label>
            <span>Nom de la dépense</span>
            <input v-model="expenseTitle" aria-label="Nom de la dépense" placeholder="Ex. Courses alimentaires" required />
          </label>
          <div class="expense-fields-row">
            <label>
              <span>Catégorie</span>
              <select v-model="expenseCategory" aria-label="Catégorie de la dépense">
                <option v-for="category in budgetCategories" :key="category" :value="category">{{ category }}</option>
              </select>
            </label>
            <label>
              <span>Montant (€)</span>
              <input v-model.number="expenseAmount" aria-label="Montant en euros" type="number" min="0.01" step="0.01" placeholder="0,00" required />
            </label>
          </div>
          <button class="add-expense-button" type="submit">Enregistrer la dépense <span aria-hidden="true">+</span></button>
        </form>
      </article>
    </section>

    <section class="expense-history panel">
      <div class="panel-heading">
        <div>
          <div class="section-kicker">TES DERNIERS MOUVEMENTS</div>
          <h2>Historique des dépenses</h2>
        </div>
        <span class="soft-count">{{ expenses.length }} au total</span>
      </div>
      <ul v-if="expenses.length" class="expense-list">
        <li v-for="expense in expenses" :key="expense.id" class="expense-row">
          <span class="expense-category-icon" :class="categoryColorClass(expense.category)" aria-hidden="true">{{ categoryIcon(expense.category) }}</span>
          <span class="expense-description"><strong>{{ expense.title }}</strong><span>{{ expense.category }} · {{ formatDate(expense.date) }}</span></span>
          <strong class="expense-amount">− {{ formatEuro(expense.amount) }}</strong>
          <button class="expense-delete" type="button" :aria-label="`Supprimer ${expense.title}`" @click="dailyFlowState.removeExpense(expense.id)">×</button>
        </li>
      </ul>
      <p v-else class="grocery-empty">Aucune dépense pour le moment. Tu peux en ajouter juste au-dessus.</p>
    </section>
  </div>
</template>
