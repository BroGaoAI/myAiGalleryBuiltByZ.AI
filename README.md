# 🎨 AI 艺术画廊

使用火山引擎 doubao-seedream-4.0 模型创建 AI 艺术作品的在线画廊平台。

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2FF)
![火山引擎](https://img.shields.io/badge/火山引擎-doubao-orange)

## ✨ 特性

- 🎨 **AI 图像生成** - 使用火山引擎 doubao 模型
- 🖼️ **艺术画廊** - 响应式网格展示
- 🔍 **搜索和筛选** - 按类别和关键词搜索
- 💬 **评论功能** - 作品互动和反馈
- ⭐ **评分系统** - 1-5 星评分
- ❤️ **点赞功能** - 喜欢的作品收藏
- 📱 **响应式设计** - 移动端、平板、桌面
- 🌙 **现代 UI** - 基于 shadcn/ui 组件

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/ai-art-gallery.git
cd ai-art-gallery
```

### 2. 安装依赖

```bash
bun install
# 或
npm install
```

### 3. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入您的火山引擎 API Key
nano .env.local
```

**必需的环境变量：**

```env
VOLCENGINE_API_KEY=your_api_key_here
```

**获取 API Key：**
1. 访问 https://console.volcengine.com/
2. 注册/登录账号
3. 创建应用
4. 获取 API Key
5. 填入 `.env.local` 文件

### 4. 运行开发服务器

```bash
bun run dev
# 或
npm run dev
```

访问 http://localhost:3000

## 📖 使用说明

### 创建 AI 艺术作品

1. 点击"AI 创作生成"按钮
2. 输入描述提示词（例如："星际穿越，黑洞，电影大片"）
3. 选择艺术类别（抽象、肖像、风景等）
4. 选择艺术风格（写实、艺术、抽象等）
5. 点击"开始创作"
6. 等待图像生成（通常 5-15 秒）

### 浏览艺术画廊

- 查看所有 AI 生成的艺术作品
- 使用搜索框查找特定作品
- 使用分类下拉菜单筛选

### 作品互动

- 点击作品卡片查看大图和详情
- 发表评论
- 评分（1-5 星）
- 点赞

## 🔧 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **UI 组件**: shadcn/ui (New York)
- **AI 模型**: 火山引擎 doubao-seedream-4.0
- **数据库**: SQLite + Prisma ORM
- **图标**: Lucide React

## 📋 环境变量

| 变量 | 必需 | 默认值 | 说明 |
|------|------|---------|------|
| `VOLCENGINE_API_KEY` | ✅ 是 | - | 火山引擎 API Key |
| `VOLCENGINE_API_URL` | ❌ 否 | `https://ark.cn-beijing.volces.com/api/v3/images/generations` | API 端点 URL |
| `VOLCENGINE_MODEL` | ❌ 否 | `doubao-seedream-4-0-250828` | 模型名称 |

## 🌐 部署

### Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-art-gallery)

详细部署步骤请查看 [GitHub 部署指南](./GITHUB_DEPLOYMENT_GUIDE.md)

## 🔒 安全

- ✅ API 密钥使用环境变量
- ✅ `.env.local` 文件被 `.gitignore` 保护
- ✅ 提供 `.env.example` 作为模板
- ✅ 不在代码中硬编码敏感信息

## 📚 文档

- [火山引擎集成详情](./VOLCENGINE_INTEGRATION.md) - 完整的 API 说明和配置
- [快速参考](./QUICK_REFERENCE_VOLCENGINE.md) - 快速查找信息和使用示例
- [GitHub 部署指南](./GITHUB_DEPLOYMENT_GUIDE.md) - 详细的部署步骤
- [安全总结](./SECURITY_SUMMARY.md) - 安全措施和最佳实践

## 🤝 贡献

欢迎贡献！请：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🙏 致谢

- [火山引擎](https://www.volcengine.com/) - 提供强大的 doubao 模型
- [Next.js](https://nextjs.org/) - React 框架
- [shadcn/ui](https://ui.shadcn.com/) - 优秀的 UI 组件库

## 📞 支持

如有问题或建议，请：
- 创建 Issue
- 发起 Pull Request
- 联系维护者

---

**用火山引擎 doubao 模型创作无限艺术可能！** 🎨✨
