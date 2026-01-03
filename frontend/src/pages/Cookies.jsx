import React from 'react'

export default function Cookies() {
  const lastUpdated = "January 2, 2026"

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
        <p className="text-lg text-gray-600 mb-2">
          Learn about how we use cookies and similar technologies to enhance your experience
        </p>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </div>

      {/* What are Cookies */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What are Cookies?</h2>
          <p className="text-gray-700 mb-4">
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience by remembering your preferences and analyzing how you use our site.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-600 text-sm">Cookies cannot harm your device or access personal files</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Better Experience</h3>
              <p className="text-gray-600 text-sm">Help us remember your preferences and improve site performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Your Control</h3>
              <p className="text-gray-600 text-sm">You can manage or disable cookies at any time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Types of Cookies We Use</h2>
        <div className="grid gap-6">
          {/* Essential Cookies */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Essential Cookies</h3>
                  <p className="text-sm text-gray-600">Required for basic website functionality</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Always Active</span>
            </div>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Authentication and login status</li>
                  <li>• Shopping cart contents</li>
                  <li>• Security and fraud prevention</li>
                  <li>• Load balancing</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Duration:</h4>
                <p className="text-sm text-gray-700">Session cookies (deleted when you close your browser) or up to 1 year for persistent functionality</p>
              </div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Analytics Cookies</h3>
                  <p className="text-sm text-gray-600">Help us understand how visitors use our site</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Optional</span>
            </div>
            <p className="text-gray-700 mb-4">
              These cookies collect information about how you use our website, such as which pages you visit and how long you stay. This helps us improve our site performance and user experience.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What we track:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Page views and popular content</li>
                  <li>• Time spent on pages</li>
                  <li>• Navigation patterns</li>
                  <li>• Error pages and technical issues</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Third-party services:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Google Analytics (anonymized)</li>
                  <li>• Performance monitoring tools</li>
                  <li>• Heat mapping services</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-purple-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-5 4v6m-3-3h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Marketing Cookies</h3>
                  <p className="text-sm text-gray-600">Personalize ads and content</p>
                </div>
              </div>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">Optional</span>
            </div>
            <p className="text-gray-700 mb-4">
              These cookies are used to deliver personalized advertisements and content based on your interests and browsing behavior.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Personalization:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Product recommendations</li>
                  <li>• Targeted promotions</li>
                  <li>• Retargeting campaigns</li>
                  <li>• Social media integration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Partners:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Facebook Pixel</li>
                  <li>• Google Ads</li>
                  <li>• Email marketing platforms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-yellow-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Functional Cookies</h3>
                  <p className="text-sm text-gray-600">Remember your preferences and settings</p>
                </div>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Optional</span>
            </div>
            <p className="text-gray-700 mb-4">
              These cookies enable enhanced functionality and personalization, such as remembering your language preference or region.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Preferences:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Language and region settings</li>
                  <li>• Currency preferences</li>
                  <li>• Theme and display options</li>
                  <li>• Accessibility settings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Live chat functionality</li>
                  <li>• Social media widgets</li>
                  <li>• Video players</li>
                  <li>• Interactive maps</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Managing Your Cookie Preferences</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
            </p>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded mr-3 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">C</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Chrome</p>
                  <p className="text-sm text-gray-600">Settings → Privacy and security → Cookies</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded mr-3 flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">F</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Firefox</p>
                  <p className="text-sm text-gray-600">Options → Privacy & Security → Cookies</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded mr-3 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Safari</p>
                  <p className="text-sm text-gray-600">Preferences → Privacy → Cookies</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Cookie Consent Manager</h3>
            <p className="text-gray-700 mb-4">
              Use our cookie consent manager to customize your preferences for this website specifically.
            </p>
            <div className="space-y-4">
              <button className="w-full bg-zembile-yellow text-gray-900 py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                🍪 Manage Cookie Preferences
              </button>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                ✅ Accept All Cookies
              </button>
              <button className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                ❌ Reject Optional Cookies
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: Disabling certain cookies may affect website functionality and your user experience.
            </p>
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-700 mb-6">
            Some cookies on our site are set by third-party services. These help us provide enhanced functionality and analyze site performance.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Service</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Duration</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Privacy Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Google Analytics</td>
                  <td className="px-4 py-3 text-gray-700">Website analytics and performance</td>
                  <td className="px-4 py-3 text-gray-700">2 years</td>
                  <td className="px-4 py-3">
                    <a href="https://policies.google.com/privacy" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      View Policy
                    </a>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">Facebook Pixel</td>
                  <td className="px-4 py-3 text-gray-700">Advertising and retargeting</td>
                  <td className="px-4 py-3 text-gray-700">90 days</td>
                  <td className="px-4 py-3">
                    <a href="https://www.facebook.com/privacy/policy/" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      View Policy
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Chapa Payment</td>
                  <td className="px-4 py-3 text-gray-700">Payment processing security</td>
                  <td className="px-4 py-3 text-gray-700">Session</td>
                  <td className="px-4 py-3">
                    <a href="https://chapa.co/privacy" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                      View Policy
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <div className="bg-zembile-gray text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Questions About Cookies?</h3>
          <p className="text-gray-300 mb-6">
            If you have any questions about our use of cookies or this policy, please contact us.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="mailto:privacy@zembile.et" className="bg-zembile-yellow text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              ✉️ privacy@zembile.et
            </a>
            <a href="tel:+251-11-123-4567" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              📞 +251-11-123-4567
            </a>
            <a href="/contact" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              💬 Contact Form
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Data Protection Officer • Zembile Marketplace • Addis Ababa, Ethiopia</p>
          </div>
        </div>
      </section>
    </div>
  )
}