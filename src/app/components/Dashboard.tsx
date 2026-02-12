'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../page'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Target, ClipboardList, MessageSquare,
  BarChart3, Wallet, Trophy, LogOut, UserPlus,
  ChevronDown, Zap, Shield, Bell, Settings, Sparkles
} from 'lucide-react'
import StrategyBoard from './StrategyBoard'
import ProjectManager from './ProjectManager'
import TeamChat from './TeamChat'
import Analytics from './Analytics'
import VirtualOffice from './VirtualOffice'
import PointsCenter from './PointsCenter'
import Finance from './Finance'
import TeamOnlineStatus from './TeamOnlineStatus'

const NAV_ITEMS = [
  { id: 'office', label: '虚拟办公室', icon: Building2, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/5' },
  { id: 'strategy', label: '战略看板', icon: Target, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-600/5' },
  { id: 'projects', label: '项目管理', icon: ClipboardList, color: 'text-violet-400', bg: 'from-violet-500/20 to-violet-600/5' },
  { id: 'team', label: '团队协作', icon: MessageSquare, color: 'text-amber-400', bg: 'from-amber-500/20 to-amber-600/5' },
  { id: 'analytics', label: '数据分析', icon: BarChart3, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-cyan-600/5' },
  { id: 'finance', label: '财务系统', icon: Wallet, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/5' },
  { id: 'points', label: '积分中心', icon: Trophy, color: 'text-rose-400', bg: 'from-rose-500/20 to-rose-600/5' },
]

const AVATAR_OPTIONS = ['👤', '👩', '👨', '🧑‍💼', '👩‍💻', '👨‍💻', '🧑‍🎨', '👩‍🔧', '🦊', '🐱', '🐶', '🦁']

interface Props {
  user: UserProfile
  accounts: UserProfile[]
  onSwitchUser: (u: UserProfile) => void
  onRefreshAccounts: () => void
  onLogout: () => void
}

export default function Dashboard({ user, accounts, onSwitchUser, onRefreshAccounts, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState('office')
  const [xp, setXp] = useState(user.xp)
  const [level, setLevel] = useState(user.level)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newAvatar, setNewAvatar] = useState('👤')
  const [newIsAdmin, setNewIsAdmin] = useState(false)
  const [newPwd, setNewPwd] = useState('')

  const handleAddAccount = async () => {
    if (!newName.trim() || !newRole.trim() || !newPwd.trim()) return
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), password: newPwd, role: newRole.trim(), avatar: newAvatar }),
      })
      if (!res.ok) return
      const newUser = await res.json()
      onSwitchUser(newUser)
      setXp(0)
      setLevel(1)
      onRefreshAccounts()
    } catch {}
    setNewName('')
    setNewRole('')
    setNewAvatar('👤')
    setNewIsAdmin(false)
    setNewPwd('')
    setShowAddForm(false)
    setShowAccountMenu(false)
  }

  // 积分系统
  const [pointRecords, setPointRecords] = useState<{ id: number; action: string; points: number; time: string }[]>([
    { id: 1, action: '每日登录', points: 10, time: '2026-02-11 17:00' },
  ])
  const [pointToast, setPointToast] = useState<{ action: string; points: number } | null>(null)

  const addXp = (amount: number, action?: string) => {
    let newXp = xp + amount
    let newLevel = level
    while (newXp >= user.maxXp) {
      newXp -= user.maxXp
      newLevel++
    }
    setXp(newXp)
    setLevel(newLevel)
    // 记录积分
    if (action) {
      const now = new Date()
      const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      setPointRecords(prev => [...prev, { id: Date.now(), action, points: amount, time: timeStr }])
      // 弹窗提示
      setPointToast({ action, points: amount })
      setTimeout(() => setPointToast(null), 2500)
      // 保存到后端
      fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, points: amount, userId: user.id }),
      }).catch(() => {})
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'office': return <VirtualOffice user={user} accounts={accounts} />
      case 'strategy': return <StrategyBoard />
      case 'projects': return <ProjectManager onAction={(action?: string) => {
        const pts = action === '新建项目' ? 30 : action === '发表项目留言' ? 8 : action === '添加关键记录' ? 5 : 20
        addXp(pts, action || '完成里程碑')
      }} />
      case 'team': return <TeamChat user={user} onAction={() => addXp(5, '团队协作消息')} />
      case 'analytics': return <Analytics />
      case 'finance': return <Finance />
      case 'points': return <PointsCenter totalPoints={level * 100 + xp} level={level} xp={xp} maxXp={user.maxXp} records={pointRecords} />
      default: return <VirtualOffice user={user} accounts={accounts} />
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm tracking-wide">华梦办公宝</h1>
              <p className="text-[10px] text-indigo-400/60 font-medium">HuaMeng Office</p>
            </div>
          </div>
        </div>

        {/* User Card with Account Switcher */}
        <div className="p-4 border-b border-slate-700/50 relative">
          <div
            className="glass-card-light p-3 cursor-pointer hover:border-blue-500/40 transition-all"
            onClick={() => setShowAccountMenu(!showAccountMenu)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                user.isAdmin
                  ? 'bg-gradient-to-br from-amber-500 to-red-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{user.name}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${user.isAdmin ? 'text-amber-400' : 'text-slate-400'}`}>{user.role}</span>
                  {user.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Admin</span>}
                </div>
              </div>
              <span className="level-badge">Lv.{level}</span>
            </div>
            {/* XP Bar */}
            <div className="relative">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full progress-bar rounded-full transition-all duration-500"
                  style={{ width: `${(xp / user.maxXp) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-500">EXP</span>
                <span className="text-[10px] text-slate-500">{xp}/{user.maxXp}</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-500">点击切换账户 ▾</span>
            </div>
          </div>

          {/* Account Switcher Dropdown */}
          {showAccountMenu && (
            <div className="absolute left-4 right-4 top-full mt-1 z-50 glass-card p-2 space-y-1 border border-slate-600/50 shadow-2xl">
              <div className="text-[10px] text-slate-500 px-2 py-1 uppercase tracking-wider">切换账户</div>
              {accounts.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => {
                    onSwitchUser(acc)
                    setXp(acc.xp)
                    setLevel(acc.level)
                    setShowAccountMenu(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    user.id === acc.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700/60 border border-transparent'
                  }`}
                >
                  <span className="text-lg">{acc.avatar}</span>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-medium">{acc.name}</div>
                    <div className={`text-[10px] ${acc.isAdmin ? 'text-amber-400' : 'text-slate-500'}`}>{acc.role}</div>
                  </div>
                  {user.id === acc.id && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
                </button>
              ))}
              <div className="border-t border-slate-700/50 mt-1 pt-1">
                <button
                  onClick={() => { setShowAddForm(true); setShowAccountMenu(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-400 hover:bg-green-500/10 transition-all"
                >
                  <UserPlus size={16} />
                  <span className="text-xs font-medium">新增角色</span>
                </button>
                <button
                  onClick={() => { setShowAccountMenu(false); onLogout() }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} />
                  <span className="text-xs font-medium">退出登录</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 新增角色弹窗 */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowAddForm(false)}>
            <div className="glass-card p-6 w-80 space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white text-center">新增团队成员</h3>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">姓名</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="输入姓名"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">职位</label>
                <input
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  placeholder="如：产品经理、设计师、开发工程师"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">选择头像</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      onClick={() => setNewAvatar(av)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        newAvatar === av
                          ? 'bg-blue-500/30 border-2 border-blue-400 scale-110'
                          : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">设置密码 *</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={e => setNewPwd(e.target.value)}
                  placeholder="至少6位密码"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400">管理员权限</label>
                <button
                  onClick={() => setNewIsAdmin(!newIsAdmin)}
                  className={`w-10 h-5 rounded-full transition-all relative ${
                    newIsAdmin ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    newIsAdmin ? 'left-5' : 'left-0.5'
                  }`} />
                </button>
                {newIsAdmin && <span className="text-[10px] text-amber-400">Admin</span>}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleAddAccount}
                  disabled={!newName.trim() || !newRole.trim() || !newPwd.trim() || newPwd.length < 6}
                  className="flex-1 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all disabled:opacity-30"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item w-full ${isActive ? 'active' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${item.bg} ${item.color}`
                    : 'bg-slate-800/40 text-slate-500'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={isActive ? item.color : ''}>{item.label}</span>
                {isActive && (
                  <Sparkles size={14} className={`ml-auto ${item.color} opacity-60`} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-700/50">
          <p className="text-[10px] text-slate-600 text-center">© 2026 华梦有限公司</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              {(() => {
                const nav = NAV_ITEMS.find(n => n.id === activeTab)
                if (!nav) return null
                const Icon = nav.icon
                return <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${nav.bg} flex items-center justify-center ${nav.color}`}><Icon size={20} /></div>
              })()}
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('points')}
              className="glass-card-light px-4 py-2 flex items-center gap-2 hover:border-amber-500/40 transition-all cursor-pointer group">
              <Trophy size={16} className="text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-amber-400 font-bold">{level * 100 + xp} 积分</span>
              <span className="level-badge">Lv.{level}</span>
            </button>
            <div className="glass-card-light px-4 py-2 flex items-center gap-2">
              <span className="online-dot"></span>
              <span className="text-sm text-emerald-400">在线</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* 积分获取提示 */}
        {pointToast && (
          <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
            <div className="glass-card px-6 py-4 border border-amber-500/30 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-900" />
              </div>
              <div>
                <div className="text-sm text-white font-semibold">{pointToast.action}</div>
                <div className="text-xs text-amber-400">获得 <span className="font-bold text-lg">+{pointToast.points}</span> 积分</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
