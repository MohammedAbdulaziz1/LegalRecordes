import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { caseService } from '../../services/caseService'

const SupremeCourtCaseEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(false)
  const [loadingAppealCases, setLoadingAppealCases] = useState(true)
  const [appealCases, setAppealCases] = useState([])
  const [formData, setFormData] = useState({
    supreme_date: '',
    supreme_case_number: '',
    appeal_request_id: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchAppealCases()
    if (!isNew) {
      fetchCase()
    }
  }, [id])

  const fetchAppealCases = async () => {
    try {
      setLoadingAppealCases(true)
      const response = await caseService.getAppealCases({ per_page: 100 })
      console.log('Appeal cases response:', response.data)
      setAppealCases(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch appeal cases:', error)
      alert('فشل في تحميل القضايا الاستئنافية')
    } finally {
      setLoadingAppealCases(false)
    }
  }

  const fetchCase = async () => {
    try {
      setLoading(true)
      const response = await caseService.getSupremeCourtCase(id)
      const caseData = response.data.data
      setFormData({
        supreme_date: caseData.supreme_date || '',
        supreme_case_number: caseData.supreme_case_number || '',
        appeal_request_id: caseData.appeal_request_id || ''
      })
    } catch (error) {
      console.error('Failed to fetch case:', error)
      alert('فشل في تحميل بيانات القضية')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.supreme_date) newErrors.supreme_date = 'تاريخ القضية مطلوب'
    if (!formData.supreme_case_number) newErrors.supreme_case_number = 'رقم القضية مطلوب'
    if (!formData.appeal_request_id) newErrors.appeal_request_id = 'القضية الاستئنافية المرتبطة مطلوبة'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      if (isNew) {
        await caseService.createSupremeCourtCase(formData)
        alert('تم إضافة قضية المحكمة العليا بنجاح')
      } else {
        await caseService.updateSupremeCourtCase(id, formData)
        alert('تم تحديث قضية المحكمة العليا بنجاح')
      }
      navigate('/cases/supreme')
    } catch (error) {
      console.error('Failed to save case:', error)
      alert('فشل في حفظ القضية')
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'قضايا المحكمة العليا', path: '/cases/supreme' },
    { label: isNew ? 'إضافة قضية جديدة' : 'تعديل القضية' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="space-y-1 mb-6">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {isNew ? 'إضافة قضية محكمة عليا جديدة' : 'تعديل قضية المحكمة العليا'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isNew ? 'أدخل تفاصيل قضية المحكمة العليا الجديدة' : 'تعديل بيانات قضية المحكمة العليا'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                القضية الاستئنافية المرتبطة <span className="text-red-500">*</span>
              </label>
              <select
                name="appeal_request_id"
                value={formData.appeal_request_id}
                onChange={handleChange}
                disabled={loadingAppealCases}
                className={`w-full appearance-none rounded-lg border py-2.5 pr-4 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${
                  loadingAppealCases ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400' : ''
                } ${errors.appeal_request_id ? 'border-red-500' : ''}`}
              >
                <option value="">
                  {loadingAppealCases ? 'جاري التحميل...' : appealCases.length === 0 ? 'لا توجد قضايا استئنافية متاحة' : 'اختر القضية الاستئنافية'}
                </option>
                {appealCases.map((appealCase) => (
                  <option key={appealCase.appeal_request_id} value={appealCase.appeal_request_id}>
                    استئناف #{appealCase.appeal_number} - {appealCase.appeal_judgment}
                  </option>
                ))}
              </select>
              {errors.appeal_request_id && (
                <p className="text-xs text-red-500 mt-1">{errors.appeal_request_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                رقم قضية المحكمة العليا <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="supreme_case_number"
                value={formData.supreme_case_number}
                onChange={handleChange}
                placeholder="أدخل رقم القضية"
                error={errors.supreme_case_number}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                تاريخ القضية <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="supreme_date"
                value={formData.supreme_date}
                onChange={handleChange}
                error={errors.supreme_date}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="submit" disabled={loading} icon="save">
              {loading ? 'جاري الحفظ...' : isNew ? 'إضافة القضية' : 'حفظ التعديلات'}
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/cases/supreme')}
              icon="close"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  )
}

export default SupremeCourtCaseEdit
