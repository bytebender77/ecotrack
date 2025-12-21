import * as React from "react"
import { CalendarIcon } from "lucide-react"

export function CalendarDateRangePicker({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className}>
            <button className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm">
                <CalendarIcon className="h-4 w-4" />
                <span>Filter Date</span>
            </button>
        </div>
    )
}
