import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '华梦办公宝 - 游戏化项目管理平台',
  description: '香港华梦有限公司游戏化项目管理软件，整合内部资源，调配人手，结合开发生产需求。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="pixel-grid antialiased">
        {children}
      </body>
    </html>
  )
}
