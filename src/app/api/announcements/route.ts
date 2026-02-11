import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(announcements)
  } catch (e) {
    return NextResponse.json({ error: '获取公告失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json()
    if (!title || !content) return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    const ann = await prisma.announcement.create({ data: { title, content } })
    return NextResponse.json(ann, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '创建公告失败' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, content } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少公告ID' }, { status: 400 })
    const ann = await prisma.announcement.update({ where: { id }, data: { title, content } })
    return NextResponse.json(ann)
  } catch (e) {
    return NextResponse.json({ error: '更新公告失败' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少公告ID' }, { status: 400 })
    await prisma.announcement.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: '删除公告失败' }, { status: 500 })
  }
}
