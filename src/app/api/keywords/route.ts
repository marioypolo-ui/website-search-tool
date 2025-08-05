import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const keywords = await db.keyword.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(keywords)
  } catch (error: any) {
    console.error('Failed to fetch keywords:', error?.message || error)
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json()
    
    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
    }

    const newKeyword = await db.keyword.create({
      data: {
        keyword
      }
    })

    return NextResponse.json(newKeyword)
  } catch (error: any) {
    console.error('Failed to create keyword:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create keyword' }, { status: 500 })
  }
}
