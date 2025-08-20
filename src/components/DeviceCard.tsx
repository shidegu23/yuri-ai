'use client'

import { useState, useEffect } from 'react'
import { Device } from '@/types/database'

interface DeviceCardProps {
  device: Device
  hideStatus?: boolean
  hideBattery?: boolean
  isTerminal?: boolean
}

export default function DeviceCard({ device, hideStatus = false, hideBattery = false, isTerminal = false }: DeviceCardProps) {
  const [devices, setDevices] = useState<Array<{ id: number; name: string }>>([])
  const [models, setModels] = useState<Array<{ id: number; name: string }>>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBatteryColor = (level: number) => {
    if (level >= 80) return 'bg-green-500'
    if (level >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

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



  const handleRecall = async () => {
    try {
      const response = await fetch(`/api/devices/${device.id}/recall`, {
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

  const handleSync = async () => {
    try {
      const response = await fetch(`/api/devices/${device.id}/sync`, {
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

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{device.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{device.type}</p>
        </div>
        {!hideStatus && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}>
            {device.status}
          </span>
        )}
      </div>

      {!hideBattery && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">电量</span>
            <span className="font-medium">{device.battery_level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getBatteryColor(device.battery_level)}`}
              style={{ width: `${device.battery_level}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">技能</h4>
          <div className="flex flex-wrap gap-1">
            {device.skills && device.skills.length > 0 ? (
              device.skills.map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">暂无技能</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">标签</h4>
          <div className="flex flex-wrap gap-1">
            {device.tags && device.tags.length > 0 ? (
              device.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400">暂无标签</span>
            )}
          </div>
        </div>
      </div>

      {device.image_url && (
        <div className="mt-4">
          <img
            src={device.image_url}
            alt={device.name}
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-device.jpg'
            }}
          />
        </div>
      )}

      {isTerminal ? (
        <div className="mt-4">
          <button 
            onClick={() => window.open('https://laplacelab.feishu.cn/share/base/form/shrcnATVOR5ZGqwFlmgU470jxCc', '_blank')}
            className="w-full bg-green-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            立即咨询
          </button>
        </div>
      ) : (
        <div className="mt-4 flex space-x-2">
          <button 
            disabled
            className="flex-1 bg-gray-400 text-white text-sm py-2 px-3 rounded-lg cursor-not-allowed opacity-50"
          >
            召回
          </button>
          <button 
            disabled
            className="flex-1 bg-gray-400 text-white text-sm py-2 px-3 rounded-lg cursor-not-allowed opacity-50"
          >
            同步
          </button>
        </div>
      )}
    </div>
  )
}