import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "./ui/command";
import { cn } from "@/lib/utils";

interface Props{
    options: Array<{
        id: string;
        value: string;
        children:ReactNode;
    }>
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value?: string;
    placeholder?: string;
    isSearchable?: boolean;
    className?: string;
}
export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder = "Select an option",
    className,
}: Props) => {
    const [open, setOpen ] = useState(false);
    const selectedOption = options.find(option => option.value === value);

    const handleOpenChange = (value: boolean) => {
        onSearch?.("");
        setOpen(value);
    }

    return(
        <>
            <Button
                onClick={() => setOpen(true)}
                type = "button"
                variant ="outline"
                className={cn(
                    "h-9 justify-between font-normal px-2",
                    !selectedOption && "text-muted-foreground",
                    className,
                )}
            >
                <div>
                    {selectedOption ? selectedOption.children : placeholder}
                </div>
                <ChevronsUpDownIcon />
            </Button>
            <CommandResponsiveDialog
                open = {open}
                onOpenChange = {handleOpenChange}
                shouldFilter = {!onSearch}
            >
                <CommandInput placeholder="Search..." onValueChange={onSearch} />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">No options found</span>

                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            value={option.value}
                            onSelect={() => {
                                onSelect(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandResponsiveDialog>
        </>
    )
}