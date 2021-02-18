import Vue from 'vue';
import App from './App.vue';
import '@arcgis/core/assets/esri/themes/light/main.css';

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount('#app');
