export const drawHand = (predictions: { landmarks: [number, number, number][] }[], ctx: CanvasRenderingContext2D | null) => {
    if (!predictions || !ctx) return

    predictions.forEach((prediction) => {
        const { landmarks } = prediction
    
        for (let i = 0; i < landmarks.length; i++) {
            const [x, y] = landmarks[i]
    
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 3 * Math.PI)
            ctx.fillStyle = "red"
            ctx.fill()
        }
    })
}