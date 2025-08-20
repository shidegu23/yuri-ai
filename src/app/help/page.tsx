"use client"

import SidebarLayout from '@/components/layout/SidebarLayout'
import { useState } from 'react'

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('overview')

  interface HelpSection {
    id: string
    title: string
    icon: string
    content: {
      title: string
      description: string
      features?: Array<{
        title: string
        description: string
      }>
      sections?: Array<{
        title: string
        description?: string
        steps?: string[]
        types?: string[]
      }>
      questions?: Array<{
        q: string
        a: string
      }>
    }
  }

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: '系统概览',
      icon: '🏠',
      content: {
        title: '欢迎使用YURI AI设备管理系统',
        description: '本系统帮助您统一管理AI设备、模型和任务，实现智能化的设备控制和数据分析。',
        features: [
          {
            title: '首页',
            description: '查看系统整体运行状态和关键数据统计'
          },
          {
            title: '设备中心',
            description: '管理无人机、机器人、摄像头等AI终端设备'
          },
          {
            title: '技能广场',
            description: '浏览和管理各种AI模型和算法技能'
          },
          {
            title: '终端广场',
            description: '按技能和标签筛选查看终端设备'
          },
          {
            title: '任务管理',
            description: '创建、监控和管理设备执行的任务'
          }
        ]
      }
    },
    {
      id: 'devices',
      title: '设备中心',
      icon: '🚁',
      content: {
        title: '设备中心使用指南',
        description: '学习如何添加、配置和管理您的AI设备',
        sections: [
          {
            title: '添加新设备',
            steps: [
              '点击设备中心的"添加新设备"按钮',
              '填写设备基本信息（名称、类型、描述）',
              '配置设备技能和标签',
              '上传设备图片（可选）',
              '保存设备信息'
            ]
          },
          {
            title: '设备状态管理',
            description: '设备状态包括：在线、离线、维护中。状态会根据设备连接情况自动更新。'
          },
          {
            title: '设备技能配置',
            description: '为设备配置技能可以让系统更好地匹配任务和模型。技能包括：图像识别、目标检测、路径规划等。'
          }
        ]
      }
    },
    {
      id: 'models',
      title: '技能广场',
      icon: '🤖',
      content: {
        title: '技能广场使用指南',
        description: '了解如何管理和使用AI模型技能',
        sections: [
          {
            title: '技能类型',
            types: [
              '图像识别：用于物体检测、分类',
              '自然语言处理：文本分析和生成',
              '路径规划：无人机和机器人导航',
              '数据分析：传感器数据处理'
            ]
          },
          {
            title: '技能部署',
            steps: [
              '在技能广场选择合适的模型',
              '查看模型兼容的设备类型',
              '将模型分配给目标设备',
              '配置模型参数和运行环境'
            ]
          }
        ]
      }
    },
    {
      id: 'tasks',
      title: '任务管理',
      icon: '📋',
      content: {
        title: '任务创建与监控',
        description: '学习如何创建和管理设备任务',
        sections: [
          {
            title: '创建任务',
            steps: [
              '进入任务管理页面',
              '点击"创建新任务"',
              '选择执行任务的设备',
              '选择使用的AI技能',
              '设置任务参数和目标',
              '启动任务执行'
            ]
         },
          {
            title: '任务状态',
            description: '任务状态包括：待执行、执行中、已完成、失败。可以实时查看任务进度和结果。'
          }
        ]
      }
    },
    {
      id: 'faq',
      title: '常见问题',
      icon: '❓',
      content: {
        title: '常见问题解答',
        questions: [
          {
            q: '如何添加新的AI设备？',
            a: '在设备中心页面点击"添加新设备"按钮，填写设备信息并保存即可。'
          },
          {
            q: '设备状态显示"离线"怎么办？',
            a: '请检查设备网络连接，确保设备已正确连接到系统。如问题持续，请联系技术支持。'
          },
          {
            q: '如何在终端广场筛选设备？',
            a: '使用终端广场的筛选器，可以按技能或标签进行筛选，快速找到需要的设备。'
          },
          {
            q: '模型和设备的兼容关系如何查看？',
            a: '在技能广场查看每个模型的"兼容设备"信息，或者在设备详情中查看支持的模型。'
          },
          {
            q: '任务执行失败如何处理？',
            a: '检查设备状态是否正常，确认模型是否正确部署，查看任务日志获取详细错误信息。'
          }
        ],
        description: ''
      }
    }
  ]

  return (
    <SidebarLayout title="帮助中心">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="flex">
            {/* 侧边导航 */}
            <div className="w-64 border-r bg-gray-50">
              <nav className="p-4">
                <ul className="space-y-2">
                  {helpSections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-lg">{section.icon}</span>
                        <span className="font-medium">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 p-8">
              {helpSections.find(s => s.id === activeSection)?.content && (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {helpSections.find(s => s.id === activeSection)?.content.title}
                  </h1>
                  <p className="text-gray-600 mb-8">
                    {helpSections.find(s => s.id === activeSection)?.content.description}
                  </p>

                  {/* 系统概览 */}
                  {activeSection === 'overview' && (
                    <div className="grid gap-6">
                      {helpSections.find(s => s.id === 'overview')?.content.features?.map((feature, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 设备管理 */}
                  {activeSection === 'devices' && (
                    <div className="space-y-8">
                      {helpSections.find(s => s.id === 'devices')?.content.sections?.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                          {section.steps && (
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                              {section.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          )}
                          {section.description && (
                            <p className="text-gray-600">{section.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 技能广场 */}
                  {activeSection === 'models' && (
                    <div className="space-y-8">
                      {helpSections.find(s => s.id === 'models')?.content.sections?.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                          {section.types && (
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                              {section.types.map((type, i) => (
                                <li key={i}>{type}</li>
                              ))}
                            </ul>
                          )}
                          {section.steps && (
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                              {section.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 任务管理 */}
                  {activeSection === 'tasks' && (
                    <div className="space-y-8">
                      {helpSections.find(s => s.id === 'tasks')?.content.sections?.map((section, index) => (
                        <div key={index}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                          {section.steps && (
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                              {section.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          )}
                          {section.description && (
                            <p className="text-gray-600">{section.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 常见问题 */}
                  {activeSection === 'faq' && (
                    <div className="space-y-6">
                      {helpSections.find(s => s.id === 'faq')?.content.questions?.map((qa, index) => (
                        <div key={index} className="border-b pb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{qa.q}</h3>
                          <p className="text-gray-600">{qa.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 联系支持 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">需要更多帮助？</h2>
          <p className="text-gray-600 mb-4">
            如果以上信息无法解决您的问题，请联系我们的技术支持团队
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            联系技术支持
          </button>
        </div>
      </div>
    </SidebarLayout>
  )
}