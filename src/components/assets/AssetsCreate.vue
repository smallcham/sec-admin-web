<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-width="80px">
      <el-form-item label="IP/域名">
        <el-input v-model="form.ip" @input="handleFormat" placeholder="支持填写域名/IP地址 eg: 10.12.13.24 多个IP地址 eg: 10.12.13.24,10.12.13.25 IP段 eg: 10.12.13.0/24 IP区间 eg: 10.12.13.1-10.12.13.20"></el-input>
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
      <el-form-item label="识别子域" v-if="showItem">
        <el-tooltip class="item" effect="dark" content="选中此选项后将会自动识别主域名的子域, 并自动添加端口以及DNS扫描, 仅对输入主域名时有效" placement="top-start">
          <el-switch v-model="form.scan_sub_domain"></el-switch>
        </el-tooltip>
        <el-alert :closable="false" :type="form.scan_sub_domain ? 'success' : 'info'" title="选中此选项后将会自动识别主域名的子域, 并自动生成资产记录添加端口以及DNS扫描, 仅对输入主域名时有效"/>
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
      showItem: false,
      options: [],
      loading: false,
      form: {
        ip: '',
        region: '',
        scan_sub_domain: false,
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
      this.$http.post('/add/ip', this.form).then(res => {
        that.loading = false
        if (res.data.state) {
          that.$message.success('添加任务已下发, 您可以继续操作')
        } else {
          that.$message.error(res.data.msg)
        }
      })
    },
    handleChange () {
      let ips = this.form.ip.split('.')
      if ((ips.length === 2 && ips[1] !== '' && ips[0] !== 'www') || (ips.length === 3 && ips[0] === 'www')) {
        this.showItem = true
        this.form.scan_sub_domain = true
      } else {
        this.showItem = false
        this.form.scan_sub_domain = false
      }
      if (this.form.ip.indexOf(',') !== -1) {
        this.showItem = true
        this.form.scan_sub_domain = false
      }
    },
    handleFormat () {
      let ips = this.form.ip.split('/')
      this.form.ip = ips.length > 2 ? ips[2] : this.form.ip
      this.handleChange()
    }
  }
}
</script>

<style scoped>

</style>
