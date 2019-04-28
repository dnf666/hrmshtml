<template>
  <div>
    <div class="editorTop">
      <span>当前位置：</span>
      <el-breadcrumb class="breadcrumbEditor" separator=">">
        <el-breadcrumb-item>公司设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/MemberMangement' }">成员管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑成员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="editorTitle">编辑成员</div>
    <el-tabs v-model="activeName" class="tabsEditor" type="card">
      <el-tab-pane label="基本信息" name="first">
        <el-form>
          <el-form-item label="学号*" :label-width="formLabelWidth">
            <el-input class="increaseInput" disabled="disabled" v-model="num" placeholder="正确填写学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="name" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱*" :label-width="formLabelWidth">
            <el-input class="increaseInput" disabled="disabled" v-model="email" placeholder="登录邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="0">男</el-radio>
            <el-radio v-model="radio" label="1">女</el-radio>
          </el-form-item>
          <el-form-item label="部门" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="department"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="profession"></el-input>
          </el-form-item>
          <el-form-item label="签约" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="whereAbout"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button @click = "returnMemberMangement">取 消</el-button>
          <el-button type="primary" @click="putEditorMemberInfo">保 存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
  .editorTop{
    margin: 20px 20px;
  }
  .breadcrumbEditor{
    display: inline-block;
  }
  #editorTitle{
    margin: 20px 20px;
  }
  .tabsEditor{
    margin: 20px 20px;
  }
  .increaseInput{
    width:260px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .sure{
    margin-left: 90px;
    margin-top: 20px;
  }
</style>
<script>

  var COMPANYID = window.sessionStorage.getItem("companyId");
  const PREFIX = 'http://localhost:8081/hrms/';
export default {
  data() {
    return {
      activeName: 'first',
      formLabelWidth: '70px',
      radio: this.$route.query.memberOriginalInfo.radio,
      companyId: this.$route.query.memberOriginalInfo.companyId,
      num: this.$route.query.memberOriginalInfo.num,
      name: this.$route.query.memberOriginalInfo.name,
      email: this.$route.query.memberOriginalInfo.email,
      sex: this.$route.query.memberOriginalInfo.sex,
      profession: this.$route.query.memberOriginalInfo.profession,
      department: this.$route.query.memberOriginalInfo.department,
      grade: this.$route.query.memberOriginalInfo.grade,
      phoneNumber: this.$route.query.memberOriginalInfo.phoneNumber,
      whereAbout:this.$route.query.memberOriginalInfo.whereAbout
    }
  },
  created: function() {
    if(this.$route.query.memberOriginalInfo.sex == '女'){
      this.radio = '1';
    }
    else{
      this.radio = '0';
    }
  },
  methods: {
    //编辑成员信息(success)
    returnMemberMangement(){
      this.$router.push({ name: 'MemberMangement'});
    },
    putEditorMemberInfo() {
      if (this.radio == '0'){
        this.sex = '男'
      }
      if (this.radio == '1'){
        this.sex='女'
      }
      let form = {
        companyId: this.companyId,
        num: this.num,
        name: this.name,
        email: this.email,
        sex: this.sex,
        profession: this.profession,
        department: this.department,
        grade: this.grade,
        phoneNumber: this.phoneNumber,
        whereAbout:this.whereAbout
      };
      let obj = JSON.stringify(form);
      //提交请求
      this.$axios.put(PREFIX+'member/member.do?companyId='+COMPANYID,{
          companyId: this.companyId,
          num: this.num,
          name: this.name,
          email: this.email,
          sex: this.sex,
          profession: this.profession,
          department: this.department,
          grade: this.grade,
          phoneNumber: this.phoneNumber,
          whereAbout:this.whereAbout

      })
      .then( (response) => {
        this.$router.push({ name: 'MemberMangement', params: { changedInfo:obj } });
      })
      .catch( (error) => {
        console.log(error);
      });
    }
  }
}
</script>
