'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types/database'
import SidebarLayout from '@/components/layout/SidebarLayout'
import ViewToggle from '@/components/ViewToggle'
import TaskCard from '@/components/TaskCard'
import TaskList from '@/components/TaskList'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import StatsCard from '@/components/StatsCard'

interface TaskWithRelations extends Task {
  devices: {
    name: string
    type: string
  }
  models: {
    name: string
    description: string
  }
}

interface Device {
  id: number
  name: string
}

interface Model {
  id: number
  name: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'card' | 'list'>('card')
  const [devices, setDevices] = useState<Device[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({
    name: '',
    device_id: '',
    model_id: '',
    config: '{}'
  })

  useEffect(() => {
    fetchTasks()
    fetchDevices()
    fetchModels()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await fetch('/api/devices')
      if (!response.ok) throw new Error('Failed to fetch devices')
      const data = await response.json()
      setDevices(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching devices:', err)
    }
  }

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models')
      if (!response.ok) throw new Error('Failed to fetch models')
      const data = await response.json()
      setModels(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching models:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          device_id: parseInt(newTask.device_id),
          model_id: parseInt(newTask.model_id),
          status: 'pending',
          config: JSON.parse(newTask.config)
        })
      })
      if (!response.ok) throw new Error('Failed to create task')
      setShowForm(false)
      setNewTask({ name: '', device_id: '', model_id: '', config: '{}' })
      fetchTasks()
    } catch (err) {
      console.error('Error creating task:', err)
    }
  }

  const stats = {
    total: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner text="正在加载任务数据..." />
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">加载失败</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">任务管理</h1>
            <p className="text-gray-600 mt-1">创建和监控AI任务执行</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建任务
            </button>
            <ViewToggle view={view} onViewChange={setView} />
            <button
              onClick={fetchTasks}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">创建新任务</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">任务名称</label>
                <input
                  type="text"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">设备</label>
                <select
                  name="device_id"
                  value={newTask.device_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">选择设备</option>
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>{device.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">模型</label>
                <select
                  name="model_id"
                  value={newTask.model_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">选择模型</option>
                  {models.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">配置 (JSON)</label>
                <textarea
                  name="config"
                  value={newTask.config}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <StatsCard title="总任务数" value={stats.total} icon="task" color="blue" />
            <StatsCard title="运行中" value={stats.running} icon="task" color="green" />
            <StatsCard title="已完成" value={stats.completed} icon="task" color="purple" />
            <StatsCard title="失败" value={stats.failed} icon="task" color="red" />
            <StatsCard title="待执行" value={stats.pending} icon="task" color="yellow" />
          </div>
        )}

        {tasks.length === 0 ? (
          <EmptyState
            title="暂无任务"
            description="当前没有创建任何AI任务"
            icon="📋"
            actionText="创建任务"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <>
            {view === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
                ))}
              </div>
            ) : (
              <TaskList tasks={tasks} />
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <SidebarLayout title="任务管理">
      {renderContent()}
    </SidebarLayout>
  )
}