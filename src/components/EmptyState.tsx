interface EmptyStateProps {
  title?: string
  description?: string
  icon?: string
  actionText?: string
  onAction?: () => void
}

export default function EmptyState({
  title = "暂无数据",
  description = "当前没有可显示的内容",
  icon = "📊",
  actionText,
  onAction
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-4xl mb-4 opacity-50">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}