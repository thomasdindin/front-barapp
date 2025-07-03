import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import CocktailDetails from "@/components/CocktailDetails.vue";
import CartView from "@/views/CartView.vue";
import BarmakerView from "@/views/BarmakerView.vue";
import CocktailsView from "@/views/CocktailsView.vue";
import IngredientsView from "@/views/IngredientsView.vue";
import CommandesView from "@/views/CommandesView.vue";
import OrdersView from "@/views/OrdersView.vue";
import CategorieView from "@/views/CategorieView.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cocktails/:id',
      name: 'CocktailDetail',
      component: CocktailDetails,
      props: true
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      beforeEnter: () => {
        const auth = useAuthStore()
        if (auth.isAdmin) return '/home'
        if (!auth.isAuthenticated) return '/login'
      }
    },
    {
      path: '/mes-commandes',
      name: 'orders',
      component: OrdersView,
      beforeEnter: () => {
        const auth = useAuthStore()
        if (auth.isAdmin) return '/home'
        if (!auth.isAuthenticated) return '/login'
      }
    },
    {
      path: '/gestion',
      component: BarmakerView,
      beforeEnter: () => {
        const auth = useAuthStore()
        if (!auth.isAdmin) return '/login'
      },
      children: [
        { path: '',           redirect: 'cocktails' },
        { path: 'cocktails',  name: 'gestion-cocktails',  component: CocktailsView },
        { path: 'ingredients',name: 'gestion-ingredients',component: IngredientsView },
        { path: 'categories',    name: 'gestion-categories',    component: CategorieView },
        { path: 'commandes',     name: 'gestion-commandes',     component: CommandesView },
      ]
    }
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.path === '/home' && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router
