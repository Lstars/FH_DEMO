import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'normalize.css/normalize.css'
import IconSvg from '@/components/Icon-svg/index.vue'
import { getSessionId } from '@/utils/auth'
import * as filters from './filters'
import VuePreview from 'vue-preview'
import VueLazyload from 'vue-lazyload'
import lazyLoadPic from '@/assets/lazyLoad@3x.png'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VuePreview);
Vue.use(VueLazyload, {
  /* error: errorPic,*/
  loading: lazyLoadPic
});
Vue.component('icon-svg', IconSvg)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
  NProgress.start();

  store.dispatch('GetInfo').then(res => {
    const roles = 'admin'
    store.dispatch('GenerateRoutes', { roles }).then(() => {
      router.addRoutes(store.getters.addRouters);
      next();
    })
  })
});

router.afterEach(() => {
  NProgress.done();
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
