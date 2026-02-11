'use client'

import { useState } from 'react'

interface Milestone {
  month: string
  title: string
  progress: number
  status: string
  kpi: string
  emoji: string
}

interface KpiCard {
  label: string
  value: number
  target: number
  unit: string
  emoji: string
  color: string
}

const INIT_MILESTONES: Milestone[] = [
  { month: '2025-Q4', title: '公司成立与基础建设', progress: 100, status: 'done', kpi: '完成注册、团队组建', emoji: '🏗️' },
  { month: '2026-Q1', title: '核心产品研发启动', progress: 75, status: 'active', kpi: '完成MVP开发', emoji: '🚀' },
  { month: '2026-Q2', title: '产品内测与优化', progress: 20, status: 'upcoming', kpi: '用户反馈满意度>80%', emoji: '🧪' },
  { month: '2026-Q3', title: '市场推广与客户拓展', progress: 0, status: 'upcoming', kpi: '获取100+客户', emoji: '📈' },
  { month: '2026-Q4', title: '商业化运营', progress: 0, status: 'upcoming', kpi: '实现正向现金流', emoji: '💰' },
  { month: '2027-Q1', title: '规模化增长', progress: 0, status: 'upcoming', kpi: '营收增长200%', emoji: '🌟' },
]

const INIT_KPIS: KpiCard[] = [
  { label: '总体战略进度', value: 38, target: 100, unit: '%', emoji: '🎯', color: 'blue' },
  { label: '产品完成度', value: 65, target: 100, unit: '%', emoji: '📦', color: 'purple' },
  { label: '团队规模', value: 3, target: 10, unit: '人', emoji: '👥', color: 'green' },
  { label: '客户数量', value: 8, target: 100, unit: '个', emoji: '🤝', color: 'amber' },
]

const EMOJI_OPTIONS = ['🚀', '🎯', '📈', '💰', '🧪', '🏗️', '🌟', '📦', '🤝', '👥', '🔥', '💎', '🛡️', '⚡', '🎮', '📡']
const COLOR_OPTIONS = ['blue', 'purple', 'green', 'amber', 'red', 'orange', 'teal', 'pink']
const STATUS_OPTIONS = [
  { id: 'done', label: '已完成' },
  { id: 'active', label: '进行中' },
  { id: 'upcoming', label: '未开始' },
]

