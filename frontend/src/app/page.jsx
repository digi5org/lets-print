'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [pricingPeriod, setPricingPeriod] = useState('annual');
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      title: 'Web-to-Print Storefront',
      description: 'Beautiful, customizable online store where clients can browse, design, and order print products 24/7.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'Production Workflow',
      description: 'Streamline your production process with job tracking, automated scheduling, and real-time status updates.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      title: 'Automated Billing',
      description: 'Handle invoicing, payments, and subscriptions automatically. Support for multiple payment gateways.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'CRM & Client Portal',
      description: 'Manage customer relationships with built-in CRM tools and self-service client portals.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: 'Analytics & Reports',
      description: 'Track sales, monitor performance, and make data-driven decisions with comprehensive reporting.'
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
      title: 'Inventory Management',
      description: 'Track materials, supplies, and finished products with automated low-stock alerts and reordering.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      description: 'Perfect for new printing startups',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        'Up to 100 orders/month',
        '1 storefront',
        '5 product templates',
        'Basic CRM',
        'Email support',
        '2 user accounts',
        'Standard analytics'
      ]
    },
    {
      name: 'Professional',
      description: 'For growing print businesses',
      monthlyPrice: 149,
      annualPrice: 119,
      popular: true,
      features: [
        'Up to 500 orders/month',
        '3 storefronts',
        'Unlimited product templates',
        'Advanced CRM',
        'Priority support',
        '10 user accounts',
        'Advanced analytics',
        'Marketing tools',
        'API access'
      ]
    },
    {
      name: 'Enterprise',
      description: 'For established print operations',
      monthlyPrice: 399,
      annualPrice: 319,
      features: [
        'Unlimited orders',
        'Unlimited storefronts',
        'Custom templates',
        'Enterprise CRM',
        '24/7 phone support',
        'Unlimited users',
        'Custom analytics',
        'White-label option',
        'Dedicated account manager',
        'Custom integrations'
      ]
    }
  ];

  const testimonials = [
    {
      stars: 5,
      text: "Let's Print transformed our startup from idea to profitable business in just 3 months. The platform is intuitive and the support team is amazing!",
      author: 'Sarah Mitchell',
      role: 'Founder, PrintHub Pro',
      initials: 'SM',
      color: '#4FACFE'
    },
    {
      stars: 5,
      text: 'We scaled from 50 to 500 orders per month without hiring additional staff. The automation features are a game-changer for small businesses.',
      author: 'James Chen',
      role: 'CEO, QuickPrint Solutions',
      initials: 'JC',
      color: '#667EEA'
    },
    {
      stars: 5,
      text: 'Customer support is outstanding! They helped us customize the platform to fit our unique workflow. Revenue increased by 200% in 6 months.',
      author: 'David Rodriguez',
      role: 'Co-founder, PrintFlow',
      initials: 'DR',
      color: '#FCD34D'
    }
  ];

  const faqs = [
    {
      question: 'How does the 14-day free trial work?',
      answer: 'Sign up and get full access to all features for 14 days. No credit card required to start. You can cancel anytime during the trial period.'
    },
    {
      question: 'Can I customize my storefront?',
      answer: 'Absolutely! You can customize colors, logos, fonts, product offerings, and pricing. Professional and Enterprise plans offer even more customization options including custom domains.'
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We integrate with all major payment gateways including Stripe, PayPal, Square, and more. You can also enable multiple payment methods for your customers.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. Cancel anytime during the trial period.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades will be applied at the end of your current billing cycle.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#0F172A]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                  <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h10v2H12v-2z" fill="#FCD34D"/>
                </svg>
              </div>
              <span className="text-white font-bold text-xl">Let&apos;s Print</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">Join</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-blue-500/30">
                🚀 Launch Your Print Business Today
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Start Your Printing Business Without a Single Machine
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Complete cloud-based CRM with a front-end storefront designed for printing startups. Manage production, clients, and orders seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-center transition shadow-lg shadow-blue-600/30">
                  Start Free Trial
                </Link>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Book a Demo
                </button>
              </div>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-400">Active Businesses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Orders Processed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-gray-800">
                <div className="bg-gray-900/50 rounded-lg p-6 space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="h-20 bg-blue-600/20 rounded"></div>
                    <div className="h-20 bg-purple-600/20 rounded"></div>
                    <div className="h-20 bg-yellow-500/20 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Subscribe', icon: '✓', description: 'Choose a plan that fits your business needs. Start with a 14-day free trial, no credit card required.' },
              { step: '2', title: 'Customize CRM', icon: '✏️', description: 'Set up your storefront, add your branding, configure products, and customize workflows to match your process.' },
              { step: '3', title: 'Start Selling', icon: '💰', description: 'Launch your storefront, invite clients, and start processing orders. We handle the tech, you handle the growth.' }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 text-center">{item.title}</h3>
                  <p className="text-gray-400 text-center">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Run a Printing Business</h2>
            <p className="text-xl text-gray-400">Powerful features designed specifically for print service providers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-blue-500 transition group">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400 mb-8">Choose the perfect plan for your printing business</p>
            
            <div className="inline-flex items-center gap-4 bg-gray-800 p-2 rounded-lg">
              <button
                onClick={() => setPricingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg transition ${pricingPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingPeriod('annual')}
                className={`px-6 py-2 rounded-lg transition ${pricingPeriod === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Annual <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <div key={idx} className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-8 ${plan.popular ? 'border-blue-500 relative' : 'border-gray-700'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    ${pricingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`block text-center py-3 rounded-lg font-semibold transition ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Printing Startups Worldwide</h2>
            <p className="text-xl text-gray-400">See what our successful partners have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-400">Everything you need to know about Let&apos;s Print</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/80 transition"
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Launch Your Print Business?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of successful printing startups using Let&apos;s Print. Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-center transition shadow-lg shadow-blue-600/30">
              Start Free Trial
            </Link>
            <Link href="#" className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-center transition">
              Schedule a Demo
            </Link>
          </div>
          <p className="text-sm text-gray-500">✓ No credit card required  ✓ Cancel anytime  ✓ 24/7 support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <path d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h10v2H12v-2z" fill="#FCD34D"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-xl">Let&apos;s Print</span>
              </div>
              <p className="text-gray-400 text-sm">
                Cloud-based CRM for printing startups. Start your business without owning a machine.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#faq" className="hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Press Kit</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 Let&apos;s Print. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
