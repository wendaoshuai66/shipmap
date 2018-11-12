<template>
  <div class="ship-hall-search-box">
    <ul v-if="!isSmall" class="ship-hall-search">
      <li class="search-item">
        <div class="search-title">
          {{$t(`shipHall.shipType`)}}
        </div>
        <el-select v-model="shipType" @change='updateShipHallSearchData'>
          <!--  :placeholder="$t(`shipHall.pleaseChoose`)" -->
          <el-option
            v-for="item in shipTypeList"
            :key="item.value"
            :label="item.subGroup"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="search-item">
        <div class="search-title">
          {{$t(`shipHall.shipStatus`)}}
        </div>
        <el-select v-model="shipStatus" @change='updateShipHallSearchData'>
          <!-- :placeholder="$t(`shipHall.pleaseChoose`)" -->
          <el-option
            v-for="item in shipStatusList"
            :key="item.key"
            :label="item.name"
            :value="item.key">
          </el-option>
        </el-select>
      </li>
      <li class="search-item">
        <div class="search-title">
          OPEN
        </div>
        <div class="block">
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="OPENStart" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
          </el-date-picker>
          -
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="OPENEnd" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
          </el-date-picker>
        </div>
      </li>
      <li class="search-item">
        <div class="search-title">
          ETA Fujairah
        </div>
        <div class="block">
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="FujairalStart" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
          </el-date-picker>
          -
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="FujairalEnd" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
          </el-date-picker>
        </div>
      </li>
      <li class="search-item">
        <div class="search-title">
          ETA Cabinda
        </div>
        <div class="block">
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="CabindaStart" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
          </el-date-picker>
          -
          <el-date-picker
            @change='updateShipHallSearchData'
            v-model="CabindaEnd" :placeholder="$t(`shipHall.optionDate`)"
            type="date">
            <!--  :placeholder="$t(`shipHall.optionDate`)" -->
          </el-date-picker>
        </div>
      </li>
      <li class="search-item btn-item">
        <el-input v-model="queryContent" :placeholder="$t(`shipHall.queryContent`)" @change='updateShipHallSearchData'></el-input>
        <!--  :placeholder="$t(`shipHall.queryContent`)" -->
        <el-button size="mini" type="warning" @click="getAllShipPlateList(1)">{{$t(`shipHall.search`)}}</el-button>
        <el-button size="mini" type="warning" @click="resetCondition">{{$t(`shipHall.reset`)}}</el-button>
      </li>
    </ul>
    <ul v-if='isSmall' class="ship-hall-search ship-hall-small">
      <li class="search-item">
        {{$t(`shipHall.shipType`)}}
        <el-select v-model="shipType">
          <!--  :placeholder="$t(`shipHall.pleaseChoose`)" -->
          <el-option
            v-for="item in shipTypeList"
            :key="item.value"
            :label="item.subGroup"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
      <li class="search-item">
        <div class="block">
          ETA Fujairah
          <el-date-picker
            v-model="FujairalStart"
            type="date">
          </el-date-picker>
          -
          <el-date-picker
            v-model="FujairalEnd"
            type="date">
          </el-date-picker>
        </div>
      </li>
      <li class="search-item">
        <div class="block">
          ETA Cabinda
          <el-date-picker
            v-model="CabindaStart"
            type="date">
          </el-date-picker>
          -
          <el-date-picker
            v-model="CabindaEnd"
            type="date">
          </el-date-picker>
        </div>
      </li>
      <li class="small-btn">
        <span @click="getAllShipPlateList">
          <svg-icon class="setting" icon-class="sousuo"/>
        </span>
        <a @click='mapShipHallMore'>{{$t(`shipHall.all`)}}<svg-icon class="setting" icon-class="xiangxiajiantou"/></a>
      </li>
    </ul>
  </div>
