import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BanIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

interface Props {
    meetingId: string;
    onCancelMeeting: () => void;
    isCancelling: boolean;
}

export const UpcomingState = ({
    meetingId,
    onCancelMeeting,
    isCancelling
}: Props) => {
    return (
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
            <EmptyState 
                image="/upcoming.svg"
                title="No Upcoming Meetings"
                description="Once you create a meeting, a summary will appear here."
            />
            <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2">
                <Button
                    variant="secondary"
                    className="w-full lg:w-auto"
                    onClick={onCancelMeeting}
                    disabled={isCancelling}
                >
                    <BanIcon className="size-4" />
                    Cancel Meeting
                </Button>
                <Button 
                    asChild 
                    disabled={isCancelling} 
                    className="w-full lg:w-auto"
                >
                    <Link href={`/call/${meetingId}`}>
                        <VideoIcon className="size-4" />
                        Start Meeting
                    </Link>
                </Button>
            </div>
        </div>
    )
} 