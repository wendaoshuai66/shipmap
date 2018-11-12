<template>
  <tips
    :width="isI18n ? '456px' : '600px'"
    height='346px'
    :right="isI18n ? '342px' : '445px'"
    bottom="2px"
    :visible.sync='isShow'
    :before-close="beforeClose">
    <template slot="tipsContent">
      <div class="typhoon-detail-wrap">
        <div class="typhoon-detail-header">
          [{{this.typhoonName}}]{{$t('typhoon.PathInformation')}}
        </div>
        <div class="position-wrap clear-fix" style="position: relative;">
          <div class="typhoon-detail-content" style="position: fixed; height: 33px">
            <table cellpadding="0" cellspacing="0" border="0">
              <thead>
                <tr class="table-title">
                  <th :width="isI18n ? 130 : 179">{{$t('typhoon.Time')}}</th>
                  <th :width="isI18n ? 61 : 88">{{$t('typhoon.WindSpeed')}}</th>
                  <th :width="isI18n ? 68 : 90">{{$t('typhoon.MovingDirection')}}</th>
                  <th :width="isI18n ? 140 : 185">{{$t('typhoon.WindLevel')}}</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div class="typhoon-detail-content">
          <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 29px">
            <tbody>
              <tr v-for="item in typhoonPath" class="hover-tr">
                <td :width="isI18n ? 130: 179">{{item.updatetime}}</td>
                <td :width="isI18n ? 61: 88">{{item.windspeed}}</td>
                <td :width="isI18n ? 68: 90">{{item.movedirection}}</td>
                <td :width="isI18n ? 140: 185">{{item.strong}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </tips>
</template>

<script>
  import tips from '../ui/tips/index'
  export default {
    name: 'typhoonDteail',
    components: {
      tips
    },
    props: {
      beforeClose: Function,
      typhoonPath: Array,
      typhoonName: String
    },
    computed: {
      // ...mapGetters([
      //   'shipImo'
      //   // isI18n: language === 'zh'
      // ]),
      isI18n() {
        return this.$store.getters.language === 'zh'
      }
    },
    data() {
      return {
        isShow: true,
        flag: false
      }
    },
    methods: {
      /* handleClose1(done) {
        this.$router.push({
          name: 'ship'
        })
        done()
      }*/
    }
  }
</script>

<style scoped>
  .typhoon-detail-wrap .typhoon-detail-header{
    white-space: nowrap;
    height: 100%;
    line-height: 30px;
    width: 30%;
    color: #fff;
    font-size: 14px;
  }
  .typhoon-detail-wrap .typhoon-detail-content{
    margin-top: 10px;
    height: 280px;
    overflow-y: auto;
  }
  .typhoon-detail-wrap .typhoon-detail-content::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #d3d3d0;
  }
  .position-wrap {
    overflow-y: auto;
  }
  .typhoon-detail-wrap .typhoon-detail-content::-webkit-scrollbar-thumb{
    width: 8px;
    background-color: #3B99FC;
    border-radius: 3px;
  }
  .typhoon-detail-wrap .typhoon-detail-content table{
    color: #fff;
    border-collapse: collapse;
  }
  .typhoon-detail-wrap .typhoon-detail-content .table-title{
    white-space: nowrap;
    height: 30px;
    font-size: 12px;
    background-color: rgba(79, 81, 68, 0.9);
  }
  .typhoon-detail-content .table-title th{
    color: #fff;
    font-weight: 500;
    text-align: center;
    border: 1px solid #333;
    border-collapse:collapse;
  }
  .typhoon-detail-wrap .typhoon-detail-content table tr{
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .typhoon-detail-wrap .typhoon-detail-content table td{
    font-size: 12px;
    border: 1px solid #333;
    padding: 0;
    margin: 0;
  }
/*  .typhoon-detail-wrap .typhoon-detail-content .table-title th:nth-child(1){
    width: 155px;
  }
  .typhoon-detail-wrap .typhoon-detail-content .table-title th:nth-child(2){
    width: 65px;
  }
  .typhoon-detail-wrap .typhoon-detail-content .table-title th:nth-child(3){
    width: 65px;
  }
  .typhoon-detail-wrap .typhoon-detail-content .table-title th:nth-child(4){
    width: 155px;
  }*/
  .typhoon-detail-wrap .typhoon-detail-content .table-title tr:hover{
    width: 155px;
  }
  .typhoon-detail-wrap .typhoon-detail-content .hover-tr:hover{
    background-color: #3B99FC;
  }
  .clear-fix:after{content:".";display:block;height:0;visibility:hidden;clear:both;}
</style>
