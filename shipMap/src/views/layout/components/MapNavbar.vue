<template>
  <el-menu class="navbar" mode="horizontal">

    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->
    <!-- <div :class="$t('publics.icon')">
    </div> -->

    <!-- logo -->
    <li class="logoStyle">
      <a :href="config.SLD.index">
        <svg-icon class="icon" :icon-class="isLanguageZh ? 'logo' : 'logoEn'" />
      </a>
    </li>

    <li class="map-nav-link">
       <!-- 首页导航 -->
      <ul>
        <li v-for='(item, index) in navList' :key="index" :class=" (path == item.path ||  (item.path ? item.path.search(routerPath) !== -1 : false)) ? 'navCurrent' : '' ">
          <!-- {{$t(`indexRoute.routeList[${index}].text`)}} -->
          <!-- @click="goRoute(index, item)" -->
          <span v-if="item.router" @click="goRoute(index, item)">{{$t(`indexRoute.routeList[${index}].text`)}}</span>
          <a v-if="item.href" :href="item.href" target="_blank">{{$t(`indexRoute.routeList[${index}].text`)}}</a>
        </li>
        <!-- 
          <span v-if="item.router" @click="goRoute(index, item)">{{$t(`indexRoute.routeList[${index}].text`)}}</span>
          <a v-if="item.href" :href="item.href" target="_blank">{{$t(`indexRoute.routeList[${index}].text`)}}</a>
        -->
        <!-- <router-link id="roter" to="/" tag="li">地图</router-link>
        <router-link id="shipHall" to="/shipHall" tag="li">船盘大厅</router-link>
        <router-link id="mapInformation" to="/mapInformation" tag="li">资讯</router-link>
        <router-link to="/" tag="li">运费保值</router-link>
        <router-link id="Cooperative" to="/Cooperative" tag="li">合作伙伴</router-link>
        <router-link id="" to="/" tag="li">用户中心</router-link> -->
      </ul>
    </li>
   <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <li class="right-menu">
      <!-- 按钮-->
      <div class="ui-nav-buttom">
        <el-button type="info" @click="chartering">{{$t('publics.chartering')}}</el-button>
        <el-button type="warning" @click="plate">{{$t('publics.plate')}}</el-button>
      </div>

      <!-- 设置-->
      <setting class="setting"></setting>

      <!-- <error-log class="errLog-container right-menu-item"></error-log>  错误日志-->
      <!-- 全屏-->
      <el-tooltip effect="light" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <!-- 语言切换-->
      <lang-select  class="international right-menu-item"></lang-select>

      <!-- <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

       <!-- 登录退出-->
      <div class="login" v-if="getUser && getUser.status === 0" @click="logout" style="display:inline-block;color: #fff;padding: 0 10px;vertical-align: top;">{{$t('login.logInout')}}</div>
      <div class="login" v-if="getUser && getUser.status === 2" @click="login" style="display:inline-block;color: #fff;padding: 0 10px;vertical-align: top;">{{$t('login.logIn')}}</div>
      <!-- <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              {{$t('navbar.github')}}
            </el-dropdown-item>
          </a>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </li>
  </el-menu>
</template>

<script>
// import { isLogin } from '@/api/login'
import config from '@/config'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import Setting from '@/components/setting'
import navList from '@/lang/zh/indexRoute'
import i18n from '@/lang'
import {
  isI18n
} from '@/lang/index'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    LangSelect,
    ThemePicker,
    Setting
  },
  props: {
    routerPath: {
      type: String
    }
  },
  data() {
    return {
      config,
      isI18n,
      navList: navList.routeList,
      path: this.$route.path,
      routeName: '',
      isHign: true,
      loginStatus: null
    }
  },
  watch: {
    isI18n: function(newValue, oldValue) {
    },
    $route(to, from) {
      this.path = to.path
    }
  },
  computed: {
    ...mapGetters([
      // 'sidebar',
      // 'name',
      // 'avatar'
      'getUser'
    ]),
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    // logout() {
    //   this.$store.dispatch('LogOut').then(() => {
    //     location.reload()// In order to re-instantiate the vue-router object to avoid bugs
    //   })
    // },
    // 导航跳转
    goRoute(index, item) {
      if (item.router) {
        this.$router.push({ name: item.router })
        this.routeName = item.router
      } else {
        if (item.href) {
          window.location.href = item.href
        }
      }
    },
    // 租船拼船
    chartering() {
      const url = config.SLD.ship + 'page/#/bootPage?palletType=1'
      window.location.href = url
    },
    // 船盘发布
    plate() {
      const url = config.SLD.ship + 'shipPlate/shipAgentEditShipPlate.htm'
      window.location.href = url
    },
    // 判断是否登录
    islogin() {
      this.$store.dispatch('setUser').then(() => {
        if (this.getUser.status === 0) {
          window.localStorage.setItem('user', JSON.stringify(this.getUser.datas))
        }
        if (this.getUser.status === 2) {
          window.localStorage.removeItem('user')
        }
      })
    },
    // 否登录
    login() {
      if (this.getUser && this.getUser.status === 2) {
        window.location.href = config.SLD.loginUrl + encodeURIComponent(window.location.href)
      }
    },
    // 退出
    logout() {
      if (this.getUser && this.getUser.status === 0) {
        this.islogin()
        window.location.href = config.SLD.logoutUrl + encodeURIComponent(window.location.href)
      }
    }
  },
  mounted() {
    this.routeName = this.$route.name
    this.islogin()
    document.title = i18n.t('publics.iconTitle')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu--horizontal {
    border-right: none;
    border-bottom: solid 1px #181818;
}
.logoStyle{
  position: absolute;
  left: 20px;
}
.logoStyle .icon{
  width: 192px;
  height: 50px;
}
// .language-en .logoStyle .icon{
//   width: 140px;
//   height: 100px;
// }
.map-nav-link {
  display: inline-block;
    margin-left: 212px;
}
.map-nav-link ul li{
  float: left;
  list-style: none;
  // margin: 0 10px 0 10px;
  min-width: 80px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;

}
.map-nav-link ul li span,
.map-nav-link ul li a{
  display: block;
}
.language-en .map-nav-link ul li{
  float: left;
  list-style: none;
  min-width: 0px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;
}
.navbar {
  width: 100%;
  height: 56px;
  line-height: 56px;
  border-radius: 0px !important;
  background: rgba(24, 24, 24, 0.9);
  color: #fff;
  position: absolute;
   overflow: hidden;
  border-bottom: 0;
  // overflow: hidden;
  z-index: 3;
  .sr-logo{
      float: left;
      color: #fff;
      font-size: 18px;
      text-indent: 135px;
      background:url('../../../../static/images/s_logo.png') -25px center no-repeat;
      background-size:190px auto;
      width: 104px;
      height: 50px;
      margin-right: 20px;
  }
  .sr-logoEn{
      float: left;
      color: #fff;
      font-size: 18px;
      text-indent: 135px;
      background:url('../../../../static/images/s_logo_en.png') -25px center no-repeat;
      background-size:190px auto;
      width: 140px;
      height: 50px;
      margin-right: 20px;
  }

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .el-button--medium{
      font-size: 16px;
    }
    .screenfull {
      height: 20px;
      line-height: 84px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .ui-nav-buttom,.setting{
      float: left;
    }
    .ui-nav-buttom,.login{
      cursor: pointer;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
