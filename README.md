# Yuri AI 管理系统

Next.js + Supabase 全栈应用，使用 Supabase REST API 直接连接数据库

## 项目架构

项目重构后直接使用 Supabase 提供的 REST API，不再通过自定义 API 路由，实现真正的前后端分离。

## 项目结构

```
src/
├── app/
│   ├── devices/              # 设备管理页面
│   ├── models/               # 模型管理页面
│   ├── tasks/                # 任务管理页面
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
├── lib/
│   └── supabase.ts           # Supabase客户端配置
└── types/
    └── database.ts           # 数据库类型定义

## 环境变量

复制 `.env.local.example` 为 `.env.local`，配置已更新：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://nxfcwugrwsddzwqvetje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZmN3dWdyd3NkZHp3cXZldGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1ODc3MjIsImV4cCI6MjA3MTE2MzcyMn0.J4pr28S26gTVHwiK296BCl0DL76JrAS-Xipoy3VQ6so
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZmN3dWdyd3NkZHp3cXZldGplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU4NzcyMiwiZXhwIjoyMDcxMTYzNzIyfQ.J4pr28S26gTVHwiK296BCl0DL76JrAS-Xipoy3VQ6so
```

## 使用方法

### 直接访问 Supabase REST API

#### 获取所有设备
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 获取设备ID列表
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?select=id' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 带过滤条件查询
```bash
curl 'https://nxfcwugrwsddzwqvetje.supabase.co/rest/v1/devices?status=eq.online' \
  -H "apikey: YOUR_API_KEY" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 前端使用 Supabase 客户端

```javascript
import { supabase } from '@/lib/supabase'

// 获取所有设备
const { data: devices, error } = await supabase
  .from('devices')
  .select('*')
  .order('created_at', { ascending: false })

// 获取带关联信息的任务
const { data: tasks, error } = await supabase
  .from('tasks')
  .select(`*, devices(name, type), models(name, description)`)
```

## 页面功能

### 首页 (`/`)
- 导航到各个管理模块
- 现代化的卡片式布局

### 设备管理 (`/devices`)
- 显示所有无人机设备
- 实时状态监控
- 设备详情展示

### 模型管理 (`/models`)
- AI模型库浏览
- 模型参数展示
- 兼容性信息

### 任务管理 (`/tasks`)
- 任务列表和状态
- 关联设备和模型信息
- 任务配置详情

## 运行项目

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

### 生产运行
```bash
npm run start
```

## 测试

### 测试 Supabase API
```bash
./test-supabase-direct.sh
```

### 验证环境配置
```bash
./test-devices-api.sh
```

## 已删除的组件

- 自定义 API 路由 `/api/devices/*` - 已删除，直接使用 Supabase REST API
- 自定义 API 路由 `/api/models/*` - 已删除，直接使用 Supabase REST API
- 自定义 API 路由 `/api/tasks/*` - 已删除，直接使用 Supabase REST API

## 技术特点

- **直接数据库访问**: 使用 Supabase REST API，无需中间层
- **实时数据**: 支持实时订阅和更新
- **类型安全**: 完整的 TypeScript 类型定义
- **响应式设计**: 适配各种屏幕尺寸
- **现代化UI**: 使用 Tailwind CSS 构建美观界面