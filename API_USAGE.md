# API 使用说明

## 正确的 API 使用方法

项目应该直接使用 Supabase 提供的 REST API，而不是创建额外的 API 路由。

### 基础配置

**Supabase URL**: `https://nxfcwugrwsddzwqvetje.supabase.co`

**API 密钥**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZmN3dWdyd3NkZHp3cXZldGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODc3MjIsImV4cCI6MjA3MTE2MzcyMn0.J4pr28S26gTVHwiK296BCl0DL76JrAS-Xipoy3VQ6so`

### 使用示例

#### 1. 获取所有设备
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 2. 获取设备ID列表
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?select=id' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 3. 获取指定字段
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?select=id,name,status' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 4. 带过滤条件查询
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?status=eq.online' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 在代码中使用

#### 前端直接调用
```javascript
// 使用 Supabase 客户端
import { supabase } from '@/lib/supabase'

const { data: devices, error } = await supabase
  .from('devices')
  .select('id,name,status')

// 或者直接使用 fetch
const response = await fetch('https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?select=id', {
  headers: {
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
  }
})
const data = await response.json()
```

### 已删除的 API 路由
- `/api/devices` - 已删除，直接使用 Supabase REST API
- `/api/devices/[id]` - 已删除，直接使用 Supabase REST API

### 测试脚本
运行 `./test-supabase-direct.sh` 可以测试所有 API 端点。