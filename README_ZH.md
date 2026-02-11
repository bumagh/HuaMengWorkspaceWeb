# 花梦办公管理系统

基于 Next.js、TypeScript 和 Prisma 构建的现代化办公管理和数据可视化 Web 应用程序。

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 14 (React 18)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: 自定义组件配合 Framer Motion 动画
- **图标**: Lucide React
- **图表**: Recharts 数据可视化

### 后端与数据库
- **数据库**: SQLite（开发环境），PostgreSQL（生产环境推荐）
- **ORM**: Prisma 5
- **身份验证**: bcryptjs 密码加密
- **API**: Next.js API 路由

### 开发工具
- **包管理器**: npm
- **构建工具**: Next.js 内置打包器
- **代码质量**: TypeScript 严格模式
- **数据库迁移**: Prisma Migrate

## 📁 项目结构

```
HuaMengWorkspaceWeb/
├── src/                    # 应用源代码
│   ├── app/               # Next.js App Router 页面
│   ├── components/        # 可复用 React 组件
│   └── lib/              # 工具函数和配置
├── prisma/                # 数据库模式和迁移
│   ├── schema.prisma     # 数据库模式定义
│   ├── migrations/       # 数据库迁移文件
│   └── seed.ts          # 数据库种子脚本
├── public/               # 静态资源
├── .next/               # Next.js 构建输出（自动生成）
├── node_modules/        # 依赖包（自动生成）
└── 配置文件
```

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd HuaMengWorkspaceWeb
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **设置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件配置
   ```

4. **设置数据库**
   ```bash
   # 生成 Prisma 客户端
   npx prisma generate
   
   # 运行数据库迁移
   npx prisma migrate dev
   
   # 数据库种子数据（可选）
   npm run seed
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

   在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📋 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run seed` - 数据库种子数据

## 🗄️ 数据库模式

应用使用 Prisma，包含以下主要实体：

- **用户** - 用户管理和身份验证
- **[根据您的模式添加其他实体]**

查看完整模式：
```bash
npx prisma studio
```

## 🔧 配置

### 环境变量
创建 `.env.local` 文件，包含以下变量：

```env
# 数据库
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# 根据需要添加其他环境变量
```

### 数据库配置

**开发环境**: 默认使用 SQLite (`file:./dev.db`)

**生产环境**: 推荐使用 PostgreSQL：
```env
DATABASE_URL="postgresql://username:password@localhost:5432/huameng_db"
```

## 🚀 部署

### Vercel（推荐）
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 连接您的仓库
3. 在 Vercel 控制台配置环境变量
4. Git 推送时自动部署

### Docker 部署
1. **创建 Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   
   RUN npx prisma generate
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **创建 docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/huameng
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=huameng
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **部署**
   ```bash
   docker-compose up -d
   ```

### 传统服务器部署
1. **构建应用**
   ```bash
   npm run build
   ```

2. **设置生产数据库**
   ```bash
   npx prisma migrate deploy
   ```

3. **启动应用**
   ```bash
   npm start
   ```

## 🔒 安全考虑

- 环境变量永不提交到版本控制
- 密码使用 bcryptjs 加密
- 数据库连接使用安全连接字符串
- 启用 Next.js 内置安全头

## 🧪 测试

```bash
# 运行测试（已实现时）
npm test

# 运行测试覆盖率
npm run test:coverage
```

## 📊 性能优化

- Next.js 自动代码分割
- Next.js Image 组件图片优化
- 生产环境 Tailwind CSS 清理
- Prisma 数据库查询优化

## 🔍 监控和调试

### 开发工具
- **Prisma Studio**: `npx prisma studio`
- **Next.js 开发工具**: 内置开发服务器调试
- **React DevTools**: 浏览器 React 调试扩展

### 生产监控
- 考虑集成 Vercel Analytics
- 设置错误追踪（Sentry 等）
- 监控数据库性能

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📝 许可证

本项目基于 MIT 许可证 - 查看 LICENSE 文件了解详情。

## 📞 支持

如需支持和问题咨询：
- 在 GitHub 仓库中创建 issue
- 联系开发团队

---

**使用 Next.js、TypeScript 和 Prisma 构建 ❤️**
