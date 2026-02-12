import { UserProfile } from '@/app/page'

const SESSION_KEY = 'huameng_session'
const WORK_STATUS_KEY = 'huameng_work_status'

export interface SessionData {
  user: UserProfile
  loginTime: string
  workStatus: string
  lastActive: string
}

export function saveSession(user: UserProfile, workStatus: string = 'working'): void {
  const sessionData: SessionData = {
    user,
    loginTime: new Date().toISOString(),
    workStatus,
    lastActive: new Date().toISOString()
  }
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
  } catch (error) {
    console.error('保存会话失败:', error)
  }
}

export function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null
    
    const sessionData: SessionData = JSON.parse(stored)
    
    // 检查会话是否过期（24小时）
    const lastActive = new Date(sessionData.lastActive)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff > 24) {
      clearSession()
      return null
    }
    
    // 更新最后活跃时间
    sessionData.lastActive = new Date().toISOString()
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    
    return sessionData
  } catch (error) {
    console.error('获取会话失败:', error)
    return null
  }
}

export function updateWorkStatus(workStatus: string): void {
  try {
    const session = getSession()
    if (session) {
      session.workStatus = workStatus
      session.lastActive = new Date().toISOString()
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }
  } catch (error) {
    console.error('更新工作状态失败:', error)
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch (error) {
    console.error('清除会话失败:', error)
  }
}

export function getWorkStatus(): string {
  try {
    const session = getSession()
    return session?.workStatus || 'working'
  } catch (error) {
    console.error('获取工作状态失败:', error)
    return 'working'
  }
}
