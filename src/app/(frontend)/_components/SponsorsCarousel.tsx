"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

const sponsors = [
  {
    name: "Continental Saddle",
    logo: "/api/media/file/continental_saddle.png"
  },
  {
    name: "Equiotic",
    logo: "/api/media/file/equiotic.png"
  },
  {
    name: "Excel EQ",
    logo: "/api/media/file/excel_eq.png"
  },
  {
    name: "Kendalls Hats",
    logo: "/api/media/file/kendalls_hats.png"
  },
  {
    name: "Lamicell",
    logo: "/api/media/file/lamicell.png"
  },
  {
    name: "Metalab",
    logo: "/api/media/file/metalab.png"
  },
  {
    name: "Olathe",
    logo: "/api/media/file/olathe-logo.png"
  },
  {
    name: "Partrade",
    logo: "/api/media/file/partrade.png"
  },
  {
    name: "Show Diva",
    logo: "/api/media/file/showdiva.png"
  },
  {
    name: "Theraplate",
    logo: "/api/media/file/theraplate.png"
  }
]

export default function SponsorsCarousel() {
  // Triple the sponsors array for true seamless infinite scroll
  const tripleSponsors = [...sponsors, ...sponsors, ...sponsors]

  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900 overflow-hidden">
      <div className="container px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Proud to partner with the best brands in the equestrian industry
          </p>
        </motion.div>

        {/* Infinite Scrolling Carousel with extra padding to prevent overflow */}
        <div className="relative py-8">
          <div className="flex overflow-hidden mask-gradient">
            <motion.div
              className="flex gap-12 items-center py-4"
              animate={{
                x: ['0%', '-33.333%']
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              style={{ width: '300%' }}
            >
              {tripleSponsors.map((sponsor, index) => (
                <div
                  key={`${sponsor.name}-${index}`}
                  className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-teal-500/50 transition-all duration-300 hover:scale-110 group relative z-10"
                  style={{ minWidth: '8rem', minHeight: '5rem' }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    width={120}
                    height={80}
                    className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '90%',
                      maxHeight: '90%'
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for the mask gradient */}
      <style jsx>{`
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
      `}</style>
    </section>
  )
}
