'use client'

import React from 'react'
import { Media } from '../Media'
import RichText from '../RichText'

export type TrainerProfileProps = {
  name: string
  title: string
  bio: any // Rich text content
  image: {
    id: string
    alt?: string
    url: string
    updatedAt: string
    createdAt: string
  }
  credentials?: string[]
  socialLinks?: {
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube'
    url: string
  }[]
}

export const TrainerProfile: React.FC<TrainerProfileProps> = ({
  name,
  title,
  bio,
  image,
  credentials,
  socialLinks
}) => {
  return (
    <div className="trainer-profile py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            {image && (
              <div className="rounded-lg overflow-hidden shadow-md">
                <Media 
                  resource={image.id} 
                  className="w-full h-auto"
                  alt={image.alt || `Photo of ${name}`} 
                />
              </div>
            )}
            
            {socialLinks && socialLinks.length > 0 && (
              <div className="mt-4 flex gap-3 justify-center">
                {socialLinks.map((link, index) => {
                  const iconMap = {
                    facebook: 'M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z',
                    instagram: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-.25a1.25 1.25 0 0 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703-.333.334-.538.644-.704 1.08-.19.49-.295 1.015-.331 1.798C4.006 9.075 4 9.461 4 12c0 2.474.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.474 0 2.878-.007 4.029-.058.782-.037 1.309-.142 1.797-.331.433-.169.748-.37 1.08-.702.337-.337.538-.65.704-1.08.19-.493.296-1.02.332-1.8.052-1.104.058-1.49.058-4.029 0-2.474-.007-2.878-.058-4.029-.037-.782-.142-1.31-.332-1.798a2.911 2.911 0 0 0-.703-1.08 2.884 2.884 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.925 4.006 14.539 4 12 4zm0-2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2z',
                    twitter: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84',
                    linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
                    youtube: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 3.993L9 16z'
                  }
                  
                  const iconPath = iconMap[link.platform] || ''
                  
                  return (
                    <a 
                      key={index} 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                      aria-label={`${name} on ${link.platform}`}
                    >
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d={iconPath} />
                      </svg>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <h2 className="text-xl text-gray-600 mb-6">{title}</h2>
            
            {credentials && credentials.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Credentials &amp; Achievements</h3>
                <ul className="list-disc pl-5">
                  {credentials.map((credential, index) => (
                    <li key={index} className="mb-1">{credential}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="prose max-w-none">
              {bio && typeof bio === 'object' ? (
                <RichText data={bio} />
              ) : (
                <p>{typeof bio === 'string' ? bio : ''}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
