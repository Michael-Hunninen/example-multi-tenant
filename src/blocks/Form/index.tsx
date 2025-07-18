"use client"

import React, { useState } from 'react'
import RichText from '../../components/RichText'

export type FormBlockProps = {
  form?: {
    id: string
    title: string
    fields: {
      name: string
      label: string
      type: 'text' | 'textarea' | 'email' | 'number' | 'select' | 'checkbox'
      required: boolean
      options?: {
        label: string
        value: string
      }[]
    }[]
  }
  enableIntro?: boolean
  introContent?: any
}

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { form, enableIntro, introContent } = props
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  if (!form) return null
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === 'checkbox'
    
    setFormData({
      ...formData,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      // Submit form data to your API endpoint
      // This is a placeholder for actual form submission
      // const response = await fetch('/api/form-submissions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ formID: form.id, data: formData }),
      // })
      
      // if (!response.ok) throw new Error('Failed to submit form')
      
      // Handle success
      setSuccess(true)
      setFormData({})
    } catch (err) {
      console.error('Form submission error:', err)
      setError('There was a problem submitting your form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="my-12">
      {enableIntro && introContent && (
        <div className="mb-8">
          {typeof introContent === 'object' ? (
            <RichText data={introContent} />
          ) : (
            typeof introContent === 'string' ? <p>{introContent}</p> : null
          )}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-2xl font-semibold mb-6">{form.title}</h3>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
            Thank you! Your form has been submitted successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {form.fields?.map((field) => {
              const { name, label, type, required, options } = field
              
              return (
                <div key={name} className="mb-4">
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {label}{required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {type === 'textarea' ? (
                    <textarea
                      id={name}
                      name={name}
                      onChange={handleChange}
                      required={required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={4}
                    />
                  ) : type === 'select' && options ? (
                    <select
                      id={name}
                      name={name}
                      onChange={handleChange}
                      required={required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select an option</option>
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={name}
                        name={name}
                        onChange={handleChange}
                        required={required}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">{label}</span>
                    </div>
                  ) : (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      onChange={handleChange}
                      required={required}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  )}
                </div>
              )
            })}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 bg-blue-600 text-white rounded-md font-medium ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
