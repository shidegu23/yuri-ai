'use client'

import { useState, useEffect } from 'react'
import { Device, Model, Task } from '@/types/database'

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  data: Device | Model | Task | null
  type: 'device' | 'model' | 'task'
}

export default function DetailDrawer({ isOpen, onClose, data, type }: DetailDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      setIsAnimating(false)
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !data) return null

  const renderDeviceDetail = (device: Device) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{device.name}</h3>
        <p className="text-gray-600 capitalize">{device.type}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">状态</h4>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            device.status === 'online' ? 'bg-green-100 text-green-800' :
            device.status === 'offline' ? 'bg-red-100 text-red-800' :
            device.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {device.status}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">电量</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  device.battery_level >= 80 ? 'bg-green-500' :
                  device.battery_level >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${device.battery_level}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{device.battery_level}%</span>
          </div>
        </div>
      </div>

      {device.skills && device.skills.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">技能</h4>
          <div className="flex flex-wrap gap-2">
            {device.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {device.tags && device.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {device.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {device.image_url && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">设备图片</h4>
          <img
            src={device.image_url}
            alt={device.name}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-device.jpg'
            }}
          />
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">设备信息</h4>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">设备ID</dt>
            <dd className="text-sm text-gray-900">{device.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">创建时间</dt>
            <dd className="text-sm text-gray-900">{new Date(device.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  )

  const renderModelDetail = (model: Model) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.name}</h3>
        <p className="text-gray-600">{model.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">价格</h4>
          <p className="text-lg font-bold text-green-600">¥{model.price}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">大小</h4>
          <p className="text-lg font-medium">{model.size_gb || 0} GB</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">类型</h4>
          <p className="text-sm font-medium">{model.type || '未指定'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">场景</h4>
          <p className="text-sm font-medium">{model.scene || '未指定'}</p>
        </div>
      </div>

      {model.compatible_devices && model.compatible_devices.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">兼容设备</h4>
          <div className="flex flex-wrap gap-2">
            {model.compatible_devices.map((device, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {device}
              </span>
            ))}
          </div>
        </div>
      )}

      {model.tags && model.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {model.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {model.image_url && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">模型图片</h4>
          <img
            src={model.image_url}
            alt={model.name}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-model.jpg'
            }}
          />
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">模型信息</h4>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">模型ID</dt>
            <dd className="text-sm text-gray-900">{model.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">创建时间</dt>
            <dd className="text-sm text-gray-900">{new Date(model.created_at).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  )

  const renderTaskDetail = (task: any) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{task.name}</h3>
        <p className="text-gray-600">任务详情</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">状态</h4>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.status === 'running' ? 'bg-blue-100 text-blue-800' :
            task.status === 'completed' ? 'bg-green-100 text-green-800' :
            task.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {task.status}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">设备</h4>
          <p className="text-sm font-medium">{task.devices?.name || '未知'}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">模型</h4>
        <p className="text-sm font-medium">{task.models?.name || '未知'}</p>
      </div>

      {task.config && Object.keys(task.config).length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-3">配置</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(task.config, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-lg font-medium text-gray-900 mb-3">任务信息</h4>
        <dl className="space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">任务ID</dt>
            <dd className="text-sm text-gray-900">{task.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">创建时间</dt>
            <dd className="text-sm text-gray-900">{new Date(task.created_at).toLocaleString()}</dd>
          </div>
          {task.updated_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">更新时间</dt>
              <dd className="text-sm text-gray-900">{new Date(task.updated_at).toLocaleString()}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )

  const renderContent = () => {
    if (!data) return null

    switch (type) {
      case 'device':
        return renderDeviceDetail(data as Device)
      case 'model':
        return renderModelDetail(data as Model)
      case 'task':
        return renderTaskDetail(data as Task)
      default:
        return null
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleRecall = async () => {
    if (!data || type !== 'device') return;
    
    try {
      const response = await fetch(`/api/devices/${data.id}/recall`, {
        method: 'POST'
      })
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to recall device');
      }
      
      // 显示成功消息
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = result.message || '设备召回指令已发送！';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
      // 关闭抽屉并刷新
      onClose();
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error('Error recalling device:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMsg.textContent = error instanceof Error ? error.message : '设备召回失败，请重试';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  }

  const handleSync = async () => {
    if (!data || type !== 'device') return;
    
    try {
      const response = await fetch(`/api/devices/${data.id}/sync`, {
        method: 'POST'
      })
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to sync device');
      }
      
      // 显示成功消息
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = result.message || '设备同步指令已发送！';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
      // 关闭抽屉并刷新
      onClose();
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error('Error syncing device:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMsg.textContent = error instanceof Error ? error.message : '设备同步失败，请重试';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 bg-transparent transition-opacity duration-300 z-40 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* 抽屉 - 从右侧滑出 */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {type === 'device' ? '设备详情' : type === 'model' ? '模型详情' : '任务详情'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </div>

          {/* 底部操作按钮 */}
          <div className="border-t p-6">
            <div className="flex space-x-3">
              {type === 'device' && (
                <>
                  <button 
                    disabled
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
                  >
                    召回
                  </button>
                  <button 
                    disabled
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
                  >
                    同步
                  </button>
                </>
              )}
              {type === 'model' && (
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  立即使用
                </button>
              )}
              {type === 'task' && (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  查看任务
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}