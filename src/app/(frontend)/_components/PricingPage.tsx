"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  CheckCircle, ArrowRight, Star, Crown, User
} from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual')
  
  const membershipTiers = [
    {
      name: "Basic",
      icon: User,
      prices: {
        monthly: { amount: 29, display: "$29" },
        annual: { amount: 290, display: "$24.17", fullPrice: "$290" } // 10 months price for 12 months
      },
      description: "Perfect for beginners starting their reining journey",
      features: [
        "Access to foundational video library",
        "Basic progress tracking",
        "Mobile app access",
        "Community forum access",
        "Email support"
      ],
      popular: false,
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Premium",
      icon: Star,
      prices: {
        monthly: { amount: 49, display: "$49" },
        annual: { amount: 490, display: "$40.83", fullPrice: "$490" } // 10 months price for 12 months
      },
      description: "Comprehensive training for serious riders",
      features: [
        "Full video library access",
        "Structured learning programs",
        "Advanced progress analytics",
        "Community features & forums",
        "Priority email support",
        "Downloadable resources"
      ],
      popular: true,
      color: "from-teal-500 to-teal-600"
    },
    {
      name: "VIP",
      icon: Crown,
      prices: {
        monthly: { amount: 99, display: "$99" },
        annual: { amount: 990, display: "$82.50", fullPrice: "$990" } // 10 months price for 12 months
      },
      description: "Premium experience with live instruction",
      features: [
        "Everything in Premium",
        "Weekly live training sessions",
        "Live Q&A with instructors",
        "Session recordings library",
        "Priority community access",
        "Phone & video support"
      ],
      popular: false,
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period."
    },
    {
      question: "Is there a free trial available?",
      answer: "We offer a 7-day free trial for all new subscribers. You can explore our content and cancel before being charged."
    },
    {
      question: "What if I'm not satisfied with my subscription?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied, we'll refund your subscription fee."
    },
    {
      question: "Can I switch between plans?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle."
    },
    {
      question: "Do you offer discounts for annual subscriptions?",
      answer: "Yes, we offer a 20% discount when you choose to pay annually instead of monthly."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomHeader />
      
      {/* Membership Tiers */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
        <div className="container px-4 max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge variant="outline" className="border-teal-500/50 text-teal-400 bg-teal-500/10 mb-6">
              Membership Plans
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">Learning Journey</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From beginner-friendly basics to professional-level mastery, 
              find the perfect plan for your reining goals.
            </p>
          </motion.div>

          {/* Billing Period Tablist */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Tabs value={billingPeriod} onValueChange={(value: any) => setBillingPeriod(value)} className="max-w-md mx-auto">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
                <TabsTrigger value="annual" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
                  Annual
                  <span className="ml-1 text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">2 months free</span>
                </TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-teal-500 data-[state=active]:text-black">
                  Monthly
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Billing Period Info */}
            <div className="text-center mt-4">
              <p className="text-gray-400 text-sm">
                {billingPeriod === 'annual' 
                  ? 'Get 2 months free with annual billing - prices shown as monthly equivalent'
                  : 'Monthly billing - upgrade or cancel anytime'
                }
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {membershipTiers.map((tier, index) => {
              const IconComponent = tier.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative group ${
                    tier.popular 
                      ? 'transform scale-105 lg:scale-110' 
                      : 'hover:transform hover:scale-105'
                  } transition-all duration-500`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-black font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/50 rounded-2xl p-8 border-2 ${
                    tier.popular 
                      ? 'border-teal-500/50 shadow-2xl shadow-teal-500/20' 
                      : 'border-gray-800/50 hover:border-teal-500/30'
                  } transition-all duration-500 backdrop-blur-sm h-full flex flex-col`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 flex-1">
                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                          <span className="text-4xl font-bold text-teal-400">{tier.prices[billingPeriod].display}</span>
                          <span className="text-gray-400">/mo</span>
                        </div>
                        {billingPeriod === 'annual' && (
                          <div className="text-sm text-teal-500 font-medium mb-1">get 2 months free</div>
                        )}
                        {billingPeriod === 'annual' && (
                          <div className="text-xs text-gray-400 mb-2">
                            {tier.prices.annual.fullPrice} billed annually
                          </div>
                        )}
                        <p className="text-gray-300 text-sm leading-relaxed">{tier.description}</p>
                      </div>
                      
                      <ul className="space-y-3 mb-8 flex-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3 text-gray-300">
                            <CheckCircle className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Link 
                      href={`/checkout?plan=${tier.name}&price=${tier.prices[billingPeriod].amount}&billing=${billingPeriod}`}
                      className={`inline-flex items-center justify-center gap-2 w-full mt-auto px-4 py-3 rounded-md font-medium transition-all duration-300 relative z-20 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-black font-semibold shadow-lg'
                          : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-teal-500/50'
                      }`}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about our subscription plans.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800/50 to-black border border-gray-700 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Ready to Start Training?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of riders who have improved their skills with our professional training programs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild className="bg-teal-500 hover:bg-teal-600 text-black font-semibold px-8 py-4 text-lg">
                <Link href="/checkout?plan=premium&price=59&interval=month&trial=true">Start Free Trial</Link>
              </Button>
              <Button asChild variant="outline" className="border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black px-8 py-4 text-lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
