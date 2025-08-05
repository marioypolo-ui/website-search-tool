import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Application is running',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Health check failed',
      error: error?.message || 'Unknown error' 
    }, { status: 500 })
  }
}
