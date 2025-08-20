'use client'

import { useEffect, useState } from 'react'
import { Device } from '@/types/database'
import SidebarLayout from '@/components/layout/SidebarLayout'
import ViewToggle from '@/components/ViewToggle'
import DeviceCard from '@/components/DeviceCard'
import DeviceList from '@/components/DeviceList'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import StatsCard from '@/components/StatsCard'

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'card' | 'list'>('card')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [batteryMin, setBatteryMin] = useState<number>(0)
  const [batteryMax, setBatteryMax] = useState<number>(100)

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    let filtered = devices

    if (statusFilter) {
      filtered = filtered.filter(device => device.status === statusFilter)
    }

    if (batteryMin > 0 || batteryMax < 100) {
      filtered = filtered.filter(device => 
        device.battery_level >= Math.max(0, batteryMin) && 
        device.battery_level <= Math.min(100, batteryMax)
      )
    }

    setFilteredDevices(filtered)
  }, [devices, statusFilter, batteryMin, batteryMax])

  const fetchDevices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/devices')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setDevices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: filteredDevices.length,
    online: filteredDevices.filter(d => d.status === 'online').length,
    offline: filteredDevices.filter(d => d.status === 'offline').length,
    maintenance: filteredDevices.filter(d => d.status === 'maintenance').length
  }

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner text="正在加载设备数据..." />
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
            <h1 className="text-3xl font-bold text-gray-900">设备中心</h1>
            <p className="text-gray-600 mt-1">管理您的无人机设备</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <button
              onClick={fetchDevices}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
            <button
              onClick={() => console.log('添加新设备')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加新设备
            </button>
          </div>
        </div>

        {devices.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">设备状态</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有状态</option>
                    <option value="online">在线</option>
                    <option value="offline">离线</option>
                    <option value="maintenance">维护中</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最低电量 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batteryMin}
                    onChange={(e) => setBatteryMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最高电量 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={batteryMax}
                    onChange={(e) => setBatteryMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStatusFilter('')
                      setBatteryMin(0)
                      setBatteryMax(100)
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard title="总设备数" value={stats.total} icon="device" color="blue" />
              <StatsCard title="在线设备" value={stats.online} icon="device" color="green" />
              <StatsCard title="离线设备" value={stats.offline} icon="device" color="red" />
              <StatsCard title="维护中" value={stats.maintenance} icon="device" color="yellow" />
            </div>
          </>
        )}

        {filteredDevices.length === 0 ? (
          <EmptyState
            title="暂无设备"
            description="当前没有添加任何设备"
            icon="🚁"
            actionText="添加新设备"
            onAction={() => console.log('添加新设备')}
          />
        ) : (
          <>
            {view === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDevices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            ) : (
              <DeviceList devices={filteredDevices} />
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <SidebarLayout title="设备中心">
      {renderContent()}
    </SidebarLayout>
  )
}