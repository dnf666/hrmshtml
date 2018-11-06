<template>
  <div class="box">
    <el-card class="box-card">
      <div class="title">欢迎注册</div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="50"></el-progress>
      <div class="prog">
        <span></span>
        <span>完善资料</span>
        <span>注册成功</span>
      </div>
    <!-- <router-view/> -->
    <router-view> </router-view>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      value: 75
    }
  },
  // show1(e){
  //   console.log(e);
  // }
}
</script>

<style>
.title {
  display: flex;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 10px;
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
.tip {
  font-size: 12px;
  color: red;
}

</style>
