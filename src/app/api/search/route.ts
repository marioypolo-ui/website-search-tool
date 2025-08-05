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

    console.log('搜索请求参数:', { websites, keywords })

    if (!websites || !keywords || websites.length === 0 || keywords.length === 0) {
      return NextResponse.json(
        { error: '请提供网站和关键词' },
        { status: 400 }
      )
    }

    // 测试ZAI SDK是否正常工作
    try {
      const zai = await ZAI.create()
      console.log('ZAI SDK 创建成功')
      
      // 先进行一个简单的测试搜索
      const testResult = await zai.functions.invoke("web_search", {
        query: "测试搜索",
        num: 1
      })
      console.log('测试搜索结果:', testResult)
    } catch (error) {
      console.error('ZAI SDK 初始化失败:', error)
      // 如果ZAI SDK失败，返回一些模拟结果用于测试
      const mockResults: SearchResult[] = []
      websites.forEach((website, websiteIndex) => {
        keywords.forEach((keyword, keywordIndex) => {
          mockResults.push({
            id: `mock-${websiteIndex}-${keywordIndex}`,
            title: `模拟搜索结果: ${keyword.keyword}`,
            url: website.url,
            snippet: `这是一个模拟结果，因为ZAI SDK无法正常工作。关键词: ${keyword.keyword}, 网站: ${website.url}`,
            websiteId: website.id,
            keywordId: keyword.id
          })
        })
      })
      return NextResponse.json(mockResults)
    }

    const zai = await ZAI.create()
    const allResults: SearchResult[] = []

    // 为每个关键词在每个网站中搜索
    for (const keyword of keywords) {
      for (const website of websites) {
        try {
          // 构建搜索查询，限制在特定网站
          const searchQuery = `${keyword.keyword} site:${website.url}`
          console.log(`搜索查询: ${searchQuery}`)
          
          const searchResult = await zai.functions.invoke("web_search", {
            query: searchQuery,
            num: 10 // 每个搜索最多返回10个结果
          })
          
          console.log(`搜索结果 for ${searchQuery}:`, searchResult)

          if (searchResult && Array.isArray(searchResult)) {
            console.log(`找到 ${searchResult.length} 个结果`)
            // 处理搜索结果
            for (const item of searchResult) {
              console.log(`处理结果项:`, item)
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
                console.log(`添加结果: ${result.title}`)
              } else {
                console.log(`结果URL不匹配目标网站: ${item.url} 不包含 ${website.url}`)
              }
            }
          } else {
            console.log(`搜索结果无效或不是数组:`, searchResult)
          }
        } catch (error) {
          console.error(`搜索失败: ${website.url} - ${keyword.keyword}`, error)
          // 继续搜索其他网站和关键词，不因为单个搜索失败而停止
        }
      }
    }

    console.log(`总共找到 ${allResults.length} 个结果`)

    // 去重 - 基于URL
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.url === result.url)
    )

    console.log(`去重后剩下 ${uniqueResults.length} 个结果`)

    return NextResponse.json(uniqueResults)
  } catch (error) {
    console.error('搜索API错误:', error)
    return NextResponse.json(
      { error: '搜索失败，请稍后重试' },
      { status: 500 }
    )
  }
}
