# 🚀 快速开始 - AI 艺术画廊

## ✨ 立即开始

### 1. 配置 API Key

```bash
# 复制配置模板
cp .env.example .env.local

# 编辑文件，填入您的 API Key
nano .env.local
```

在 `.env.local` 中添加：
```env
VOLCENGINE_API_KEY=your_api_key_here
```

**获取 API Key**：
1. 访问 https://console.volcengine.com/
2. 注册/登录
3. 创建应用
4. 获取 API Key

### 2. 运行开发服务器

```bash
bun install
bun run dev
```

访问：http://localhost:3000/

---

## 🎨 使用新功能

### 创建 AI 艺术

1. 点击"AI 创作生成"
2. 输入提示词（例如："星际穿越，黑洞，电影大片"）
3. 选择类别和风格
4. 点击"开始创作"
5. 等待 5-15 秒

### 添加到画廊（新功能！）

1. 图像生成成功后，"**添加到我的画廊**"按钮会出现
2. 点击"添加到我的画廊"
3. 对话框自动关闭
4. 自动切换到"艺术画廊"标签
5. 新作品立即显示在画廊中

### 浏览画廊

- 查看所有作品
- 使用搜索框查找
- 使用分类下拉菜单筛选
- 点击作品查看详情

---

## 🔍 调试信息

### 查看生成过程

打开浏览器开发者工具（F12）→ Console 标签：

```
🌐 开始生成图像（火山引擎 doubao-seedream-4.0）...
📝 提示词: 星际穿越，黑洞
🎭 风格: realistic
📂 类别: sci-fi
✨ 增强后的提示词: 星际穿越，黑洞, photorealistic, sci-fi, ...
📏 请求尺寸: 2K
📡 调用火山引擎 doubao API...
🤖 模型: doubao-seedream-4.0-250828
✅ API响应已收到
📥 正在下载图像...
✅ 图像下载完成
💾 图像已保存到: /path/to/file.png
🔗 本地图像URL: /generated-images/...
🎨 图像生成成功！准备添加到画廊
添加到画廊按钮被点击
已切换到画廊标签页并刷新作品列表
```

---

## 📊 功能列表

### 核心功能
- ✅ AI 图像生成（火山引擎 doubao）
- ✅ 艺术画廊展示
- ✅ 搜索和筛选
- ✅ 作品详情查看

### 互动功能
- ✅ 评论系统
- ✅ 评分系统（1-5星）
- ✅ 点赞功能
- ✅ **添加到画廊（新）**

### 技术特性
- ✅ 响应式设计（移动端）
- ✅ 现代化 UI（shadcn/ui）
- ✅ TypeScript 类型安全
- ✅ 详细的日志输出

---

## 🚀 部署到 GitHub

### 准备部署

```bash
# 1. 确认 .env.local 已配置
cat .env.local

# 2. 检查 .gitignore（确保 API Key 不被提交）
cat .gitignore | grep .env

# 3. 提交代码
git add .
git commit -m "feat: AI 艺术画廊 - 完整版

- 集成火山引擎 doubao 模型
- 实现添加到画廊功能
- 使用环境变量管理 API Key
- 完整的 AI 艺术画廊功能
- 详细文档和说明"

# 4. 推送到 GitHub
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 部署到 Vercel

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 添加环境变量 `VOLCENGINE_API_KEY`
4. 点击 Deploy

---

## 🎯 快速测试

### 测试新功能

```bash
# 1. 启动服务器
bun run dev

# 2. 访问应用
open http://localhost:3000/

# 3. 测试流程
# - 生成图像
# - 点击"添加到我的画廊"
# - 在画廊中查看作品
```

---

## 📝 常见问题

### Q: 如何添加到画廊？

A: 图像生成成功后，点击"**添加到我的画廊**"按钮即可。

### Q: API Key 在哪里配置？

A:
1. 复制 `.env.example` 为 `.env.local`
2. 编辑 `.env.local`，填入 `VOLCENGINE_API_KEY`
3. 保存文件

### Q: 生成后能看到作品吗？

A: 点击"添加到我的画廊"后，会自动切换到"艺术画廊"标签，新作品会出现在最前面。

### Q: API Key 会提交到 GitHub 吗？

A: **不会**。`.env.local` 已在 `.gitignore` 中，不会被提交。

---

## 🔒 安全提醒

- ✅ `.env.local` 不会被提交到 GitHub
- ✅ API Key 使用环境变量
- ✅ 提供了 `.env.example` 作为模板
- ✅ 代码中有 API Key 检查

---

## 📚 详细文档

- [完整 README](./README.md)
- [GitHub 部署指南](./GITHUB_DEPLOYMENT_GUIDE.md)
- [安全总结](./SECURITY_SUMMARY.md)
- [火山引擎集成](./VOLCENGINE_INTEGRATION.md)
- [快速参考](./QUICK_REFERENCE_VOLCENGINE.md)
- [添加到画廊功能](./ADD_TO_GALLERY_FEATURE.md)

---

**开始使用您的 AI 艺术画廊吧！** 🎨✨

记住：配置 `.env.local` 文件，填入您的火山引擎 API Key！