</template>
<script>
  import moment from 'moment'
  import { queryValueSet } from '@/api/shipHall'
  import i18n from '@/lang'
  import store from '@/store'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'shipPlateSearch',
    props: {
      isSmall: Boolean
    },
    data() {
      return {
        shipTypeList: null,
        shipStatusList: [
          {
            key: '',
            name: i18n.t(`shipHall.total`)
          },
          {
            key: 'Full-laden',
            name: i18n.t(`shipHall.fullLaden`)
          },
          {
            key: 'Ratio-laden',
            name: i18n.t(`shipHall.ratioLaden`)
          },
          {
            key: 'Empty',
            name: i18n.t(`shipHall.empty`)
          }
        ],
        OPENStart: '',
        OPENEnd: '',
        queryContent: '',
        FujairalStart: '',
        FujairalEnd: '',
        CabindaStart: '',
        CabindaEnd: '',
        shipType: '',
        shipStatus: '',
        pageSize: 10
      }
    },
    computed: {
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      },
      ...mapGetters([
        'shipHallSearch',
        'shipHallCondition'
      ])
    },
    mounted() {
      this.getAllShipType()
      var type = window.localStorage.getItem('type')
      if (!this.isSmall) {
        if (type !== null) {
          this.shipType = type
          this.FujairalStart = window.localStorage.getItem('etaStart')
          this.FujairalEnd = window.localStorage.getItem('etaEnd')
          this.CabindaStart = window.localStorage.getItem('etaCabindabegin')
          this.CabindaEnd = window.localStorage.getItem('etaCabindaEnd')
        }
        window.localStorage.setItem('type', '')
        window.localStorage.setItem('etaStart', '')
        window.localStorage.setItem('etaEnd', '')
        window.localStorage.setItem('etaCabindabegin', '')
        window.localStorage.setItem('etaCabindaEnd', '')
        this.getAllShipPlateList(1)
      }
    },
    methods: {
      getAllShipType() {
        queryValueSet({ valueSetType: '9' }).then(response => {
          if (response && response.data && response.data.datas) {
            this.shipTypeList = response.data.datas
            this.shipTypeList.splice(this.shipTypeList.length - 1, 1)
            const all = {
              value: '',
              subGroup: i18n.t(`shipHall.total`)
            }
            this.shipTypeList.unshift(all)
          }
        })
      },
      // 日期格式化
      dateFormat(ata) {
        if (!ata) {
          return ''
        }
        return moment(Number(ata)).format('YYYY-MM-DD')
      },
      showShipInformation(uuid) {
        this.$router.push({ name: 'shipPlateDetails', params: { uuid: uuid }})
      },
      mapShipHallMore() {
        const href = this.$router.resolve({ name: 'shipHall' })
        window.open(href.href)
      },
      updateShipHallSearchData() {
        const updateObj = {
          pageNum: this.shipHallCondition.pageNum,
          pageSize: this.pageSize,
          name: this.queryContent,
          type: this.shipType,
          shipStatus: this.shipStatus,
          openBeg: this.dateFormat(this.OPENStart),
          openEnd: this.dateFormat(this.OPENEnd),
          etaStart: this.dateFormat(this.FujairalStart),
          etaEnd: this.dateFormat(this.FujairalEnd),
          etaCabindabegin: this.dateFormat(this.CabindaStart),
          etaCabindaEnd: this.dateFormat(this.CabindaEnd)
        }
        store.dispatch('shipHallCondition', updateObj)
      },
      resetCondition() {
        this.queryContent = ''
        this.shipType = ''
        this.shipStatus = ''
        this.OPENStart = ''
        this.OPENEnd = ''
        this.FujairalStart = ''
        this.FujairalEnd = ''
        this.CabindaStart = ''
        this.CabindaEnd = ''
        // this.getAllShipPlateList(1)
      },
      getAllShipPlateList(val) {
        let updateObj = null
        if (this.isSmall) {
          updateObj = {
            type: this.shipType,
            etaStart: this.dateFormat(this.FujairalStart),
            etaEnd: this.dateFormat(this.FujairalEnd),
            etaCabindabegin: this.dateFormat(this.CabindaStart),
            etaCabindaEnd: this.dateFormat(this.CabindaEnd)
          }
          var times = (this.FujairalStart).getTime()
          console.log(times)
          window.localStorage.setItem('type', this.shipType)
          window.localStorage.setItem('etaStart', this.FujairalStart.getTime())
          window.localStorage.setItem('etaEnd', this.FujairalEnd.getTime())
          window.localStorage.setItem('etaCabindabegin', this.CabindaStart.getTime())
          window.localStorage.setItem('etaCabindaEnd', this.CabindaEnd.getTime())
        } else {
          updateObj = {
            pageNum: val,
            pageSize: this.pageSize,
            name: this.queryContent,
            type: this.shipType,
            shipStatus: this.shipStatus,
            openBeg: this.dateFormat(this.OPENStart),
            openEnd: this.dateFormat(this.OPENEnd),
            etaStart: this.dateFormat(this.FujairalStart),
            etaEnd: this.dateFormat(this.FujairalEnd),
            etaCabindabegin: this.dateFormat(this.CabindaStart),
            etaCabindaEnd: this.dateFormat(this.CabindaEnd)
          }
          store.dispatch('shipHallCondition', updateObj)
        }
        this.$store.dispatch('shipHallSearch', { 'updateObj': updateObj, isSmall: this.isSmall }).then((data) => {})
        if (this.isSmall) {
          this.$router.push({ name: 'shipPlate' })
        }
      }
    }
  }
