import { Task } from '@/types/database'
import { useState } from 'react'

interface TaskWithRelations extends Task {
  devices: {
    name: string
    type: string
  }
  models: {
    name: string
    description: string
  }
}

interface TaskCardProps {
  task: TaskWithRelations
  onUpdate?: () => void
}

const statusOptions = ['pending', 'running', 'completed', 'failed']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [currentStatus, setCurrentStatus] = useState(task.status)

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      setCurrentStatus(newStatus)
      if (onUpdate) onUpdate()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{task.name}</h3>
          <p className="text-gray-600 text-sm mt-1">
            设备: {task.devices?.name || '未知'} ({task.devices?.type || '未知'})
          </p>
          <p className="text-gray-600 text-sm">
            模型: {task.models?.name || '未知'}
          </p>
        </div>
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3 text-sm">
        {task.config && Object.keys(task.config).length > 0 && (
          <div>
            <span className="font-medium text-gray-700">配置:</span>
            <div className="mt-1 bg-gray-50 p-3 rounded text-xs overflow-hidden">
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(task.config, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-gray-500">
          <span className="text-xs">
            创建时间: {new Date(task.created_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}