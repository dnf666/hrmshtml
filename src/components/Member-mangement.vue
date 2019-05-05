<template>
  <div>
    <router-view/>
    <div class="member_top">成员管理</div>
    <div class="contentm">
      <p>{{this.companyName}}</p>
      <!-- 添加成员 -->
      <el-dropdown split-button type="primary" v-show="permission == 1" class="moreMenu" @click="dialogFormVisible = true">
        添加成员
        <el-dialog title="添加成员" :visible.sync="dialogFormVisible" :append-to-body='true' top='10px' width="550px">
          <el-form class="memberData">
            <el-form-item label="邮箱*" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-on:input="inputEmail" v-model="newEmail" placeholder="登录邮箱"></el-input>
              <span class="tip st">{{ emailTips }}</span>
            </el-form-item>
            <el-form-item label="学号*" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newNum" placeholder="正确填写学号"></el-input>
              <span class="tip st">{{ studentIdTips }}</span>
            </el-form-item>
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newName" placeholder="真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别" :label-width="formLabelWidth">
              <el-radio v-model="radio" label="0">男</el-radio>
              <el-radio v-model="radio" label="1">女</el-radio>
            </el-form-item>
            <el-form-item label="年级" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newGrade"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newDepartment"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newPhoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="专业" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newProfession"></el-input>
            </el-form-item>
            <el-form-item label="签约" :label-width="formLabelWidth">
              <el-input class="increaseInput" v-model="newWhereAbout"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" :disabled="isdisabledFn" @click="addMember">保存并添加下一个</el-button>
          </div>
        </el-dialog>
        <!-- Excel导入导出 -->
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
                <p class="upload">使用数据模板文件,录入组织与成员信息。为了保证成功，请根据表格中批注的数据格式并按照字段顺序进行录入。一次最多导入100人</p>
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
        v-show="permission == 1"
        type="danger"
        @click.prevent='delData()'
        :disabled="isDisabled"
      >
        删除选中成员
      </el-button>
      <el-button
        class="filterDown"
        @click="show3 = !show3"
      >筛选
      </el-button>

      <!-- 成员状态 -->
      <!-- 根据输入过滤信息 -->
      <div style="margin-top: 10px;">
        <el-collapse-transition>
          <div v-show="show3">
            <div class="transition-box">
              <span>学号：<el-input class="filter" v-model="filterNum"></el-input></span>
              <span>姓名：<el-input class="filter" v-model="filterName"></el-input></span>
              <span>邮箱：<el-input class="filter" v-model="filterEmail"></el-input></span>
              <br>
              <span>性别：
                <el-radio class='sex' v-model="filterRadio" label="男">男</el-radio>
                <el-radio class='sex' v-model="filterRadio" label="女">女</el-radio>
              </span>
              <span>电话：<el-input class="filter" v-model="filterPhoneNumber"></el-input></span>
              <span>专业：<el-input class="filter" v-model="filterProfession"></el-input></span>
              <br>
              <span>部门：<el-input class="filter" v-model="filterDepartment"></el-input></span>
              <span>年级：<el-input class="filter" v-model="filterGrade"></el-input></span>
              <span>签约：<el-input class="filter" v-model="filterWhereAbout"></el-input></span>
              <el-button class="primary" type="primary" @click="getFilterMemberInfo">筛选</el-button>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <hr>
      <!-- 成员展示 -->
      <el-table
        id='out-table'
        class="memberData"
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
        <el-table-column
          width="50">
          <template slot-scope="scope">
            <el-dropdown v-show="permission == 1">
              <span class="el-dropdown-link">
                <i class="editor el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <router-link :to="{ path:'/MemberMangement/Editor',query: { memberOriginalInfo: scope.row} }">
                    编辑成员
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    @click="deleteMember(scope.row.num,scope.row.email)">
                  删除成员
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    @click="setPermission(scope.row.email,1)">
                  授予权限
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span
                    @click="setPermission(scope.row.email,2)">
                  取消权限
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="right" inline class="demo-table-expand">
              <el-form-item label="电话">
                <span>{{ props.row.phoneNumber }}</span>
              </el-form-item><br>
              <el-form-item label="性别">
                <span>{{ props.row.sex }}</span>
              </el-form-item><br>
              <el-form-item label="专业">
                <span>{{ props.row.profession }}</span>
              </el-form-item><br>
              <el-form-item label="年级">
                <span>{{ props.row.grade }}</span>
              </el-form-item><br>
              <el-form-item label="部门">
                <span>{{ props.row.department}}</span>
              </el-form-item><br>
            </el-form>
          </template>
        </el-table-column>
        <!-- 成员信息 -->
        <el-table-column
          class="memberInfo"
          id="studentId"
          label="学号"
          width="200"
          align="center"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.num }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="200"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="200"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="whereAbout"
          label="签约"
          align="center"
          :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        :page-sizes="[5,7,10]"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :total="memberCount">
      </el-pagination>
    </div>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  .tip {
    font-size: 12px;
    color: red;
  }

  .member_top {
    font-size: 19px;
    line-height: 60px;
    padding-left: 20px;
    background-color: #fafafa;
  }

  .contentm p {
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
    height: 240px;
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

  .sex {
    width: 70px;
    margin-left: 10px;
  }

  .st {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
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

  .memberInfo {
    position: relative;
    top: -50px;
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
    margin-right: 15px;
  }

  .activeState {
    margin-left: 5px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 5px;
  }

  .uploadExcel {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    margin-left: 10px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
  }

  .uploadExcel input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }

  .uploadExcel:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }

  #showExcelName {
    margin-left: 15px;
    margin-top: 8px;
  }
