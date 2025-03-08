import { getManagerList } from '@/api/manager'
import { ref, reactive, computed } from 'vue'
import type { rowList, roles, createUser, updateUser } from '@/types'
import { updateManagerStatus, createManager, updateManager, deleteManager } from '@/api/manager'
import type { ElForm, FormRules } from 'element-plus'
import { toast } from '@/composables/utils'
import FormDrawer from '@/components/formDrawer.vue'

export function initTable() {
  const searchForm = reactive({
    limit: 10,
    keyword: '',
  })

  const resetSearchForm = () => {
    searchForm.keyword = ''
    getData(1)
  }

  const tableData = ref([])
  const loading = ref(false)
  const roles = ref<Array<roles>>([])
  // 分页
  const currentPage = ref(1)
  const total = ref(0)
  const limit = ref(10)

  const editId = ref(0)
  const drawerTitle = computed(() => (editId.value ? '修改' : '新增'))
  // 获取数据
  function getData(p: number) {
    if (typeof p == 'number') {
      currentPage.value = p
    }
    loading.value = true
    getManagerList(currentPage.value, searchForm)
      .then((res) => {
        tableData.value = res.data.list
        total.value = res.data.totalCount
        roles.value = res.data.roles
      })
      .finally(() => {
        loading.value = false
      })
  }
  getData(1)
  // 删除
  const handleDelete = (id: number) => {
    loading.value = true
    deleteManager(id)
      .then(() => {
        toast('删除成功')
        getData(1)
      })
      .finally(() => {
        loading.value = false
      })
  }

  // 表单部分
  const formDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
  const formRef = ref<InstanceType<typeof ElForm>>()
  const form = reactive<createUser>({
    username: '',
    password: '',
    role_id: null,
    status: 1,
    avatar: '',
  })
  const rules = reactive<FormRules<typeof form>>({
    username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    role_id: [{ required: true, message: '所属角色不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
    avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
  })
  const handleSubmit = () => {
    formRef.value?.validate((valid) => {
      if (valid) {
        formDrawerRef.value?.showLoading()
        const fun = editId.value ? updateManager(editId.value, form) : createManager(form)
        fun
          .then(() => {
            toast(drawerTitle.value + '成功')
            // 修改刷新当前页，新增刷新第一页
            getData(editId.value ? currentPage.value : 1)
            formDrawerRef.value?.close()
          })
          .finally(() => {
            formDrawerRef.value?.hideLoading()
          })
      }
    })
  }
  // 重置表单
  function resetForm(id = 0, row: createUser) {
    formRef.value?.validate()
    if (id) {
      form.username = row.username
      form.password = row.password
      form.role_id = row.role_id
      form.status = row.status
      form.avatar = row.avatar
    }
  }
  // 新增
  const handleCreate = () => {
    editId.value = 0
    resetForm(0, {
      username: '',
      password: '',
      role_id: null,
      status: 1,
      avatar: '',
    })
    formDrawerRef.value?.open()
  }
  // 修改
  const handleEdit = (row: updateUser) => {
    editId.value = row.id
    resetForm(row.id, { ...row, password: '' })
    formDrawerRef.value?.open()
  }

  // 状态修改
  const handleStatusChange = (status: number, row: rowList) => {
    row.statusLoading = true
    updateManagerStatus(row.id, status)
      .then(() => {
        toast('修改成功')
        row.status = status
      })
      .finally(() => {
        row.statusLoading = false
      })
  }
  return {
    roles,
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    drawerTitle,
    getData,
    handleDelete,
    formDrawerRef,
    formRef,
    form,
    rules,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleStatusChange,
  }
}
