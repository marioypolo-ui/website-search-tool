'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink, Plus, Trash2, Search, Globe, Key } from 'lucide-react'

interface Website {
  id: string
  url: string
  title: string
  createdAt: Date
}

interface Keyword {
  id: string
  keyword: string
  createdAt: Date
}

interface SearchResult {
  id: string
  websiteId: string
  keywordId: string
  title: string
  url: string
  snippet: string
  createdAt: Date
}

export default function Home() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [results, setResults] = useState<SearchResult[]>([])
  const [newWebsite, setNewWebsite] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 获取网站列表
  const fetchWebsites = async () => {
    try {
      const response = await fetch('/api/websites')
      if (response.ok) {
        const data = await response.json()
        setWebsites(data)
      }
    } catch (error) {
      console.error('获取网站列表失败:', error)
    }
  }

  // 获取关键词列表
  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/keywords')
      if (response.ok) {
        const data = await response.json()
        setKeywords(data)
      }
    } catch (error) {
      console.error('获取关键词列表失败:', error)
    }
  }

  // 添加网站
  const addWebsite = async () => {
    if (!newWebsite.trim()) return

    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newWebsite }),
      })

      if (response.ok) {
        setNewWebsite('')
        await fetchWebsites()
      }
    } catch (error) {
      console.error('添加网站失败:', error)
    }
  }

  // 添加关键词
  const addKeyword = async () => {
    if (!newKeyword.trim()) return

    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: newKeyword }),
      })

      if (response.ok) {
        setNewKeyword('')
        await fetchKeywords()
      }
    } catch (error) {
      console.error('添加关键词失败:', error)
    }
  }

  // 删除网站
  const deleteWebsite = async (id: string) => {
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchWebsites()
      }
    } catch (error) {
      console.error('删除网站失败:', error)
    }
  }

  // 删除关键词
  const deleteKeyword = async (id: string) => {
    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchKeywords()
      }
    } catch (error) {
      console.error('删除关键词失败:', error)
    }
  }

  // 执行搜索
  const performSearch = async () => {
    if (websites.length === 0 || keywords.length === 0) {
      alert('请先添加网站和关键词')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websites: websites.map(w => w.url),
          keywords: keywords.map(k => k.keyword),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWebsites()
    fetchKeywords()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">网站检索工具</h1>
          <p className="text-gray-600">在多个网站中搜索关键词，快速找到相关信息</p>
        </div>

        <Tabs defaultValue="websites" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="websites" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              网站管理
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              关键词管理
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              搜索结果
            </TabsTrigger>
          </TabsList>

          <TabsContent value="websites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>添加网站</CardTitle>
                <CardDescription>输入您想要检索的网站URL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addWebsite()}
                  />
                  <Button onClick={addWebsite}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>网站列表</CardTitle>
                <CardDescription>已添加的网站 ({websites.length})</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {websites.map((website) => (
                      <div key={website.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{website.url}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWebsite(website.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {websites.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        还没有添加网站
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>添加关键词</CardTitle>
                <CardDescription>输入您想要搜索的关键词</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="输入关键词"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                  />
                  <Button onClick={addKeyword}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>关键词列表</CardTitle>
                <CardDescription>已添加的关键词 ({keywords.length})</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword) => (
                      <Badge key={keyword.id} variant="secondary" className="flex items-center gap-1">
                        {keyword.keyword}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => deleteKeyword(keyword.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {keywords.length === 0 && (
                      <div className="text-center py-8 text-gray-500 w-full">
                        还没有添加关键词
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>开始搜索</CardTitle>
                <CardDescription>点击按钮在所有网站中搜索关键词</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={performSearch} 
                  disabled={isLoading || websites.length === 0 || keywords.length === 0}
                  className="w-full"
                >
                  {isLoading ? '搜索中...' : '开始搜索'}
                  <Search className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>搜索结果</CardTitle>
                <CardDescription>找到 {results.length} 个结果</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div key={result.id} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{result.snippet}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{result.keyword}</Badge>
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                访问链接
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {results.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        还没有搜索结果
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
