import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRole, updateRolePermissions } from '@/lib/rbac'

// 获取所有角色
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
            groupRoles: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(roles)
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json({ error: '获取角色列表失败' }, { status: 500 })
  }
}

// 创建角色
export async function POST(req: NextRequest) {
  try {
    const { name, displayName, description, permissionIds } = await req.json()

    if (!name || !displayName) {
      return NextResponse.json(
        { error: '角色名称和显示名称不能为空' },
        { status: 400 }
      )
    }

    const role = await createRole({
      name,
      displayName,
      description,
      permissionIds,
    })

    return NextResponse.json(role, { status: 201 })
  } catch (error: any) {
    console.error('创建角色失败:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '角色名称已存在' }, { status: 409 })
    }
    return NextResponse.json({ error: '创建角色失败' }, { status: 500 })
  }
}

// 更新角色
export async function PUT(req: NextRequest) {
  try {
    const { id, name, displayName, description, permissionIds } = await req.json()

    if (!id) {
      return NextResponse.json({ error: '角色ID不能为空' }, { status: 400 })
    }

    // 检查是否为系统角色
    const role = await prisma.role.findUnique({ where: { id } })
    if (role?.isSystem) {
      return NextResponse.json(
        { error: '系统角色不能修改' },
        { status: 403 }
      )
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        displayName,
        description,
      },
    })

    if (permissionIds) {
      await updateRolePermissions(id, permissionIds)
    }

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error('更新角色失败:', error)
    return NextResponse.json({ error: '更新角色失败' }, { status: 500 })
  }
}

// 删除角色
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '角色ID不能为空' }, { status: 400 })
    }

    // 检查是否为系统角色
    const role = await prisma.role.findUnique({ where: { id } })
    if (role?.isSystem) {
      return NextResponse.json(
        { error: '系统角色不能删除' },
        { status: 403 }
      )
    }

    await prisma.role.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除角色失败:', error)
    return NextResponse.json({ error: '删除角色失败' }, { status: 500 })
  }
}
