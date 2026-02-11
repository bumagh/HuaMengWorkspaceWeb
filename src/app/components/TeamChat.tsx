'use client'

import { useState } from 'react'
import { UserProfile } from '../page'

interface Message {
  id: string
  user: string
  avatar: string
  role: string
  text: string
  time: string
  reactions: { emoji: string; count: number }[]
}

interface SatisfactionItem {
  label: string
  rating: number
  maxRating: number
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', user: '张总', avatar: '👔', role: '管理者', text: '各位，Q1的冲刺阶段到了，大家加油！完成目标有奖金 💪', time: '09:30', reactions: [{ emoji: '🔥', count: 5 }, { emoji: '💪', count: 3 }] },
  { id: '2', user: '小李', avatar: '🧑‍💻', role: '开发者', text: 'AR平台的渲染管线已优化完成，帧率稳定在60fps以上！', time: '10:15', reactions: [{ emoji: '🎉', count: 4 }, { emoji: '👏', count: 6 }] },
  { id: '3', user: '小陈', avatar: '🎨', role: '设计师', text: '新版官网设计稿已上传至共享文件夹，请各位评审', time: '11:00', reactions: [{ emoji: '👀', count: 3 }] },
  { id: '4', user: '王先生', avatar: '🤝', role: '客户', text: 'AR体验的DEMO很棒，我们团队很期待最终版本', time: '14:30', reactions: [{ emoji: '❤️', count: 7 }, { emoji: '🙏', count: 2 }] },
  { id: '5', user: '小张', avatar: '🧑‍💻', role: '开发者', text: '华梦办公宝的前端框架搭建完毕，正在开发各模块功能', time: '15:45', reactions: [{ emoji: '🚀', count: 4 }] },
]

const SATISFACTION_DATA: SatisfactionItem[] = [
  { label: '项目沟通效率', rating: 4.2, maxRating: 5 },
  { label: '任务分配合理性', rating: 3.8, maxRating: 5 },
  { label: '团队协作氛围', rating: 4.5, maxRating: 5 },
  { label: '工作生活平衡', rating: 3.5, maxRating: 5 },
  { label: '技术支持充足度', rating: 4.0, maxRating: 5 },
]

const TEAM_SCORES = [
  { name: '小李', avatar: '🧑‍💻', score: 95, tasks: 23, streak: 7 },
  { name: '小王', avatar: '🧑‍💻', score: 88, tasks: 19, streak: 5 },
  { name: '小陈', avatar: '🎨', score: 92, tasks: 15, streak: 8 },
  { name: '小张', avatar: '🧑‍💻', score: 85, tasks: 17, streak: 3 },
  { name: '小赵', avatar: '🧑‍💻', score: 78, tasks: 12, streak: 2 },
]

interface Props {
  user: UserProfile
  onAction: () => void
}

export default function TeamChat({ user, onAction }: Props) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'scores' | 'satisfaction'>('chat')

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: Date.now().toString(),
      user: user.name,
      avatar: user.avatar,
      role: user.role,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    }
    setMessages(prev => [...prev, msg])
    setNewMessage('')
    onAction()
  }

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m
      const existing = m.reactions.find(r => r.emoji === emoji)
      if (existing) {
        return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) }
      }
      return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'chat' as const, label: '💬 团队频道', },
          { id: 'scores' as const, label: '🏆 成员评分' },
          { id: 'satisfaction' as const, label: '📋 满意度调查' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'glass-card-light text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'chat' && (
        <div className="glass-card flex flex-col" style={{ height: '600px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.user === user.name ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className={`max-w-md ${msg.user === user.name ? 'text-right' : ''}`}>
                  <div className={`flex items-center gap-2 mb-1 ${msg.user === user.name ? 'justify-end' : ''}`}>
                    <span className="text-sm font-semibold text-white">{msg.user}</span>
                    <span className="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{msg.role}</span>
                    <span className="text-xs text-slate-600">{msg.time}</span>
                  </div>
                  <div className={`inline-block p-3 rounded-xl text-sm ${
                    msg.user === user.name
                      ? 'bg-blue-500/20 text-blue-100'
                      : 'bg-slate-800/60 text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.reactions.length > 0 && (
                    <div className={`flex gap-1 mt-1 ${msg.user === user.name ? 'justify-end' : ''}`}>
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => addReaction(msg.id, r.emoji)}
                          className="text-xs bg-slate-800/60 px-2 py-0.5 rounded-full hover:bg-slate-700 transition-colors"
                        >
                          {r.emoji} {r.count}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="发送消息..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scores' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">🏆 团队成员评分排行</h3>
          <div className="space-y-4">
            {TEAM_SCORES.sort((a, b) => b.score - a.score).map((member, i) => (
              <div key={member.name} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-yellow-500/30 text-yellow-400' :
                  i === 1 ? 'bg-gray-400/30 text-gray-300' :
                  i === 2 ? 'bg-amber-700/30 text-amber-600' :
                  'bg-slate-700/50 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{member.name}</span>
                    {i === 0 && <span className="text-yellow-400 text-xs">👑 MVP</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>完成任务: {member.tasks}</span>
                    <span>连续打卡: {member.streak}天 🔥</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{member.score}</div>
                  <div className="text-xs text-slate-500">综合评分</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'satisfaction' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">📋 团队满意度调查</h3>
          <div className="space-y-5">
            {SATISFACTION_DATA.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <span className="text-sm font-bold text-white">{item.rating} / {item.maxRating}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: item.maxRating }, (_, i) => (
                    <div
                      key={i}
                      className={`h-3 flex-1 rounded-full transition-all ${
                        i < Math.floor(item.rating) ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                        i < item.rating ? 'bg-gradient-to-r from-blue-500/50 to-purple-500/50' :
                        'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-400">📊</span>
              <span className="text-sm font-semibold text-blue-300">总体满意度</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {(SATISFACTION_DATA.reduce((s, d) => s + d.rating, 0) / SATISFACTION_DATA.length).toFixed(1)}
              <span className="text-lg text-slate-400"> / 5.0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
