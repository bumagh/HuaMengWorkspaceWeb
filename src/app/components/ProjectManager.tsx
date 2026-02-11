'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: number
  author: string
  avatar: string
  content: string
  time: string
  rating: number
  likes: number
  replies: { id: number; author: string; avatar: string; content: string; time: string }[]
}

interface ChatMsg {
  id: number
  author: string
  avatar: string
  content: string
  time: string
  type: 'text' | 'system'
}

interface DimRating {
  id: number
  author: string
  avatar: string
  time: string
  quality: number
  progress: number
  teamwork: number
  communication: number
  overall: number
  comment: string
}

interface Project {
  id: string
  name: string
  emoji: string
  description: string
  createdAt: string
  deadline: string
  estimatedDays: number
  progress: number
  status: '进行中' | '已完成' | '待启动' | '暂停'
  priority: '高' | '中' | '低'
  roles: { name: string; role: string; avatar: string }[]
  milestones: { name: string; done: boolean }[]
  keyNotes: string[]
  comments: Comment[]
  chatMsgs: ChatMsg[]
  dimRatings: DimRating[]
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: '1', name: '华梦AR体验平台', emoji: '🥽', description: '基于WebAR技术的沉浸式体验平台，支持手势识别与3D互动',
    createdAt: '2025-11-15', deadline: '2026-04-30', estimatedDays: 120,
    progress: 72, status: '进行中', priority: '高',
    roles: [
      { name: '硬功夫', role: '技术负责人', avatar: '💻' },
      { name: '糖糖', role: '项目总监', avatar: '👑' },
      { name: '小白', role: '运营对接', avatar: '📢' },
    ],
    milestones: [
      { name: '需求分析', done: true }, { name: '原型设计', done: true },
      { name: '核心开发', done: true }, { name: '测试优化', done: false }, { name: '上线部署', done: false }
    ],
    keyNotes: ['AR渲染性能需优化至60fps', '客户要求增加手势识别功能'],
    comments: [
      { id: 1, author: '糖糖', avatar: '👑', content: '本周进度不错，继续保持！', time: '2026-02-10 14:30', rating: 5, likes: 2, replies: [
        { id: 11, author: '硬功夫', avatar: '💻', content: '收到，核心模块这周能完成', time: '2026-02-10 15:00' }
      ] },
      { id: 2, author: '硬功夫', avatar: '💻', content: '手势识别模块需要额外两周时间，技术难度比预期高', time: '2026-02-11 09:15', rating: 4, likes: 1, replies: [] },
    ],
    chatMsgs: [
      { id: 1, author: '系统', avatar: '🤖', content: '项目 华梦AR体验平台 已创建', time: '2025-11-15 09:00', type: 'system' },
      { id: 2, author: '糖糖', avatar: '👑', content: '大家好，AR项目正式启动！请各位确认自己的分工', time: '2025-11-15 10:00', type: 'text' },
      { id: 3, author: '硬功夫', avatar: '💻', content: '技术方案已确定，用WebXR + Three.js', time: '2025-11-16 14:30', type: 'text' },
      { id: 4, author: '小白', avatar: '📢', content: '运营推广方案初稿已完成，等评审', time: '2026-02-10 11:00', type: 'text' },
    ],
    dimRatings: [
      { id: 1, author: '糖糖', avatar: '👑', time: '2026-02-10', quality: 5, progress: 4, teamwork: 5, communication: 4, overall: 5, comment: '团队整体表现优秀' },
    ],
  },
  {
    id: '2', name: '华梦办公宝', emoji: '🏢', description: '游戏化办公管理系统，提升团队协作效率',
    createdAt: '2026-01-05', deadline: '2026-06-30', estimatedDays: 150,
    progress: 45, status: '进行中', priority: '高',
    roles: [
      { name: '硬功夫', role: '主程序员', avatar: '💻' },
      { name: '小白', role: '产品设计', avatar: '📢' },
    ],
    milestones: [
      { name: '需求收集', done: true }, { name: '架构设计', done: true },
      { name: '前端开发', done: false }, { name: '后端开发', done: false }, { name: '集成测试', done: false }
    ],
    keyNotes: ['游戏化设计需要参考最佳实践', '需支持多角色权限体系'],
    comments: [
      { id: 1, author: '小白', avatar: '📢', content: '运营模块需求已整理完毕', time: '2026-02-09 16:00', rating: 4, likes: 1, replies: [] },
    ],
    chatMsgs: [
      { id: 1, author: '系统', avatar: '🤖', content: '项目 华梦办公宝 已创建', time: '2026-01-05 09:00', type: 'system' },
      { id: 2, author: '硬功夫', avatar: '💻', content: '架构设计方案确定，Next.js + Tailwind', time: '2026-01-10 10:00', type: 'text' },
    ],
    dimRatings: [],
  },
  {
    id: '3', name: '企业官网升级', emoji: '🌐', description: '公司官网全新改版，支持中英文多语言',
    createdAt: '2025-12-01', deadline: '2026-03-15', estimatedDays: 80,
    progress: 90, status: '进行中', priority: '中',
    roles: [
      { name: '小白', role: '内容运营', avatar: '📢' },
      { name: '硬功夫', role: '前端开发', avatar: '💻' },
    ],
    milestones: [
      { name: 'UI设计', done: true }, { name: '前端开发', done: true },
      { name: '内容填充', done: true }, { name: 'SEO优化', done: false }
    ],
    keyNotes: ['需要多语言支持（中英文）'],
    comments: [],
    chatMsgs: [],
    dimRatings: [],
  },
]

