<template>
  <div class="ship-plate" :style="{left: isLanguageZh ? '534px' : '661px',top:'98px'}">
    <ship-hall-table :tableDataLength='5' v-if="shipHallSearch && shipHallSearch.datas.length > 0" :isSmall="true"></ship-hall-table> 
    <div class="ship-plate-no-data" v-if="!shipHallSearch || shipHallSearch.datas.length < 1">
      {{$t(`shipHall.noData`)}}
    </div>
    <div class="ship-plate-btns">
      <span  v-if="shipHallSearch && shipHallSearch.datas.length > 0" @click="mapShipHallMore">{{$t(`shipHall.SeeMore`)}}</span>
      <span @click="closeShipPlate">{{$t(`shipHall.close`)}}</span>
    </div>
  </div>
</template>
<script>
import shipHallTable from '@/components/ShipHallTable'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'shipPlate',
  data() {
    return {
    }
  },
  components: {
    shipHallTable
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    },
    ...mapGetters([
      'shipHallSearch'
    ])
  },
  methods: {
    mapShipHallMore() {
      const href = this.$router.resolve({ name: 'shipHall' })
      window.open(href.href)
    },
    closeShipPlate() {
      this.$router.push({ name: 'ship' })
    }
  },
  mounted() {
    if (!this.shipHallSearch) {
      this.$store.dispatch('shipHallSearch', { isSmall: true }).then((data) => {
      })
    }
  }
}
</script>
<style>
.ship-plate {
  position: absolute;
  z-index: 1;
  background: rgba(33,33,33,0.80);
}
.ship-plate .scroll-bar{
  height: 44px;
  line-height: 44px;
}
.ship-plate .ship-plate-no-data {
  width: 766px;
  color: #fff;
  padding: 20px;
  font-size: 14px;
  text-align: center;
}
.ship-plate .ship-plate-btns {
  text-align: right;
  color: #fff;
  font-size: 12px;
  padding: 20px;
  cursor: pointer;
}
.ship-plate .ship-plate-btns span:nth-child(1){
  margin-right: 40px;
}
</style>
