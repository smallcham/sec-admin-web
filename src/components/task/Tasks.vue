<template>
  <div>
    <el-form :inline="true" :model="form" @keyup.enter.native="loadData(1)" class="demo-form-inline">
      <el-form-item label="目标">
        <el-input v-model="form.target" placeholder="目标"></el-input>
      </el-form-item>
      <el-form-item label="执行节点">
        <el-input v-model="form.handle_node" placeholder="执行节点"></el-input>
      </el-form-item>
      <el-form-item label="运行状态">
        <el-select v-model="form.state" placeholder="运行状态">
          <el-option label="不限" value=""></el-option>
          <el-option label="待下发" value="READY"></el-option>
          <el-option label="已就绪" value="RUN_ABLE"></el-option>
          <el-option label="运行中" value="RUNNING"></el-option>
          <el-option label="执行完毕" value="FINISH"></el-option>
          <el-option label="执行失败" value="FAIL"></el-option>
          <el-option label="停止" value="STOP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="执行结果">
        <el-select v-model="form.result_state" placeholder="执行结果">
          <el-option label="不限" value=""></el-option>
          <el-option label="未发现异常" value="0"></el-option>
          <el-option label="发现异常" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-collapse-transition>
      <div v-show="selected.length > 0">
        <el-button-group>
          <el-button type="success" size="small" @click="handleCancelList"><i class="el-icon-s-order"></i> 取消选中任务</el-button>
          <el-button type="warning" size="small" @click="handleRetryList"><i class="el-icon-s-order"></i> 重新提交选中任务</el-button>
          <el-button type="danger" size="small" @click="handleDelTask"><i class="el-icon-s-order"></i> 删除选中任务</el-button>
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
        prop="target"
        label="目标">
      </el-table-column>
      <el-table-column
        prop="handle_node"
        label="执行节点">
        <template slot-scope="scope">
          <el-tag size="small" type="default" v-if="scope.row.handle_node != null && scope.row.handle_node !== undefined">{{ scope.row.handle_node }}</el-tag>
          <el-tag size="small" type="info" v-else>未分配</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="运行状态">
        <template slot-scope="scope">
          <el-tag size="small" type="default" v-if="scope.row.state === 'READY'">待下发</el-tag>
          <el-tag size="small" type="warning" v-if="scope.row.state === 'RUN_ABLE'">已就绪</el-tag>
          <el-tag size="small" type="primary" v-if="scope.row.state === 'RUNNING'">运行中</el-tag>
          <el-tag size="small" type="success" v-if="scope.row.state === 'FINISH'">执行完毕</el-tag>
          <el-tag size="small" type="danger" v-if="scope.row.state === 'FAIL'">执行失败</el-tag>
          <el-tag size="small" type="info" v-if="scope.row.state === 'STOP'">停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="cron"
        label="频次">
        <template slot-scope="scope">
          <el-tag size="small" type="default" v-if="scope.row.cron === 'ONCE'">单次</el-tag>
          <el-tag size="small" type="warning" v-if="scope.row.cron === 'DAILY'">每日</el-tag>
          <el-tag size="small" type="success" v-if="scope.row.cron === 'WEEKLY'">每周</el-tag>
          <el-tag size="small" type="info" v-if="scope.row.cron === 'MONTHLY'">每月</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="script"
        label="执行脚本">
        <template slot-scope="scope">
          <el-link :href="scope.row.script" target="_blank" type="info">{{ scope.row.script_name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="result"
        label="执行结果">
        <template slot-scope="scope">
          <el-tag size="small" type="info" effect="plain" v-if="scope.row.state === 'READY' || scope.row.state === 'RUN_ABLE' || scope.row.state === 'RUNNING'">待返回</el-tag>
          <el-alert
            v-else
            :closable="false"
            :type="!scope.row.result_state && scope.row.state !== 'FAIL' && scope.row.state !== 'READY' && scope.row.state !== 'RUN_ABLE' ? 'success' : 'error'"
            :description="null === scope.row.result || undefined === scope.row.result || '' === scope.row.result ? '未发现异常' : scope.row.result"
            show-icon>
          </el-alert>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            v-if="scope.row.handle_state === 'UNTREATED' && scope.row.result_state === true"
            @click="handleTreated(scope.$index, scope.row)">标记为解决</el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="scope.row.state === 'FAIL' || scope.row.state === 'CANCEL' || scope.row.state === 'FINISH'"
            @click="handleRetry(scope.$index, scope.row)">{{ scope.row.state === 'FINISH' ? '重发' : '重试' }}</el-button>
          <el-button
            size="mini"
            type="warning"
            v-if="scope.row.state === 'READY' || scope.row.state === 'RUN_ABLE' || scope.row.state === 'RUNNING'"
            @click="handleCancel(scope.$index, scope.row)">取消任务</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'Tasks.vue',
  data () {
    return {
      selected: [],
      tableData: [],
      form: {
        target: '',
        state: (this.$route.params.type === '1' ? 'RUNNING' : ''),
        result_state: (this.$route.params.type === '2' ? '1' : '')
      }
    }
  },
  created () {
    this.loadData(1)
  },
  methods: {
    loadData (next) {
      let that = this
      this.$http.get('/query/task', { params: { next: next, target: this.form.target, handle_node: this.form.handle_node, state: this.form.state, result_state: this.form.result_state } }).then(res => {
        that.tableData = res.data.data
      })
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    handleEdit (index, row) {},
    handleDelTask () {
      let that = this
      this.$confirm('是否确认批量删除任务(仅可删除 "已完成", "失败", "停止" 状态的任务)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < that.selected.length; i++) {
          if (that.selected[i].state === 'FAIL' || that.selected[i].state === 'FINISH' || that.selected[i].state === 'STOP') {
            that.$http.post('/del/task', { 'id': that.selected[i].id }).then(res => {
              that.$message.success('任务[' + that.selected[i].task_name + ']删除完毕')
              if (i === that.selected.length - 1) {
                that.loadData(that.tableData.page)
              }
            })
          }
        }
      }).catch(() => {})
    },
    handleRetryList () {
      let that = this
      this.$confirm('是否确认批量重新提交任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < that.selected.length; i++) {
          if (that.selected[i].state === 'FAIL' || that.selected[i].state === 'CANCEL' || that.selected[i].state === 'FINISH') {
            that.$http.post('/retry/task', { 'id': that.selected[i].id }).then(res => {
              that.$message.success('重试任务[' + that.selected[i].task_name + ']下发完毕')
              if (i === that.selected.length - 1) {
                that.loadData(that.tableData.page)
              }
            })
          }
        }
      }).catch(() => {})
    },
    handleRetry (index, row) {
      let that = this
      this.$confirm('是否确认重试任务: ' + row.target, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/retry/task', { 'id': row.id }).then(res => {
          that.$message.success('重试任务下发完毕')
          that.tableData.items[index].state = 'RUN_ABLE'
        })
      }).catch(() => {})
    },
    handleCancelList () {
      let that = this
      this.$confirm('是否确认批量取消任务', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < that.selected.length; i++) {
          if (that.selected[i].state === 'READY' || that.selected[i].state === 'RUN_ABLE' || that.selected[i].state === 'RUNNING') {
            that.$http.post('/cancel/task', { 'task_name': that.selected[i].task_name, handle_node: that.selected[i].handle_node, state: that.selected[i].state }).then(res => {
              if (that.selected[i].state === 'RUNNING') {
                that.$message.success('取消任务下发完毕, 将通知执行节点取消任务.')
              } else {
                that.$message.success('取消任务成功.')
              }
              if (i === that.selected.length - 1) {
                that.loadData(that.tableData.page)
              }
            })
          }
        }
        that.loadData(that.tableData.page)
      }).catch(() => {})
    },
    handleCancel (index, row) {
      let that = this
      this.$confirm('是否取消任务: ' + row.target, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/cancel/task', { 'task_name': row.task_name, handle_node: row.handle_node, state: row.state }).then(res => {
          if (row.state === 'RUNNING') {
            that.$message.success('取消任务下发完毕, 将通知执行节点取消任务.')
          } else {
            that.$message.success('取消任务成功.')
            that.tableData.items.splice(index, 1)
          }
        })
      }).catch(() => {})
    },
    handleTreated (index, row) {
      let that = this
      this.$confirm('是否确认已经解决该问题: ' + row.target, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/treated/task', { 'id': row.id }).then(res => {
          that.$message.success('操作成功')
          that.tableData.items[index].handle_state = 'TREATED'
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>

</style>
