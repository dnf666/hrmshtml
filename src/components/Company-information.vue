<template>
<div>
  <router-view/>
  <div class="top">
  <div class="top1">
    <div class="companyInfo">
      <span class="cname">{{this.companyName}}</span>
<br/>
      <a title="点击修改公司简介"  @click="dialogVisible = true">
        <span>简介:</span><span>{{ this.companyOutline }}</span>
      </a>
      <el-dialog
        title="修改公司简介"
        :visible.sync="dialogVisible"
        width="40%">
        <el-input
          class="editCompany"
          type="textarea"
          :rows="6"
          v-model="companyOutline">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="putCompanyOutline ()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div></div>
  <div class="mainInfo">
    <!-- 公司成员 -->
    <div class="companyMember">
      成员数量
      <div class="companyMember-child">
        <i class="el-icon-tickets"></i>
        <span ref='member'>{{ memberCounting }}</span>/1000人
      </div>
    </div>
    <!-- 公司项目数量 -->
    <div class="projectCount">
      项目数量
      <div class="projectBox">
        <span>
          <canvas class="progeressBar" ref="progeressBar" width="100" height="100"></canvas>
        </span>
        <span>
          <div id='projectC'>
            <span ref='project'>{{ projectCounting }}</span>个
          </div>
          <p class="allProject">项目总数：100个</p>
        </span>
      </div>
    </div>
  </div>
</div>
</template>
<style>
*{
  margin:0;
  padding:0;
}
.top {
  font-size: 19px;
  line-height: 180px;
  padding-left: 20px;
  background-color: #fafafa;
}
.top1 {
  font-size: 15px;
  line-height: 70px;
  padding-left: 30px;
}
.cname {
  font-size: 20px;
  color: #535e6c;
  margin-bottom: 20px;
}
.logo{
  height:110px;
  width:110px;
  border-radius: 5px;
  margin-left:40px;
  margin-top:40px;
  cursor: pointer;
}
.companyInfo{
  display: inline-block;
  margin-left: 150px;
  line-height: 40px;
  margin-top: 80px;
}
.companyInfo p{
    font-size:20px;
    color:black;
}
.companyInfo a span{
  color:#9a9a9e;
  background-color:#fafafa;
  font-size:15px;
  cursor: pointer;
}
.el-dialog__body {
    padding: 0px 20px;
    color: #606266;
    font-size: 14px;
}
.increaseInput {
  width: 290px;
}
.companyMember{
  background-color:white;
  display: inline-block;
  width:260px;
  height:170px;
  margin-left:70px;
  margin-top:40px;
  border:1px solid white;
  border-radius:5px;
  box-shadow:0px -2px 5px 0px #e6e6e6,-2px 0px 5px 0px #e6e6e6,
  2px 0px 5px 0px #e6e6e6,0px 2px 5px 0px #e6e6e6;
}
.projectCount{
  background-color:white;
  display: inline-block;
  width:260px;
  height:170px;
  margin-left:40px;
  border:1px solid white;
  border-radius:5px;
  box-shadow:0px -2px 5px 0px #e6e6e6,-2px 0px 5px 0px #e6e6e6,
  2px 0px 5px 0px #e6e6e6,0px 2px 5px 0px #e6e6e6;
  position: absolute;
  top: 218px;
}
.mainInfo div{
    font-size: 15px;
    padding-top:10px;
    padding-left:18px;
    color:#6f6f73;
}
.el-icon-tickets{
  margin-top: 15px;
  margin-left: -20px;
  font-size: 100px;
  color: #e5e6e8;
}
.companyMember-child span{
  font-size: 42px;
  color: #84aff9;
}
#projectC{
  display: inline-block;
}
#projectC span{
  padding-left: 30px;
  font-size: 42px;
  color: #f0b489;
}
.allProject{
  padding-left: 90px;
}
.progeressBar{
  margin-top: 5px;
  margin-left: -20px;
}
</style>
<script>
  //created和这里都有一个companyid,为了解决跳转COMPANYiD的问题.当然这种解决方法不好
  var COMPANYID = window.sessionStorage.getItem("companyId");
  const PREFIX = 'http://localhost:8081/hrms';
