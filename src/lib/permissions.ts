import { checkPermission, RESOURCES, ACTIONS } from './rbac'

// 权限检查中间件
export async function requirePermission(
  userId: string,
  resource: string,
  action: string
): Promise<{ allowed: boolean; message?: string }> {
  const hasPermission = await checkPermission(userId, resource, action)
  
  if (!hasPermission) {
    return {
      allowed: false,
      message: `您没有权限执行此操作 (${resource}:${action})`,
    }
  }
  
  return { allowed: true }
}

// 常用权限检查快捷函数
export const Permissions = {
  // 用户管理权限
  canCreateUser: (userId: string) => 
    checkPermission(userId, RESOURCES.USER, ACTIONS.CREATE),
  canUpdateUser: (userId: string) => 
    checkPermission(userId, RESOURCES.USER, ACTIONS.UPDATE),
  canDeleteUser: (userId: string) => 
    checkPermission(userId, RESOURCES.USER, ACTIONS.DELETE),
  canManageUsers: (userId: string) => 
    checkPermission(userId, RESOURCES.USER, ACTIONS.MANAGE),

  // 项目管理权限
  canCreateProject: (userId: string) => 
    checkPermission(userId, RESOURCES.PROJECT, ACTIONS.CREATE),
  canUpdateProject: (userId: string) => 
    checkPermission(userId, RESOURCES.PROJECT, ACTIONS.UPDATE),
  canDeleteProject: (userId: string) => 
    checkPermission(userId, RESOURCES.PROJECT, ACTIONS.DELETE),
  canManageProjects: (userId: string) => 
    checkPermission(userId, RESOURCES.PROJECT, ACTIONS.MANAGE),

  // 财务管理权限
  canViewFinance: (userId: string) => 
    checkPermission(userId, RESOURCES.FINANCE, ACTIONS.READ),
  canManageFinance: (userId: string) => 
    checkPermission(userId, RESOURCES.FINANCE, ACTIONS.MANAGE),

  // 数据分析权限
  canViewAnalytics: (userId: string) => 
    checkPermission(userId, RESOURCES.ANALYTICS, ACTIONS.READ),

  // 系统设置权限
  canManageSettings: (userId: string) => 
    checkPermission(userId, RESOURCES.SETTINGS, ACTIONS.MANAGE),
}
