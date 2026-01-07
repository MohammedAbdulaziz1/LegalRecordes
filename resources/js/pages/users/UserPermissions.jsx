import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'
import Avatar from '../../components/ui/Avatar'
import { USER_ROLES, USER_ROLE_LABELS } from '../../utils/constants'

const UserPermissions = () => {
  const [selectedUser, setSelectedUser] = useState(0)
  const [role, setRole] = useState(USER_ROLES.ADMIN)
  const [permissions, setPermissions] = useState({
    primaryCases: {
      enabled: true,
      view: true,
      add: true,
      edit: true,
      delete: false
    },
    appealCases: {
      enabled: false
    },
    userManagement: {
      enabled: true,
      view: true,
      edit: true
    }
  })

  const users = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@firm.com',
      role: USER_ROLES.ADMIN,
      status: 'active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBia49PDutRQU1hdCOIu8TmKITN0W9DPO5bDrxL586pO_BDpaG4s-kk_pZOjOHqWWXepv3GHsAT9u19_pSVyR7AcKC93aFALkekBTA6oOACO7nZHhFjgSt4X1BIXq1OxpzWog0xo-efgQUe1jc2M4u7pTejo6uHDJHVxaVr_AMW8fKrVOdQJKIuWbMMVTqV6WzT5QBtCINFcAVeNn3wK6pHKu0ZEz0ax1OiWnvK3Oq_wqmRV6wyIKLWAxKhxm0rRfGFtnZQfJ2pLH0'
    },
    {
      id: 2,
      name: 'سارة علي',
      email: 'sara@firm.com',
      role: USER_ROLES.LAWYER,
      status: 'inactive',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoQjKtqtSL-r-GRnSX4Jq_hs8_g8_aRbJKVy8sjDCBhPcDfb7V55zQb1nARoP1UchjxWrYXUEddb6DN4tVbJWFMB_1-a-ooaE0xATqGbOUiX3dH90jqMTdPTCJm-b14sI6wSvYqhAGEaFbbwhfp03K8tPVYUZ1-3osIh9DToGBDjJXnlEjLBVVkvhvyiZB_VuksaNxDmapr83xAHTxt8HntcBTrXqf_pk0GH1lI4aNDNYRg52zqt3jzL615LyjigjKGvSt6H-ZsSM'
    }
  ]

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'الإعدادات', path: '/settings' },
    { label: 'إدارة الصلاحيات' }
  ]

  const togglePermission = (section, field) => {
    setPermissions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }))
  }

  const toggleSection = (section) => {
    setPermissions(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        enabled: !prev[section].enabled
      }
    }))
  }

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white">
            إدارة صلاحيات المستخدمين
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            تحكم في مستويات الوصول للموظفين والمحامين وتعيين الأدوار في النظام.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon="file_download">تصدير القائمة</Button>
          <Button variant="primary" icon="person_add">إضافة مستخدم</Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 mb-2">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              placeholder="بحث عن مستخدم بالاسم، الهوية، أو البريد الإلكتروني..."
            />
          </div>
          <Select
            value=""
            onChange={() => {}}
            options={[
              { value: '', label: 'جميع الأدوار' },
              ...Object.entries(USER_ROLES).map(([key, value]) => ({
                value,
                label: USER_ROLE_LABELS[value]
              }))
            ]}
            className="w-full md:w-48"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Users List */}
        <div className="xl:col-span-7">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">المستخدم</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">الدور الوظيفي</th>
                    <th className="px-6 py-4 text-start text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">الحالة</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(index)}
                      className={`group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        selectedUser === index ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} name={user.name} size="md" />
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/30 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300">
                          {USER_ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {user.status === 'active' ? 'نشط الآن' : 'منذ ساعة'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="text-primary hover:text-blue-700 p-2 rounded-full hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit_square</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Permissions Editor */}
        <div className="xl:col-span-5">
          <Card className="sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">تعديل الصلاحيات</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  تخصيص الوصول للمستخدم: <span className="font-semibold text-primary">{users[selectedUser]?.name}</span>
                </p>
              </div>
            </div>

            <div className="p-6 pb-2 shrink-0">
              <Select
                label="قالب الدور الوظيفي"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={Object.entries(USER_ROLES).map(([key, value]) => ({
                  value,
                  label: USER_ROLE_LABELS[value]
                }))}
              />
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-slate-500">gavel</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">إدارة القضايا</h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">القضايا الابتدائية</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.primaryCases.enabled}
                        onChange={() => toggleSection('primaryCases')}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {permissions.primaryCases.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      {['view', 'add', 'edit', 'delete'].map((perm) => (
                        <label key={perm} className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={permissions.primaryCases[perm] || false}
                            onChange={() => togglePermission('primaryCases', perm)}
                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                          />
                          <span className={`text-xs font-medium ${perm === 'delete' ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                            {perm === 'view' ? 'عرض التفاصيل' :
                             perm === 'add' ? 'إضافة جلسات' :
                             perm === 'edit' ? 'تعديل البيانات' :
                             'حذف القضية'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-dashed border-slate-200 dark:border-slate-700">
                  <span className="material-symbols-outlined text-slate-500">admin_panel_settings</span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">إدارة النظام</h4>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">إدارة المستخدمين</span>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions.userManagement.enabled}
                        onChange={() => toggleSection('userManagement')}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {permissions.userManagement.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={permissions.userManagement.view || false}
                          onChange={() => togglePermission('userManagement', 'view')}
                          className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">عرض القائمة</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={permissions.userManagement.edit || false}
                          onChange={() => togglePermission('userManagement', 'edit')}
                          className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">تعديل الصلاحيات</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-b-xl flex justify-end gap-3 shrink-0">
              <Button variant="secondary">إلغاء</Button>
              <Button variant="primary" icon="save">حفظ التغييرات</Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default UserPermissions

