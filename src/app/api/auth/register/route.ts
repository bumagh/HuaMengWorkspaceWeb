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
    
    try {
      const existing = await prisma.user.findUnique({ where: { name } })
      if (existing) {
        return NextResponse.json({ error: '该用户名已存在' }, { status: 409 })
      }
    } catch (dbError) {
      console.error('Database query error:', dbError)
      return NextResponse.json({ error: '数据库连接失败，请稍后重试' }, { status: 500 })
    }
    
    try {
      const hashed = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { name, password: hashed, role, avatar: avatar || '👤' },
      })
      const { password: _, ...safeUser } = user
      return NextResponse.json(safeUser, { status: 201 })
    } catch (createError) {
      console.error('User creation error:', createError)
      return NextResponse.json({ error: '创建用户失败，请稍后重试' }, { status: 500 })
    }
  } catch (e) {
    console.error('Registration error:', e)
    return NextResponse.json({ error: '注册请求处理失败' }, { status: 500 })
  }
}
