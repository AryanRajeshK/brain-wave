"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { BadgeCheck, Check, Crown, GavelIcon, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <BadgeCheck className="h-4 w-4 ml-2 text-green-500"/>,
    "ADMIN": <Crown className="h-4 w-4 text-yellow-500"/>

}

export const MembersModal = () => {

    const router = useRouter();

    const { onOpen, isOpen, onClose, type, data } = useModal();

    const [loadingId, setLoadingId] = useState("");

    const isModalOpen = isOpen && type === "members";

    const {server} = data as {server: ServerWithMembersWithProfiles};

    const onKick = async (memberId: string) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });
            const response = await axios.delete(url);
            router.refresh();
            onOpen("members", {server: response.data})
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("")
        }
    }

    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });
            const response = await axios.patch(url, {role});
            router.refresh();
            onOpen("members", {server: response.data});
        } catch (error){
            console.log(error);
        } finally {
            setLoadingId("");
        }
    }

    return (
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[rgb(92,41,96)] dark:bg-[#301934] text-white overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                className="text-center text-white"
                >
                    
                    {server?.members?.length} Members 
                </DialogDescription>
                </DialogHeader>
            <ScrollArea className="mt-8 max-h-[420px] pr-6">
                {server?.members?.map((member) => (
                    <div key={member.id} className="flex items-center gap-x-2 mb-6">
                        <UserAvatar src={member.profile.imageUrl}/>
                        <div className="flex flex-col gap-y-1">
                            <div className="text-xs font-semibold flex items-center gap-x-1">
                                {member.profile.name}
                                {roleIconMap[member.role]}
                            </div>
                            <p className="text-xs">
                                {member.profile.email}
                            </p>
                        </div>
                        {server.profileId !== member.profileId && loadingId !== member.id && (
                            <div className="ml-auto">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical className="h-4 w-4"/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left">
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="flex items-center">
                                                <ShieldQuestion className="w-4 h-4 mr-2"/>
                                                <span>
                                                    Role
                                                </span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                                        <Crown className="h-4 w-4 mr-2"/>
                                                        Guest
                                                        {member.role === "GUEST" && (
                                                            <Check className="h-4 w-4 ml-auto"/>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                                        <BadgeCheck className="h-4 w-4 mr-2"/>
                                                        Team Leader
                                                        {member.role === "MODERATOR" && (
                                                            <Check className="h-4 w-4 ml-auto"/>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator/>
                                        <DropdownMenuItem onClick={() => onKick(member.id)} className="text-rose-500">
                                            <GavelIcon className="h-4 w-4 mr-2"/>
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                        )}
                        {loadingId === member.id && (
                            <Loader2 className="animate-spin ml-auto w-4 h-4"/>
                        )}
                    </div>
                ))}
            </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
