<template>
  <div class="hello">
    <el-select v-if="flag1" :loading="true">
      <el-option v-for="(obj,index) in abnormalLinkArr" :label="obj.label" :value="obj.value" :key="index"></el-option>
    </el-select>
    <p>sadasddas</p>
    <el-input v-if="flag2"></el-input>
    <el-button @click="click">aaaaa</el-button>
  </div>
</template>
zxZ按时sd深层次
撒大声地efewasasdasddsad ds是的撒十大为不是对方爱迪生而v想
ffffffff大大胜多负萨达sda 少斯蒂芬斯蒂芬爱迪生十大阿斯顿撒旦为儿女阿萨德达
啊实打实多
<script>
  import io from 'socket.io-client';

  export default {
    name: 'HelloWorld',
    data() {
      return {
        flag1: true,
        flag2: true,
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
    },
    created() {

    },
    methods: {
      click() {
        this.flag1 = !this.flag1
        this.flag2 = !this.flag2
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
