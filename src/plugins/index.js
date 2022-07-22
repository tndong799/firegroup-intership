import Vue from 'vue';
import VueConfirm from '@/assets/vendor/vue-confirm';
Vue.prototype.$eventBus = new Vue();

Vue.use(VueConfirm);
