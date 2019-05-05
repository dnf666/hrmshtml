<template>
  <div>
    <div class="inputbox">
      <div class="info st">组织信息</div>
      <el-input class="ip st" v-model="company" v-on:input="changeCompany" placeholder="组织或名称"></el-input>
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

      <el-select class="st" v-model="companySize" @change="changeCompanySize" placeholder="组织规模">
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

      <el-input class="st" v-model="name" v-on:input="changeName" placeholder="你的中文昵称"></el-input>
      <span class="tip st">{{ nameTips }}</span>
      <el-input class="st" v-model="email" v-on:input="changeEmail" placeholder="你的邮箱"></el-input>
      <span class="tip st">{{ emailTips }}</span>
      <el-input class="st" v-model="password" type="password" v-on:input="changePassword" placeholder="你的密码(包含数字、字母至少6位，不超过20位)"></el-input>
      <span class="tip st">{{ passwordTips }}</span>
      <el-checkbox class="st gre" @change="changeGre" v-model="gre">阅读并同意
        <el-button type="text" @click="open" class="xy">《服务协议》</el-button>
      </el-checkbox>
      <el-button type="primary" class="st next" :disabled="isdisabledFn" v-on:click="next">下一步</el-button>
    </div>
  </div>
</template>

<script>
const PREFIX = 'http://localhost:8081/hrms'
// 验证是否能下一步
let isnext = (that) => {
  for (var i = 0; i < 6; i++) {
    if (that.isnext[i] == true) {
      return
    }
  }
  if (that.gre == false) {
    that.isdisabledFn = true
  } else {
    that.isdisabledFn = false
  }
}

export default {
  name: 'Fristregister',
  // todo 选项的值要改，但是后面是用接口传值的

  data () {
    return {
      company: '',
      companyTips: '',
      hy: [],
      hyTips: '',
      companySize: '',
      companySizeTips: '',
      // 这里可以设置为接口，每次都在数据库里改
      options: [
        {
          value: '互联网',
          label: '互联网',
          children: [
            {
              value: '电子商务',
              label: '电子商务'
            },
            {
              value: '网络安全',
              label: '网络安全'
            },
            {
              value: '软件研发',
              label: '软件研发'
            },
            {
              value: '硬件',
              label: '硬件'
            }]
        }
      ],
      companyType: [{
        value: '小于50',
        label: '小于50'
      }, {
        value: '51-100',
        label: '51-100'
      }, {
        value: '100-1000',
        label: '100-1000'
      }, {
        value: '1000+',
        label: '1000+'
      }],
      value: '',
      cpTips: '不能为空',

      // 工作昵称
      name: '',
      email: '',
      password: '',
      mainCategory: '',
      viceCategory: '',
      gre: false,
      nameTips: '',
      emailTips: '',
      passwordTips: '',
      isnext: [true, true, true, true, true, true],
      isdisabledFn: true
    }
  },
  methods: {
    // 验证公司名
    changeCompany (e) {
      this.isnext[0] = true
      this.isdisabledFn = true

      function ckName (str) {
        var reg = /^[\u4E00-\u9FA5]+$/ // 全都是汉字
        return reg.test(str)
      }

      if (e == '') {
        this.companyTips = '请输入公司名'
        return
      }
      if (ckName(e)) {
        this.companyTips = ' '
        this.isnext[0] = false
        isnext(this)
      } else {
        this.companyTips = '您输入的公司名有误'
      }
    },
    // 选择行业
    handleChange (value) {
      this.isnext[1] = false
      isnext(this)
      console.log(value)
      this.mainCategory = value[0]
      this.viceCategory = value[1]
    },
    // 选择公司规模
    changeCompanySize (e) {
      this.isnext[2] = false
      isnext(this)
    },
    open () {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    },
    // 验证用户名
    changeName (e) {
      this.isdisabledFn = true
      this.isnext[3] = true

      function ckName (str) {
        var reg = /^[\u4E00-\u9FA5]+$/ // 全都是汉字
        return reg.test(str)
      }

      if (this.name == '') {
        this.nameTips = ''
        return
      }
      if (ckName(e)) {
        this.nameTips = ' '
        this.isnext[3] = false
        isnext(this)
      } else {
        this.nameTips = '您的输入有误,名字全为中文'
      }
    },

    // 验证邮箱
    changeEmail (e) {
      this.isdisabledFn = true
      this.isnext[4] = true

      function ckMail (str) {
        var myreg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/
        return myreg.test(str)
      }

      if (this.email == ' ') {
        this.emailTips = ''
        return
      }
      if (ckMail(e)) {
        this.isnext[4] = false
        this.emailTips = ' '
        isnext(this)
      } else {
        this.emailTips = '您输入的邮箱格式有误'
      }
    },

    // 验证密码
    changePassword (e) {
      this.isdisabledFn = true
      this.isnext[5] = true

      function ckPwd (str) {
        var myreg = /^[0-9a-z]{6,20}$/
        return myreg.test(str)
      }

      if (this.password == '') {
        this.passwordTips = ''
        return
      }
      if (ckPwd(e)) {
        this.passwordTips = ' '
        this.isnext[5] = false
        isnext(this)
      } else {
        this.passwordTips = '您输入的密码格式有误'
      }
    },

    // 是否同意协议
    changeGre (e) {
      isnext(this)
    },
    // 下一步
    next (e) {
      let that = this
      this.$axios.post(PREFIX + '/company/register.do',
        {
          email: this.email,
          password: this.password,
          organizationSize: this.companySize,
          name: this.company,
          mainCategory: this.mainCategory,
          viceCategory: this.viceCategory,
          applicantName: this.name
        }).then((response) => {
        if (response.data.status == 0) {
          that.$store.commit('setCompanyId', that.email)
          window.sessionStorage.setItem('companyId', that.email)
          that.$store.commit('setPermission', 1)
          window.sessionStorage.setItem('permission', 1)
          this.$router.push({
            path: '/register/Secondregister'
          })
        } else {
          alert(response.data.message)
        }
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

  .prog span {
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
