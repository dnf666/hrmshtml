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
    <el-tabs v-model="activeName" class="tabsEditor" type="card">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="form">
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="name" placeholder="项目名称"></el-input>
          </el-form-item>
          <el-form-item label="项目Ip" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="ip" placeholder="项目地址"></el-input>
          </el-form-item>
          <el-form-item label="项目端口" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="ports"></el-input>
          </el-form-item>
          <el-form-item label="项目路径" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="location"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button @click="returnProject">取 消</el-button>
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

var COMPANYID = window.sessionStorage.getItem('companyId')
const PREFIX = 'http://localhost:8081/hrms/'
export default {
  data () {
    return {
      activeName: 'first',
      formLabelWidth: '70px',
      companyId: COMPANYID,
      projectId: this.$route.query.projectOriginalInfo.projectId,
      name: this.$route.query.projectOriginalInfo.name,
      ip: this.$route.query.projectOriginalInfo.ip,
      ports: this.$route.query.projectOriginalInfo.ports,
      location: this.$route.query.projectOriginalInfo.location
    }
  },
  created: function () {
  },
  methods: {
    returnProject(){
      this.$router.push({ name: 'ProjectManagement'});
    },
    // 编辑成员信息(success)
    putEditorProjectInfo () {
      let form = {
        companyId: this.companyId,
        projectId: this.projectId,
        name: this.name,
        ip: this.ip,
        ports: this.ports,
        location: this.location
      }
      let obj = JSON.stringify(form)
      // 提交请求
      this.$axios.put(PREFIX + 'project/project.do', {
        companyId: this.companyId,
        projectId: this.projectId,
        name: this.name,
        ip: this.ip,
        ports: this.ports,
        location: this.location
      })
        .then((response) => {
          console.log(response)
          this.$router.push({ name: 'ProjectManagement', params: { changedInfo: obj } })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
