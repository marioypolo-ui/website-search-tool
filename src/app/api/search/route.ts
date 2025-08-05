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

interface MockResult {
  title: string
  url: string
  snippet: string
}

// 模拟搜索结果数据
const mockSearchResults: Record<string, MockResult[]> = {
  '招标': [
    {
      title: '政府采购招标公告',
      url: '/procurement/notice-001',
      snippet: '关于XX项目的政府采购招标公告，预算金额50万元，投标截止时间2024年1月15日。'
    },
    {
      title: '工程建设招标信息',
      url: '/construction/tender-002',
      snippet: 'XX工程建设招标项目，要求具备相关资质，工期6个月，欢迎符合条件的单位投标。'
    }
  ],
  '采购': [
    {
      title: '设备采购项目',
      url: '/equipment/purchase-003',
      snippet: '办公设备采购项目，包括电脑、打印机等，预算30万元，采用公开招标方式。'
    },
    {
      title: '服务采购公告',
      url: '/service/purchase-004',
      snippet: '技术服务采购项目，需要专业团队提供系统维护服务，服务期一年。'
    }
  ],
  '中标': [
    {
      title: '中标结果公示',
      url: '/results/award-005',
      snippet: 'XX项目中标结果公示，中标单位XX公司，中标金额45万元。'
    }
  ],
  '公告': [
    {
      title: '重要通知公告',
      url: '/notice/important-006',
      snippet: '关于系统升级维护的通知，将于本周末进行系统维护，请提前做好准备。'
    }
  ]
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

    const allResults: SearchResult[] = []

    // 为每个关键词在每个网站中搜索
    for (const keyword of keywords) {
      for (const website of websites) {
        try {
          console.log(`搜索关键词: ${keyword.keyword} 在网站: ${website.url}`)
          
          // 根据关键词匹配模拟结果
          const keywordText = keyword.keyword.toLowerCase()
          let matchedResults: MockResult[] = []
          
          // 查找匹配的模拟结果
          for (const [key, results] of Object.entries(mockSearchResults)) {
            if (keywordText.includes(key) || key.includes(keywordText)) {
              matchedResults = results
              break
            }
          }
          
          // 如果没有匹配到，使用通用结果
          if (matchedResults.length === 0) {
            matchedResults = [
              {
                title: `关于"${keyword.keyword}"的搜索结果`,
                url: `/search/${encodeURIComponent(keyword.keyword)}`,
                snippet: `在网站 ${website.url} 中找到与"${keyword.keyword}"相关的信息。`
              }
            ]
          }
          
          // 为每个匹配结果创建搜索结果对象
          matchedResults.forEach((result, index) => {
            const searchResult: SearchResult = {
              id: `${website.id}-${keyword.id}-${index}-${Date.now()}`,
              title: result.title,
              url: website.url.endsWith('/') ? website.url + result.url.slice(1) : website.url + result.url,
              snippet: result.snippet,
              websiteId: website.id,
              keywordId: keyword.id
            }
            allResults.push(searchResult)
            console.log(`添加结果: ${searchResult.title}`)
          })
          
        } catch (error) {
          console.error(`搜索失败: ${website.url} - ${keyword.keyword}`, error)
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
