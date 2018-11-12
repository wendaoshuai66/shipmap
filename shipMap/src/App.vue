<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false
        // 在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>
<style>
 #app{
   overflow: hidden;
 }
 :focus {
      outline: -webkit-focus-ring-color auto 0;
      outline: 0;
      /* or */
      outline: none;
  }
  .pirates-Somalia .leaflet-popup-content-wrapper {
    border-radius: 2px;
  }
  .pirates-Somalia .leaflet-popup-content {
    margin: 10px 30px 7px 10px;
  }
</style>
