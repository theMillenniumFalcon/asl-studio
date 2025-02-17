"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-10 flex align-center justify-between h-[57px] bg-background items-center gap-1 border-b px-4">
            <h1 className="text-base md:text-lg font-semibold">
                <Link href="/">
                    <span className="flex flex-row">ASL Studio</span>
                </Link>
            </h1>
            <ThemeToggle />
        </header>
    )
}