<template>
  <div class="port-list-info-wrap">
    <map-dialog
      self-class="maxIndex"
      :drag='1'
      width="320px"
      top="154px"
      :left="isI18n?'874px':'975px'"
      :before-close="beforeClose"
      :visible.sync='isShow'>
      <template slot="title">
        <div class="detail-header" v-text="isI18n?portInfo.titleZh:portInfo.titleEn"></div>
      </template>
      <div class="port-details-info-content" v-html="isI18n?portInfo.htmlZh:portInfo.htmlEn">

      </div>
    </map-dialog>
  </div>
</template>
<script>
  import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  export default {
    name: 'portListInfo',
    components: {
      mapDialog
    },
    computed: {
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    props: {
      beforeClose: Function,
      portInfo: Object
    },
    data() {
      return {
        isShow: true
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
  .port-list-info-wrap .detail-header{
    width: auto;
    height: 35px;
    line-height: 35px;
    color: #fff;
    margin: 0 10px;
    border-bottom: 1.5px solid #242424;
    font-size: 14px;
  }
  .port-list-info-wrap .port-details-info-content{
    margin: 10px 10px 0;
    height: 135px;
    font-size: 12px;
    color: #fff;
    overflow: auto;
  }
  .port-list-info-wrap .port-details-info-content::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #d3d3d0;
  }
  .port-list-info-wrap .port-details-info-content::-webkit-scrollbar-thumb{
    width: 8px;
    background-color: #3B99FC;
    border-radius: 3px;
  }
</style>
