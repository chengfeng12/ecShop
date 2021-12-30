<template>
  <div class="tablePage">
    <div v-if="searchable && searchPlace === 'top'" class="search-con search-con-top">
      <Row>
        <i-col span="10">
          <Select v-model="searchKey" class="search-col">
            <Option
              v-for="item in columns"
              v-if="item.key !== 'handle'"
              :value="item.key"
              :key="`search-col-${item.key}`"
            >{{ item.title }}</Option>
          </Select>
        </i-col>
        <i-col span="10">
          <Input
            @on-change="handleClear"
            clearable
            placeholder="输入关键字搜索"
            class="search-input col-8"
            v-model="searchValue"
          />
        </i-col>
        <i-col span="4">
          <Button @click="handleSearch" class="search-btn" type="primary">搜索</Button>
        </i-col>
      </Row>
    </div>
    <Table
      ref="tablesMain"
      :data="insideTableData"
      :columns="insideColumns"
      :stripe="stripe"
      :border="border"
      :show-header="showHeader"
      :width="width"
      :height="height"
      :loading="loading"
      :disabled-hover="disabledHover"
      :highlight-row="highlightRow"
      :row-class-name="rowClassName"
      :size="size"
      :no-data-text="noDataText"
      :no-filtered-data-text="noFilteredDataText"
    ></Table>
    <div v-if="searchable && searchPlace === 'bottom'" class="search-con search-con-top">
      <Select v-model="searchKey" class="search-col">
        <Option
          v-for="item in columns"
          v-if="item.key !== 'handle'"
          :value="item.key"
          :key="`search-col-${item.key}`"
        >{{ item.title }}</Option>
      </Select>
      <Input placeholder="输入关键字搜索" class="search-input" v-model="searchValue"/>
      <Button class="search-btn" type="primary">搜索</Button>
    </div>
    <a id="hrefToExportTable" style="display: none;width: 0px;height: 0px;"></a>
  </div>
</template>

<script>
// import api from '@/api/request'
export default {
  name: "Tables",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: false
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: "top"
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      insideColumns: [],
      insideTableData: [],
      edittingCellId: "",
      edittingText: "",
      searchValue: "",
      searchKey: ""
    };
  },
  methods: {
    // 获取数据的方法
    // getData() {
    //    api.request("api/goodsCategory/detail","POST",{
    //         'id': this.classId
    //     }).then(res => {
    //         console.log(res)
    //         // 把列表的数据显示出来
    //         // this.
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // },
    surportHandle(item) {
      let options = item.options || [];
      let insideBtns = [];
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item]);
      });
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns;
      item.render = (h, params) => {
        params.tableData = this.value;
        return h("div", btns.map(item => item(h, params, this)));
      };
      return item;
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        // console.log(item)
        let res = item;
        if (res.editable) res = this.suportEdit(res, index);
        if (res.key === "handle") res = this.surportHandle(res);
        return res;
      });
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.columns[0].key !== "handle"
          ? this.columns[0].key
          : this.columns.length > 1
          ? this.columns[1].key
          : "";
    },
    // 清除
    handleClear(e) {
      if (e.target.value === "") this.insideTableData = this.value;
    },
    // 搜索
    handleSearch() {
      this.insideTableData = this.value.filter(
        item => item[this.searchKey].indexOf(this.searchValue) > -1
      );
    },
    // 获取
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item;
        res.initRowIndex = index;
        return res;
      });
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow();
    }
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns);
      this.setDefaultSearchKey();
    },
    value(val) {
      this.handleTableData();
      if (this.searchable) this.handleSearch();
    }
  },
  mounted() {
    // console.log(this.columns)
    this.handleColumns(this.columns);
    this.setDefaultSearchKey();
    this.handleTableData();
    // 父级传递的表头
    // console.log(this.insideColumns)
    // // 父级的数据
    // console.log(this.insideTableData)
    // // false
    // console.log(this.edittingCellId)
  }
};
</script>

<style scope>
.search-btn {
  width: 100%;
  text-align: center;
}
</style>
