import { NextResponse } from 'next/server';

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript 测试</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 40px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      max-width: 600px;
    }
    button {
      padding: 20px 40px;
      font-size: 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    }
    button:hover {
      background: #1d4ed8;
    }
    .info {
      margin-top: 30px;
      padding: 20px;
      background: #f0f9ff;
      border-radius: 8px;
      color: #1e40af;
    }
    .back-link {
      margin-top: 30px;
      font-size: 14px;
    }
    .back-link a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✅ JavaScript 功能测试</h1>

    <p>
      这是纯HTML + JavaScript的测试页面，不依赖任何框架。
      <br />
      如果这个按钮可以点击，说明JavaScript工作正常！
    </p>

    <button id="testBtn" type="button">点击测试按钮</button>

    <div class="info">
      <p><strong>点击次数：</strong> <span id="clickCount">0</span></p>
      <p>点击按钮测试JavaScript是否正常工作</p>
    </div>

    <div class="back-link">
      <a href="/">← 返回 AI 艺术画廊</a>
    </div>
  </div>

  <script>
    console.log('JavaScript 已加载 - 测试页面');
    let count = 0;

    const testBtn = document.getElementById('testBtn');
    const clickCountSpan = document.getElementById('clickCount');

    if (testBtn) {
      testBtn.addEventListener('click', function() {
        console.log('按钮被点击了！当前次数:', count);
        count++;
        clickCountSpan.textContent = count;
        alert('✅ 按钮点击成功！计数: ' + count);
      });
      console.log('按钮事件监听器已添加');
    } else {
      console.error('找不到按钮元素！');
    }

    console.log('所有脚本已初始化完成');
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
