import '@babel/polyfill'
import Vue from 'vue';
import VueMq from 'vue-mq';
import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad, {
    loading: '/dist/loading.gif'
});

Vue.use(VueMq, {
    breakpoints: {
        mobile: 450,
        tablet: 1050,
        desktop: Infinity
    },
    defaultBreakpoint: 'desktop'
});

import './reset.css';
import Models from './models/Models.vue';

let loadingElement = document.getElementById('app-loading');
loadingElement.parentNode.removeChild(loadingElement);
document.getElementById('app').style.display = 'block';

new Vue({
    el: '#app',
    render: h => h(Models)
});