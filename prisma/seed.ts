import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 清空数据
  await prisma.reply.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.chatMessage.deleteMany()
  await prisma.rating.deleteMany()
  await prisma.milestone.deleteMany()
  await prisma.keyNote.deleteMany()
  await prisma.pointRecord.deleteMany()
  await prisma.project.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.strategyItem.deleteMany()
  await prisma.user.deleteMany()

  // 创建默认用户
  const tangtang = await prisma.user.create({
    data: {
      id: 'tangtang',
      name: '糖糖',
      password: await bcrypt.hash('tangtang888', 10),
      role: 'CEO',
      avatar: '👑',
      level: 15,
      xp: 80,
      maxXp: 300,
      isAdmin: true,
      isOnline: true,
      status: '在线',
    },
  })

  const yinggongfu = await prisma.user.create({
    data: {
      id: 'yinggongfu',
      name: '硬功夫',
      password: await bcrypt.hash('yinggongfu666', 10),
      role: '华梦技术总监',
      avatar: '💻',
      level: 12,
      xp: 50,
      maxXp: 250,
      isAdmin: true,
      isOnline: true,
      status: '在线',
    },
  })

  const xiaobai = await prisma.user.create({
    data: {
      id: 'xiaobai',
      name: '小白',
      password: await bcrypt.hash('xiaobai520', 10),
      role: '运营总监',
      avatar: '📢',
      level: 10,
      xp: 30,
      maxXp: 200,
      isAdmin: true,
      isOnline: false,
      status: '离线',
    },
  })

  // 创建示例项目
  const project1 = await prisma.project.create({
    data: {
      name: '华梦官网重构',
      description: '全面重构公司官网，提升用户体验',
      progress: 65,
      status: '进行中',
      priority: '高',
      startDate: '2026-01-15',
      endDate: '2026-04-30',
      creatorId: tangtang.id,
      members: '糖糖,硬功夫,小白',
      roles: JSON.stringify([
        { name: '糖糖', role: '项目负责人' },
        { name: '硬功夫', role: '技术负责' },
        { name: '小白', role: '运营推广' },
      ]),
    },
  })

  // 项目里程碑
  await prisma.milestone.createMany({
    data: [
      { name: '需求分析', done: true, projectId: project1.id },
      { name: 'UI设计', done: true, projectId: project1.id },
      { name: '前端开发', done: false, projectId: project1.id },
      { name: '后端开发', done: false, projectId: project1.id },
      { name: '上线部署', done: false, projectId: project1.id },
    ],
  })

  // 项目关键笔记
  await prisma.keyNote.create({
    data: {
      text: '确认使用 Next.js + Tailwind 技术栈',
      projectId: project1.id,
    },
  })

  // 项目评论
  const comment1 = await prisma.comment.create({
    data: {
      text: '项目进展顺利，继续加油！',
      rating: 5,
      likes: 3,
      authorId: tangtang.id,
      projectId: project1.id,
    },
  })

  await prisma.reply.create({
    data: {
      text: '收到，会继续努力！',
      authorId: yinggongfu.id,
      commentId: comment1.id,
    },
  })

  // 聊天消息
  await prisma.chatMessage.createMany({
    data: [
      { text: '大家好，项目正式启动！', type: 'system', authorId: tangtang.id, projectId: project1.id },
      { text: '技术方案已经确定，准备开始开发', type: 'user', authorId: yinggongfu.id, projectId: project1.id },
      { text: '运营计划也准备好了', type: 'user', authorId: xiaobai.id, projectId: project1.id },
    ],
  })

  // 项目评分
  await prisma.rating.create({
    data: {
      quality: 5,
      progress: 4,
      teamwork: 5,
      communication: 4,
      overall: 5,
      comment: '团队协作很棒，继续保持',
      authorId: tangtang.id,
      projectId: project1.id,
    },
  })

  // 积分记录
  await prisma.pointRecord.createMany({
    data: [
      { action: '每日登录', points: 10, userId: tangtang.id },
      { action: '新建项目', points: 30, userId: tangtang.id },
      { action: '每日登录', points: 10, userId: yinggongfu.id },
    ],
  })

  // 公告
  await prisma.announcement.create({
    data: {
      title: '系统上线公告',
      content: '华梦办公宝系统正式上线！欢迎大家使用。',
    },
  })

  // 战略条目
  await prisma.strategyItem.createMany({
    data: [
      { title: 'Q1 营收目标', description: '完成第一季度500万营收', progress: 45, category: '财务', status: '进行中' },
      { title: '团队扩张', description: '技术团队扩招至20人', progress: 60, category: '人力', status: '进行中' },
      { title: '产品迭代', description: '完成3个核心产品版本迭代', progress: 33, category: '产品', status: '进行中' },
    ],
  })

  console.log('✅ 种子数据已成功写入数据库')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
