import { Button } from "@/components/ui/button";

interface Props{
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}


export const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
    return (
        <div className="flex items-center justify-between mt-4">
            <div className=" flex-1 text-sm text-muted-foreground ">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    disabled={page === 1}
                    onClick={() => onPageChange(Math.max( 1, page - 1))}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    variant="outline"
                    size="sm"
                >
                    Previous
                </Button>
                <Button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                    variant="outline"
                    size="sm"

                >
                    Next
                </Button>
            </div>
        </div>
    );
}