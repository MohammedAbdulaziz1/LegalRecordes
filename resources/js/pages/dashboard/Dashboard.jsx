import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/common/Card'
import { caseService } from '../../services/caseService'

const Dashboard = () => {
  const [stats, setStats] = useState([])
  const [recentCases, setRecentCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await caseService.getDashboardStatistics()
      const data = response.data.data

      // Format statistics for display
      const formattedStats = [
        {
          title: 'القضايا الابتدائية',
          value: data.statistics.primary_cases.toString(),
          change: '+0%',
          changeType: 'positive',
          icon: 'folder_open',
          color: 'bg-blue-500'
        },
        {
          title: 'القضايا الاستئنافية',
          value: data.statistics.appeal_cases.toString(),
          change: '+0%',
          changeType: 'positive',
          icon: 'balance',
          color: 'bg-purple-500'
        },
        {
          title: 'قضايا المحكمة العليا',
          value: data.statistics.supreme_cases.toString(),
          change: '+0%',
          changeType: 'positive',
          icon: 'account_balance',
          color: 'bg-emerald-500'
        },
        {
          title: 'القضايا المعلقة',
          value: data.statistics.pending_cases.toString(),
          change: '+0%',
          changeType: 'negative',
          icon: 'pending',
          color: 'bg-amber-500'
        }
      ]

      setStats(formattedStats)
      setRecentCases(data.recent_cases || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbs = [
    { label: 'الرئيسية', path: '/dashboard' }
  ]

  const headerBreadcrumbs = [
    { label: 'الرئيسية' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} headerBreadcrumbs={headerBreadcrumbs}>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary">dashboard</span>
          لوحة التحكم
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          نظرة عامة على إحصائيات القضايا والنشاطات
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="w-12 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card title="القضايا الأخيرة" icon="history">
          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg animate-pulse">
                  <div className="size-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))
            ) : recentCases.length > 0 ? (
              recentCases.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">قضية #{item.case_number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(item.updated_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{item.judgment}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-4">لا توجد قضايا حديثة</p>
            )}
          </div>
        </Card>

        <Card title="الإشعارات المهمة" icon="notifications">
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
                <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">جلسة قادمة</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    جلسة قضية #{4512 + item} في 15/10/2023
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default Dashboard

