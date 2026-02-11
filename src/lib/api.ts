const BASE = '/api'

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || '请求失败')
  return data
}

// Auth
export const api = {
  login: (name: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ name, password }) }),

  register: (data: { name: string; password: string; role: string; avatar?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  logout: (userId: string) =>
    request('/auth/logout', { method: 'POST', body: JSON.stringify({ userId }) }),

  // Users
  getUsers: () => request('/users'),
  updateUser: (data: Record<string, unknown>) =>
    request('/users', { method: 'PUT', body: JSON.stringify(data) }),

  // Projects
  getProjects: () => request('/projects'),
  createProject: (data: Record<string, unknown>) =>
    request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (data: Record<string, unknown>) =>
    request('/projects', { method: 'PUT', body: JSON.stringify(data) }),

  // Comments
  addComment: (data: { text: string; rating: number; authorId: string; projectId: string }) =>
    request('/projects/comments', { method: 'POST', body: JSON.stringify(data) }),
  likeComment: (id: string) =>
    request('/projects/comments', { method: 'PUT', body: JSON.stringify({ id, action: 'like' }) }),

  // Replies
  addReply: (data: { text: string; authorId: string; commentId: string }) =>
    request('/projects/replies', { method: 'POST', body: JSON.stringify(data) }),

  // Chat
  sendChat: (data: { text: string; type?: string; authorId: string; projectId: string }) =>
    request('/projects/chat', { method: 'POST', body: JSON.stringify(data) }),

  // Ratings
  submitRating: (data: Record<string, unknown>) =>
    request('/projects/ratings', { method: 'POST', body: JSON.stringify(data) }),

  // Milestones
  toggleMilestone: (id: string, done: boolean) =>
    request('/projects/milestones', { method: 'PUT', body: JSON.stringify({ id, done }) }),
  addMilestone: (name: string, projectId: string) =>
    request('/projects/milestones', { method: 'POST', body: JSON.stringify({ name, projectId }) }),

  // Key Notes
  addKeyNote: (text: string, projectId: string) =>
    request('/projects/keynotes', { method: 'POST', body: JSON.stringify({ text, projectId }) }),

  // Points
  getPoints: (userId: string) => request(`/points?userId=${userId}`),
  addPoints: (data: { action: string; points: number; userId: string }) =>
    request('/points', { method: 'POST', body: JSON.stringify(data) }),

  // Announcements
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (data: { title: string; content: string }) =>
    request('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  updateAnnouncement: (data: { id: string; title: string; content: string }) =>
    request('/announcements', { method: 'PUT', body: JSON.stringify(data) }),
  deleteAnnouncement: (id: string) =>
    request('/announcements', { method: 'DELETE', body: JSON.stringify({ id }) }),

  // Strategy
  getStrategyItems: () => request('/strategy'),
  createStrategyItem: (data: Record<string, unknown>) =>
    request('/strategy', { method: 'POST', body: JSON.stringify(data) }),
  updateStrategyItem: (data: Record<string, unknown>) =>
    request('/strategy', { method: 'PUT', body: JSON.stringify(data) }),
  deleteStrategyItem: (id: string) =>
    request('/strategy', { method: 'DELETE', body: JSON.stringify({ id }) }),
}
