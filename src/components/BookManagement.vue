<template>
  <div>
    <router-view/>
    <div class="book_top">图书管理</div>
    <div class="contentB">
      <p>{{this.companyName}}</p>
      <el-dropdown split-button v-show="permission == 1" type="primary" class="moreMenu" @click="dialogFormVisible = true">
        添加图书
        <el-dialog title="添加图书" :visible.sync="dialogFormVisible" :append-to-body='true' top='100px' width="550px" center>
          <el-form>
            <el-form-item label="图书名称" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写书名" v-model="addname"></el-input>
            </el-form-item>
            <el-form-item label="图书类型" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="前端/后台/产品" v-model="addcategory"></el-input>
            </el-form-item>
            <el-form-item label="图书数量" :label-width="formLabelWidth">
              <el-input-number v-model="addquantity" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
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
                <p @click="uploadExcelTemplate" class="upload uploadMould">
                  <i class="el-icon-download"></i>
                  点击下载模板
                </p>
              </span>
              <span>
                <h3>②上传数据文件</h3>
                <p class="upload">目前支持的文件类型为 *.xls, *.xlsx</p>
                <a href="javascript:;" class="uploadExcel">
                  <input type="file" multiple name="file"
                         accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                         @change="getExcel($event)">
                  添加文件
                </a>
                <div id='showExcelName'>{{ this.file.name }}</div>
              </span>
            </span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadExcel($event)">确 定</el-button>
            </span>
          </el-dialog>

          <el-dropdown-item>
            <el-button type="text" @click="downloadExcel">Excel导出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        type="danger"
        v-show="permission == 1"
        @click.prevent='removeSelection()'
        :disabled="isDisabled"
      >
        删除选中图书
      </el-button>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >筛选
      </el-button>
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <div class="transition-box">
              <span>图书名：<el-input class="filter" v-model="filterBookName"></el-input></span>
              <span>书类型：<el-input class="filter" v-model="filterCategory"></el-input></span><br>
              <span>版本：<el-input class="filter" v-model="filterVersion"></el-input></span>
              <el-button class="primary" type="primary" @click="filterBook">筛选</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <el-table
        id='out-table'
        class="bookData"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="permission == 1"
          type="selection"
          width="55"
        >
        </el-table-column>
        <!-- 图书状态编辑 -->
        <el-table-column
          width="50">
          <template slot-scope="scope">
            <el-dropdown v-show="permission == 1">
              <span class="el-dropdown-link">
                <i class="editor el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link :to="{ path:'/BookMangement/Editor',query: { bookOriginalInfo: scope.row} }">
                    编辑图书
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    @click="deleteBook(scope.row.bookId)">
                  删除图书
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 成员信息 -->
        <el-table-column
          prop="bookName"
          label="图书名"
          align="center"
          width="200"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="category"
          label="类型"
          align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="version"
          label="图书版本"
          width="300"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          align="center"
          :show-overflow-tooltip="true">
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
        :total="bookCount">
      </el-pagination>
    </div>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .book_top {
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

  .bookInfo {
    position: relative;
    top: -50px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 5px;
  }
</style>
<script>
var COMPANYID = window.sessionStorage.getItem('companyId')
const PREFIX = 'http://localhost:8081/hrms/'
export default {
  data () {
    return {
      companyName: '',
      bookCount: 0,
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
          num: '',
          version: ''
        }
      ],
      isDisabled: false,
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '140px',
      // 显示加载中样式
      loading: false,
      // 搜索表单
      searchForm: {
        id: '',
        name: '',
        state: ''
      },
      // 多选值
      multipleSelection: [],
      // 删除的弹出框
      deleteVisible: false,
      // 编辑界面是否显示
      editFormVisible: false,
      addname: '',
      addcategory: '',
      addquantity: '',
      addversion: '',
      newBookId: '',
      newBookName: '',
      newCategory: '',
      newQuantity: '',
      newVersion: '',
      filterBookId: '',
      filterBookName: '',
      filterCategory: '',
      filterQuantity: '',
      filterVersion: '',
      file: '',
      permission: ''
    }
  },
  created: function () {
    this.permission = window.sessionStorage.getItem('permission')
    this.$axios.get(PREFIX + '/company/company.do', {
      params: {
        email: COMPANYID
      }
    })
      .then((response) => {
        this.companyName = response.data.object.name
      })
    let params = new URLSearchParams()
    params.append('currentPage', this.currentPage)
    params.append('size', this.pagesize)
    this.$axios.post(PREFIX + 'book/filter.do?' + params.toString(), {
      companyId: COMPANYID
    }).then((res) => {
      this.tableData = res.data.object.data
      this.bookCount = res.data.object.recordSize
    }).catch(function (error) {

    })
  },
  methods: {
    removeSelection () {
      this.$confirm('是否删除当前选中项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // todo 违反了rest原则。 但是现在又传不过去
        this.$axios.post(PREFIX + '/book/delBook.do', {
          bookId: this.multipleSelection.toString(),
          companyId: COMPANYID
        })
          .then((response) => {
            window.location.reload()
          })
          .catch((error) => {
            alert(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      let params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('size', this.pagesize)
      this.$axios.post(PREFIX + '/book/filter.do?' + params.toString(), {
        companyId: COMPANYID
      })
        .then((response) => {
          this.tableData = response.data.object.data
        })
        .catch((error) => {
          alert(error)
        })
    },
    getExcel (event) {
      this.file = event.target.files[0]
    },
    // 上传Excel表到数据库(success)
    uploadExcel (event) {
      // 阻止元素发生默认行为
      event.preventDefault()
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('companyId', COMPANYID)
      this.$axios.post(PREFIX + 'book/excel.do', formData)
        .then((response) => {
          this.dialogVisible = false
          if (response.data.code == 1) {
            this.$message({
              type: 'success',
              message: response.data.msg
            })
            window.location.reload()
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
          }}).catch((error) => {
          console.log('上传文件失败')
          alert(error)
        })
    },
    downloadExcel () {
      this.$confirm('是否下载当前数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let book = new Object()
        if (this.filterBookId != '') {
          book.bookId = this.filterBookId
        }
        book.companyId = COMPANYID
        if (this.filterBookName != '') {
          book.bookName = this.filterBookName
        }
        if (this.filterCategory != '') {
          book.category = this.filterCategory
        }
        if (this.filterVersion != '') {
          book.version = this.filterVersion
        }
        if (this.quantity != '') {
          book.quantity = parseInt(this.filterQuantity)
        }
        book.version = this.version
        this.$axios.post(PREFIX + 'book/createExcel.do', book, {responseType: 'arraybuffer'})
          .then((response) => {
            console.log(response)
            let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = COMPANYID + 'book.xls'
            link.click()
            this.dialogVisible = false
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消下载'
            })
          })
      })
    },
    addDataSave: function () {
      this.dialogFormVisible = false
      this.$axios.post(PREFIX + 'book/book.do', {
        companyId: COMPANYID,
        bookName: this.addname,
        category: this.addcategory,
        quantity: parseInt(this.addquantity),
        version: this.addversion
      }).then((res) => {
        if (res.data.code == 1) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          window.location.reload()
        } else {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        }
      }).catch(function (error) {
        alert(error)
      })
    },
    handleSizeChange: function (size) {
      this.pagesize = size
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
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].bookId
      }
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
    deleteBook (index) {
      let book = new Object()
      book.companyId = COMPANYID
      book.bookId = index
      this.$axios.post(PREFIX + '/book/delBook.do', book).then((response) => {
        if (response.data.code == 1) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData.forEach((v, i) => {
              if (v.num === index) {
                this.tableData.splice(i, 1)
              }
            })
          }
        }
      })
    },
    // 下载Excel模板(success)
    uploadExcelTemplate () {
      this.$confirm('是否下载模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warn'
      }).then(() => {
        this.$axios.post(PREFIX + 'download.do?name=book.xlsx', {
        }, {responseType: 'arraybuffer'})
          .then((response) => {
            let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = '导入数据模板.xlsx'
            link.click()
            console.log('下载模板成功')
          })
          .catch((error) => {
            alert(error)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下载'
        })
      })
    },
    filterBook () {
      let params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('size', this.pagesize)
      let book = new Object()
      if (this.filterBookId != '') {
        book.bookId = this.filterBookId
      }
      book.companyId = COMPANYID
      if (this.filterBookName != '') {
        book.bookName = this.filterBookName
      }
      if (this.filterCategory != '') {
        book.category = this.filterCategory
      }
      if (this.filterVersion != '') {
        book.version = this.filterVersion
      }
      if (this.quantity != '') {
        book.quantity = parseInt(this.filterQuantity)
      }
      this.$axios.post(PREFIX + 'book/filter.do?' + params.toString(), book)
        .then((response) => {
          this.tableData = response.data.object.data
          this.bookCount = response.data.object.recordSize
        })
    }
  }
}
</script>
