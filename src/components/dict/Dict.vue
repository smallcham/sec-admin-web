<template>
  <div>
    <el-table
      :data="tableData.items"
      style="width: 100%">
      <el-table-column
        label="键"
        prop="dict_key">
      </el-table-column>
      <el-table-column
        label="值"
        prop="dict_value"
        :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          {{ JSON.parse(scope.row.dict_value).info }}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="remark">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            @keyup.enter.native="loadData(1)"
            v-model="remark"
            size="mini"
            placeholder="输入备注关键字搜索">
            <el-button slot="prepend" size="mini" @click="isModify = false; dialogAddDictVisible = true">+新增字典</el-button>
            <el-button slot="append" icon="el-icon-search" @click="loadData(1)"></el-button>
          </el-input>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog :title="isModify ? '修改字典' : '添加字典'" :visible.sync="dialogAddDictVisible" center>
      <el-alert :closable="false">文档最终会生成类似如下格式: { "type":"文档类型","separate":"分隔符","info":"值" }</el-alert><br/>
      <el-form ref="form" :model="form">
        <el-form-item label="文档类型" prop="type">
          <el-select v-model="type" placeholder="文档类型">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 60%" :disabled="type !== 'separate'" placeholder="分隔符号" v-model="separate"></el-input>
        </el-form-item>
        <el-form-item label="键" prop="key">
          <el-input v-model="form.dict_key" placeholder="">
            <template slot="prepend">{{ keyPre }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="值" prop="dict_value">
          <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 1000}" v-model="form.dict_value"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ isModify ? '立即修改' : '立即创建' }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Dict',
  data () {
    return {
      tableData: [],
      form: {
        dict_key: '',
        dict_value: '',
        remark: ''
      },
      keyPre: 'SEC_',
      remark: '',
      type: 'text',
      types: [
        {value: 'text', label: 'text'},
        {value: 'json', label: 'json'},
        {value: 'separate', label: 'separate'}
      ],
      separate: '',
      dialogAddDictVisible: false,
      isModify: false
    }
  },
  created () {
    this.loadData(1)
  },
  methods: {
    onSearch () {},
    handleEdit (index, row) {
      this.dialogAddDictVisible = true
      this.isModify = true
      let dict = JSON.parse(row.dict_value)
      this.type = dict.type
      this.separate = dict.separate
      this.form.remark = row.remark
      this.form.dict_key = row.dict_key.replace(this.keyPre, '')
      this.form.dict_value = dict.info
    },
    handleDelete (index, row) {
      let that = this
      this.$confirm('是否确认删除字典: ' + row.remark, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$http.post('/del/dict', { 'dict_key': row.dict_key }).then(res => {
          that.$message.success('删除成功')
          that.tableData.items.splice(index, 1)
        })
      }).catch(() => {})
    },
    onSubmit () {
      let that = this
      this.form.dict_value = JSON.stringify({
        'type': this.type,
        'separate': this.separate,
        'info': this.form.dict_value
      })
      if (this.form.dict_key === undefined || this.form.dict_key === null) {
        this.$message.error('键为空')
        return
      }
      if (!this.form.dict_key.startsWith(this.keyPre)) this.form.dict_key = this.keyPre + this.form.dict_key
      this.$http.post('/add/dict', this.form).then(res => {
        this.$refs['form'].resetFields()
        if (res.data.code === 'error') {
          that.$message.error(res.data.msg)
          return
        }
        this.isModify = false
        that.type = that.types[0].value
        that.$message.success('添加成功')
        that.dialogAddDictVisible = false
        that.loadData(1)
      })
    },
    loadData (next) {
      let that = this
      this.$http.get('/query/dict', { params: { next: next, remark: this.remark } }).then(res => {
        that.tableData = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
