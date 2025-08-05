import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.website.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete website:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete website' }, { status: 500 })
  }
}
