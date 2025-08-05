import { NextRequest, NextResponse } from 'next/server'

// 模拟数据存储 - 完全独立
const getMockKeywords = () => [
  { id: '1', keyword: 'JavaScript', createdAt: new Date().toISOString() },
  { id: '2', keyword: 'React', createdAt: new Date().toISOString() }
]

export async function GET() {
  try {
    const keywords = getMockKeywords()
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

    const newKeyword = {
      id: Date.now().toString(),
      keyword,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newKeyword)
  } catch (error: any) {
    console.error('Failed to create keyword:', error?.message || error)
    return NextResponse.json({ error: 'Failed to create keyword' }, { status: 500 })
  }
}
