<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.user_name" placeholder="请填写用户名"></el-input>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.type" placeholder="请选择用户类型">
          <el-option label="普通用户" value="NORMAL"></el-option>
          <el-option label="管理员" value="ROOT"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'UserCreate',
  data () {
    return {
      options: [],
      form: {
        user_name: '',
        pass_word: '',
        type: 'NORMAL'
      }
    }
  },
  created () {

  },
  methods: {
    onSubmit () {
      let that = this
      this.form.pass_word = this.randomPwd(18)
      this.$http.post('/add/user', this.form).then(res => {
        if (res.data.state) {
          this.$alert('初始密码为: [' + that.form.pass_word + '] 请牢记, 及时修改', '用户创建成功', {
            confirmButtonText: '确定',
            callback: () => {}
          })
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    randomPwd (len) {
      let pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '$', '%', '&', '@', '+', '!']
      let password = ''
      let pasArrLen = pasArr.length
      for (let i = 0; i < len; i++) {
        let x = Math.floor(Math.random() * pasArrLen)
        password += pasArr[x]
      }
      return password
    }
  }
}
</script>

<style scoped>

</style>
