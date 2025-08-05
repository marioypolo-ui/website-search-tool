import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

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

    const zai = await ZAI.create()
    const allResults: SearchResult[] = []

    // 为每个关键词在每个网站中搜索
    for (const keyword of keywords) {
      for (const website of websites) {
        try {
          // 构建搜索查询，限制在特定网站
          const searchQuery = `${keyword.keyword} site:${website.url}`
          
          const searchResult = await zai.functions.invoke("web_search", {
            query: searchQuery,
            num: 10 // 每个搜索最多返回10个结果
          })

          if (searchResult && Array.isArray(searchResult)) {
            // 处理搜索结果
            for (const item of searchResult) {
              // 检查结果是否来自目标网站
              if (item.url && item.url.includes(website.url)) {
                const result: SearchResult = {
                  id: `${website.id}-${keyword.id}-${Date.now()}-${Math.random()}`,
                  title: item.name || '无标题',
                  url: item.url,
                  snippet: item.snippet,
                  websiteId: website.id,
                  keywordId: keyword.id
                }
                allResults.push(result)
              }
            }
          }
        } catch (error) {
          console.error(`搜索失败: ${website.url} - ${keyword.keyword}`, error)
          // 继续搜索其他网站和关键词，不因为单个搜索失败而停止
        }
      }
    }

    // 去重 - 基于URL
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.url === result.url)
    )

    return NextResponse.json(uniqueResults)
  } catch (error) {
    console.error('搜索API错误:', error)
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    )
  }
}
