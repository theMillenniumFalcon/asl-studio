declare module "fingerpose" {
    export class GestureEstimator {
        constructor(gestures: Array<{ name: string; confidence: number }>)
        estimate(handPose: number[][], confidence: number): {
            gestures: Array<{ name: string; confidence: number }>
        }
    }

    export const Gestures: {
        ThumbsUpGesture: { name: string; confidence: number }
        VictoryGesture: { name: string; confidence: number }
    }
}