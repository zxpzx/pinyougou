<template>
  <div class='home'>
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="logout">
          已登录
          <a href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="title">
          <h3>电商后台管理系统</h3>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
           <el-col :span="12">
            <el-menu
              unique-opened
              router
              :default-active="$route.path.slice(1).split('-')[0]"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{l1.authName}}</span>
                </template>
                <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{l2.authName}}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('你确定要退出系统吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('myToken')
        this.$router.push('/login')
        this.$message.success('退出成功')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '取消退出'
        })
      }
    },
    async getMenuList () {
      const res = await this.axios.get('menus')
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.menuList = data
        console.log(this.menuList)
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less">
.home {
  height: 100%;
  > .el-container {
      height: 100%;
}
.el-header {
    height: 60px;
    background-color: #b3c1cd;
  }
}
.el-aside {
  background-color: #545C64;
  .el-submenu {
    width: 200px;
  }
  .el-menu-item {
    width: 200px;
  }
}
.el-main {
  background-color: #EAEEF1;
}
.logo {
  width: 180px;
  height: 60px;
  float: left;
  background: url('../assets/logo.png') no-repeat center center;
  background-size: contain;
}
.logout {
  float: right;
  font-size: 16px;
  font-weight: bold;
  line-height: 60px;
  a {
    color: darkorange;
  }
}
.title {
  overflow: hidden;
  h3 {
    line-height: 60px;
    text-align: center;
    color: white;
    font-size: 28px;
  }
}
</style>
