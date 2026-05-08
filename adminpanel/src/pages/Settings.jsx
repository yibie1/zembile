import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const ETHIOPIAN_BANKS = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia (CBE)', accountNumber: '1000123456789', branch: 'Addis Ababa Main Branch', swiftCode: 'CBETETAA' },
  { id: 'dashen', name: 'Dashen Bank', accountNumber: '0012345678901', branch: 'Bole Branch', swiftCode: 'DASHETET' },
  { id: 'awash', name: 'Awash Bank', accountNumber: '01320000123456', branch: 'Kazanchis Branch', swiftCode: 'AWASETET' },
  { id: 'boa', name: 'Bank of Abyssinia', accountNumber: '123456789012', branch: 'Piazza Branch', swiftCode: 'ABYSETAA' }
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('store')
  const [saving, setSaving] = useState(false)

  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Zembile Marketplace',
    storeEmail: 'hello@zembile.et',
    storePhone: '+251-11-123-4567',
    storeAddress: 'Bole Sub-City, Addis Ababa, Ethiopia',
    currency: 'ETB',
    freeShippingThreshold: 500,
    defaultShippingCost: 50,
    orderPrefix: 'ZMB'
  })

  const [paymentSettings, setPaymentSettings] = useState({
    chapaEnabled: true,
    bankTransferEnabled: true,
    chapaPublicKey: import.meta.env.VITE_CHAPA_PUBLIC_KEY || '',
    accountName: 'Zembile Marketplace PLC'
  })

  const handleSave = async (section) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(`${section} settings saved!`)
    setSaving(false)
  }

  const tabs = [
    { id: 'store', label: '🏪 Store' },
    { id: 'payment', label: '💳 Payment' },
    { id: 'banks', label: '🏦 Bank Accounts' },
    { id: 'notifications', label: '🔔 Notifications' }
  ]

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your store settings</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'store' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Store Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Store Name', 'storeName', 'text'],
              ['Store Email', 'storeEmail', 'email'],
              ['Store Phone', 'storePhone', 'tel'],
              ['Currency', 'currency', 'text'],
              ['Free Shipping Threshold (ETB)', 'freeShippingThreshold', 'number'],
              ['Default Shipping Cost (ETB)', 'defaultShippingCost', 'number'],
              ['Order ID Prefix', 'orderPrefix', 'text']
            ].map(([label, field, type]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type={type} value={storeSettings[field]} onChange={e => setStoreSettings(p => ({ ...p, [field]: e.target.value }))} className={inp} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
              <textarea value={storeSettings.storeAddress} onChange={e => setStoreSettings(p => ({ ...p, storeAddress: e.target.value }))} className={inp} rows={2} />
            </div>
          </div>
          <button onClick={() => handleSave('Store')} disabled={saving} className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Store Settings'}
          </button>
        </motion.div>
      )}

      {activeTab === 'payment' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-700 text-sm">CHAPA</div>
                <div>
                  <div className="font-semibold text-gray-900">Chapa Payment Gateway</div>
                  <div className="text-sm text-gray-500">Telebirr, CBE Birr, mobile money</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paymentSettings.chapaEnabled} onChange={e => setPaymentSettings(p => ({ ...p, chapaEnabled: e.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🏦</div>
                <div>
                  <div className="font-semibold text-gray-900">Bank Transfer</div>
                  <div className="text-sm text-gray-500">Manual payment with proof upload</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={paymentSettings.bankTransferEnabled} onChange={e => setPaymentSettings(p => ({ ...p, bankTransferEnabled: e.target.checked }))} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          <button onClick={() => handleSave('Payment')} disabled={saving} className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </motion.div>
      )}

      {activeTab === 'banks' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Accounts</h3>
          <p className="text-sm text-gray-500 mb-6">These accounts are shown to customers for bank transfer payments</p>
          <div className="space-y-4">
            {ETHIOPIAN_BANKS.map(bank => (
              <div key={bank.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{bank.name}</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Account Number:</span><div className="font-mono font-medium">{bank.accountNumber}</div></div>
                  <div><span className="text-gray-500">Swift Code:</span><div className="font-mono font-medium">{bank.swiftCode}</div></div>
                  <div><span className="text-gray-500">Branch:</span><div className="font-medium">{bank.branch}</div></div>
                  <div><span className="text-gray-500">Account Name:</span><div className="font-medium">Zembile Marketplace PLC</div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
            💡 To update bank account details, edit the <code className="bg-blue-100 px-1 rounded">BANK_ACCOUNTS</code> constant in the checkout page and payment proof page.
          </div>
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              ['New Order Alerts', 'Get notified when a new order is placed', true],
              ['Payment Proof Submissions', 'Alert when a customer uploads payment proof', true],
              ['Low Stock Warnings', 'Alert when product stock falls below threshold', true],
              ['New Customer Registrations', 'Notify when a new customer signs up', false],
              ['Review Submissions', 'Alert when a new review is submitted', true]
            ].map(([title, desc, defaultVal]) => (
              <div key={title} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={defaultVal} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
          <button onClick={() => handleSave('Notification')} disabled={saving} className="mt-6 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </motion.div>
      )}
    </div>
  )
}
