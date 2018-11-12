<template>
<!-- // :style="{height: mainHeight + 'px'}" -->
  <section class="app-main except-map"  :class="isLanguageZh ? '' : 'language-en' ">
    <transition name="fade-transform" mode="out-in">
      <div class="main-class">
        <router-view :key="key"></router-view>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      mainHeight: window.innerHeight
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    },
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    }
  },
  mounted() {
  }
}
</script>
<style scope>
.except-map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: rgba(170,218,255,.2);
  padding-top: 76px;
}
.main-class {
  position: relative;
  background: url('../../../../static/images/mapBackground.png') no-repeat top;
  background-size: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
