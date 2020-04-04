<template>
  <div>
    <el-form :inline="true" :model="form" @keyup.enter.native="loadData(1)" class="demo-form-inline">
      <el-form-item label="IP地址">
        <el-input v-model="form.ip" placeholder="IP地址"></el-input>
      </el-form-item>
      <el-form-item label="端口/应用名">
        <el-input v-model="form.port" placeholder="端口/应用名"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="form.tags" placeholder="标签"></el-input>
      </el-form-item>
      <el-form-item label="机房">
        <el-select v-model="form.region" placeholder="机房">
          <el-option label="不限" value=""></el-option>
          <el-option label="国内" value="cn"></el-option>
          <el-option label="香港" value="hk"></el-option>
          <el-option label="美国" value="us"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-collapse-transition>
      <div v-show="selected.length > 0">
        <el-button-group>
          <el-button type="success" size="small" @click="addTaskDialogVisible = true; addMode = 0"><i class="el-icon-s-order"></i> 对选中条目添加任务</el-button>
          <el-button type="warning" size="small" @click="addTaskDialogVisible = true; addMode = 1"><i class="el-icon-s-order"></i> 对结果集添加任务</el-button>
        </el-button-group>
      </div>
    </el-collapse-transition>
    <el-table
      ref="filterTable"
      @selection-change="handleSelectionChange"
      :data="tableData.items">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="ports"
        label="端口/应用"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-badge v-if="null !== scope.row.ports && undefined !== scope.row.ports && scope.row.ports.length > 0 && port !== undefined && port.service !== undefined && port.service.name !== undefined" :value="port.port" class="item" v-for="(port) in scope.row.ports" v-bind:key="port.port" :type="port.state === 'open' ? 'success' : 'info'">
            <el-button size="small" @click="portRoute(scope.row.ip, port.port, scope.row)">{{ port.service.name }}</el-button>
          </el-badge>
          <el-tag effect="plain" type="warning" v-if="scope.row.ports === null || scope.row.ports === undefined">扫描中</el-tag>
          <el-tag effect="plain" type="info" v-if="null !== scope.row.ports && undefined !== scope.row.ports && scope.row.ports.length === 0">无</el-tag>
          <el-button size="mini" circle icon="el-icon-refresh" plain type="warning" @click="retryScan(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="tags"
        label="标签"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            v-for="(tag, index) in scope.row.tags"
            v-bind:key="tag"
            :type="index % 2 === 0 ? 'primary' : 'success'"
            disable-transitions>{{tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="os"
        label="猜测系统"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.os !== null && scope.row.os !== undefined && scope.row.os.length > 0" v-bind:key="os.name" v-for="os in scope.row.os" effect="plain" type="primary" >{{ os.name }}</el-tag>
          <el-tag size="mini" effect="plain" type="warning" v-if="scope.row.os === null || scope.row.os === undefined">扫描中</el-tag>
          <el-tag size="mini" effect="plain" type="info" v-if="scope.row.os !== null && scope.row.os !== undefined && scope.row.os.length === 0">无</el-tag>
          <el-button size="mini" type="warning" plain circle icon="el-icon-refresh" @click="retryOs(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="padding-top: 10px"
      background
      layout="prev, pager, next"
      @current-change="loadData"
      :current-page.sync="tableData.page"
      :page-size="tableData.page_size"
      :total="tableData.total">
    </el-pagination>
    <el-dialog title="添加任务" :visible.sync="addTaskDialogVisible" v-loading="loading" center>
        <div style="text-align: center">
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="tasks"
            filterable
            :titles="['未选中插件', '已选择插件']"
            :button-texts="['到左边', '到右边']"
            :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
            @change="handleTransferChange"
            :data="plugins">
            <template slot-scope="scope">
              <el-tooltip :content="scope.option.info.remark" placement="right" effect="light">
                <span>{{ scope.option.label }}</span>
              </el-tooltip>
            </template>
          </el-transfer>
        </div>
      <div style="text-align: center"><el-button type="success" @click="addTask">确认添加任务</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Assets',
  data () {
    return {
      tableData: [],
      selected: [],
      tasks: [],
      addMode: 0,
      addTaskDialogVisible: false,
      loading: false,
      plugins: [],
      form: {
        ip: '',
        region: '',
        port: '',
        tags: ''
      }
    }
  },
  created () {
    this.loadData(1)
    this.allPlugin()
  },
  methods: {
    loadData (next) {
      let that = this
      this.$http.get('/query/ip', { params: { next: next, ip: this.form.ip, region: this.form.region, port: this.form.port, tags: this.form.tags } }).then(res => {
        that.tableData = res.data.data
      })
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    handleEdit () {},
    handleDelete (index, row) {
      let that = this
      this.$confirm('是否确认删除资产: ' + row.ip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/del/ip', { 'ip': row.ip }).then(res => {
          that.$message.success('删除成功')
          that.tableData.items.splice(index, 1)
        })
      }).catch(() => {})
    },
    portRoute (ip, port, row) {
      if (port === '80' || port === '8080') {
        window.open('http://' + ip + ':' + port)
      } else if (port === '443') {
        window.open('https://' + ip)
      } else {
        this.$refs.filterTable.toggleRowSelection(row)
      }
    },
    handleTransferChange (value, direction, movedKeys) {},
    allPlugin () {
      let that = this
      this.$http.get('/all/plugin', { params: { title: '' } }).then(res => {
        that.plugins = []
        for (let i = 0; i < res.data.data.length; i++) {
          that.plugins.push({
            key: res.data.data[i].script,
            label: res.data.data[i].title,
            info: res.data.data[i],
            disabled: false
          })
        }
      })
    },
    addTask () {
      if (this.tasks.length === 0) {
        this.$message.warning('至少选择一个任务脚本')
        return
      }
      let that = this
      this.$confirm('是否确认添加任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        that.$http.post('/add/task', {
          'mode': this.addMode,
          'ips': this.selected,
          'region': this.form.region,
          'ip': this.form.ip,
          'port': this.form.port,
          'scripts': this.tasks
        }).then(() => {
          that.loading = false
          that.addTaskDialogVisible = false
          that.$message.success('添加任务成功')
        })
      }).catch(() => {})
    },
    retryOs (index, row) {
      let that = this
      this.$confirm('请确认您需要重新扫描, 多次添加扫描任务将会给系统增加负担: ' + row.ip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/retry/os', { 'ip': row.ip }).then(res => {
          that.$message.success('重试任务下发完毕')
        })
      }).catch(() => {})
    },
    retryScan (index, row) {
      let that = this
      this.$confirm('请确认您需要重新扫描, 多次添加扫描任务将会给系统增加负担: ' + row.ip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/retry/scan', { 'ip': row.ip }).then(res => {
          that.$message.success('重试任务下发完毕')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
</style>
