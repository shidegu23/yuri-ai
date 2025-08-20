#!/bin/bash

# 测试 devices API 的各种端点

echo "=== 测试 Devices API ==="
echo

# 1. 测试 GET /api/devices - 获取所有设备
echo "1. 获取所有设备..."
curl -s -X GET "http://localhost:3002/api/devices" \
  -H "Content-Type: application/json" | python3 -m json.tool

echo
echo "2. 获取设备ID列表..."
curl -s -X GET "http://localhost:3002/api/devices?select=id" \
  -H "Content-Type: application/json" | python3 -m json.tool

echo
echo "3. 获取设备名称和状态..."
curl -s -X GET "http://localhost:3002/api/devices?select=id,name,status" \
  -H "Content-Type: application/json" | python3 -m json.tool

echo
echo "=== 测试完成 ==="