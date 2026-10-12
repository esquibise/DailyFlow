export type AppPage = 'Aujourd’hui' | 'Mes tâches' | 'Mes habitudes' | 'Mon budget' | 'Mes repas'

export interface Task {
  id: number
  title: string
  time: string
  category: string
  done: boolean
}

export interface Habit {
  id: number
  title: string
  emoji: string
  done: boolean
}

export interface Meal {
  id: number
  day: string
  slot: string
  title: string
}

export interface GroceryItem {
  id: number
  name: string
  checked: boolean
}

export interface BudgetExpense {
  id: number
  title: string
  category: string
  amount: number
  date: string
}
