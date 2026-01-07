import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { caseService } from '../../services/caseService'

const PrimaryCaseEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isNew = id === 'new'

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_instance_judgment: '',
    judgment_status: '0',
    case_date: '',
    case_number: '',
    session_date: '',
    court_number: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isNew) {
      fetchCase()
    }
  }, [id])

  const fetchCase = async () => {
    try {
      setLoading(true)
      const response = await caseService.getPrimaryCase(id)
      const caseData = response.data.data
      setFormData({
        first_instance_judgment: caseData.first_instance_judgment || '',
        judgment_status: caseData.judgment_status?.toString() || '0',
        case_date: caseData.case_date || '',
        case_number: caseData.case_number || '',
        session_date: caseData.session_date || '',
        court_number: caseData.court_number || ''
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
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.first_instance_judgment.trim()) newErrors.first_instance_judgment = 'الحكم مطلوب'
    if (!formData.case_date) newErrors.case_date = 'تاريخ القضية مطلوب'
    if (!formData.case_number) newErrors.case_number = 'رقم القضية مطلوب'
    if (!formData.session_date) newErrors.session_date = 'تاريخ الجلسة مطلوب'
    if (!formData.court_number) newErrors.court_number = 'رقم المحكمة مطلوب'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const JUDGMENT_STATUS = {
    PROCESSING: '0',
    REVOKE_DECISION: '1',
    REJECT_CLAIM: '2',
    POSTPONEMENT: '3'
  }

  const JUDGMENT_LABELS = {
    '0': 'قيد المعالجة',
    '1': 'إلغاء القرار',
    '2': 'رفض الدعوى',
    '3': 'التأجيل'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      if (isNew) {
        await caseService.createPrimaryCase(formData)
        alert('تم إضافة القضية بنجاح')
      } else {
        await caseService.updatePrimaryCase(id, formData)
        alert('تم تحديث القضية بنجاح')
      }
      navigate('/cases/primary')
    } catch (error) {
      console.error('Failed to save case:', error)
      alert('فشل في حفظ القضية')
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'القضايا الابتدائية', path: '/cases/primary' },
    { label: isNew ? 'إضافة قضية جديدة' : 'تعديل القضية' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="space-y-1 mb-6">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          {isNew ? 'إضافة قضية ابتدائية جديدة' : 'تعديل القضية الابتدائية'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isNew ? 'أدخل تفاصيل القضية الابتدائية الجديدة' : 'تعديل بيانات القضية الابتدائية'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                الحكم الابتدائي <span className="text-red-500">*</span>
              </label>
              <Input
                name="first_instance_judgment"
                value={formData.first_instance_judgment}
                onChange={handleChange}
                placeholder="أدخل الحكم الابتدائي"
                error={errors.first_instance_judgment}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                حالة الحكم <span className="text-red-500">*</span>
              </label>
              <select
                name="judgment_status"
                value={formData.judgment_status}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border py-2.5 pr-4 pl-10 text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
              >
                <option value="0">قيد المعالجة</option>
                <option value="1">إلغاء القرار</option>
                <option value="2">رفض الدعوى</option>
                <option value="3">التأجيل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                رقم القضية <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="case_number"
                value={formData.case_number}
                onChange={handleChange}
                placeholder="أدخل رقم القضية"
                error={errors.case_number}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                تاريخ القضية <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="case_date"
                value={formData.case_date}
                onChange={handleChange}
                error={errors.case_date}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                تاريخ الجلسة <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="session_date"
                value={formData.session_date}
                onChange={handleChange}
                error={errors.session_date}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                رقم المحكمة <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="court_number"
                value={formData.court_number}
                onChange={handleChange}
                placeholder="أدخل رقم المحكمة"
                error={errors.court_number}
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
              onClick={() => navigate('/cases/primary')}
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

export default PrimaryCaseEdit
