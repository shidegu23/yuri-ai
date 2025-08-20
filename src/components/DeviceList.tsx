'use client'

import { useState, useEffect } from 'react'
import { Device } from '@/types/database'
import DetailDrawer from './DetailDrawer'
import CreateTaskModal from './CreateTaskModal'

interface DeviceListProps {
  devices: Device[]
  hideStatus?: boolean
  hideBattery?: boolean
  isTerminal?: boolean
}

export default function DeviceList({ devices, hideStatus = false, hideBattery = false, isTerminal = false }: DeviceListProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
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

  const handleRecall = async (deviceId: number) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/recall`, {
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
      
      // 刷新设备列表
      window.location.reload();
    } catch (error) {
      console.error('Error recalling device:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMsg.textContent = error instanceof Error ? error.message : '设备召回失败，请重试';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  }

  const handleSync = async (deviceId: number) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/sync`, {
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
      
      // 刷新设备列表
      window.location.reload();
    } catch (error) {
      console.error('Error syncing device:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMsg.textContent = error instanceof Error ? error.message : '设备同步失败，请重试';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'text-green-600'
    if (level >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              设备信息
            </th>
            {!hideStatus && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
            )}
            {!hideBattery && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                电量
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              技能
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
          {devices.map((device) => (
            <tr key={device.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {device.image_url ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={device.image_url}
                        alt={device.name}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-device.jpg'
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">{device.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{device.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{device.type}</div>
                  </div>
                </div>
              </td>
              {!hideStatus && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(device.status)}`}>
                    {device.status}
                  </span>
                </td>
              )}
              {!hideBattery && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      <span className={getBatteryColor(device.battery_level)}>
                        {device.battery_level}%
                      </span>
                    </div>
                  </div>
                </td>
              )}
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {device.skills.slice(0, 2).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {device.skills.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{device.skills.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {device.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                  {device.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{device.tags.length - 2}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {isTerminal ? (
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open('https://laplacelab.feishu.cn/share/base/form/shrcnATVOR5ZGqwFlmgU470jxCc', '_blank')
                      }}
                    >
                      立即咨询
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        disabled
                        className="text-gray-400 cursor-not-allowed"
                      >
                        召回
                      </button>
                      <button 
                        disabled
                        className="text-gray-400 cursor-not-allowed"
                      >
                        同步
                      </button>
                    </div>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DetailDrawer
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        data={selectedDevice}
        type="device"
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSubmit={handleCreateTask}
        defaultDeviceId={selectedDevice?.id}
        devices={allDevices}
        models={allModels}
      />
    </div>
  )
}