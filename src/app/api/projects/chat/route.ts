import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { text, type, authorId, projectId } = await req.json()
    if (!text || !authorId || !projectId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const msg = await prisma.chatMessage.create({
      data: { text, type: type || 'user', authorId, projectId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    })
    return NextResponse.json(msg, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '发送消息失败' }, { status: 500 })
  }
}
