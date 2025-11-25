import { createRouter, createWebHistory } from 'vue-router';
import MainPage from "../views/Main-page.vue";
import LoginForm from "../views/auth/LoginForm.vue";
import RegisterForm from "../views/auth/RegisterForm.vue";
import ForgotPasswordModal from '@/views/auth/ForgotPasswordModal.vue';
import ResetPasswordForm from "../views/auth/ResetPasswordForm.vue";
import UserProfile from "../views/profiles/UserProfile.vue";
import NotFound from "../views/helpers/NotFound.vue";
import api from "../api/axios";




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
    try{
        await api.get("/auth/@me")
        next();
    }
    catch (error){
        console.warn("Not authorized")
        next('/auth/login') // редирект на логин
    }
});

export default router;
