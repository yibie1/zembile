import React from 'react'
import { Outlet } from 'react-router-dom'

export default function App(){
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-800 text-white p-4">Zembile Admin</header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
