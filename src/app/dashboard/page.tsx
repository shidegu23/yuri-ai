'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import StatsCard from '@/components/StatsCard'
import Link from 'next/link'

interface Stats {
  devices: number
  models: number
  tasks: number
  active_tasks: number
}

interface RecentItem {
  id: string
  name: string
  status: string
  created_at: string
  type: 'device' | 'model' | 'task'
}

import SidebarLayout from '@/components/layout/SidebarLayout'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    devices: 0,
    models: 0,
    tasks: 0,
    active_tasks: 0
  })
  const [recentItems, setRecentItems] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // 获取统计数据
      const [devicesRes, modelsRes, tasksRes] = await Promise.all([
        fetch('/api/devices?select=id'),
        fetch('/api/models?select=id'),
        fetch('/api/tasks')
      ]);
  
      const [devicesData, modelsData, tasksData] = await Promise.all([
        devicesRes.json(),
        modelsRes.json(),
        tasksRes.json()
      ]);
  
      const devices = Array.isArray(devicesData) ? devicesData : [];
      const models = Array.isArray(modelsData) ? modelsData : [];
      const tasks = Array.isArray(tasksData) ? tasksData : [];
  
      const activeTasks = tasks.filter(task => 
        task.status === 'running' || task.status === 'pending'
      ).length || 0;
  
      setStats({
        devices: devices.length || 0,
        models: models.length || 0,
        tasks: tasks.length || 0,
        active_tasks: activeTasks
      });
  
      // 获取最近的项目
      const [recentDevicesRes, recentModelsRes, recentTasksRes] = await Promise.all([
        fetch('/api/devices?select=id,name,status,created_at'),
        fetch('/api/models?select=id,name,status,created_at'),
        fetch('/api/tasks?select=id,name,status,created_at')
      ]);
  
      const [recentDevicesData, recentModelsData, recentTasksData] = await Promise.all([
        recentDevicesRes.json(),
        recentModelsRes.json(),
        recentTasksRes.json()
      ]);
  
      const recentDevices = Array.isArray(recentDevicesData) ? recentDevicesData : [];
      const recentModels = Array.isArray(recentModelsData) ? recentModelsData : [];
      const recentTasks = Array.isArray(recentTasksData) ? recentTasksData : [];
  
      // 由于API不支持order和limit，在客户端排序并切片
      const sortedDevices = recentDevices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
      const sortedModels = recentModels.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
      const sortedTasks = recentTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 3);
  
      const items = [
        ...sortedDevices.map(d => ({ ...d, type: 'device' })),
        ...sortedModels.map(m => ({ ...m, type: 'model' })),
        ...sortedTasks.map(t => ({ ...t, type: 'task' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);
  
      setRecentItems(items);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string, type: string) => {
    const statusMap: Record<string, Record<string, string>> = {
      device: {
        online: 'text-green-600 bg-green-100',
        offline: 'text-red-600 bg-red-100',
        maintenance: 'text-yellow-600 bg-yellow-100'
      },
      model: {
        active: 'text-green-600 bg-green-100',
        inactive: 'text-gray-600 bg-gray-100'
      },
      task: {
        running: 'text-blue-600 bg-blue-100',
        completed: 'text-green-600 bg-green-100',
        failed: 'text-red-600 bg-red-100',
        pending: 'text-yellow-600 bg-yellow-100'
      }
    }
    return statusMap[type]?.[status] || 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <SidebarLayout title="仪表盘">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout title="仪表盘">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">仪表盘</h1>
          <p className="text-gray-600">欢迎来到Yuri AI管理系统</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="总设备数"
            value={stats.devices}
            icon="device"
            color="blue"
            href="/devices"
          />
          <StatsCard
            title="AI模型"
            value={stats.models}
            icon="model"
            color="green"
            href="/models"
          />
          <StatsCard
            title="总任务"
            value={stats.tasks}
            icon="task"
            color="purple"
            href="/tasks"
          />
          <StatsCard
            title="运行中"
            value={stats.active_tasks}
            icon="active"
            color="orange"
            href="/tasks"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/devices" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">设备管理</p>
                  <p className="text-sm text-gray-500">查看和管理设备</p>
                </div>
              </div>
            </Link>
            
            <Link href="/models" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI模型</p>
                  <p className="text-sm text-gray-500">浏览AI模型</p>
                </div>
              </div>
            </Link>
            
            <Link href="/tasks" className="group">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">任务管理</p>
                  <p className="text-sm text-gray-500">创建和监控任务</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
          <div className="space-y-4">
            {recentItems.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    item.type === 'device' ? 'bg-blue-500' :
                    item.type === 'model' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status, item.type)}`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            ))}
            {recentItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>暂无活动记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}