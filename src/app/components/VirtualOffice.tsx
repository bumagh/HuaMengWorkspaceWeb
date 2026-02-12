'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../page'
import TeamOnlineStatus from './TeamOnlineStatus'
import { getWorkStatus, updateWorkStatus } from '@/lib/session'

const OFFLINE_TIMES: Record<string, string> = {
  tangtang: '14:32',
  yinggongfu: '15:10',
  xiaobai: '13:45',
}

const WORK_STATUSES = [
  { id: 'working', label: '工作中', emoji: '💼', color: 'green' },
  { id: 'meeting', label: '会议中', emoji: '📡', color: 'blue' },
  { id: 'overtime', label: '加班中', emoji: '🔥', color: 'orange' },
  { id: 'break', label: '休息中', emoji: '☕', color: 'yellow' },
  { id: 'lunch', label: '吃饭中', emoji: '🍜', color: 'amber' },
  { id: 'outwork', label: '外出办公', emoji: '🚗', color: 'purple' },
  { id: 'dnd', label: '请勿打扰', emoji: '🔕', color: 'red' },
]

const DEFAULT_OFFLINE_STATUS: Record<string, string> = {
  tangtang: 'meeting',
  yinggongfu: 'working',
  xiaobai: 'break',
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/20' },
  blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/20' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/20' },
  yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/20' },
  purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/20' },
  red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/20' },
}

const OFFICE_ZONES = [
  { id: 'ceo', name: 'CEO办公室', emoji: '🏛️', desc: '战略决策中心', people: ['� 糖糖'], status: '在线', color: 'from-amber-500 to-yellow-400' },
  { id: 'dev', name: '技术中心', emoji: '💻', desc: '产品开发与技术攻关', people: ['💻 硬功夫'], status: '开发中', color: 'from-blue-500 to-cyan-400' },
  { id: 'ops', name: '运营中心', emoji: '📢', desc: '市场运营与推广', people: ['📢 小白'], status: '运营中', color: 'from-purple-500 to-pink-400' },
  { id: 'meeting', name: '会议厅', emoji: '📡', desc: '团队沟通与项目评审', people: [], status: '空闲', color: 'from-green-500 to-emerald-400' },
  { id: 'client', name: '客户接待', emoji: '🤝', desc: '客户参观与项目展示', people: [], status: '空闲', color: 'from-orange-500 to-red-400' },
  { id: 'data', name: '数据中心', emoji: '📊', desc: '数据分析与报表生成', people: [], status: '运行中', color: 'from-teal-500 to-cyan-400' },
]

const INIT_ANNOUNCEMENTS = [
  { id: 1, time: '10:00', text: '📢 Q1季度项目评审会议将于下周一举行', type: 'info' },
  { id: 2, time: '11:30', text: '🎉 华梦AR项目成功完成阶段性验收！', type: 'success' },
  { id: 3, time: '14:00', text: '⚠️ 服务器维护通知：本周六凌晨2-4点', type: 'warning' },
  { id: 4, time: '15:30', text: '💰 本月营收已达目标85%，继续加油！', type: 'info' },
]

