<template>
  <div>
    <router-view />
    <div class="top">图书管理</div>
    <div class="contentB">
      <p>信管工作室</p>
      <el-dropdown split-button type="primary" class="moreMenu" @click="dialogFormVisible = true">
        添加借书记录
        <el-dialog title="添加借书记录" :visible.sync="dialogFormVisible" :append-to-body='true' top='100px' width="550px" center>
          <el-form :model="form">
            <el-form-item label="公司编号" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder=" " v-model="addCompanyId"></el-input>
            </el-form-item>
            <el-form-item label="图书名称" :label-width="formLabelWidth" >
              <el-input class="increaseInput" placeholder=" " v-model="addBookName"></el-input>
            </el-form-item>
            <el-form-item label="借书时间" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="" v-model="addLendTime"></el-input>
            </el-form-item>
            <el-form-item label="还回时间" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="addReturnTime"></el-input>
            </el-form-item>
            <el-form-item label="借书人员" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="addBorrower"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDataSave">保存</el-button>
          </div>
        </el-dialog>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button type="text" @click="dialogVisible = true">Excel导入</el-button>
          </el-dropdown-item>
          <el-dialog
            title="导入信息"
            :visible.sync="dialogVisible"
            top='50px'
            left='50px'
            width="500px"
            :append-to-body='true'
            :before-close="handleClose">
            <span>
              <span>
                <h3>①准备信息</h3>
                <p class="upload">使用数据模板文件,录入数据。为了保证成功，请根据表格中批注的数据格式并按照字段顺序进行录入。一次最多导入100条数据。</p>
                <p class="upload uploadMould">
                  <i class="el-icon-download"></i>
                  点击下载模板
                </p>
              </span>
              <span>
                <h3>②上传数据文件</h3>
                <p class="upload">目前支持的文件类型为 *.xls, *.xlsx</p>
                <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  multiple
                  :limit="3"
                  :on-exceed="handleExceed"
                  :file-list="fileList">
                  <el-button class="upFiles" type="primary" size="small" plain>
                    <i class="el-icon-plus"></i>
                    添加文件
                  </el-button>
                </el-upload>
              </span>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>

          <el-dropdown-item>
            <el-button type="text" @click="dialogVisible = true">Excel导出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >过滤</el-button>
      <span id='state'>
        (共有 {{tableData.length}} 本书)
      </span>
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <!-- <div class="transition-box">el-collapse-transition</div> -->
            <div class="transition-box">
              <span>借书记录：<el-input class="filter"></el-input></span>
              <span>图书名称：<el-input class="filter"></el-input></span>
              <span>公司编号：<el-input class="filter"></el-input></span><br>
              <span>借书人员：<el-input class="filter"></el-input></span>
              <el-button class="primary" type="primary">过滤</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <el-table
        class="memberData"
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="80">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="图书名称"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="bookRecord"
          label="借阅记录"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="companyId"
          label="公司编号"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="lendTime"
          label="借书时间"
          width="250">
        </el-table-column>
        <el-table-column
          prop="returnTime"
          label="还回时间"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editFormVisible = true">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,7,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length">
      </el-pagination>

      <el-dialog title="编辑借阅信息" :visible.sync="editFormVisible" :append-to-body='true' top='100px' width="550px" center>
        <el-form :model="editForm">
          <el-form-item label="图书名称" :label-width="formLabelWidth" >
            <el-input class="increaseInput" placeholder="为该图书更改名称" v-model="bookName"></el-input>
          </el-form-item>
          <el-form-item label="借出时间" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="更改借出时间" v-model="lendTime"></el-input>
          </el-form-item>
          <el-form-item label="还回时间" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="更改还回时间" v-model="returnTime"></el-input>
          </el-form-item>
          <el-form-item label="借阅人员" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="更改借阅人员" v-model="borrower"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDataSave">保存</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  .top {
    font-size: 19px;
    line-height: 60px;
    padding-left: 20px;
    background-color:#fafafa;
  }
  .contentB p{
    font-size: 15px;
    line-height: 70px;
    padding-left: 30px;
  }
  .upFiles {
    margin: 10px 10px;
  }
  .upload{
    margin: 10px 10px;
  }
  .uploadMould{
    color: #409eff;
    cursor: pointer;
  }
  /* .content:nth-child(4){
    height:0px!important;
  } */
  .moreMenu{
    padding-left: 30px;
    display: inline-block;
  }
  .transition-box {
    height: 210px;
    padding-top: 30px;
    border-top: 1px solid #dcdfe4;
    border-bottom: 1px solid #dcdfe4;
    background-color: #f1f2f4;
    box-sizing: border-box;
  }
  .transition-box>span{
    margin-left:80px;
    margin-top:8px;
  }
  .filter{
    width:190px;
    padding-top: 8px;
  }
  .increaseInput{
    width:260px;
  }
  .primary{
    margin-left: 130px;
    margin-top: 8px;
  }
  .increaseMember{
    background-color: #409EFF;
    border:0;
  }
  /* .moreMenu div :first-child{
    width: 60px;
    height: 30px;
  } */
  .pagination{
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .editor{
    border: 1px solid #c7ccd3;
    cursor: pointer;
    color: #c7ccd3;
    margin-top: 15px;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    border: 1px solid #c7ccd3;
  }
  .el-input__icon:after{
    display: none;
  }
  .el-icon-arrow-up:before{
    display: none;
  }
  .editor div input{
    width: 0px;
    height: 0px;
    border: 0px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-dialog__body {
    padding: 20px 20px;
  }
  #state{
    position: relative;
    float: right;
    margin-right: 250px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 5px;
  }
</style>
<script>
export default {
  data () {
    return {
      activeNames: ['1'],
      input10: '',
      show3: false,
      currentPage: 1,
      pagesize:10,
      tableData: [],
      value: '',
      dialogFormVisible: false,
      dialogVisible: false,
      form: {
        email: '',
        studentId: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '140px',
      radio: '1',
      checked: true,
      editFormVisible: false,
      addCompanyId: '',
      addBookName: '',
      addLendTime: '',
      addReturnTime: '',
      addBorrower: '',
      companyId: '',
      bookName: '',
      lendTime: '',
      returnTime: '',
      borrower: ''

    }
  },
  methods: {
    addDataSave: function() {
      this.dialogFormVisible = false;
      var data = [];
      let _this = this;
      var addData = new Object;
      addData.companyId = this.addCompanyId;
      addData.bookName = this.addBookName;
      addData.lendTime = this.addLendTime;
      addData.returnTime = this.addReturnTime;
      addData.borrower = this.addBorrower;
      this.$http.post("https://www.easy-mock.com/mock/5b84f6da66335a5ae27707d1/hrms/book",addData)
      .then(function (res) {
        console.log(res.data.msg);
      }).catch(function (error) {

      })
    },
    editDataSave() {
      this.editFormVisible = false;
      var data = [];
      let _this = this;
      var editData = new Object;
      editData.bookName = this.bookName;
      editData.lendTime = this.lendTime;
      editData.returnTime = this.returnTime;
      editData.borrower = this.borrower;
      this.$http.put("https://www.easy-mock.com/mock/5b84f6da66335a5ae27707d1/hrms/book",editData)
      .then(function (res) {
        for (let i = 0; i < res.data.object.length; i++) {
          var obj = {};
          obj.bookRecord = res.data.object[i].bookRecord;
          obj.bookName = res.data.object[i].bookName;
          obj.lendTime = res.data.object[i].lendTime;
          obj.returnTime = res.data.object[i].returnTime;
          obj.borrower = res.data.object[i].borrower;
          data[i] = obj;
        }
        _this.tableData = data;
        console.log(data);
      }).catch(function (error) {

      })
    },
    deleteRow(index, rows) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        var deleteData = new Object();
        deleteData.bookRecord = this.tableData[index].bookRecord;
        console.log(this.tableData[index].bookRecord);
        this.$http.delete('https://www.easy-mock.com/mock/5b84f6da66335a5ae27707d1/hrms/book',{params:deleteData});
      }).then(() => {
        rows.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })
    },
    handleSizeChange: function (size) {
        this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
    },
    handleChange (val) {
      console.log(val)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleEdit(index, row) {
        console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
}
</script>
