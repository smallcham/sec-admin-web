<template>
  <div>
    <el-table
      ref="filterTable"
      @selection-change="handleSelectionChange"
      :data="tableData.items">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="script"
        label="脚本">
      </el-table-column>
      <el-table-column
        prop="label"
        label="标签">
        <template slot-scope="scope">
          <el-tag v-bind:key="tag" v-for="tag in scope.row.label">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            @keyup.enter.native="loadData(1)"
            v-model="title"
            size="mini"
            placeholder="输入插件标题搜索">
            <el-button slot="append" icon="el-icon-search" @click="loadData(1)"></el-button>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="$router.push('/plugins/add/' + scope.row.id)">编辑</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'Plugins.vue',
  data () {
    return {
      tableData: [],
      title: ''
    }
  },
  created () {
    this.loadData(1)
  },
  methods: {
    loadData (next) {
      let that = this
      this.$http.get('/query/plugin', { params: { next: next, title: this.title } }).then(res => {
        that.tableData = res.data.data
      })
    },
    handleSelectionChange () {},
    handleEdit (index, row) {},
    handleDelete (index, row) {
      let that = this
      this.$confirm('是否确认删除插件(文件不会被删除): ' + row.title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/del/plugin', { 'id': row.id }).then(res => {
          that.$message.success('删除成功')
          that.tableData.items.splice(index, 1)
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
