import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { text, authorId, commentId } = await req.json()
    if (!text || !authorId || !commentId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const reply = await prisma.reply.create({
      data: { text, authorId, commentId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    })
    return NextResponse.json(reply, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '回复失败' }, { status: 500 })
  }
}
