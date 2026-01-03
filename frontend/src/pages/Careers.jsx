import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Careers() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Join our engineering team to build scalable e-commerce solutions that connect Ethiopian artisans with global customers.',
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of experience with React, Node.js, and MongoDB',
        'Experience with e-commerce platforms and payment systems',
        'Strong problem-solving skills and attention to detail',
        'Fluency in English and Amharic preferred'
      ],
      posted: '2024-01-15',
      urgent: true
    },
    {
      id: 2,
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      experience: '2-4 years',
      description: 'Lead our digital marketing efforts to promote Ethiopian culture and products to a global audience.',
      requirements: [
        'Bachelor\'s degree in Marketing, Communications, or related field',
        '2+ years of digital marketing experience',
        'Experience with social media marketing and content creation',
        'Knowledge of SEO, SEM, and analytics tools',
        'Creative mindset with strong analytical skills'
      ],
      posted: '2024-01-12',
      urgent: false
    },
    {
      id: 3,
      title: 'Supply Chain Coordinator',
      department: 'Operations',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      experience: '1-3 years',
      description: 'Manage relationships with artisan partners and ensure smooth product sourcing and delivery.',
      requirements: [
        'Bachelor\'s degree in Supply Chain, Business, or related field',
        '1+ years of supply chain or logistics experience',
        'Strong communication and relationship-building skills',
        'Experience working with small businesses or artisans preferred',
        'Fluency in local Ethiopian languages'
      ],
      posted: '2024-01-10',
      urgent: false
    },
    {
      id: 4,
      title: 'Customer Success Specialist',
      department: 'Customer Service',
      location: 'Remote (Ethiopia)',
      type: 'Full-time',
      experience: '1-2 years',
      description: 'Provide exceptional customer support and help customers discover authentic Ethiopian products.',
      requirements: [
        'High school diploma or equivalent',
        '1+ years of customer service experience',
        'Excellent communication skills in English and Amharic',
        'Passion for Ethiopian culture and products',
        'Problem-solving mindset and patience'
      ],
      posted: '2024-01-08',
      urgent: true
    },
    {
      id: 5,
      title: 'Product Manager',
      department: 'Product',
      location: 'Addis Ababa, Ethiopia',
      type: 'Full-time',
      experience: '3-5 years',
      description: 'Drive product strategy and development for our e-commerce platform and mobile applications.',
      requirements: [
        'Bachelor\'s degree in Business, Engineering, or related field',
        '3+ years of product management experience',
        'Experience with e-commerce and marketplace platforms',
        'Strong analytical and strategic thinking skills',
        'Understanding of Ethiopian market dynamics'
      ],
      posted: '2024-01-05',
      urgent: false
    },
    {
      id: 6,
      title: 'Content Creator & Photographer',
      department: 'Marketing',
      location: 'Addis Ababa, Ethiopia',
      type: 'Contract',
      experience: '2-3 years',
      description: 'Create compelling visual content showcasing Ethiopian products and culture for our marketing campaigns.',
      requirements: [
        'Portfolio demonstrating photography and content creation skills',
        '2+ years of professional photography experience',
        'Proficiency in Adobe Creative Suite',
        'Understanding of social media and e-commerce content',
        'Passion for Ethiopian culture and craftsmanship'
      ],
      posted: '2024-01-03',
      urgent: false
    }
  ]

  const departments = [
    { id: 'all', name: 'All Departments', count: jobOpenings.length },
    { id: 'Engineering', name: 'Engineering', count: jobOpenings.filter(job => job.department === 'Engineering').length },
    { id: 'Marketing', name: 'Marketing', count: jobOpenings.filter(job => job.department === 'Marketing').length },
    { id: 'Operations', name: 'Operations', count: jobOpenings.filter(job => job.department === 'Operations').length },
    { id: 'Customer Service', name: 'Customer Service', count: jobOpenings.filter(job => job.department === 'Customer Service').length },
    { id: 'Product', name: 'Product', count: jobOpenings.filter(job => job.department === 'Product').length }
  ]

  const benefits = [
    {
      icon: '💰',
      title: 'Competitive Salary',
      description: 'Market-competitive compensation with performance bonuses'
    },
    {
      icon: '🏥',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family'
    },
    {
      icon: '🌴',
      title: 'Flexible PTO',
      description: 'Generous vacation time and flexible work arrangements'
    },
    {
      icon: '📚',
      title: 'Learning & Development',
      description: 'Professional development budget and learning opportunities'
    },
    {
      icon: '🍽️',
      title: 'Free Meals',
      description: 'Daily meals and snacks featuring Ethiopian cuisine'
    },
    {
      icon: '🚀',
      title: 'Career Growth',
      description: 'Clear advancement paths and mentorship programs'
    },
    {
      icon: '🏠',
      title: 'Remote Work',
      description: 'Hybrid and remote work options for eligible roles'
    },
    {
      icon: '🎉',
      title: 'Team Events',
      description: 'Regular team building and cultural celebration events'
    }
  ]

  const values = [
    {
      title: 'Cultural Pride',
      description: 'We celebrate and promote Ethiopian heritage in everything we do.',
      icon: '🇪🇹'
    },
    {
      title: 'Artisan First',
      description: 'We prioritize the success and wellbeing of our artisan partners.',
      icon: '🤝'
    },
    {
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in products and service.',
      icon: '⭐'
    },
    {
      title: 'Innovation',
      description: 'We embrace technology to preserve and share traditions.',
      icon: '💡'
    }
  ]

  const filteredJobs = selectedDepartment === 'all' 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-zembile-gray to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Join Our Mission</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Help us connect Ethiopian culture with the world while building a meaningful career 
            that makes a difference in communities across Ethiopia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#openings"
              className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              View Open Positions
            </a>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work at Zembile?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join a team that's passionate about Ethiopian culture, innovation, and making a positive impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Benefits & Perks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Find your next opportunity to make an impact</p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedDepartment === dept.id
                    ? 'bg-zembile-yellow text-zembile-gray'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name} ({dept.count})
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {job.urgent && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v7" />
                        </svg>
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    <p className="text-sm text-gray-500">Posted on {formatDate(job.posted)}</p>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button className="w-full lg:w-auto bg-zembile-gray text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>

                {/* Requirements (expandable) */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-zembile-gray font-medium hover:text-gray-600">
                    View Requirements
                  </summary>
                  <div className="mt-3 pl-4 border-l-2 border-zembile-yellow">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-zembile-yellow mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No positions found</h3>
              <p className="text-gray-600 mb-4">
                No open positions in the selected department. Check back soon or explore other departments.
              </p>
              <button
                onClick={() => setSelectedDepartment('all')}
                className="text-zembile-gray hover:text-gray-600 font-medium"
              >
                View All Positions →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-xl text-gray-600">Simple steps to join our team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zembile-gray">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply Online</h3>
              <p className="text-gray-600">Submit your application and resume through our online portal</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zembile-gray">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initial Review</h3>
              <p className="text-gray-600">Our team reviews your application and qualifications</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zembile-gray">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-gray-600">Meet with our team to discuss your experience and goals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-zembile-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-zembile-gray">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome!</h3>
              <p className="text-gray-600">Join our team and start making an impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-zembile-gray to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Don't see a position that fits? We're always looking for talented individuals 
            who share our passion for Ethiopian culture and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              Send Us Your Resume
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}