import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, role: true, avatar: true,
        level: true, xp: true, maxXp: true, isAdmin: true,
        isOnline: true, status: true, createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(users)
  } catch (e) {
    return NextResponse.json({ error: '获取用户列表失败' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true, name: true, role: true, avatar: true,
        level: true, xp: true, maxXp: true, isAdmin: true,
        isOnline: true, status: true, createdAt: true,
      },
    })
    return NextResponse.json(user)
  } catch (e) {
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 })
  }
}
