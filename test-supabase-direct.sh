#!/bin/bash

# 测试直接访问 Supabase REST API

echo "=== 测试直接访问 Supabase REST API ==="
echo

SUPABASE_URL="https://nxfcwugrwsddzwqvetje.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZmN3dWdyd3NkZHp3cXZldGplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU4NzcyMiwiZXhwIjoyMDcxMTYzNzIyfQ.J4pr28S26gTVHwiK296BCl0DL76JrAS-Xipoy3VQ6so"

echo "1. 获取设备ID列表..."
curl -s "$SUPABASE_URL/rest/v1/devices?select=id" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | python3 -m json.tool

echo
echo "2. 获取所有设备信息..."
curl -s "$SUPABASE_URL/rest/v1/devices" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | python3 -m json.tool

echo
echo "3. 获取设备名称和状态..."
curl -s "$SUPABASE_URL/rest/v1/devices?select=id,name,status" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | python3 -m json.tool

echo
echo "=== 测试完成 ==="