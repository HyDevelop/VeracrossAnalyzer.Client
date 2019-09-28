import Vue from 'vue';
import App from './components/app/app.vue';

// Import Element UI
import ElementUI from 'element-ui';
Vue.use(ElementUI, {locale: 'en-us'});

// Import Cookies
import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

// Import ECharts
// 在 webpack 环境下指向 components/ECharts.vue
const ECharts = require('vue-echarts');
Vue.component('v-chart', ECharts);

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

// Config
Vue.config.productionTip = false;

// Init app
new Vue(
{
    render: (h) => h(App),
})
.$mount('#app');
