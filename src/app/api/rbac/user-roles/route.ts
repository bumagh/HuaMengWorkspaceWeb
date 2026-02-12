import { NextRequest, NextResponse } from 'next/server'
import { assignRoleToUser, removeRoleFromUser, getUserPermissions } from '@/lib/rbac'
import { prisma } from '@/lib/prisma'

// 获取用户的角色和权限
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
    }

    // 获取用户的直接角色
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

    // 获取用户的权限列表
    const permissions = await getUserPermissions(userId)

    return NextResponse.json({
      roles: userRoles.map((ur) => ur.role),
      permissions,
    })
  } catch (error) {
    console.error('获取用户角色失败:', error)
    return NextResponse.json({ error: '获取用户角色失败' }, { status: 500 })
  }
}

// 为用户分配角色
export async function POST(req: NextRequest) {
  try {
    const { userId, roleId } = await req.json()

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: '用户ID和角色ID不能为空' },
        { status: 400 }
      )
    }

    const userRole = await assignRoleToUser(userId, roleId)

    return NextResponse.json(userRole, { status: 201 })
  } catch (error: any) {
    console.error('分配角色失败:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '用户已拥有该角色' }, { status: 409 })
    }
    return NextResponse.json({ error: '分配角色失败' }, { status: 500 })
  }
}

// 移除用户角色
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const roleId = searchParams.get('roleId')

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: '用户ID和角色ID不能为空' },
        { status: 400 }
      )
    }

    await removeRoleFromUser(userId, roleId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('移除角色失败:', error)
    return NextResponse.json({ error: '移除角色失败' }, { status: 500 })
  }
}
