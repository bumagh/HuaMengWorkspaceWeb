import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { text, projectId } = await req.json()
    if (!text || !projectId) return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    const note = await prisma.keyNote.create({
      data: { text, projectId },
    })
    return NextResponse.json(note, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '添加关键记录失败' }, { status: 500 })
  }
}
