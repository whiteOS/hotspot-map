import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: 'e40adbd43aed833b85eedfa229822556',
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geocoder',
    'AMap.Geolocation',
    'AMap.InfoWindow',
    'AMap.Marker'
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
