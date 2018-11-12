<template>
  <div class="port-list-info-wrap">
    <map-dialog
      self-class="maxIndex"
      :drag='1'
      width="320px"
      top="359px"
      :left="isI18n?'367px':'455px'"
      :before-close="portQueuingClose"
      :visible.sync='isShow'>
      <template slot="title">
        <div class="detail-header">{{$t('portListsAll.queueUp')}}</div>
      </template>
      <div class="port-details-info-content">
        <slot name="lists"></slot>
        <ul class="port-style-li">
          <li v-for="(item, index) in postLists" :key="index" @click="planDetail(index)">
            {{isI18n ? item.protdateCn : item.protdate}}{{isI18n ? item.portZh : item.portEh}}{{$t('portSearch.content.queuingPlan')}}
          </li>
        </ul>
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
      portQueuingClose: Function,
      portInfo: Object,
      postLists: Array
    },
    data() {
      return {
        isShow: true
      }
    },
    methods: {
      planDetail(index) {
        this.$router.push({ name: 'informationDetails', params: { uuid: this.postLists[index].portId, key: this.postLists[index].protdate }})
      }
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
  .port-details-info-content .port-style-li{
    height: 25px;
    line-height: 25px;
    cursor: pointer;
  }
</style>
