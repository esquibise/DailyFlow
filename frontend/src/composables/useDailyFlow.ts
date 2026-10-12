import { computed, inject, onMounted, provide, ref, watch, type InjectionKey } from 'vue'
import type { AppPage, BudgetExpense, GroceryItem, Habit, Meal, Task } from '../types'

const mealDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const mealSlots = ['Petit-déjeuner', 'Déjeuner', 'Dîner']
const defaultBudgetCategories = ['Alimentation', 'Logement', 'Transport', 'Loisirs', 'Autre']

const defaultTasks: Task[] = [
  { id: 1, title: 'Préparer les priorités de la journée', time: '09:00', category: 'Personnel', done: true },
  { id: 2, title: 'Avancer sur le projet DailyFlow', time: '11:00', category: 'Projet', done: false },
  { id: 3, title: 'Préparer les repas de la semaine', time: '18:00', category: 'Maison', done: false },
  { id: 4, title: 'Prendre un moment pour soi', time: '20:30', category: 'Bien-être', done: false },
]

const defaultHabits: Habit[] = [
  { id: 1, title: 'Boire suffisamment', emoji: '💧', done: false },
  { id: 2, title: 'Bouger un peu', emoji: '🌿', done: true },
  { id: 3, title: 'Lire 10 minutes', emoji: '📖', done: false },
  { id: 4, title: 'Préparer demain', emoji: '✨', done: false },
]

const defaultMeals: Meal[] = [
  { id: 1, day: 'Lundi', slot: 'Petit-déjeuner', title: 'Porridge aux fruits rouges' },
  { id: 2, day: 'Lundi', slot: 'Déjeuner', title: 'Salade de quinoa et légumes rôtis' },
  { id: 3, day: 'Lundi', slot: 'Dîner', title: 'Soupe de saison et tartines' },
  { id: 4, day: 'Mardi', slot: 'Déjeuner', title: 'Wraps avocat et houmous' },
  { id: 5, day: 'Mercredi', slot: 'Dîner', title: 'Pâtes aux champignons' },
]

const defaultGroceries: GroceryItem[] = [
  { id: 1, name: 'Fruits de saison', checked: false },
  { id: 2, name: 'Légumes pour la soupe', checked: false },
  { id: 3, name: 'Yaourts nature', checked: true },
]

const defaultExpenses: BudgetExpense[] = [
  { id: 1, title: 'Courses de la semaine', category: 'Alimentation', amount: 68.4, date: '2026-10-10' },
  { id: 2, title: 'Abonnement transport', category: 'Transport', amount: 42, date: '2026-10-08' },
  { id: 3, title: 'Facture internet', category: 'Logement', amount: 29.99, date: '2026-10-05' },
  { id: 4, title: 'Sortie cinéma', category: 'Loisirs', amount: 24, date: '2026-10-03' },
]

const navigationItems: Array<{ label: AppPage; icon: string }> = [
  { label: 'Aujourd’hui', icon: '☀️' },
  { label: 'Mes tâches', icon: '✓' },
  { label: 'Mes habitudes', icon: '🌱' },
  { label: 'Mon budget', icon: '€' },
  { label: 'Mes repas', icon: '🍋' },
]

function readLocalStorage(storageKey: string): unknown {
  try {
    const serializedValue = localStorage.getItem(storageKey)
    return serializedValue ? JSON.parse(serializedValue) : null
  } catch {
    return null
  }
}

function saveLocalStorage(storageKey: string, data: unknown): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {
    // Local storage can be unavailable or full; the app remains usable in memory.
  }
}

function isObjectRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null
}

function isValidTask(candidate: unknown): candidate is Task {
  return isObjectRecord(candidate)
    && typeof candidate.id === 'number'
    && typeof candidate.title === 'string'
    && typeof candidate.time === 'string'
    && typeof candidate.category === 'string'
    && typeof candidate.done === 'boolean'
}

function isValidHabit(candidate: unknown): candidate is Habit {
  return isObjectRecord(candidate)
    && typeof candidate.id === 'number'
    && typeof candidate.title === 'string'
    && typeof candidate.emoji === 'string'
    && typeof candidate.done === 'boolean'
}

function isValidMeal(candidate: unknown): candidate is Meal {
  return isObjectRecord(candidate)
    && typeof candidate.id === 'number'
    && typeof candidate.day === 'string'
    && typeof candidate.slot === 'string'
    && typeof candidate.title === 'string'
}

