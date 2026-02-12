import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedRBAC() {
  console.log('🔐 开始初始化 RBAC 权限系统...')

  // 1. 创建权限
  const permissions = [
    // 用户管理权限
    { name: 'user:create', displayName: '创建用户', resource: 'user', action: 'create', description: '创建新用户账户' },
    { name: 'user:read', displayName: '查看用户', resource: 'user', action: 'read', description: '查看用户信息' },
    { name: 'user:update', displayName: '更新用户', resource: 'user', action: 'update', description: '修改用户信息' },
    { name: 'user:delete', displayName: '删除用户', resource: 'user', action: 'delete', description: '删除用户账户' },
    { name: 'user:manage', displayName: '管理用户', resource: 'user', action: 'manage', description: '完全管理用户' },

    // 项目管理权限
    { name: 'project:create', displayName: '创建项目', resource: 'project', action: 'create', description: '创建新项目' },
    { name: 'project:read', displayName: '查看项目', resource: 'project', action: 'read', description: '查看项目信息' },
    { name: 'project:update', displayName: '更新项目', resource: 'project', action: 'update', description: '修改项目信息' },
    { name: 'project:delete', displayName: '删除项目', resource: 'project', action: 'delete', description: '删除项目' },
    { name: 'project:manage', displayName: '管理项目', resource: 'project', action: 'manage', description: '完全管理项目' },

    // 战略管理权限
    { name: 'strategy:create', displayName: '创建战略', resource: 'strategy', action: 'create', description: '创建战略目标' },
    { name: 'strategy:read', displayName: '查看战略', resource: 'strategy', action: 'read', description: '查看战略信息' },
    { name: 'strategy:update', displayName: '更新战略', resource: 'strategy', action: 'update', description: '修改战略信息' },
    { name: 'strategy:delete', displayName: '删除战略', resource: 'strategy', action: 'delete', description: '删除战略' },
    { name: 'strategy:manage', displayName: '管理战略', resource: 'strategy', action: 'manage', description: '完全管理战略' },

    // 财务管理权限
    { name: 'finance:read', displayName: '查看财务', resource: 'finance', action: 'read', description: '查看财务数据' },
    { name: 'finance:update', displayName: '更新财务', resource: 'finance', action: 'update', description: '修改财务数据' },
    { name: 'finance:manage', displayName: '管理财务', resource: 'finance', action: 'manage', description: '完全管理财务' },

    // 积分管理权限
    { name: 'points:read', displayName: '查看积分', resource: 'points', action: 'read', description: '查看积分信息' },
    { name: 'points:update', displayName: '更新积分', resource: 'points', action: 'update', description: '修改积分' },
    { name: 'points:manage', displayName: '管理积分', resource: 'points', action: 'manage', description: '完全管理积分' },

    // 数据分析权限
    { name: 'analytics:read', displayName: '查看分析', resource: 'analytics', action: 'read', description: '查看数据分析' },
    { name: 'analytics:manage', displayName: '管理分析', resource: 'analytics', action: 'manage', description: '管理数据分析' },

    // 聊天权限
    { name: 'chat:read', displayName: '查看聊天', resource: 'chat', action: 'read', description: '查看聊天记录' },
    { name: 'chat:create', displayName: '发送消息', resource: 'chat', action: 'create', description: '发送聊天消息' },
    { name: 'chat:manage', displayName: '管理聊天', resource: 'chat', action: 'manage', description: '管理聊天系统' },

    // 公告权限
    { name: 'announcement:read', displayName: '查看公告', resource: 'announcement', action: 'read', description: '查看公告' },
    { name: 'announcement:create', displayName: '创建公告', resource: 'announcement', action: 'create', description: '发布公告' },
    { name: 'announcement:manage', displayName: '管理公告', resource: 'announcement', action: 'manage', description: '管理公告系统' },

    // 系统设置权限
    { name: 'settings:read', displayName: '查看设置', resource: 'settings', action: 'read', description: '查看系统设置' },
    { name: 'settings:manage', displayName: '管理设置', resource: 'settings', action: 'manage', description: '管理系统设置' },
  ]

  console.log('📝 创建权限...')
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: perm,
      create: perm,
    })
  }
  console.log(`✅ 已创建 ${permissions.length} 个权限`)

  // 2. 创建角色
  console.log('👥 创建角色...')

  // 超级管理员角色 - 拥有所有权限
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      displayName: '超级管理员',
      description: '拥有系统所有权限',
      isSystem: true,
    },
  })

  // 管理员角色 - 大部分管理权限
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      displayName: '管理员',
      description: '拥有大部分管理权限',
      isSystem: true,
    },
  })

  // 经理角色 - 项目和团队管理权限
  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      displayName: '经理',
      description: '拥有项目和团队管理权限',
      isSystem: true,
    },
  })

  // 成员角色 - 基本权限
  const memberRole = await prisma.role.upsert({
    where: { name: 'member' },
    update: {},
    create: {
      name: 'member',
      displayName: '成员',
      description: '普通团队成员',
      isSystem: true,
    },
  })

  // 访客角色 - 只读权限
  const guestRole = await prisma.role.upsert({
    where: { name: 'guest' },
    update: {},
    create: {
      name: 'guest',
      displayName: '访客',
      description: '只读访问权限',
      isSystem: true,
    },
  })

  console.log('✅ 已创建 5 个系统角色')

  // 3. 为角色分配权限
  console.log('🔗 分配角色权限...')

  // 获取所有权限
  const allPermissions = await prisma.permission.findMany()

  // 超级管理员 - 所有权限
  await prisma.rolePermission.deleteMany({ where: { roleId: superAdminRole.id } })
  await prisma.rolePermission.createMany({
    data: allPermissions.map(p => ({
      roleId: superAdminRole.id,
      permissionId: p.id,
    })),
  })

  // 管理员 - 除系统设置外的所有管理权限
  const adminPermissions = allPermissions.filter(p => 
    p.action === 'manage' && p.resource !== 'settings' ||
    p.action === 'read'
  )
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } })
  await prisma.rolePermission.createMany({
    data: adminPermissions.map(p => ({
      roleId: adminRole.id,
      permissionId: p.id,
    })),
  })

  // 经理 - 项目、战略、团队相关权限
  const managerPermissions = allPermissions.filter(p => 
    ['project', 'strategy', 'chat', 'announcement'].includes(p.resource) &&
    ['read', 'create', 'update', 'manage'].includes(p.action) ||
    p.resource === 'analytics' && p.action === 'read' ||
    p.resource === 'user' && p.action === 'read'
  )
  await prisma.rolePermission.deleteMany({ where: { roleId: managerRole.id } })
  await prisma.rolePermission.createMany({
    data: managerPermissions.map(p => ({
      roleId: managerRole.id,
      permissionId: p.id,
    })),
  })

  // 成员 - 基本读写权限
  const memberPermissions = allPermissions.filter(p => 
    ['project', 'chat', 'announcement'].includes(p.resource) &&
    ['read', 'create', 'update'].includes(p.action) ||
    p.resource === 'user' && p.action === 'read'
  )
  await prisma.rolePermission.deleteMany({ where: { roleId: memberRole.id } })
  await prisma.rolePermission.createMany({
    data: memberPermissions.map(p => ({
      roleId: memberRole.id,
      permissionId: p.id,
    })),
  })

  // 访客 - 只读权限
  const guestPermissions = allPermissions.filter(p => p.action === 'read')
  await prisma.rolePermission.deleteMany({ where: { roleId: guestRole.id } })
  await prisma.rolePermission.createMany({
    data: guestPermissions.map(p => ({
      roleId: guestRole.id,
      permissionId: p.id,
    })),
  })

  console.log('✅ 角色权限分配完成')

  // 4. 为现有用户分配默认角色
  console.log('👤 为现有用户分配角色...')
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    // 检查用户是否已有角色
    const existingRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
    })

    if (existingRoles.length === 0) {
      // 根据 isAdmin 字段分配角色
      const roleToAssign = user.isAdmin ? superAdminRole : memberRole
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: roleToAssign.id,
        },
      })
      console.log(`  ✓ 为用户 ${user.name} 分配角色: ${roleToAssign.displayName}`)
    }
  }

  console.log('✅ RBAC 权限系统初始化完成！')
}

seedRBAC()
  .catch((e) => {
    console.error('❌ RBAC 初始化失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