export default {
  data () {
    return {
      imageUrl: '../assets/images/logo.png',
      memberCount: '',
      memberCounting: '',
      projectCount: '',
      projectCounting: '',
      barNumber: '',
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '140px',
      newCompanyId: '',  //修改的公司邮箱（下列new开头的同理）
      newCompanyName: '',
      newApplicantName: '',
      newOrganizationSize: '',
      newMainCategory: '',
      newViceCategory: '',
      newPassword: '',
      companyOutline: '',
      companyName: '',
      companyEmail: '',
      dashArray: Math.PI * 100
    }
  },
  created () {
    // 得到公司成员总数
    var COMPANYID = window.sessionStorage.getItem("companyId");
    this.$axios.get(PREFIX+'/member/count.do',{
      params: {
        companyId: COMPANYID
      }
    })
    .then( (response) => {
      this.memberCount = response.data.object;
      this.countIncreaseMember();
    })
    .catch( (error) => {
      console.log(error);
    });
    this.$axios.get(PREFIX+'/index/index.do',{
      params: {
        companyId: COMPANYID
      }
    })
      .then((response) =>{
        this.companyOutline = response.data.object.outline;
      });
    this.$axios.get(PREFIX+'/company/company.do',{
      params: {
        email: COMPANYID
      }
    })
      .then((response) =>{
        this.companyName = response.data.object.name;
      });
    // 得到公司项目总数
    this.$axios.get(PREFIX+'/project/count.do',{
      params: {
        companyId: COMPANYID
      }
    })
    .then( (response) => {
      this.projectCount = response.data.object;
      this.barNumber = response.data.object;
      this.progeressBar(this.barNumber);
      this.countIncreaseProject();
    })
    .catch( (error) => {
      console.log (error);
    });
    // 得到公司logo
     this.$axios.get('',{
      params: this.companyId
    })
    .then( (response) => {
      this.imageUrl = response.data.imageUrl;
    });
  },
  methods: {
    // 上传头像成功
    handleAvatarSuccess(res, file) {
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
    // 公司成员数字动态增加
    countIncreaseMember () {
      let num = 0;
      this.memberCounting = 0;
      if(this.memberCount != 0) {
        let t = setInterval(() => {
          num++;
          this.memberCounting = num;
          if (num == this.memberCount) {
            clearInterval(t);
          }
        }, 100);
      }
    },
    // 公司项目数字动态增加
    countIncreaseProject (){
      let num = 0;
      this.projectCounting = 0;
      if (this.projectCount != 0){
      let t =  setInterval(() => {
      num++;
      this.projectCounting = num;
      if(num == this.projectCount){
        clearInterval(t);
      }
      }, 100);}

    },
    // 公司项目动态圆环
    progeressBar (val) {
      let ctx=this.$refs.progeressBar.getContext('2d');
      let mW = 100;
      let mH = 100;
      let lineWidth = 10;
      let r = mW / 2; //中间位置
      let cR = 40; //圆半径
      let startAngle = -(1 / 2 * Math.PI); //开始角度
      let endAngle = (val*3.6-90)*Math.PI/180; //结束角度
      let xAngle = 1 * (Math.PI / 180); //偏移角度量
      let fontSize = 50; //字号大小
      let tmpAngle = startAngle; //临时角度变量
      let rander = function(){
        if(tmpAngle >= endAngle){
          return;
        }else if(tmpAngle + xAngle > endAngle){
          tmpAngle = endAngle;
        }else{
          tmpAngle += xAngle;
        }
        ctx.clearRect(0, 0, mW, mH);
        //画底部的圈
        ctx.beginPath();
        ctx.lineWidth=lineWidth;
        ctx.strokeStyle='#e3e4e5';
        ctx.arc(r, r, cR, -90*Math.PI/180,(100*3.6-90)*Math.PI/180);
        ctx.stroke();
        //画上面变动的圈
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = '#1c86d1';
        ctx.arc(r, r, cR,startAngle, tmpAngle);
        ctx.stroke();
        //写字
        ctx.fillStyle = '#1d89d5';
        ctx.font= fontSize/2 + 'px Microsoft Yahei';
        ctx.textAlign='center';
        ctx.fillText( Math.round((tmpAngle -  startAngle) / (endAngle - startAngle) * val) + '%', r, r + fontSize/4);
        requestAnimationFrame(rander);
      };
      rander();
    },
    // 修改公司简介
    putCompanyOutline () {
      this.$axios.post(PREFIX+'/index/outline.do',{
          companyId: COMPANYID,
          outline: this.companyOutline
      })
      .then((response) => {
        this.dialogVisible = false;
        if (response.data.status != 0) {
          alert(response.data.message);
        }
      })
      .catch( (error) => {
        console.log(error);
      });
    }
  },
}
</script>
