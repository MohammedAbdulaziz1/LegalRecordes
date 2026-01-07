import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const ArchiveLog = () => {
  const [filters, setFilters] = useState({
    caseType: '',
    dateFrom: '',
    dateTo: '',
    user: ''
  })

  const archiveEntries = [
    {
      id: 1,
      caseNumber: 'CAS-2023-001',
      caseType: 'قضية ابتدائية',
      action: 'تحديث الحالة: قيد الإجراء',
      user: 'أحمد المحمدي',
      date: 'أمس',
      details: 'قام بتغيير الحالة وإضافة ملاحظة.'
    },
    {
      id: 2,
      caseNumber: 'CAS-2023-001',
      caseType: 'قضية ابتدائية',
      action: 'تعديل الموعد: ٢٨ مايو',
      user: 'سارة العلي',
      date: '٢٠ مايو ٢٠٢٣',
      details: 'قام بتأجيل الجلسة.'
    },
    {
      id: 3,
      caseNumber: 'CAS-2023-001',
      caseType: 'قضية ابتدائية',
      action: 'إنشاء القضية',
      user: 'النظام الآلي',
      date: '٠١ مايو ٢٠٢٣',
      details: 'تم إنشاء السجل بواسطة النظام الآلي.'
    }
  ]

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' },
    { label: 'الإدارة' },
    { label: 'سجل الأرشفة والتعديلات' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={breadcrumbs}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-900 dark:text-white mb-2">
            سجل الأرشفة والتعديلات
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            عرض جميع التعديلات والتغييرات التي تمت على القضايا مع تفاصيل المستخدمين والتواريخ.
          </p>
        </div>
        <Button variant="secondary" icon="file_download">تصدير السجل</Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="نوع القضية"
            value={filters.caseType}
            onChange={(e) => setFilters(prev => ({ ...prev, caseType: e.target.value }))}
            options={[
              { value: '', label: 'جميع الأنواع' },
              { value: 'primary', label: 'قضايا ابتدائية' },
              { value: 'appeal', label: 'قضايا استئنافية' },
              { value: 'supreme', label: 'قضايا المحكمة العليا' }
            ]}
          />
          <Input
            label="من تاريخ"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
          <Input
            label="إلى تاريخ"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          />
          <Input
            label="المستخدم"
            value={filters.user}
            onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
            placeholder="ابحث عن مستخدم..."
          />
        </div>
        <div className="flex gap-3 mt-4">
          <Button variant="primary" size="sm">تطبيق الفلتر</Button>
          <Button variant="secondary" size="sm">إعادة تعيين</Button>
        </div>
      </Card>

      {/* Archive Entries */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {archiveEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-slate-900 dark:text-white">{entry.action}</span>
                <span className="text-[10px] text-slate-400">{entry.date}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                قام <span className="text-primary">{entry.user}</span> {entry.details}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>{entry.caseNumber}</span>
                <span>•</span>
                <span>{entry.caseType}</span>
              </div>
              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                <button className="text-[10px] font-medium text-primary hover:underline">عرض النسخة</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/30 text-center border-t border-slate-100 dark:border-slate-800">
          <button className="text-xs font-medium text-primary hover:text-blue-700 transition-colors">
            عرض السجل الكامل
          </button>
        </div>
      </Card>
    </Layout>
  )
}

export default ArchiveLog

