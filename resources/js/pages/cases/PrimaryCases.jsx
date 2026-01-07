import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import { JUDGMENT_TYPES, JUDGMENT_LABELS } from '../../utils/constants'
import { caseService } from '../../services/caseService'

const PrimaryCases = () => {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'القضايا الابتدائية' }
  ]

  const headerBreadcrumbs = [
    { label: 'القضايا' },
    { label: 'القضايا الابتدائية' }
  ]

  const fetchCases = async (page = 1, perPage = itemsPerPage, searchTerm = search) => {
    setLoading(true)
    try {
      const { data } = await caseService.getPrimaryCases({
        page,
        per_page: perPage,
        search: searchTerm || undefined
      })

      setCases(data.data || [])
      setTotalItems(data.meta?.total || 0)
      setItemsPerPage(data.meta?.per_page || perPage)
      setCurrentPage(data.meta?.current_page || page)
    } catch (error) {
      console.error('Failed to load primary cases', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  const formatDate = (date) => {
    if (!date) return '—'
    try {
      return new Date(date).toLocaleDateString('ar-EG')
    } catch {
      return date
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه القضية؟ سيتم أرشفتها.')) return
    
    try {
      await caseService.deletePrimaryCase(id)
      alert('تم حذف القضية بنجاح')
      fetchCases() // Reload
    } catch (error) {
      console.error('Failed to delete case:', error)
      alert('فشل في حذف القضية')
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={headerBreadcrumbs}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            سجل القضايا الابتدائية
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            إدارة وعرض جميع القضايا الابتدائية وتفاصيل الأحكام والإجراءات المرتبطة بها.
          </p>
        </div>
        <Button icon="add" onClick={() => navigate('/cases/primary/new')}>
          إضافة قضية جديدة
        </Button>
      </div>

      {/* Filters & Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="w-full h-11 pr-10 pl-4 rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
              placeholder="ابحث برقم القضية..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchCases(1, itemsPerPage, e.target.value)
                }
              }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1"></div>
            <Button variant="secondary" size="sm" icon="filter_list">
              تصفية
            </Button>
            <Button variant="secondary" size="sm" icon="download">
              تصدير
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" scope="col">
                  رقم القضية
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" scope="col">
                  الحكم الابتدائي
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[200px]" scope="col">
                  تاريخ القضية
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap" scope="col">
                  تاريخ الجلسة
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap text-center" scope="col">
                  رقم الدائرة
                </th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap text-center" scope="col">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-center text-slate-500" colSpan={6}>
                    جاري التحميل...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-center text-slate-500" colSpan={6}>
                    لا توجد بيانات لعرضها حالياً
                  </td>
                </tr>
              ) : (
                cases.map((caseItem) => (
                  <tr
                    key={caseItem.assigned_case_registration_request_id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-primary whitespace-nowrap cursor-pointer hover:underline">
                      {caseItem.case_number}
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      <StatusBadge
                        judgment={
                          caseItem.first_instance_judgment === 'حكم لصالح المدعي'
                            ? JUDGMENT_TYPES.FOR_PLAINTIFF
                            : JUDGMENT_TYPES.PENDING
                        }
                      >
                        {caseItem.first_instance_judgment || '—'}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(caseItem.case_date)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(caseItem.session_date)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {caseItem.court_number ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/cases/primary/${caseItem.assigned_case_registration_request_id}`)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(caseItem.assigned_case_registration_request_id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <Button
                          size="sm"
                          variant="primary"
                          icon="gavel"
                          onClick={() => navigate(`/cases/appeal/new?primary=${caseItem.assigned_case_registration_request_id}&judgment=${caseItem.judgment_status}`)}
                          disabled={caseItem.judgment_status !== 1 && caseItem.judgment_status !== 2}
                          className="text-xs"
                          title={caseItem.judgment_status !== 1 && caseItem.judgment_status !== 2 ? 'الاستئناف متاح فقط عند إلغاء القرار أو رفض الدعوى' : 'استئناف القضية'}
                        >
                          استئناف
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(totalItems / itemsPerPage))}
          onPageChange={(page) => {
            setCurrentPage(page)
            fetchCases(page)
          }}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </Layout>
  )
}

export default PrimaryCases

