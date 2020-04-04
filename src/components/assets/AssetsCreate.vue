<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-width="80px">
      <el-form-item label="IP地址">
        <el-input v-model="form.ip" placeholder="支持填写域名/IP地址 eg: 10.12.13.24 多个IP地址 eg: 10.12.13.24,10.12.13.25 IP段 eg: 10.12.13.0/24 IP区间 eg: 10.12.13.1-10.12.13.20"></el-input>
      </el-form-item>
      <el-form-item label="机房">
        <el-select v-model="form.region" placeholder="请选择所在机房">
          <el-option label="不限" value=""></el-option>
          <el-option label="国内" value="cn"></el-option>
          <el-option label="香港" value="hk"></el-option>
          <el-option label="美国" value="us"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="form.tags" filterable allow-create multiple placeholder="请选择/可创建">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'AssetsCreate',
  data () {
    return {
      options: [],
      loading: false,
      form: {
        ip: '',
        region: '',
        tags: []
      }
    }
  },
  created () {

  },
  methods: {
    onSubmit () {
      let that = this
      this.loading = true
      this.$http.post('/add/ip', this.form).then(() => {
        that.loading = false
        that.$message.success('添加成功')
      })
    }
  }
}
</script>

<style scoped>

</style>
