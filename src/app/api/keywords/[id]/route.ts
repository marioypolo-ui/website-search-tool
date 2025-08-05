import { NextRequest, NextResponse } from 'next/server'

// 模拟关键词数据存储
let mockKeywords = [
  {
    id: '1',
    keyword: '示例关键词'
  }
]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const index = mockKeywords.findIndex(k => k.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: '关键词不存在' },
        { status: 404 }
      )
    }

    mockKeywords.splice(index, 1)
    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除关键词失败:', error)
    return NextResponse.json(
      { error: '删除关键词失败' },
      { status: 500 }
    )
  }
}
