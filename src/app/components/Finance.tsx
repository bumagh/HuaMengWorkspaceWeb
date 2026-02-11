'use client'

import { useState } from 'react'

interface Transaction {
  id: number
  type: '收入' | '支出'
  category: string
  amount: number
  description: string
  date: string
  operator: string
}

interface Budget {
  id: number
  category: string
  budget: number
  spent: number
  emoji: string
}

const INIT_TRANSACTIONS: Transaction[] = [
  { id: 1, type: '收入', category: '项目收入', amount: 85000, description: 'AR体验平台第二期款项', date: '2026-02-10', operator: '糖糖' },
  { id: 2, type: '收入', category: '咨询收入', amount: 15000, description: '技术咨询服务费', date: '2026-02-08', operator: '硬功夫' },
  { id: 3, type: '支出', category: '人力成本', amount: 45000, description: '2月份团队薪资', date: '2026-02-05', operator: '糖糖' },
  { id: 4, type: '支出', category: '服务器', amount: 3200, description: '云服务器月度费用', date: '2026-02-03', operator: '硬功夫' },
  { id: 5, type: '支出', category: '办公费用', amount: 1800, description: '办公软件订阅', date: '2026-02-01', operator: '小白' },
  { id: 6, type: '收入', category: '项目收入', amount: 50000, description: '官网升级项目尾款', date: '2026-01-28', operator: '糖糖' },
  { id: 7, type: '支出', category: '营销推广', amount: 8000, description: '线上广告投放', date: '2026-01-25', operator: '小白' },
  { id: 8, type: '收入', category: '投资收入', amount: 200000, description: '天使轮融资到账', date: '2026-01-15', operator: '糖糖' },
]

const INIT_BUDGETS: Budget[] = [
  { id: 1, category: '人力成本', budget: 150000, spent: 90000, emoji: '👥' },
  { id: 2, category: '服务器与技术', budget: 20000, spent: 9600, emoji: '💻' },
  { id: 3, category: '办公费用', budget: 10000, spent: 5400, emoji: '🏢' },
  { id: 4, category: '营销推广', budget: 30000, spent: 16000, emoji: '📢' },
  { id: 5, category: '差旅交通', budget: 8000, spent: 2000, emoji: '✈️' },
]

const INCOME_CATS = ['项目收入', '咨询收入', '投资收入', '其他收入']
const EXPENSE_CATS = ['人力成本', '服务器', '办公费用', '营销推广', '差旅交通', '其他支出']

