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
          vid="component-marker"
          title="hello"
          :position="center"
          :events="markEvents"
        ></el-amap-marker>
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
        markEvents: { click: this.markerClick }
      };
    },
    methods: {
      async markerClick() {
        console.log(this.center);
      }
    }
  };
</script>
