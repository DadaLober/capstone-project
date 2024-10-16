import React, { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <div className="relative">
            <Button
                variant={"outline"}
                className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
            {isCalendarOpen && (
                <div className="absolute z-50 mt-2 bg-white border rounded-md shadow-lg">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate);
                            setIsCalendarOpen(false);
                        }}
                        initialFocus
                    />
                </div>
            )}
        </div>
    )
}