<template>
  <div class="amap-page-container">
    <div :style="{ width: '100%', height: '600px' }">
      <el-amap
        vid="amap"
        class="amap-demo"
        viewMode="3D"
        :zoom="zoom"
        :zooms="zooms"
        :center="center"
      >
        <el-amap-marker
          v-for="marker in markers"
          :position="marker.position"
          :key="marker.id"
          :events="marker.events"
          :icon="marker.icon"
        ></el-amap-marker>
        <el-amap-info-window
          v-if="window"
          :position="window.position"
          :visible="window.visible"
          :content="window.content"
          :offset="window.offset"
        ></el-amap-info-window>
      </el-amap>
    </div>
  </div>
</template>
<style>
  .amap-demo {
    height: 500px;
  }
</style>

<script>
  export default {
    data() {
      return {
        center: [116.481181, 39.989792],
        zoom: 17,
        zooms: [5, 20],
        markers: [],
        windows: [],
        window: ''
      };
    },
    methods: {
      init() {
        let markers = [];
        let windows = [];
        let that = this;
        let pointMarker = [
          {
            lng: 116.481181,
            lat: 39.989792,
            title: 'title A',
            text: '<a href="https://www.baidu.com">link-A</a>'
          },
          {
            lng: 116.477181,
            lat: 39.989222,
            title: 'title B',
            text: '<a href="https://www.baidu.com">link-B</a>'
          }
        ];
        pointMarker.push({
          lng: 116.477181,
          lat: 39.988222,
          title: 'title C',
          text: '<a href="https://www.baidu.com">link-C</a>'
        });
        pointMarker.forEach((item, index) => {
          markers.push({
            position: [item.lng, item.lat],
            // icon:item.url, //不设置默认蓝色水滴
            events: {
              click() {
                that.windows.forEach((window) => {
                  window.visible = false; //关闭窗体
                });
                that.window = that.windows[index];
                that.$nextTick(() => {
                  that.window.visible = true; //点击点坐标，出现信息窗体
                });
              }
            }
          });
          windows.push({
            position: [item.lng, item.lat],
            content: "<div id='content'>" + item.text + '</div>', //内容
            offset: [0, 0], //窗体偏移
            visible: false //初始是否显示
          });
        });
        //  加点
        this.markers = markers;
        //加弹窗
        this.windows = windows;
      },
      markerClick() {
        this.currentWindow.visible = true;
        AMap.infoWindow.open();
      }
    },
    created() {
      this.init();
    }
  };
</script>
