<template>
<div class='app-container'>
    <div class='filter-container'>
        <el-input v-model='searchContent' class='filter-item' style='width:200px;' maxlength='30' @keyup.enter.native='searchListWithCondition' show-word-limit placeholder='请输入待查英文名' />
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-search' @click.native.prevent='searchListWithCondition' title='以输入内容重新搜索列表'>
            搜索
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-plus' @click='handleCreateDatabaseType' title='新增一个数据库类型'>新增
        </el-button>
        <el-button class='filter-item' size='small' type='danger' icon='el-icon-delete-solid' @click='handleDeleteInBatch' title='批量删除所选数据'>批量删除
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-refresh-right' @click.native.prevent='refreshDatabaseTypeList' title='重刷此页，会丢失搜索输入框'>刷新
        </el-button>
    </div>

    <el-table v-loading='listLoading' :data='list' element-loading-text='Loading' :default-sort="{prop: 'id', order: 'asc' }" ref='multipleTable' tooltip-effect='dark' @selection-change='handleSelectionChange' border stripe fit highlight-current-row style='width: 100%;'>
        <el-table-column align='center' type='selection' width='55' label='全选'>
        </el-table-column>
        <el-table-column align='center' label='ID' width='95' prop='id' sortable>
            <template slot-scope='scope'>
                {{ scope.row.id }}
            </template>
        </el-table-column>
        <el-table-column label='类型中文名' width='120' align='center' prop='name' sortable>
            <template slot-scope='scope'>
                <span>{{ scope.row.typeName }}</span>
            </template>
        </el-table-column>
        <el-table-column label='类型英文名' width='120' align='center' prop='ename' sortable>
            <template slot-scope='scope'>
                {{ scope.row.typeEname }}
            </template>
        </el-table-column>

        <el-table-column label='操作' align='center'>
            <template slot-scope='scope'>
                <el-button size='mini' @click='handleUpdateDatabaseType(scope.row)' icon='el-icon-edit'>编辑</el-button>
                <el-button size='mini' type='danger' @click='handleDelete(scope.row)' icon='el-icon-delete'>删除</el-button>
                <el-button size='mini' type='success' @click='handleViewDatabaseTypeInfo(scope.row)' icon='el-icon-view'>查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show='total>0' :total='total' :page.sync='listQuery.page' :limit.sync='listQuery.limit' @pagination='fetchData' />

    <el-dialog title='新增数据库类型' :visible='addDatabaseTypeFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' destroy-on-close>
        <el-form id='#addDatabaseTypeForm' :label-position='labelPosition' :rules='rules' ref='addDatabaseTypeFormRef' :model='addDatabaseTypeForm' label-width='80px'>
            <el-form-item label='中文名' prop='typeName'>
                <el-input v-model='addDatabaseTypeForm.typeName' placeholder='数据库类型中文名' maxlength='30' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='英文名' prop='typeEname'>
                <el-input v-model='addDatabaseTypeForm.typeEname' placeholder='数据库类型英文名' maxlength='30' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='addDatabaseTypeForm.description' placeholder='数据库类型描述' maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='addDatabaseType'>确定</el-button>
                <el-button @click='addDatabaseTypeFlag = false;'>取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title='修改数据库类型' :visible='updateDatabaseTypeFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' destroy-on-close>
        <el-form id='#updateDatabaseTypeForm' :label-position='labelPosition' :rules='rules' ref='updateDatabaseTypeFormRef' :model='updateDatabaseTypeForm' label-width='80px'>
            <el-form-item label='中文名' prop='typeName'>
                <el-input v-model='updateDatabaseTypeForm.typeName' placeholder='数据库类型中文名' maxlength='30' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='英文名' prop='typeEname'>
                <el-input v-model='updateDatabaseTypeForm.typeEname' placeholder='数据库类型英文名' maxlength='30' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='updateDatabaseTypeForm.description' placeholder='数据库类型描述' maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='updateDatabaseType'>确定</el-button>
                <el-button @click='updateDatabaseTypeFlag = false;'>取消</el-button>
            </el-form-item>.
        </el-form>
    </el-dialog>

    <el-dialog title='查看数据库类型' :visible='viewDatabaseTypeFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog'>
        <el-form id='#viewDatabaseTypeForm' ref='viewDatabaseTypeForm' :label-position='labelPosition' :model='viewDatabaseTypeForm' label-width='80px'>
            <el-form-item label='中文名' prop='typeName'>
                <el-input v-model='viewDatabaseTypeForm.typeName' readonly placeholder='暂无数据'></el-input>
            </el-form-item>
            <el-form-item label='英文名' prop='typeEname'>
                <el-input v-model='viewDatabaseTypeForm.typeEname' readonly placeholder='暂无数据'></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='viewDatabaseTypeForm.description' readonly placeholder='暂无数据'></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import * as databaseTypeApi from '@/api/databaseType';

