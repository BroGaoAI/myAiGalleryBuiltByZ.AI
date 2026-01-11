# AI 艺术画廊平台

一个基于 Next.js 15 和 AI 技术的在线艺术画廊平台，用户可以使用 AI 生成艺术作品并分享。

## ✨ 功能特性

### 🎨 AI 图像生成
- 集成 z-ai-web-dev-sdk 实现图像生成
- 支持多种艺术类别（抽象、肖像、风景、奇幻、科幻、动漫、摄影）
- 支持多种艺术风格（写实、艺术、抽象、极简、详细）
- 实时生成预览

### 🖼️ 艺术画廊
- 响应式网格布局展示所有艺术作品
- 按类别筛选作品
- 实时搜索功能
- 作品详情查看（大图展示）

### 💬 互动功能
- 评论系统
- 评分系统（1-5星）
- 点赞功能

### 🎯 技术栈
- **前端框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **UI组件**: shadcn/ui (New York style)
- **数据库**: SQLite + Prisma ORM
- **AI集成**: z-ai-web-dev-sdk
- **图标**: Lucide React

## 🚀 快速开始

### 访问应用
打开浏览器访问: `http://localhost:3000`

### 使用 AI 创作生成

1. 点击右上角的 **"AI 创作生成"** 按钮
2. 在弹出的对话框中：
   - 输入描述你想要创作的艺术作品的提示词
     - 例如："一个未来派的城市天际线，霓虹灯闪烁，赛博朋克风格"
   - 选择艺术类别（抽象、肖像、风景等）
   - 选择艺术风格（写实、艺术、抽象等）
3. 点击 **"开始创作"** 按钮
4. 等待 AI 生成图像（通常需要几秒钟）
5. 生成的图像会显示在对话框右侧
6. 图像自动保存到画廊中

### 浏览艺术作品

1. 在"艺术画廊"标签页查看所有作品
2. 使用顶部搜索框搜索特定作品
3. 使用分类下拉菜单筛选作品类别
4. 点击任意作品卡片查看详情

### 搜索和筛选
- **搜索**: 在顶部搜索框输入关键词
- **分类**: 使用下拉菜单选择特定类别
- 支持的类别：全部、抽象、肖像、风景、奇幻、科幻、动漫、摄影

### 查看作品详情
点击任意作品卡片可以：
- 查看大图
- 查看作品信息和创作提示词
- 查看作者信息
- 发表评论
- 给作品评分
- 点赞作品

## 📝 API 接口

### 生成图像
```typescript
POST /api/generate
Content-Type: application/json

{
  "prompt": "描述提示词",
  "category": "abstract",
  "style": "realistic",
  "width": 1024,
  "height": 1024
}
```

### 获取艺术作品列表
```typescript
GET /api/artworks
```

### 获取作品评论
```typescript
GET /api/artworks/:id/comments
```

### 添加评论
```typescript
POST /api/artworks/:id/comments
Content-Type: application/json

{
  "content": "评论内容",
  "userId": "用户ID"
}
```

### 评分作品
```typescript
POST /api/artworks/:id/rating
Content-Type: application/json

{
  "score": 5,
  "userId": "用户ID"
}
```

### 点赞作品
```typescript
POST /api/artworks/:id/like
```

## 🎨 提示词建议

为了获得更好的生成效果，建议提示词包含：
1. **主题**: 你想要看到的主要内容
2. **风格**: 艺术风格或摄影风格
3. **细节**: 特定的颜色、光线、情绪等
4. **质量**: 系统会自动添加 "high quality" 和 "detailed"

### 优质提示词示例
```
一个宁静的山间湖泊，日落时分，油画风格，温暖的金色光线，倒影清晰，风景画
```
```
赛博朋克风格的未来城市，霓虹灯闪烁，高楼大厦，雨夜，详细的城市景观
```
```
梦幻的森林仙境，发光的蘑菇，彩色蝴蝶，童话插画风格，柔和的光线
```

## 🔧 开发说明

### 项目结构
```
src/
├── app/
│   ├── api/
│   │   ├── artworks/          # 艺术作品API
│   │   │   ├── [id]/
│   │   │   │   ├── comments/  # 评论API
│   │   │   │   ├── like/     # 点赞API
│   │   │   │   └── rating/   # 评分API
│   │   │   └── route.ts      # 作品列表API
│   │   ├── auth/
│   │   │   └── session/      # 认证会话API
│   │   └── generate/         # AI生成API
│   ├── components/
│   │   └── ui/              # shadcn/ui组件
│   └── page.tsx             # 主页面
├── lib/
│   ├── db.ts                # 数据库客户端
│   └── utils.ts             # 工具函数
└── hooks/                   # React Hooks
```

### 数据库模型
- **User**: 用户信息
- **Artwork**: 艺术作品
- **Comment**: 评论
- **Rating**: 评分

### 运行开发服务器
```bash
bun run dev
```

### 代码检查
```bash
bun run lint
```

### 数据库迁移
```bash
bun run db:push
```

## 📱 响应式设计

平台采用移动优先的响应式设计：
- 📱 手机：单列布局
- 📱 平板：双列布局
- 💻 桌面：四列布局

## 🌙 暗黑模式

支持浅色/暗黑主题切换（可扩展）。

## 🎯 待实现功能

- [ ] 用户注册和登录系统
- [ ] 用户个人主页
- [ ] 作品收藏功能
- [ ] 社交分享功能
- [ ] 高级搜索和过滤
- [ ] 作品编辑和删除
- [ ] 批量生成功能
- [ ] 作品下载功能

## 📄 许可证

MIT License
