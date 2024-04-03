import { createWebHistory, createRouter } from 'vue-router'

import Default from './App.vue'

const routes = [
  {
    path: '',
    name: 'home',
    component: Default
  },
  {
    path: '/about',
    name: 'about',
    component: Default
  }
]

export default new createRouter({
  routes,
  history: createWebHistory(),
})
