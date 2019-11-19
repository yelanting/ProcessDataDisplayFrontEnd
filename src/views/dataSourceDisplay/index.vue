<template>
<div class="app-container">
    <el-table v-loading="listLoading" default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}"> row-key="id" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label="id" width="95">
            <template slot-scope="scope">
                {{ scope.row.id }}
            </template>
        </el-table-column>
        <el-table-column label="team">
            <template slot-scope="scope">
                {{ scope.row.team }}
            </template>
        </el-table-column>
        <el-table-column label="新增bug" width="110" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.bugs }}</span>
            </template>
        </el-table-column>
        <el-table-column label="新增用例" width="110" align="center">
            <template slot-scope="scope">
                {{ scope.row.addTestCase }}
            </template>
        </el-table-column>
        <el-table-column align="center" prop="executeCase" label="执行用例" width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.executeCase }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="addAutoTestCase" label="执行用例" width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.addAutoTestCase }}</span>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script>
import {
    getList
} from '@/api/dataSourceDisplay'

export default {
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            }
            return statusMap[status]
        }
    },
    data() {
        return {
            list: null,
            listLoading: true
        }
    },
    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            this.listLoading = true
            //   getList().then(response => {
            //     this.list = response.data.items
            //     this.listLoading = false
            //   })

            const response = getList();
            console.log(response);

            const data = response.data;

            console.log(data);
            const items= data.items;
            console.log(items);
            this.list = items;
            this.listLoading = false;
        }
    }
}
</script>
