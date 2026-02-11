'use client'

import { useState } from 'react'
import {
  Trophy, Star, Zap, TrendingUp, Award, BookOpen,
  History, BarChart3, Flag, Pin, MessageSquare, ClipboardList,
  Target, PieChart, FileText, KeyRound, Users, Medal, Crown, Gem
} from 'lucide-react'

interface PointRecord {
  id: number
  action: string
  points: number
  time: string
}

const POINTS_RULES = [
  { action: '完成里程碑', points: 20, icon: Flag, color: 'text-emerald-400' },
  { action: '添加关键记录', points: 5, icon: Pin, color: 'text-blue-400' },
  { action: '发表项目留言', points: 8, icon: MessageSquare, color: 'text-violet-400' },
  { action: '新建项目', points: 30, icon: ClipboardList, color: 'text-indigo-400' },
  { action: '创建战略里程碑', points: 15, icon: Target, color: 'text-cyan-400' },
  { action: '添加KPI指标', points: 10, icon: PieChart, color: 'text-amber-400' },
  { action: '添加战略资讯', points: 10, icon: FileText, color: 'text-pink-400' },
  { action: '每日登录', points: 10, icon: KeyRound, color: 'text-yellow-400' },
  { action: '团队协作消息', points: 5, icon: Users, color: 'text-orange-400' },
]

const ACHIEVEMENTS = [
  { id: 'first_login', name: '初入华梦', desc: '首次登录系统', icon: KeyRound, minLevel: 1 },
  { id: 'milestone_5', name: '里程碑猎人', desc: '完成5个里程碑', icon: Flag, minLevel: 3 },
  { id: 'project_3', name: '项目达人', desc: '创建3个项目', icon: ClipboardList, minLevel: 5 },
  { id: 'team_player', name: '团队之星', desc: '发送50条协作消息', icon: Users, minLevel: 7 },
  { id: 'strategist', name: '战略大师', desc: '完成10个战略目标', icon: Target, minLevel: 10 },
  { id: 'legend', name: '传奇人物', desc: '达到12级', icon: Crown, minLevel: 12 },
]

