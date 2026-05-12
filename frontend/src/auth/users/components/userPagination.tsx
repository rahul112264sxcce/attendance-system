import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationProps } from "../types/users.types";

const UserPagination = ({
    page,
    setPage,
    fetching,
    total,
    has_prev,
    has_next,
    limit
}: PaginationProps) => {

    const totalPages = Math.ceil((total || 0) / limit)

    // Hide pagination if only 1 page
    if (!total) return null

    const handleNext = () => {
        if (has_next) setPage(page + 1)
    }

    const handlePrevious = () => {
        if (has_prev) setPage(page - 1)
    }

    return (
        <Pagination className="mx-0 w-auto justify-start flex gap-2 items-center">
            <PaginationContent className="flex items-center gap-2">

                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        className={`${has_prev ? "cursor-pointer" : "cursor-not-allowed"} border-primary`}
                        onClick={handlePrevious}
                        isActive={has_prev}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={i + 1 === page}
                            onClick={() => setPage(i + 1)}
                            className={`${fetching ? "cursor-not-allowed" : "cursor-pointer"} border-primary`}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        className={`${has_next ? "cursor-pointer" : "cursor-not-allowed"} border-primary`}
                        onClick={handleNext}
                        isActive={has_next}
                    />
                </PaginationItem>

            </PaginationContent>
        </Pagination>
    )
}

export default UserPagination