const EMOJI_LIST = ['📋', '🚀', '🎮', '🌐', '📱', '🤖', '💡', '🔧', '🎨', '📊', '🛒', '🏗️', '📚', '🔒', '🎯', '🥽']
const ROLE_OPTIONS = ['项目总监', '技术负责人', '主程序员', '前端开发', '后端开发', '产品设计', '测试工程师', '运营对接', 'UI设计师', '数据分析']
const MEMBER_OPTIONS = [
  { name: '糖糖', avatar: '👑' },
  { name: '硬功夫', avatar: '💻' },
  { name: '小白', avatar: '📢' },
]

interface Props {
  onAction: (action?: string) => void
}

export default function ProjectManager({ onAction }: Props) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [detailTab, setDetailTab] = useState<'info' | 'milestone' | 'keynote' | 'comments'>('info')

  // 新建项目表单
  const [showNewForm, setShowNewForm] = useState(false)
  const [nName, setNName] = useState('')
  const [nDesc, setNDesc] = useState('')
  const [nEmoji, setNEmoji] = useState('📋')
  const [nDeadline, setNDeadline] = useState('')
  const [nEstDays, setNEstDays] = useState(30)
  const [nPriority, setNPriority] = useState<'高' | '中' | '低'>('中')
  const [nStatus, setNStatus] = useState<'进行中' | '已完成' | '待启动' | '暂停'>('待启动')
  const [nRoles, setNRoles] = useState<{ name: string; role: string; avatar: string }[]>([])
  const [nMilestones, setNMilestones] = useState<string[]>([''])
  const [nRoleMember, setNRoleMember] = useState('')
  const [nRoleTitle, setNRoleTitle] = useState('')

  // 留言
  const [commentText, setCommentText] = useState('')
  const [commentRating, setCommentRating] = useState(5)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  // 实时交流
  const [chatText, setChatText] = useState('')
  const [commSubTab, setCommSubTab] = useState<'messages' | 'chat' | 'rating'>('messages')

  // 多维评分表单
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [rQuality, setRQuality] = useState(5)
  const [rProgress, setRProgress] = useState(5)
  const [rTeamwork, setRTeamwork] = useState(5)
  const [rComm, setRComm] = useState(5)
  const [rOverall, setROverall] = useState(5)
  const [rComment, setRComment] = useState('')

  // 从数据库加载项目
  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then((dbProjects: any[]) => {
      if (!Array.isArray(dbProjects) || dbProjects.length === 0) return
      const mapped: Project[] = dbProjects.map((p: any) => ({
        id: p.id,
        name: p.name,
        emoji: '📋',
        description: p.description || '',
        createdAt: p.startDate || '',
        deadline: p.endDate || '',
        estimatedDays: 30,
        progress: p.progress || 0,
        status: (p.status || '进行中') as any,
        priority: (p.priority || '中') as any,
        roles: (() => { try { return JSON.parse(p.roles || '[]') } catch { return [] } })(),
        milestones: (p.milestones || []).map((m: any) => ({ name: m.name, done: m.done, _id: m.id })),
        keyNotes: (p.keyNotes || []).map((k: any) => k.text),
        comments: (p.comments || []).map((c: any) => ({
          id: c.id, author: c.author?.name || '未知', avatar: c.author?.avatar || '👤',
          content: c.text, time: new Date(c.createdAt).toLocaleString('zh-CN'),
          rating: c.rating, likes: c.likes,
          replies: (c.replies || []).map((r: any) => ({
            id: r.id, author: r.author?.name || '未知', avatar: r.author?.avatar || '👤',
            content: r.text, time: new Date(r.createdAt).toLocaleString('zh-CN'),
          })),
        })),
        chatMsgs: (p.chatMessages || []).map((m: any) => ({
          id: m.id, author: m.type === 'system' ? '系统' : (m.author?.name || '未知'),
          avatar: m.type === 'system' ? '🤖' : (m.author?.avatar || '👤'),
          content: m.text, time: new Date(m.createdAt).toLocaleString('zh-CN'),
          type: m.type === 'system' ? 'system' as const : 'text' as const,
        })),
        dimRatings: (p.ratings || []).map((r: any) => ({
          id: r.id, author: r.author?.name || '未知', avatar: r.author?.avatar || '👤',
          time: new Date(r.createdAt).toLocaleDateString('zh-CN'),
          quality: r.quality, progress: r.progress, teamwork: r.teamwork,
          communication: r.communication, overall: r.overall, comment: r.comment || '',
        })),
      }))
      setProjects(prev => {
        const dbIds = new Set(mapped.map(p => p.id))
        const localOnly = prev.filter(p => !dbIds.has(p.id))
        return [...mapped, ...localOnly]
      })
    }).catch(() => {})
  }, [])

  const selectedProj = projects.find(p => p.id === selectedProject)

  const getNowStr = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  }

  const resetNewForm = () => {
    setNName(''); setNDesc(''); setNEmoji('📋'); setNDeadline(''); setNEstDays(30)
    setNPriority('中'); setNStatus('待启动'); setNRoles([]); setNMilestones(['']); setNRoleMember(''); setNRoleTitle('')
  }

  const createProject = () => {
    if (!nName.trim()) return
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const newProj: Project = {
      id: String(Date.now()),
      name: nName.trim(),
      emoji: nEmoji,
      description: nDesc.trim() || '暂无描述',
      createdAt: dateStr,
      deadline: nDeadline || '待定',
      estimatedDays: nEstDays,
      progress: 0,
      status: nStatus,
      priority: nPriority,
      roles: nRoles,
      milestones: nMilestones.filter(m => m.trim()).map(m => ({ name: m.trim(), done: false })),
      keyNotes: [],
      comments: [],
      chatMsgs: [{ id: Date.now(), author: '系统', avatar: '🤖', content: `项目 ${nName.trim()} 已创建`, time: dateStr + ' 09:00', type: 'system' }],
      dimRatings: [],
    }
    setProjects(prev => [newProj, ...prev])
    resetNewForm()
    setShowNewForm(false)
    setSelectedProject(newProj.id)
    onAction('新建项目')
    // 持久化到数据库
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nName.trim(), description: nDesc.trim() || '暂无描述',
        startDate: dateStr, endDate: nDeadline || '', priority: nPriority,
        creatorId: 'tangtang', members: nRoles.map(r => r.name).join(','),
        roles: JSON.stringify(nRoles),
        milestones: nMilestones.filter(m => m.trim()),
      }),
    }).catch(() => {})
  }

  const toggleMilestone = (projId: string, msIndex: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      const newMs = [...p.milestones]
      newMs[msIndex] = { ...newMs[msIndex], done: !newMs[msIndex].done }
      const done = newMs.filter(m => m.done).length
      const progress = Math.round((done / newMs.length) * 100)
      return { ...p, milestones: newMs, progress, status: progress === 100 ? '已完成' : p.status === '已完成' ? '进行中' : p.status }
    }))
    onAction('完成里程碑')
  }

  const addNote = (projId: string) => {
    if (!newNote.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, keyNotes: [...p.keyNotes, newNote.trim()] }
    }))
    setNewNote('')
    onAction('添加关键记录')
  }

  const addComment = (projId: string) => {
    if (!commentText.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, comments: [...p.comments, { id: Date.now(), author: '我', avatar: '🧑', content: commentText.trim(), time: getNowStr(), rating: commentRating, likes: 0, replies: [] }] }
    }))
    setCommentText('')
    setCommentRating(5)
    onAction('发表项目留言')
  }

  const likeComment = (projId: string, commentId: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c) }
    }))
  }

  const addReply = (projId: string, commentId: number) => {
    if (!replyText.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, comments: p.comments.map(c => c.id === commentId
        ? { ...c, replies: [...c.replies, { id: Date.now(), author: '我', avatar: '🧑', content: replyText.trim(), time: getNowStr() }] }
        : c
      )}
    }))
    setReplyText('')
    setReplyingTo(null)
    onAction('发表项目留言')
  }

  const sendChat = (projId: string) => {
    if (!chatText.trim()) return
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, chatMsgs: [...p.chatMsgs, { id: Date.now(), author: '我', avatar: '🧑', content: chatText.trim(), time: getNowStr(), type: 'text' as const }] }
    }))
    setChatText('')
    onAction('发表项目留言')
  }

  const submitRating = (projId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projId) return p
      return { ...p, dimRatings: [...p.dimRatings, {
        id: Date.now(), author: '我', avatar: '🧑', time: getNowStr().split(' ')[0],
        quality: rQuality, progress: rProgress, teamwork: rTeamwork, communication: rComm, overall: rOverall, comment: rComment.trim()
      }] }
    }))
    setRQuality(5); setRProgress(5); setRTeamwork(5); setRComm(5); setROverall(5); setRComment('')
    setShowRatingForm(false)
    onAction('发表项目留言')
  }

  const deleteProject = (projId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projId))
    if (selectedProject === projId) setSelectedProject(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中': return 'bg-blue-500/20 text-blue-400'
      case '已完成': return 'bg-green-500/20 text-green-400'
      case '待启动': return 'bg-amber-500/20 text-amber-400'
      case '暂停': return 'bg-red-500/20 text-red-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
      case '高': return 'text-red-400'
      case '中': return 'text-amber-400'
      case '低': return 'text-green-400'
      default: return 'text-slate-400'
    }
  }

  const getDaysLeft = (deadline: string) => {
    if (deadline === '待定') return '待定'
    const d = new Date(deadline)
    const now = new Date()
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return `已超期${-diff}天`
    if (diff === 0) return '今天截止'
    return `剩余${diff}天`
  }

  const avgRating = (comments: Comment[]) => {
    if (comments.length === 0) return 0
    return (comments.reduce((s, c) => s + c.rating, 0) / comments.length).toFixed(1)
  }

  return (
    <div className="flex gap-6">
      {/* Project List */}
      <div className="w-96 space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">项目列表</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{projects.length} 个项目</span>
            <button onClick={() => setShowNewForm(true)}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all">
              ➕ 新建
            </button>
          </div>
        </div>

        {projects.map(proj => (
          <div
            key={proj.id}
            onClick={() => { setSelectedProject(proj.id); setDetailTab('info') }}
            className={`glass-card p-4 cursor-pointer transition-all hover:scale-[1.01] group relative ${
              selectedProject === proj.id ? 'ring-1 ring-blue-500/50 glow-blue' : ''
            }`}
          >
            <button onClick={e => { e.stopPropagation(); deleteProject(proj.id) }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="删除">✕</button>
            <div className="flex items-start gap-3">
              <div className="text-2xl">{proj.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-sm truncate">{proj.name}</h4>
                  <span className={`text-[10px] font-bold ${getPriorityColor(proj.priority)}`}>{proj.priority}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(proj.status)}`}>{proj.status}</span>
                  <span className="text-[10px] text-slate-500">{getDaysLeft(proj.deadline)}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {proj.roles.slice(0, 3).map((r, i) => (
                    <span key={i} className="text-xs" title={`${r.name} - ${r.role}`}>{r.avatar}</span>
                  ))}
                  {proj.roles.length > 3 && <span className="text-[10px] text-slate-500">+{proj.roles.length - 3}</span>}
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${proj.progress === 100 ? 'bg-green-500' : 'progress-bar'}`}
                    style={{ width: `${proj.progress}%` }} />
                </div>
                <div className="text-right text-[10px] text-slate-500 mt-1">{proj.progress}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail */}
      <div className="flex-1 min-w-0">
        {selectedProj ? (
          <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{selectedProj.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{selectedProj.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedProj.description}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(selectedProj.status)}`}>{selectedProj.status}</span>
                    <span className={`text-xs font-bold ${getPriorityColor(selectedProj.priority)}`}>优先级: {selectedProj.priority}</span>
                    <span className="text-xs text-slate-500">📅 创建: {selectedProj.createdAt}</span>
                    <span className="text-xs text-slate-500">⏰ 截止: {selectedProj.deadline}</span>
                    <span className={`text-xs font-mono ${getDaysLeft(selectedProj.deadline).includes('超期') ? 'text-red-400' : 'text-blue-400'}`}>
                      {getDaysLeft(selectedProj.deadline)}
                    </span>
                  </div>
                </div>
              </div>
              {/* 进度总览 */}
              <div className="grid grid-cols-4 gap-3 mt-3">
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{selectedProj.progress}%</div>
                  <div className="text-[10px] text-slate-500">完成进度</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{selectedProj.estimatedDays}<span className="text-xs text-slate-500">天</span></div>
                  <div className="text-[10px] text-slate-500">预计工期</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{selectedProj.roles.length}<span className="text-xs text-slate-500">人</span></div>
                  <div className="text-[10px] text-slate-500">参与人员</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-amber-400">{'⭐'.repeat(Math.round(Number(avgRating(selectedProj.comments)) || 0))}</div>
                  <div className="text-[10px] text-slate-500">评分 {avgRating(selectedProj.comments) || '-'}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-800/40 rounded-xl p-1">
              {([
                { id: 'info' as const, label: '👥 角色分工', },
                { id: 'milestone' as const, label: '🏁 里程碑' },
                { id: 'keynote' as const, label: '📌 关键点' },
                { id: 'comments' as const, label: '💬 交流留言' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setDetailTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    detailTab === tab.id ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-white'
                  }`}>{tab.label}</button>
              ))}
            </div>

            {/* Tab: 角色分工 */}
            {detailTab === 'info' && (
              <div className="glass-card p-6 animate-fade-in">
                <h4 className="font-semibold text-white mb-4">👥 项目角色分工</h4>
                {selectedProj.roles.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-sm">暂未分配角色</div>
                ) : (
                  <div className="space-y-3">
                    {selectedProj.roles.map((r, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/40">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">{r.avatar}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm">{r.name}</div>
                          <div className="text-xs text-slate-400">{r.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: 里程碑 */}
            {detailTab === 'milestone' && (
              <div className="glass-card p-6 animate-fade-in">
                <h4 className="font-semibold text-white mb-4">🏁 项目里程碑</h4>
                <div className="space-y-3">
                  {selectedProj.milestones.map((ms, i) => (
                    <div key={i} onClick={() => toggleMilestone(selectedProj.id, i)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${ms.done ? 'bg-green-500/10' : 'bg-slate-800/40 hover:bg-slate-800/60'}`}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs transition-all ${ms.done ? 'bg-green-500/30 border-green-500 text-green-400' : 'border-slate-600'}`}>
                        {ms.done && '✓'}
                      </div>
                      <span className={`text-sm ${ms.done ? 'text-green-400 line-through' : 'text-white'}`}>{ms.name}</span>
                      <span className="ml-auto text-xs text-slate-500">步骤 {i + 1}/{selectedProj.milestones.length}</span>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${selectedProj.progress === 100 ? 'bg-green-500' : 'progress-bar'}`}
                      style={{ width: `${selectedProj.progress}%` }} />
                  </div>
                  <div className="text-right text-xs text-slate-500 mt-1">{selectedProj.milestones.filter(m => m.done).length}/{selectedProj.milestones.length} 已完成</div>
                </div>
              </div>
            )}

            {/* Tab: 关键点 */}
            {detailTab === 'keynote' && (
              <div className="glass-card p-6 animate-fade-in">
                <h4 className="font-semibold text-white mb-4">📌 关键记录</h4>
                <div className="space-y-2 mb-4">
                  {selectedProj.keyNotes.length === 0 && <div className="text-center py-4 text-slate-500 text-sm">暂无关键记录</div>}
                  {selectedProj.keyNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/40 group">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span className="text-sm text-slate-300 flex-1">{note}</span>
                      <button onClick={() => setProjects(prev => prev.map(p => p.id !== selectedProj.id ? p : { ...p, keyNotes: p.keyNotes.filter((_, idx) => idx !== i) }))}
                        className="text-[10px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">删除</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addNote(selectedProj.id)}
                    placeholder="记录关键点、难点或重要策略..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                  <button onClick={() => addNote(selectedProj.id)}
                    className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">添加</button>
                </div>
              </div>
            )}

            {/* Tab: 交流留言 */}
            {detailTab === 'comments' && (
              <div className="space-y-4 animate-fade-in">
                {/* Sub Tabs */}
                <div className="flex gap-1 bg-slate-800/40 rounded-xl p-1">
                  {([
                    { id: 'messages' as const, label: '📝 留言板', count: selectedProj.comments.length },
                    { id: 'chat' as const, label: '💬 实时交流', count: selectedProj.chatMsgs.filter(m => m.type === 'text').length },
                    { id: 'rating' as const, label: '⭐ 项目评分', count: selectedProj.dimRatings.length },
                  ]).map(st => (
                    <button key={st.id} onClick={() => setCommSubTab(st.id)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        commSubTab === st.id ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'
                      }`}>
                      {st.label}
                      {st.count > 0 && <span className="text-[10px] bg-slate-700/60 px-1.5 py-0.5 rounded-full">{st.count}</span>}
                    </button>
                  ))}
                </div>

                {/* 留言板 */}
                {commSubTab === 'messages' && (
                  <div className="glass-card p-6">
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {selectedProj.comments.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">暂无留言，快来发表第一条留言吧</div>}
                      {selectedProj.comments.map(c => (
                        <div key={c.id} className="p-4 rounded-xl bg-slate-800/40">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0">{c.avatar}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-white text-sm">{c.author}</span>
                                  <span className="text-[10px] text-slate-500">{c.time}</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={`text-xs ${i < c.rating ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{c.content}</p>
                              <div className="flex items-center gap-4">
                                <button onClick={() => likeComment(selectedProj.id, c.id)}
                                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-400 transition-all">
                                  ❤️ <span>{c.likes}</span>
                                </button>
                                <button onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText('') }}
                                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-all">
                                  💬 回复 {c.replies.length > 0 && <span>({c.replies.length})</span>}
                                </button>
                              </div>
                              {/* 回复列表 */}
                              {c.replies.length > 0 && (
                                <div className="mt-3 ml-2 border-l-2 border-slate-700/50 pl-3 space-y-2">
                                  {c.replies.map(r => (
                                    <div key={r.id} className="flex items-start gap-2">
                                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs flex-shrink-0">{r.avatar}</div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs font-semibold text-white">{r.author}</span>
                                          <span className="text-[10px] text-slate-600">{r.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-400">{r.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* 回复输入 */}
                              {replyingTo === c.id && (
                                <div className="flex gap-2 mt-3">
                                  <input value={replyText} onChange={e => setReplyText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addReply(selectedProj.id, c.id)}
                                    placeholder="输入回复..."
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-600/50 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
                                  <button onClick={() => addReply(selectedProj.id, c.id)}
                                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs hover:bg-purple-500/30 transition-all">发送</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* 发表留言 */}
                    <div className="border-t border-slate-700/50 pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">评分:</span>
                        {Array.from({ length: 5 }, (_, i) => (
                          <button key={i} onClick={() => setCommentRating(i + 1)}
                            className={`text-lg transition-all ${i < commentRating ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}>★</button>
                        ))}
                        <span className="text-xs text-amber-400 ml-1">{commentRating}分</span>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addComment(selectedProj.id)}
                          placeholder="发表项目评论或建议..."
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50" />
                        <button onClick={() => addComment(selectedProj.id)}
                          className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/30 transition-colors">发送</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 实时交流 */}
                {commSubTab === 'chat' && (
                  <div className="glass-card p-6">
                    <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                      {selectedProj.chatMsgs.length === 0 && <div className="text-center py-8 text-slate-500 text-sm">暂无交流记录</div>}
                      {selectedProj.chatMsgs.map(msg => (
                        msg.type === 'system' ? (
                          <div key={msg.id} className="text-center">
                            <span className="text-[10px] text-slate-500 bg-slate-800/40 px-3 py-1 rounded-full">🤖 {msg.content} · {msg.time}</span>
                          </div>
                        ) : (
                          <div key={msg.id} className={`flex gap-3 ${msg.author === '我' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                              msg.author === '我' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                            }`}>{msg.avatar}</div>
                            <div className={`max-w-[70%] ${msg.author === '我' ? 'text-right' : ''}`}>
                              <div className={`flex items-center gap-2 mb-0.5 ${msg.author === '我' ? 'justify-end' : ''}`}>
                                <span className="text-xs font-semibold text-white">{msg.author}</span>
                                <span className="text-[10px] text-slate-600">{msg.time}</span>
                              </div>
                              <div className={`inline-block px-3 py-2 rounded-xl text-sm ${
                                msg.author === '我'
                                  ? 'bg-blue-500/20 text-blue-100 rounded-tr-sm'
                                  : 'bg-slate-800/60 text-slate-300 rounded-tl-sm'
                              }`}>{msg.content}</div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    <div className="flex gap-2 border-t border-slate-700/50 pt-4">
                      <input type="text" value={chatText} onChange={e => setChatText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendChat(selectedProj.id)}
                        placeholder="输入消息..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                      <button onClick={() => sendChat(selectedProj.id)}
                        className="px-5 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors">发送</button>
                    </div>
                  </div>
                )}

                {/* 项目评分 */}
                {commSubTab === 'rating' && (
                  <div className="glass-card p-6">
                    {/* 评分总览 */}
                    {selectedProj.dimRatings.length > 0 && (
                      <div className="mb-6 p-4 rounded-xl bg-slate-800/40">
                        <h5 className="text-sm font-semibold text-white mb-3">📊 综合评分总览</h5>
                        <div className="grid grid-cols-5 gap-3">
                          {[
                            { label: '质量', key: 'quality' as const, emoji: '🎯' },
                            { label: '进度', key: 'progress' as const, emoji: '📈' },
                            { label: '协作', key: 'teamwork' as const, emoji: '🤝' },
                            { label: '沟通', key: 'communication' as const, emoji: '💬' },
                            { label: '总评', key: 'overall' as const, emoji: '⭐' },
                          ].map(dim => {
                            const avg = selectedProj.dimRatings.reduce((s, r) => s + r[dim.key], 0) / selectedProj.dimRatings.length
                            return (
                              <div key={dim.key} className="text-center">
                                <div className="text-lg mb-1">{dim.emoji}</div>
                                <div className="text-xl font-bold text-amber-400">{avg.toFixed(1)}</div>
                                <div className="text-[10px] text-slate-400">{dim.label}</div>
                                <div className="h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(avg / 5) * 100}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* 评分记录 */}
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-sm font-semibold text-white">📝 评分记录 ({selectedProj.dimRatings.length})</h5>
                      <button onClick={() => setShowRatingForm(!showRatingForm)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all">
                        ➕ 提交评分
                      </button>
                    </div>

                    {/* 新增评分表单 */}
                    {showRatingForm && (
                      <div className="mb-4 p-4 rounded-xl bg-slate-800/60 border border-amber-500/20 space-y-3">
                        <h5 className="text-xs font-semibold text-amber-400 text-center">为项目各维度打分 (1-5星)</h5>
                        {[
                          { label: '🎯 质量', val: rQuality, set: setRQuality },
                          { label: '📈 进度', val: rProgress, set: setRProgress },
                          { label: '🤝 协作', val: rTeamwork, set: setRTeamwork },
                          { label: '💬 沟通', val: rComm, set: setRComm },
                          { label: '⭐ 总评', val: rOverall, set: setROverall },
                        ].map(dim => (
                          <div key={dim.label} className="flex items-center gap-3">
                            <span className="text-xs text-slate-300 w-16">{dim.label}</span>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <button key={i} onClick={() => dim.set(i + 1)}
                                  className={`text-base transition-all ${i < dim.val ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}>★</button>
                              ))}
                            </div>
                            <span className="text-xs text-amber-400">{dim.val}分</span>
                          </div>
                        ))}
                        <input value={rComment} onChange={e => setRComment(e.target.value)}
                          placeholder="补充评价（可选）..."
                          className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-600/50 text-white text-xs focus:outline-none focus:border-amber-500/50" />
                        <div className="flex gap-2">
                          <button onClick={() => setShowRatingForm(false)}
                            className="flex-1 py-2 rounded-lg text-xs text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
                          <button onClick={() => submitRating(selectedProj.id)}
                            className="flex-1 py-2 rounded-lg text-xs text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all">提交评分</button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedProj.dimRatings.length === 0 && !showRatingForm && (
                        <div className="text-center py-8 text-slate-500 text-sm">暂无评分记录，点击「提交评分」进行评价</div>
                      )}
                      {selectedProj.dimRatings.map(r => (
                        <div key={r.id} className="p-3 rounded-xl bg-slate-800/40">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-sm">{r.avatar}</div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-white">{r.author}</span>
                              <span className="text-[10px] text-slate-500 ml-2">{r.time}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <span key={i} className={`text-xs ${i < r.overall ? 'text-amber-400' : 'text-slate-600'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 mb-2">
                            {[
                              { label: '质量', val: r.quality }, { label: '进度', val: r.progress },
                              { label: '协作', val: r.teamwork }, { label: '沟通', val: r.communication }, { label: '总评', val: r.overall },
                            ].map(d => (
                              <div key={d.label} className="text-center">
                                <div className="text-xs text-amber-400 font-bold">{d.val}</div>
                                <div className="text-[10px] text-slate-500">{d.label}</div>
                              </div>
                            ))}
                          </div>
                          {r.comment && <p className="text-xs text-slate-400 italic">"{r.comment}"</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-white mb-2">选择一个项目查看详情</h3>
            <p className="text-slate-400 text-sm">点击左侧项目卡片，或点击「新建」创建新项目</p>
          </div>
        )}
      </div>

      {/* 新建项目弹窗 */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowNewForm(false)}>
          <div className="glass-card p-6 w-[560px] max-h-[85vh] overflow-y-auto space-y-4 border border-slate-600/50" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center">🆕 新建项目</h3>

            {/* 基本信息 */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">选择图标</label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_LIST.map(em => (
                  <button key={em} onClick={() => setNEmoji(em)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                      nEmoji === em ? 'bg-blue-500/30 border-2 border-blue-400 scale-110' : 'bg-slate-800/40 border border-slate-700/50 hover:border-slate-500'
                    }`}>{em}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">项目名称 *</label>
              <input value={nName} onChange={e => setNName(e.target.value)} placeholder="如：华梦AR体验平台"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">项目描述</label>
              <textarea value={nDesc} onChange={e => setNDesc(e.target.value)} placeholder="简要描述项目内容..."
                rows={2} className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">截止日期</label>
                <input type="date" value={nDeadline} onChange={e => setNDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">预计工期（天）</label>
                <input type="number" value={nEstDays} onChange={e => setNEstDays(Number(e.target.value))} min={1}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">优先级</label>
                <select value={nPriority} onChange={e => setNPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="高">🔴 高</option>
                  <option value="中">🟡 中</option>
                  <option value="低">🟢 低</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">状态</label>
                <select value={nStatus} onChange={e => setNStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="待启动">待启动</option>
                  <option value="进行中">进行中</option>
                  <option value="暂停">暂停</option>
                </select>
              </div>
            </div>

            {/* 角色分配 */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">角色分配</label>
              <div className="space-y-2 mb-2">
                {nRoles.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                    <span>{r.avatar}</span>
                    <span className="text-sm text-white">{r.name}</span>
                    <span className="text-xs text-slate-400">- {r.role}</span>
                    <button onClick={() => setNRoles(prev => prev.filter((_, idx) => idx !== i))}
                      className="ml-auto text-[10px] text-red-400">移除</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <select value={nRoleMember} onChange={e => setNRoleMember(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="">选择成员</option>
                  {MEMBER_OPTIONS.map(m => <option key={m.name} value={m.name}>{m.avatar} {m.name}</option>)}
                </select>
                <select value={nRoleTitle} onChange={e => setNRoleTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50">
                  <option value="">选择职责</option>
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button onClick={() => {
                  if (!nRoleMember || !nRoleTitle) return
                  const mem = MEMBER_OPTIONS.find(m => m.name === nRoleMember)
                  if (!mem) return
                  setNRoles(prev => [...prev, { name: mem.name, role: nRoleTitle, avatar: mem.avatar }])
                  setNRoleMember(''); setNRoleTitle('')
                }} className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/30 transition-all">添加</button>
              </div>
            </div>

            {/* 里程碑 */}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">关键里程碑</label>
              <div className="space-y-2">
                {nMilestones.map((ms, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={ms} onChange={e => { const arr = [...nMilestones]; arr[i] = e.target.value; setNMilestones(arr) }}
                      placeholder={`步骤 ${i + 1}，如：需求分析`}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-blue-500/50" />
                    {nMilestones.length > 1 && (
                      <button onClick={() => setNMilestones(prev => prev.filter((_, idx) => idx !== i))}
                        className="text-xs text-red-400 px-2">删除</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setNMilestones(prev => [...prev, ''])}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-all">+ 添加步骤</button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => { resetNewForm(); setShowNewForm(false) }}
                className="flex-1 py-2.5 rounded-lg text-sm text-slate-400 bg-slate-800/60 hover:bg-slate-700/60 transition-all">取消</button>
              <button onClick={createProject} disabled={!nName.trim()}
                className="flex-1 py-2.5 rounded-lg text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all disabled:opacity-30">创建项目</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
