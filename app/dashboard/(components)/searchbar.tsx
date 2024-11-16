'use client'

import React from 'react'
import { Search, ArrowUpDown, Clock, Tag, ArrowDownAZ, ArrowUpAZ, SquareAsterisk } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SearchBarProps {
    onSearch: (query: string) => void
    onSort: (sortBy: string) => void
    placeholder?: string
}

export default function SearchBar({ onSearch, onSort, placeholder = "Search properties..." }: SearchBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start gap-4 p-4 max-w-4xl">
            <Select onValueChange={onSort}>
                <SelectTrigger className="w-full sm:w-[200px] transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <SelectValue placeholder="Sort by..." />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="updated" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Last Updated</span>
                    </SelectItem>
                    <SelectItem value="price_asc" className="flex items-center gap-2">
                        <ArrowUpAZ className="h-4 w-4" />
                        <span>Price (Low to High)</span>
                    </SelectItem>
                    <SelectItem value="price_desc" className="flex items-center gap-2">
                        <ArrowDownAZ className="h-4 w-4" />
                        <span>Price (High to Low)</span>
                    </SelectItem>
                    <SelectItem value="sqm" className="flex items-center gap-2">
                        <SquareAsterisk className="h-4 w-4" />
                        <span>Square Meters</span>
                    </SelectItem>
                </SelectContent>
            </Select>
            <div className="relative flex items-center flex-1 w-full max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 transition-all duration-300 group-focus-within:text-primary" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e) => onSearch(e.target.value)}
                    className="pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>
        </div>
    )
}
