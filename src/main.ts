import Vue from 'vue';
import ElementUI from 'element-ui';
const VCharts = require('v-charts');

import App from './components/app/app.vue';

Vue.config.productionTip = false;

// Use Element UI
Vue.use(ElementUI, {locale: 'en-us'});

// Use VCharts
Vue.use(VCharts);

// Init app
new Vue({
  render: (h) => h(App),
}).$mount('#app');