</script>

<style>
ul, li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.ship-hall-search {
  width: 100%;
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
}
.ship-hall-small {
  font-size: 14px;
  padding: 6px 10px;
  background: linear-gradient(-1deg, #0C0C0C 1%, #4E4E4E 100%);
}
.language-en .ship-hall-small {
  font-size: 12px;
}
.ship-hall-search .el-date-editor.el-input,
.ship-hall-search .el-date-editor.el-input__inner,
.ship-hall-search .el-select {
  width: 100px;
}
.ship-hall-search .el-input--medium .el-input__inner {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  background: #FFFFFF;
  border: 1px solid #DADADA;
  border-radius: 2px;
  font-size: 12px;
}
.ship-hall-small .el-date-editor.el-input,
.ship-hall-small .el-date-editor.el-input__inner,
.ship-hall-small .el-select {
  width: 80px;
}
.ship-hall-small .el-select {
  width: 84px;
}
.ship-hall-small .el-input--medium .el-input__inner {
  padding: 0 5px;
  height: 26px;
  background: transparent;
  border: 1px solid #ffffff8c;
  color: #fff;
  line-height: 26px;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.ship-hall-search .block .el-input__prefix,
.ship-hall-search .block .el-input__suffix {
  display: none;
}
.ship-hall-search .search-item .search-title {
  line-height: 20px;
  margin-bottom: 8px;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  letter-spacing: 0.17px;
}
.ship-hall-search .btn-item {
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  padding-top: 28px;
}
.ship-hall-search .btn-item .el-input--medium {
  width: 180px;
}
.ship-hall-search .btn-item .el-button--mini {
  background: #FFCC00;
  border-radius: 0 2px 2px 0;
  font-family: MicrosoftYaHei;
  font-size: 12px;
  letter-spacing: 0;
  text-align: center;
  width: 56px;
  height: 28px;
  line-height: 28px;
  padding: 0;
  border: none;
}
.ship-hall-search .btn-item .el-button--mini:nth-child(3) {
  background: #eee;
}
.ship-hall-search .small-btn span {
  display: inline-block;
  width: 33px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  background: rgba(255,255,255,0.20);
  border-radius: 2px;
  cursor: pointer;
}
.ship-hall-search .small-btn span .setting {
  width: 15px;
  height: 15px;
  margin-top: 5px;
}
.ship-hall-search .small-btn a {
  font-size: 14px;
  color: #FFCC00;
  letter-spacing: 0.17px;
  text-align: center;
}
.ship-hall-search .small-btn a .setting {
  width: 10px;
  height: 12px;
  transform:rotate(-90deg);
  -ms-transform:rotate(-90deg); /* Internet Explorer */
  -moz-transform:rotate(-90deg); /* Firefox */
  -webkit-transform:rotate(-90deg); /* Safari 和 Chrome */
  -o-transform:rotate(-90deg); /* Opera */
}
</style>
