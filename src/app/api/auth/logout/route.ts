import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (userId) {
      await prisma.user.update({ where: { id: userId }, data: { isOnline: false, status: '离线' } })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: '退出失败' }, { status: 500 })
  }
}
