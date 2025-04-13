export const drawHand = (predictions: { landmarks: [number, number, number][] }[], ctx: CanvasRenderingContext2D | null) => {
    if (!predictions || !ctx) return

    predictions.forEach((prediction) => {
        const { landmarks } = prediction
        
        // Set line style
        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        
        // Draw connections between landmarks
        
        // Thumb
        drawLine(ctx, landmarks[0], landmarks[1])
        drawLine(ctx, landmarks[1], landmarks[2])
        drawLine(ctx, landmarks[2], landmarks[3])
        drawLine(ctx, landmarks[3], landmarks[4])
        
        // Index finger
        drawLine(ctx, landmarks[0], landmarks[5])
        drawLine(ctx, landmarks[5], landmarks[6])
        drawLine(ctx, landmarks[6], landmarks[7])
        drawLine(ctx, landmarks[7], landmarks[8])
        
        // Middle finger
        drawLine(ctx, landmarks[0], landmarks[9])
        drawLine(ctx, landmarks[9], landmarks[10])
        drawLine(ctx, landmarks[10], landmarks[11])
        drawLine(ctx, landmarks[11], landmarks[12])
        
        // Ring finger
        drawLine(ctx, landmarks[0], landmarks[13])
        drawLine(ctx, landmarks[13], landmarks[14])
        drawLine(ctx, landmarks[14], landmarks[15])
        drawLine(ctx, landmarks[15], landmarks[16])
        
        // Pinky finger
        drawLine(ctx, landmarks[0], landmarks[17])
        drawLine(ctx, landmarks[17], landmarks[18])
        drawLine(ctx, landmarks[18], landmarks[19])
        drawLine(ctx, landmarks[19], landmarks[20])
        
        // Draw dots at key points for better visibility
        for (let i = 0; i < landmarks.length; i++) {
            const [x, y] = landmarks[i]
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, 3 * Math.PI)
            ctx.fillStyle = "red"
            ctx.fill()
        }
    })
}

// Helper function to draw a line between two points
const drawLine = (ctx: CanvasRenderingContext2D, point1: [number, number, number], point2: [number, number, number]) => {
    ctx.beginPath()
    ctx.moveTo(point1[0], point1[1])
    ctx.lineTo(point2[0], point2[1])
    ctx.stroke()
}