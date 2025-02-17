"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { WebcamFeed } from "@/components/webcam-feed"
import { LiveCaptions } from "@/components/live-captions"
import { SpeechSynthesis } from "@/components/speech-synthesis"

export default function Home() {
  const [detectedSign, setDetectedSign] = useState("")

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center justify-center gap-4 p-8">
          <Card>
            <CardContent>
              <WebcamFeed onSignDetected={setDetectedSign} />
              <h2>Detected Sign: {detectedSign}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <LiveCaptions text={detectedSign} />
              <SpeechSynthesis text={detectedSign} />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
