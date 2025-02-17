"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { WebcamFeed } from "@/components/webcam-feed"

export default function Home() {
  const [detectedSign, setDetectedSign] = useState("")

  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold my-4">ASL Studio</h1>

          <Card className="mb-8">
            <CardContent>
              <WebcamFeed onSignDetected={setDetectedSign} />
              <h2>Detected Sign: {detectedSign}</h2>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
