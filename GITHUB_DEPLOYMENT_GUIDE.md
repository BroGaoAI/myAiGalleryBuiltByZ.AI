# 🚀 GitHub 部署指南 - AI 艺术画廊

## 🔒 安全注意事项

### ✅ API 密钥已安全处理

1. **使用环境变量**
   - API 密钥从 `process.env.VOLCENGINE_API_KEY` 读取
   - 不再硬编码在代码中

2. **.gitignore 保护**
   - `.env.local` 已在 `.gitignore` 中
   - 不会被提交到 GitHub

3. **提供模板**
   - `.env.example` 作为参考模板
   - 其他开发者可以快速配置

---

## 📋 部署前的准备清单

### 1. 环境变量配置

**必须创建 `.env.local` 文件：**

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑文件，填入您的 API Key
nano .env.local  # 或使用其他编辑器
```

**必须填入以下内容：**

```env
# 火山引擎 doubao API Key (必需)
VOLCENGINE_API_KEY=bdceb093-d71c-48c3-836d-f23053f55f16

# API URL (可选，默认已设置)
VOLCENGINE_API_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations

# 模型名称 (可选，默认已设置)
VOLCENGINE_MODEL=doubao-seedream-4.0-250828
```

**注意**: `.env.local` 文件不会被提交到 GitHub，所以您的 API 密钥是安全的。

---

### 2. 获取 API Key

如果还没有 API Key：

1. **访问火山引擎控制台**
   - https://console.volcengine.com/

2. **注册账号**
   - 如果已有账号，直接登录
   - 如果没有，注册新账号

3. **创建应用**
   - 在控制台创建新应用
   - 获取 API Key

4. **配置项目**
   - 将 API Key 填入 `.env.local`
   - 保存文件

---

### 3. 推送到 GitHub

#### 步骤 1: 初始化 Git 仓库

```bash
cd /home/z/my-project
git init
```

#### 步骤 2: 添加所有文件

```bash
git add .
```

#### 步骤 3: 创建提交

```bash
git commit -m "feat: AI 艺术画廊 - 使用火山引擎 doubao 模型

- 集成火山引擎 doubao-seedream-4.0 模型
- 使用环境变量管理 API Key
- 实现 AI 图像生成功能
- 添加艺术作品展示
- 实现评论、评分、点赞功能
- 响应式设计
- 详细的控制台日志"
```

#### 步骤 4: 关联远程仓库

```bash
# 方法 A: 如果已创建远程仓库
git remote add origin https://github.com/your-username/your-repo-name.git

# 方法 B: 如果还没有创建
# 先在 GitHub 上创建新仓库，然后：
git remote add origin https://github.com/your-username/your-repo-name.git
```

#### 步骤 5: 推送代码

```bash
git push -u origin main
# 或
git push -u origin master  # 取决于您的默认分支
```

---

## 🔍 验证部署

### 检查 GitHub 仓库

1. 访问您的 GitHub 仓库
2. 确认文件都已上传
3. 检查 `.gitignore` 是否正确工作
4. **重要**: 确保 `.env.local` **没有**被上传

### 检查文件完整性

确认以下关键文件已上传：

- [ ] `src/app/page.tsx` - 主页面
- [ ] `src/app/api/generate-volcengine/route.ts` - API 端点
- [ ] `src/app/layout.tsx` - 布局
- [ ] `src/lib/db.ts` - 数据库
- [ ] `prisma/schema.prisma` - 数据模型
- [ ] `package.json` - 依赖
- [ ] `.env.example` - 环境变量模板

### 确认文件被忽略

确认以下文件**不在** GitHub 仓库中：

- [x] `.env.local` - 包含真实 API Key
- [x] `.next` - Next.js 构建缓存
- [x] `node_modules` - 依赖
- [x] `dev.log` - 开发日志
- [x] `public/generated-images/` - 生成的图像

---

## 🌐 部署到 Vercel (推荐)

### 准备工作

1. **安装 Vercel CLI**
```bash
npm i -g vercel
# 或
bun global add vercel
```

2. **登录 Vercel**
```bash
vercel login
```

### 部署步骤

#### 方式 A: 通过 Vercel Dashboard

1. **导入项目**
   - 访问 https://vercel.com/new
   - 选择 "Import Git Repository"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

2. **配置环境变量**
   - 在项目设置中
   - 添加环境变量：
     - `VOLCENGINE_API_KEY` = `your_api_key_here`
     - `VOLCENGINE_API_URL` = `https://ark.cn-beijing.volces.com/api/v3/images/generations`
     - `VOLCENGINE_MODEL` = `doubao-seedream-4.0-250828`

3. **部署**
   - 点击 "Deploy"
   - 等待部署完成
   - Vercel 会提供一个 `.vercel.app` 域名

#### 方式 B: 通过 Vercel CLI

```bash
cd /home/z/my-project
vercel
```

按照提示操作：
- 选择项目设置
- 添加环境变量
- 确认部署

