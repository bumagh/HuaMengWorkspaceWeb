import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) return NextResponse.json({ error: '缺少用户ID' }, { status: 400 })
    const records = await prisma.pointRecord.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(records)
  } catch (e) {
    return NextResponse.json({ error: '获取积分记录失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, points, userId } = await req.json()
    if (!action || !points || !userId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const record = await prisma.pointRecord.create({
      data: { action, points, userId },
    })
    // 更新用户经验值
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      let newXp = user.xp + points
      let newLevel = user.level
      while (newXp >= user.maxXp) {
        newXp -= user.maxXp
        newLevel++
      }
      await prisma.user.update({
        where: { id: userId },
        data: { xp: newXp, level: newLevel },
      })
    }
    return NextResponse.json(record, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '记录积分失败' }, { status: 500 })
  }
}
