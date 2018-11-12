<template>
  <tab-ui>
    <div class="search-port">
        <el-autocomplete
            v-model="state1"
            class="inline-input"
            :placeholder="$t('publics.searchText')"
            :fetch-suggestions="rankingsSearch"
            @select="clickFullZ"
            >
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }" >
              <div v-if="item.type != 0">
                <div class="name">{{ item.matchkey }}</div>
                <span class="addr">{{ item.matchname }}</span>
              </div>
              <div v-else class="no-data">
                {{$t(`shipHall.searchHistory`)}}
              </div>
            </template>
        </el-autocomplete>
    </div>
  </tab-ui>

</template>

<script>
import _ from 'lodash'
import tabUi from '@/views/routemap/ui/tab'
// import { generateTitle } from '@/utils/i18n'
import {
  searchHistory, // 排名搜索
  fuzzySearch, // 模糊搜索
  findShip // 排名注入
} from '@/api/routemap'
import store from '@/store'
export default {
  components: {
    tabUi
  },
  name: 'SidebarItem',
  data() {
    return {
      state1: ``,
      fuzzyArr: [],
      timer: null,
      dateTimer: null
    }
  },
  // props: {
  // routes: {
  //       type: Array
  //     },
  //     isNest: {
  //       type: Boolean,
  //       default: false
  //     }
  //   },
  // watch: {
  //   $route: {
  //     handler: function(val, oldVal){
  //     },
  //     // 深度观察监听
  //     deep: true
  //   }
  // },
  methods: {
    // 查询船只
    rankingsSearch(queryString, cb) {
      if (this.timer && new Date().getTime() - this.dateTimer < 300) {
        clearTimeout(this.timer)
      } else {
        this.dateTimer = new Date().getTime()
        this.timer = setTimeout(() => {
          this.setDate(queryString, cb)
        }, 300)
      }
      // this.timer = setTimeout(()=>{
      //   this.setDate(queryString, cb)
      // },300)
    },
    setDate(queryString, cb) {
      if (this.state1 === '') {
        searchHistory().then(response => {
          if (response && !_.isEmpty(response.data)) {
            this.fuzzyArr = response.data
            cb(this.fuzzyArr)
          } else {
            cb([{ type: 0 }])
          }
        })
      } else {
        const obj = {
          keyword: this.state1
        }
        fuzzySearch(obj).then(response => {
          if (response && !_.isEmpty(response.data.datas)) {
            this.fuzzyArr = response.data.datas
            cb(this.fuzzyArr)
          } else {
            cb([{ type: 0 }])
          }
        })
      }
    },
    // 点击下拉列表
    clickFullZ(item) {
      this.state1 = item.imo
      this.state1 = ''
      store.dispatch('setImo', item.imo)
      // this.$router.push({name:'shipsSearch', params:{imo:this.state1}})
      var obj = {
        imo: item.imo,
        matchkey: item.matchkey
      }
      findShip(obj).then(response => {
      })
    },
    // 排名搜索
    topSearch() {
      searchHistory().then(response => {
        if (response && !_.isEmpty(response.data.datas)) {
          this.fuzzyArr = response.data.datas
        }
      })
    }
  }
}
</script>
<style>
.search-port .el-input--medium .el-input__inner {
    margin: 8px 0px;
    width: 504px;;
    height: 30px;
    line-height: 30px;
    background-color: transparent;
    border: 1px solid #4f4f4f;
    font-size: 12px;
    color: #fff;
}
.language-en .search-port .el-input--medium .el-input__inner {
    margin:8px 0px;
    width: 631px;
    height: 30px;
    line-height: 30px;
    background-color: transparent;
    border: 1px solid #4f4f4f;
    font-size: 12px;
}
.search-port .el-input__suffix {
    right: 15px;
    -webkit-transition: all .3s;
    transition: all .3s;
}
.search-port ul{
  background-color: red;
}
.search-port svg {
    width: 20px;
    height: 20px;
    color: #fff;
    position: absolute;
    top: 22px;
    right: 7px;
}
.name {
  float: left;
}
.addr {
  float: right;
}
.search-port .el-autocomplete-suggestion__wrap{
  background: #878787;
  border: none;
}
.el-autocomplete-suggestion .el-autocomplete-suggestion__list{
  padding: 0 10px;
}
.el-autocomplete-suggestion li{
  color: #000;
  padding: 0 10px;
}
.search-port .el-autocomplete-suggestion li.highlighted, .el-autocomplete-suggestion li:hover {
    background-color: #0d57c5;
    color: #fff;
}

.el-autocomplete-suggestion__wrap {
  padding: 10px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: auto;
  background-color: rgba(33,33,33,.7);
  border: 1px solid rgba(33,33,33,.7);
  border-radius: 4px;
}
.el-autocomplete-suggestion li{
  color: #fff
}
.el-autocomplete-suggestion li.highlighted {
    background-color: #29589e;
}
.no-data {
  text-align: center;
  margin-bottom: 10px;
}
/* .el-popper[x-placement^="bottom"] .popper__arrow::after {
    top: 1px;
    margin-left: -6px;
    border-top-width: 0;
    border-bottom-color:  rgba(33,33,33,.7);
} */
.el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
    /* top: -6px;
    left: 50%;
    margin-right: 3px;
    border-top-width: 0;
    border-bottom-color: rgba(33,33,33,.7); */
}
</style>
