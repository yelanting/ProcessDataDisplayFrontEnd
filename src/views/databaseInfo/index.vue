<template>
<div class='app-container'>
    <div class='filter-container'>
        <el-input v-model='searchContent' class='filter-item' style='width:200px;' @keyup.enter.native='searchListWithCondition' maxlength='30' show-word-limit placeholder='请输入待查数据库名' />
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-search' @click.native.prevent='searchListWithCondition' title='以输入内容重新搜索列表'>
            搜索
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-plus' @click='handleCreateDatabaseInfo' title='新增一个数据库信息'>新增
        </el-button>
        <el-button class='filter-item' size='small' type='danger' icon='el-icon-delete-solid' @click='handleDeleteInBatch' title='批量删除所选数据'>批量删除
        </el-button>
        <el-button class='filter-item' size='small' type='primary' icon='el-icon-refresh-right' @click.native.prevent='refreshDatabaseInfoList' title='重刷此页，会丢失搜索输入框'>刷新
        </el-button>
    </div>

    <el-table v-loading='listLoading' :data='list' element-loading-text='Loading' :default-sort="{prop: 'id', order: 'asc' }" ref='multipleTable' tooltip-effect='dark' @selection-change='handleSelectionChange' border stripe fit highlight-current-row style='width: 100%;'>
        <el-table-column align='center' type='selection' width='55' label='全选'>
        </el-table-column>
        <el-table-column align='center' label='ID' width='60' prop='id' sortable>
            <template slot-scope='scope'>
                {{ scope.row.id }}
            </template>
        </el-table-column>
        <el-table-column label='数据库名' width='120' align='center' prop='databaseName' sortable>
            <template slot-scope='scope'>
                <span>{{ scope.row.databaseName }}</span>
            </template>
        </el-table-column>
        <el-table-column label='类型' width='80' align='center' sortable>
            <template slot-scope='scope'>
                <span>{{ scope.row.databaseType.typeName }}</span>
            </template>
        </el-table-column>
        <el-table-column label='ip地址' width='100' align='center' prop='databaseIp' sortable>
            <template slot-scope='scope'>
                {{ scope.row.databaseIp }}
            </template>
        </el-table-column>
        <el-table-column label='端口' width='80' align='center' prop='port' sortable>
            <template slot-scope='scope'>
                {{ scope.row.port }}
            </template>
        </el-table-column>
        <el-table-column label='实例名' width='180' align='left' prop='instanceName' sortable>
            <template slot-scope='scope'>
                {{ scope.row.instanceName }}
            </template>
        </el-table-column>

        <el-table-column label='操作' align='center'>
            <template slot-scope='scope'>
                <el-button size='mini' @click='handleUpdateDatabaseInfo(scope.row)' icon='el-icon-edit'>编辑</el-button>
                <el-button size='mini' type='danger' @click='handleDelete(scope.row)' icon='el-icon-delete'>删除</el-button>
                <el-button size='mini' type='success' @click='handleViewDatabaseInfoInfo(scope.row)' icon='el-icon-view'>查看</el-button>
            </template>
        </el-table-column>
    </el-table>
    <pagination v-show='total>0' :total='total' :page.sync='listQuery.page' :limit.sync='listQuery.limit' @pagination='fetchData' />

    <el-dialog title='新增数据库信息' :visible='addDatabaseInfoFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' :width='dialogWidth' destroy-on-close>
        <el-form id='#addDatabaseInfoForm' :label-position='labelPosition' :rules='databaseInfoRules' ref='addDatabaseInfoFormRef' :model='addDatabaseInfoForm' label-width='100px'>
            <el-form-item label='数据库名' prop='databaseName'>
                <el-input v-model='addDatabaseInfoForm.databaseName' placeholder="请输入数据库名称" maxlength='30' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='数据库类型' prop='databaseTypeId'>
                <el-select v-model="addDatabaseInfoForm.databaseTypeId" placeholder='请选择一个数据库类型' style="width:100%" required>
                    <el-option v-for="item in this.databaseTypeList" :key="item.id" :label="item.typeName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label='ip地址' prop='databaseIp'>
                <el-input v-model='addDatabaseInfoForm.databaseIp' placeholder="请输入数据库ip" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='连接端口' prop='port'>
                <el-input v-model='addDatabaseInfoForm.port' placeholder="请输入数据库端口" maxlength='10' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='实例名称' prop='instanceName'>
                <el-input v-model='addDatabaseInfoForm.instanceName' placeholder="请输入实例名称" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='登录用户' prop='username'>
                <el-input v-model='addDatabaseInfoForm.username' placeholder="请输入数据库登录帐号" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='登录密码' prop='password'>
                <el-input type='password' v-model='addDatabaseInfoForm.password' placeholder="请输入数据库登录密码" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='连接地址' prop='connectUrl'>
                <el-input v-model='addDatabaseInfoForm.connectUrl' placeholder="请输入数据库连接地址" maxlength='200' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='addDatabaseInfoForm.description' placeholder="请输入备注" maxlength='200' show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='addDatabaseInfoInForm'>确定</el-button>
                <el-button @click="addDatabaseInfoFlag = false;">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <el-dialog title='修改数据库信息' :visible='updateDatabaseInfoFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' :width='dialogWidth' destroy-on-close>
        <el-form id='#updateDatabaseInfoForm' :label-position='labelPosition' :rules='databaseInfoRules' ref='updateDatabaseInfoFormRef' :model='updateDatabaseInfoForm' label-width='120px'>
            <el-form-item label='数据库名' prop='databaseName'>
                <el-input v-model='updateDatabaseInfoForm.databaseName' placeholder="请输入数据库名称" maxlength='30' show-word-limit> </el-input>
            </el-form-item>
            <el-form-item label='数据库类型' prop='databaseTypeId'>
                <el-select v-model="updateDatabaseInfoForm.databaseTypeId" placeholder='请选择一个数据库类型' style="width:100%">
                    <el-option v-for="item in this.databaseTypeList" :key="item.id" :label="item.typeName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label='ip地址' prop='databaseIp'>
                <el-input v-model='updateDatabaseInfoForm.databaseIp' placeholder="请输入数据库ip" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='连接端口' prop='port'>
                <el-input v-model='updateDatabaseInfoForm.port' placeholder="请输入数据库连接端口" maxlength='10' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='实例名称' prop='instanceName'>
                <el-input v-model='updateDatabaseInfoForm.instanceName' placeholder="请输入数据库实例名称" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='登录用户' prop='username'>
                <el-input v-model='updateDatabaseInfoForm.username' placeholder="请输入数据库登录帐号" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='登录密码' prop='password'>
                <el-input type='password' v-model='updateDatabaseInfoForm.password' placeholder="请输入数据库登录密码" maxlength='100' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='连接地址' prop='connectUrl'>
                <el-input v-model='updateDatabaseInfoForm.connectUrl' placeholder="请输入数据库连接地址" maxlength='200' show-word-limit></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='updateDatabaseInfoForm.description' placeholder="请输入备注" maxlength='200' show-word-limit></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click='updateDatabaseInfoInForm'>确定</el-button>
                <el-button @click="updateDatabaseInfoFlag = false;">取消</el-button>
            </el-form-item>.
        </el-form>
    </el-dialog>

    <el-dialog title='查看数据库信息' :visible='viewDatabaseInfoFlag' size='tiny' :modal-append-to-body='false' @close='closeDialog' :width='dialogWidth'>
        <el-form id='#viewDatabaseInfoForm' :label-position='labelPosition' ref='viewDatabaseInfoForm' :model='viewDatabaseInfoForm' label-width='120px'>
            <el-form-item label='数据库名' prop='databaseName'>
                <el-input v-model='viewDatabaseInfoForm.databaseName' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='数据库类型'>
                <el-input v-model='viewDatabaseInfoForm.databaseType.typeName' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='ip地址' prop='databaseIp'>
                <el-input v-model='viewDatabaseInfoForm.databaseIp' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='连接端口' prop='port'>
                <el-input v-model='viewDatabaseInfoForm.port' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='实例名称' prop='instanceName'>
                <el-input v-model='viewDatabaseInfoForm.instanceName' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='登录用户' prop='username'>
                <el-input v-model='viewDatabaseInfoForm.username' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='登录密码' prop='password'>
                <el-input v-model='viewDatabaseInfoForm.password' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='连接地址' prop='connectUrl'>
                <el-input v-model='viewDatabaseInfoForm.connectUrl' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
            <el-form-item label='描述' prop='description'>
                <el-input v-model='viewDatabaseInfoForm.description' readonly placeholder="暂无数据"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import * as DatabaseInfoApi from '@/api/databaseInfo';
