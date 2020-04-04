<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" @keyup.enter.native="onSubmit">
      <el-form-item label="用户名">
        <el-input v-model="form.user_name" placeholder="请填写您的用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pass_word" show-password placeholder="请填写您的密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        user_name: '',
        pass_word: ''
      }
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    getUser () {
      let that = this
      this.$http.get('/get/user').then(res => {
        if (res.data.state) {
          that.$store.commit('put_user', res.data.data)
          that.$router.push('/').catch(() => {})
        }
      })
    },
    onSubmit () {
      let that = this
      this.$http.post('/login', this.form).then(res => {
        if (res.data.state) {
          that.$message.success('登录成功')
          that.$store.commit('put_user', res.data.data)
          that.getUser()
          that.$router.push('/').catch(() => {})
        } else {
          that.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
