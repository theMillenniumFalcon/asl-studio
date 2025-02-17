"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import "@tensorflow/tfjs-backend-webgl"
import * as handpose from "@tensorflow-models/handpose"
import * as tf from "@tensorflow/tfjs"
import { GestureEstimator, Gestures } from "fingerpose"
import Webcam from "react-webcam"
import { drawHand } from "../lib/draw-hand"

interface WebcamFeedProps {
    onSignDetected: (sign: string) => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({ onSignDetected }) => {
    const webcamRef = useRef<Webcam>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(true)

    const handleSignDetected = useCallback(onSignDetected, [])

    useEffect(() => {
        const runHandpose = async () => {
            await tf.setBackend("webgl")
            await tf.ready()
            console.log("TensorFlow.js backend:", tf.getBackend())
        
            const net = await handpose.load()
    
            setLoading(false)
    
            setInterval(async () => {
                const video = webcamRef.current?.video
                if (video && video.readyState === 4) {
                    const hand = await net.estimateHands(video)
            
                    if (hand.length > 0) {
                        const ctx = canvasRef.current?.getContext("2d")
                        if (ctx) drawHand(hand, ctx)
            
                        const GE = new GestureEstimator([Gestures.ThumbsUpGesture, Gestures.VictoryGesture])
            
                        const estimatedGestures = GE.estimate(hand[0].landmarks, 8.5)
            
                        if (estimatedGestures.gestures.length > 0) {
                            const gesture = estimatedGestures.gestures.reduce(
                                (prev: { name: string; confidence: number }, current: { name: string; confidence: number }) =>
                                prev.confidence > current.confidence ? prev : current
                            )
                            handleSignDetected(gesture.name)
                        }
                    }
                }
            }, 500)
        }
    
        runHandpose()
    }, [handleSignDetected, webcamRef])

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