"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
    return (
        <div className="flex w-full items-center justify-between p-6" >

            <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
                <span className="font-bold text-2xl">
                    JFSS Class of 2026
                </span>
            </Link>

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-base h-10 px-5")} >
                            <Link href="/login" >
                                Survey
                            </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-base h-10 px-5")} >
                            <Link href="/profile" >
                                Class Profile
                            </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-base h-10 px-5")} >
                            <Link href="/graduates" >
                                Graduates
                            </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "text-base h-10 px-5")} >
                            <Link href="/about" >
                                About
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}