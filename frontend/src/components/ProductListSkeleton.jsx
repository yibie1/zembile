import React from 'react'

export default function ProductListSkeleton({ viewMode = 'grid', count = 12 }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                <div className="flex items-center mb-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse ml-2 w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
                <div className="flex flex-wrap gap-1">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-12"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24"></div>
                  <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
          <div className="p-4">
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-full"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-3 w-2/3"></div>
            <div className="flex items-center mb-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse ml-2 w-12"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-3 w-full"></div>
            <div className="flex flex-wrap gap-1 mb-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-5 bg-gray-200 rounded-full animate-pulse w-12"></div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}