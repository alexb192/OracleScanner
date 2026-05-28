'use client'

import { useRef, useEffect, useActionState, useState, startTransition } from 'react'
import jsQR from 'jsqr'
import { handleCheckOutById } from '@/app/actions/forms'

export default function QRScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanningRef = useRef(false)
  const rafRef = useRef<number>(0)
  const onPlayingRef = useRef<(() => void) | null>(null)

  // hasScanned distinguishes "initial null state" from "action returned null (success)"
  const [hasScanned, setHasScanned] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const [state, formAction, pending] = useActionState(handleCheckOutById, null)

  // Ref so the scan-loop closure always calls the latest formAction without
  // making it a dependency of the camera useEffect.
  const formActionRef = useRef(formAction)
  formActionRef.current = formAction

  const startScanning = () => {
    scanningRef.current = true

    const scan = () => {
      if (!scanningRef.current) return

      const canvas = canvasRef.current
      const v = videoRef.current
      if (!canvas || !v) return

      // Wait until the video has actual frame data
      if (v.readyState >= v.HAVE_ENOUGH_DATA) {
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = v.videoWidth
        canvas.height = v.videoHeight
        ctx.drawImage(v, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const result = jsQR(imageData.data, imageData.width, imageData.height)

        if (result && /^\d+$/.test(result.data.trim())) {
          // Purely numeric QR code — stop the scan loop and submit.
          // The video stream keeps running.
          const itemId = parseInt(result.data.trim(), 10)
          scanningRef.current = false
          setHasScanned(true)
          const fd = new FormData()
          fd.set('itemId', String(itemId))
          startTransition(() => formActionRef.current(fd))
          return
        }
      }

      rafRef.current = requestAnimationFrame(scan)
    }

    rafRef.current = requestAnimationFrame(scan)
  }

  // Camera starts once on mount and stays on until unmount.
  
  // plain HTTP connections will have no camera access, this notifies them
  // and gives them a clear error message with a solution. 
  useEffect(() => {
    if (!navigator.mediaDevices) {
      setCameraError('Camera not available — please use a secure (HTTPS) connection.')
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        const video = videoRef.current
        if (!video) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        video.srcObject = stream
        video.play().catch(() =>
          setCameraError('Could not start video playback. Try reloading the page.')
        )
        // Begin scanning only once the stream is actively playing so we
        // never read a frozen frame from a previous session.
        const onPlaying = () => startScanning()
        onPlayingRef.current = onPlaying
        video.addEventListener('playing', onPlaying, { once: true })
      })
      .catch((err: DOMException) => {
        const msg =
          err.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permission and try again.'
            : 'Could not access a camera. Check your device settings and try again.'
        setCameraError(msg)
      })

    return () => {
      scanningRef.current = false
      cancelAnimationFrame(rafRef.current)
      const video = videoRef.current
      if (video) {
        if (onPlayingRef.current) {
          video.removeEventListener('playing', onPlayingRef.current)
          onPlayingRef.current = null
        }
        if (video.srcObject) {
          ;(video.srcObject as MediaStream).getTracks().forEach((t) => t.stop())
          video.srcObject = null
        }
      }
    }
  }, [])

  // Once the action settles (success or error), show the result for 3 s,
  // then clear status state and resume scanning.
  useEffect(() => {
    if (!hasScanned || pending) return
    const id = setTimeout(() => {
      setHasScanned(false)
      startScanning()
    }, 3000)
    return () => clearTimeout(id)
  }, [hasScanned, pending])

  // Camera errors clear themselves after 3 s.
  useEffect(() => {
    if (!cameraError) return
    const id = setTimeout(() => setCameraError(null), 3000)
    return () => clearTimeout(id)
  }, [cameraError])

  const isSubmitting  = hasScanned && pending
  const isSuccess     = hasScanned && !pending && !state?.error
  const isActionError = hasScanned && !pending && !!state?.error

  let statusText: string
  let statusColor: string

  if (cameraError) {
    statusText = cameraError
    statusColor = 'text-red-400'
  } else if (isSubmitting) {
    statusText = 'Checking out…'
    statusColor = 'text-zinc-500 dark:text-zinc-400'
  } else if (isSuccess) {
    statusText = 'Item checked out!'
    statusColor = 'text-green-400'
  } else if (isActionError) {
    statusText = state!.error
    statusColor = 'text-red-400'
  } else {
    statusText = 'Scanning…'
    statusColor = 'text-zinc-500 dark:text-zinc-400'
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-sm p-6 w-full">
      <h1 className="text-zinc-900 dark:text-white font-medium text-sm mb-4">
        Scan QR Code
      </h1>

      <div className="rounded-md overflow-hidden bg-black aspect-square">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
      </div>

      <p className={`text-sm text-center mt-3 ${statusColor}`}>
        {statusText}
      </p>

      {/* Hidden canvas used for frame capture — never displayed */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