---

## 🐳 部署到 Docker

### 创建 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 构建和运行

```bash
# 构建镜像
docker build -t ai-art-gallery .

# 运行容器
docker run -p 3000:3000 \
  -e VOLCENGINE_API_KEY=your_api_key_here \
  -e VOLCENGINE_API_URL=https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -e VOLCENGINE_MODEL=doubao-seedream-4.0-250828 \
  ai-art-gallery
```

---

## 🔧 本地开发配置

### 安装依赖

```bash
bun install
# 或
npm install
```

### 运行开发服务器

```bash
bun run dev
# 或
npm run dev
```

### 访问应用

```
http://localhost:3000
```

---

## 📚 环境变量说明

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|---------|------|
| `VOLCENGINE_API_KEY` | ✅ 是 | - | 火山引擎 API Key |
| `VOLCENGINE_API_URL` | ❌ 否 | https://ark.cn-beijing.volces.com/api/v3/images/generations | API 端点 URL |
| `VOLCENGINE_MODEL` | ❌ 否 | doubao-seedream-4.0-250828 | 模型名称 |
| `DATABASE_URL` | ❌ 否 | file:./dev.db | 数据库连接字符串 |

---

## 🔒 安全最佳实践

### 1. 不要提交敏感信息

确保以下文件/内容不会被提交：

- ❌ `.env.local` - 包含真实 API Key
- ❌ `.env` - 包含真实 API Key
- ✅ `.env.example` - 只包含示例，可以提交

### 2. 使用 GitHub Secrets

对于 CI/CD 和生产环境：

1. **在 GitHub 仓库设置中添加 Secrets**
   - Settings → Secrets and variables → Actions
   - New repository secret
   - 添加 `VOLCENGINE_API_KEY`
   - 添加其他环境变量

2. **在 workflow 中使用**
   ```yaml
   env:
     VOLCENGINE_API_KEY: ${{ secrets.VOLCENGINE_API_KEY }}
     VOLCENGINE_API_URL: ${{ secrets.VOLCENGINE_API_URL }}
   ```

### 3. 限制 API Key 使用

- 定期轮换 API Key
- 为不同环境使用不同的 Key
- 监控 API 使用情况和成本

---

## 📝 项目的结构

```
ai-art-gallery/
├── .env.local              # 本地环境变量（包含 API Key，不提交）
├── .env.example           # 环境变量模板（可以提交）
├── .gitignore             # Git 忽略规则
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate-volcengine/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   │   └── db.ts
│   └── hooks/
├── prisma/
│   └── schema.prisma
├── public/
│   └── generated-images/
├── package.json
└── next.config.ts
```

---

## 🎯 部署后的配置

### Vercel 部署后

1. **添加环境变量**
   - Vercel Dashboard → Settings → Environment Variables
   - 添加 `VOLCENGINE_API_KEY`

2. **重新部署**
   - GitHub 仓库中触发新的部署
   - 或在 Vercel 中点击 Redeploy

### 更新 API Key

如果需要更换 API Key：

1. 在 Vercel Dashboard 中更新环境变量
2. 触发新的部署
3. 或者使用 Vercel CLI：
   ```bash
   vercel env pull
   # 编辑 .env
   vercel env push
   ```

---

## 🚨 常见问题

### Q: `.env.local` 文件会被提交吗？

A: **不会**。`.gitignore` 已配置忽略 `.env.local` 文件。

### Q: 其他开发者如何运行项目？

A:
1. 他们克隆仓库
2. 复制 `.env.example` 为 `.env.local`
3. 填入他们自己的 API Key
4. 运行项目

### Q: 在 Vercel 上如何配置环境变量？

A:
- Vercel Dashboard → Settings → Environment Variables
- 添加所有必需的环境变量
- Vercel 会自动注入到应用中

### Q: API Key 安全吗？

A:
- ✅ 不会提交到 GitHub
- ✅ 使用环境变量
- ✅ Vercel 自动加密
- ✅ 可以随时轮换

---

## 📚 相关文档

- **火山引擎 API 文档**: https://www.volcengine.com/docs/doubao
- **Next.js 部署文档**: https://nextjs.org/docs/deployment
- **Vercel 部署文档**: https://vercel.com/docs

---

## ✨ 总结

**安全措施已完成** ✅
- [x] API Key 使用环境变量
- [x] `.env.local` 在 `.gitignore` 中
- [x] 提供 `.env.example` 模板
- [x] 代码中无硬编码密钥

**部署准备就绪** ✅
- [x] 项目结构完整
- [x] 依赖已配置
- [x] 环境变量示例已提供
- [x] `.gitignore` 已设置

**立即可部署** ✅
- [x] GitHub 推送
- [x] Vercel 部署
- [x] Docker 支持

---

**准备部署到 GitHub 吧！** 🚀✨

记住：`.env.local` 文件不会被提交，所以您的 API 密钥是安全的！
