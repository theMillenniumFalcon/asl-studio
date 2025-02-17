"use client"

import React from "react"

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return <div className={`border shadow-md rounded-lg ${className}`}>{children}</div>
}

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return <div className={`p-4 ${className}`}>{children}</div>
}

export { Card, CardContent }