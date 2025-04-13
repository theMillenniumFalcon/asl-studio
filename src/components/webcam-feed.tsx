"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import "@tensorflow/tfjs-backend-webgl"
import * as handpose from "@tensorflow-models/handpose"
import * as tf from "@tensorflow/tfjs"
import Webcam from "react-webcam"
import { drawHand } from "../lib/draw-hand"

interface WebcamFeedProps {
    onSignDetected: (sign: string) => void;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({ onSignDetected }) => {
    const webcamRef = useRef<Webcam>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(true)
    const netRef = useRef<handpose.HandPose | null>(null)
    const lastGestureRef = useRef<string>("")
    const lastGestureTimeRef = useRef<number>(0)
    const GESTURE_DEBOUNCE_TIME = 300 // ms
    const [debugInfo, setDebugInfo] = useState<string>("")

    const handleSignDetected = useCallback((gesture: string) => {
        const now = Date.now()
        if (gesture !== lastGestureRef.current && 
            now - lastGestureTimeRef.current > GESTURE_DEBOUNCE_TIME) {
            lastGestureRef.current = gesture
            lastGestureTimeRef.current = now
            onSignDetected(gesture)
        }
    }, [onSignDetected])

    // Improved gesture detection based on finger positions
    const detectGesture = (landmarks: [number, number, number][]) => {
        // Wrist is at index 0
        const wrist = landmarks[0]
        
        // Thumb landmarks: 1-4
        const thumbBase = landmarks[1]
        const thumbMid = landmarks[2]
        const thumbTip = landmarks[4]
        
        // Index finger landmarks: 5-8
        const indexBase = landmarks[5]
        const indexMid = landmarks[6]
        const indexTip = landmarks[8]
        
        // Middle finger landmarks: 9-12
        const middleBase = landmarks[9]
        const middleMid = landmarks[10]
        const middleTip = landmarks[12]
        
        // Ring finger landmarks: 13-16
        const ringBase = landmarks[13]
        const ringMid = landmarks[14]
        const ringTip = landmarks[16]
        
        // Pinky finger landmarks: 17-20
        const pinkyBase = landmarks[17]
        const pinkyMid = landmarks[18]
        const pinkyTip = landmarks[20]
        
        // Helper function to check if a finger is extended
        const isFingerExtended = (base: [number, number, number], mid: [number, number, number], tip: [number, number, number]) => {
            // Calculate the distance from base to tip
            const baseToTip = Math.sqrt(
                Math.pow(tip[0] - base[0], 2) + 
                Math.pow(tip[1] - base[1], 2)
            )
            
            // Calculate the distance from base to mid
            const baseToMid = Math.sqrt(
                Math.pow(mid[0] - base[0], 2) + 
                Math.pow(mid[1] - base[1], 2)
            )
            
            // Calculate the distance from mid to tip
            const midToTip = Math.sqrt(
                Math.pow(tip[0] - mid[0], 2) + 
                Math.pow(tip[1] - mid[1], 2)
            )
            
            // If the finger is extended, the tip should be further from the base than the mid point
            // We also check if the tip is above the base (y-coordinate is smaller)
            return baseToTip > baseToMid && tip[1] < base[1]
        }
        
        // Check if thumb is extended (for letter A)
        // For thumb, we use a different approach since it has a different orientation
        const thumbDistance = Math.sqrt(
            Math.pow(thumbTip[0] - thumbBase[0], 2) + 
            Math.pow(thumbTip[1] - thumbBase[1], 2)
        )
        
        // Thumb is extended if it's pointing sideways (to the right) and not too far up or down
        const isThumbExtended = thumbTip[0] > thumbBase[0] && 
                               thumbDistance > 30 &&  // Ensure thumb is actually extended
                               Math.abs(thumbTip[1] - thumbBase[1]) < 100  // More lenient vertical check
        
        // Check if index finger is extended
        const isIndexExtended = isFingerExtended(indexBase, indexMid, indexTip)
        
        // Check if middle finger is extended
        const isMiddleExtended = isFingerExtended(middleBase, middleMid, middleTip)
        
        // Check if ring finger is extended
        const isRingExtended = isFingerExtended(ringBase, ringMid, ringTip)
        
        // Check if pinky finger is extended
        const isPinkyExtended = isFingerExtended(pinkyBase, pinkyMid, pinkyTip)
        
        // Debug info
        const debug = `Thumb: ${isThumbExtended ? 'extended' : 'bent'}, 
                      Index: ${isIndexExtended ? 'extended' : 'bent'}, 
                      Middle: ${isMiddleExtended ? 'extended' : 'bent'}, 
                      Ring: ${isRingExtended ? 'extended' : 'bent'}, 
                      Pinky: ${isPinkyExtended ? 'extended' : 'bent'}`
        setDebugInfo(debug)
        
        // Detect ASL letters based on finger positions
        // Letter A: Thumb extended, other fingers closed
        if (isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
            return "A"
        }
        
        // Letter B: All fingers extended
        if (isThumbExtended && isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
            return "B"
        }
        
        // Letter C: All fingers curved
        if (!isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
            return "C"
        }
        
        // Letter V: Index and middle fingers extended, others closed
        if (!isThumbExtended && isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
            return "V"
        }
        
        // Letter I: Pinky extended, others closed
        if (!isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
            return "I"
        }
        
        // Letter L: Thumb and index extended, others closed
        if (isThumbExtended && isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
            return "L"
        }
        
        // Letter Y: Thumb and pinky extended, others closed
        if (isThumbExtended && !isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
            return "Y"
        }
        
        // Default to no gesture detected
        return ""
    }

    useEffect(() => {
        const runHandpose = async () => {
            await tf.setBackend("webgl")
            await tf.ready()
            console.log("TensorFlow.js backend:", tf.getBackend())
        
            const net = await handpose.load()
            netRef.current = net
            setLoading(false)

            const detectHands = async () => {
                if (!netRef.current || !webcamRef.current?.video) return

                const video = webcamRef.current.video
                if (video.readyState === 4) {
                    const hand = await netRef.current.estimateHands(video)
            
                    if (hand.length > 0) {
                        const ctx = canvasRef.current?.getContext("2d")
                        if (ctx) {
                            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
                            drawHand(hand, ctx)
                        }
            
                        // Use our improved gesture detection
                        const gesture = detectGesture(hand[0].landmarks)
                        if (gesture) {
                            handleSignDetected(gesture)
                        }
                    }
                }
                requestAnimationFrame(detectHands)
            }

            requestAnimationFrame(detectHands)
        }
    
        runHandpose()

        return () => {
            netRef.current = null
        }
    }, [handleSignDetected])

    return (
        <>
            {loading ? (
                <p>Loading Handpose model...</p>
            ) : (
                <div className="relative w-full">
                    <Webcam
                        ref={webcamRef}
                        videoConstraints={{ 
                            facingMode: "user",
                            width: { ideal: 640 },
                            height: { ideal: 480 }
                        }}
                        style={{ 
                            width: "100%", 
                            height: "auto",
                            display: "block"
                        }}
                    />    
                    <canvas 
                        ref={canvasRef} 
                        style={{ 
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }}
                        width={640}
                        height={480}
                    />
                    <div className="mt-2 text-xs text-gray-500">
                        {debugInfo}
                    </div>
                </div>
            )}
        </>
    )
}