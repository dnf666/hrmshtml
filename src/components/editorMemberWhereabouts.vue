<template>
  <div>
    <div class="editorTop">
      <sapn>当前位置：</sapn>
      <el-breadcrumb class="breadcrumbEditor" separator=">">
        <el-breadcrumb-item>公司设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/MemberMangement' }">成员管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑成员</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="editorTitle">编辑成员</div>
    <el-tabs v-model="activeName" class="tabsEditor" type="card">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="form">
          <el-form-item label="公司" :label-width="formLabelWidth">
            <el-input class="increaseInput" disabled="disabled" v-model="companyId"></el-input>
          </el-form-item>
          <el-form-item label="学号*" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="num" disabled="disabled" placeholder="正确填写学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="name" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="email" placeholder="登录邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="0">男</el-radio>
            <el-radio v-model="radio" label="1">女</el-radio>
          </el-form-item>
          <el-form-item label="职位" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="workPlace"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="年级" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="grade"></el-input>
          </el-form-item>
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="profession"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button >取 消</el-button>
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

  const COMPANYID = '1204695257@qq.com'
  const PREFIX = 'http://localhost:8089/';
  export default {
   data() {
      return {
        activeName: 'first',
        formLabelWidth: '70px',
        radio: '0',
        companyId: this.$route.query.memberOriginalInfo.companyId,
        num: this.$route.query.memberOriginalInfo.num,
        name: this.$route.query.memberOriginalInfo.name,
        email: this.$route.query.memberOriginalInfo.email,
        sex: this.$route.query.memberOriginalInfo.sex,
        profession: this.$route.query.memberOriginalInfo.profession,
        department: this.$route.query.memberOriginalInfo.department,
        workPlace: this.$route.query.memberOriginalInfo.workPlace,
        grade: this.$route.query.memberOriginalInfo.grade,
        phoneNumber: this.$route.query.memberOriginalInfo.phoneNumber
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
    putEditorMemberInfo() {
      //提交请求
      this.$axios.put(PREFIX+'hrms/work/work.do',{
          companyId: this.companyId,
          num: this.num,
          name: this.name,
          email: this.email,
          sex: this.radio,
          profession: this.profession,
          department: this.department,
          workPlace:this.workPlace,
          grade: this.grade,
          phoneNumber: this.phoneNumber
      })
      .then( (response) => {
        console.log('编辑成员成功');
        this.$router.push({ name: 'MemberMangement', params: { changedInfo:obj } });
      })
      .catch( (error) => {
        console.log(error);
      });
    }
  }
}
</script>
