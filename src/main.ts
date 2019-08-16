import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './components/app/app.vue';

Vue.config.productionTip = false;
Vue.use(ElementUI, {locale: 'en-us'});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
