#!/bin/bash

echo "=== Testing Yuri AI Backend APIs ==="
echo

# 设置基础URL
BASE_URL="http://localhost:3001"

# 测试设备API
echo "1. Testing Devices API..."
echo "GET $BASE_URL/api/devices"
curl -s -X GET "$BASE_URL/api/devices"
echo
echo

# 测试模型API
echo "2. Testing Models API..."
echo "GET $BASE_URL/api/models"
curl -s -X GET "$BASE_URL/api/models"
echo
echo

# 测试任务API
echo "3. Testing Tasks API..."
echo "GET $BASE_URL/api/tasks"
curl -s -X GET "$BASE_URL/api/tasks"
echo
echo

echo "=== API Testing Complete ==="