function RingProgress({ value, max, size = 80, stroke = 6, color = '#8b5cf6' }: { value: number; max: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const progress = Math.min(value / max, 1)
  const dashOffset = circumference * (1 - progress)
  return (
    <div className="ring-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  )
}

const LEVEL_TITLES: Record<number, string> = {
  1: '实习生',
  2: '初级职员',
  3: '中级职员',
  4: '高级职员',
  5: '资深员工',
  6: '团队骨干',
  7: '部门精英',
  8: '管理新星',
  9: '高级管理',
  10: '核心高管',
  11: '卓越领袖',
  12: '传奇人物',
  15: '公司元老',
}

function getLevelTitle(level: number): string {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  for (const k of keys) {
    if (level >= k) return LEVEL_TITLES[k]
  }
  return '实习生'
}

interface Props {
  totalPoints: number
  level: number
  xp: number
  maxXp: number
  records: PointRecord[]
}

export default function PointsCenter({ totalPoints, level, xp, maxXp, records }: Props) {
  const [tab, setTab] = useState<'overview' | 'records' | 'rules'>('overview')
  const title = getLevelTitle(level)
  const nextTitle = getLevelTitle(level + 1)

  return (
    <div className="space-y-6">
      {/* 积分总览卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-6 text-center col-span-2 stat-card">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 flex items-center justify-center">
              <Trophy size={24} className="text-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                {totalPoints}
              </div>
              <div className="text-xs text-slate-400">总积分</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-1 px-4 py-1.5 rounded-full bg-amber-500/10 w-fit mx-auto">
            <Award size={14} className="text-amber-400" />
            <span className="text-amber-400 font-bold text-sm">{title}</span>
          </div>
        </div>
        <div className="glass-card p-5 text-center stat-card flex flex-col items-center justify-center">
          <RingProgress value={xp} max={maxXp} size={72} color="#8b5cf6" />
          <div className="text-lg font-bold text-violet-400 mt-2">Lv.{level}</div>
          <div className="text-[10px] text-slate-500">{xp}/{maxXp} EXP</div>
        </div>
        <div className="glass-card p-5 text-center stat-card flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mb-2">
            <Zap size={22} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{records.length}</div>
          <div className="text-[10px] text-slate-500">获取次数</div>
        </div>
      </div>

      {/* 等级进度 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Medal size={20} className="text-violet-400" /> 等级成长</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white mb-1 shadow-lg shadow-indigo-500/20">
              {level}
            </div>
            <div className="text-[10px] text-indigo-400 font-medium">{title}</div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Lv.{level} {title}</span>
              <span>Lv.{level + 1} {nextTitle}</span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full progress-bar rounded-full transition-all duration-1000" style={{ width: `${(xp / maxXp) * 100}%` }} />
            </div>
            <div className="text-xs text-slate-500 mt-1 text-center">
              还需 <span className="text-indigo-400 font-bold">{maxXp - xp}</span> 经验升级
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500 mb-1">
              {level + 1}
            </div>
            <div className="text-[10px] text-slate-500">{nextTitle}</div>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="mt-5 pt-5 border-t border-slate-700/50">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Gem size={14} className="text-rose-400" /> 成就徽章</h4>
          <div className="grid grid-cols-6 gap-2">
            {ACHIEVEMENTS.map(ach => {
              const unlocked = level >= ach.minLevel
              const Icon = ach.icon
              return (
                <div key={ach.id} className={`achievement-badge ${unlocked ? '' : 'locked'}`} title={ach.desc}>
                  <Icon size={22} className={unlocked ? 'text-amber-400 mx-auto' : 'text-slate-600 mx-auto'} />
                  <div className={`text-[9px] mt-1 ${unlocked ? 'text-white' : 'text-slate-600'}`}>{ach.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/40 rounded-xl p-1">
        {([
          { id: 'overview' as const, label: '积分统计', icon: BarChart3 },
          { id: 'records' as const, label: '积分记录', icon: History },
          { id: 'rules' as const, label: '积分规则', icon: BookOpen },
        ]).map(t => {
          const TIcon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                tab === t.id ? 'bg-violet-500/15 text-violet-400' : 'text-slate-400 hover:text-white'
              }`}><TIcon size={13} /> {t.label}</button>
          )
        })}
      </div>

      {/* Tab: 积分统计 */}
      {tab === 'overview' && (
        <div className="glass-card p-6 animate-fade-in">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-violet-400" /> 积分来源分布</h4>
          <div className="space-y-3">
            {(() => {
              const grouped: Record<string, number> = {}
              records.forEach(r => {
                grouped[r.action] = (grouped[r.action] || 0) + r.points
              })
              const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1])
              const maxVal = entries.length > 0 ? entries[0][1] : 1
              return entries.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">暂无积分记录</div>
              ) : entries.map(([action, pts]) => {
                const rule = POINTS_RULES.find(r => r.action === action)
                return (
                  <div key={action} className="flex items-center gap-3">
                    <span className="w-8 flex items-center justify-center">{(() => { const I = rule?.icon || Star; return <I size={16} className={rule?.color || 'text-amber-400'} /> })()}</span>
                    <span className="text-sm text-white w-32">{action}</span>
                    <div className="flex-1 h-5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${(pts / maxVal) * 100}%` }} />
                    </div>
                    <span className="text-sm text-amber-400 font-bold w-16 text-right">+{pts}</span>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}

      {/* Tab: 积分记录 */}
      {tab === 'records' && (
        <div className="glass-card p-6 animate-fade-in">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><History size={16} className="text-violet-400" /> 积分获取记录</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {records.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">暂无积分记录，完成任务即可获得积分</div>}
            {[...records].reverse().map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  {(() => { const rule = POINTS_RULES.find(rule => rule.action === r.action); const I = rule?.icon || Star; return <I size={14} className={rule?.color || 'text-violet-400'} /> })()}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-white">{r.action}</div>
                  <div className="text-[10px] text-slate-500">{r.time}</div>
                </div>
                <span className="text-sm font-bold text-green-400">+{r.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 积分规则 */}
      {tab === 'rules' && (
        <div className="glass-card p-6 animate-fade-in">
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2"><BookOpen size={16} className="text-violet-400" /> 积分获取规则</h4>
          <div className="space-y-3">
            {POINTS_RULES.map(rule => {
              const RIcon = rule.icon
              return (
                <div key={rule.action} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all">
                  <div className={`w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center ${rule.color}`}><RIcon size={16} /></div>
                  <span className="text-sm text-white flex-1">{rule.action}</span>
                  <span className="text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg">+{rule.points}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <div className="text-xs text-indigo-400 flex items-center gap-1.5">
              <TrendingUp size={12} /> <strong>升级规则：</strong>每积累足够经验值即可升级。等级越高，称号越尊贵。积分 = 等级×100 + 当前经验值。
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
