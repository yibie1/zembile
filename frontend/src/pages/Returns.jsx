import React from 'react'

export default function Returns() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We want you to love your purchase. If you're not completely satisfied, we're here to help with easy returns and exchanges.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">30-Day Returns</h3>
            <p className="text-gray-600">Return items within 30 days of delivery for a full refund</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free Exchanges</h3>
            <p className="text-gray-600">Exchange for different size or color at no extra cost</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guarantee</h3>
            <p className="text-gray-600">100% satisfaction guarantee on all authentic Ethiopian products</p>
          </div>
        </div>
      </div>

      {/* Return Conditions */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Returnable Items
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Items in original condition with tags attached</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Unworn clothing and accessories</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Unopened food and beverage items</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Home decor items in original packaging</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Crafts and artwork in original condition</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
              <span>Items with original receipt or order confirmation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Non-Returnable Items
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Personalized or custom-made items</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Perishable food items (coffee beans after opening)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Items damaged by misuse or normal wear</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Items returned after 30 days</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Items without original packaging or tags</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2"></span>
              <span>Gift cards and digital products</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Return Process */}
      <div className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Return an Item</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gray-900">1</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Initiate Return</h3>
            <p className="text-gray-600 text-sm">Contact us within 30 days via phone, email, or your account dashboard</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gray-900">2</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Get Return Label</h3>
            <p className="text-gray-600 text-sm">We'll provide a prepaid return shipping label via email</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gray-900">3</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pack & Ship</h3>
            <p className="text-gray-600 text-sm">Package items securely and drop off at any authorized shipping location</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-gray-900">4</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Get Refund</h3>
            <p className="text-gray-600 text-sm">Receive your refund within 5-7 business days after we receive the item</p>
          </div>
        </div>
      </div>

      {/* Refund Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Refund Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Original Payment Method</p>
                <p className="text-sm text-gray-600">Refund to the card or account used for purchase</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Store Credit</p>
                <p className="text-sm text-gray-600">Get instant store credit for faster future purchases</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div>
                <p className="font-semibold text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct transfer to your Ethiopian bank account</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Exchange Options</h3>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Size Exchange</h4>
              <p className="text-gray-600 text-sm mb-3">Different size of the same item</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">FREE</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Color Exchange</h4>
              <p className="text-gray-600 text-sm mb-3">Different color of the same item</p>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">FREE</span>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Different Item</h4>
              <p className="text-gray-600 text-sm mb-3">Exchange for a completely different product</p>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Price difference may apply</span>
            </div>
          </div>
        </div>
      </div>

      {/* Damaged or Defective Items */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-12">
        <div className="flex items-start">
          <svg className="w-8 h-8 text-red-600 mr-4 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-3">Damaged or Defective Items</h3>
            <p className="text-red-800 mb-4">
              If you receive a damaged or defective item, we'll make it right immediately:
            </p>
            <ul className="space-y-2 text-red-800">
              <li>• Contact us within 48 hours of delivery</li>
              <li>• Provide photos of the damaged item</li>
              <li>• We'll arrange immediate replacement or full refund</li>
              <li>• No need to return the damaged item in most cases</li>
              <li>• Priority shipping for replacement items</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-zembile-gray text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Need Help with Returns?</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Our customer service team is ready to assist you with any return or exchange questions.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <a href="tel:+251-11-123-4567" className="bg-zembile-yellow text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            📞 Call Us
          </a>
          <a href="mailto:returns@zembile.et" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            ✉️ Email Us
          </a>
          <a href="/contact" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
            💬 Live Chat
          </a>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          <p>Returns Department Hours: Monday - Friday, 8:00 AM - 6:00 PM EAT</p>
        </div>
      </div>
    </div>
  )
}