function isValidGroceryItem(candidate: unknown): candidate is GroceryItem {
  return isObjectRecord(candidate)
    && typeof candidate.id === 'number'
    && typeof candidate.name === 'string'
    && typeof candidate.checked === 'boolean'
}

function isValidBudgetExpense(candidate: unknown): candidate is BudgetExpense {
  return isObjectRecord(candidate)
    && typeof candidate.id === 'number'
    && typeof candidate.title === 'string'
    && typeof candidate.category === 'string'
    && typeof candidate.amount === 'number'
    && Number.isFinite(candidate.amount)
    && typeof candidate.date === 'string'
}

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createDailyFlowState() {
  const activePage = ref<AppPage>('Aujourd’hui')
  const tasks = ref<Task[]>(structuredClone(defaultTasks))
  const habits = ref<Habit[]>(structuredClone(defaultHabits))
  const meals = ref<Meal[]>(structuredClone(defaultMeals))
  const groceries = ref<GroceryItem[]>(structuredClone(defaultGroceries))
  const budgetCategories = ref([...defaultBudgetCategories])
  const monthlyBudget = ref(2400)
  const expenses = ref<BudgetExpense[]>(structuredClone(defaultExpenses))

  const completedTasks = computed(() => tasks.value.filter(task => task.done).length)
  const taskProgress = computed(() => tasks.value.length
    ? Math.round((completedTasks.value / tasks.value.length) * 100)
    : 0,
  )
  const completedHabits = computed(() => habits.value.filter(habit => habit.done).length)
  const remainingGroceries = computed(() => groceries.value.filter(item => !item.checked).length)
  const totalSpent = computed(() => expenses.value.reduce((runningTotal, expense) => runningTotal + expense.amount, 0))
  const remainingBudget = computed(() => monthlyBudget.value - totalSpent.value)
  const budgetProgress = computed(() => monthlyBudget.value > 0
    ? Math.min((totalSpent.value / monthlyBudget.value) * 100, 100)
    : 0,
  )
  const categorySpending = computed(() => budgetCategories.value.map(categoryName => ({
    name: categoryName,
    total: expenses.value
      .filter(expense => expense.category === categoryName)
      .reduce((runningTotal, expense) => runningTotal + expense.amount, 0),
  })))
  const getMealsForDay = (dayOfWeek: string) => meals.value.filter(meal => meal.day === dayOfWeek)

  function setActivePage(pageToOpen: AppPage): void {
    activePage.value = pageToOpen
  }

  function loadSavedData(): void {
    const savedTasks = readLocalStorage('dailyflow-tasks')
    if (Array.isArray(savedTasks) && savedTasks.every(isValidTask)) tasks.value = savedTasks

    const savedHabits = readLocalStorage('dailyflow-habits')
    if (Array.isArray(savedHabits) && savedHabits.every(isValidHabit)) habits.value = savedHabits

    const savedMeals = readLocalStorage('dailyflow-meals')
    if (Array.isArray(savedMeals) && savedMeals.every(isValidMeal)) meals.value = savedMeals

    const savedGroceries = readLocalStorage('dailyflow-grocery-list')
    if (Array.isArray(savedGroceries) && savedGroceries.every(isValidGroceryItem)) groceries.value = savedGroceries

    const savedBudget = readLocalStorage('dailyflow-budget')
    if (!isObjectRecord(savedBudget)) return

    if (typeof savedBudget.monthlyBudget === 'number' && Number.isFinite(savedBudget.monthlyBudget) && savedBudget.monthlyBudget > 0) {
      monthlyBudget.value = savedBudget.monthlyBudget
    }
    if (Array.isArray(savedBudget.expenses) && savedBudget.expenses.every(isValidBudgetExpense)) {
      expenses.value = savedBudget.expenses
    }
    if (Array.isArray(savedBudget.categories) && savedBudget.categories.every((category): category is string => typeof category === 'string' && category.trim().length > 0)) {
      budgetCategories.value = [...new Set(savedBudget.categories)]
    }
  }

  onMounted(loadSavedData)

  watch(tasks, updatedTasks => saveLocalStorage('dailyflow-tasks', updatedTasks), { deep: true })
  watch(habits, updatedHabits => saveLocalStorage('dailyflow-habits', updatedHabits), { deep: true })
  watch(meals, updatedMeals => saveLocalStorage('dailyflow-meals', updatedMeals), { deep: true })
  watch(groceries, updatedGroceries => saveLocalStorage('dailyflow-grocery-list', updatedGroceries), { deep: true })
  watch([monthlyBudget, expenses, budgetCategories], ([updatedMonthlyBudget, updatedExpenses, updatedCategories]) => {
    saveLocalStorage('dailyflow-budget', {
      monthlyBudget: updatedMonthlyBudget,
      expenses: updatedExpenses,
      categories: updatedCategories,
    })
  }, { deep: true })

  function addTask(title: string, time: string): void {
    const normalizedTitle = title.trim()
    if (!normalizedTitle) return

    tasks.value.push({
      id: Date.now(),
      title: normalizedTitle,
      time: time || '12:00',
      category: 'Personnel',
      done: false,
    })
  }

  function removeTask(taskId: number): void {
    tasks.value = tasks.value.filter(task => task.id !== taskId)
  }

  function toggleTask(taskId: number): void {
    const task = tasks.value.find(candidateTask => candidateTask.id === taskId)
    if (task) task.done = !task.done
  }

  function toggleHabit(habitId: number): void {
    const habit = habits.value.find(candidateHabit => candidateHabit.id === habitId)
    if (habit) habit.done = !habit.done
  }

  function addMeal(dayOfWeek: string, mealSlot: string, mealTitle: string): void {
    const normalizedTitle = mealTitle.trim()
    if (!mealDays.includes(dayOfWeek) || !mealSlots.includes(mealSlot) || !normalizedTitle) return

    meals.value.push({ id: Date.now(), day: dayOfWeek, slot: mealSlot, title: normalizedTitle })
  }

  function removeMeal(mealId: number): void {
    meals.value = meals.value.filter(meal => meal.id !== mealId)
  }

  function addGrocery(itemName: string): void {
    const normalizedName = itemName.trim()
    if (!normalizedName) return

    groceries.value.push({ id: Date.now(), name: normalizedName, checked: false })
  }

  function removeGrocery(groceryItemId: number): void {
    groceries.value = groceries.value.filter(groceryItem => groceryItem.id !== groceryItemId)
  }

  function addExpense(expenseTitle: string, categoryName: string, amountInEuros: number): void {
    const normalizedTitle = expenseTitle.trim()
    if (!normalizedTitle || !budgetCategories.value.includes(categoryName) || !Number.isFinite(amountInEuros) || amountInEuros <= 0) return

    expenses.value.unshift({
      id: Date.now(),
      title: normalizedTitle,
      category: categoryName,
      amount: Math.round(amountInEuros * 100) / 100,
      date: getLocalDateString(),
    })
  }

  function removeExpense(expenseId: number): void {
    expenses.value = expenses.value.filter(expense => expense.id !== expenseId)
  }

  function addBudgetCategory(categoryName: string): boolean {
    const normalizedName = categoryName.trim()
    const exists = budgetCategories.value.some(category => category.toLocaleLowerCase('fr') === normalizedName.toLocaleLowerCase('fr'))
    if (!normalizedName || exists) return false

    budgetCategories.value.push(normalizedName)
    return true
  }

  function formatEuro(amountInEuros: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amountInEuros)
  }

  function formatDate(dateString: string): string {
    const parsedDate = new Date(`${dateString}T00:00:00`)
    return Number.isNaN(parsedDate.getTime())
      ? dateString
      : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(parsedDate)
  }

  return {
    activePage,
    budgetCategories,
    budgetProgress,
    categorySpending,
    completedHabits,
    completedTasks,
    expenses,
    formatDate,
    formatEuro,
    groceries,
    habits,
    mealDays,
    mealSlots,
    meals,
    monthlyBudget,
    navigationItems,
    remainingBudget,
    remainingGroceries,
    getMealsForDay,
    setActivePage,
    taskProgress,
    tasks,
    totalSpent,
    addBudgetCategory,
    addExpense,
    addGrocery,
    addMeal,
    addTask,
    removeExpense,
    removeGrocery,
    removeMeal,
    removeTask,
    toggleHabit,
    toggleTask,
  }
}

export type DailyFlowState = ReturnType<typeof createDailyFlowState>

const dailyFlowStateKey: InjectionKey<DailyFlowState> = Symbol('DailyFlowState')

export function provideDailyFlowState(): DailyFlowState {
  const dailyFlowState = createDailyFlowState()
  provide(dailyFlowStateKey, dailyFlowState)
  return dailyFlowState
}

export function useDailyFlowState(): DailyFlowState {
  const dailyFlowState = inject(dailyFlowStateKey)
  if (!dailyFlowState) {
    throw new Error('DailyFlow state is unavailable. Call provideDailyFlowState() in a parent component first.')
  }
  return dailyFlowState
}
