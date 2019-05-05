<template>
  <div>
    <div class="editorTop">
      <span>当前位置：</span>
      <el-breadcrumb class="breadcrumbEditor" separator=">">
        <el-breadcrumb-item>公司设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/BookMangement' }">图书管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑图书</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div id="editorTitle">编辑图书</div>
    <el-tabs v-model="activeName" class="tabsEditor" type="card">
      <el-tab-pane label="基本信息" name="first">
        <el-form>
          <el-form-item label="图书名" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="登录邮箱" v-model="bookName"></el-input>
          </el-form-item>
          <el-form-item label="图书版本" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="图书版本" v-model="version"></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="类型" v-model="category"></el-input>
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="数量" v-model="quantity"></el-input>
          </el-form-item>
        </el-form>
        <div class="sure">
          <el-button type="primary" @click="returnManage">取 消</el-button>
          <el-button type="primary" @click="putEditorBookInfo">保 存</el-button>
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
        companyId:COMPANYID,
        bookId: this.$route.query.bookOriginalInfo.bookId,
        bookName: this.$route.query.bookOriginalInfo.bookName,
        category: this.$route.query.bookOriginalInfo.category,
        quantity: this.$route.query.bookOriginalInfo.quantity,
        version: this.$route.query.bookOriginalInfo.version,
        activeName: 'first',
        formLabelWidth: '70px',
      }
    },
  created(){
  },

  methods: {
    returnManage(){
      this.$router.push({ name: 'BookManagement'});
    },
    putEditorBookInfo(){
      this.$axios.put(PREFIX+"book/book.do",{
        companyId: COMPANYID,
        bookId:this.bookId,
        bookName: this.bookName,
        category: this.category,
        quantity: parseInt(this.quantity),
        version: this.version
      }).then((response)=>{
        this.$message({
          type: 'info',
          message:response.data.msg
        });
        this.$router.push({ name: 'BookManagement'});
      });
      }
  }
}
</script>
