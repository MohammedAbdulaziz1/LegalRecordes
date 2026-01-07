import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { caseService } from '../../services/caseService'

const AppealCaseEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isNew = id === 'new'
  const primaryCaseId = searchParams.get('primary')

  const [loading, setLoading] = useState(false)
  const [loadingPrimaryCases, setLoadingPrimaryCases] = useState(true)
  const [primaryCases, setPrimaryCases] = useState([])
  const [formData, setFormData] = useState({
    appeal_number: '',
    appeal_date: '',
    appeal_court_number: '',
    appeal_judgment: '',
    appealed_by: '',
    assigned_case_registration_request_id: primaryCaseId || ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchPrimaryCases()
    if (!isNew) {
      fetchCase()
    }
    
    // Auto-populate من المستأنف based on judgment status
    const judgmentStatus = searchParams.get('judgment')
    if (judgmentStatus && isNew) {
      const appealedBy = judgmentStatus === '1' ? 'هيئة النقل' : judgmentStatus === '2' ? 'الشركة' : ''
      if (appealedBy) {
        setFormData(prev => ({
          ...prev,
          appealed_by: appealedBy
        }))
      }
    }
  }, [id, searchParams, isNew])

  const fetchPrimaryCases = async () => {
    try {
      setLoadingPrimaryCases(true)
      const response = await caseService.getPrimaryCases({ per_page: 100 })
      console.log('Primary cases response:', response.data)
      console.log('Primary cases data array:', response.data.data)
      const casesArray = response.data.data || []
      console.log('Cases array length:', casesArray.length)
      if (casesArray.length > 0) {
        console.log('First case:', casesArray[0])
      }
      setPrimaryCases(casesArray)
    } catch (error) {
      console.error('Failed to fetch primary cases:', error)
      alert('فشل في تحميل القضايا الابتدائية')
    } finally {
      setLoadingPrimaryCases(false)
    }
  }

  const fetchCase = async () => {
    try {
      setLoading(true)
      const response = await caseService.getAppealCase(id)
      const caseData = response.data.data
      setFormData({
        appeal_number: caseData.appeal_number || '',
        appeal_date: caseData.appeal_date || '',
        appeal_court_number: caseData.appeal_court_number || '',
        appeal_judgment: caseData.appeal_judgment || '',
        appealed_by: caseData.appealed_by || '',
        assigned_case_registration_request_id: caseData.assigned_case_registration_request_id || ''
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
    if (!formData.appeal_number) newErrors.appeal_number = 'رقم الاستئناف مطلوب'
    if (!formData.appeal_date) newErrors.appeal_date = 'تاريخ الاستئناف مطلوب'
    if (!formData.appeal_court_number) newErrors.appeal_court_number = 'رقم محكمة الاستئناف مطلوب'
    if (!formData.appeal_judgment.trim()) newErrors.appeal_judgment = 'الحكم الاستئنافي مطلوب'
    if (!formData.appealed_by.trim()) newErrors.appealed_by = 'المستأنف مطلوب'
    if (!formData.assigned_case_registration_request_id) newErrors.assigned_case_registration_request_id = 'القضية الابتدائية المرتبطة مطلوبة'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      if (isNew) {
        await caseService.createAppealCase(formData)
        alert('تم إضافة القضية الاستئنافية بنجاح')
      } else {
        await caseService.updateAppealCase(id, formData)
        alert('تم تحديث القضية الاستئنافية بنجاح')
      }
      navigate('/cases/appeal')
    } catch (error) {
      console.error('Failed to save case:', error)
      alert('فشل في حفظ القضية')
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'القضايا الاستئنافية', path: '/cases/appeal' },
    { label: isNew ? 'إضافة قضية جديدة' : 'تعديل القضية' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="space-y-1 mb-6">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {isNew ? 'إضافة قضية استئنافية جديدة' : 'تعديل القضية الاستئنافية'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isNew ? 'أدخل تفاصيل القضية الاستئنافية الجديدة' : 'تعديل بيانات القضية الاستئنافية'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                القضية الابتدائية المرتبطة <span className="text-red-500">*</span>
              </label>
              <select
                name="assigned_case_registration_request_id"
                value={formData.assigned_case_registration_request_id}
                onChange={handleChange}
                disabled={loadingPrimaryCases}
                className={`w-full appearance-none rounded-lg border py-2.5 pr-4 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow ${
                  loadingPrimaryCases ? 'cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400' : ''
                } ${errors.assigned_case_registration_request_id ? 'border-red-500' : ''}`}
              >
                <option value="">
                  {loadingPrimaryCases ? 'جاري التحميل...' : primaryCases.length === 0 ? 'لا توجد قضايا ابتدائية متاحة' : 'اختر القضية الابتدائية'}
                </option>
                {primaryCases.map((primaryCase) => (
                  <option 
                    key={primaryCase.assigned_case_registration_request_id} 
                    value={primaryCase.assigned_case_registration_request_id}
                  >
                    قضية #{primaryCase.case_number} - {primaryCase.first_instance_judgment}
                  </option>
                ))}
              </select>
              {errors.assigned_case_registration_request_id && (
                <p className="text-xs text-red-500 mt-1">{errors.assigned_case_registration_request_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                رقم الاستئناف <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="appeal_number"
                value={formData.appeal_number}
                onChange={handleChange}
                placeholder="أدخل رقم الاستئناف"
                error={errors.appeal_number}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                تاريخ الاستئناف <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="appeal_date"
                value={formData.appeal_date}
                onChange={handleChange}
                error={errors.appeal_date}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                رقم محكمة الاستئناف <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="appeal_court_number"
                value={formData.appeal_court_number}
                onChange={handleChange}
                placeholder="أدخل رقم محكمة الاستئناف"
                error={errors.appeal_court_number}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                المستأنف <span className="text-red-500">*</span>
              </label>
              <Input
                name="appealed_by"
                value={formData.appealed_by}
                onChange={handleChange}
                placeholder="أدخل اسم المستأنف"
                error={errors.appealed_by}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                الحكم الاستئنافي <span className="text-red-500">*</span>
              </label>
              <Input
                name="appeal_judgment"
                value={formData.appeal_judgment}
                onChange={handleChange}
                placeholder="أدخل الحكم الاستئنافي"
                error={errors.appeal_judgment}
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
              onClick={() => navigate('/cases/appeal')}
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

export default AppealCaseEdit
