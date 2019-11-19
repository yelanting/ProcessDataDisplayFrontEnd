<template>
<div class='app-container'>
    <div class='filter-container'>
        <el-input v-model='searchContent' class='filter-item' style='width:200px;' @keyup.enter.native='searchListWithCondition' placeholder='请输入待查数据来源名称' />
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-search' @click.native.prevent='searchListWithCondition' title='以输入内容重新搜索列表'>
            搜索
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-plus' @click='handleCreateDataComingSource' title='新增一个数据来源信息'>新增
        </el-button>
        <el-button class='filter-item' size='small' type='danger' icon='el-icon-delete-solid' @click='handleDeleteInBatch' title='批量删除所选数据'>批量删除
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-refresh-right' @click.native.prevent='refreshDataComingSourceList' title='重刷此页，会丢失搜索输入框'>刷新
        </el-button>
    </div>

    <el-table v-loading='listLoading' :data='list' element-loading-text='Loading' :default-sort="{prop: ' id', order: 'asc' }" ref='multipleTable' tooltip-effect='dark' @selection-change='handleSelectionChange' border stripe fit highlight-current-row style='width: 100%;'>
        <el-table-column align='center' type='selection' width='55' label='全选'>
        </el-table-column>
        <el-table-column align='center' label='ID' width='95' prop='id' sortable>
            <template slot-scope='scope'>
                {{ scope.row.id }}
            </template>
        </el-table-column>
        <el-table-column label='来源名称' width='120' align='center' prop='sourceName' sortable>
            <template slot-scope='scope'>
                <span>{{ scope.row.sourceName }}</span>
            </template>
        </el-table-column>
        <el-table-column label='关联数据库' width='120' align='center' sortable>
            <template slot-scope='scope'>
                {{ scope.row.databaseInfo.databaseName }}
            </template>
        </el-table-column>
        <el-table-column class-name='status-col' label='来源描述' width='120' align='center' prop='description' sortable>
            <template slot-scope='scope'>
                <span>{{ scope.row.description }}</span>
            </template>
        </el-table-column>

        <el-table-column label='操作' align='center'>
            <template slot-scope='scope'>
                <el-button size='mini' @click='handleUpdateDataComingSource(scope.row)' icon='el-icon-edit'>编辑</el-button>
                <el-button size='mini' type='danger' @click='handleDelete(scope.row)' icon='el-icon-delete'>删除</el-button>
                <el-button size='mini' type='success' @click='handleViewDataComingSourceInfo(scope.row)' icon='el-icon-view'>查看</el-button>
                <el-button size='mini' type='primary' @click='handleExecuteSql(scope.row)' icon='el-icon-video-play'>执行sql</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show='total>0' :total='total' :page.sync='listQuery.page' :limit.sync='listQuery.limit' @pagination='fetchData' />

    <el-dialog title='新增数据来源' :visible='addDataComingSourceFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' destroy-on-close>
        <el-form :label-position='labelPosition' id='#addDataComingSourceForm' ref='addDataComingSourceForm' :model='addDataComingSourceForm' label-width='120px'>
            <el-form-item label='来源名称' prop='sourceName'>
                <el-input v-model='addDataComingSourceForm.sourceName' placeholder="请输入来源名称"></el-input>
            </el-form-item>
            <el-form-item label='数据库信息' prop='databaseInfoId'>
                <el-select v-model="addDataComingSourceForm.databaseInfoId" clearable style="width:100%" placeholder='请选择一个数据库信息'>
                    <el-option v-for="item in this.databaseInfoList" :key="item.id" :label="item.databaseName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label='执行Sql' prop='executeSql'>
                <el-input v-model='addDataComingSourceForm.executeSql' placeholder="请输入执行sql"></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='addDataComingSourceForm.description' placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='addDataComingSource'>确定</el-button>
                <el-button @click="addDataComingSourceFlag = false;cancelAdd(' formt')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title='修改数据来源' :visible='updateDataComingSourceFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' destroy-on-close>
        <el-form :label-position='labelPosition' id='#updateDataComingSourceForm' ref='updateDataComingSourceForm' :model='updateDataComingSourceForm' label-width='80px'>
            <el-form-item label='来源名称' prop=' sourceName'>
                <el-input v-model='updateDataComingSourceForm.sourceName'></el-input>
            </el-form-item>
            <el-form-item label='数据库' prop='databaseInfoId'>
                <el-select v-model="updateDataComingSourceForm.databaseInfoId" clearable style="width:100%" placeholder='请选择一个数据库信息'>
                    <el-option v-for="item in this.databaseInfoList" :key="item.id" :label="item.databaseName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label='执行Sql' prop='executeSql'>
                <el-input v-model='updateDataComingSourceForm.executeSql'></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='updateDataComingSourceForm.description'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='updateDataComingSource'>确定</el-button>
                <el-button @click="updateDataComingSourceFlag = false;cancelupdate(' formt')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title='查看数据来源' :visible='viewDataComingSourceFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog'>
        <el-form :label-position='labelPosition' id='#viewDataComingSourceForm' ref='viewDataComingSourceForm' :model='viewDataComingSourceForm' label-width='80px'>
            <el-form-item label='来源名称' prop=' sourceName'>
                <el-input v-model='viewDataComingSourceForm.sourceName' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='数据库'>
                <el-input v-model='viewDataComingSourceForm.executeSql' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='执行Sql' prop='executeSql'>
                <el-input v-model='viewDataComingSourceForm.executeSql' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='viewDataComingSourceForm.description' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title='执行Sql结果' :visible='executeSqlResultFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' destroy-on-close :width='dialogWidth'>
        <el-table v-loading='listLoading' :data='executeResultList' element-loading-text='Loading' tooltip-effect='dark' border stripe fit highlight-current-row style='width: 100%;'  max-height="500">
            <el-table-column align='center' label='index' width='95' sortable>
                <template slot-scope='scope'>
                    {{ scope.$index }}
                </template>
            </el-table-column>
            <el-table-column label='数据' align='center' sortable>
                <template slot-scope='scope'>
                    <span>{{ scope.row }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</div>
</template>

<script>
import * as DataComingSourceApi from '@/api/dataComingSource';
import * as databaseInfoApi from '@/api/databaseInfo';

import Pagination from '@/components/Pagination';
import waves from '@/directive/waves';
import * as globalData from '@/configs/global';

export default {
    name: 'DataComingSourceTable',
    components: {
        Pagination
    },
    directives: {
        waves
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                published: 'success',
                draft: 'gray',
                deleted: 'danger'
            };
            return statusMap[status];
        }
    },
    data() {
        return {
            list: null,
            listLoading: true,
            searchContent: null,
            stripe: true,
            labelPosition: 'left',
            multipleSelection: [],
            total: 0,
            listQuery: {
                page: 1,
                limit: 20,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
            addDataComingSourceFlag: false,
            updateDataComingSourceFlag: false,
            viewDataComingSourceFlag: false,
            executeSqlResultFlag: false,
            addDataComingSourceForm: {
                databaseInfoId: null,
                databaseInfo: {
                    databaseName: null,
                    id: null,
                }

            },
            updateDataComingSourceForm: {
                databaseInfoId: null,
                databaseInfo: {
                    databaseName: null,
                    id: null,
                }
            },
            executeSqlDataComingSourceForm: {},

            viewDataComingSourceForm: {
                databaseInfoId: null,
                databaseInfo: {
                    databaseName: null,
                    id: null,
                }
            },
            databaseInfoList: [],
            executeResultList: [],
            dialogWidth: globalData.defaultDialogWidth,
        };
    },
    created() {
        this.fetchData();
        this.getDatabaseInfoList();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            this.searchContent = '';
            DataComingSourceApi.getList().then(response => {
                this.list = response.data;
                this.listLoading = false;
                this.total = response.data.length;
            });
        },
        searchListWithCondition() {
            if (!this.searchContent) {
                this.$message({
                    message: '请输入搜索条件',
                    type: 'warning'
                })
                return false;
            }

            this.listLoading = true;
            DataComingSourceApi.searchList(this.searchContent).then(response => {
                this.list = response.data;
                this.listLoading = false;
                this.total = response.data.length;
            });
        },
        refreshDataComingSourceList() {
            this.listLoading = true;
            this.searchContent = '';
            DataComingSourceApi.getList().then(response => {
                this.list = response.data;
                this.listLoading = false;
                this.total = response.data.length;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                importance: 1,
                remark: '',
                timestamp: new Date(),
                title: '',
                status: 'published',
                type: ''
            }
        },
        handleCreateDataComingSource() {
            this.addDataComingSourceFlag = true;
            this.getDatabaseInfoList();
            this.addDataComingSourceForm = {};
        },
        handleUpdateDataComingSource(row) {
            this.updateDataComingSourceFlag = true;
            this.updateDataComingSourceForm = Object.assign({}, row);
            this.getDatabaseInfoList();
        },
        handleExecuteSql(row) {
            this.executeSqlResultFlag = true;
            this.executeSqlDataComingSourceForm = Object.assign({}, row);
            this.executeResultList = this.getExecuteResult();
        },
        handleDelete(row) {
            this.$confirm('确认要删除该数据吗', '警告信息', {}).then(() => {
                DataComingSourceApi.deleteByIdSinglely(row.id).then(response => {
                    if (!response.success) {
                        this.$message.error('删除失败');
                    } else {
                        this.fetchData();
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    }
                })
            });
        },
        addDataComingSource() {
            DataComingSourceApi.addDataComingSource(this.addDataComingSourceForm).then(response => {
                if (!response.success) {
                    if (response.msg) {
                        this.$message.error(response.msg);
                        return false;
                    }
                    this.$message.error('新增失败');
                } else {
                    this.fetchData();
                    this.$message({
                        message: '新增成功！',
                        type: 'success'
                    });
                    this.addDataComingSourceFlag = false;
                }
            })
        },
        updateDataComingSource(index, row) {
            DataComingSourceApi.updateDataComingSource(this.updateDataComingSourceForm).then(response => {
                if (!response.success) {
                    this.$message.error('修改失败');
                } else {
                    this.fetchData();
                    this.$message({
                        message: '修改成功！',
                        type: 'success'
                    });
                    this.updateDataComingSourceFlag = false;
                }
            })
        },
        handleDeleteInBatch() {
            let _this = this;
            const length = this.multipleSelection.length;

            if (!length) {
                this.$message({
                    message: '请选择需要删除的内容',
                    type: 'warning'
                });

                return false;
            }

            let toDeleteIds = [];
            for (let i = 0; i <= length - 1; i++) {
                toDeleteIds.push(this.multipleSelection[i].id);
            }

            if (toDeleteIds.length === 0) {
                this.$message({
                    message: '请选择需要删除的内容',
                    type: 'warning'
                });

                return false;
            }

            this.$confirm('确认要删除这些数据吗？不可恢复哦!', '警告信息', {}).then(() => {
                DataComingSourceApi.deleteInBatch(toDeleteIds).then(response => {
                    if (!response.success) {
                        this.$message.error('删除失败');
                    } else {
                        this.fetchData();
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    }

                });
            });
        }, // 点击模态框关闭按钮关闭模态框
        closeDialog() {
            this.addDataComingSourceFlag = false;
            this.updateDataComingSourceFlag = false;
            this.viewDataComingSourceFlag = false;
            this.executeSqlResultFlag = false;
        },
        handleViewDataComingSourceInfo(row) {
            this.viewDataComingSourceFlag = true;
            this.viewDataComingSourceForm = Object.assign({}, row);
        },
        async getDatabaseInfoList() {
            let response = await databaseInfoApi.getList();
            this.databaseInfoList = [];
            console.log(response.success);

            if (response.success) {
                this.databaseInfoList = response.data;
                console.log(this.databaseInfoList);
            } else {
                this.$message({
                    message: '查询数据库类型列表失败！！！',
                    type: 'warning'
                });
            }
        },
        getExecuteResult() {
            DataComingSourceApi.executeSql(this.executeSqlDataComingSourceForm).then(response => {
                if (!response.success) {
                    this.$message.error('执行失败');
                    return false;
                } else {
                    this.executeResultList = response.data;
                }
            });
        }
    }
}
</script>
