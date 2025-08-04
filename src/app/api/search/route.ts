import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { websites, keywords } = await request.json()
    
    if (!websites || !keywords || websites.length === 0 || keywords.length === 0) {
      return NextResponse.json({ error: 'Websites and keywords are required' }, { status: 400 })
    }

    const results = []

    for (const website of websites) {
      for (const keyword of keywords) {
        try {
          const zai = await ZAI.create()
          
          const searchResult = await zai.functions.invoke("web_search", {
            query: `site:${website} ${keyword}`,
            num: 5
          })

          if (searchResult && Array.isArray(searchResult)) {
            for (const result of searchResult) {
              const savedResult = await db.searchResult.create({
                data: {
                  websiteId: website,
                  keywordId: keyword,
                  title: result.name || result.title || '',
                  url: result.url || '',
                  snippet: result.snippet || ''
                }
              })
              results.push(savedResult)
            }
          }
        } catch (error) {
          console.error(`搜索失败 ${website} - ${keyword}:`, error)
        }
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('搜索失败:', error)
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 })
  }
}
