<template>
  <div>
      <div v-map-drag-dialog="drag ? drag : 0" v-map-drop="drop ? drop : 0" :class="ClassName"
      :style="{ width, left, top, bottom ,right,minWidth,minHeight}" v-show="visible" ref="dialog">
         <header class="map_dialog_title">
            <slot name="title"></slot>
            <i @click="handleClose($event)" class="close"><svg-icon   icon-class="close" /></i>
            <i @click="miniClose" class="minimize" v-show='minimize'><svg-icon   icon-class="minimize" /></i>
         </header>
         <main>
            <slot></slot>
         </main>
         <footer class="map_dialog_footer">
            <slot name="footer"></slot>
         </footer>
    </div>
  </div>

</template>
<script>
import mapDragDialog from '@/directive/map-dragDialog'
import mapDrop from '@/directive/drop'
import store from '@/store'
export default {
  name: 'mapDialog-demo',
  directives: {
    mapDragDialog,
    mapDrop
  },
  props: {
    dialogTableVisible: {
      type: Boolean
    },
    // 弹窗显示隐藏参数
    visible: {
      type: Boolean
    },
    // 弹窗宽度
    width: {
      type: String
    },
    // 弹窗最小宽度
    minWidth: {
      type: String
    },
    // 弹窗最小高度
    minHeight: {
      type: String
    },
    // 关闭
    beforeClose: {
      type: Function
    },
    left: {
      type: String
    },
    right: {
      type: String
    },
    top: {
      type: String
    },
    bottom: {
      type: String
    },
    // 是否拖拽
    drag: {
      type: [Object, Number]
    },
    // 是否缩小
    drop: {
      type: [Object, Number]
    },
    selfClass: {
      type: String
    },
    minimize: Boolean,
    minimizePramas: Object,
    isMinimizePramas: {
      type: Boolean,
      default: true
    },
    beforeMinimize: Function
  },
  data() {
    return {
      closed: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper)
        if (!this.closed) this.$emit('close')
      }
    }
  },
  computed: {
    ClassName() {
      return 'map_dialog ' + this.selfClass
    }
  },
  methods: {
    handleClose: function handleClose(e) {
      e.stopPropagation()
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide: function hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    updatePopper: function updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper')
      this.broadcast('ElDropdownMenu', 'updatePopper')
    },
    miniClose(data, d) {
      if (typeof this.beforeMinimize === 'function') {
        if (this.isMinimizePramas) {
          store.dispatch('minimizeWindows', this.minimizePramas)
        }
        this.beforeMinimize(this.hide)
      } else {
        this.hide()
      }
    }
  },
  mounted() {}
}
</script>
<style>
.map_dialog {
  /* position: relative; */
  /* width: 500px; */
  /* height: 200px; */
  position: absolute;
  background-color: rgba(33, 33, 33, .8);
  /* top:100px;
  left: 50%; */
  z-index:3;
  overflow: hidden;
}
.maxIndex {
  z-index: 999
}

.map_dialog_content{
  height: 150px;
  width: 100%;
  background: blueviolet;
}
.map_dialog_footer{
  padding: 10px;
  text-align: center;
}
.el-dialog__headerbtn {
  top: 15px;
}
.map_dialog_title i{
  display: inline-block;
  width: 30px;
  height: 30px;
  color: #fff;
  position: absolute;
  top: 10px;
  right:36px;
  cursor: pointer;
  z-index: 9999;
}
.map_dialog_title .close{
  right:10px;
  font-weight: 700;
}
</style>