import * as databaseTypeApi from '@/api/databaseType';

import * as globalData from '@/configs/global';

import Pagination from '@/components/Pagination';
import waves from '@/directive/waves';

export default {
    name: 'DatabaseInfoTable',
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
            addDatabaseInfoFlag: false,
            updateDatabaseInfoFlag: false,
            viewDatabaseInfoFlag: false,
            addDatabaseInfoForm: {
                databaseTypeId: null,
                databaseType: null,
            },
            updateDatabaseInfoForm: {
                databaseTypeId: null,
                databaseType: null,
            },

            viewDatabaseInfoForm: {
                databaseTypeId: null,
                databaseType: {
                    typeName: null
                },

            },
            databaseTypeList: [],

            dialogWidth: globalData.defaultDialogWidth,

            addDatabaseInfoFormRef: {
                databaseName: '',
                instanceName: '',
                databaseTypeId: '',
                databaseIp: '',
                port: '',
                username: '',
                password: '',
                description: '',
            },
            updateDatabaseInfoFormRef: {
                databaseName: '',
                instanceName: '',
                databaseTypeId: '',
                databaseIp: '',
                port: '',
                username: '',
                password: '',
                description: '',
            },
            databaseInfoRules: {
                databaseName: [{
                        required: true,
                        message: "请输入数据库信息名称",
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 30,
                        message: '长度在1到30个字符',
                        trigger: 'blur'
                    }
                ],
                instanceName: [{
                        required: true,
                        message: "请输入数据库实例名称",
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 100,
                        message: "长度在1到100个字符",
                        trigger: 'blur'
                    }
                ],
                description: [{
                        min: 0,
                        max: 200,
                        message: '长度不能大于200个字符',
                        trigger: 'blur'
                    },

                ],
                databaseTypeId: [{
                        required: true,
                        message: '请选择数据库类型',
                        trigger: 'blur'
                    },

                ],
                databaseIp: [{
                        required: true,
                        message: '请输入数据库地址',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 100,
                        message: '长度在 1 和 100 个字符',
                        trigger: 'blur'
                    }
                ],
                port: [{
                        required: true,
                        message: '请输入数据库端口',
                        trigger: 'blur'
                    },
                    {
                        type: 'number',
                        message: '端口必须是个数字',
                        trigger: 'blur',
                    },
                    {
                        min: 1,
                        max: 10,
                        message: '长度在1和10个字符',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    created() {
        this.fetchData();
        // this.getDatabaseTypeList();
    },
    methods: {
        fetchData() {
            this.listLoading = true;
            this.searchContent = '';
            DatabaseInfoApi.getList().then(response => {
                this.list = response.data;
                console.log(this.list);
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
            DatabaseInfoApi.searchList(this.searchContent).then(response => {
                this.list = response.data;
                this.listLoading = false;
                this.total = response.data.length;
            });
        },
        refreshDatabaseInfoList() {
            this.listLoading = true;
            this.searchContent = '';
            DatabaseInfoApi.getList().then(response => {
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
        handleCreateDatabaseInfo() {
            this.addDatabaseInfoFlag = true;
            this.getDatabaseTypeList();
            this.addDatabaseInfoForm = {};
        },
        handleUpdateDatabaseInfo(row) {
            this.updateDatabaseInfoFlag = true;
            this.updateDatabaseInfoForm = Object.assign({}, row);
            this.getDatabaseTypeList();
        },
        handleDelete(row) {
            this.$confirm('确认要删除该数据吗', '警告信息', {}).then(() => {
                DatabaseInfoApi.deleteByIdSinglely(row.id).then(response => {
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
        addDatabaseInfoInForm() {
            this.$refs.addDatabaseInfoFormRef.validate((valid) => {
                if (valid) {
                    DatabaseInfoApi.addDatabaseInfo(this.addDatabaseInfoForm).then(response => {
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
                            this.addDatabaseInfoFlag = false;
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        updateDatabaseInfoInForm(index, row) {
            this.$refs.updateDatabaseInfoFormRef.validate((valid) => {
                if (valid) {
                    DatabaseInfoApi.updateDatabaseInfo(this.updateDatabaseInfoForm).then(response => {
                        if (!response.success) {
                            this.$message.error('修改失败');
                        } else {
                            this.fetchData();
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.updateDatabaseInfoFlag = false;
                        }
                    })
                } else {
                    return false;
                }
            });

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

            const toDeleteIds = [];
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
                DatabaseInfoApi.deleteInBatch(toDeleteIds).then(response => {
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
            this.addDatabaseInfoFlag = false;
            this.updateDatabaseInfoFlag = false;
            this.viewDatabaseInfoFlag = false;
        },
        handleViewDatabaseInfoInfo(row) {
            this.viewDatabaseInfoFlag = true;
            this.viewDatabaseInfoForm = Object.assign({}, row);
            console.log(this.viewDatabaseInfoForm);
        },
        async getDatabaseTypeList() {
            let response = await databaseTypeApi.getList();
            this.databaseTypeList = [];
            if (response.success) {
                this.databaseTypeList = response.data;
                console.log(this.databaseTypeList);
            } else {
                this.$message({
                    message: '查询数据库类型列表失败！！！',
                    type: 'warning'
                });
            }
        }
    }
};
</script>