import Pagination from '@/components/Pagination';
import waves from '@/directive/waves';

export default {
    name: 'DatabaseTypeTable',
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
            addDatabaseTypeFlag: false,
            updateDatabaseTypeFlag: false,
            viewDatabaseTypeFlag: false,
            addDatabaseTypeForm: {

            },
            updateDatabaseTypeForm: {

            },

            viewDatabaseTypeForm: {

            },
            addDatabaseTypeFormRef: {
                typeName: '',
                typeEname: '',
                description: '',
            },
            updateDatabaseTypeFormRef: {
                typeName: '',
                typeEname: '',
                description: '',
            },
            rules: {
                typeName: [{
                        required: true,
                        message: '请输入数据库类型中文名',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 200,
                        message: '长度在1到 200个字符',
                        trigger: 'blur'
                    }
                ],
                typeEname: [{
                        required: true,
                        message: '请输入数据库类型英文名',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '长度在1到100个字符',
                        trigger: 'blur'
                    }
                ],
                description: [{
                    min: 0,
                    max: 500,
                    message: '长度不能大于500个字符',
                    trigger: 'blur'
                }]

            }
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            this.searchContent = '';
            databaseTypeApi.getList().then(response => {
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
            databaseTypeApi.searchList(this.searchContent).then(response => {
                this.list = response.data;
                this.listLoading = false;
                this.total = response.data.length;
            });
        },
        refreshDatabaseTypeList() {
            this.listLoading = true;
            this.searchContent = '';
            databaseTypeApi.getList().then(response => {
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
        handleCreateDatabaseType() {
            this.addDatabaseTypeFlag = true;
            this.addDatabaseTypeForm = {};
        },
        handleUpdateDatabaseType(row) {
            this.updateDatabaseTypeFlag = true;
            this.updateDatabaseTypeForm = Object.assign({}, row);
        },
        handleDelete(row) {
            this.$confirm('确认要删除该数据吗', '警告信息', {}).then(() => {
                databaseTypeApi.deleteByIdSinglely(row.id).then(response => {
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
        addDatabaseType() {
            this.$refs.addDatabaseTypeFormRef.validate((valid) => {
                if (valid) {
                    databaseTypeApi.addDatabaseType(this.addDatabaseTypeForm).then(response => {
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
                            this.addDatabaseTypeFlag = false;
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        updateDatabaseType(index, row) {
            this.$refs.updateDatabaseTypeFormRef.validate((valid) => {
                if (valid) {
                    databaseTypeApi.updateDatabaseType(this.updateDatabaseTypeForm).then(response => {
                        if (!response.success) {
                            this.$message.error('修改失败');
                        } else {
                            this.fetchData();
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.updateDatabaseTypeFlag = false;
                        }
                    })
                } else {
                    return false;
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
                databaseTypeApi.deleteInBatch(toDeleteIds).then(response => {
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
            this.addDatabaseTypeFlag = false;
            this.updateDatabaseTypeFlag = false;
            this.viewDatabaseTypeFlag = false;
        },
        handleViewDatabaseTypeInfo(row) {
            this.viewDatabaseTypeFlag = true;
            this.viewDatabaseTypeForm = Object.assign({}, row);
        }
    }
};
</script>