</style>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

var COMPANYID = window.sessionStorage.getItem('companyId')
const PREFIX = 'http://localhost:8081/hrms/'
let isnext = (that) => {
  for (let i = 0; i < 1; i++) {
    if (that.isnext[i] == true) {
      return
    }
  }
  if (that.gre == false) {
    that.isdisabledFn = true
  } else {
    that.isdisabledFn = false
  }
}
export default {
  data () {
    return {
      isdisabledFn: true,
      companyName: '',
      memberCount: 0,
      show3: false,
      currentPage: 1,
      pagesize: 10,
      tableData: [{
        companyId: '',
        num: '',
        name: '',
        email: '',
        sex: '',
        profession: '',
        department: '',
        grade: '',
        phoneNumber: '',
        whereAbout: ''
      }],
      emailTips: '',
      studentIdTips: '',
      permission: '',
      value: '',
      isnext: [false],
      multipleSelection: [],
      emailSelection: [],
      dialogFormVisible: false,
      dialogVisible: false,
      isDisabled: false,
      formLabelWidth: '140px',
      radio: '0',
      filterRadio: null,
      checked: true,
      filterCompanyId: '',
      filterNum: '',
      filterName: '',
      filterEmail: '',
      filterPhoneNumber: '',
      filterProfession: '',
      filterDepartment: '',
      filterGrade: '',
      filterWhereAbout: '',
      newCompanyId: '',
      newNum: '',
      newName: '',
      newSex: '',
      newEmail: '',
      newProfession: '',
      newDepartment: '',
      newGrade: '',
      newPhoneNumber: '',
      newWhereAbout: '',
      file: '',
      excelPath: ''
    }
  },
  // 获取全部成员信息(success)
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
      // 得到当前页面成员列表
    let params = new URLSearchParams()
    params.append('page', this.currentPage)
    params.append('size', this.pagesize)
    this.$axios.post(PREFIX + '/member/filter.do?' + params.toString(), {
      companyId: COMPANYID
    })
      .then((response) => {
        this.tableData = response.data.object.data
        this.memberCount = response.data.object.recordSize
      })
      .catch((error) => {
        alert(error)
      })
  },
  methods: {
    // 获取当前页数及当前页面数据
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      let params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('size', this.pagesize)
      this.$axios.post(PREFIX + '/member/filter.do?' + params.toString(), {
        companyId: COMPANYID
      })
        .then((response) => {
          console.log('展示第' + this.currentPage + '页成员信息成功')
          this.tableData = response.data.object.data
          this.memberCount = response.data.object.recordSize
        })
        .catch((error) => {
          alert(error)
        })
    },
    setPermission (num, permission) {
      this.$axios.post(PREFIX + '/manage/permission.do', {
        companyId: COMPANYID,
        email: num,
        permission: permission
      })
        .then((response) => {
          if (response.data.status == 0) {
            this.$message({
              type: 'success',
              message: response.data.message
            })
          } else {
            this.$message({
              type: 'warning',
              message: response.data.message
            })
          }
        }
        )
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
    handleSizeChange: function (size) {
      this.pagesize = size
    },
    inputEmail (e) {
      this.isdisabledFn = true
      this.isnext[0] = true

      function ckMail (str) {
        var myreg = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/
        return myreg.test(str)
      }

      if (this.newEmail == ' ') {
        this.emailTips = ''
        return
      }
      if (ckMail(e)) {
        this.isnext[0] = false
        this.emailTips = ' '
        isnext(this)
      } else {
        this.emailTips = '您输入的邮箱格式有误'
      }
    },

    // 获得选中的一行数据
    handleSelectionChange (val) {
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].num
        this.emailSelection[i] = val[i].email
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 删除单个成员信息()
    deleteMember (num,email) {
      // todo 违反了rest原则。 但是现在又传不过去
      this.$axios.post(PREFIX + '/member/delMember.do?companyId=' + COMPANYID, {
        num: num,
        email:email
      })
        .then((response) => {
          if (response.data.code == 1) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].num === num) {
                this.tableData.splice(i, 1)
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.memberCount--
          } else {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        }
        )
        .catch((error) => {
          alert(error)
        })
    },
    // 删除选中行数据(success)
    delData () {
      this.$confirm('是否删除当前选中成员？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // todo 违反了rest原则。 但是现在又传不过去
        this.$axios.post(PREFIX + '/member/delMember.do?companyId=' + COMPANYID, {
          num: this.multipleSelection.toString(),
          email:this.emailSelection.toString()
        }).then((response) => {
          window.location.reload()
        }
        )
          .catch((error) => {
            alert(error)
          })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '已取消删除'
        })
      })
    },
    // 添加单个成员信息(success)
    addMember () {
      this.dialogFormVisible = false
      if (this.radio == 0) {
        this.newSex = '男'
      } else {
        this.newSex = '女'
      }
      // 提交请求
      this.$axios.post(PREFIX + '/member/member.do', {
        companyId: COMPANYID,
        num: this.newNum,
        name: this.newName,
        sex: this.newSex,
        email: this.newEmail,
        grade: this.newGrade,
        department: this.newDepartment,
        phoneNumber: this.newPhoneNumber,
        profession: this.newProfession,
        whereAbout: this.newWhereAbout
      }).then((response) => {
        window.location.reload()
      })
        .catch((error) => {
          alert(error)
        })
    },
    // 根据条件查找成员信息(success)
    getFilterMemberInfo () {
      let params = new URLSearchParams()
      params.append('page', this.currentPage)
      params.append('size', this.pagesize)

      this.$axios.post(PREFIX + '/member/filter.do?' + params.toString()
        , {
          companyId: COMPANYID,
          num: this.filterNum,
          name: this.filterName,
          sex: this.filterRadio,
          email: this.filterEmail,
          profession: this.filterProfession,
          department: this.filterDepartment,
          grade: this.filterGrade,
          phoneNumber: this.filterPhoneNumber,
          whereAbout: this.filterWhereAbout
        })
        .then((response) => {
          this.tableData = response.data.object.data
          this.memberCount = response.data.object.recordSize
        })
        .catch((error) => {
          alert(error)
        })
    },
    // 得到文件内容
    getExcel (event) {
      this.file = event.target.files[0]
      console.log(this.file)
    },
    // 上传Excel表到数据库(success)
    uploadExcel (event) {
      // 阻止元素发生默认行为
      event.preventDefault()
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('companyId', COMPANYID)
      this.$axios.post(PREFIX + 'member/excel.do', formData)
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
          }
        }).catch((error) => {
          alert(error)
        })
    },
    // 下载当前页面的数据到Excel表(success)
    downloadExcel () {
      this.$confirm('是否下载当前数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$axios.post(PREFIX + 'member/createExcel.do', {
          companyId: COMPANYID,
          num: this.filterNum,
          name: this.filterName,
          sex: this.sex,
          email: this.filterEmail,
          profession: this.filterProfession,
          department: this.filterDepartment,
          grade: this.filterGrade,
          phoneNumber: this.filterPhoneNumber,
          whereAbout: this.filterWhereAbout
        }, {responseType: 'arraybuffer'})
          .then((response) => {
            let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = COMPANYID + 'member.xls'
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

    // 下载Excel模板(success)
    uploadExcelTemplate () {
      this.$confirm('是否下载模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.$axios.post(PREFIX + 'download.do?name=member.xlsx', {}, {responseType: 'arraybuffer'})
          .then((response) => {
            console.log(response)
            let blob = new Blob([response.data], {type: 'application/vnd.ms-excel'})
            var link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = 'member.xlsx'
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
    }
  }
}
</script>
