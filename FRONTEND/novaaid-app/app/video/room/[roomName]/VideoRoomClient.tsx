'use client'

import React, { useEffect, useRef, useState } from 'react'
import DailyIframe, { DailyCall } from '@daily-co/daily-js'
import { useAuth } from '@clerk/nextjs'

type Props = { 
  roomName: string
  resourceId?: string
}

export default function VideoRoomClient({ roomName, resourceId }: Props) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const callObjectRef = useRef<DailyCall | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [participants, setParticipants] = useState<number>(0)
  const { getToken } = useAuth()

  useEffect(() => {
    let mounted = true

    async function initCall() {
      try {
        setLoading(true)
        setError(null)

        // Get Clerk JWT token
        const clerkToken = await getToken()
        if (!clerkToken) {
          setError('Authentication required. Please sign in.')
          setLoading(false)
          return
        }

        // Request token + room url from backend
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
        const res = await fetch(`${backendUrl}/api/video/create`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clerkToken}`
          },
          body: JSON.stringify({ roomName, resourceId })
        })

        const data = await res.json()
        
        if (!res.ok || !data?.token || !data?.room?.url) {
          const errorMsg = data?.error || 'Failed to get meeting token or room'
          const errorDetails = data?.details ? ` - ${data.details}` : ''
          console.error('Video room error:', { status: res.status, data })
          setError(`${errorMsg}${errorDetails}`)
          setLoading(false)
          return
        }
        
        console.log('Successfully got room token')

        // Create call object and join
        const callObject = DailyIframe.createCallObject({
          url: data.room.url
        })
        callObjectRef.current = callObject

        // Set up event listeners
        callObject.on('joined-meeting', () => {
          console.log('Successfully joined meeting')
          setIsJoined(true)
          setLoading(false)
        })

        callObject.on('participant-joined', (ev) => {
          console.log('Participant joined:', ev.participant)
          updateParticipantCount(callObject)
        })

        callObject.on('participant-left', (ev) => {
          console.log('Participant left:', ev.participant)
          updateParticipantCount(callObject)
        })

        callObject.on('left-meeting', () => {
          console.log('Left meeting')
          setIsJoined(false)
        })

        callObject.on('error', (e) => {
          console.error('Daily error:', e)
          setError(`Video call error: ${e.errorMsg || 'Unknown error'}`)
        })

        // Join the call with the token
        await callObject.join({ url: data.room.url, token: data.token })

        // Update participant count
        updateParticipantCount(callObject)

      } catch (err) {
        console.error('Video room initialization error:', err)
        setError('Failed to initialize video room. Please try again.')
        setLoading(false)
      }
    }

    function updateParticipantCount(callObject: DailyCall) {
      const participantsList = callObject.participants()
      setParticipants(Object.keys(participantsList).length)
    }

    initCall()

    return () => {
      if (!mounted) return
      mounted = false
      
      // Cleanup
      const co = callObjectRef.current
      if (co) {
        co.leave().catch(() => {})
        try { 
          co.destroy() 
        } catch (e) {
          console.error('Cleanup error:', e)
        }
      }
    }
  }, [roomName, resourceId, getToken])

  const handleLeaveCall = async () => {
    const co = callObjectRef.current
    if (co) {
      await co.leave()
      window.location.href = '/homepage'
    }
  }

  const toggleAudio = () => {
    const co = callObjectRef.current
    if (co) {
      const isAudioEnabled = co.localAudio()
      co.setLocalAudio(!isAudioEnabled)
    }
  }

  const toggleVideo = () => {
    const co = callObjectRef.current
    if (co) {
      const isVideoEnabled = co.localVideo()
      co.setLocalVideo(!isVideoEnabled)
    }
  }

  return (
    <div className="w-full h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">NovaAid Video Call</h1>
          <p className="text-sm text-gray-400">Room: {roomName}</p>
        </div>
        <div className="flex items-center gap-4">
          {isJoined && (
            <span className="text-sm bg-green-600 px-3 py-1 rounded-full">
              {participants} participant{participants !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Joining room...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="bg-red-600 text-white p-6 rounded-lg max-w-md text-center">
              <h2 className="text-xl font-bold mb-2">Error</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Daily iframe will be injected here */}
        <div 
          id="call-frame" 
          ref={frameRef} 
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      {isJoined && !error && (
        <div className="bg-gray-800 p-4 flex justify-center gap-4">
          <button
            onClick={toggleAudio}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Toggle Audio
          </button>
          
          <button
            onClick={toggleVideo}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Toggle Video
          </button>
          
          <button
            onClick={handleLeaveCall}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Leave Call
          </button>
        </div>
      )}
    </div>
  )
}
