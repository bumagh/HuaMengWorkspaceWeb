import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, password, role, avatar } = await req.json()
    if (!name || !password || !role) {
      return NextResponse.json({ error: '请填写所有必填项' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码长度至少6位' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { name } })
    if (existing) {
      return NextResponse.json({ error: '该用户名已存在' }, { status: 409 })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, password: hashed, role, avatar: avatar || '👤' },
    })
    const { password: _, ...safeUser } = user
    return NextResponse.json(safeUser, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: '注册失败' }, { status: 500 })
  }
}
