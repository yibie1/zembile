import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

export default function Account() {
  const { user, token, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  useEffect(() => {
    if (!user && !token) { navigate('/auth/login'); return }
    if (user) setProfile({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '', phone: user.phone || '' })
  }, [user, token, navigate])

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.updateProfile(profile)
      updateUser(res.user || profile)
      toast.success('Profile updated!')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Failed to update profile')
    } finally { setLoading(false) }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return }
    if (passwords.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await authApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      toast.success('Password changed!')
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    } finally { setLoading(false) }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ]

  const inputCls = (disabled) => `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zembile-yellow focus:border-transparent text-sm ${disabled ? 'bg-gray-50 text-gray-500' : ''}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-zembile-gray">{user?.firstName?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <nav className="space-y-1">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-sm ${tab === t.id ? 'bg-zembile-yellow text-zembile-gray font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <span>{t.icon}</span><span>{t.name}</span>
                  </button>
                ))}
                <button onClick={() => { logout(); navigate('/') }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors text-sm mt-4">
                  <span>🚪</span><span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              {tab === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                    <button onClick={() => setEditing(!editing)} className="px-4 py-2 bg-zembile-yellow text-zembile-gray rounded-lg font-medium hover:bg-yellow-400 transition-colors text-sm">
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[['First Name', 'firstName', 'text'], ['Last Name', 'lastName', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel']].map(([label, field, type]) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input type={type} value={profile[field]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
                        </div>
                      ))}
                    </div>
                    {editing && (
                      <button type="submit" disabled={loading} className="px-6 py-2 bg-zembile-gray text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    )}
                  </form>
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
                    <Link to="/orders" className="text-zembile-gray hover:text-gray-600 font-medium text-sm">View All Orders →</Link>
                  </div>
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-5xl mb-4">📦</div>
                    <p>View your complete order history on the <Link to="/orders" className="text-zembile-gray underline">Orders page</Link></p>
                  </div>
                </div>
              )}

              {tab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h4>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      {[['Current Password', 'currentPassword'], ['New Password', 'newPassword'], ['Confirm New Password', 'confirmPassword']].map(([label, field]) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input type="password" value={passwords[field]} onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))} className={inputCls(false)} required />
                        </div>
                      ))}
                      <button type="submit" disabled={loading} className="px-6 py-2 bg-zembile-gray text-white rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm">
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
