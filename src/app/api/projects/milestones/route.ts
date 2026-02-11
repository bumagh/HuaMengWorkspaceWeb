import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const { id, done } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少里程碑ID' }, { status: 400 })
    const milestone = await prisma.milestone.update({
      where: { id },
      data: { done },
    })
    return NextResponse.json(milestone)
  } catch (e) {
    return NextResponse.json({ error: '更新里程碑失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, projectId } = await req.json()
    if (!name || !projectId) return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    const milestone = await prisma.milestone.create({
      data: { name, projectId },
    })
    return NextResponse.json(milestone, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '创建里程碑失败' }, { status: 500 })
  }
}
