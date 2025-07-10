import { LoadingState } from "@/components/loading-state";
import { auth } from "@/lib/auth";
import { AgentListHeader } from "@/modules/agents/ui/components/list-header";
import { AgentView } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary , dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
const Pages = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
      });
      if( !session) {
        redirect("/sign-in");
      }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());



    return(
        <>
            <AgentListHeader/> 
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<LoadingState title = "Loading Agents" description="This may take a few seconds" />}>
                <ErrorBoundary fallback={<LoadingState title = "Error loading agents" description="Please try again later" />}>
                <AgentView />
                </ErrorBoundary>
                </Suspense>
            </HydrationBoundary>
        </>
    );
}
 
export default Pages;
