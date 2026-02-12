import { prisma } from './prisma'

// 权限资源定义
export const RESOURCES = {
  USER: 'user',
  PROJECT: 'project',
  STRATEGY: 'strategy',
  FINANCE: 'finance',
  POINTS: 'points',
  ANALYTICS: 'analytics',
  CHAT: 'chat',
  ANNOUNCEMENT: 'announcement',
  SETTINGS: 'settings',
} as const

// 权限操作定义
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const

// 预定义角色
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  GUEST: 'guest',
} as const

// 权限检查函数
export async function checkPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    // 获取用户的所有角色（直接分配 + 用户组）
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    // 获取用户所属用户组的角色
    const userGroups = await prisma.userGroupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    // 合并所有权限
    const allPermissions = new Set<string>()

    // 添加直接角色的权限
    userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        const perm = rp.permission
        if (perm.resource === resource && perm.action === action) {
          allPermissions.add(`${perm.resource}:${perm.action}`)
        }
        // 检查 manage 权限（包含所有操作）
        if (perm.resource === resource && perm.action === ACTIONS.MANAGE) {
          allPermissions.add(`${perm.resource}:${action}`)
        }
      })
    })

    // 添加用户组角色的权限
    userGroups.forEach((ug) => {
      ug.group.roles.forEach((gr) => {
        gr.role.rolePermissions.forEach((rp) => {
          const perm = rp.permission
          if (perm.resource === resource && perm.action === action) {
            allPermissions.add(`${perm.resource}:${perm.action}`)
          }
          if (perm.resource === resource && perm.action === ACTIONS.MANAGE) {
            allPermissions.add(`${perm.resource}:${action}`)
          }
        })
      })
    })

    return allPermissions.size > 0
  } catch (error) {
    console.error('权限检查失败:', error)
    return false
  }
}

// 获取用户所有权限
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    const userGroups = await prisma.userGroupMember.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    const permissions = new Set<string>()

    userRoles.forEach((ur) => {
      ur.role.rolePermissions.forEach((rp) => {
        permissions.add(`${rp.permission.resource}:${rp.permission.action}`)
      })
    })

    userGroups.forEach((ug) => {
      ug.group.roles.forEach((gr) => {
        gr.role.rolePermissions.forEach((rp) => {
          permissions.add(`${rp.permission.resource}:${rp.permission.action}`)
        })
      })
    })

    return Array.from(permissions)
  } catch (error) {
    console.error('获取用户权限失败:', error)
    return []
  }
}

// 为用户分配角色
export async function assignRoleToUser(userId: string, roleId: string) {
  return await prisma.userRole.create({
    data: { userId, roleId },
  })
}

// 移除用户角色
export async function removeRoleFromUser(userId: string, roleId: string) {
  return await prisma.userRole.deleteMany({
    where: { userId, roleId },
  })
}

// 创建角色
export async function createRole(data: {
  name: string
  displayName: string
  description?: string
  permissionIds?: string[]
}) {
  const role = await prisma.role.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      description: data.description || '',
    },
  })

  if (data.permissionIds && data.permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: data.permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      })),
    })
  }

  return role
}

// 更新角色权限
export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  // 删除现有权限
  await prisma.rolePermission.deleteMany({
    where: { roleId },
  })

  // 添加新权限
  if (permissionIds.length > 0) {
    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
    })
  }
}

// 创建用户组
export async function createUserGroup(data: {
  name: string
  displayName: string
  description?: string
  creatorId: string
  memberIds?: string[]
  roleIds?: string[]
}) {
  const group = await prisma.userGroup.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      description: data.description || '',
      creatorId: data.creatorId,
    },
  })

  if (data.memberIds && data.memberIds.length > 0) {
    await prisma.userGroupMember.createMany({
      data: data.memberIds.map((userId) => ({
        groupId: group.id,
        userId,
      })),
    })
  }

  if (data.roleIds && data.roleIds.length > 0) {
    await prisma.userGroupRole.createMany({
      data: data.roleIds.map((roleId) => ({
        groupId: group.id,
        roleId,
      })),
    })
  }

  return group
}

// 添加用户到组
export async function addUserToGroup(groupId: string, userId: string) {
  return await prisma.userGroupMember.create({
    data: { groupId, userId },
  })
}

// 从组中移除用户
export async function removeUserFromGroup(groupId: string, userId: string) {
  return await prisma.userGroupMember.deleteMany({
    where: { groupId, userId },
  })
}

// 为用户组分配角色
export async function assignRoleToGroup(groupId: string, roleId: string) {
  return await prisma.userGroupRole.create({
    data: { groupId, roleId },
  })
}

// 移除用户组角色
export async function removeRoleFromGroup(groupId: string, roleId: string) {
  return await prisma.userGroupRole.deleteMany({
    where: { groupId, roleId },
  })
}
