import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openFAQ, setOpenFAQ] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'general', name: 'General', icon: '❓', count: 8 },
    { id: 'orders', name: 'Orders & Shipping', icon: '📦', count: 12 },
    { id: 'payments', name: 'Payments', icon: '💳', count: 7 },
    { id: 'products', name: 'Products', icon: '🛍️', count: 9 },
    { id: 'returns', name: 'Returns & Exchanges', icon: '↩️', count: 6 },
    { id: 'account', name: 'Account', icon: '👤', count: 5 }
  ]

  const faqs = {
    general: [
      {
        id: 1,
        question: 'What is Zembile?',
        answer: 'Zembile is Ethiopia\'s premier online marketplace for authentic Ethiopian products. We connect customers worldwide with traditional crafts, coffee, spices, textiles, and other cultural items directly from Ethiopian artisans and producers.'
      },
      {
        id: 2,
        question: 'Are all products authentic Ethiopian items?',
        answer: 'Yes, absolutely! Every product on Zembile is sourced directly from Ethiopian artisans, farmers, and producers. We have strict quality control measures and work only with verified local partners to ensure authenticity.'
      },
      {
        id: 3,
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. We offer both standard and express shipping options for international orders.'
      },
      {
        id: 4,
        question: 'How do I track my order?',
        answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can track your package using this number on our website or the carrier\'s tracking page. You can also view order status in your account dashboard.'
      },
      {
        id: 5,
        question: 'What payment methods do you accept?',
        answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard), bank transfers, mobile money (for Ethiopian customers), and our integrated Chapa payment system for secure transactions.'
      },
      {
        id: 6,
        question: 'Is my personal information secure?',
        answer: 'Yes, we take data security very seriously. We use industry-standard SSL encryption for all transactions and never store sensitive payment information. Your personal data is protected according to international privacy standards.'
      },
      {
        id: 7,
        question: 'How can I contact customer support?',
        answer: 'You can reach our customer support team via email at support@zembile.com, phone at +251-11-123-4567, or through our live chat feature. We\'re available 24/7 to help with any questions or concerns.'
      },
      {
        id: 8,
        question: 'Do you have a physical store?',
        answer: 'Currently, Zembile operates as an online-only marketplace. However, we partner with local artisan workshops and markets across Ethiopia. You can visit our partner locations listed on our website.'
      }
    ],
    orders: [
      {
        id: 9,
        question: 'How long does shipping take?',
        answer: 'Shipping times vary by location: Within Addis Ababa (same day - 2 days), Within Ethiopia (2-5 days), International (7-21 days depending on destination). Express shipping options are available for faster delivery.'
      },
      {
        id: 10,
        question: 'What are the shipping costs?',
        answer: 'Shipping is free for orders over 500 ETB within Ethiopia. For smaller orders and international shipping, costs are calculated based on weight, size, and destination. You\'ll see exact shipping costs at checkout.'
      },
      {
        id: 11,
        question: 'Can I change or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been processed yet. After processing begins, changes may not be possible. Contact customer support immediately for assistance.'
      },
      {
        id: 12,
        question: 'What if my package is damaged or lost?',
        answer: 'We take full responsibility for packages until they reach you safely. If your package arrives damaged or gets lost in transit, contact us immediately with photos (if damaged) and we\'ll send a replacement or provide a full refund.'
      },
      {
        id: 13,
        question: 'Do you offer gift wrapping?',
        answer: 'Yes! We offer beautiful Ethiopian-themed gift wrapping for a small additional fee. You can select this option during checkout and even include a personalized message card.'
      },
      {
        id: 14,
        question: 'Can I schedule a delivery?',
        answer: 'For local deliveries within Addis Ababa, you can schedule delivery for a specific date and time slot. This service is available during checkout for eligible orders.'
      },
      {
        id: 15,
        question: 'What happens if I\'m not home for delivery?',
        answer: 'Our delivery partners will attempt delivery 2-3 times. If unsuccessful, the package will be held at the nearest pickup location. You\'ll receive notifications with pickup details and can reschedule delivery.'
      },
      {
        id: 16,
        question: 'Do you deliver to rural areas?',
        answer: 'Yes, we deliver throughout Ethiopia including rural areas. Delivery times may be longer for remote locations, and additional shipping fees may apply. Contact us for specific location availability.'
      },
      {
        id: 17,
        question: 'Can I track multiple orders together?',
        answer: 'Yes, in your account dashboard, you can view and track all your orders in one place. Each order will have its own tracking number and status updates.'
      },
      {
        id: 18,
        question: 'What if I need my order urgently?',
        answer: 'We offer express shipping and same-day delivery (in Addis Ababa) for urgent orders. Contact customer support to discuss expedited options and additional fees.'
      },
      {
        id: 19,
        question: 'Do you provide delivery notifications?',
        answer: 'Yes, you\'ll receive SMS and email notifications at key stages: order confirmation, processing, shipped, out for delivery, and delivered. You can manage notification preferences in your account.'
      },
      {
        id: 20,
        question: 'Can I combine multiple orders for shipping?',
        answer: 'If you place multiple orders within a short timeframe and they haven\'t been processed yet, we may be able to combine them to save on shipping costs. Contact customer support to request order combination.'
      }
    ],
    payments: [
      {
        id: 21,
        question: 'What payment methods are accepted?',
        answer: 'We accept Visa, Mastercard, bank transfers, mobile money (Telebirr, M-Birr), and our secure Chapa payment system. International customers can use major credit cards and PayPal.'
      },
      {
        id: 22,
        question: 'Is it safe to pay online?',
        answer: 'Absolutely! We use bank-level SSL encryption and PCI DSS compliant payment processing. We never store your payment information, and all transactions are processed through secure, verified payment gateways.'
      },
      {
        id: 23,
        question: 'Can I pay with mobile money?',
        answer: 'Yes, Ethiopian customers can pay using Telebirr, M-Birr, and other local mobile money services. Simply select mobile money at checkout and follow the prompts to complete payment.'
      },
      {
        id: 24,
        question: 'Do you accept bank transfers?',
        answer: 'Yes, we accept bank transfers for larger orders. You can upload payment proof after completing the transfer. Bank transfer details are provided during checkout.'
      },
      {
        id: 25,
        question: 'What currencies do you accept?',
        answer: 'Our primary currency is Ethiopian Birr (ETB). International customers can pay in USD, EUR, or their local currency through our payment processors, with automatic conversion to ETB.'
      },
      {
        id: 26,
        question: 'When is my payment charged?',
        answer: 'Your payment is charged immediately when you place an order. For bank transfers, your order is confirmed once we receive and verify the payment.'
      },
      {
        id: 27,
        question: 'Can I get a receipt for my purchase?',
        answer: 'Yes, you\'ll automatically receive a digital receipt via email after payment. You can also download receipts from your account dashboard for tax or expense purposes.'
      }
    ],
    products: [
      {
        id: 28,
        question: 'How do I know if a product is authentic?',
        answer: 'All our products come with authenticity certificates and detailed information about the artisan or producer. We personally visit and verify all our partners to ensure genuine Ethiopian craftsmanship.'
      },
      {
        id: 29,
        question: 'Can I request custom products?',
        answer: 'Yes! Many of our artisan partners accept custom orders. Contact us with your requirements, and we\'ll connect you with the appropriate craftsperson. Custom orders may take longer and require advance payment.'
      },
      {
        id: 30,
        question: 'Do you have size guides for clothing?',
        answer: 'Yes, each clothing item includes detailed size charts with measurements in both Ethiopian and international sizing. If you\'re unsure, our customer support can help you choose the right size.'
      },
      {
        id: 31,
        question: 'How fresh are the coffee and spices?',
        answer: 'Our coffee is roasted weekly and spices are ground fresh before shipping. All products include roast/production dates and best-by dates. We guarantee freshness or offer free replacements.'
      },
      {
        id: 32,
        question: 'Can I see more photos of products?',
        answer: 'Each product page includes multiple high-resolution photos. If you need additional angles or details, contact customer support and we can provide more images or arrange a video call with the artisan.'
      },
      {
        id: 33,
        question: 'Do you offer product care instructions?',
        answer: 'Yes, every product comes with detailed care instructions in both English and Amharic. For traditional items, we include cultural context and proper usage guidelines.'
      },
      {
        id: 34,
        question: 'Are your products eco-friendly?',
        answer: 'Most of our products are made using traditional, sustainable methods with natural materials. We prioritize eco-friendly artisans and include sustainability information on product pages.'
      },
      {
        id: 35,
        question: 'Can I buy products in bulk?',
        answer: 'Yes, we offer wholesale pricing for bulk orders. Contact our business sales team for quantity discounts, custom packaging, and special arrangements for large orders.'
      },
      {
        id: 36,
        question: 'Do you have seasonal products?',
        answer: 'Yes, we feature seasonal items like holiday decorations, harvest-time foods, and festival-specific crafts. Subscribe to our newsletter to be notified about seasonal collections.'
      }
    ],
    returns: [
      {
        id: 37,
        question: 'What is your return policy?',
        answer: 'We offer 30-day returns for most items in original condition. Perishable items (food, coffee) can be returned within 7 days if unopened. Custom items are generally non-returnable unless defective.'
      },
      {
        id: 38,
        question: 'How do I return an item?',
        answer: 'Log into your account, go to order history, and click "Return Item." Follow the prompts to print a return label. Package the item securely and drop it off at any authorized shipping location.'
      },
      {
        id: 39,
        question: 'Who pays for return shipping?',
        answer: 'We provide free return shipping for defective items or our errors. For other returns, customers are responsible for return shipping costs, which will be deducted from the refund.'
      },
      {
        id: 40,
        question: 'How long do refunds take?',
        answer: 'Refunds are processed within 3-5 business days after we receive the returned item. The money will appear in your original payment method within 5-10 business days depending on your bank.'
      },
      {
        id: 41,
        question: 'Can I exchange an item instead of returning it?',
        answer: 'Yes, exchanges are available for size or color variations of the same product. The exchange process is similar to returns, and we\'ll ship the new item once we receive the original.'
      },
      {
        id: 42,
        question: 'What if I received the wrong item?',
        answer: 'If you received an incorrect item, contact us immediately. We\'ll arrange free return shipping and send the correct item at no additional cost. You may keep the wrong item if it\'s our error.'
      }
    ],
    account: [
      {
        id: 43,
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also create an account during checkout for faster future purchases.'
      },
      {
        id: 44,
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
      },
      {
        id: 45,
        question: 'Can I change my email address?',
        answer: 'Yes, you can update your email address in your account settings. You\'ll need to verify the new email address before the change takes effect.'
      },
      {
        id: 46,
        question: 'How do I delete my account?',
        answer: 'Contact customer support to request account deletion. We\'ll remove your personal information while keeping order history for legal and tax purposes as required by law.'
      },
      {
        id: 47,
        question: 'Can I have multiple delivery addresses?',
        answer: 'Yes, you can save multiple addresses in your account for easy checkout. You can set a default address and choose different addresses for different orders.'
      }
    ]
  }

  const allFAQs = Object.values(faqs).flat()
  
  const filteredFAQs = searchQuery 
    ? allFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[activeCategory] || []

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-zembile-gray to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            Find answers to common questions about shopping, shipping, returns, and more.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full px-6 py-4 pl-12 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-zembile-yellow"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id)
                      setSearchQuery('')
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      activeCategory === category.id && !searchQuery
                        ? 'bg-zembile-yellow text-zembile-gray font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Need More Help?</h4>
                <div className="space-y-2">
                  <Link
                    to="/contact"
                    className="block text-sm text-zembile-gray hover:text-gray-600 transition-colors"
                  >
                    📞 Contact Support
                  </Link>
                  <Link
                    to="/about"
                    className="block text-sm text-zembile-gray hover:text-gray-600 transition-colors"
                  >
                    ℹ️ About Zembile
                  </Link>
                  <a
                    href="mailto:support@zembile.com"
                    className="block text-sm text-zembile-gray hover:text-gray-600 transition-colors"
                  >
                    ✉️ Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {searchQuery ? `Search Results (${filteredFAQs.length})` : 
                     categories.find(cat => cat.id === activeCategory)?.name || 'All Questions'}
                  </h2>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
                {!searchQuery && (
                  <p className="text-gray-600 mt-1">
                    {categories.find(cat => cat.id === activeCategory)?.count} questions in this category
                  </p>
                )}
              </div>

              {/* FAQ List */}
              <div className="divide-y divide-gray-200">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="p-6">
                      <button
                        onClick={() => toggleFAQ(faq.id)}
                        className="w-full flex items-center justify-between text-left focus:outline-none group"
                      >
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-zembile-gray transition-colors pr-4">
                          {faq.question}
                        </h3>
                        <svg
                          className={`w-5 h-5 text-gray-500 transition-transform ${
                            openFAQ === faq.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {openFAQ === faq.id && (
                        <div className="mt-4 pr-8">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any FAQs matching your search. Try different keywords or browse categories.
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-zembile-gray hover:text-gray-600 font-medium"
                    >
                      Clear search and browse all FAQs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Still Need Help */}
            <div className="mt-8 bg-gradient-to-r from-zembile-gray to-gray-800 text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-lg mb-6 opacity-90">
                Can't find what you're looking for? Our customer support team is here to help 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors"
                >
                  Contact Support
                </Link>
                <a
                  href="mailto:support@zembile.com"
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}