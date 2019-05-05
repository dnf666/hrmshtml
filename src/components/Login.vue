<template>
  <div class="box">
    <el-card class="login-box-card">
      <div class="main_title2">欢迎来到HRMS</div>
      <el-input
        class="input"
        placeholder="请输入邮箱"
        prefix-icon="el-icon-info "
        v-model="email"
        type="email"
        v-on:input="changeEmail"
        >
      </el-input>
      <el-input
        class="input"
        placeholder="请输入密码"
        prefix-icon="el-icon-info"
        v-model="password"
        type="password"
        v-on:input="changePassword"
        >
      </el-input>
      <el-radio v-model="radio" label="2">成员</el-radio>
      <el-radio v-model="radio" label="1">管理员</el-radio>
      <el-button class="loginbutton" type="primary" @click="onSubmit">登陆</el-button>
      <div class="footer">还没有账号？<router-link class="reg" to="/register">注册</router-link></div>
  </el-card>
  </div>
</template>

<script>
  const PREFIX = 'http://localhost:8081/';
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      radio:'2'
    };
  },
  methods: {
    onSubmit() {
      let that = this;
      //提交请求
      this.$axios.post(PREFIX+'/hrms/company/login.do', {
        permission:this.radio,
        email: this.email,
        password: this.password
      })
      .then((response)=> {
        if (response.data.status == 0) {
          let permission = response.data.object.permission;
          that.$store.commit('setIsLogin', true);
          that.$store.commit('setCompanyId',response.data.object.companyId);
          that.$store.commit('setPermission',permission);
          window.sessionStorage.setItem('isLogin', true);
          window.sessionStorage.setItem('permission', permission);
          window.sessionStorage.setItem('companyId',response.data.object.companyId);
          that.$router.push({path:'/CompanyInfo'})
        }
        else {
          alert(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    },


    changeEmail(e) {

    },
    changePassword(e) {
    },
  }
};
</script>

<style>
.box {
  position: absolute;
  width: 100%;
  background-color: #F5F5F5;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main_title2 {
  font-size: 30px;
  font-weight: 500;
  margin: 50px 0 10px 30px;
  text-align: left;
}
.text {
  font-size: 14px;
  width: 300px;
}

.item {
  padding: 18px 0;
}

.login-box-card {
  width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.input {
  display: flex;
  width: 300px;
  margin-top: 30px;
}

.loginbutton {
  display: flex;
  margin-top: 30px;
  width: 300px;
  justify-content: center;
  height: 40px;
  font-size: 15px;
}
.footer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 60px;
}

a {
  font-size: 16px;
}
a:link {
  color: blue;
  text-decoration: none;
}
a:active {
  color: red;
}
a:visited {
  color: blue;
  text-decoration: none;
}
a:hover {
  color: red;
  text-decoration: underline;
}
</style>
