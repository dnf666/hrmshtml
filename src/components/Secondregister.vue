<template>
  <div class="box">
    <el-card class="box-card">
      <div class="title">注册成功</div>
      <el-table
    v-loading="loading"
    style="width: 100%">
  </el-table>

  <div class="tips">
    {{ number }}秒后自动跳转到主页
  </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Secondregister',
  data() {
    return {
      value: 75,
      loading: true,
      number: 3
    }
  },
  mounted() {
    let that = this;
    let timer = setInterval(function() {
      that.number = that.number - 1;
      if(that.number <= 0) {
        clearInterval(timer);
        that.$router.push({ path: '/home' })
      }
    },1000)
  },


}
</script>

<style>
.el-card__body {
  width: 60%;
}
.title {
  display: flex;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 10px;
  color:#409EFF
}
.box {
  position:absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.box-card {
  width: 700px;
  display: flex;
  justify-content: center;
}
.prog {
  display: flex;
  justify-content: space-between;
}
.prog span{
  display: flex;
  width: 100px;
  height: 50px;
  justify-content: center;
  color: #409EFF;
}
.inputbox {
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  justify-content: flex-start;
}
.el-card__body {
  position: relative;
  margin: 0px auto;
}
.info {
  display: flex;
  justify-content: flex-start;
}
.st {
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
}
.tips {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

</style>
