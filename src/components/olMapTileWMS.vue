<template>
  <div>
    <div id="map" class="map"> </div>
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
  import { Control, defaults as defaultControls } from 'ol/control.js';
  import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
  import Feature from 'ol/Feature';
  import Point from 'ol/geom/Point';
  import { Vector as VectorSource } from 'ol/source';

  export default {
    name: 'olMapImageWMS',
    data() {
      return {
        map: null,
        geolocation: null,
        accuracyFeature: null,
        positionFeature: null
      };
    },
    mounted() {
      this.initMap();
    },
    methods: {
      // 初始化
      initMap() {
        const that = this;

        // 定位控件
        class Locate extends Control {
          /**
           * @param {Object} [opt_options] Control options.
           */
          constructor(opt_options) {
            const options = opt_options || {};

            const button = document.createElement('button');
            button.innerHTML = '⚪';

            const element = document.createElement('div');
            element.className = 'ol-attribution ol-unselectable ol-control';
            element.appendChild(button);

            super({
              element: element,
              target: options.target
            });

            button.addEventListener('click', this.locate.bind(this), false);
          }

          locate() {
            this.getMap()
              .getView()
              .animate(
                { center: that.geolocation.getPosition() },
                { zoom: 15 }
              );
          }
        }

        // 初始化地图
        that.map = new Map({
          //地图容器ID
          target: 'map',
          // 控件
          controls: defaultControls().extend([new Locate()]),
          //引入地图
          layers: [
            new TileLayer({
              source: new TileWMS({
                //不能设置为0，否则地图不展示。
                ratio: 1,
                url: 'http://lookmap.csust.edu.cn/geoserver/hunan/wms',
                params: {
                  LAYERS: 'hunan',
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
            })
          ],
          view: new View({
            projection: 'EPSG:3857', //坐标系类型
            center: [12579389.92703, 3257754.13451],
            zoom: 16
          })
        });
        // 定位功能
        that.geolocation = new Geolocation({
          // enableHighAccuracy must be set to true to have the heading value.
          trackingOptions: {
            enableHighAccuracy: true
          },
          projection: this.map.getView().getProjection()
        });
        // 开启实时定位
        that.geolocation.setTracking(true);
        // 实时定位显示定位精度
        that.geolocation.on('change', function () {
          console.log(that.geolocation.getAccuracy() + ' [m]');
        });
        // 定位错误信息输出到控制台
        that.geolocation.on('error', function (error) {
          console.log(error.message);
        });
        // 显示定位范围
        that.accuracyFeature = new Feature();
        that.geolocation.on('change:accuracyGeometry', function () {
          that.accuracyFeature.setGeometry(
            that.geolocation.getAccuracyGeometry()
          );
        });
        that.positionFeature = new Feature();
        that.positionFeature.setStyle(
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
        that.geolocation.on('change:position', function () {
          const coordinates = that.geolocation.getPosition();
          that.positionFeature.setGeometry(
            coordinates ? new Point(coordinates) : null
          );
          console.log(coordinates);
        });
        new VectorLayer({
          map: that.map,
          source: new VectorSource({
            features: [that.accuracyFeature, that.positionFeature]
          })
        });
        console.log('init completed');
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
