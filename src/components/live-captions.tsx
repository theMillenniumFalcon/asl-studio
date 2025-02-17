import { Card, CardContent } from "@/components/ui/card"

interface LiveCaptionsProps {
    text: string;
}

export const LiveCaptions: React.FC<LiveCaptionsProps> = ({ text }) => {
    return (
        <Card className="mb-4">
            <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-2">Live Captions</h2>
                <p className="text-xl">{text || "Waiting for ASL interpretation..."}</p>
            </CardContent>
        </Card>
    )
}