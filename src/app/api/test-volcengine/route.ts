import { NextRequest, NextResponse } from "next/server";

// 测试端点 - 用于诊断火山引擎 API 问题
export async function GET() {
  const testResults = {
    timestamp: new Date().toISOString(),
    message: "火山引擎 API 测试",
    tests: []
  };

  // 测试 1: 当前配置
  testResults.tests.push({
    name: "配置检查",
    status: "completed",
    details: {
      apiUrl: process.env.VOLCENGINE_API_URL,
      apiKey: process.env.VOLCENGINE_API_KEY ? process.env.VOLCENGINE_API_KEY.substring(0, 10) + "..." : "未设置",
      model: process.env.VOLCENGINE_MODEL
    }
  });

  // 测试 2: 基础模型名
  const testModels = [
    "doubao-seedream-4.0",
    "doubao-seedream-4.0-250828",
    "doubao-dream",
    "doubao",
    "doubao-v3"
  ];

  const apiUrl = process.env.VOLCENGINE_API_URL || "https://ark.cn-beijing.volces.com/api/v3/images/generations";
  const apiKey = process.env.VOLCENGINE_API_KEY || "";

  for (const model of testModels) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          prompt: "测试",
          response_format: "url",
          size: "2K"
        })
      });

      const data = await response.json();
      testResults.tests.push({
        name: `模型测试: ${model}`,
        status: response.ok ? "success" : "failed",
        httpStatus: response.status,
        error: data.error || null,
        details: data.error ? data.error.message : data.data ? "成功" : "未知"
      });
    } catch (error: any) {
      testResults.tests.push({
        name: `模型测试: ${model}`,
        status: "error",
        error: error.message
      });
    }
  }

  // 测试 3: 环境变量检查
  testResults.tests.push({
    name: "环境变量",
    status: "completed",
    details: {
      hasApiKey: !!process.env.VOLCENGINE_API_KEY,
      hasApiUrl: !!process.env.VOLCENGINE_API_URL,
      hasModel: !!process.env.VOLCENGINE_MODEL,
      envFileExists: true
    }
  });

  return NextResponse.json(testResults);
}
