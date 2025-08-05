import { NextRequest, NextResponse } from 'next/server'

interface Website {
  id: string
  url: string
  title?: string
}

interface Keyword {
  id: string
  keyword: string
}

interface SearchResult {
  id: string
  title: string
  url: string
  snippet?: string
  websiteId: string
  keywordId: string
}

export async function POST(request: NextRequest) {
  try {
    const { websites, keywords }: { websites: Website[], keywords: Keyword[] } = await request.json()

    if (!websites || !keywords || websites.length === 0 || keywords.length === 0) {
      return NextResponse.json(
        { error: '请提供网站和关键词' },
        { status: 400 }
      )
    }

    // 生成模拟搜索结果
    const results: SearchResult[] = []

    websites.forEach((website: Website) => {
      keywords.forEach((keyword: Keyword) => {
        // 为每个网站-关键词组合生成1-2个模拟结果
        const resultCount = Math.floor(Math.random() * 2) + 1
        
        for (let i = 0; i < resultCount; i++) {
          const result: SearchResult = {
            id: `${website.id}-${keyword.id}-${Date.now()}-${Math.random()}`,
            title: `关于"${keyword.keyword}"的搜索结果 ${i + 1}`,
            url: `${website.url}/search-result-${i + 1}`,
            snippet: `这是一个关于"${keyword.keyword}"的模拟搜索结果，来自网站 ${website.url}。`,
            websiteId: website.id,
            keywordId: keyword.id
          }
          results.push(result)
        }
      })
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('搜索API错误:', error)
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    )
  }
}
