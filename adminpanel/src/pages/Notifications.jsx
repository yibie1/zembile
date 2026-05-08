import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'
import { ordersApi, paymentsApi } from '../services/api'
import { Link } from 'react-router-dom'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [read, setRead] = useState(new Set())

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ordersRes, proofsRes] = await Promise.all([
          ordersApi.getAll({ limit: 5, page: 1 }),
          paymentsApi.getProofs({ status: 'pending_verification', limit: 5 })
        ])

        const notifs = []

        // Recent orders
        ;(ordersRes.data || []).forEach(o => {
          notifs.push({
            id: `order-${o.orderId || o._id}`,
            type: 'order',
            title: 'New Order',
            message: `Order #${(o.orderId || o._id || '').slice(-8)} from ${o.customerInfo?.firstName} ${o.customerInfo?.lastName} — ETB ${(o.pricing?.total || o.total || 0).toLocaleString()}`,
            time: o.createdAt,
            link: '/orders',
            icon: '🛒',
            color: 'bg-blue-100 text-blue-600'
          })
        })

        // Pending payment proofs
        ;(proofsRes.data || []).forEach(p => {
          notifs.push({
            id: `proof-${p._id || p.id}`,
            type: 'payment',
            title: 'Payment Proof Pending',
            message: `Order #${(p.orderId || '').slice(-8)} — ETB ${p.amount?.toLocaleString()} awaiting verification`,
            time: p.createdAt,
            link: '/payments',
            icon: '💳',
            color: 'bg-yellow-100 text-yellow-600'
          })
        })

        // Sort by time
        notifs.sort((a, b) => new Date(b.time) - new Date(a.time))
        setNotifications(notifs)
      } catch (err) {
        console.error('Failed to load notifications:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const markRead = (id) => setRead(prev => new Set([...prev, id]))
  const markAllRead = () => setRead(new Set(notifications.map(n => n.id)))
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  const unreadCount = notifications.filter(n => !read.has(n.id)).length

  const fmt = (d) => {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(d).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium transition-colors">
            <CheckIcon className="w-4 h-4" />Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-sm font-medium text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-xl border p-4 flex items-start gap-4 transition-all ${!read.has(n.id) ? 'border-primary-200 shadow-sm' : 'border-gray-200'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${n.color}`}>
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{n.title}</span>
                      {!read.has(n.id) && <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{fmt(n.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!read.has(n.id) && (
                      <button onClick={() => markRead(n.id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Mark as read">
                        <CheckIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => dismiss(n.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Dismiss">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Link to={n.link} onClick={() => markRead(n.id)} className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium">
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
