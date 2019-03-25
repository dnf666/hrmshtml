# hrms

基于vue的项目，作为hrms的前端项目，需要配合hrms后端系统使用
后端项目地址是https://github.com/dnf666/hrms.git
## 部署方法
### dev模式

命令行输入 npm install(前提是安装了node环境)
然后 npm run dev
运行完成后，访问显示的url

### 生产模式
命令行输入 npm install(前提是安装了node环境)
然后 npm run build 得到一个dist文件夹
在tomcat的webapps目录下创建文件夹hrms。将dist的文件拷贝到到hrms目录下
启动tomcat。
