<template>
  <div>
    <div id="map" class="map"></div>
    <div id="info"></div>
    <p> 定位精度 : <code id="accuracy"></code> </p>
  </div>
</template>

<script>
  //导入基本模块
  import 'ol/ol.css';
  import Map from 'ol/Map';
  import View from 'ol/View';
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
  import { TileWMS } from 'ol/source';
  import Geolocation from 'ol/Geolocation';

  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import { Vector as VectorSource } from 'ol/source';

  export default {
    name: 'olMapImageWMS',
    data() {
      return {};
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        var layer = new TileLayer({
          source: new TileWMS({
            //不能设置为0，否则地图不展示。
            ratio: 1,
            url: 'https://10.126.148.112:8443/geoserver/hunan/wms',
            params: {
              LAYERS: 'hunan:osm',
              STYLES: '',
              VERSION: '1.1.1',
              TRANSPARENT: true,
              FORMAT: 'image/png8',
              FORMAT_OPTIONS: 'antialias:full',
              exceptions: 'application/vnd.ogc.se_inimage'
              // tiled: false
            },
            serverType: 'geoserver'
          })
        });
        const view = new View({
          projection: 'EPSG:4326', //坐标系类型
          //地图中心点
          center: [113.01015103962031, 28.070729213584386],
          zoom: 16
        });
        const map = new Map({
          //地图容器ID
          target: 'map',
          //引入地图
          layers: [layer],
          view: view
        });
        const geolocation = new Geolocation({
          // enableHighAccuracy must be set to true to have the heading value.
          trackingOptions: {
            enableHighAccuracy: true
          },
          projection: view.getProjection()
        });
        geolocation.setTracking(true);
        geolocation.on('change', function () {
          document.getElementById('accuracy').innerText =
            geolocation.getAccuracy() + ' [m]';
        });
        geolocation.on('error', function (error) {
          const info = document.getElementById('info');
          info.innerHTML = error.message;
          info.style.display = '';
        });
        const accuracyFeature = new Feature();
        geolocation.on('change:accuracyGeometry', function () {
          accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
        });
        const positionFeature = new Feature();
        positionFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({
                color: '#3399CC'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2
              })
            })
          })
        );
        geolocation.on('change:position', function () {
          const coordinates = geolocation.getPosition();
          positionFeature.setGeometry(
            coordinates ? new Point(coordinates) : null
          );
          console.log(coordinates);
          view.setCenter(coordinates);
        });
        new VectorLayer({
          map: map,
          source: new VectorSource({
            features: [accuracyFeature, positionFeature]
          })
        });
      }
    }
  };
</script>

<style scoped>
  .map {
    width: 100%;
    height: 800px;
  }
</style>
