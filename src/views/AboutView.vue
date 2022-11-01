<template>
  <div class="app-container home">
    <olMapTileWMS></olMapTileWMS>
  </div>
</template>

<script>
  import olMapTileWMS from '@/components/olMapTileWMS';
  export default {
    name: 'aboutView',
    components: {
      olMapTileWMS
    }
  };
</script>
