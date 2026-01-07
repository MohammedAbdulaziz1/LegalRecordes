import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/ui/StatusBadge'
import Pagination from '../../components/ui/Pagination'
import { caseService } from '../../services/caseService'

const SupremeCourtCases = () => {
  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'قضايا المحكمة العليا' }
  ]

  const fetchCases = async (page = 1, perPage = itemsPerPage) => {
    setLoading(true)
    try {
      const { data } = await caseService.getSupremeCourtCases({
        page,
        per_page: perPage
      })

      setCases(data.data || [])
      setTotalItems(data.meta?.total || 0)
      setItemsPerPage(data.meta?.per_page || perPage)
      setCurrentPage(data.meta?.current_page || page)
    } catch (error) {
      console.error('Failed to load supreme court cases', error)
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
      await caseService.deleteSupremeCourtCase(id)
      alert('تم حذف القضية بنجاح')
      fetchCases()
    } catch (error) {
      console.error('Failed to delete case:', error)
      alert('فشل في حذف القضية')
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            سجل قضايا المحكمة العليا
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            إدارة وعرض جميع قضايا المحكمة العليا وتفاصيل الأحكام والإجراءات المرتبطة بها.
          </p>
        </div>
        <Button icon="add" onClick={() => navigate('/cases/supreme/new')}>
          إضافة قضية جديدة
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">رقم القضية العليا</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">تاريخ التسجيل</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">مرجع الاستئناف</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap text-center">الحالة</th>
                <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-center text-slate-500" colSpan={4}>
                    جاري التحميل...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-center text-slate-500" colSpan={4}>
                    لا توجد بيانات لعرضها حالياً
                  </td>
                </tr>
              ) : (
                cases.map((caseItem) => (
                  <tr key={caseItem.supreme_request_id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary whitespace-nowrap cursor-pointer hover:underline">
                      {caseItem.supreme_case_number}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(caseItem.supreme_date)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {caseItem.appeal_request_id ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status="active">قيد النظر</StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/cases/supreme/${caseItem.supreme_request_id}`)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(caseItem.supreme_request_id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
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

export default SupremeCourtCases

