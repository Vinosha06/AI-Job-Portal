import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Notification } from '../types'

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notifications/my').then((res) => {
      setNotifications(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Notifications</h1>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-slate-500">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="font-medium text-slate-800">{n.title}</p>
              <p className="text-sm text-slate-500">{n.message}</p>
              <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
