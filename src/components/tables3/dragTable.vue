<template lang="">
    <div class="dragtable">
      <div>测试用的数据使用时删除</div> 
      <div>{{tableData}}</div>
      <div class="table-header">
          <div class="header-name" v-for="item in this.headerData">{{item}}</div>
      </div>
      <draggable element="div"  v-model="tableData"  class="table-body">
          <div v-for="items in tableData" class="table-tr">
            <div class="table-td">{{items.id}}</div>
            <div class="table-td">{{items.inventory}}</div>
            <div class="table-td">{{items.name}}</div>
            <div class="table-td">{{items.price}}</div>
          </div>
      </draggable >
    </div>
</template>
<script>
import api from "../../api/api.js";
import draggable from "vuedraggable";
import Sortable from "sortablejs";
export default {
  name: "dragTable",
  data() {
    return {
      headerData: ["id", "name", "inventory", "price"],
      tableData: []
    };
  },
  components: {
    draggable,
    Sortable
  },
  methods: {
    getgiftdata() {
      api
        .mockdata("/giftdata/index")
        .then(res => {
          this.tableData = res;
          console.log(this.tableData);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.getgiftdata();
  }
};
</script>
<style scoped>
.dragtable {
  width: 800px;
}
.table-header {
  width: 100%;
  border-top: 1px solid #e8eaec;
  border-left: 1px solid #e8eaec;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
.table-header .header-name {
  padding: 10px;
  background-color: #e8eaec;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
  width: 25%;
}
.table-body {
  width: 100%;
  border-left: 1px solid #e8eaec;
}
.table-body .table-tr {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}
.table-body .table-tr:nth-child(odd) {
  background-color: #f8f8f9;
}
.table-body .table-tr:nth-child(even) {
  background-color: #ffffff;
}
.table-body .table-tr .table-td {
  padding: 10px;
  width: 25%;
  border-bottom: 1px solid #e8eaec;
  border-right: 1px solid #e8eaec;
}
</style>
