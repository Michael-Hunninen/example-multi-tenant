"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, Star, Video, Users, Phone, Calendar } from 'lucide-react'
import CustomHeader from './CustomHeader'

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for beginners starting their reining journey",
      features: [
        "Access to fundamental training videos",
        "Basic reining patterns and techniques",
        "Monthly group Q&A sessions",
        "Training progress tracking",
        "Mobile app access",
        "Community forum access"
      ],
      popular: false,
      cta: "Start Basic Plan"
    },
    {
      name: "Premium",
      price: "$59",
      period: "/month",
      description: "Comprehensive training for serious riders",
      features: [
        "Everything in Basic plan",
        "Advanced training techniques",
        "Weekly live Q&A sessions",
        "Video submission reviews",
        "Personalized training plans",
        "Direct messaging with trainers",
        "Competition preparation guides",
        "Priority support"
      ],
      popular: true,
      cta: "Start Premium Plan"
    },
    {
      name: "Elite",
      price: "$99",
      period: "/month",
      description: "Professional-level training and personal coaching",
      features: [
        "Everything in Premium plan",
        "One-on-one video coaching sessions",
        "Custom training program development",
        "Competition strategy planning",
        "Phone consultations",
        "Early access to new content",
        "Exclusive masterclass sessions",
        "Show preparation support"
      ],
      popular: false,
      cta: "Start Elite Plan"
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
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="container px-4 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
              Choose Your Training Plan
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock professional reining training with our flexible subscription plans. Start your journey today with a 7-day free trial.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-400" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-teal-400" />
                <span>30-day money back</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-gradient-to-br ${
                  plan.popular 
                    ? 'from-teal-500/20 to-black border-2 border-teal-500' 
                    : 'from-gray-800/50 to-black border border-gray-700'
                } rounded-2xl p-8 hover:border-teal-500/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-teal-500 text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center mb-6">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                  <Button 
                    asChild 
                    className={`w-full py-3 font-semibold ${
                      plan.popular 
                        ? 'bg-teal-500 hover:bg-teal-600 text-black' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    <Link href={`/checkout?plan=${plan.name.toLowerCase()}&price=${plan.price.replace('$', '')}&interval=month`}>{plan.cta}</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
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
