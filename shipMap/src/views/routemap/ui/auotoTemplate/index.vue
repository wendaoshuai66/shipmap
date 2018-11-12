<template>
  <div>
    <div class="search_auto_template">
      <input type="text"
      v-model="inputValue"
      @input=" input">

      <div v-show="datas.length">
          <slot name="lis"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    change: Function,
    index: Number,
    datas: Array
  },
  data() {
    return {
      inputValue: ''
    }
  },
  methods: {
    input() {
      this.inputValue
      this.change(this.inputValue,this.index)
    }
  }
}
</script>
<style>
.search_auto_template input{
  width: 150px;
  height: 30px;
  background: transparent;
  border: none;
}
</style>


