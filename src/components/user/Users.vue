<template>
  <div>
    <el-form :inline="true" :model="form" @keyup.enter.native="loadData(1)" class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="form.user_name" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="form.state" placeholder="用户状态">
          <el-option label="不限" value=""></el-option>
          <el-option label="正常" value="NORMAL"></el-option>
          <el-option label="封禁" value="BANED"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型">
        <el-select v-model="form.type" placeholder="用户类型">
          <el-option label="不限" value=""></el-option>
          <el-option label="普通用户" value="NORMAL"></el-option>
          <el-option label="管理员" value="ROOT"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadData(1)">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="filterTable"
      @selection-change="handleSelectionChange"
      :data="tableData.items">
      <el-table-column
        prop="user_name"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="type"
        label="用户类型"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag effect="plain" type="warning" v-if="scope.row.type === 'ROOT'">管理员</el-tag>
          <el-tag effect="plain" type="info" v-if="scope.row.type === 'NORMAL'">普通用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="用户状态"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag effect="plain" type="danger" v-if="scope.row.state === 'BANED'">封禁</el-tag>
          <el-tag effect="plain" type="success" v-if="scope.row.state === 'NORMAL'">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="mini"
            type="info"
            v-if="scope.row.state === 'NORMAL'"
            @click="handleState(scope.$index, scope.row, 'BANED')">封禁</el-button>
          <el-button
            size="mini"
            type="warning"
            v-if="scope.row.state === 'BANED'"
            @click="handleState(scope.$index, scope.row, 'NORMAL')">解封</el-button>
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
  name: 'Users',
  data () {
    return {
      tableData: [],
      form: {
        user_name: '',
        state: '',
        type: ''
      }
    }
  },
  created () {
    this.loadData(1)
  },
  methods: {
    loadData (next) {
      let that = this
      this.$http.get('/query/user', { params: { next: next, user_name: this.form.user_name, state: this.form.state, type: this.form.type } }).then(res => {
        that.tableData = res.data.data
      })
    },
    handleSelectionChange (val) {
      this.selected = val
    },
    handleEdit () {},
    handleDelete (index, row) {
      let that = this
      this.$confirm('是否确认删除用户: ' + row.user_name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/del/user', { 'user_name': row.user_name }).then(res => {
          that.$message.success('删除成功')
          that.tableData.items.splice(index, 1)
        })
      }).catch(() => {})
    },
    handleState (index, row, state) {
      let that = this
      this.$confirm('是否确认' + (state === 'BANED' ? ' "封禁" ' : ' "解封" ') + '用户: ' + row.user_name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/modify/state', { 'user_name': row.user_name, 'state': state }).then(res => {
          that.$message.success('操作成功')
          that.tableData.items[index].state = state
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
