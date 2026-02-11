import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        milestones: true,
        keyNotes: { orderBy: { createdAt: 'desc' } },
        comments: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            replies: {
              include: { author: { select: { id: true, name: true, avatar: true } } },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        chatMessages: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
        ratings: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(projects)
  } catch (e) {
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, startDate, endDate, priority, creatorId, members, roles, milestones } = body
    if (!name || !creatorId) {
      return NextResponse.json({ error: '项目名称和创建者不能为空' }, { status: 400 })
    }
    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        startDate: startDate || '',
        endDate: endDate || '',
        priority: priority || '中',
        creatorId,
        members: members || '',
        roles: roles || '[]',
        milestones: {
          create: (milestones || []).map((m: string) => ({ name: m, done: false })),
        },
        chatMessages: {
          create: {
            text: `项目「${name}」已创建`,
            type: 'system',
            authorId: creatorId,
          },
        },
      },
      include: {
        creator: { select: { id: true, name: true, avatar: true } },
        milestones: true,
        keyNotes: true,
        comments: true,
        chatMessages: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
        },
        ratings: true,
      },
    })
    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '创建项目失败' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    if (!id) return NextResponse.json({ error: '缺少项目ID' }, { status: 400 })
    const project = await prisma.project.update({
      where: { id },
      data,
    })
    return NextResponse.json(project)
  } catch (e) {
    return NextResponse.json({ error: '更新项目失败' }, { status: 500 })
  }
}