export default function Finance() {
  const [transactions, setTransactions] = useState(INIT_TRANSACTIONS)
  const [budgets, setBudgets] = useState(INIT_BUDGETS)
  const [tab, setTab] = useState<'overview' | 'records' | 'budget'>('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterType, setFilterType] = useState<'全部' | '收入' | '支出'>('全部')

  // 新增记录表单
  const [txType, setTxType] = useState<'收入' | '支出'>('收入')
  const [txCat, setTxCat] = useState('')
  const [txAmount, setTxAmount] = useState(0)
  const [txDesc, setTxDesc] = useState('')
  const [txDate, setTxDate] = useState('')
  const [txOperator, setTxOperator] = useState('糖糖')

  // 新增预算
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [budCat, setBudCat] = useState('')
  const [budAmount, setBudAmount] = useState(0)
  const [budEmoji, setBudEmoji] = useState('📦')

  const totalIncome = transactions.filter(t => t.type === '收入').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === '支出').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense
  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)

  const addTransaction = () => {
    if (!txCat || txAmount <= 0) return
    const today = new Date()
    const dateStr = txDate || `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    setTransactions(prev => [{
      id: Date.now(), type: txType, category: txCat, amount: txAmount,
      description: txDesc.trim() || txCat, date: dateStr, operator: txOperator,
    }, ...prev])
    setTxCat(''); setTxAmount(0); setTxDesc(''); setTxDate('')
    setShowAddForm(false)
  }

  const addBudget = () => {
    if (!budCat.trim() || budAmount <= 0) return
    setBudgets(prev => [...prev, { id: Date.now(), category: budCat.trim(), budget: budAmount, spent: 0, emoji: budEmoji }])
    setBudCat(''); setBudAmount(0); setBudEmoji('📦')
    setShowBudgetForm(false)
  }

  const formatMoney = (n: number) => {
    return n.toLocaleString('zh-CN', { minimumFractionDigits: 0 })
  }

  const filtered = filterType === '全部' ? transactions : transactions.filter(t => t.type === filterType)

  // 按类别汇总
  const incomeByCategory: Record<string, number> = {}
  const expenseByCategory: Record<string, number> = {}
  transactions.forEach(t => {
    if (t.type === '收入') incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
    else expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount
  })

  return (
    <div className="space-y-6">
      {/* 财务总览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">¥{formatMoney(totalIncome)}</div>
          <div className="text-xs text-slate-400">总收入</div>
          <div className="text-[10px] text-green-500 mt-1">📈 {transactions.filter(t => t.type === '收入').length}笔</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold text-red-400 mb-1">¥{formatMoney(totalExpense)}</div>
          <div className="text-xs text-slate-400">总支出</div>
          <div className="text-[10px] text-red-400 mt-1">📉 {transactions.filter(t => t.type === '支出').length}笔</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className={`text-3xl font-bold mb-1 ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            ¥{formatMoney(balance)}
          </div>
          <div className="text-xs text-slate-400">净余额</div>
          <div className={`text-[10px] mt-1 ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            {balance >= 0 ? '💰 盈余' : '⚠️ 亏损'}
          </div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-3xl font-bold text-amber-400 mb-1">{Math.round((totalSpent / totalBudget) * 100)}%</div>
          <div className="text-xs text-slate-400">预算使用率</div>
          <div className="text-[10px] text-amber-400 mt-1">📊 ¥{formatMoney(totalSpent)}/{formatMoney(totalBudget)}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/40 rounded-xl p-1">
        {([
          { id: 'overview' as const, label: '📊 收支分析' },
          { id: 'records' as const, label: '📜 收支记录' },
          { id: 'budget' as const, label: '💰 预算管理' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* Tab: 收支分析 */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          {/* 收入分析 */}
          <div className="glass-card p-6">
            <h4 className="font-semibold text-white mb-4">📈 收入构成</h4>
            <div className="space-y-3">
              {Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
                const pct = Math.round((amt / totalIncome) * 100)
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-green-400">¥{formatMoney(amt)} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {Object.keys(incomeByCategory).length === 0 && <div className="text-center py-4 text-slate-500 text-sm">暂无收入</div>}
            </div>
          </div>
          {/* 支出分析 */}
          <div className="glass-card p-6">
            <h4 className="font-semibold text-white mb-4">📉 支出构成</h4>
            <div className="space-y-3">
              {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => {
                const pct = Math.round((amt / totalExpense) * 100)
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cat}</span>
                      <span className="text-red-400">¥{formatMoney(amt)} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              {Object.keys(expenseByCategory).length === 0 && <div className="text-center py-4 text-slate-500 text-sm">暂无支出</div>}
            </div>
          </div>
          {/* 月度趋势 */}
          <div className="glass-card p-6 col-span-2">
            <h4 className="font-semibold text-white mb-4">📅 近期收支趋势</h4>
            <div className="flex items-end gap-2 h-32">
              {(() => {
                const days: { date: string; income: number; expense: number }[] = []
                for (let i = 6; i >= 0; i--) {
                  const d = new Date()
                  d.setDate(d.getDate() - i)
                  const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
                  const dayLabel = `${d.getMonth()+1}/${d.getDate()}`
                  const income = transactions.filter(t => t.date === ds && t.type === '收入').reduce((s, t) => s + t.amount, 0)
                  const expense = transactions.filter(t => t.date === ds && t.type === '支出').reduce((s, t) => s + t.amount, 0)
                  days.push({ date: dayLabel, income, expense })
                }
                const maxVal = Math.max(...days.map(d => Math.max(d.income, d.expense)), 1)
                return days.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex gap-0.5 items-end h-24 w-full justify-center">
                      <div className="w-3 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all"
                        style={{ height: `${Math.max(2, (day.income / maxVal) * 100)}%` }}
                        title={`收入 ¥${formatMoney(day.income)}`} />
                      <div className="w-3 bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all"
                        style={{ height: `${Math.max(2, (day.expense / maxVal) * 100)}%` }}
                        title={`支出 ¥${formatMoney(day.expense)}`} />
                    </div>
                    <span className="text-[10px] text-slate-500">{day.date}</span>
                  </div>
                ))
              })()}
            </div>
            <div className="flex items-center justify-center gap-6 mt-3">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-500"></div><span className="text-[10px] text-slate-400">收入</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500"></div><span className="text-[10px] text-slate-400">支出</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: 收支记录 */}
      {tab === 'records' && (
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">📜 收支明细</h4>
            <div className="flex items-center gap-2">
              {(['全部', '收入', '支出'] as const).map(f => (
                <button key={f} onClick={() => setFilterType(f)}
                  className={`text-xs px-3 py-1 rounded-lg transition-all ${
                    filterType === f ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-white'
                  }`}>{f}</button>
              ))}
              <button onClick={() => setShowAddForm(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all">
                ➕ 记一笔
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">暂无记录</div>}
            {filtered.map(t => (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  t.type === '收入' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {t.type === '收入' ? '📈' : '📉'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{t.description}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400">{t.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-slate-500">{t.date}</span>
                    <span className="text-[10px] text-slate-500">经办: {t.operator}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === '收入' ? 'text-green-400' : 'text-red-400'}`}>
                  {t.type === '收入' ? '+' : '-'}¥{formatMoney(t.amount)}
                </span>
                <button onClick={() => setTransactions(prev => prev.filter(x => x.id !== t.id))}
                  className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 预算管理 */}
      {tab === 'budget' && (
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">💰 预算执行情况</h4>
            <button onClick={() => setShowBudgetForm(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all">
              ➕ 新增预算
            </button>
          </div>
          <div className="space-y-4">
            {budgets.map(b => {
              const pct = Math.round((b.spent / b.budget) * 100)
              const isOver = pct > 100
              return (
                <div key={b.id} className="p-4 rounded-xl bg-slate-800/40 group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{b.emoji}</span>
                      <span className="text-sm text-white font-medium">{b.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${isOver ? 'text-red-400' : pct > 80 ? 'text-amber-400' : 'text-green-400'}`}>
                        {pct}%
                      </span>
                      <button onClick={() => setBudgets(prev => prev.filter(x => x.id !== b.id))}
                        className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-green-500'
                    }`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>已花 ¥{formatMoney(b.spent)}</span>
                    <span>预算 ¥{formatMoney(b.budget)}</span>
                    <span>剩余 ¥{formatMoney(Math.max(0, b.budget - b.spent))}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 新增收支弹窗 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAddForm(false)}>
          <div className="glass-card p-6 w-[460px] space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">💳 记一笔</h3>

            <div className="flex gap-2">
              {(['收入', '支出'] as const).map(t => (
                <button key={t} onClick={() => { setTxType(t); setTxCat('') }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    txType === t
                      ? t === '收入' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-slate-400 bg-slate-800/40 border border-transparent'
                  }`}>{t === '收入' ? '📈 收入' : '📉 支出'}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">类别</label>
                <select value={txCat} onChange={e => setTxCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="">选择类别</option>
                  {(txType === '收入' ? INCOME_CATS : EXPENSE_CATS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">金额 (元)</label>
                <input type="number" value={txAmount || ''} onChange={e => setTxAmount(Number(e.target.value))} min={0}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">说明</label>
              <input value={txDesc} onChange={e => setTxDesc(e.target.value)} placeholder="如：AR项目第二期款项"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">日期</label>
                <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">经办人</label>
                <select value={txOperator} onChange={e => setTxOperator(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="糖糖">👑 糖糖</option>
                  <option value="硬功夫">💻 硬功夫</option>
                  <option value="小白">📢 小白</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button onClick={addTransaction} disabled={!txCat || txAmount <= 0}
                className={`flex-1 py-2.5 rounded-lg text-sm text-white transition-all disabled:opacity-30 ${
                  txType === '收入' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-orange-600'
                } hover:opacity-90`}>确认记账</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增预算弹窗 */}
      {showBudgetForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowBudgetForm(false)}>
          <div className="glass-card p-6 w-96 space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">新增预算项</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">预算类别</label>
              <input value={budCat} onChange={e => setBudCat(e.target.value)} placeholder="如：外包费用"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">预算金额 (元)</label>
              <input type="number" value={budAmount || ''} onChange={e => setBudAmount(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">选择图标</label>
              <div className="flex flex-wrap gap-2">
                {['📦', '💻', '👥', '📢', '✈️', '🏢', '🔧', '📊', '🎨', '🛡️', '💡', '🚀'].map(em => (
                  <button key={em} onClick={() => setBudEmoji(em)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      budEmoji === em ? 'bg-amber-500/30 border-2 border-amber-400 scale-110' : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                    }`}>{em}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowBudgetForm(false)}
                className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button onClick={addBudget} disabled={!budCat.trim() || budAmount <= 0}
                className="flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all disabled:opacity-30">确认添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
