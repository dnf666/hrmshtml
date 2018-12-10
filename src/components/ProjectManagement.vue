<template>
  <div>
    <router-view/>
    <div class="top">项目管理</div>
    <div class="contentP">
      <p>信管工作室</p>
      <el-dropdown split-button type="primary" class="moreMenu" @click="dialogFormVisible = true">
        添加项目
        <el-dialog title="添加项目" :visible.sync="dialogFormVisible" :append-to-body='true' top='100px' width="550px" center>
          <el-form :model="form">
            <el-form-item label="项目名称" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写项目名" v-model="addProjectName"></el-input>
            </el-form-item>
            <el-form-item label="项目地址" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="" v-model="addProjectUrl"></el-input>
            </el-form-item>
            <el-form-item label="上线时间" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="addOnlineTime"></el-input>
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
        type="danger"
        @click.prevent='removeSelection()'
        :disabled="isDisabled"
      >
        删除选中项目
      </el-button>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >过滤
      </el-button>
      <span id='state'>
        (共有 {{tableData.length}} 个项目)
      </span>
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <!-- <div class="transition-box">el-collapse-transition</div> -->
            <div class="transition-box">
              <span>项目编号：<el-input class="filter" v-model="filterProjectId"></el-input></span>
              <span>项目名称：<el-input class="filter" v-model="filterProjectName"></el-input></span>
              <span>项目网址：<el-input class="filter" v-model="filterProjectUrl"></el-input></span><br>
              <span>上线时间：<el-input class="filter" v-model="filterOnlineTime"></el-input></span>
              <el-button class="primary" type="primary" style="margin-left:160px;" @click="getFilterProjectInfo">过滤</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <el-table
        class="projectData"
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
        ></el-table-column>
        <el-table-column
          width="50">
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="editor el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link :to="{ path:'/ProjectManagement/Editor',query: { projectOriginalInfo: scope.row} }">
                    编辑项目
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    @click="deleteRow(scope.row.projectId)">
                  删除项目
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectId"
          label="项目编号"
          width="250"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          width="250"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="projectUrl"
          label="项目网址"
          width="250"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="onlineTime"
          label="上线时间"
          width="250"
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
        :total="tableData.length">
      </el-pagination>

      <el-dialog title="编辑项目" :visible.sync="editFormVisible" :append-to-body='true' top='100px' width="550px" center>
        <el-form>
          <el-form-item label="项目名称" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该项目更改名称" v-model="projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目地址" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该项目更改地址" v-model="projectUrl"></el-input>
          </el-form-item>
          <el-form-item label="上线时间" :label-width="formLabelWidth">
            <el-input class="increaseInput" placeholder="为该项目更改上线时间" v-model="onlineTime"></el-input>
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

  .contentP p {
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

  /* .content:nth-child(4){
    height:0px!important;
  } */
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

  /* .moreMenu div :first-child{
    width: 60px;
    height: 30px;
  } */
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
<script>

  var COMPANYID = window.sessionStorage.getItem("companyId");
  console.log(COMPANYID);
  const PREFIX = 'http://localhost:8089/hrms/';
  export default {
    data() {
      return {
        activeNames: ['1'],
        input10: '',
        show3: false,
        currentPage: 1,
        pagesize: 10,
        tableData: [{
          companyId: '',
          projectId: '',
          projectUrl: '',
          projectName: '',
          onlineTime: '',
        }],
        value: '',
        dialogFormVisible: false,
        dialogVisible: false,
        editFormVisible: false,
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
        addCompanyId: '',
        addProjectId: '',
        addProjectName: '',
        addProjectUrl: '',
        addOnlineTime: '',
        companyId: '',
        projectId: '',
        projectName: '',
        projectUrl: '',
        onlineTime: '',
        isDisabled: false,
        fileList: '',
        filterProjectId: '',
        filterProjectName: '',
        filterProjectUrl: '',
        filterOnlineTime: ''

      }
    },
    created: function () {
      var data = [];
      let _this = this;
      var params = new URLSearchParams();
      params.append('currentPage', this.currentPage);
      params.append('size', this.pagesize);
      this.$axios.post(PREFIX + '/project/option.do?' + params.toString(), {
        companyId: COMPANYID
      }).then(function (res) {
        for (let i = 0; i < res.data.object.data.length; i++) {
          var obj = {};
          obj.projectId = res.data.object.data[i].projectId;
          obj.projectName = res.data.object.data[i].projectName;
          obj.projectUrl = res.data.object.data[i].projectUrl;
          obj.onlineTime = res.data.object.data[i].onlineTime;
          data[i] = obj;
        }
        _this.tableData = data;
        console.log(data);
      }).catch(function (error) {

      })
    },
    methods: {
      addDataSave: function () {
        this.dialogFormVisible = false;
        this.$axios.post(PREFIX + 'project/project.do', {
          companyId: COMPANYID,
          projectName: this.addProjectName,
          projectUrl: this.addProjectUrl,
          onlineTime: this.addOnlineTime
        })
          .then((res) => {
            //todo 从后端查询
          }).catch(function (error) {
          alert(error);
        })
      },
      getFilterProjectInfo() {
        var params = new URLSearchParams();
        params.append('page', this.currentPage);
        params.append('size', this.pagesize);
        this.$axios.post(PREFIX + '/project/option.do?' + params.toString(), {
          companyId: COMPANYID,
          projectId: this.filterProjectId,
          projectName: this.filterProjectName,
          projectUrl: this.filterProjectUrl,
          onlineTime: this.filterOnlineTime
        })
          .then((response) => {
            console.log('根据条件查询成功');
            this.tableData = response.data.object.data;
          })
          .catch((error) => {
            alert(error);
          });
      },
      editDataSave() {
        this.editFormVisible = false;
        var data = [];
        let _this = this;
        var editData = new Object;
        editData.companyId = COMPANYID;
        editData.projectId = this.projectId;
        editData.projectName = this.projectName;
        editData.projectUrl = this.projectUrl;
        editData.onlineTime = this.onlineTime;
        this.$axios.put(PREFIX + 'project/project.do', editData)
          .then(function (res) {
            for (let i = 0; i < res.data.object.length; i++) {
              var obj = {};
              obj.projectId = res.data.object[i].projectId;
              obj.projectName = res.data.object[i].projectName;
              obj.projectUrl = res.data.object[i].projectUrl;
              obj.onlineTime = res.data.object[i].onlineTime;
              data[i] = obj;
            }
            _this.tableData = data;
            console.log(data);
          }).catch(function (error) {

        })
      },
      deleteRow(index) {
        console.log(index);
        let data = index;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post(PREFIX + '/project/delProject.do', {
            companyId: COMPANYID,
            projectId: data
          }).then((response) => {
            if (response.data.code == 1) {
              for (let i = 0; i < this.tableData.length; i++) {
                this.tableData.forEach((v, i) => {
                  if (v.projectId === index) {
                    this.tableData.splice(i, 1);
                  }
                })
              }
              this.$message({
                type: 'info',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'info',
                message: '删除失败!'
              });
            }
          })
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
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {
          })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      //下载Excel模板(success)
      uploadExcelTemplate() {
        this.$confirm('是否下载模板？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
        }).then(() => {
          this.$axios.post(PREFIX+'download.do?name=member.xlsx', {
          },{responseType:"arraybuffer"})
            .then((response) => {
              console.log(response);
              let blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
              var link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = "导入数据模板.xlsx";
              link.click();
              console.log('下载模板成功');
            })
            .catch((error) => {
              alert(error);
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下载'
          });
        });
      }
    }
  }
</script>
