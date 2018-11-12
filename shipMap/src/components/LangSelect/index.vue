<template>
  <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
    <div>
      <svg-icon class-name='international-icon' icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown" :class="language==='zh' ? 'currentZh': 'currentEn'">
      <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
      <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// import locale from 'element-ui/lib/locale';
export default {
  inject: ['reload'],
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      // locale.i18n((key, value) => i18n.t(key, value))
      this.$store.dispatch('setLanguage', lang)
      this.reload()
      // window.location.reload()
      // this.$message({
      //   message: 'switch language success',
      //   type: 'success'
      // })
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
  color: #ffffff
}
.el-dropdown-menu--medium.currentEn .el-dropdown-menu__item:nth-child(2){
  background-color: #ecf5ff;
  color: #66b1ff;
}
.el-dropdown-menu--medium.currentZh .el-dropdown-menu__item:nth-child(1){
  background-color: #ecf5ff;
  color: #66b1ff;
}
</style>
