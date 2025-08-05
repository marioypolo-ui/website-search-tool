import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting keyword with id:', params.id)
    return NextResponse.json({ success: true, deletedId: params.id })
  } catch (error: any) {
    console.error('Failed to delete keyword:', error?.message || error)
    return NextResponse.json({ error: 'Failed to delete keyword' }, { status: 500 })
  }
}
