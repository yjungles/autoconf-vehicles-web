import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/vehicles',
    },
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/auth/views/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/views/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'vehicles',
          name: 'vehicles-list',
          component: () => import('@/features/vehicles/views/VehicleListView.vue'),
        },
        {
          path: 'vehicles/new',
          name: 'vehicles-create',
          component: () => import('@/features/vehicles/views/VehicleCreateView.vue'),
        },
        {
          path: 'vehicles/:id',
          name: 'vehicles-detail',
          component: () => import('@/features/vehicles/views/VehicleDetailView.vue'),
        },
        {
          path: 'vehicles/:id/edit',
          name: 'vehicles-edit',
          component: () => import('@/features/vehicles/views/VehicleEditView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth || to.meta.guest) {
    await authStore.fetchMe()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'vehicles-list' }
  }

  return true
})

export default router
