"use client"

import React, { useState, useEffect } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Button } from "./ui/button"

interface SpeechSynthesisProps {
    text: string;
}

export const SpeechSynthesis: React.FC<SpeechSynthesisProps> = ({ text }) => {
    const [isSpeaking, setIsSpeaking] = useState(false)

    useEffect(() => {
        if (text && isSpeaking) {
            speak(text)
        }
    }, [text, isSpeaking])

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text)
        speechSynthesis.speak(utterance)
    }

    const toggleSpeech = () => {
        setIsSpeaking(!isSpeaking)
        if (isSpeaking) {
            speechSynthesis.cancel()
        } else if (text) {
            speak(text)
        }
    }

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{isSpeaking ? "Speech enabled" : "Speech disabled"}</p>
            <Button onClick={toggleSpeech} variant="outline" size="icon">
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
        </div>
    )
}