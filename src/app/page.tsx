'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Trash2, Globe, Type, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

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

export default function Home() {
  const [websites, setWebsites] = useState<Website[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [newWebsite, setNewWebsite] = useState('')
  const [newKeyword, setNewKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 加载网站列表
  const loadWebsites = async () => {
    try {
      const response = await fetch('/api/websites')
      if (response.ok) {
        const data = await response.json()
        setWebsites(data)
      }
    } catch (error) {
      console.error('加载网站失败:', error)
    }
  }

  // 加载关键词列表
  const loadKeywords = async () => {
    try {
      const response = await fetch('/api/keywords')
      if (response.ok) {
        const data = await response.json()
        setKeywords(data)
      }
    } catch (error) {
      console.error('加载关键词失败:', error)
    }
  }

  // 初始化加载数据
  useEffect(() => {
    loadWebsites()
    loadKeywords()
  }, [])

  const addWebsite = async () => {
    if (!newWebsite.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/websites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newWebsite.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '添加网站失败')
      }

      const website = await response.json()
      setWebsites(prev => [...prev, website])
      setNewWebsite('')
      
      toast({
        title: "网站已添加",
        description: `已添加网站: ${website.url}`
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: error instanceof Error ? error.message : '添加网站失败',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeWebsite = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除网站失败')
      }

      setWebsites(prev => prev.filter(w => w.id !== id))
      toast({
        title: "网站已删除",
        description: "网站已从列表中移除"
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "删除网站失败",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addKeyword = async () => {
    if (!newKeyword.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '添加关键词失败')
      }

      const keyword = await response.json()
      setKeywords(prev => [...prev, keyword])
      setNewKeyword('')
      
      toast({
        title: "关键词已添加",
        description: `已添加关键词: ${keyword.keyword}`
      })
    } catch (error) {
      toast({
        title: "添加失败",
        description: error instanceof Error ? error.message : '添加关键词失败',
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeKeyword = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('删除关键词失败')
      }

      setKeywords(prev => prev.filter(k => k.id !== id))
      toast({
        title: "关键词已删除",
        description: "关键词已从列表中移除"
      })
    } catch (error) {
      toast({
        title: "删除失败",
        description: "删除关键词失败",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (websites.length === 0) {
      toast({
        title: "请添加网站",
        description: "请先添加要搜索的网站",
        variant: "destructive"
      })
      return
    }
    
    if (keywords.length === 0) {
      toast({
        title: "请添加关键词",
        description: "请先添加要搜索的关键词",
        variant: "destructive"
      })
      return
    }

    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websites,
          keywords
        }),
      })

      if (!response.ok) {
        throw new Error('搜索失败')
      }

      const data = await response.json()
      const results = data.results || data // 兼容新旧格式
      setSearchResults(results)
      
      toast({
        title: "搜索完成",
        description: `找到 ${results.length} 个结果`
      })
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: "搜索失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            信息检索系统
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            智能搜索多个网站中的关键词，快速找到您需要的信息
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="setup">设置搜索</TabsTrigger>
              <TabsTrigger value="results">搜索结果</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Websites Section */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      网站列表
                    </CardTitle>
                    <CardDescription>
                      添加您想要搜索的网站URL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入网站URL (例如: https://example.com)"
                        value={newWebsite}
                        onChange={(e) => setNewWebsite(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addWebsite()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={addWebsite} 
                        size="icon"
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {websites.map((website) => (
                        <div key={website.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {website.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {website.url}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWebsite(website.id)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {websites.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>暂无网站，请添加要搜索的网站</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Keywords Section */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      关键词列表
                    </CardTitle>
                    <CardDescription>
                      添加您想要搜索的关键词
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入关键词"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addKeyword()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={addKeyword} 
                        size="icon"
                        disabled={isLoading}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                      {keywords.map((keyword) => (
                        <Badge
                          key={keyword.id}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {keyword.keyword}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeKeyword(keyword.id)}
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                      
                      {keywords.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 w-full">
                          <Type className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>暂无关键词，请添加要搜索的关键词</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search Button */}
              <div className="text-center">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || isLoading || websites.length === 0 || keywords.length === 0}
                  size="lg"
                  className="px-8 py-3 text-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {isSearching ? '搜索中...' : '开始搜索'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>搜索结果</CardTitle>
                  <CardDescription>
                    {searchResults.length > 0 
                      ? `找到 ${searchResults.length} 个匹配结果`
                      : '执行搜索后，结果将显示在这里'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div key={result.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white flex-1 pr-2">
                            {result.title}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(result.url, '_blank')}
                            className="flex-shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm mb-2 block"
                        >
                          {result.url}
                        </a>
                        {result.snippet && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {result.snippet}
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {searchResults.length === 0 && !isSearching && (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">暂无搜索结果</p>
                        <p>请先在"设置搜索"标签页中添加网站和关键词，然后点击"开始搜索"</p>
                      </div>
                    )}
                    
                    {isSearching && (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                        <p className="text-lg">正在搜索中，请稍候...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
