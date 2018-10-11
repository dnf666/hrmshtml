<template>
  <div>
    <router-view/>
    <div class="top">图书管理</div>
    <div class="contentB">
      <p>信管工作室</p>
      <el-dropdown split-button type="primary" class="moreMenu" @click="dialogFormVisible = true">
        添加图书
        <el-dialog title="添加图书" :visible.sync="dialogFormVisible" :append-to-body='true' top='100px' width="550px" center>
          <el-form :model="form">
            <el-form-item label="图书名称" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写书名" v-model="addname"></el-input>
            </el-form-item>
            <el-form-item label="图书类型" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="前端/后台/产品" v-model="addcategory"></el-input>
            </el-form-item>
            <el-form-item label="图书数量" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="addquantity"></el-input>
            </el-form-item>
            <el-form-item label="图书版本" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="addversion"></el-input>
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
            :append-to-body='true'>
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
                  action="http://localhost:8080/hrms/hrms/{tableTitle}/fromExcel"
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
              <el-button type="primary" @click="submitUpload">确 定</el-button>
            </span>
          </el-dialog>

          <el-dropdown-item>
            <el-button type="text" @click="dialogVisible = true">Excel导出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="danger"
        @click.prevent='removeSelection()'
        :disabled="isDisabled"
      >
        删除选中成员
      </el-button>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >过滤
      </el-button>
      <span id='state'>
        (共有 {{tableData.length}} 本书)
      </span>
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <!-- <div class="transition-box">el-collapse-transition</div> -->
            <div class="transition-box">
              <span>图书ID：<el-input class="filter" v-model="filterBookId"></el-input></span>
              <span>图书名：<el-input class="filter" v-model="filterBookName"></el-input></span><br>
              <span>书类型：<el-input class="filter" v-model="filterCategory"></el-input></span>
              <span>数量：<el-input class="filter" v-model="filterQuantity"></el-input></span>

              <el-button class="primary" type="primary">过滤</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <el-table
        class="bookInfo"
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <template slot-scope="scope">{{ scope.row.num }}</template>
        <el-table-column
          type="selection"
          width="80">
        </el-table-column>
        <el-table-column
          prop="bookId"
          label="图书编号"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="图书名称"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="category"
          label="图书类型"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          width="250">
        </el-table-column>
        <el-table-column
          prop="version"
          label="版本号"
          width="250"
          show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editFormVisible = true">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, tableData)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-col :span="7" id="deleteSelection">
        <el-button :plain="true" type="danger" size="small" icon="delete" @click="removeSelection">删除所选</el-button>
      </el-col> -->
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

      <el-dialog title="编辑图书" :visible.sync="editFormVisible" :append-to-body='true' top='100px' width="550px" center>
        <el-form :model="editForm">
          <el-form-item label="图书编号" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该图书更改编号" v-model="newBookId"></el-input>
          </el-form-item>
          <el-form-item label="公司编号" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该图书更改公司编号" v-model="newCompanyId"></el-input>
          </el-form-item>
          <el-form-item label="图书名称" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该图书更改书名" v-model="newBookName"></el-input>
          </el-form-item>
          <el-form-item label="图书类型" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="更改图书类型" v-model="newCategory"></el-input>
          </el-form-item>
          <el-form-item label="图书数量" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="newQuantity"></el-input>
          </el-form-item>
          <el-form-item label="图书版本" :label-width="formLabelWidth">
            <el-input class="increaseInput" v-model="newVersion"></el-input>
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
  * {
    margin: 0;
    padding: 0;
  }

  .top {
    font-size: 19px;
    line-height: 60px;
    padding-left: 20px;
    background-color: #fafafa;
  }

  .contentB p {
    font-size: 15px;
    line-height: 70px;
    padding-left: 30px;
  }

  .upFiles {
    margin: 10px 10px;
  }

  .upload {
    margin: 10px 10px;
  }

  .uploadMould {
    color: #409eff;
    cursor: pointer;
  }

  .moreMenu {
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

  .transition-box > span {
    margin-left: 80px;
    margin-top: 8px;
  }

  .filter {
    width: 190px;
    padding-top: 8px;
  }

  .increaseInput {
    width: 260px;
  }

  .primary {
    margin-left: 130px;
    margin-top: 8px;
  }

  .increaseMember {
    background-color: #409EFF;
    border: 0;
  }

  #deleteSelection {
    margin-left: 5px;
    margin-top: 16px;
  }

  .pagination {
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  .editor {
    border: 1px solid #c7ccd3;
    cursor: pointer;
    color: #c7ccd3;
    margin-top: 15px;
    width: 15px;
    height: 15px;
    border-radius: 2px;
    border: 1px solid #c7ccd3;
  }

  .el-input__icon:after {
    display: none;
  }

  .el-icon-arrow-up:before {
    display: none;
  }

  .editor div input {
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

  #state {
    position: relative;
    float: right;
    margin-right: 250px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 5px;
  }
</style>
<!--<script src='../../config/index.js'></script>-->
<script>


  const COMPANYID = '1204695257@qq.com'
  const PREFIX = 'http://10.239.46.173:8089/hrms/';
  export default {
    data() {
      return {
        activeNames: ['1'],
        input10: '',
        show3: false,
        currentPage: 1,
        pagesize: 10,
        tableData: [
          {
            companyId: '',
            bookId: '',
            bookName: '',
            category: '',
            quantity: '',
            version: '',
          }
        ],
        isDisabled: false,
        dialogFormVisible: false,
        dialogVisible: false,
        //显示加载中样式
        loading: false,
        //搜索表单
        searchForm: {
          id: '',
          name: '',
          state: ''
        },
        //多选值
        multipleSelection: [],
        //删除的弹出框
        deleteVisible: false,
        //编辑界面是否显示
        editFormVisible: false,
        addcompany: '',
        addname: '',
        addcategory: '',
        addquantity: '',
         addversion: '',
        newBookId: '',
        newCompanyId: '',
        newBookName: '',
        newCategory: '',
        newQuantity: '',
        newVersion: '',
        filterCompanyId: '',
        filterBookId: '',
        filterBookName: '',
        filterCategory: '',
        filterQuantity: '',
        filterVersion: ''

      }
    },
    created: function () {
      var params = new URLSearchParams();
      params.append('currentPage', this.currentPage);
      params.append('size', this.pagesize);
      this.$axios.post(PREFIX + 'book/filter.do?' + params.toString(), {
        companyId: COMPANYID
      })
        .then(function (res) {
          this.tableData = res.data.object.data;
        }).catch(function (error) {

      })
    },
    methods: {
      submitUpload() {
        dialogVisible = false;
        this.$refs.upload.submit();
      },
      addDataSave: function () {
        this.dialogFormVisible = false;
        var data = [];
        let _this = this;

        this.$axios.post(PREFIX + 'book/book.do', {
          companyId: COMPANYID,
          bookName: this.addname,
          category: this.addcategory,
          quantity: parseInt(this.addquantity),
          version: this.addversion
        })
          .then(function (res) {
            console.log(res.data.msg);
          }).catch(function (error) {
          alert(error);
        })
      },
      handleSizeChange: function (size) {
        this.pagesize = size;
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
      },
      handleChange(val) {
        console.log(val)
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      deleteRow(index, rows) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var deleteData = new Object();
          deleteData.bookId = this.tableData[index].bookId;
          this.$axios.delete(PREFIX+COMPANYID+'/'+bookId+'.do');
        }).then((res) => {
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
      editDataSave() {
        this.editFormVisible = false;
        var data = [];
        let _this = this;
        var editData = new Object;
        editData.bookId = this.bookId;
        editData.companyId = COMPANYID;
        editData.bookName = this.bookName;
        editData.category = this.category;
        editData.quantity = this.quantity;
        editData.version = this.version;
        this.$axios.put(PREFIX+'book/book.do', editData)
          .then(function (res) {
            for (let i = 0; i < res.data.object.length; i++) {
              var obj = {};
              obj.bookId = res.data.object[i].bookId;
              obj.bookName = res.data.object[i].bookName;
              obj.bookType = res.data.object[i].category;
              obj.amount = res.data.object[i].quantity;
              obj.version = res.data.object[i].version;
              data[i] = obj;
            }
            _this.tableData = data;
          }).catch(function (error) {
            alert(error);

        })
      }
    }
  }
</script>
