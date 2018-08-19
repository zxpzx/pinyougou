<template>
  <div id="goods">
    <!-- 面包屑 -->
    <el-breadcrumb class="mb_10" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="input5" class="input-with-select mb_10">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsData" highlight-current-row style="width: 100%">
      <el-table-column type="index" :index="indexMethod" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="商品时间">
        <template slot-scope="scope">
          {{scope.row.add_time | goodsDate }}
        </template>
      </el-table-column>
      <el-table-column label="商品操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit" plain></el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      query: '',
      current: 1,
      pagesize: 10,
      total: 0,
      goodsData: []
    }
  },
  methods: {
    // 渲染
    async getGoodsList () {
      const res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      console.log(res)
      const {meta, data} = res.data
      if (meta.status === 200) {
        this.goodsData = data.goods
        this.total = data.total
      }
    },
    // 控制一页多少
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1
      this.getGoodsList()
    },
    // 控制当前页
    handleCurrentChange (val) {
      this.current = val
      this.getGoodsList()
    },
    // 控制每页的下标
    indexMethod (index) {
      return (this.current - 1) * this.pagesize + index + 1
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less">
.mb_10 {
  margin-bottom: 10px;
}
.input-with-select {
  width: 300px;
}
</style>
