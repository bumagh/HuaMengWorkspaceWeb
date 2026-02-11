import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { quality, progress, teamwork, communication, overall, comment, authorId, projectId } = await req.json()
    if (!authorId || !projectId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }
    const rating = await prisma.rating.create({
      data: {
        quality: quality || 5,
        progress: progress || 5,
        teamwork: teamwork || 5,
        communication: communication || 5,
        overall: overall || 5,
        comment: comment || '',
        authorId,
        projectId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    })
    return NextResponse.json(rating, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '提交评分失败' }, { status: 500 })
  }
}
