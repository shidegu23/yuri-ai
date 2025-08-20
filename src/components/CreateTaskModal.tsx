'use client'

import { useState, useEffect } from 'react'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: any) => void
  defaultDeviceId?: number
  defaultModelId?: number
  devices: Array<{ id: number; name: string }>
  models: Array<{ id: number; name: string }>
}

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  defaultDeviceId, 
  defaultModelId,
  devices,
  models 
}: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [deviceId, setDeviceId] = useState<string>('')
  const [modelId, setModelId] = useState<string>('')
  const [config, setConfig] = useState('{}')

  useEffect(() => {
    if (isOpen) {
      setTaskName('')
      setDeviceId(defaultDeviceId?.toString() || '')
      setModelId(defaultModelId?.toString() || '')
      setConfig('{}')
    }
  }, [isOpen, defaultDeviceId, defaultModelId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const configObj = JSON.parse(config)
      onSubmit({
        name: taskName,
        device_id: parseInt(deviceId),
        model_id: parseInt(modelId),
        config: configObj
      })
    } catch (error) {
      alert('配置格式错误，请输入有效的JSON格式')
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-transparent flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">创建新任务</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务名称
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入任务名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择设备
            </label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">请选择设备</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              选择模型
            </label>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">请选择模型</option>
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              配置 (JSON格式)
            </label>
            <textarea
              value={config}
              onChange={(e) => setConfig(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder='{"key": "value"}'
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              创建任务
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}