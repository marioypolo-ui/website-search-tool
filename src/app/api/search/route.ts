import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { websites, keywords } = await request.json()
    
    if (!websites || !keywords || websites.length === 0 || keywords.length === 0) {
      return NextResponse.json({ error: 'Websites and keywords are required' }, { status: 400 })
    }

    // 生成模拟搜索结果
    const results = []
    
    websites.forEach((website: string) => {
      keywords.forEach((keyword: string) => {
        results.push({
          id: `${website}-${keyword}-${Date.now()}`,
          websiteId: website,
          keywordId: keyword,
          title: `搜索结果: ${keyword}`,
          url: website,
          snippet: `在 ${website} 中找到关于 "${keyword}" 的信息`,
          createdAt: new Date().toISOString(),
          keyword: keyword,
          website: website
        })
      })
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('搜索失败:', error?.message || error)
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 })
  }
}
