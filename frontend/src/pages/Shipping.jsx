import React from 'react'

export default function Shipping() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fast, reliable delivery across Ethiopia and worldwide shipping for authentic Ethiopian products
        </p>
      </div>

      {/* Shipping Options */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Express Delivery</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Addis Ababa: Same day delivery
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Major cities: 1-2 business days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Free for orders over 1,000 ETB
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Real-time tracking included
            </li>
          </ul>
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold">Starting from 50 ETB</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Standard Delivery</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Addis Ababa: 1-2 business days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Regional cities: 3-5 business days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Remote areas: 5-7 business days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              SMS notifications included
            </li>
          </ul>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-semibold">Starting from 25 ETB</p>
          </div>
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Zones & Timeframes</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-zembile-yellow">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Zone</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Areas Covered</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Standard Delivery</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Express Delivery</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-900">Shipping Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Zone 1</td>
                <td className="px-6 py-4 text-gray-700">Addis Ababa</td>
                <td className="px-6 py-4 text-gray-700">1-2 days</td>
                <td className="px-6 py-4 text-gray-700">Same day</td>
                <td className="px-6 py-4 text-gray-700">25-50 ETB</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Zone 2</td>
                <td className="px-6 py-4 text-gray-700">Dire Dawa, Bahir Dar, Mekelle, Hawassa</td>
                <td className="px-6 py-4 text-gray-700">3-5 days</td>
                <td className="px-6 py-4 text-gray-700">1-2 days</td>
                <td className="px-6 py-4 text-gray-700">50-100 ETB</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Zone 3</td>
                <td className="px-6 py-4 text-gray-700">Regional capitals & major towns</td>
                <td className="px-6 py-4 text-gray-700">5-7 days</td>
                <td className="px-6 py-4 text-gray-700">3-4 days</td>
                <td className="px-6 py-4 text-gray-700">75-150 ETB</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Zone 4</td>
                <td className="px-6 py-4 text-gray-700">Remote areas & rural locations</td>
                <td className="px-6 py-4 text-gray-700">7-10 days</td>
                <td className="px-6 py-4 text-gray-700">5-7 days</td>
                <td className="px-6 py-4 text-gray-700">100-200 ETB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* International Shipping */}
      <div className="bg-gradient-to-r from-zembile-yellow to-yellow-400 rounded-xl p-8 mb-12 text-gray-900">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-zembile-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold">International Shipping</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Available Countries</h4>
            <ul className="space-y-2">
              <li>🇺🇸 United States (7-14 days)</li>
              <li>🇨🇦 Canada (7-14 days)</li>
              <li>🇬🇧 United Kingdom (5-10 days)</li>
              <li>🇩🇪 Germany (5-10 days)</li>
              <li>🇦🇺 Australia (10-21 days)</li>
              <li>🌍 Other countries (contact us)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">International Rates</h4>
            <ul className="space-y-2">
              <li>• Standard: $15-25 USD</li>
              <li>• Express: $35-50 USD</li>
              <li>• Free shipping over $200 USD</li>
              <li>• Customs duties may apply</li>
              <li>• Full tracking included</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Shipping Policies */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policies</h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>All orders are processed within 1-2 business days</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free shipping on orders over 500 ETB within Addis Ababa</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Signature required for orders over 2,000 ETB</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Fragile items are carefully packaged with extra protection</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Weekend and holiday deliveries available in select areas</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h3>
          <p className="text-gray-700 mb-6">
            Stay updated on your order status with our real-time tracking system.
          </p>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">1</div>
              <div>
                <p className="font-semibold">Order Confirmed</p>
                <p className="text-sm text-gray-600">Your order has been received and is being processed</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">2</div>
              <div>
                <p className="font-semibold">Preparing for Shipment</p>
                <p className="text-sm text-gray-600">Items are being carefully packaged</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">3</div>
              <div>
                <p className="font-semibold">Out for Delivery</p>
                <p className="text-sm text-gray-600">Your package is on its way to you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-zembile-gray text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Need Help with Shipping?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our customer service team is here to help with any shipping questions or concerns.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:+251-11-123-4567" className="bg-zembile-yellow text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            📞 Call: +251-11-123-4567
          </a>
          <a href="mailto:shipping@zembile.et" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            ✉️ Email: shipping@zembile.et
          </a>
        </div>
      </div>
    </div>
  )
}
