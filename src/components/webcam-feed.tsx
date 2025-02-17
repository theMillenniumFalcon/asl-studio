"use client"

import React, { useRef, useState } from "react"
import Webcam from "react-webcam"

interface WebcamFeedProps {
    onSignDetected: (sign: string) => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({ onSignDetected }) => {
    const webcamRef = useRef<Webcam>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(true)

    return (
        <>
            {loading ? (
                <p>Loading Handpose model...</p>
            ) : (
                <>
                    <Webcam
                        ref={webcamRef}
                        videoConstraints={{ facingMode: "user" }}
                        style={{ width: "100%", height: "auto" }}
                    />    
                    <canvas ref={canvasRef} style={{ position: "absolute" }} />
                </>
            )}
        </>
    )
}