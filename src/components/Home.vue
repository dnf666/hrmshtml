<template>
  <el-container>
    <el-aside width="241px">
      <div>
        <el-menu
          router
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#f1f2f4"
          text-color="#878c87"
          active-text-color="#5686dc"
        >
          <!-- 修改头像 -->
          <div class="content">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:8089/hrms/index/photo.do"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img title="点击修改头像" src="./../assets/images/logo.png" class="avatar logo">
              <!-- v-if="imageUrl" -->
              <!-- :src="imageUrl" -->
            </el-upload>
            <p>{{ this.companyName }}</p>
          </div>
          <!-- 列表 -->
          <el-tabs style="height: 200px;">
            <router-link to="/CompanyInfo">
              <el-menu-item index="/CompanyInfo">
                <i class="el-icon-info"></i>
                <span slot="title">
                  公司信息
                </span>
              </el-menu-item>
            </router-link>
            <router-link to="/MemberMangement">
              <el-menu-item index="/MemberMangement">
                <i class="el-icon-edit"></i>
                <span slot="title">
                  成员管理
                </span>
              </el-menu-item>
            </router-link>
            <router-link to="/ProjectManagement">
              <el-menu-item index="/ProjectManagement">
                <i class="el-icon-menu"></i>
                <span slot="title">
                  项目管理
                </span>
              </el-menu-item>
            </router-link>
            <el-submenu index="/">
              <template slot="title">
                <div style="padding-left:20px">
                <i class="el-icon-tickets"></i>
                <span>图书管理</span>
                </div>
              </template>
              <el-menu-item-group>
                <router-link to="/BookManagement">
                  <el-menu-item index="/BookManagement">
                    <template slot="title">
                      <i class="el-icon-goods"></i>
                      图书馆藏
                    </template>
                  </el-menu-item>
                </router-link>
                <router-link to="/RentManagement">
                  <el-menu-item index="/RentManagement">
                    <template slot="title">
                      <i class="el-icon-time"></i>
                      借阅管理
                    </template>
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
          </el-tabs>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>© 2018 重庆邮电大学经济管理学院信管工作室</el-footer>
    </el-container>
  </el-container>
</template>
<style>
  *{
    margin: 0;
    padding: 0;
  }
  a{
    color: #878c87;
    text-decoration: none;
  }
  .el-footer {
    background-color: #fafafa;
    color: #878c87;
    padding-top: 20px;
  }
  .el-aside {
    background-color: #f1f2f4;
    color:#878c87;
  }

  .el-main {
    background-color: #ffffff;
    color: #878c87;
    margin: 0;
    padding: 0;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .avatar-uploader{
    display: inline-block;
    height:170px;
    width:170px;
  }
  .el-submenu [class^=el-icon-] {
    margin-top: 3px;
  }
  /* .el-submenu__title {
    padding-left: 40px;
  } */
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 240px;
    min-height: 800px;
  }
  .content{
    width: 180px;
    height: 200px;
  }
  .content img{
    border-radius: 5px;
    width: 130px;
    height: 130px;
    position:absolute;
    margin-left: 55px;
    margin-top: 20px;
    cursor: pointer;
  }
  .content p{
    padding-left: 78px;
    color: #878c87;
  }
</style>

<script>
  const COMPANYID = '1204695257@qq.com';
  const PREFIX = 'http://localhost:8089/hrms';
  const DEFAULT_PHOTO = './../assets/images/logo.png';
  export default {
  data () {
    return {
      menuDefault: 1,
      imageUrl: '',
      isCollapse: false,
      dialogFormVisible: false,
      formLabelWidth: '140px',
      companyName: '',
      companyId: '',
      newCompanyId: '',  //修改的公司邮箱（下列new开头的同理）
      newCompanyName: '',
      newApplicantName: '',
      newOrganizationSize: '',
      newMainCategory: '',
      newViceCategory: '',
      newPassword: ''
    }
  },
  // 得到公司头像
  created () {
    this.$axios.get(PREFIX+'/index/index.do',{
      params: {
        companyId: COMPANYID
      }
    })
    .then( (response) => {
      var photoPath = response.data.photoPath;
      if(photoPath == null){
        this.imageUrl = DEFAULT_PHOTO;
      }else {
        this.imageUrl = photoPath;
      }
    });
      this.$axios.get(PREFIX+'/company/company.do',{
        params: {
          email: COMPANYID
        }
      }).then( (response) => {
          this.companyName = response.data.object.name;
        });
  },
  methods: {
    // 上传头像成功
    sendPhoto(file){
      this.$axios.post(PREFIX+'/index/photo.do',file).then((response)=>{
        console.log(response);
      })
    },
    handleAvatarSuccess(res, file) {
      console.log(response);
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 判断上传头像的格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  }
}
</script>
