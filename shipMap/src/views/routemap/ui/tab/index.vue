<template lang="html">
  <div class="">
    <div class="tab-ui-content">
      <header slot="title">
        <slot name="header"></slot>
      </header>
      <main>
         <slot></slot>
      </main>
      <footer slot="footer" >
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script>
import tabNav from '@/lang/zh/tabNav'
export default {
  data() {
    return {
      tabList: tabNav.tabList
    }
  }
}
</script>

<style lang="css">

.tab-ui-content {
  position: absolute;
  width: 504px;
  background: rgba(33,33,33,0.80);
  top: 99px;
  left: 20px;
  z-index: 1;
  /* top: 10px;
  left: 20px; */
}
.language-en .tab-ui-content {
  position: absolute;
  width: 631px;
  background: rgba(33,33,33,0.80);
  top: 99px;
  left: 20px;
  z-index: 1;
  /* top: 10px;
  left: 20px; */
}
</style>
