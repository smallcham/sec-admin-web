<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="插件名" prop="title">
        <el-input v-model="form.title" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="插件代码" prop="script">
        <el-input type="textarea" :autosize="{ minRows: 20, maxRows: 140}" v-model="form.script"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.label" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即{{ id !== undefined ? '修改' : '创建' }}</el-button>
        <el-button @click="id = undefined">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PluginCreate',
  data () {
    return {
      options: [
        { value: '紧急', name: 'emergency' },
        { value: '高危', name: 'danger' },
        { value: '中危', name: 'warning' },
        { value: '低危', name: 'info' }
      ],
      form: {
        title: '',
        remark: '',
        script: '',
        label: []
      },
      id: this.$route.params.id
    }
  },
  created () {
    this.viewPlugin(this.id)
  },
  methods: {
    viewPlugin (id) {
      if (id !== null && id !== undefined) {
        let that = this
        this.$http.post('/view/plugin', { 'id': id }).then(res => {
          that.form = res.data.data
        })
      }
    },
    onSubmit () {
      if (this.id !== null && this.id !== undefined) {
        this.form.id = this.id
      } else {
        this.form.id = undefined
      }
      let that = this
      this.$http.post('/add/plugin', this.form).then(res => {
        that.$message.success('操作成功')
        that.$router.push('/plugins/list')
      })
    }
  }
}
</script>

<style scoped>

</style>
