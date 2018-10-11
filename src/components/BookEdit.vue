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
          <el-form-item label="学号*" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="正确填写学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="登录邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="radio" label="1">男</el-radio>
            <el-radio v-model="radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="职位" :label-width="formLabelWidth">
            <el-input class="increaseInput"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input class="increaseInput"></el-input>
          </el-form-item>
          <el-form-item label="专业" :label-width="formLabelWidth">
            <el-input class="increaseInput"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button >取 消</el-button>
          <el-button type="primary">保 存</el-button>
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
export default {
   data() {
      return {
        activeName: 'first',
        formLabelWidth: '70px',
        radio: '1'
      }
    },
  methods: {

  }
}
</script>
