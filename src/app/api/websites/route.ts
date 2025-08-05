import { NextRequest, NextResponse } from 'next/server'

// 模拟数据存储 - 完全独立
const getMockWebsites = () => [
  { id: '1', url: 'https://google.com', title: 'Google', createdAt: new Date().toISOString() },
  { id: '2', url: 'https://github.com', title: 'GitHub', createdAt: new Date().toISOString() }
]

export async function GET() {
  try {
    const websites = getMockWebsites()
    return NextResponse.json(websites)
  } catch (error: any) {
    console.error('Failed to fetch websites:', error?.message || error)
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const newWebsite = {
      id: Date.now().toString(),
      url,
      title: url,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newWebsite)
  } catch (error: any) {
    console.error('Failed to create website:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create website' }, { status: 500 })
  }
}
