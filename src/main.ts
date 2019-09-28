import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './components/app/app.vue';
import VueCookies from 'vue-cookies';

Vue.config.productionTip = false;

// Use Element UI
Vue.use(ElementUI, {locale: 'en-us'});

// Use Cookies
Vue.use(VueCookies);

// Init app
new Vue({
  render: (h) => h(App),
}).$mount('#app');
