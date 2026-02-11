import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { text, rating, authorId, projectId } = await req.json()
    if (!text || !authorId || !projectId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const comment = await prisma.comment.create({
      data: { text, rating: rating || 5, authorId, projectId },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        replies: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
        },
      },
    })
    return NextResponse.json(comment, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '发表留言失败' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, action } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少留言ID' }, { status: 400 })
    if (action === 'like') {
      const comment = await prisma.comment.update({
        where: { id },
        data: { likes: { increment: 1 } },
      })
      return NextResponse.json(comment)
    }
    return NextResponse.json({ error: '无效操作' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
