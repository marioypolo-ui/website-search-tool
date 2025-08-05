import { NextRequest, NextResponse } from 'next/server'

// 模拟网站数据存储
let mockWebsites = [
  {
    id: '1',
    url: 'https://example.com',
    title: '示例网站'
  }
]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const index = mockWebsites.findIndex(w => w.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: '网站不存在' },
        { status: 404 }
      )
    }

    mockWebsites.splice(index, 1)
    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除网站失败:', error)
    return NextResponse.json(
      { error: '删除网站失败' },
      { status: 500 }
    )
  }
}
