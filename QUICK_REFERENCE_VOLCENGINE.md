# 🌐 快速参考：火山引擎 doubao

## 🎨 当前状态

您的 AI 艺术画廊现在使用：
- **火山引擎 (VolcEngine)**
- **模型**: doubao-seedream-4.0
- **API**: https://ark.cn-beijing.volces.com/api/v3/images/generations

---

## 📡 API 调用

### cURL 示例
```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer bdceb093-d71c-48c3-836d-f23053f55f16" \
  -d '{
    "model": "doubao-seedream-4.0-250828",
    "prompt": "您的描述",
    "response_format": "url",
    "size": "2K",
    "watermark": true
  }'
```

### JavaScript
```javascript
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer bdceb093-d71c-48c3-836d-f23053f55f16'
  },
  body: JSON.stringify({
    model: 'doubao-seedream-4.0-250828',
    prompt: '星际穿越，黑洞...',
    response_format: 'url',
    size: '2K',
    watermark: true
  })
});
```

---

## 📋 集成完成清单

- [x] 创建火山引擎 API 端点
- [x] 使用 doubao-seedream-4.0 模型
- [x] 实现 Bearer Token 认证
- [x] 添加提示词增强
- [x] 实现图像下载
- [x] 实现本地保存
- [x] 更新前端调用
- [x] 添加详细日志
- [x] 添加错误处理
- [x] 返回模型信息

---

## 🎯 测试步骤

1. **打开页面**: http://localhost:3000/
2. **点击**: "AI 创作生成"
3. **输入提示词**: "星际穿越，黑洞，电影大片"
4. **点击**: "开始创作"
5. **查看控制台**: F12 → Console
6. **等待生成**: 通常 5-15 秒
7. **查看图像**: 显示在对话框右侧

---

## 🔑 API 配置

```typescript
const VOLCENGINE_CONFIG = {
  apiUrl: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
  apiKey: 'bdceb093-d71c-48c3-836d-f23053f55f16',
  model: 'doubao-seedream-4.0-250828',
  defaultOptions: {
    response_format: 'url',
    size: '2K',
    stream: false,
    watermark: true
  }
};
```

---

## 📊 控制台输出示例

```
🌐 开始生成图像（火山引擎 doubao-seedream-4.0）...
📝 提示词: 星际穿越，黑洞
🎭 风格: realistic
📂 类别: sci-fi
📐 尺寸: 1024x1024
✨ 增强后的提示词: 星际穿越，黑洞, photorealistic, sci-fi, masterpiece quality, ultra detailed, cinematic lighting
📏 请求尺寸: 2K
📡 调用火山引擎 doubao API...
🌐 API URL: https://ark.cn-beijing.volces.com/api/v3/images/generations
🤖 模型: doubao-seedream-4.0-250828
✅ 火山引擎API响应已收到
📊 响应数据: {"created":1712345678,"data":[{"url":"..."}],"id":"..."}
🖼️ 原始图像URL: https://ark-cn-beijing.volces.com/...
📥 正在下载图像...
✅ 图像下载完成，大小: 524288 bytes
💾 图像已保存到: /home/z/my-project/public/generated-images/doubao_xxx.png
🔗 本地图像URL: /generated-images/doubao_xxx.png
💾 作品已保存到数据库，ID: clx123...
🎨 图像生成成功！使用火山引擎 doubao-seedream-4.0 模型
```

---

## 📖 支持的模型

- **doubao-seedream-4.0-250828**
  - 当前使用的模型
  - 版本: 4.0
  - 适合高质量图像生成

---

## 📝 重要提示

### API Key
当前使用的是示例密钥。在生产环境中：
1. 注册火山引擎账号
2. 创建应用
3. 获取 API Key
4. 更新代码中的 `VOLCENGINE_CONFIG.apiKey`

### 成本优化
- 监控 API 调用次数
- 设置合理的速率限制
- 考虑使用缓存

### 安全
- 不要在客户端暴露 API Key
- 使用环境变量存储密钥
- 验证用户权限

---

**火山引擎 doubao-seedream-4.0 已成功集成！** 🌐✨

所有图像生成现在都使用火山引擎的 doubao 模型！
