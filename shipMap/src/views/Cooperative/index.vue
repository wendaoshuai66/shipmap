<template>
  <div class="partner-img-wrap">
    <img :src="partnerUrl" alt="" class="partner-img">
  </div>
</template>
<script>
import config from '@/config'
export default {
  // components: { },
  name: 'login',
  data() {
    return {
      partnerUrl: `${config.staticImagesPath}/images/logo-all.png`
    }
  },
  methods: {},
  created() {},
  destroyed() {}
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .partner-img-wrap{
    text-align: center;
    vertical-align: middle;
    width: 100%;
  }
  .partner-img-wrap .partner-img{
    max-width:100%;
    height: auto;
  }
</style>
