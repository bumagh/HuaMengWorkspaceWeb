import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有权限
export async function GET() {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        _count: {
          select: {
            rolePermissions: true,
          },
        },
      },
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' },
      ],
    })
    return NextResponse.json(permissions)
  } catch (error) {
    console.error('获取权限列表失败:', error)
    return NextResponse.json({ error: '获取权限列表失败' }, { status: 500 })
  }
}

// 创建权限
export async function POST(req: NextRequest) {
  try {
    const { name, displayName, description, resource, action } = await req.json()

    if (!name || !displayName || !resource || !action) {
      return NextResponse.json(
        { error: '权限信息不完整' },
        { status: 400 }
      )
    }

    const permission = await prisma.permission.create({
      data: {
        name,
        displayName,
        description: description || '',
        resource,
        action,
      },
    })

    return NextResponse.json(permission, { status: 201 })
  } catch (error: any) {
    console.error('创建权限失败:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '权限名称已存在' }, { status: 409 })
    }
    return NextResponse.json({ error: '创建权限失败' }, { status: 500 })
  }
}

// 删除权限
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '权限ID不能为空' }, { status: 400 })
    }

    await prisma.permission.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除权限失败:', error)
    return NextResponse.json({ error: '删除权限失败' }, { status: 500 })
  }
}
