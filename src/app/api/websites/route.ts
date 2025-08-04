import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const websites = await db.website.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(websites)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const website = await db.website.create({
      data: {
        url,
        title: url
      }
    })

    return NextResponse.json(website)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create website' }, { status: 500 })
  }
}
