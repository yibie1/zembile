import React from 'react'

export default function Accessibility() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Zembile Marketplace is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone.
        </p>
      </div>

      {/* Commitment */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Accessibility Commitment</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Inclusive Design</h3>
              <p className="text-gray-600 text-sm">Designing for all users, regardless of ability or technology</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WCAG Compliance</h3>
              <p className="text-gray-600 text-sm">Following Web Content Accessibility Guidelines 2.1 AA standards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Continuous Improvement</h3>
              <p className="text-gray-600 text-sm">Regular testing and updates to enhance accessibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Accessibility Features</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Visual Accessibility
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>High contrast color schemes</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Scalable fonts and adjustable text size</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Alternative text for all images</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Clear visual focus indicators</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Consistent navigation and layout</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                <span>Color is not the only way to convey information</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              Audio & Motor Accessibility
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>Screen reader compatibility</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>Keyboard navigation support</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>Voice control compatibility</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>Adjustable time limits</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>Large clickable areas</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                <span>No auto-playing audio or video</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Assistive Technologies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Assistive Technologies</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-700 mb-6">
            Our website is designed to work with a wide range of assistive technologies and devices:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Screen Readers</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• JAWS (Windows)</li>
                <li>• NVDA (Windows)</li>
                <li>• VoiceOver (macOS/iOS)</li>
                <li>• TalkBack (Android)</li>
                <li>• Dragon NaturallySpeaking</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-3">Browsers</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Chrome (latest versions)</li>
                <li>• Firefox (latest versions)</li>
                <li>• Safari (latest versions)</li>
                <li>• Edge (latest versions)</li>
                <li>• Mobile browsers</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-3">Input Methods</h4>
              <ul className="text-purple-800 text-sm space-y-1">
                <li>• Keyboard navigation</li>
                <li>• Voice commands</li>
                <li>• Switch controls</li>
                <li>• Eye tracking devices</li>
                <li>• Touch screen gestures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Keyboard Navigation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Keyboard Navigation Guide</h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-700 mb-6">
            You can navigate our website using only your keyboard. Here are the key shortcuts:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Basic Navigation</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Move to next element</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Tab</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Move to previous element</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Shift + Tab</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Activate link or button</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Scroll page</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Arrow Keys</kbd>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Advanced Shortcuts</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Skip to main content</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Alt + M</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Open search</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Alt + S</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Go to cart</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Alt + C</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700">Close modal/dropdown</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">Escape</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Known Issues */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Known Issues & Improvements</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Areas We're Working On</h3>
          <p className="text-yellow-800 mb-4">
            We're continuously working to improve accessibility. Here are some areas where we're making enhancements:
          </p>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2"></span>
              <span>Enhanced mobile screen reader support for complex product filters</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2"></span>
              <span>Improved keyboard navigation for image galleries</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2"></span>
              <span>Better voice control integration for checkout process</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2"></span>
              <span>Additional language support for screen readers</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Feedback */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Feedback</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Report an Issue</h3>
            <p className="text-gray-700 mb-4">
              If you encounter any accessibility barriers while using our website, please let us know. Your feedback helps us improve.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What to Include:</h4>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Description of the issue</li>
                  <li>• Page URL where you encountered it</li>
                  <li>• Browser and assistive technology used</li>
                  <li>• Steps to reproduce the problem</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Alternative Access</h3>
            <p className="text-gray-700 mb-4">
              If you need assistance accessing any content or functionality, we're here to help through alternative means.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">We Can Provide:</h4>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Phone assistance for orders</li>
                  <li>• Email support with detailed descriptions</li>
                  <li>• Alternative format product information</li>
                  <li>• Personal shopping assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <div className="bg-zembile-gray text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Accessibility Support</h3>
          <p className="text-gray-300 mb-6">
            Our accessibility team is dedicated to helping you have the best possible experience on our website.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <a href="mailto:accessibility@zembile.et" className="bg-zembile-yellow text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              ✉️ accessibility@zembile.et
            </a>
            <a href="tel:+251-11-123-4567" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              📞 +251-11-123-4567
            </a>
            <a href="/contact" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
              💬 Contact Form
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Accessibility Coordinator • Zembile Marketplace • Addis Ababa, Ethiopia</p>
            <p className="mt-2">We aim to respond to accessibility feedback within 2 business days</p>
          </div>
        </div>
      </section>
    </div>
  )
}