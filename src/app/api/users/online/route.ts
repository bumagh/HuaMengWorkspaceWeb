import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        avatar: true,
        isOnline: true,
        status: true,
        level: true,
        xp: true,
        maxXp: true,
        isAdmin: true,
      },
      orderBy: [
        { isOnline: 'desc' },
        { name: 'asc' }
      ]
    })
    return NextResponse.json(users)
  } catch (e) {
    console.error('获取在线用户失败:', e)
    return NextResponse.json({ error: '获取在线用户失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, isOnline, status } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: '用户ID不能为空' }, { status: 400 })
    }

    const updateData: any = { isOnline }
    if (status) updateData.status = status

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('更新在线状态失败:', e)
    return NextResponse.json({ error: '更新在线状态失败' }, { status: 500 })
  }
}
