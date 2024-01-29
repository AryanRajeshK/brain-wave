"use client"

import { useModal } from "@/hooks/use-modal-store"
import { ServerWithMembersWithProfiles } from "@/types"
import { MemberRole } from "@prisma/client"
import { LogOut, Settings, Settings2, Text, Trash2, UserPlus2, Users2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole
}

export const ServerHeader = ({
    server,
    role
}: ServerHeaderProps) => {
    const { onOpen } = useModal();
    const isAdmin = role === MemberRole.ADMIN;
    const isMod = isAdmin || role === MemberRole.MODERATOR;

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
                >
                    <button
                    className="text-white w-full test-md font-semibold px-3 flex items-center h-12"
                    >
                        <Settings className="h-5 w-5 ml-auto hover:text-gray-400"/>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-white space-y-[2px]"
                >
                    {isMod && (
                        <DropdownMenuItem
                        onClick={() => onOpen("invite", {server})}
                        className="px-3 py-2 text-sm cursor-pointer"
                        >
                            <UserPlus2 className="h-4 w-4 mr-9"/>
                            Invite People
                            
                        </DropdownMenuItem>
                    )}
                    
                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("editServer", {server})}
                        className="px-3 py-2 text-sm cursor-pointer"
                        >
                            <Settings2 className="h-4 w-4 mr-9"/>
                            Settings
                            
                        </DropdownMenuItem>
                    )}
                    
                    {isAdmin && (
                        <DropdownMenuItem
                        onClick={() => onOpen("members", {server})}
                        className="px-3 py-2 text-sm cursor-pointer"
                        >
                            <Users2 className="h-4 w-4 mr-9"/>
                            Manage Members
                            
                        </DropdownMenuItem>
                    )}
                    {isMod && (
                        <DropdownMenuItem
                        onClick={() => onOpen("createChannel")}
                        className="px-3 py-2 text-sm cursor-pointer"
                        >
                            <Text className="h-4 w-4 mr-9"/>
                            Create Channel
                            
                        </DropdownMenuItem>
                    )}
                    
                    {isAdmin && (
                        <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                        onClick={() => onOpen("deleteServer", {server})}
                        >
                            <Trash2 className="h-4 w-4 mr-9"/>
                            Delete Team
                            
                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem
                        className="px-3 py-2 text-sm cursor-pointer text-rose-500"
                        onClick={() => onOpen("leaveServer", {server})}
                        >
                            <LogOut className="h-4 w-4 mr-9"/>
                            Leave Collab
                            
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
