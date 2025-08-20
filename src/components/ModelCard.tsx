'use client'

import { useState, useEffect } from 'react'
import { Model } from '@/types/database'
import DetailDrawer from './DetailDrawer'
import CreateTaskModal from './CreateTaskModal'

interface ModelCardProps {
  model: Model
}

export default function ModelCard({ model }: ModelCardProps) {
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [devices, setDevices] = useState<Array<{ id: number; name: string }>>([])
  const [models, setModels] = useState<Array<{ id: number; name: string }>>([])

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
      
      setDevices(Array.isArray(devicesData) ? devicesData.map(d => ({ id: d.id, name: d.name })) : [])
      setModels(Array.isArray(modelsData) ? modelsData.map(m => ({ id: m.id, name: m.name })) : [])
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

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`
  }

  const formatSize = (size: number) => {
    if (size >= 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
    } else if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`
    } else if (size >= 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    }
    return `${size} B`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setShowDetailDrawer(true)}
    >
      <div className="mb-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{model.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {model.id}</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {model.description}
        </p>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">价格:</span>
          <span className="font-medium text-green-600">¥{model.price}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">创建时间:</span>
          <span className="font-medium">{new Date(model.created_at).toLocaleDateString()}</span>
        </div>
        
        {model.size_gb !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">大小:</span>
            <span className="font-medium">{model.size_gb}GB</span>
          </div>
        )}
        
        {model.type && (
          <div className="flex justify-between">
            <span className="text-gray-500">类型:</span>
            <span className="font-medium">{model.type}</span>
          </div>
        )}
        
        {model.scene && (
          <div className="flex justify-between">
            <span className="text-gray-500">场景:</span>
            <span className="font-medium">{model.scene}</span>
          </div>
        )}
        
        {model.compatible_devices && model.compatible_devices.length > 0 && (
          <div className="flex justify-start items-start">
            <span className="text-gray-500 mr-2">兼容设备:</span>
            <span className="font-medium text-xs">
              {model.compatible_devices.join(', ')}
            </span>
          </div>
        )}
      </div>

      {model.tags && model.tags.length > 0 && (
        <div className="mt-4">
          <span className="text-sm text-gray-500">标签:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {model.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {model.image_url && (
        <div className="mt-4">
          <img
            src={model.image_url}
            alt={model.name}
            className="w-full h-32 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-model.jpg'
            }}
          />
        </div>
      )}
      
      <div className="mt-4 flex space-x-2">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setShowCreateTaskModal(true)
          }}
          className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          立即使用
        </button>
      </div>

      <DetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        data={model}
        type="model"
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        defaultModelId={model.id}
        devices={devices}
        models={models}
      />
    </div>
  )
}