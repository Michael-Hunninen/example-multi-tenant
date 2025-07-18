import type { RequiredDataFromCollectionSlug } from 'payload'

export interface ContactFormArgs {
  contactForm: {
    id: string
  }
}

// Defines the data for a contact page
export const contactPageData: RequiredDataFromCollectionSlug<'pages'> = {
  title: 'Contact',
  slug: 'contact',
  _status: 'published',
  meta: {
    title: 'Contact',
    description: 'Get in touch with us',
  },
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        children: [
          {
            type: 'h1',
            children: [
              {
                text: 'Contact Us',
                type: 'text',
                version: 1,
              },
            ],
            version: 1,
          },
          {
            type: 'p',
            children: [
              {
                text: 'Have a question or comment? Fill out the form below to get in touch with us.',
                type: 'text',
                version: 1,
              },
            ],
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
  },
  layout: [
    {
      blockType: 'formBlock',
      blockName: 'Contact Form Block',
      form: '{{contactForm.id}}', // Reference to the form ID, will be replaced during seeding
    },
  ],
}

// Defines the data for a contact form
export const contactFormData = {
  title: 'Contact Form',
  fields: [
    {
      name: 'name',
      label: 'Name',
      required: true,
      blockType: 'text',
    },
    {
      name: 'email',
      label: 'Email',
      required: true,
      blockType: 'email',
    },
    {
      name: 'message',
      label: 'Message',
      required: true,
      blockType: 'textarea',
    },
  ],
  submitButtonLabel: 'Submit',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      children: [
        {
          type: 'h4',
          children: [
            {
              text: 'Thank you for your submission!',
              type: 'text',
              version: 1,
            },
          ],
          version: 1,
        },
      ],
      direction: 'ltr',
      format: 'left',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
}
