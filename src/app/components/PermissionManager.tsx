'use client'

import { useState, useEffect } from 'react'
import { UserProfile } from '../page'
import { api } from '@/lib/api'
import { Shield, Users, Lock, UserPlus, Trash2, Edit, Plus, X } from 'lucide-react'

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  isSystem: boolean
  rolePermissions: Array<{
    permission: {
      id: string
      name: string
      displayName: string
      resource: string
      action: string
    }
  }>
  _count: {
    userRoles: number
    groupRoles: number
  }
}

interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  resource: string
  action: string
}

interface UserGroup {
  id: string
  name: string
  displayName: string
  description: string
  creator: {
    id: string
    name: string
    avatar: string
  }
  members: Array<{
    user: {
      id: string
      name: string
      avatar: string
      role: string
    }
  }>
  roles: Array<{
    role: {
      id: string
      name: string
      displayName: string
    }
  }>
  _count: {
    members: number
    roles: number
  }
}

export default function PermissionManager({ user, users }: { user: UserProfile; users: UserProfile[] }) {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'groups' | 'users'>('roles')
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(false)

  // 角色管理状态
  const [showRoleForm, setShowRoleForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleName, setRoleName] = useState('')
  const [roleDisplayName, setRoleDisplayName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // 用户组管理状态
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDisplayName, setGroupDisplayName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectedGroupRoles, setSelectedGroupRoles] = useState<string[]>([])

  // 用户角色管理状态
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [userRoles, setUserRoles] = useState<Role[]>([])

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'roles' || activeTab === 'users') {
        const rolesData = await api.getRoles()
        setRoles(rolesData)
      }
      if (activeTab === 'permissions' || activeTab === 'roles') {
        const permsData = await api.getPermissions()
        setPermissions(permsData)
      }
      if (activeTab === 'groups') {
        const groupsData = await api.getUserGroups()
        setGroups(groupsData)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRole = async () => {
    if (!roleName || !roleDisplayName) return

    try {
      await api.createRole({
        name: roleName,
        displayName: roleDisplayName,
        description: roleDescription,
        permissionIds: selectedPermissions,
      })
      setShowRoleForm(false)
      resetRoleForm()
      loadData()
    } catch (error: any) {
      alert(error.message || '创建角色失败')
    }
  }

  const handleUpdateRole = async () => {
    if (!editingRole) return

    try {
      await api.updateRole({
        id: editingRole.id,
        name: roleName,
        displayName: roleDisplayName,
        description: roleDescription,
        permissionIds: selectedPermissions,
      })
      setEditingRole(null)
      resetRoleForm()
      loadData()
    } catch (error: any) {
      alert(error.message || '更新角色失败')
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('确定要删除此角色吗？')) return

    try {
      await api.deleteRole(roleId)
      loadData()
    } catch (error: any) {
      alert(error.message || '删除角色失败')
    }
  }

  const resetRoleForm = () => {
    setRoleName('')
    setRoleDisplayName('')
    setRoleDescription('')
    setSelectedPermissions([])
  }

  const handleCreateGroup = async () => {
    if (!groupName || !groupDisplayName) return

    try {
      await api.createUserGroup({
        name: groupName,
        displayName: groupDisplayName,
        description: groupDescription,
        creatorId: user.id,
        memberIds: selectedMembers,
        roleIds: selectedGroupRoles,
      })
      setShowGroupForm(false)
      resetGroupForm()
      loadData()
    } catch (error: any) {
      alert(error.message || '创建用户组失败')
    }
  }

  const resetGroupForm = () => {
    setGroupName('')
    setGroupDisplayName('')
    setGroupDescription('')
    setSelectedMembers([])
    setSelectedGroupRoles([])
  }

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await api.assignRoleToUser({ userId, roleId })
      if (selectedUser?.id === userId) {
        loadUserRoles(userId)
      }
    } catch (error: any) {
      alert(error.message || '分配角色失败')
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      await api.removeRoleFromUser(userId, roleId)
      if (selectedUser?.id === userId) {
        loadUserRoles(userId)
      }
    } catch (error: any) {
      alert(error.message || '移除角色失败')
    }
  }

  const loadUserRoles = async (userId: string) => {
    try {
      const data = await api.getUserRoles(userId)
      setUserRoles(data.roles)
    } catch (error) {
      console.error('加载用户角色失败:', error)
    }
  }

  const handleSelectUser = (u: UserProfile) => {
    setSelectedUser(u)
    loadUserRoles(u.id)
  }

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = []
    }
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🔐 权限管理中心</h2>
            <p className="text-slate-400">管理系统角色、权限和用户组</p>
          </div>
          <Shield className="w-16 h-16 text-purple-400 opacity-50" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'roles', label: '角色管理', icon: Shield },
          { id: 'permissions', label: '权限管理', icon: Lock },
          { id: 'groups', label: '用户组', icon: Users },
          { id: 'users', label: '用户角色', icon: UserPlus },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'text-slate-400 hover:bg-slate-800/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="glass-card p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400">加载中...</div>
        ) : (
          <>
            {/* 角色管理 */}
            {activeTab === 'roles' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">系统角色</h3>
                  <button
                    onClick={() => setShowRoleForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    创建角色
                  </button>
                </div>

                {showRoleForm && (
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">
                        {editingRole ? '编辑角色' : '创建新角色'}
                      </h4>
                      <button
                        onClick={() => {
                          setShowRoleForm(false)
                          setEditingRole(null)
                          resetRoleForm()
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="角色名称 (英文，如: manager)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <input
                      value={roleDisplayName}
                      onChange={(e) => setRoleDisplayName(e.target.value)}
                      placeholder="显示名称 (中文，如: 经理)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <textarea
                      value={roleDescription}
                      onChange={(e) => setRoleDescription(e.target.value)}
                      placeholder="角色描述"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">选择权限</label>
                      <div className="max-h-60 overflow-y-auto space-y-2 p-3 rounded-lg bg-slate-900/60">
                        {Object.entries(groupedPermissions).map(([resource, perms]) => (
                          <div key={resource} className="space-y-1">
                            <div className="text-xs font-medium text-purple-400 uppercase">{resource}</div>
                            {perms.map((perm) => (
                              <label key={perm.id} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedPermissions.includes(perm.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedPermissions([...selectedPermissions, perm.id])
                                    } else {
                                      setSelectedPermissions(selectedPermissions.filter(id => id !== perm.id))
                                    }
                                  }}
                                  className="rounded"
                                />
                                {perm.displayName} ({perm.action})
                              </label>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={editingRole ? handleUpdateRole : handleCreateRole}
                      disabled={!roleName || !roleDisplayName}
                      className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all disabled:opacity-30"
                    >
                      {editingRole ? '更新角色' : '创建角色'}
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all border border-slate-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{role.displayName}</h4>
                            <span className="text-xs text-slate-500">({role.name})</span>
                            {role.isSystem && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">系统</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{role.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>👥 {role._count.userRoles} 用户</span>
                            <span>🔑 {role.rolePermissions.length} 权限</span>
                          </div>
                        </div>
                        {!role.isSystem && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingRole(role)
                                setRoleName(role.name)
                                setRoleDisplayName(role.displayName)
                                setRoleDescription(role.description)
                                setSelectedPermissions(role.rolePermissions.map(rp => rp.permission.id))
                                setShowRoleForm(true)
                              }}
                              className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 权限管理 */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">系统权限</h3>
                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                  <div key={resource} className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-400 uppercase">{resource}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <div
                          key={perm.id}
                          className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
                        >
                          <div className="font-medium text-white text-sm">{perm.displayName}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {perm.resource}:{perm.action}
                          </div>
                          {perm.description && (
                            <div className="text-xs text-slate-400 mt-1">{perm.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 用户组管理 */}
            {activeTab === 'groups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">用户组</h3>
                  <button
                    onClick={() => setShowGroupForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    创建用户组
                  </button>
                </div>

                {showGroupForm && (
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">创建新用户组</h4>
                      <button
                        onClick={() => {
                          setShowGroupForm(false)
                          resetGroupForm()
                        }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="组名称 (英文)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <input
                      value={groupDisplayName}
                      onChange={(e) => setGroupDisplayName(e.target.value)}
                      placeholder="显示名称 (中文)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="组描述"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-600/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                    />
                    <button
                      onClick={handleCreateGroup}
                      disabled={!groupName || !groupDisplayName}
                      className="w-full px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all disabled:opacity-30"
                    >
                      创建用户组
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all border border-slate-700/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{group.displayName}</h4>
                          <p className="text-sm text-slate-400 mb-2">{group.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>👥 {group._count.members} 成员</span>
                            <span>🔑 {group._count.roles} 角色</span>
                            <span>创建者: {group.creator.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 用户角色管理 */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">选择用户</h3>
                  <div className="space-y-2">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelectUser(u)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedUser?.id === u.id
                            ? 'bg-purple-500/20 border border-purple-500/30'
                            : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{u.avatar}</span>
                          <div>
                            <div className="font-medium text-white">{u.name}</div>
                            <div className="text-xs text-slate-400">{u.role}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {selectedUser ? (
                    <>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {selectedUser.name} 的角色
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-400">已分配角色</h4>
                          {userRoles.length > 0 ? (
                            userRoles.map((role) => (
                              <div
                                key={role.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30"
                              >
                                <div>
                                  <div className="font-medium text-white text-sm">{role.displayName}</div>
                                  <div className="text-xs text-slate-500">{role.description}</div>
                                </div>
                                {!role.isSystem && (
                                  <button
                                    onClick={() => handleRemoveRole(selectedUser.id, role.id)}
                                    className="p-1 rounded text-red-400 hover:bg-red-500/20"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-slate-500 text-center py-4">暂无角色</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-slate-400">分配新角色</h4>
                          {roles
                            .filter((r) => !userRoles.some((ur) => ur.id === r.id))
                            .map((role) => (
                              <button
                                key={role.id}
                                onClick={() => handleAssignRole(selectedUser.id, role.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30 transition-all"
                              >
                                <div className="text-left">
                                  <div className="font-medium text-white text-sm">{role.displayName}</div>
                                  <div className="text-xs text-slate-500">{role.description}</div>
                                </div>
                                <Plus className="w-4 h-4 text-green-400" />
                              </button>
                            ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      请选择一个用户查看其角色
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