export default function StrategyBoard() {
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>(INIT_MILESTONES)
  const [kpis, setKpis] = useState<KpiCard[]>(INIT_KPIS)

  // 新增里程碑表单
  const [showMsForm, setShowMsForm] = useState(false)
  const [msMonth, setMsMonth] = useState('')
  const [msTitle, setMsTitle] = useState('')
  const [msKpi, setMsKpi] = useState('')
  const [msEmoji, setMsEmoji] = useState('🚀')
  const [msStatus, setMsStatus] = useState('upcoming')
  const [msProgress, setMsProgress] = useState(0)

  // 新增KPI表单
  const [showKpiForm, setShowKpiForm] = useState(false)
  const [kpiLabel, setKpiLabel] = useState('')
  const [kpiValue, setKpiValue] = useState(0)
  const [kpiTarget, setKpiTarget] = useState(100)
  const [kpiUnit, setKpiUnit] = useState('')
  const [kpiEmoji, setKpiEmoji] = useState('🎯')
  const [kpiColor, setKpiColor] = useState('blue')

  // 编辑里程碑进度
  const [editingProgress, setEditingProgress] = useState<number | null>(null)

  // 文字资讯栏
  const [notes, setNotes] = useState<{ id: number; title: string; content: string; time: string }[]>([
    { id: 1, title: '低成本轻资产运营指导', content: '以最小化固定成本投入，最大化利用云服务、外包协作、共享资源等方式运营，保持现金流健康。重点关注：\n1. 优先使用SaaS工具替代自建系统\n2. 人员精简高效，一人多岗\n3. 按需采购，避免库存积压\n4. 远程办公降低场地成本', time: '2026-02-11' },
    { id: 2, title: '核心竞争力建设', content: '聚焦产品差异化，打造技术壁垒。通过游戏化管理提升团队效率。', time: '2026-02-10' },
  ])
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [expandedNote, setExpandedNote] = useState<number | null>(null)

  const addMilestone = () => {
    if (!msMonth.trim() || !msTitle.trim()) return
    setMilestones(prev => [...prev, {
      month: msMonth.trim(),
      title: msTitle.trim(),
      progress: msProgress,
      status: msStatus,
      kpi: msKpi.trim() || '待定',
      emoji: msEmoji,
    }])
    setMsMonth(''); setMsTitle(''); setMsKpi(''); setMsEmoji('🚀'); setMsStatus('upcoming'); setMsProgress(0)
    setShowMsForm(false)
  }

  const addKpi = () => {
    if (!kpiLabel.trim() || !kpiUnit.trim()) return
    setKpis(prev => [...prev, {
      label: kpiLabel.trim(),
      value: kpiValue,
      target: kpiTarget,
      unit: kpiUnit.trim(),
      emoji: kpiEmoji,
      color: kpiColor,
    }])
    setKpiLabel(''); setKpiValue(0); setKpiTarget(100); setKpiUnit(''); setKpiEmoji('🎯'); setKpiColor('blue')
    setShowKpiForm(false)
  }

  const updateProgress = (index: number, newProgress: number) => {
    setMilestones(prev => prev.map((ms, i) => {
      if (i !== index) return ms
      const status = newProgress >= 100 ? 'done' : newProgress > 0 ? 'active' : 'upcoming'
      return { ...ms, progress: Math.min(100, Math.max(0, newProgress)), status }
    }))
  }

  const deleteMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index))
    setSelectedMilestone(null)
  }

  const deleteKpi = (index: number) => {
    setKpis(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* KPI Overview */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">📊 关键指标</h3>
        <button
          onClick={() => setShowKpiForm(true)}
          className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
        >
          ➕ 新增指标
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={kpi.label + idx} className="glass-card p-5 group relative">
            <button
              onClick={() => deleteKpi(idx)}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="删除"
            >✕</button>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.emoji}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-${kpi.color}-500/20 text-${kpi.color}-400`}>
                目标: {kpi.target}{kpi.unit}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{kpi.value}<span className="text-lg text-slate-400">{kpi.unit}</span></div>
            <div className="text-xs text-slate-400 mb-3">{kpi.label}</div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full transition-all duration-1000"
                style={{ width: `${(kpi.value / kpi.target) * 100}%` }}
              />
            </div>
            <div className="text-right text-xs text-slate-500 mt-1">{Math.round((kpi.value / kpi.target) * 100)}%</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">📅 战略发展时间线</h3>
          <button
            onClick={() => setShowMsForm(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
          >
            ➕ 新增里程碑
          </button>
        </div>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          <div className="space-y-6">
            {milestones.map((ms, i) => (
              <div
                key={i}
                className={`relative pl-16 cursor-pointer group`}
                onClick={() => setSelectedMilestone(selectedMilestone === i ? null : i)}
              >
                {/* Node */}
                <div className={`absolute left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                  ms.status === 'done'
                    ? 'bg-green-500/30 border-green-500 text-green-400'
                    : ms.status === 'active'
                    ? 'bg-blue-500/30 border-blue-500 text-blue-400 animate-pulse-slow'
                    : 'bg-slate-700/50 border-slate-600 text-slate-500'
                }`}>
                  {ms.status === 'done' ? '✓' : ms.emoji}
                </div>

                {/* Content */}
                <div className={`glass-card-light p-4 transition-all group-hover:bg-slate-700/40 ${
                  selectedMilestone === i ? 'ring-1 ring-blue-500/50' : ''
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{ms.month}</span>
                      <h4 className="font-semibold text-white">{ms.title}</h4>
                    </div>
                    <span className={`text-sm font-bold ${
                      ms.progress === 100 ? 'text-green-400' : ms.progress > 0 ? 'text-blue-400' : 'text-slate-500'
                    }`}>
                      {ms.progress}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        ms.progress === 100 ? 'bg-green-500' : 'progress-bar'
                      }`}
                      style={{ width: `${ms.progress}%` }}
                    />
                  </div>

                  {selectedMilestone === i && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 animate-fade-in">
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="text-slate-400">🎯 考核指标:</span>
                        <span className="text-white">{ms.kpi}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">调整进度:</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={editingProgress !== null && editingProgress === i ? ms.progress : ms.progress}
                          onChange={e => { e.stopPropagation(); updateProgress(i, Number(e.target.value)) }}
                          onClick={e => e.stopPropagation()}
                          className="flex-1 h-1.5 accent-blue-500 cursor-pointer"
                        />
                        <span className="text-xs text-blue-400 font-mono w-10 text-right">{ms.progress}%</span>
                        <button
                          onClick={e => { e.stopPropagation(); deleteMilestone(i) }}
                          className="text-[10px] px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 文字资讯栏 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">📝 战略资讯与笔记</h3>
          <button
            onClick={() => setShowNoteForm(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
          >
            ➕ 新增资讯
          </button>
        </div>
        <div className="space-y-3">
          {notes.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm">暂无资讯，点击上方按钮添加</div>
          )}
          {notes.map(note => (
            <div
              key={note.id}
              className={`glass-card-light p-4 cursor-pointer transition-all hover:bg-slate-700/40 ${
                expandedNote === note.id ? 'ring-1 ring-purple-500/50' : ''
              }`}
              onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <h4 className="font-semibold text-white text-sm">{note.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{note.time}</span>
                  <button
                    onClick={e => { e.stopPropagation(); setNotes(prev => prev.filter(n => n.id !== note.id)) }}
                    className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity flex items-center justify-center"
                    title="删除"
                  >✕</button>
                </div>
              </div>
              {expandedNote === note.id && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 animate-fade-in">
                  <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{note.content}</p>
                </div>
              )}
              {expandedNote !== note.id && (
                <p className="text-xs text-slate-500 mt-1 truncate">{note.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 新增资讯弹窗 */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowNoteForm(false)}>
          <div className="glass-card p-6 w-[480px] space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">新增战略资讯</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">标题</label>
              <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="如：低成本轻资产运营指导"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">内容</label>
              <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="输入详细内容..."
                rows={6}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50 resize-none" />
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowNoteForm(false)}
                className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button
                onClick={() => {
                  if (!noteTitle.trim()) return
                  const today = new Date()
                  const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
                  setNotes(prev => [{ id: Date.now(), title: noteTitle.trim(), content: noteContent.trim() || '暂无详细内容', time: dateStr }, ...prev])
                  setNoteTitle(''); setNoteContent('')
                  setShowNoteForm(false)
                }}
                disabled={!noteTitle.trim()}
                className="flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 transition-all disabled:opacity-30">确认添加</button>
            </div>
          </div>
        </div>
      )}

      {/* Year Record */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 年度记录</h3>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 12 }, (_, i) => {
            const month = i + 1
            const isPast = month <= new Date().getMonth() + 1
            const intensity = isPast ? Math.random() * 0.8 + 0.2 : 0
            return (
              <div key={i} className="text-center">
                <div
                  className={`h-16 rounded-lg mb-1 transition-all hover:scale-110 cursor-default ${
                    isPast ? 'bg-blue-500' : 'bg-slate-800'
                  }`}
                  style={{ opacity: isPast ? intensity : 0.2 }}
                  title={`${month}月`}
                />
                <span className="text-[10px] text-slate-500">{month}月</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 新增里程碑弹窗 */}
      {showMsForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowMsForm(false)}>
          <div className="glass-card p-6 w-96 space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">新增战略里程碑</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">时间节点</label>
                <input value={msMonth} onChange={e => setMsMonth(e.target.value)} placeholder="如 2027-Q2"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">状态</label>
                <select value={msStatus} onChange={e => setMsStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">里程碑标题</label>
              <input value={msTitle} onChange={e => setMsTitle(e.target.value)} placeholder="如：海外市场拓展"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">考核指标 (KPI)</label>
              <input value={msKpi} onChange={e => setMsKpi(e.target.value)} placeholder="如：海外客户达50+"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">初始进度: {msProgress}%</label>
              <input type="range" min={0} max={100} value={msProgress} onChange={e => setMsProgress(Number(e.target.value))}
                className="w-full h-1.5 accent-blue-500" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">选择图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(em => (
                  <button key={em} onClick={() => setMsEmoji(em)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      msEmoji === em ? 'bg-blue-500/30 border-2 border-blue-400 scale-110' : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                    }`}>{em}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowMsForm(false)}
                className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button onClick={addMilestone} disabled={!msMonth.trim() || !msTitle.trim()}
                className="flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all disabled:opacity-30">确认添加</button>
            </div>
          </div>
        </div>
      )}

      {/* 新增KPI弹窗 */}
      {showKpiForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowKpiForm(false)}>
          <div className="glass-card p-6 w-96 space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">新增关键指标</h3>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">指标名称</label>
              <input value={kpiLabel} onChange={e => setKpiLabel(e.target.value)} placeholder="如：月活跃用户"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">当前值</label>
                <input type="number" value={kpiValue} onChange={e => setKpiValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">目标值</label>
                <input type="number" value={kpiTarget} onChange={e => setKpiTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">单位</label>
                <input value={kpiUnit} onChange={e => setKpiUnit(e.target.value)} placeholder="如：人、%、万"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">选择图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(em => (
                  <button key={em} onClick={() => setKpiEmoji(em)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      kpiEmoji === em ? 'bg-blue-500/30 border-2 border-blue-400 scale-110' : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                    }`}>{em}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">颜色主题</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button key={c} onClick={() => setKpiColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all bg-${c}-500/20 text-${c}-400 ${
                      kpiColor === c ? 'ring-2 ring-current scale-105' : 'opacity-60 hover:opacity-100'
                    }`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowKpiForm(false)}
                className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button onClick={addKpi} disabled={!kpiLabel.trim() || !kpiUnit.trim()}
                className="flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all disabled:opacity-30">确认添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
