<template>
  <div>
    <router-view/>
    <div class="project_top">项目管理</div>
    <div class="contentP">
      <p>{{this.companyName}}</p>
      <el-dropdown v-show="permission == 1" split-button type="primary" class="moreMenu" @click="dialogFormVisible = true">
        添加项目
        <el-dialog title="添加项目" :visible.sync="dialogFormVisible" :append-to-body='true' top='100px' width="550px" center>
          <el-form>
            <el-form-item label="项目名称" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写项目名" v-model="addProjectName"></el-input>
            </el-form-item>
            <el-form-item label="IP地址" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写项目名" v-model="addProjectIp"></el-input>
            </el-form-item>
            <el-form-item label="端口" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写端口" v-model="addProjectPort"></el-input>
            </el-form-item>
            <el-form-item label="路径" :label-width="formLabelWidth">
              <el-input class="increaseInput" placeholder="正确填写路径" v-model="addProjectLocation"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addDataSave">保存</el-button>
          </div>
        </el-dialog>
      </el-dropdown>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >筛选
      </el-button>
      <el-button
        plain
        @click="open()">
        使用手册
      </el-button>
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <div class="transition-box">
              <span>项目名称：<el-input class="filter" v-model="filterProjectName"></el-input></span>
              <span>项目IP：<el-input class="filter" v-model="filterProjectIp"></el-input></span><br>
              <span>项目端口：<el-input class="filter" v-model="filterProjectPorts"></el-input></span>
              <el-button class="primary" type="primary" style="margin-left:160px;" @click="getFilterProjectInfo">筛选</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <el-table
        class="projectData"
        ref="multipleTable"
        :data="tableData"
        highlight-current-row="true"
        v-loading="loading"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="项目名称"
          align="center"
          width="250"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          label="IP地址"
          width="300"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="ports"
          label="项目端口"
          align="center"
          width="100"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="location"
          label="项目路径"
          align="center"
          width="300"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          v-show="permission == 1"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editorProject(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRow(scope.row.projectId)">删除</el-button>
            <el-button type="text" size="small" @click="listProjectInTomcat(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
<el-dialog title="tomcat详情" :visible.sync="tomcatVisible" :append-to-body='true' top='100px' width="400px" center>
              <el-table
                id='out-table1'
                class="bookData"
                ref="multipleTable"
                :data="webapp"
                tooltip-effect="dark"
                :highlight-current-row="true"
                style="width: 100%"
              >
                <el-table-column
                  prop="name"
                  align="center"
                  label="项目名"
                  width="150"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  prop="status"
                  align="center"
                  label="状态"
                  width="50"
                  :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  align="center"
                  width="100">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="operateProject(scope.row.name,'start')">重启</el-button>
                    <el-button type="text" size="small" @click="operateProject(scope.row.name,'stop')">停止</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div slot="footer" class="dialog-footer">
                <el-button @click="tomcatVisible=false">关闭</el-button>
              </div>
            </el-dialog>

      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,7,10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="projectCount">
      </el-pagination>
    </div>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .project_top {
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
<script>
var COMPANYID = window.sessionStorage.getItem('companyId')
const PREFIX = 'http://localhost:8081/hrms/'
export default {
  data () {
    return {
      companyName: '',
      projectCount: 0,
      show3: false,
      currentPage: 1,
      pagesize: 10,
      tableData: [{
        companyId: '',
        projectId: '',
        ports: '',
        name: '',
        ip: '',
        location: ''

      }],
      webapp: [{
        name: '',
        status: ''
      }],
      dialogInfoVisible: false,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogVisible: false,
      editFormVisible: false,
      formLabelWidth: '140px',
      checked: true,
      addProjectIp: '',
      addProjectPort: '',
      addProjectName: '',
      addProjectLocation: '',
      companyId: '',
      projectId: '',
      name: '',
      ip: '',
      ports: '',
      location: '',
      tomcatVisible: false,
      isDisabled: false,
      filterProjectIp: '',
      filterProjectPorts: '',
      filterProjectName: '',
      checkAll: false,
      checkedMembers: [],
      members: [{
        email: '',
        name: ''
      }],
      isIndeterminate: true,
      permission: '',
      // 暂存
      temp: '',
      loading: false
    }
  },
  created: function () {
    this.loading = true
    this.permission = window.sessionStorage.getItem('permission')
    let params = new URLSearchParams()
    params.append('currentPage', this.currentPage)
    params.append('size', this.pagesize)
    this.$axios.get(PREFIX + '/company/company.do', {
      params: {
        email: COMPANYID
      }
    }).then((response) => {
      this.companyName = response.data.object.name
    })
    this.$axios.post(PREFIX + '/project/option.do?' + params.toString(), {
      companyId: COMPANYID
    }).then((res) => {
      this.tableData = res.data.object.data
      this.projectCount = res.data.object.recordSize
    })
    this.$axios.get(PREFIX + '/member/member.do?companyId=' + COMPANYID, {}).then((res) => {
      this.members = res.data.object
      console.log(this.members)
    })
    this.loading = false
  },
  methods: {
    open () {
      this.$notify({
        title: '添加须知',
        message: '在tomcat的conf目录下tomcat-users.xml添加如下代码\n' +
          '<role rolename="manager-gui"/>\n' +
          '<role rolename="manager-script"/>\n' +
          '<role rolename="manager-jmx"/>\n' +
          '<role rolename="manager-status"/>\n' +
          '<user username="tomcat" password="tomcat" roles="manager-gui,manager-script,manager-jmx,manager-status"/>\n' +
          '并重启tomcat',
        duration: 0
      })
    },
    editorProject: function (projectInfo) {
      this.$router.push({path: '/ProjectManagement/Editor', query: { projectOriginalInfo: projectInfo} })
    },
    operateProject: function (name, operation) {
      let ip = this.temp.ip
      let ports = this.temp.ports
      this.$axios.post(PREFIX + 'project/operate.do?operation=' + operation, {
        companyId: COMPANYID,
        ip: ip,
        ports: ports,
        name: name
      }).then((res) => {
        if (res.data.code === 1) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      })
    },

    listProjectInTomcat: function (project) {
      this.$axios.post(PREFIX + 'project/list.do', {
        companyId: COMPANYID,
        ip: project.ip,
        ports: project.ports
      }).then((res) => {
        if (res.data.code === 1) {
          this.webapp = res.data.object
          this.temp = project
          this.tomcatVisible = true
        } else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          })
        }
      })
    },
    addDataSave: function () {
      this.dialogFormVisible = false
      this.$axios.post(PREFIX + 'project/project.do', {
        companyId: COMPANYID,
        name: this.addProjectName,
        ip: this.addProjectIp,
        ports: this.addProjectPort,
        location: this.addProjectLocation
      })
        .then((res) => {
          if (res.data.code === 1) {
            this.$message({
              type: 'info',
              message: '添加成功!'
            })
            window.location.reload()
          }
        }).catch(function (error) {
          alert(error)
        })
    },
    getFilterProjectInfo () {
      let params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('size', this.pagesize)
      this.$axios.post(PREFIX + '/project/option.do?' + params.toString(), {
        companyId: COMPANYID,
        name: this.filterProjectName,
        ip: this.filterProjectIp,
        ports: this.filterProjectPorts
      }).then((response) => {
        this.tableData = response.data.object.data
        this.projectCount = response.data.object.recordSize
      }).catch((error) => {
        alert(error)
      })
    },
    infoMember (index) {
      let emails = []
      let checked = this.checkedMembers
      let members = this.members
      this.$confirm('此操作将发送邮件给选中联系人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < checked.length; i++) {
          for (let j = 0; j < members.length; j++) {
            if (checked[i] == members[j].name) {
              emails[i] = members[j].email
              break
            }
          }
        }
        let params = new URLSearchParams()
        params.append('companyId', COMPANYID)
        params.append('projectId', index)
        this.$axios.post(PREFIX + '/project/info.do?' + params.toString(), {
          memberEmails: emails.toString()
        }).then((response) => {
          if (response.data.code == 1) {
            this.$message({
              type: 'info',
              message: '发送成功!'
            })
          } else {
            this.$message({
              type: 'warn',
              message: '发送失败!'
            })
          }
        })
      })
    },
    deleteRow (index) {
      let data = index
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
              if (data === this.tableData[i].projectId) {
                this.tableData.splice(i, 1)
              }
            }
            this.projectCount--
            this.$message({
              type: 'info',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'info',
              message: '删除失败!'
            })
          }
        })
      })
    },
    handleSizeChange: function (size) {
      this.pagesize = size
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      let params = new URLSearchParams()
      params.append('currentPage', this.currentPage)
      params.append('size', this.pagesize)
      this.$axios.post(PREFIX + '/project/option.do?' + params.toString(), {
        companyId: COMPANYID
      })
        .then((response) => {
          console.log('展示第' + this.currentPage + '页项目信息成功')
          this.tableData = response.data.object.data
          this.projectCount = response.data.object.recordSize
        })
        .catch((error) => {
          alert(error)
        })
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
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].projectId
      }
    },
    // 删除选中行数据(success)
    removeSelection () {
      this.$confirm('是否删除当前选中项目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // todo 违反了rest原则。 但是现在又传不过去
        this.$axios.post(PREFIX + '/project/delProjects.do?companyId=' + COMPANYID, {
          projectIds: this.multipleSelection
        })
          .then(() => {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              let val = this.multipleSelection[i]
              for (let j = 0; j < this.tableData.length; j++) {
                if (val === this.tableData[j].projectId) {
                  this.tableData.splice(i, 1)
                }
              }
            }
            this.projectCount--
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
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {
        })
    },
    handleCheckAllChange (val) {
      this.checkedMembers = val ? this.members : []
      this.isIndeterminate = false
    },
    handleCheckedMembersChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.members.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.members.length
      console.log(this.checkedMembers)
    }
  }
}
</script>
