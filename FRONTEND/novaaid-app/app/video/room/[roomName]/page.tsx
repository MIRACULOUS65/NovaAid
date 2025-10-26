import { Suspense } from 'react'
import VideoRoomClient from './VideoRoomClient'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

type Params = {
  params: Promise<{
    roomName: string
  }>
  searchParams: Promise<{
    resourceId?: string
  }>
}

export default async function VideoRoomPage({ params, searchParams }: Params) {
  // Check authentication
  const { userId } = await auth()
  
  // Await params and searchParams (required in Next.js 15+)
  const { roomName } = await params
  const { resourceId } = await searchParams
  
  if (!userId) {
    redirect('/sign-in?redirect_url=/video/room/' + roomName)
  }

  return (
    <main className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-xl">Loading video room...</div>
        </div>
      }>
        <VideoRoomClient roomName={roomName} resourceId={resourceId} />
      </Suspense>
    </main>
  )
}
