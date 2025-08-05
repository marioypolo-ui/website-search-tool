import { NextRequest, NextResponse } from 'next/server'

// 模拟关键词数据存储
let mockKeywords = [
  {
    id: '1',
    keyword: '示例关键词'
  }
]

export async function GET() {
  try {
    return NextResponse.json(mockKeywords)
  } catch (error) {
    console.error('获取关键词列表失败:', error)
    return NextResponse.json(
      { error: '获取关键词列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json()
    
    if (!keyword || keyword.trim() === '') {
      return NextResponse.json(
        { error: '请提供关键词' },
        { status: 400 }
      )
    }

    // 检查是否已存在
    const existing = mockKeywords.find(k => k.keyword === keyword.trim())
    if (existing) {
      return NextResponse.json(
        { error: '该关键词已存在' },
        { status: 400 }
      )
    }

    const newKeyword = {
      id: Date.now().toString(),
      keyword: keyword.trim()
    }

    mockKeywords.push(newKeyword)
    return NextResponse.json(newKeyword)
  } catch (error) {
    console.error('添加关键词失败:', error)
    return NextResponse.json(
      { error: '添加关键词失败' },
      { status: 500 }
    )
  }
}
