#!/bin/bash

echo "🔍 验证重构后的前端页面..."
echo

# 检查开发服务器是否运行
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ 开发服务器未运行，请先运行: npm run dev"
    exit 1
fi

echo "✅ 开发服务器运行正常"

# 测试各个页面
echo "🧪 测试页面访问..."

pages=("/" "/devices" "/models" "/tasks")
for page in "${pages[@]}"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001$page")
    if [ "$status" = "200" ]; then
        echo "✅ $page - 正常访问 (HTTP $status)"
    else
        echo "❌ $page - 访问失败 (HTTP $status)"
    fi
done

echo
echo "🎯 前端重构验证完成！"
echo "📱 访问地址: http://localhost:3001"
echo "🔗 设备管理: http://localhost:3001/devices"
echo "🔗 模型管理: http://localhost:3001/models"
echo "🔗 任务管理: http://localhost:3001/tasks"