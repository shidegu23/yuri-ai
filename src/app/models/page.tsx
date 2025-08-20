'use client'

import { useEffect, useState } from 'react'
import { Model } from '@/types/database'
import SidebarLayout from '@/components/layout/SidebarLayout'
import ViewToggle from '@/components/ViewToggle'
import ModelCard from '@/components/ModelCard'
import ModelList from '@/components/ModelList'
import LoadingSpinner from '@/components/LoadingSpinner'
import EmptyState from '@/components/EmptyState'
import StatsCard from '@/components/StatsCard'

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [filteredModels, setFilteredModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'card' | 'list'>('card')
  const [tagFilter, setTagFilter] = useState<string>('')
  const [sizeMin, setSizeMin] = useState<number>(0)
  const [sizeMax, setSizeMax] = useState<number>(1000)
  const [priceMin, setPriceMin] = useState<number>(0)
  const [priceMax, setPriceMax] = useState<number>(10000)
  const [sortBy, setSortBy] = useState<'price' | 'size' | 'name'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    let filtered = models

    if (tagFilter) {
      filtered = filtered.filter(model => 
        Array.isArray(model.tags) && model.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      )
    }

    if (sizeMin > 0 || sizeMax < 1000) {
      filtered = filtered.filter(model => {
        const size = model.size_gb ?? 0
        return size >= Math.max(0, sizeMin) && size <= Math.min(1000, sizeMax)
      })
    }

    if (priceMin > 0 || priceMax < 10000) {
      filtered = filtered.filter(model => {
        const price = model.price ?? 0
        return price >= Math.max(0, priceMin) && price <= Math.min(10000, priceMax)
      })
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      switch (sortBy) {
        case 'price':
          aValue = a.price ?? 0
          bValue = b.price ?? 0
          break
        case 'size':
          aValue = a.size_gb ?? 0
          bValue = b.size_gb ?? 0
          break
        case 'name':
          aValue = a.name?.toLowerCase() ?? ''
          bValue = b.name?.toLowerCase() ?? ''
          break
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredModels(filtered)
  }, [models, tagFilter, sizeMin, sizeMax, priceMin, priceMax, sortBy, sortOrder])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/models')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setModels(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: filteredModels.length,
    active: filteredModels.filter(m => m.type === 'active').length,
    popular: filteredModels.filter(m => m.price > 1000).length,
    new: filteredModels.filter(m => {
      const createdDate = new Date(m.created_at)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return createdDate > thirtyDaysAgo
    }).length
  }

  const allTags = Array.from(
    new Set(models.flatMap(model => model.tags || []).filter(Boolean))
  ).sort()

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner text="正在加载模型数据..." />
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
            <h1 className="text-3xl font-bold text-gray-900">技能广场</h1>
            <p className="text-gray-600 mt-1">发现和获取AI技能模型</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <button
              onClick={fetchModels}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>

        {models.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">标签筛选</label>
                  <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有标签</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最小大小 (GB)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={sizeMin}
                    onChange={(e) => setSizeMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最大大小 (GB)</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={sizeMax}
                    onChange={(e) => setSizeMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最低价格</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">最高价格</label>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setTagFilter('')
                      setSizeMin(0)
                      setSizeMax(1000)
                      setPriceMin(0)
                      setPriceMax(10000)
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    重置筛选
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">排序字段</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price' | 'size' | 'name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">名称</option>
                    <option value="price">价格</option>
                    <option value="size">大小</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asc">升序</option>
                    <option value="desc">降序</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard title="总模型数" value={stats.total} icon="model" color="blue" />
              <StatsCard title="活跃模型" value={stats.active} icon="model" color="green" />
              <StatsCard title="高级模型" value={stats.popular} icon="model" color="purple" />
              <StatsCard title="新增模型" value={stats.new} icon="model" color="yellow" />
            </div>
            {filteredModels.length === 0 ? (
              <EmptyState
                title="暂无模型"
                description="当前没有添加任何AI模型"
                icon="🤖"
                actionText="添加模型"
                onAction={() => console.log('Add model')}
              />
            ) : (
              <>
                {view === 'card' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredModels.map((model) => (
                      <ModelCard key={model.id} model={model} />
                    ))}
                  </div>
                ) : (
                  <ModelList models={filteredModels} />
                )}
              </>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <SidebarLayout title="技能广场">
      {renderContent()}
    </SidebarLayout>
  )
}