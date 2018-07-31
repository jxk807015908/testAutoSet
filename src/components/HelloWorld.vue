<template>
  <div class="hello">
    <el-select :loading="true">
      <el-option v-for="(obj,index) in abnormalLinkArr" :label="obj.label" :value="obj.value" :key="index"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      abnormalLinkArr: [{
        label: '全部',
        value: ''
      }, {
        label: '入库',
        value: 0
      }, {
        label: '盘点',
        value: 1
      }, {
        label: '提货',
        value: 2
      }]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
