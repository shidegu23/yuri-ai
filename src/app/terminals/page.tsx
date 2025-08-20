"use client"

import { useEffect, useState } from 'react'
import { Device } from '@/types/database'
import SidebarLayout from '@/components/layout/SidebarLayout'
import ViewToggle from '@/components/ViewToggle'
import DeviceCard from '@/components/DeviceCard'
import DeviceList from '@/components/DeviceList'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import StatsCard from '@/components/StatsCard'

export default function TerminalsPage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'card' | 'list'>('card')
  const [skillFilter, setSkillFilter] = useState<string>('')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('')

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    let filtered = devices

    if (skillFilter) {
      filtered = filtered.filter(device => 
        device.skills?.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      )
    }

    if (tagFilter) {
      filtered = filtered.filter(device => 
        device.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      )
    }

    if (deviceTypeFilter) {
      filtered = filtered.filter(device => device.type === deviceTypeFilter)
    }

    setFilteredDevices(filtered)
  }, [devices, skillFilter, tagFilter, deviceTypeFilter])

  const fetchDevices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/devices')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setDevices(data || [])
      setFilteredDevices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: filteredDevices.length,
    drones: filteredDevices.filter(d => d.type === 'drone').length,
    robots: filteredDevices.filter(d => d.type === 'robot').length,
    cameras: filteredDevices.filter(d => d.type === 'camera').length
  }

  const uniqueSkills = Array.from(
    new Set(devices.flatMap(device => device.skills || []).filter(Boolean))
  ).sort()

  const uniqueTags = Array.from(
    new Set(devices.flatMap(device => device.tags || []).filter(Boolean))
  ).sort()

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner text="正在加载终端数据..." />
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
            <h1 className="text-3xl font-bold text-gray-900">终端广场</h1>
            <p className="text-gray-600 mt-1">浏览和管理AI终端设备</p>
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
          </div>
        </div>

        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">筛选器</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">按技能筛选</label>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部技能</option>
                {uniqueSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">按标签筛选</label>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部标签</option>
                {uniqueTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">按类型筛选</label>
              <select
                value={deviceTypeFilter}
                onChange={(e) => setDeviceTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有类型</option>
                <option value="drone">无人机</option>
                <option value="robot">机器人</option>
                <option value="camera">摄像头</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSkillFilter('')
                  setTagFilter('')
                  setDeviceTypeFilter('')
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                清除筛选
              </button>
            </div>
          </div>
        </div>

        {filteredDevices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard title="总终端数" value={stats.total} icon="terminal" color="blue" />
            <StatsCard title="无人机" value={stats.drones} icon="drone" color="green" />
            <StatsCard title="机器人" value={stats.robots} icon="robot" color="purple" />
            <StatsCard title="摄像头" value={stats.cameras} icon="camera" color="orange" />
          </div>
        )}

        {filteredDevices.length === 0 ? (
          <EmptyState
            title="暂无终端"
            description={devices.length > 0 ? "没有符合筛选条件的终端" : "当前没有添加任何终端设备"}
            icon="💻"
            actionText="清除筛选"
            onAction={() => {
              setSkillFilter('')
              setTagFilter('')
            }}
          />
        ) : (
          <>
            {view === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDevices.map((device) => (
                  <div key={device.id} className="transform transition-all duration-200 hover:scale-105">
                    <DeviceCard device={device} hideStatus hideBattery isTerminal />
                  </div>
                ))}
              </div>
            ) : (
              <DeviceList devices={filteredDevices} hideStatus hideBattery isTerminal />
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <SidebarLayout title="终端广场">
      {renderContent()}
    </SidebarLayout>
  )
}