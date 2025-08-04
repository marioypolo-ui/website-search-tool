import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // 尝试连接数据库
    await db.$queryRaw`SELECT 1`
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error.message 
    }, { status: 500 })
  }
}
