import { useEffect, useState } from 'react'
import api from '../api/axios'
import { Company } from '../types'

interface AdminUser {
  id: number
  fullName: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  const loadData = () => {
    api.get('/admin/users').then((res) => setUsers(res.data))
    api.get('/admin/companies').then((res) => setCompanies(res.data))
  }

  useEffect(() => {
    loadData()
  }, [])

  const approveCompany = async (id: number) => {
    await api.patch(`/admin/companies/${id}/approve`)
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, approved: true } : c)))
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Companies</h1>
        <div className="space-y-2">
          {companies.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{c.name}</p>
                <p className="text-sm text-slate-500">{c.location}</p>
              </div>
              {c.approved ? (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">Approved</span>
              ) : (
                <button
                  onClick={() => approveCompany(c.id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-500 text-white hover:bg-brand-600"
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Users</h1>
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{u.fullName}</p>
                <p className="text-sm text-slate-500">{u.email} · {u.role}</p>
              </div>
              <button
                onClick={() => deleteUser(u.id)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
