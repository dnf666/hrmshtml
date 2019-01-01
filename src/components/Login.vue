<template>
  <div class="box">
    <el-card class="box-card">
      <div class="title">欢迎来到HRMS</div>
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
      <el-button class="loginbutton" type="primary" @click="onSubmit">登陆</el-button>
      <div class="footer">还没有账号？<router-link class="reg" to="/register">注册公司</router-link></div>
  </el-card>
  </div>
</template>

<script>
  const PREFIX = 'http://localhost:8089';
export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    onSubmit() {
      let that = this;
      //提交请求
      this.$axios.post(PREFIX+'/hrms/company/login.do', {
        email: this.email,
        password: this.password
      })
      .then((response)=> {
        if (response.data.status == 0) {
          that.$store.commit('setIsLogin', true);
          that.$store.commit('setCompanyId',this.email);
          window.sessionStorage.setItem('isLogin', true);
          window.sessionStorage.setItem('companyId',this.email);
          that.$router.push({path: '/home'})
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
    // //验证密码
    // ckPwd(str) {
    //   var myreg = /^[0-9a-z]{6,20}$/;
    //   return myreg.test(str);
    // },
    // //验证邮箱
    // ckMail(str) {
    //   var myreg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
    //   return myreg.test(str);
    // }
  }
};
</script>

<style>
.box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  display: flex;
  justify-content: center;
  font-size: 24px;
}
.text {
  font-size: 14px;
  width: 300px;
}

.item {
  padding: 18px 0;
}

.box-card {
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
