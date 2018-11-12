<template>
  <tips
    :width="isI18n ? '299px' : '320px'"
    height='148px'
    :right="isI18n ? '40px' : '120px'"
    bottom="5px"
    :visible.sync='isShow'
    :before-close="beforeClose">
    <template slot="tipsContent">
      <!--<button @click="ifTyphoonDteail">11111</button>-->
      <div class="detail-header">
        <span>{{$t('typhoon.Results')}}</span>
      </div>
      <div class="result-wrap-center" style="position: relative;">
        <div class="result-wrap" style="position: fixed">
          <div style="height: 31px;overflow: hidden">
            <table cellpadding="0" cellspacing="0" border="0">
              <thead>
                <tr class="table-title">
                  <th :width="isI18n ? 67: 77">{{$t('typhoon.Name')}}</th>
                  <th :width="isI18n ? 113: 120">{{$t('typhoon.Time')}}</th>
                  <th :width="isI18n ? 61: 65">{{$t('typhoon.numberCard')}}</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
        <div class="result-wrap" style="margin-top: 30px">
          <table cellpadding="0" cellspacing="0" border="0">
            <!--<thead>
              <tr class="table-title">
                <th class="before-width">{{$t('typhoon.Name')}}</th>
                <th>{{$t('typhoon.Time')}}</th>
                <th class="before-width">{{$t('typhoon.numberCard')}}</th>
              </tr>
            </thead>-->
            <tbody>
              <tr v-for="(item, index) in typhoonData" :key="index" class="hover-tr" @click="detailedTyphoon(item.positions, isI18n ?item.typhoon.chnname : item.typhoon.ename)">
                <td class="decoration" :width="isI18n ? 67: 77">{{isI18n ?item.typhoon.chnname : item.typhoon.ename}}</td>
                <td :width="isI18n ? 113: 120">{{item.typhoon.updatetime}}</td>
                <td :width="isI18n ? 61: 65">{{item.typhoon.xuhao}}</td>
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
      name: 'searchResult',
      components: {
        tips
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
      props: {
        beforeClose: Function,
        ifTyphoonDteail: Function,
        detailedTyphoon: Function,
        typhoonData: Array
      },
      data() {
        return {
          isShow: true
        }
      },
      methods: {
        rowClass({ row, rowIndex }) {
          return {
            'background': 'rgba(79,81,69,.75)',
            'fontWeight': '500',
            'fontSize': '14px',
            'lineHeight': '20px',
            'color': '#fff',
            'border': '1px solid #333',
            'textAlign': 'center'
          }
        }
      }
    }
</script>

<style>
  .detail-header{
    width: 100%;
    height: 20px;
    color: #fff;
    font-size: 14px;
    line-height: 20px;
  }
  .result-wrap-center{
    height: 112px;
    overflow-y: auto;
  }
  .result-wrap tr{
    white-space: nowrap;
  }
  .result-wrap table{
    color: #fff;
    border-collapse: collapse;
  }
  .result-wrap table tr{
    height: 25px;
    line-height: 25px;
    text-align: center;
  }
  .result-wrap table td{
    font-size: 12px;
    border: 1px solid #333;
  }
  /*table::-webkit-scrollbar-thumb{background-color: #3B99FC;border-radius: 3px;}
  table::-webkit-scrollbar-corner{display: none;}*/
  .result-wrap-center::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: #d3d3d0;
  }
  .result-wrap-center::-webkit-scrollbar-thumb{
    width: 8px;
    background-color: #3B99FC;
    border-radius: 3px;
  }
  .result-wrap .table-title{
    height: 30px;
    font-size: 12px;
    background-color: rgba(79, 81, 68, 0.9);
  }
  .result-wrap .table-title th{
    color: #fff;
    font-weight: 500;
    text-align: center;
    border: 1px solid #333;
    border-collapse:collapse;
  }
  .before-width{
    width: 50px;
  }
  .decoration{
    text-decoration: underline;
  }
  .hover-tr:hover{
    background-color: #3B99FC;
  }
</style>
