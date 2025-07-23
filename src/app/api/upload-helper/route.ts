import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Test if Sharp can process the image
    try {
      const metadata = await sharp(buffer).metadata()
      
      return NextResponse.json({ 
        success: true, 
        metadata: {
          format: metadata.format,
          width: metadata.width,
          height: metadata.height,
          size: buffer.length
        }
      })
    } catch (sharpError: any) {
      return NextResponse.json({ 
        error: 'Image processing failed',
        details: sharpError.message,
        suggestions: [
          'Try re-saving the image in an image editor',
          'Convert the image to PNG format',
          'Check if the image file is corrupted'
        ]
      }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}
