import { useState, useEffect } from 'react'
import { FiUsers, FiShield } from 'react-icons/fi'
import * as authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    authService
      .getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin'
    setUpdatingId(user._id)
    setError(null)
    try {
      const updated = await authService.updateUserRole(user._id, nextRole)
      setUsers((prev) => prev.map((u) => (u._id === user._id ? updated : u)))
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-aurora-purple/15 flex items-center justify-center text-aurora-purple">
          <FiUsers />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-heading-white">Users</h1>
          <p className="text-sm text-slate-gray">Manage accounts and admin access</p>
        </div>
      </div>

      {error && (
        <div className="glass-card p-6 mt-6 border border-error/30 text-error text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-gray">Loading users…</div>
      ) : (
        <div className="glass-card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-cool-gray">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-white/[0.06] last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gradient-premium flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </span>
                        <span className="text-heading-white">{u.name}</span>
                        {u._id === currentUser?.id && (
                          <span className="text-xs text-cool-gray">(you)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-soft-silver">{u.email}</td>
                    <td className="px-6 py-4 text-cool-gray">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === 'admin' ? 'bestseller' : 'default'} className="capitalize">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={updatingId === u._id || u._id === currentUser?.id}
                        title={u._id === currentUser?.id ? "You can't change your own role" : ''}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-soft-silver hover:border-aurora-purple/40 hover:text-aurora-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FiShield size={12} />
                        {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
