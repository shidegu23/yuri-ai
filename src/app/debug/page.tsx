'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Testing API connection...')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      const response = await fetch('/api/devices?select=*&limit=1')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('Success:', data)
      setResult({
        data,
        count: data?.length || 0,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL
      })
    } catch (err: any) {
      console.error('Connection error:', err)
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">调试页面</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Supabase 连接测试</h2>
        <p className="text-sm text-gray-600 mb-4">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '测试中...' : '测试连接'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold mb-2">错误详情:</h3>
          <pre className="text-sm whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold mb-2">成功结果:</h3>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">调试建议</h2>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>打开浏览器开发者工具 (F12) 查看控制台日志</li>
          <li>检查 Network 标签页的网络请求</li>
          <li>确认浏览器没有 CORS 错误</li>
          <li>验证环境变量是否正确加载</li>
        </ul>
      </div>
    </div>
  )
}