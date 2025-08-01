import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeetingGetOne } from "../../types";
import { BookOpenTextIcon, ClockFadingIcon, FileTextIcon, SparklesIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown"
import Link from "next/link";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
    data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Tabs defaultValue="summary">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3">
                    <ScrollArea>
                        <TabsList className="p-0 bg-transparent dark:bg-transparent justify-start rounded-none h-13">
                            <TabsTrigger
                             value="summary"
                             className="text-gray-600 dark:text-gray-400 rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 h-full hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                <BookOpenTextIcon />
                                Summary
                            </TabsTrigger>
                            <TabsTrigger
                             value="transcript"
                             className="text-gray-600 dark:text-gray-400 rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 h-full hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                <FileTextIcon />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger
                             value="recording"
                             className="text-gray-600 dark:text-gray-400 rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 h-full hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                <FileTextIcon />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger
                             value="chat"
                             className="text-gray-600 dark:text-gray-400 rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-blue-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 h-full hover:text-gray-900 dark:hover:text-gray-100"
                            >
                                <SparklesIcon />
                                Ask AI
                            </TabsTrigger>
                        </TabsList>
                    </ScrollArea>
                </div>
                <TabsContent value="chat">
                    <ChatProvider meetingId={data.id} meetingName={data.name} />
                </TabsContent>
                <TabsContent value="transcript">
                    <Transcript meetingId={data.id} />
                </TabsContent>
                <TabsContent value="recording">
                    <div>
                        <video
                            src={data.recordingUrl!}
                            className="w-full rounded-lg" 
                            controls
                        />
                    </div>
                </TabsContent>
                <TabsContent value="summary">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-5 gap-y-4 flex flex-col col-span-5">
                            <h2 className="text-2xl font-medium capitalize text-gray-900 dark:text-gray-100">{data.name}</h2>
                            <div className="flex gap-x-2 items-center">
                                <Link 
                                    href={`/agents/${data.agent.id}`}
                                    className="flex items-center gap-x-2 underline underline-offset-4 capitalize text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                >
                                    <GeneratedAvatar 
                                        variant="botttsNeutral"
                                        seed={data.agent.name}
                                        className="size-5"
                                    />
                                    {data.agent.name}
                                </Link>{" "}
                                <p className="text-gray-600 dark:text-gray-400">{data.startedAt ? format(data.startedAt, "PPP"): ""}</p>
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <SparklesIcon className="size-4 text-gray-600 dark:text-gray-400"/>
                                <p className="text-gray-900 dark:text-gray-100">General Summary</p>
                            </div>
                            <Badge
                                className="flex items-center gap-x-2 [&>svg]:size-4 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                variant="outline"
                            >
                                <ClockFadingIcon className="text-blue-700 dark:text-blue-400"/>
                                {data.duration ? formatDuration(data.duration) : "No Duration"}
                            </Badge>
                            <div>
                                <Markdown
                                    components={{
                                        h1:(props) => (
                                            <h1 className="text-2xl font-medium mb-6" {...props} />
                                        ),
                                        h2:(props) => (
                                            <h1 className="text-xl font-medium mb-6" {...props} />
                                        ),
                                        h3:(props) => (
                                            <h1 className="text-lg font-medium mb-6" {...props} />
                                        ),
                                        h4:(props) => (
                                            <h1 className="text-base font-medium mb-6" {...props} />
                                        ),
                                        p:(props) => (
                                            <p className="mb-6 leading-relaxed" {...props} />
                                        ),
                                        ul:(props) => (
                                            <ul className="list-disc list-inside mb-6" {...props} />
                                        ),
                                        ol:(props) => (
                                            <ol className="list-decimal list-inside mb-6" {...props} />
                                        ),
                                        li:(props) => (
                                            <li className="mb-1" {...props} />
                                        ),
                                        strong:(props) => (
                                            <strong className="font-semibold" {...props} />
                                        ),
                                        code:(props) => (
                                            <code className="bg-gray-100 p-1 py-0.5 rounded" {...props} />
                                        ),
                                        blockquote:(props) => (
                                            <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
                                        ),
                                    }}
                                >
                                    {data.summary || "No summary available."}
                                </Markdown>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
