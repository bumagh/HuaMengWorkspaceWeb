'use client'

import { useState } from 'react'
import { UserProfile } from '../page'

const ROLES = [
  { role: '管理者', emoji: '👔', desc: '掌握公司战略、项目统筹、财务分析', color: 'from-blue-500 to-cyan-400' },
  { role: '开发者', emoji: '💻', desc: '参与项目开发、进度汇报、技术攻关', color: 'from-purple-500 to-pink-400' },
  { role: '客户', emoji: '🤝', desc: '查看项目动态、满意度反馈、进度跟踪', color: 'from-amber-500 to-orange-400' },
]

interface Props {
  onSelect: (user: UserProfile) => void
}

export default function RoleSelect({ onSelect }: Props) {
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [customRole, setCustomRole] = useState('')
  const [step, setStep] = useState(0)

  const handleEnter = () => {
    const role = customRole || selectedRole
    if (!name.trim() || !role) return
    onSelect({
      name: name.trim(),
      role,
      avatar: ROLES.find(r => r.role === role)?.emoji || '🧑',
      level: 1,
      xp: 0,
      maxXp: 100,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo & Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 text-5xl shadow-lg glow-blue">
            🏢
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            华梦办公宝
          </h1>
          <p className="text-slate-400 text-lg">香港华梦有限公司 · 游戏化项目管理平台</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-green-400 dot-pulse"></span>
            <span className="text-green-400 text-sm">系统在线</span>
          </div>
        </div>

        {step === 0 && (
          <div className="glass-card p-8 animate-slide-up">
            <h2 className="text-xl font-semibold mb-6 text-center">🎮 欢迎进入虚拟办公室</h2>
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">您的姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一步 →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-slide-up">
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-2 text-center">🎭 选择您的角色</h2>
              <p className="text-slate-400 text-sm text-center mb-6">不同角色拥有不同的视角和权限</p>

              <div className="grid gap-4 mb-6">
                {ROLES.map(r => (
                  <button
                    key={r.role}
                    onClick={() => { setSelectedRole(r.role); setCustomRole('') }}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left ${
                      selectedRole === r.role && !customRole
                        ? 'border-blue-500/60 bg-blue-500/10 glow-blue'
                        : 'border-slate-600/30 bg-slate-800/40 hover:border-slate-500/50 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-2xl shadow-md`}>
                      {r.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{r.role}</div>
                      <div className="text-sm text-slate-400">{r.desc}</div>
                    </div>
                    {selectedRole === r.role && !customRole && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">✓</div>
                    )}
                  </button>
                ))}

                {/* Custom role */}
                <div className={`p-4 rounded-xl border transition-all ${
                  customRole ? 'border-amber-500/60 bg-amber-500/10 glow-gold' : 'border-slate-600/30 bg-slate-800/40'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-400 flex items-center justify-center text-2xl shadow-md">
                      ✏️
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">自定义角色</div>
                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) => { setCustomRole(e.target.value); setSelectedRole('') }}
                        placeholder="输入自定义角色名称..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-600/40 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-3 rounded-xl border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 transition-all"
                >
                  ← 返回
                </button>
                <button
                  onClick={handleEnter}
                  disabled={!selectedRole && !customRole}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🚀 进入办公宝
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-slate-600 text-xs mt-8">
          © 2026 香港华梦有限公司 · HuaMeng Office v1.0
        </p>
      </div>
    </div>
  )
}
