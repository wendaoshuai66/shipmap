<template>
  <div class="TextScroll">
      <transition-group tag="ul" :name="scrollType">
        <li v-for="(item,index) in items"
          :key='index'
          v-show="index==count"
          @click="itemClick(index)"
          @mouseover="hoverEvent"
          @mouseout="startScroll">
            <p>
              <span>{{item.name}}</span>
              <span>{{item.type}}</span>
              <span>{{item.position}}</span>
              <span>{{item.open}}</span>
              <span>{{item.eta}}</span>
              <span>{{item.etaCabinda}}</span>
              <span>{{isLanguageZh ? item.epMemberName : item.epMemberNameEn}}</span>
            </p>
        </li>
      </transition-group>
  </div>
</template>

<script>
export default {
  name: 'scrollText',
  props: {
    items: Array,
    beforeClick: Function,
    scrollType: {
      type: String,
      default: 'scroll-up'
    }
  },
  data() {
    return {
      count: 0, // 当前索引  当v-for中的index等于count时 v-show=true 即显示当前元素
      intervalId: null, // 定时器ID
      playTime: 2000 // 定时器执行间隔
    }
  },
  created() {
    this.startScroll()
  },
  computed: {
    isLanguageZh() {
      return this.$store.getters.language === 'zh'
    }
  },
  methods: {
    getText() {
      const len = this.items.length
      if (len === 0) {
        return // 当数组为空时，直接返回
      }
      if (this.count === len - 1) { // 当前为最后一个时
        this.count = 0 // 从第一个开始
      } else {
        this.count++ // 自增
      }
    },
    hoverEvent() {
      clearInterval(this.intervalId)
    },
    itemClick(index) {
      this.beforeClick(index)
    },
    startScroll() {
      // 根据不同的动画效果，指定不同的动画时间，可配合底部的css样式修改
      switch (this.scrollType) {
        case 'scroll-up':this.playTime = 2000
          break
        case 'scroll-up-linear':this.playTime = 1000
          break
        case 'scroll-left':this.playTime = 2000
          break
        case 'scroll-left-linear':this.playTime = 4000
          break
        default:this.playTime = 2000
          break
      }
      this.intervalId = setInterval(() => { // 定义定时器
        this.getText()
      }, this.playTime)
    }
  },
  destroyed() {
    clearInterval(this.intervalId) // 清除定时器
  }
}
</script>

<style lang="css">
  .TextScroll{
      width: 100%;
  }
  .TextScroll ul{
      position: relative;
      width: 100%;
      height: 44px;
      overflow: hidden;
  }
  .TextScroll li{
      width: 100%;
      height: 44px;
      line-height: 44px;
      overflow: hidden;
      position: absolute;
  }
  .TextScroll li p{
      padding:0 ;
      margin: 0;
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
  .TextScroll li p span {
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
  }
  /* 向上滚动动画 */
  .scroll-up-enter-active,
  .scroll-up-leave-active{
      transition: all .5s ease;
  }
  .scroll-up-enter{
      transform: translate3d(0,100%,0);
  }
  .scroll-up-leave-to{
      transform: translate3d(0,-100%,0);
  }
  /* 向上匀速滚动动画 */
  .scroll-up-linear-enter-active,
  .scroll-up-linear-leave-active{
      transition: all 1s linear;  /*此时间必须和 playTime 保持一致*/
  }
  .scroll-up-linear-enter{
      transform: translate3d(0,100%,0);
  }
  .scroll-up-linear-leave-to{
      transform: translate3d(0,-100%,0);
  }
  /* 向左滚动动画 */
  .scroll-left-enter-active,
  .scroll-left-leave-active{
      transition: all 1s ease;
  }
  .scroll-left-enter{
      transform: translate3d(100%,0,0);
  }
  .scroll-left-leave-to{
      transform: translate3d(-100%,0,0);
  }
  /* 向左匀速滚动动画 */
  .scroll-left-linear-enter-active,
  .scroll-left-linear-leave-active{
      transition: all 4s linear;   /*此时间必须和 playTime 保持一致*/
  }
  .scroll-left-linear-enter{
      transform: translate3d(100%,0,0);
  }
  .scroll-left-linear-leave-to{
      transform: translate3d(-100%,0,0);
  }
</style>
