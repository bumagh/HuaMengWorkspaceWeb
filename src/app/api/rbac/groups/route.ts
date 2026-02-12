import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createUserGroup, addUserToGroup, removeUserFromGroup } from '@/lib/rbac'

// 获取所有用户组
export async function GET() {
  try {
    const groups = await prisma.userGroup.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
          },
        },
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            roles: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(groups)
  } catch (error) {
    console.error('获取用户组列表失败:', error)
    return NextResponse.json({ error: '获取用户组列表失败' }, { status: 500 })
  }
}

// 创建用户组
export async function POST(req: NextRequest) {
  try {
    const { name, displayName, description, creatorId, memberIds, roleIds } =
      await req.json()

    if (!name || !displayName || !creatorId) {
      return NextResponse.json(
        { error: '用户组信息不完整' },
        { status: 400 }
      )
    }

    const group = await createUserGroup({
      name,
      displayName,
      description,
      creatorId,
      memberIds,
      roleIds,
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error: any) {
    console.error('创建用户组失败:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '用户组名称已存在' }, { status: 409 })
    }
    return NextResponse.json({ error: '创建用户组失败' }, { status: 500 })
  }
}

// 更新用户组
export async function PUT(req: NextRequest) {
  try {
    const { id, name, displayName, description } = await req.json()

    if (!id) {
      return NextResponse.json({ error: '用户组ID不能为空' }, { status: 400 })
    }

    const updatedGroup = await prisma.userGroup.update({
      where: { id },
      data: {
        name,
        displayName,
        description,
      },
    })

    return NextResponse.json(updatedGroup)
  } catch (error) {
    console.error('更新用户组失败:', error)
    return NextResponse.json({ error: '更新用户组失败' }, { status: 500 })
  }
}

// 删除用户组
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '用户组ID不能为空' }, { status: 400 })
    }

    await prisma.userGroup.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除用户组失败:', error)
    return NextResponse.json({ error: '删除用户组失败' }, { status: 500 })
  }
}
