'use client'

import { useState, useEffect } from 'react'
import { Model } from '@/types/database'
import DetailDrawer from './DetailDrawer'
import CreateTaskModal from './CreateTaskModal'

interface ModelListProps {
  models: Model[]
}

export default function ModelList({ models }: ModelListProps) {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [allDevices, setAllDevices] = useState<Array<{ id: number; name: string }>>([])
  const [allModels, setAllModels] = useState<Array<{ id: number; name: string }>>([])

  useEffect(() => {
    fetchDevicesAndModels()
  }, [])

  const fetchDevicesAndModels = async () => {
    try {
      const [devicesRes, modelsRes] = await Promise.all([
        fetch('/api/devices'),
        fetch('/api/models')
      ])
      
      const devicesData = await devicesRes.json()
      const modelsData = await modelsRes.json()
      
      setAllDevices(Array.isArray(devicesData) ? devicesData.map(d => ({ id: d.id, name: d.name })) : [])
      setAllModels(Array.isArray(modelsData) ? modelsData.map(m => ({ id: m.id, name: m.name })) : [])
    } catch (error) {
      console.error('Error fetching devices and models:', error)
    }
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          status: 'pending'
        })
      })
      
      if (!response.ok) throw new Error('Failed to create task')
      
      setShowCreateTaskModal(false)
      alert('任务创建成功！')
    } catch (error) {
      console.error('Error creating task:', error)
      alert('任务创建失败，请重试')
    }
  }
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              模型
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              价格
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              大小
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              场景
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              兼容设备
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              标签
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {models.map((model) => (
          <tr 
            key={model.id} 
            className="border-b hover:bg-gray-50 cursor-pointer"
            onClick={() => {
              setSelectedModel(model)
              setShowDetailDrawer(true)
            }}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {model.id}
            </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {model.image_url && (
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={model.image_url}
                        alt={model.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-model.jpg'
                        }}
                      />
                    </div>
                  )}
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{model.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-green-600">¥{model.price}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {model.size_gb !== undefined ? `${model.size_gb}GB` : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {model.type || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {model.scene || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(model.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {model.compatible_devices && model.compatible_devices.length > 0 
                  ? model.compatible_devices.join(', ')
                  : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {model.tags && model.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {model.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button 
                    className="text-green-600 hover:text-green-900"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedModel(model)
                      setShowCreateTaskModal(true)
                    }}
                  >
                    立即使用
                  </button>
                  <button 
                    className="text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedModel(model)
                      setShowDetailDrawer(true)
                    }}
                  >
                    详情
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        data={selectedModel}
        type="model"
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        defaultModelId={selectedModel?.id}
        devices={allDevices}
        models={allModels}
      />
    </div>
  )
}