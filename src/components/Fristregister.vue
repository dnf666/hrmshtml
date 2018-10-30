<template>
<div>
        <div class="inputbox">
        <div class="info st">公司信息</div>
        <el-input class="ip st" v-model="company"  v-on:input="changeCompany" placeholder="公司组织或名称"></el-input>
        <span class="tip st">{{ companyTips }}</span>
        
        <!-- 级联选择器 -->
        <el-cascader
          class="st"
          :options="options"
          v-model="hy"
          @change="handleChange"
        >
        </el-cascader>
        <span class="tip st">{{ hyTips }}</span>

        <el-select class="st" v-model="companySize" @change="changeCompanySize" placeholder="公司规模">
        <el-option
          v-for="item in companyType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          >
        </el-option>
      </el-select>
      <span class="tip st">{{ companySizeTips }}</span>

      <!-- 个人信息 -->
      <div class="info st">个人信息</div>

      <el-input class="st" v-model="name" v-on:input="changeName" placeholder="你的工作称昵"></el-input>
      <span class="tip st">{{ nameTips }}</span>
      <el-input class="st" v-model="email" v-on:input="changeEmail" placeholder="你的邮箱"></el-input>
      <span class="tip st">{{ emailTips }}</span>
      <el-input class="st" v-model="password" type="password" v-on:input="changePassword" placeholder="你的密码(包含数字、字母至少6位)"></el-input>
      <span class="tip st">{{ passwordTips }}</span>
      <el-checkbox class="st gre" @change="changeGre" v-model="gre">阅读并同意<el-button type="text" @click="open" class="xy">《哈哈哈哈哈服务协议》</el-button></el-checkbox>
      <el-button type="primary" class="st next" :disabled="isdisabledFn"  v-on:click="next">下一步</el-button>
      </div>
</div>
</template>

<script>
    //验证是否能下一步
    let isnext = (that) => {
      for(var i = 0; i< 6; i ++) {
        if(that.isnext[i] == true) {
          return;
        } 
      }
      if (that.gre == false) {
        that.isdisabledFn = true;
        return;
      } else {
        that.isdisabledFn = false;
      }

    };
/* eslint-disable */

export default {
  name: 'Fristregister',
  data() {
    return {
      company: '',
      companyTips: '',
      hy: [],
      hyTips: '',
      companySize: '',
      companySizeTips: '',
      options: [
        {
        value: 'zhinan',
        label: '指南',
        children: [
          {
            value: 'shejiyuanze',
            label: '设计原则',
          }, 
          {
            value: 'daohang',
            label: '导航',
        }]
        }, 
        {
          value: 'zujian',
          label: '组件',
          children: [
          {
            value: 'basic',
            label: 'Basic',
          }, 
          {
            value: 'form',
            label: 'Form',
          }, {
              value: 'data',
              label: 'Data',
          }]
        }],
        companyType: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        cpTips: '不能为空',

        //工作昵称
        name: '',
        email: '',
        password: '',
        gre: false,
        nameTips: '',
        emailTips: '',
        passwordTips: '',
        isnext: [true, true, true, true, true, true],
        isdisabledFn: true
    }
  },
  methods: {
      //验证公司名
  changeCompany(e){
    this.isnext[0] = true;
    this.isdisabledFn = true;
    function ckName(str) {
        var reg = /^[\u4E00-\u9FA5]+$/; //全都是汉字
        return reg.test(str);
    }
    if (e == '') {
      this.companyTips = '请输入公司名';
      return;
    }   
    if (ckName(e)) {
      this.companyTips = ' ';
      this.isnext[0] = false;
      isnext(this);
    } else {
      this.companyTips = '您输入的公司名有误'
    }
  },
    //选择行业
    handleChange(value) {
      this.isnext[1] = false;
       isnext(this);
      console.log(value);
    },
    //选择公司规模
    changeCompanySize(e) {
      this.isnext[2] = false;
      isnext(this);
      console.log(e);
    },
    open() {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${ action }`
          });
        }
      });
  },
    //验证用户名
  changeName(e) {
    this.isdisabledFn = true;
    this.isnext[3] = true;
    function ckName(str) {
        var reg = /^[\u4E00-\u9FA5]+$/; //全都是汉字
        return reg.test(str);
    }
    if(this.name == '') {
      this.nameTips = ''
      return;
    }
    if(ckName(e)) {
      this.nameTips = ' ';
      this.isnext[3] = false;
      isnext(this);
    } else {
        this.nameTips = '您的输入有误';
    }
  },

  //验证邮箱
  changeEmail(e){
    this.isdisabledFn = true;
    this.isnext[4] = true;
    function ckMail(str) {
        var myreg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
        return myreg.test(str);
    }
    if (this.email == ' ') {
      this.emailTips = '';
      return;
    }
    if(ckMail(e)){
      this.isnext[4] = false;
      this.emailTips = ' ';
      isnext(this);
    } else {
      this.emailTips = '您输入的邮箱格式有误';
    }
  },

  //验证密码
  changePassword(e){
    this.isdisabledFn = true;
    this.isnext[5] = true;
    function ckPwd(str) {
    var myreg = /^[0-9a-z]{6,20}$/;
    return myreg.test(str);
    }
    if (this.password == ''){
      this.passwordTips = '';
      return;
    }
    if (ckPwd(e)){
      this.passwordTips = ' ';
      this.isnext[5] = false;
      isnext(this);
    } else {
      this.passwordTips = '您输入的密码格式有误'
    }
  },

  //是否同意协议
  changeGre(e){
    isnext(this);
  },
  //下一步
  next(e){
    this.$router.push({
      path: '/register/Secondregister'
    })
  }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.xy {
  margin: 0px;
  padding: 0px;
  font-size: 14px;
}
.gre {
  display: flex;
  align-items: center;
}
.next {
  display: flex;
  justify-content: center;
  height: 40px;
}
</style>
