"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../../hooks/use-agent-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentListHeader = () => {
  const [filters, setFilters ]= useAgentFilters();
  const [isDailogOpen, setIsDialogOpen] = useState(false);
  const isAnyFilterActive = !!filters.search;

  const onClearFilters = () => {
    setFilters({ 
      search: "",
      page: DEFAULT_PAGE,
    });


  }
  return (
    <>
        <NewAgentDialog open={isDailogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-2">
          <div className="flex items-center justify-between">
                  <h5 className="font-medium text-xl">My Agents</h5>
                  <Button onClick={() => setIsDialogOpen(true)} >
                      <PlusIcon/>
                      New Agent
                  </Button>
          </div>
          <div className="flex items-center gap-x-2 p-1  ">
            <AgentsSearchFilter />
            {isAnyFilterActive && (
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={onClearFilters}
              >
                Clear 
              </Button>
            )}
          </div>
        </div>
    </>
  );
}