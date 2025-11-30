import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../views/pages/Main-page.vue";
import LoginForm from "../views/auth/LoginForm.vue";
import RegisterForm from "../views/auth/RegisterForm.vue";
import ForgotPasswordModal from '@/views/auth/ForgotPasswordModal.vue';
import ResetPasswordForm from "../views/auth/ResetPasswordForm.vue";
import UserProfile from "../views/profiles/UserProfile.vue";
import NotFound from "../views/helpers/NotFound.vue";
import api from "../api/axios";
import ProductPage from "../views/profiles/ProductProfile.vue";
import FavoritesPage from "../views/pages/FavoritesPage.vue";
import CheapestBasket from "../views/pages/CheapestBasket.vue";
import FavoritesTest from "../views/pages/FavoritesTest.vue";




const routes = [

    {
        path: '/',
        name: 'Home',
        component: MainPage
    },
    {
        path: '/auth/register',
        name: 'register',
        component: RegisterForm
    },
    {
        path: '/auth/login',
        name: 'login',
        component: LoginForm
    },
    {
        path: '/auth/forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordModal
    },
    {
        path: '/auth/reset-password',
        name: 'reset-password',
        component:ResetPasswordForm
    },

    {
    path:'/profile',
    name: 'user-profile',
    component: UserProfile,
    meta:{requiresAuth:true}
    },

    {
        path:"/product",
        name:"product-overview",
        component:ProductPage
    },
    {
        path:"/favorites",
        name:"favorite-products",
        component:FavoritesPage,
        meta:{requiresAuth:true}
    },
    {
        path:"/cheapest-basket",
        name:"cheapest-basket",
        component:CheapestBasket,
        meta:{requiresAuth:true}
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async(to, from, next) => {
    if(!to.meta.requiresAuth){
        return next()
    }
    await api.get("/auth/@me").then(() => next()).catch(() => next());

});

export default router;
