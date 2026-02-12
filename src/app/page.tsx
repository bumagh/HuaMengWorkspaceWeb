'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Lock, User, Eye, EyeOff, UserPlus, LogIn, KeyRound, Briefcase, Info } from 'lucide-react'
import Dashboard from './components/Dashboard'
import { api } from '@/lib/api'
import { getSession, saveSession, clearSession } from '@/lib/session'

export type Role = string

export interface UserProfile {
  id: string
  name: string
  role: string
  avatar: string
  level: number
  xp: number
  maxXp: number
  isAdmin: boolean
  isOnline?: boolean
  status?: string
}

const PRESET_HINTS = [
  { name: '糖糖', role: 'CEO', avatar: '👑', password: 'tangtang888' },
  { name: '硬功夫', role: '华梦技术总监', avatar: '💻', password: 'yinggongfu666' },
  { name: '小白', role: '运营总监', avatar: '📢', password: 'xiaobai520' },
]

export default function Home() {
  const [accounts, setAccounts] = useState<UserProfile[]>([])
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginName, setLoginName] = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [regName, setRegName] = useState('')
  const [regRole, setRegRole] = useState('')
  const [regPwd, setRegPwd] = useState('')
  const [regPwd2, setRegPwd2] = useState('')
  const [regAvatar, setRegAvatar] = useState('👤')
  const [regError, setRegError] = useState('')

  const AVATAR_OPTIONS = ['👤', '👩', '👨', '🧑‍💼', '👩‍💻', '👨‍💻', '🧑‍🎨', '👩‍🔧', '🦊', '🐱', '🐶', '🦁']

  // 页面加载时从数据库获取用户列表并检查会话
  useEffect(() => {
    api.getUsers().then(setAccounts).catch(() => {})
    
    // 检查是否有保存的会话
    const session = getSession()
    if (session) {
      setUser(session.user)
      // 可选：自动更新在线状态
      api.updateUserOnlineStatus({
        userId: session.user.id,
        isOnline: true,
        status: '在线'
      }).catch(() => {})
    }
  }, [])

  const refreshAccounts = () => {
    api.getUsers().then(setAccounts).catch(() => {})
  }

  const handleLogin = async () => {
    if (!loginName.trim() || !loginPwd.trim()) {
      setLoginError('请输入账户名和密码')
      return
    }
    setLoading(true)
    try {
      const u = await api.login(loginName.trim(), loginPwd)
      setLoginError('')
      setUser(u)
      // 保存会话
      saveSession(u, 'working')
      refreshAccounts()
    } catch (e: any) {
      setLoginError(e.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!regName.trim() || !regRole.trim() || !regPwd.trim()) {
      setRegError('请填写所有必填项')
      return
    }
    if (regPwd !== regPwd2) {
      setRegError('两次输入的密码不一致')
      return
    }
    if (regPwd.length < 6) {
      setRegError('密码长度至少6位')
      return
    }
    setLoading(true)
    try {
      await api.register({ name: regName.trim(), password: regPwd, role: regRole.trim(), avatar: regAvatar })
      setRegError('')
      setIsRegister(false)
      setLoginName(regName.trim())
      setLoginPwd('')
      refreshAccounts()
    } catch (e: any) {
      setRegError(e.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (user) {
      try { await api.logout(user.id) } catch {}
    }
    setUser(null)
    setLoginName('')
    setLoginPwd('')
    // 清除会话
    clearSession()
    refreshAccounts()
  }

  // 登录界面
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 背景动效 */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/50" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 w-full max-w-md mx-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
              <Zap size={36} className="text-white" fill="white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">华梦办公宝</h1>
            <p className="text-indigo-400/60 text-sm font-medium">HuaMeng Office · 游戏化管理平台</p>
          </motion.div>

          {!isRegister ? (
            /* 登录表单 */
            <div className="glass-card p-8 space-y-5 border border-slate-600/50">
              <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-2">
                <Lock size={18} className="text-indigo-400" /> 账户登录
              </h2>

              {/* 快捷登录按钮 */}
              {accounts.length > 0 && (
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">快捷选择账户</label>
                  <div className="grid grid-cols-3 gap-2">
                    {accounts.map(acc => (
                      <button key={acc.id} onClick={() => { setLoginName(acc.name); setLoginPwd(''); setLoginError('') }}
                        className={`p-2.5 rounded-xl text-center transition-all border ${
                          loginName === acc.name
                            ? 'bg-blue-500/20 border-blue-500/40 scale-105'
                            : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500'
                        }`}>
                        <div className="text-2xl mb-1">{acc.avatar}</div>
                        <div className="text-xs text-white font-medium truncate">{acc.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{acc.role}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1 block">用户名</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input value={loginName} onChange={e => { setLoginName(e.target.value); setLoginError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="输入用户名或账户ID"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">密码</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPwd ? 'text' : 'password'} value={loginPwd}
                    onChange={e => { setLoginPwd(e.target.value); setLoginError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    placeholder="输入密码"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
                  <button onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-all">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="text-xs text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20 flex items-center gap-2">
                  ⚠️ {loginError}
                </div>
              )}

              <button onClick={handleLogin} disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                <LogIn size={16} />
                {loading ? '登录中...' : '登录系统'}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button onClick={() => { setIsRegister(true); setRegError('') }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1">
                  <UserPlus size={12} /> 注册新账户
                </button>
                <span className="text-[10px] text-slate-600">v1.0.0</span>
              </div>
            </div>
          ) : (
            /* 注册表单 */
            <div className="glass-card p-8 space-y-4 border border-slate-600/50">
              <h2 className="text-lg font-bold text-white text-center flex items-center justify-center gap-2">
                <UserPlus size={18} className="text-emerald-400" /> 注册新账户
              </h2>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">用户名 *</label>
                <input value={regName} onChange={e => { setRegName(e.target.value); setRegError('') }}
                  placeholder="输入用户名"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">职位 *</label>
                <input value={regRole} onChange={e => { setRegRole(e.target.value); setRegError('') }}
                  placeholder="如：产品经理、设计师、开发工程师"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">选择头像</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map(av => (
                    <button key={av} onClick={() => setRegAvatar(av)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        regAvatar === av ? 'bg-blue-500/30 border-2 border-blue-400 scale-110' : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                      }`}>{av}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">密码 * (至少6位)</label>
                <input type="password" value={regPwd} onChange={e => { setRegPwd(e.target.value); setRegError('') }}
                  placeholder="设置密码"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">确认密码 *</label>
                <input type="password" value={regPwd2} onChange={e => { setRegPwd2(e.target.value); setRegError('') }}
                  placeholder="再次输入密码"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>

              {regError && (
                <div className="text-xs text-red-400 bg-red-500/10 px-4 py-2.5 rounded-xl border border-red-500/20 flex items-center gap-2">
                  ⚠️ {regError}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={() => { setIsRegister(false); setRegError('') }}
                  className="flex-1 py-3 rounded-xl text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all flex items-center justify-center gap-1">
                  <LogIn size={14} /> 返回登录
                </button>
                <button onClick={handleRegister} disabled={loading}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                  <UserPlus size={14} /> {loading ? '注册中...' : '注册'}
                </button>
              </div>
            </div>
          )}

          {/* 账户提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 glass-card p-4 border border-slate-700/30"
          >
            <h3 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5"><Info size={12} className="text-indigo-400" /> 预设账户密码</h3>
            <div className="space-y-1.5">
              {PRESET_HINTS.map(acc => (
                <div key={acc.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span>{acc.avatar}</span>
                    <span className="text-white">{acc.name}</span>
                    <span className="text-slate-600">({acc.role})</span>
                  </div>
                  <code className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{acc.password}</code>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <Dashboard
      user={user}
      accounts={accounts}
      onSwitchUser={setUser}
      onRefreshAccounts={refreshAccounts}
      onLogout={handleLogout}
    />
  )
}
