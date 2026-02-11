import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json()
    if (!name || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 })
    }
    const user = await prisma.user.findFirst({
      where: { OR: [{ name }, { id: name }] },
    })
    if (!user) {
      return NextResponse.json({ error: '账户不存在' }, { status: 404 })
    }
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 })
    }
    await prisma.user.update({ where: { id: user.id }, data: { isOnline: true, status: '在线' } })
    const { password: _, ...safeUser } = user
    return NextResponse.json(safeUser)
  } catch (e) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 })
  }
}
