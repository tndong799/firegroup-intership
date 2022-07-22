import Vue from 'vue';
import store from '@/store';
import VueRouter from 'vue-router';
import Auth from '@/middlewares/auth';
import NoLogin from '@/middlewares/noLogin';
Vue.use(VueRouter);

const routes = [];

const emptyFn = () => {};
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(
    location,
    onComplete = emptyFn,
    onAbort = emptyFn
) {
    return originalPush.call(this, location, onComplete, onAbort);
};
const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes,
    scrollBehavior: function (to, from, savedPosition) {
        return { x: 0, y: 0 };
    },
});
router.beforeEach(async (to, from, next) => {
    if (to.meta.middleware) {
        const middleware = to.meta.middleware;
        const payload = { to, from, next, store };
        let preventNext = false;
        for (let i = 0; i < middleware.length; i++) {
            const result = await middleware[i](payload);
            if (!result) {
                preventNext = true;
                break;
            }
        }
        if (preventNext) {
            return;
        }
    }
    next();
});

export default router;
