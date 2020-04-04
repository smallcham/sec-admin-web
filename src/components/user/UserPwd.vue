<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="新密码">
        <el-input v-model="form.new_pwd" show-password placeholder="请填写您的新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserPwd',
  data () {
    return {
      options: [],
      form: {
        new_pwd: ''
      }
    }
  },
  created () {
  },
  methods: {
    onSubmit () {
      let that = this
      this.$http.post('/modify/pwd', this.form).then(res => {
        if (res.data.state) {
          that.$message.success('修改成功, 下次登录请使用新密码')
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
