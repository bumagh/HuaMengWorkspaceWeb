import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.strategyItem.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: '获取战略条目失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, progress, category, status } = await req.json()
    if (!title) return NextResponse.json({ error: '缺少标题' }, { status: 400 })
    const item = await prisma.strategyItem.create({
      data: { title, description: description || '', progress: progress || 0, category: category || '目标', status: status || '进行中' },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '创建战略条目失败' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少条目ID' }, { status: 400 })
    const item = await prisma.strategyItem.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (e) {
    return NextResponse.json({ error: '更新战略条目失败' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少条目ID' }, { status: 400 })
    await prisma.strategyItem.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: '删除战略条目失败' }, { status: 500 })
  }
}
