<template>
  <el-menu background-color="#545c64" active-text-color="#ffd04b" text-color="#fff" router :default-active="'/'" class="el-menu-demo" @select="handleSelect" v-if="user">
    <el-menu-item>欢迎您，{{ user.user_name }}  <el-link style="float: right" @click="logout" type="danger">退出登录</el-link></el-menu-item>
    <el-menu-item index="/">首页</el-menu-item>
    <el-submenu index="2">
      <template slot="title">资产管理</template>
      <el-menu-item index="/assets/add">资产录入</el-menu-item>
      <el-menu-item index="/assets/list">资产列表</el-menu-item>
    </el-submenu>
    <el-menu-item index="/task/list">任务计划</el-menu-item>
    <el-menu-item index="/dict/list">字典</el-menu-item>
    <el-submenu index="5">
      <template slot="title">插件管理</template>
      <el-menu-item index="/plugins/add">新增插件</el-menu-item>
      <el-menu-item index="/plugins/list">插件列表</el-menu-item>
    </el-submenu>
    <el-submenu v-if="user.type === 'ROOT'" index="6">
      <template slot="title">用户管理</template>
      <el-menu-item index="/user/add">新增用户</el-menu-item>
      <el-menu-item index="/user/list">用户列表</el-menu-item>
    </el-submenu>
    <el-menu-item index="/user/pwd">修改密码</el-menu-item>
  </el-menu>
  <el-menu router v-else class="el-menu-demo" mode="horizontal">
    <el-menu-item>漏洞扫描系统</el-menu-item>
    <el-menu-item disabled>未登录</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Header',
  created () {
    this.getUser()
  },
  data () {
    return {
      user: this.$store.state.user
    }
  },
  watch: {
    '$store.state.user': function () {
      this.user = this.$store.state.user
    }
  },
  methods: {
    handleSelect () {},
    getUser () {
      let that = this
      this.$http.get('/get/user').then(res => {
        that.$store.commit('put_user', res.data.data)
      })
    },
    logout () {
      let that = this
      this.$confirm('是否确认退出登录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/logout').then(res => {
          that.$store.commit('put_user', false)
          that.$router.push('/login')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
