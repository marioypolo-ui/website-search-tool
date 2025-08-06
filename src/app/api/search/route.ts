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
  ],
  '废标': [
    {
      title: '关于XX项目废标公告',
      url: '/notice/cancellation-001',
      snippet: '因有效投标人不足三家，根据相关法律法规，本项目作废标处理。'
    },
    {
      title: 'XX工程废标公示',
      url: '/project/cancellation-002',
      snippet: '由于投标文件不符合要求，经评标委员会评审，本项目予以废标。'
    },
    {
      title: '废标通知',
      url: '/notice/cancellation-003',
      snippet: '关于XX采购项目废标的通知，将重新组织招标活动。'
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    // 添加更详细的调试信息
    const requestBody = await request.text()
    console.log('原始请求体:', requestBody)
    
    const { websites, keywords }: { websites: Website[], keywords: Keyword[] } = await request.json()

    console.log('解析后的搜索请求参数:', { 
      websites: websites ? `数量: ${websites.length}, 内容: ${JSON.stringify(websites)}` : 'undefined',
      keywords: keywords ? `数量: ${keywords.length}, 内容: ${JSON.stringify(keywords)}` : 'undefined'
    })

    if (!websites || !keywords || websites.length === 0 || keywords.length === 0) {
      console.log('参数验证失败: websites或keywords为空')
      return NextResponse.json(
        { error: '请提供网站和关键词', debug: { websites, keywords } },
        { status: 400 }
      )
    }

    const allResults: SearchResult[] = []

    // 为每个关键词在每个网站中搜索
    for (const keyword of keywords) {
      console.log(`处理关键词: ${keyword.keyword} (ID: ${keyword.id})`)
      for (const website of websites) {
        console.log(`处理网站: ${website.url} (ID: ${website.id})`)
        
        try {
          // 根据关键词匹配模拟结果
          const keywordText = keyword.keyword.toLowerCase()
          console.log(`关键词小写: ${keywordText}`)
          
          let matchedResults: MockResult[] = []
          
          // 查找匹配的模拟结果 - 更智能的匹配
          console.log('开始匹配关键词...')
          for (const [key, results] of Object.entries(mockSearchResults)) {
            console.log(`检查匹配: "${keywordText}" vs "${key.toLowerCase()}"`)
            // 精确匹配或包含匹配
            if (keywordText === key.toLowerCase() || 
                keywordText.includes(key.toLowerCase()) || 
                key.toLowerCase().includes(keywordText)) {
              matchedResults = results
              console.log(`✅ 匹配成功! 关键词: ${key}, 结果数量: ${results.length}`)
              break
            }
          }
          
          // 如果没有匹配到，使用通用结果
          if (matchedResults.length === 0) {
            console.log('❌ 未找到匹配的模拟结果，使用通用结果')
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
            console.log(`✅ 添加结果: ${searchResult.title}`)
            console.log(`   URL: ${searchResult.url}`)
          })
          
        } catch (error) {
          console.error(`❌ 搜索失败: ${website.url} - ${keyword.keyword}`, error)
        }
      }
    }

    console.log(`🎯 总共找到 ${allResults.length} 个结果`)
    console.log('所有结果:', JSON.stringify(allResults, null, 2))

    // 去重 - 基于URL
    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.url === result.url)
    )

    console.log(`🔄 去重后剩下 ${uniqueResults.length} 个结果`)

    // 返回结果和调试信息
    const response = {
      results: uniqueResults,
      debug: {
        requestWebsites: websites,
        requestKeywords: keywords,
        totalResultsBeforeDedupe: allResults.length,
        totalResultsAfterDedupe: uniqueResults.length,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ 搜索API错误:', error)
    return NextResponse.json(
      { 
        error: '搜索失败，请稍后重试',
        debug: { errorMessage: error.message, stack: error.stack }
      },
      { status: 500 }
    )
  }
}
