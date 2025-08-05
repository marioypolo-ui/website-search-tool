import { NextRequest, NextResponse } from 'next/server'

// 模拟网站数据存储
let mockWebsites = [
  {
    id: '1',
    url: 'https://example.com',
    title: '示例网站'
  }
]

export async function GET() {
  try {
    return NextResponse.json(mockWebsites)
  } catch (error) {
    console.error('获取网站列表失败:', error)
    return NextResponse.json(
      { error: '获取网站列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: '请提供网站URL' },
        { status: 400 }
      )
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: '请提供有效的URL' },
        { status: 400 }
      )
    }

    // 检查是否已存在
    const existing = mockWebsites.find(w => w.url === url)
    if (existing) {
      return NextResponse.json(
        { error: '该网站已存在' },
        { status: 400 }
      )
    }

    const newWebsite = {
      id: Date.now().toString(),
      url,
      title: url
    }

    mockWebsites.push(newWebsite)
    return NextResponse.json(newWebsite)
  } catch (error) {
    console.error('添加网站失败:', error)
    return NextResponse.json(
      { error: '添加网站失败' },
      { status: 500 }
    )
  }
}