interface Props {
  user: UserProfile
  accounts: UserProfile[]
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}小时${m}分${s}秒`
  if (m > 0) return `${m}分${s}秒`
  return `${s}秒`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
}

export default function VirtualOffice({ user, accounts }: { user: UserProfile; accounts: UserProfile[] }) {
  const [onlineCount, setOnlineCount] = useState(1) // 至少当前用户在线
  const [totalCount, setTotalCount] = useState(accounts.length)

  useEffect(() => {
    setTotalCount(accounts.length)
  }, [accounts])

  const [onlineSeconds, setOnlineSeconds] = useState(0)
  const [loginTime, setLoginTime] = useState<Date | null>(null)
  const [now, setNow] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)
  const [workStatus, setWorkStatus] = useState(getWorkStatus())
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)
  const [announcements, setAnnouncements] = useState(INIT_ANNOUNCEMENTS)
  const [showAnnoForm, setShowAnnoForm] = useState(false)
  const [annoText, setAnnoText] = useState('')
  const [annoType, setAnnoType] = useState('info')

  useEffect(() => {
    const d = new Date()
    setLoginTime(d)
    setNow(d)
    setMounted(true)
    const timer = setInterval(() => {
      setOnlineSeconds(prev => prev + 1)
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 保存工作状态到localStorage
  useEffect(() => {
    updateWorkStatus(workStatus)
  }, [workStatus])

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              🌅 {getGreeting()}，{user.name}！
            </h3>
            <p className="text-slate-400">欢迎回到华梦虚拟办公室，今天也是充满活力的一天</p>
          </div>
          <div className="flex items-center gap-4">
            {/* 工作状态切换器 */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(showStatusMenu === 'status' ? null : 'status')}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  STATUS_COLORS[WORK_STATUSES.find(s => s.id === workStatus)?.color || 'green'].bg
                } ${
                  STATUS_COLORS[WORK_STATUSES.find(s => s.id === workStatus)?.color || 'green'].text
                } border ${
                  STATUS_COLORS[WORK_STATUSES.find(s => s.id === workStatus)?.color || 'green'].border
                }`}
              >
                {WORK_STATUSES.find(s => s.id === workStatus)?.emoji} {WORK_STATUSES.find(s => s.id === workStatus)?.label} ▾
              </button>
              
              {/* 状态下拉菜单 */}
              {showStatusMenu === 'status' && (
                <div className="absolute right-0 top-full mt-2 z-50 w-48 glass-card p-2 space-y-1 border border-slate-600/50 shadow-2xl">
                  <div className="text-[10px] text-slate-500 px-2 py-1 uppercase tracking-wider">切换工作状态</div>
                  {WORK_STATUSES.map(st => {
                    const sc = STATUS_COLORS[st.color]
                    return (
                      <button
                        key={st.id}
                        onClick={() => { 
                          setWorkStatus(st.id)
                          setShowStatusMenu(null)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          workStatus === st.id
                            ? `${sc.bg} ${sc.text} border ${sc.border}`
                            : 'text-slate-300 hover:bg-slate-700/60 border border-transparent'
                        }`}
                      >
                        <span>{st.emoji}</span>
                        <span className="text-xs">{st.label}</span>
                        {workStatus === st.id && <span className="ml-auto w-2 h-2 rounded-full bg-current"></span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="text-5xl animate-float">🏢</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-default">
          <div className="text-2xl mb-2">👥</div>
          <div className="text-2xl font-bold text-white">{onlineCount}/{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1">在岗人员</div>
          <div className="text-xs text-green-400 mt-1">↑ 当前在线</div>
        </div>
        <div className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-default">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-2xl font-bold text-white">5</div>
          <div className="text-xs text-slate-400 mt-1">进行中项目</div>
          <div className="text-xs text-green-400 mt-1">↑ +1</div>
        </div>
        <div className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-default">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-white">47</div>
          <div className="text-xs text-slate-400 mt-1">本月完成任务</div>
          <div className="text-xs text-green-400 mt-1">↑ +8</div>
        </div>
        <div className="glass-card p-4 text-center hover:scale-105 transition-transform cursor-default">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-white">92%</div>
          <div className="text-xs text-slate-400 mt-1">团队士气</div>
          <div className="text-xs text-green-400 mt-1">↑ +5%</div>
        </div>
      </div>

      {/* Team Online Status */}
      <TeamOnlineStatus 
        currentUserId={user.id} 
        onOnlineCountChange={(onlineCount, totalCount) => {
          setOnlineCount(onlineCount)
          setTotalCount(totalCount)
        }}
      />

      {/* Office Map */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">🗺️ 办公室地图</h3>
        <div className="grid grid-cols-3 gap-4">
          {OFFICE_ZONES.map(zone => (
            <div key={zone.id} className="glass-card p-5 hover:scale-[1.02] transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${zone.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {zone.emoji}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  zone.status === '空闲' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {zone.status}
                </span>
              </div>
              <h4 className="font-semibold text-white mb-1">{zone.name}</h4>
              <p className="text-xs text-slate-400 mb-3">{zone.desc}</p>
              {zone.people.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {zone.people.map((p, i) => (
                    <span key={i} className="text-xs bg-slate-700/50 px-2 py-1 rounded-lg text-slate-300">{p}</span>
                  ))}
                </div>
              )}
              {zone.people.length === 0 && (
                <span className="text-xs text-slate-600">暂无人员</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">📣 今日公告</h3>
          <button onClick={() => setShowAnnoForm(!showAnnoForm)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all">
            ➕ 发布公告
          </button>
        </div>
        {/* 新增公告表单 */}
        {showAnnoForm && (
          <div className="mb-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-3">
            <input value={annoText} onChange={e => setAnnoText(e.target.value)}
              placeholder="输入公告内容..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">类型:</span>
              {[
                { id: 'info', label: '📢 通知', color: 'blue' },
                { id: 'success', label: '🎉 喜讯', color: 'green' },
                { id: 'warning', label: '⚠️ 警告', color: 'amber' },
                { id: 'urgent', label: '🚨 紧急', color: 'red' },
              ].map(t => (
                <button key={t.id} onClick={() => setAnnoType(t.id)}
                  className={`text-xs px-2 py-1 rounded-lg transition-all ${
                    annoType === t.id ? `bg-${t.color}-500/20 text-${t.color}-400 border border-${t.color}-500/30` : 'text-slate-500 hover:text-white'
                  }`}>{t.label}</button>
              ))}
              <button onClick={() => {
                if (!annoText.trim()) return
                const now = new Date()
                const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
                setAnnouncements(prev => [{ id: Date.now(), time: timeStr, text: annoText.trim(), type: annoType }, ...prev])
                setAnnoText(''); setShowAnnoForm(false)
              }} disabled={!annoText.trim()}
                className="ml-auto text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-30">发布</button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {announcements.map(a => (
            <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${
              a.type === 'urgent' ? 'bg-red-500/10 border border-red-500/20' :
              a.type === 'warning' ? 'bg-amber-500/5 border border-amber-500/10' :
              a.type === 'success' ? 'bg-green-500/5 border border-green-500/10' :
              'bg-slate-800/40 hover:bg-slate-800/60'
            }`}>
              <span className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{a.time}</span>
              <span className={`text-sm flex-1 ${
                a.type === 'urgent' ? 'text-red-300' : a.type === 'warning' ? 'text-amber-300' : 'text-slate-300'
              }`}>{a.text}</span>
              <button onClick={() => setAnnouncements(prev => prev.filter(x => x.id !== a.id))}
                className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">删除</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return '深夜好'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

function getOfflineDuration(offlineTime: string, now: Date): string {
  const [h, m] = offlineTime.split(':').map(Number)
  const offlineDate = new Date(now)
  offlineDate.setHours(h, m, 0, 0)
  const diffSec = Math.max(0, Math.floor((now.getTime() - offlineDate.getTime()) / 1000))
  const hours = Math.floor(diffSec / 3600)
  const mins = Math.floor((diffSec % 3600) / 60)
  if (hours > 0) return `${hours}小时${mins}分钟`
  return `${mins}分钟`
}
