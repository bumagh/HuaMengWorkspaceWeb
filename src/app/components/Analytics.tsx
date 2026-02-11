'use client'

const REVENUE_DATA = [
  { month: '1月', revenue: 120, cost: 80, profit: 40 },
  { month: '2月', revenue: 150, cost: 85, profit: 65 },
  { month: '3月', revenue: 180, cost: 90, profit: 90 },
  { month: '4月', revenue: 160, cost: 88, profit: 72 },
  { month: '5月', revenue: 200, cost: 95, profit: 105 },
  { month: '6月', revenue: 230, cost: 100, profit: 130 },
]

const INVESTMENT_METRICS = [
  { label: 'ROI (投资回报率)', value: '156%', trend: '+12%', emoji: '📈', good: true },
  { label: '月均营收', value: '¥173万', trend: '+8%', emoji: '💰', good: true },
  { label: '运营成本', value: '¥90万', trend: '-3%', emoji: '📉', good: true },
  { label: '净利润率', value: '48%', trend: '+5%', emoji: '💎', good: true },
  { label: '客户获取成本', value: '¥2.3万', trend: '-15%', emoji: '🎯', good: true },
  { label: '客户终身价值', value: '¥35万', trend: '+20%', emoji: '🌟', good: true },
]

const PROJECT_FINANCE = [
  { name: '华梦AR体验平台', budget: 500, spent: 360, remaining: 140, status: '正常' },
  { name: '华梦办公宝', budget: 200, spent: 90, remaining: 110, status: '正常' },
  { name: '企业官网升级', budget: 80, spent: 72, remaining: 8, status: '预警' },
  { name: '客户CRM系统', budget: 150, spent: 22, remaining: 128, status: '正常' },
]

export default function Analytics() {
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.revenue))

  return (
    <div className="space-y-6">
      {/* Investment Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {INVESTMENT_METRICS.map(metric => (
          <div key={metric.label} className="glass-card p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.emoji}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.good ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-xs text-slate-400">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart (CSS-based bar chart) */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">📊 月度营收分析 (万元)</h3>
        <div className="flex items-end gap-4 h-48 mb-4">
          {REVENUE_DATA.map(d => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-white font-semibold">{d.revenue}</span>
              <div className="w-full flex gap-1" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}>
                <div className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:opacity-80" title={`营收: ${d.revenue}万`}></div>
                <div className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.cost / d.revenue) * 100}%` }} title={`成本: ${d.cost}万`}></div>
                <div className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.profit / d.revenue) * 100}%` }} title={`利润: ${d.profit}万`}></div>
              </div>
              <span className="text-xs text-slate-500 mt-2">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-xs text-slate-400">营收</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-xs text-slate-400">成本</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span className="text-xs text-slate-400">利润</span>
          </div>
        </div>
      </div>

      {/* Project Finance */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">💼 项目预算执行情况 (万元)</h3>
        <div className="space-y-4">
          {PROJECT_FINANCE.map(proj => {
            const spentPercent = (proj.spent / proj.budget) * 100
            return (
              <div key={proj.name} className="p-4 rounded-xl bg-slate-800/40">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-semibold text-white text-sm">{proj.name}</span>
                    <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                      proj.status === '正常' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-white font-semibold">{proj.spent}</span>
                    <span className="text-sm text-slate-500"> / {proj.budget}</span>
                  </div>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-slate-500">已使用 {spentPercent.toFixed(0)}%</span>
                  <span className="text-[10px] text-slate-500">剩余 ¥{proj.remaining}万</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Investor Summary */}
      <div className="glass-card p-6 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-500/20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🏦</span>
          <h3 className="text-lg font-semibold text-white">投资者参考摘要</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/40">
            <div className="text-sm text-slate-400 mb-1">估值增长</div>
            <div className="text-2xl font-bold text-white">+180%</div>
            <div className="text-xs text-green-400 mt-1">↑ 较上季度</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40">
            <div className="text-sm text-slate-400 mb-1">资金使用效率</div>
            <div className="text-2xl font-bold text-white">87%</div>
            <div className="text-xs text-green-400 mt-1">↑ 行业前15%</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40">
            <div className="text-sm text-slate-400 mb-1">预计盈亏平衡</div>
            <div className="text-2xl font-bold text-white">2026 Q4</div>
            <div className="text-xs text-blue-400 mt-1">按计划推进中</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40">
            <div className="text-sm text-slate-400 mb-1">风险评级</div>
            <div className="text-2xl font-bold text-green-400">低风险</div>
            <div className="text-xs text-slate-400 mt-1">稳健增长中</div>
          </div>
        </div>
      </div>
    </div>
  )
}
