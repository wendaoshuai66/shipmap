<template>
  <div class="side-warp-view"
       :style="{width, height, top, right}">
    <ul>
      <li v-for="(item, index) in tabList" :title='$t(`tabSide.tabList[${index}].name`)' :class=" item.path === path ? 'sideCurrent' : '' " :key="index" @click="switching(index,item.route)">
        <div class="side-img-box">
          <svg-icon class="icon-svg"  :icon-class="item.iconName" />
        </div>
        <div class="side-word-box">
        {{$t(`tabSide.tabList[${index}].name`)}}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import tabSide from '@/lang/zh/tabSide'
import i18n from '@/lang'
import config from '@/config'
import { mapGetters } from 'vuex'
export default {
  name: 'side',
  props: {
    width: String,
    height: String,
    top: String,
    right: String
  },
  computed: {
    ...mapGetters([
      'getUser'
    ])
  },
  watch: {
    $route(to, from) {
      this.path = to.path
    }
  },
  data() {
    return {
      closed: true,
      path: this.$route.path,
      tabList: tabSide.tabList
    }
  },
  mounted() {
  },
  methods: {
    switching(index, route) {
      if (index === 1) {
        if (this.getUser.status === 2) {
          this.$confirm(i18n.t('commonRemind.loginTips'), {
            confirmButtonText: i18n.t('login.logIn'),
            cancelButtonText: i18n.t('commonRemind.cancel'),
            type: 'warning'
          }).then(() => {
            window.location.href = config.SLD.loginUrl + encodeURIComponent(window.location.href)
          })
        } else {
          this.num = index
          this.$router.push({ name: route, params: { flag: 'true' }})
        }
      } else {
        this.num = index
        this.$router.push({ name: route, params: { flag: 'true' }})
      }
    }
  }
}
</script>
<style>
.side-warp-view ul,
.side-warp-view li{
  padding: 0;
  margin: 0;
  list-style: none;
}
.side-warp-view {
  position: fixed;
  z-index: 1;
  width: 36px;
  bottom: 155px;
  right: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  border-radius: 2px;
  color: #fff;
  font-family: PingFangSC-Medium;
  font-size: 12px;
  letter-spacing: 0;
  text-align: center;
  line-height: 14px;
}
.side-warp-view .side-img-box {
  width: 20px;
  height: 20px;
  margin: 4px auto;
}
.side-warp-view  .side-img-box .icon-svg {
  width: 20px;
  height: 20px;
}
.side-warp-view ul li{
  background: #212121;
  padding: 6px 4px 7px;
  cursor: pointer;
  border-bottom: 1px solid rgba(153,153,153,.1);
}
.side-warp-view .sideCurrent {
  background: rgba(33,33,33,0.80);
}
.language-en .side-warp-view ul li .side-word-box{
  display: none;
}
.language-en .side-warp-view ul li{
  height: 64.6px;
  line-height: 56.6px;
}
</style>
