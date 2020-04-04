<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card>
          IP总数
          <el-button type="primary" @click="$router.push('/assets/list')">{{ data.asset }}</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          执行中任务
          <el-button type="info" @click="$router.push('/task/list/1')">{{ data.running }}</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          已发现问题
          <el-button type="warning" @click="$router.push('/task/list/2')">{{ data.error }}</el-button>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          未处理问题
          <el-button type="danger" @click="$router.push('/task/list/2')">{{ data.handle }}</el-button>
        </el-card>
      </el-col>
    </el-row>
    <div v-if="user.type === 'ROOT'">
      <br/>
      <div style="text-align: center"><el-button type="primary" round @click="addHostDialogVisible = true"><i class="el-icon-circle-plus-outline"></i> 添加任务执行节点</el-button></div>
      <br/>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="执行节点监控">
        <el-row :gutter="12">
          <el-col :span="6" v-bind:key="host.server" v-for="host in hosts">
            <el-card shadow="always">
              <el-alert
                effect="dark"
                :closable="false"
                :type="(!host.active && ((new Date() - new Date(parseInt(host.timespan))) / 1000 / 60) < 3 ? 'warning' : ((new Date() - new Date(parseInt(host.timespan))) / 1000 / 60) > 3 ? 'error' : 'success')"
                :title="host.server"
                show-icon>
                <template slot="">
                  <span>{{ ((new Date() - new Date(parseInt(host.timespan))) / 1000 / 60) > 3 ? '无响应' : (host.info !== false ? ((host.info.state) + ': ' + host.info.script_name + '  目标: ' + host.info.target + ' | 时间: ' + host.info.modify_time) : '空闲中') }}</span>
                </template>
              </el-alert>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="生成部署代码" :visible.sync="addHostDialogVisible" center>
      <el-form label-width="80px" :model="form">
        <el-form-item label="IP">
          <el-input v-model="form.ip" @input="handleChange"></el-input>
        </el-form-item>
        <el-form-item label="主机名">
          <el-input v-model="form.name" @input="handleChange"></el-input>
        </el-form-item>
        <el-form-item label="节点版本">
          <el-input v-model="form.version" @input="handleChange"></el-input>
        </el-form-item>
        <el-form-item label="节点版本">
          <el-input-number v-model="form.count" @input="handleChange"></el-input-number>
        </el-form-item>
        <el-form-item label="生成代码">
          <el-input type="textarea" readonly :autosize="{ minRows: 5, maxRows: 140}" v-model="form.code"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      addHostDialogVisible: false,
      trigger: null,
      user: {},
      data: {
        asset: 0,
        running: 0,
        error: 0,
        handle: 0
      },
      form: {
        ip: 'localhost',
        name: 'node',
        code: '',
        mq: '',
        rds: '',
        count: 1,
        version: '1.3.1'
      },
      hosts: []
    }
  },
  mounted () {
    this.breathInfo()
  },
  created () {
    this.getUser()
    this.countAsset()
  },
  destroyed () {
    window.clearInterval(this.trigger)
  },
  methods: {
    getUser () {
      let that = this
      this.$http.get('/get/user').then(res => {
        that.user = res.data.data
        that.getEnv()
      })
    },
    countAsset () {
      let that = this
      this.$http.get('/count/asset').then(res => {
        that.data = res.data.data
      })
    },
    breathInfo () {
      let that = this
      that.$http.get('/list/breath').then(res => {
        that.hosts = res.data.data
      })
      this.trigger = setInterval(function () {
        that.$http.get('/list/breath').then(res => {
          that.hosts = res.data.data
        })
      }, 30000)
    },
    getEnv () {
      let that = this
      if (this.user.type !== 'ROOT') return false
      this.$http.get('/get/env').then(res => {
        that.form.mq = res.data.data.mq
        that.form.rds = res.data.data.redis
        that.form.version = res.data.data.node_version
      })
    },
    randomPwd (len) {
      let pasArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      let password = ''
      let pasArrLen = pasArr.length
      for (let i = 0; i < len; i++) {
        let x = Math.floor(Math.random() * pasArrLen)
        password += pasArr[x]
      }
      return password
    },
    handleChange () {
      let hostName = ''
      let _res = ''
      for (let i = 0; i < this.form.count; i++) {
        hostName = this.form.name + '_' + this.form.ip + '_' + this.randomPwd(12)
        _res += ('docker run -d --restart=always --env HEART_RATE=30 --env REDIS_ENV=' + this.form.rds + ' --name ' + hostName + ' --hostname ' + hostName + ' ccr.ccs.tencentyun.com/whitney/xn-secnode:' + this.form.version) + '\n'
      }
      this.form.code = _res
    }
  }
}
</script>

<style scoped>

</style>
