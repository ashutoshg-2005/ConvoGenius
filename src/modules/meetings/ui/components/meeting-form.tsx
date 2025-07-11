import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MeetingGetOne } from "../../types";
import { meetingsInsertSchema } from "../../schemas";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";


interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
};

export const MeetingForm = ({
     onSuccess, 
     onCancel, 
     initialValues }: MeetingFormProps) => {
        const trpc = useTRPC();
        const [OpenNewAgentDialog, setOpenNewAgentDialog]= useState(false);   
        const [agentSearch, setAgentSearch] = useState("");
        const agents = useQuery(
            trpc.agents.getMany.queryOptions({
                pageSize:100,
                search: agentSearch,
            }),
        );
        const queryClient = useQueryClient();

        const createMeeting = useMutation(
            trpc.meetings.create.mutationOptions({
                onSuccess: async (data) => {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getMany.queryOptions({}),
                    );

                    if(initialValues?.id){
                        await queryClient.invalidateQueries(
                            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                        );
                    }
                    onSuccess?.(data.id); 
                },
                onError: (error) => {
                    toast.error(error.message);
                } 
            }),
        ) ;

        const updateMeeting = useMutation(
            trpc.meetings.update.mutationOptions({
                onSuccess: async () => {
                    await queryClient.invalidateQueries(
                        trpc.meetings.getMany.queryOptions({}),
                    );

                    
                    onSuccess?.(); 
                },
                onError: (error) => {
                    toast.error(error.message);
                } 
            }),
        ) ;

        const form = useForm<z.infer<typeof meetingsInsertSchema>>({
            resolver: zodResolver(meetingsInsertSchema),
            defaultValues: {
                name: initialValues?.name ?? "",
                agentId: initialValues?.agentId ?? "",
            },
        });

        const isEdit = !!initialValues?.id;
        const isPending = createMeeting.isPending || updateMeeting.isPending;

        const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
            if(isEdit){
                updateMeeting.mutate({...values, id: initialValues!.id });
            } else{
                createMeeting.mutate(values)
            }
        };


    return (
        <>
            <NewAgentDialog open={OpenNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name = "name"
                        control={form.control}
                        render = {({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <input
                                        {...field}
                                        placeholder="Eg: Math Tutor"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />
                    <FormField
                        name = "agentId"
                        control={form.control}
                        render = {({ field }) => (
                            <FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options = {(agents.data?.items??[]) .map((agent) => ({
                                            id: agent.id,
                                            value: agent.id,
                                            children: (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar
                                                        seed = {agent.name}
                                                        variant = "botttsNeutral"
                                                        className="border size-6"
                                                    />
                                                    <span>{agent.name}</span>
                                                </div>
                                            )
                                        }))}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        value={field.value}
                                        placeholder="Select an agent"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you are looking for?{" "}
                                    <button
                                        type="button"
                                        className="text-primary hover:underline"
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create a new agent
                                    </button>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />
                    
                    <div className="flex justify-between gap-2">
                        {onCancel && (
                            <Button 
                                variant="ghost"
                                type="button"
                                onClick={() => onCancel()}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button disabled={isPending} type="submit">
                            {isEdit ? "Update Meeting" : "Create Meeting"}
                        </Button>
                    </div>

                </form>
            </Form>
        </>
    )

}