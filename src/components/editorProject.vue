<template>
  <div>
    <div class="editorTop">
      <sapn>当前位置：</sapn>
      <el-breadcrumb class="breadcrumbEditor" separator=">">
        <el-breadcrumb-item>公司设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/ProjectMangement' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="editorTitle">编辑项目</div>
    <el-tabs v-model="activeName" class="tabsEditor" type="card">d
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="form">
          <el-form-item label="公司ID*" :label-width="formLabelWidth">
            <el-input class="increaseInput" disabled="disabled" v-model="companyId"></el-input>
          </el-form-item>
          <el-form-item label="编号*" :label-width="formLabelWidth">
            <el-input class="increaseInput" disabled="disabled" v-model="projectId"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="projectName" placeholder="项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目地址" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="projectUrl" placeholder="项目地址"></el-input>
          </el-form-item>
          <el-form-item label="上线时间" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="onlineTime"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button :to="{ path: '/ProjectMangement' }">取 消</el-button>
          <el-button type="primary" @click="putEditorProjectInfo">保 存</el-button>
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
  const PREFIX = 'http://localhost:8089/hrms/';
  export default {
    data() {
      return {
        activeName: 'first',
        formLabelWidth: '70px',
        companyId: COMPANYID,
        projectId: this.$route.query.projectOriginalInfo.projectId,
        projectName: this.$route.query.projectOriginalInfo.projectName,
        projectUrl: this.$route.query.projectOriginalInfo.projectUrl,
        onlineTime: this.$route.query.projectOriginalInfo.onlineTime,
      }
    },
    created: function() {
    },
    methods: {
      //编辑成员信息(success)
      putEditorProjectInfo() {

        let form = {
          companyId: this.companyId,
          projectId: this.projectId,
          projectName: this.projectName,
          projectUrl: this.projectUrl,
          onlineTime: this.onlineTime
        };
        let obj = JSON.stringify(form);
        //提交请求
        this.$axios.put(PREFIX+'project/project.do',{
          companyId:this.companyId,
          projectId: this.projectId,
          projectName: this.projectName,
          projectUrl: this.projectUrl,
          onlineTime: this.onlineTime
        })
          .then( (response) => {
            console.log(response);
            this.$router.push({ name: 'ProjectManagement', params: { changedInfo:obj } });
          })
          .catch( (error) => {
            console.log(error);
          });
      }
    }
  }
</script>
