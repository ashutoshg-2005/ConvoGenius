import { LoadingState } from "@/components/loading-state";
import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary , dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
const Pages = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());



    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<LoadingState title = "Loading Agents" description="This may take a few seconds" />}>
            <ErrorBoundary fallback={<LoadingState title = "Error loading agents" description="Please try again later" />}>
             <AgentView />
             </ErrorBoundary>
            </Suspense>
   
        </HydrationBoundary>
    )
}
 
export default Pages;
