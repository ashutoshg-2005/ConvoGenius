"use client";

import {  useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client"; 
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentFilters } from "../../hooks/use-agent-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { DataTable } from "@/components/data-table";



export const AgentView = () => {
    const router = useRouter();
    const [filters, setFilters] = useAgentFilters();
    const trpc = useTRPC();
       
    const {data} =useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            <DataTable data = {data.items} columns = {columns} onRowClick={(row) => router.push(`/agents/${row.id}`)} />
            <DataPagination
                page = {filters.page}
                totalPages = {data.totalPages}
                onPageChange = {(page) => setFilters({ page })}  
            />
            {data.items.length === 0 && (
                <EmptyState
                    title = "Create your first agent"
                    description="Create an agent to join your meetings. Each agent can have its own instructions and can interact with different participants in the meeting."
                />
            )}
        </div>
    )
}
export const AgentsViewLoading = () => {
    return (
        <LoadingState 
            title="Loading agents..."
            description="Please wait while we load your agents."/>
    );
}

export const AgentsViewError = () => {
    return (
        <ErrorState
            title="Error loading agents"
            description="There was an error loading your agents. Please try again later."
        />
    );
}