'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Wifi, WifiOff, Circle } from 'lucide-react'
import { api } from '@/lib/api'

export interface OnlineUser {
  id: string
  name: string
  role: string
  avatar: string
  isOnline: boolean
  status: string
  level: number
  xp: number
  maxXp: number
  isAdmin: boolean
}

interface TeamOnlineStatusProps {
  currentUserId: string
  onOnlineCountChange?: (onlineCount: number, totalCount: number) => void
}

export default function TeamOnlineStatus({ currentUserId, onOnlineCountChange }: TeamOnlineStatusProps) {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // 获取在线用户列表
  const fetchOnlineUsers = async () => {
    try {
      const users = await api.getOnlineUsers()
      setOnlineUsers(users)
      setLastUpdate(Date.now())
      
      // 通知父组件在线人数变化
      if (onOnlineCountChange) {
        const onlineCount = users.filter((u: OnlineUser) => u.isOnline).length
        const totalCount = users.length
        onOnlineCountChange(onlineCount, totalCount)
      }
    } catch (error) {
      console.error('获取在线用户失败:', error)
    }
  }

  // 初始化和定期更新
  useEffect(() => {
    fetchOnlineUsers()
    
    // 每30秒更新一次在线状态
    const interval = setInterval(fetchOnlineUsers, 30000)
    
    // 页面可见性变化时更新
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchOnlineUsers()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 更新当前用户在线状态
  useEffect(() => {
    const updateCurrentStatus = async () => {
      try {
        await api.updateUserOnlineStatus({
          userId: currentUserId,
          isOnline: true,
          status: '在线'
        })
      } catch (error) {
        console.error('更新在线状态失败:', error)
      }
    }

    updateCurrentStatus()
    
    // 每60秒更新一次当前用户状态（保持活跃）
    const heartbeat = setInterval(updateCurrentStatus, 60000)
    
    // 页面关闭时设置为离线
    const handleBeforeUnload = async () => {
      try {
        await api.updateUserOnlineStatus({
          userId: currentUserId,
          isOnline: false,
          status: '离线'
        })
      } catch (error) {
        console.error('更新离线状态失败:', error)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      clearInterval(heartbeat)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [currentUserId])

  const onlineCount = onlineUsers.filter(u => u.isOnline).length
  const totalCount = onlineUsers.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 border border-slate-700/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Users size={16} className="text-indigo-400" />
          团队在线状态
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Circle size={8} className="text-emerald-400 fill-emerald-400" />
            <span className="text-xs text-emerald-400">{onlineCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle size={8} className="text-slate-600 fill-slate-600" />
            <span className="text-xs text-slate-500">{totalCount - onlineCount}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {onlineUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${
                user.id === currentUserId 
                  ? 'bg-indigo-500/10 border border-indigo-500/30' 
                  : 'bg-slate-800/30 hover:bg-slate-700/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="text-lg">{user.avatar}</span>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800 ${
                    user.isOnline ? 'bg-emerald-400' : 'bg-slate-600'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">
                      {user.name}
                      {user.id === currentUserId && (
                        <span className="text-xs text-indigo-400 ml-1">(你)</span>
                      )}
                    </span>
                    {user.isAdmin && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">管理员</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">{user.role}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs ${
                  user.isOnline ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {user.isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
                  {user.status}
                </div>
                <div className="text-xs text-slate-600">
                  Lv.{user.level}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-700/30">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>最后更新: {new Date(lastUpdate).toLocaleTimeString()}</span>
          <button
            onClick={fetchOnlineUsers}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            刷新
          </button>
        </div>
      </div>
    </motion.div>
  )
}
