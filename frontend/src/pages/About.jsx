import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  const teamMembers = [
    {
      name: 'Meron Tadesse',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80&auto=format&fit=crop',
      bio: 'Passionate about connecting Ethiopian culture with the world through authentic products.',
      linkedin: '#'
    },
    {
      name: 'Daniel Bekele',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop',
      bio: 'Expert in supply chain management with 10+ years experience in Ethiopian markets.',
      linkedin: '#'
    },
    {
      name: 'Sara Mohammed',
      role: 'Artisan Relations Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop',
      bio: 'Building bridges between traditional craftspeople and modern consumers.',
      linkedin: '#'
    },
    {
      name: 'Yonas Kebede',
      role: 'Quality Assurance Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop',
      bio: 'Ensuring every product meets our high standards for authenticity and quality.',
      linkedin: '#'
    }
  ]

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Zembile was born from a vision to showcase Ethiopian heritage' },
    { year: '2021', title: 'First 100 Artisans', description: 'Partnered with local craftspeople across Ethiopia' },
    { year: '2022', title: 'International Shipping', description: 'Expanded to serve Ethiopian diaspora worldwide' },
    { year: '2023', title: '10,000+ Customers', description: 'Reached milestone of serving 10,000 happy customers' },
    { year: '2024', title: 'Sustainability Initiative', description: 'Launched eco-friendly packaging and carbon-neutral shipping' }
  ]

  const values = [
    {
      icon: '🇪🇹',
      title: 'Authenticity',
      description: 'Every product is genuinely Ethiopian, sourced directly from local artisans and producers.'
    },
    {
      icon: '🤝',
      title: 'Community Support',
      description: 'We reinvest in Ethiopian communities, supporting education and sustainable development.'
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description: 'Committed to environmentally responsible practices and supporting eco-friendly production.'
    },
    {
      icon: '💎',
      title: 'Quality Excellence',
      description: 'Rigorous quality standards ensure every product meets our high expectations.'
    },
    {
      icon: '🌍',
      title: 'Cultural Bridge',
      description: 'Connecting Ethiopian heritage with global communities through authentic products.'
    },
    {
      icon: '⚡',
      title: 'Innovation',
      description: 'Blending traditional craftsmanship with modern e-commerce technology.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-zembile-gray to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Zembile</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Connecting the world to authentic Ethiopian culture through premium products, 
            traditional craftsmanship, and meaningful partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              Shop Our Products
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-colors"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Zembile began as a dream to share the rich cultural heritage of Ethiopia with the world. 
                  Founded in 2020 by Ethiopian entrepreneurs passionate about their homeland, we started 
                  with a simple mission: to create a bridge between traditional Ethiopian artisans and 
                  global consumers who appreciate authentic, handcrafted products.
                </p>
                <p>
                  The name "Zembile" comes from the traditional Ethiopian woven basket, symbolizing our 
                  commitment to preserving and celebrating Ethiopian craftsmanship. Just as a zembile 
                  carries precious goods, our platform carries the stories, traditions, and artistry 
                  of Ethiopian culture to customers worldwide.
                </p>
                <p>
                  Today, we work with over 200 artisans, farmers, and small businesses across Ethiopia, 
                  ensuring fair compensation and sustainable practices while delivering exceptional 
                  products that tell the story of our beautiful country.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&auto=format&fit=crop"
                alt="Ethiopian artisan at work"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-zembile-yellow text-zembile-gray p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">200+</div>
                <div className="text-sm font-medium">Partner Artisans</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from sourcing products to serving customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to celebrate Ethiopian culture</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-zembile-yellow"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                      <div className="text-2xl font-bold text-zembile-gray mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-zembile-yellow rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate individuals dedicated to bringing Ethiopian culture to the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-zembile-gray font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  className="inline-flex items-center text-zembile-gray hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gradient-to-r from-zembile-gray to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-zembile-yellow mb-2">10,000+</div>
              <div className="text-lg">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-zembile-yellow mb-2">200+</div>
              <div className="text-lg">Partner Artisans</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-zembile-yellow mb-2">50+</div>
              <div className="text-lg">Ethiopian Communities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-zembile-yellow mb-2">$500K+</div>
              <div className="text-lg">Paid to Artisans</div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl mb-8 opacity-90">
              Every purchase on Zembile directly supports Ethiopian artisans, farmers, and small businesses. 
              We're proud to contribute to sustainable economic development while preserving cultural traditions.
            </p>
            <Link
              to="/products"
              className="bg-zembile-yellow text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors inline-block"
            >
              Shop & Support Artisans
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you're shopping for authentic Ethiopian products, looking to partner with us, 
            or interested in joining our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/careers"
              className="bg-zembile-gray text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-700 transition-colors"
            >
              View Careers
            </Link>
            <Link
              to="/contact"
              className="border-2 border-zembile-gray text-zembile-gray px-8 py-4 rounded-full font-bold text-lg hover:bg-zembile-gray hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}