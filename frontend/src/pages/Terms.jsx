import React from 'react'

export default function Terms() {
  const lastUpdated = "January 2, 2026"

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-lg text-gray-600 mb-2">
          Please read these terms carefully before using Zembile Marketplace
        </p>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <a href="#acceptance" className="text-blue-600 hover:text-blue-800 transition-colors">1. Acceptance of Terms</a>
          <a href="#services" className="text-blue-600 hover:text-blue-800 transition-colors">2. Description of Services</a>
          <a href="#accounts" className="text-blue-600 hover:text-blue-800 transition-colors">3. User Accounts</a>
          <a href="#conduct" className="text-blue-600 hover:text-blue-800 transition-colors">4. User Conduct</a>
          <a href="#products" className="text-blue-600 hover:text-blue-800 transition-colors">5. Products & Pricing</a>
          <a href="#payment" className="text-blue-600 hover:text-blue-800 transition-colors">6. Payment Terms</a>
          <a href="#shipping" className="text-blue-600 hover:text-blue-800 transition-colors">7. Shipping & Delivery</a>
          <a href="#returns" className="text-blue-600 hover:text-blue-800 transition-colors">8. Returns & Refunds</a>
          <a href="#intellectual" className="text-blue-600 hover:text-blue-800 transition-colors">9. Intellectual Property</a>
          <a href="#privacy" className="text-blue-600 hover:text-blue-800 transition-colors">10. Privacy Policy</a>
          <a href="#limitation" className="text-blue-600 hover:text-blue-800 transition-colors">11. Limitation of Liability</a>
          <a href="#governing" className="text-blue-600 hover:text-blue-800 transition-colors">12. Governing Law</a>
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        {/* Section 1 */}
        <section id="acceptance" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              By accessing and using Zembile Marketplace ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-gray-700 mb-4">
              These Terms of Service ("Terms") govern your use of our website located at zembile.et (the "Service") operated by Zembile Marketplace ("us", "we", or "our").
            </p>
            <p className="text-gray-700">
              We reserve the right to update and change the Terms of Service from time to time without notice. Any new features that augment or enhance the current Service, including the release of new tools and resources, shall be subject to the Terms of Service.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="services" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Description of Services</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Zembile Marketplace is an e-commerce platform that connects customers with authentic Ethiopian products, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Coffee and traditional beverages</li>
              <li>Spices, food products, and culinary ingredients</li>
              <li>Traditional clothing and fashion accessories</li>
              <li>Handcrafted arts, crafts, and home decor</li>
              <li>Cultural artifacts and souvenirs</li>
              <li>Books, music, and educational materials</li>
            </ul>
            <p className="text-gray-700">
              We act as an intermediary between buyers and sellers, facilitating transactions while ensuring quality and authenticity of Ethiopian products.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="accounts" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Registration</h3>
            <p className="text-gray-700 mb-4">
              To access certain features of the Service, you must register for an account. When you register for an account, you must provide information that is accurate, complete, and current at all times.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>You are responsible for safeguarding the password and all activities under your account</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We cannot be held liable for any loss or damage from your failure to comply with this security obligation</li>
              <li>You may not use another user's account without permission</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Termination</h3>
            <p className="text-gray-700">
              We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="conduct" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. User Conduct</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Prohibited Activities:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Engage in fraudulent activities</li>
                  <li>Harass or abuse other users</li>
                  <li>Spam or send unsolicited communications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Content Guidelines:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>No offensive or inappropriate content</li>
                  <li>No false or misleading information</li>
                  <li>No copyrighted material without permission</li>
                  <li>No personal information of others</li>
                  <li>No commercial solicitation outside platform</li>
                  <li>Respect cultural sensitivities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="products" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Products & Pricing</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Information</h3>
            <p className="text-gray-700 mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>All prices are listed in Ethiopian Birr (ETB) unless otherwise specified</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to correct pricing errors</li>
              <li>International customers may be subject to additional taxes and duties</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
            <p className="text-gray-700">
              All products are subject to availability. We reserve the right to discontinue any product at any time. In case of unavailability after purchase, we will provide a full refund or suitable alternative.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="payment" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Payment Terms</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Accepted Payment Methods</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Digital Payments:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Chapa Payment Gateway</li>
                  <li>Telebirr Mobile Payment</li>
                  <li>CBE Birr</li>
                  <li>M-Birr</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Traditional Methods:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Bank Transfer</li>
                  <li>Cash on Delivery (COD)</li>
                  <li>Payment Proof Upload</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Processing</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Payment is required at the time of order placement</li>
              <li>We use secure, encrypted payment processing</li>
              <li>Your payment information is not stored on our servers</li>
              <li>Failed payments may result in order cancellation</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section id="shipping" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Shipping & Delivery</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Detailed shipping information is available on our <a href="/shipping" className="text-blue-600 hover:text-blue-800">Shipping Information</a> page. Key points include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Delivery times vary by location and shipping method selected</li>
              <li>Risk of loss and title for items pass to you upon delivery</li>
              <li>We are not responsible for delays caused by customs or postal services</li>
              <li>International shipments may be subject to customs duties and taxes</li>
              <li>Delivery confirmation may be required for high-value items</li>
            </ul>
          </div>
        </section>

        {/* Section 8 */}
        <section id="returns" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Returns & Refunds</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Our complete return policy is available on our <a href="/returns" className="text-blue-600 hover:text-blue-800">Returns & Exchanges</a> page. Summary:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>30-day return window for most items</li>
              <li>Items must be in original condition</li>
              <li>Refunds processed within 5-7 business days</li>
              <li>Return shipping costs may apply</li>
              <li>Some items are non-returnable (personalized, perishable)</li>
            </ul>
          </div>
        </section>

        {/* Section 9 */}
        <section id="intellectual" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Intellectual Property</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Content</h3>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Zembile Marketplace and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">User Content</h3>
            <p className="text-gray-700 mb-4">
              By posting content on our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display such content in connection with the Service.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Trademark Notice</h3>
            <p className="text-gray-700">
              "Zembile" and related marks are trademarks of Zembile Marketplace. You may not use these trademarks without our prior written consent.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="privacy" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Privacy Policy</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Key Privacy Points:</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                <li>We collect minimal necessary information</li>
                <li>Your data is encrypted and securely stored</li>
                <li>We never sell your personal information</li>
                <li>You can request data deletion at any time</li>
                <li>We comply with Ethiopian data protection laws</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 11 */}
        <section id="limitation" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Limitation of Liability</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              In no event shall Zembile Marketplace, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for consequential or incidental damages. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.
              </p>
            </div>
          </div>
        </section>

        {/* Section 12 */}
        <section id="governing" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">12. Governing Law</h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 mb-4">
              These Terms shall be interpreted and governed by the laws of the Federal Democratic Republic of Ethiopia, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700 mb-4">
              Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of Addis Ababa, Ethiopia.
            </p>
            <p className="text-gray-700">
              If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <div className="bg-zembile-gray text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms & Conditions, please contact us.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a href="mailto:legal@zembile.et" className="bg-zembile-yellow text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                ✉️ legal@zembile.et
              </a>
              <a href="tel:+251-11-123-4567" className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                📞 +251-11-123-4567
              </a>
              <a href="/contact" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors">
                💬 Contact Form
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              <p>Zembile Marketplace • Addis Ababa, Ethiopia • Business License: ET-2024-001234</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
