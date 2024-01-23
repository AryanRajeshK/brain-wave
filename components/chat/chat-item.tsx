"use client"

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { Delete, Edit, FileIcon, ShieldAlert, ShieldCheck, Trash, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { 
    Form,
    FormControl,
    FormField,
    FormItem
} from "../ui/form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean
    socketUrl: string;
    socketQuery: Record<string, string>;
};

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-green-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
};

const formSchema = z.object({
    content: z.string().min(1)
});

export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery
}: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isMod = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isMod || isOwner);
    const canEdit = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl;
    const {onOpen} = useModal();
    const isLink = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(content);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content
        }
    });

    useEffect(() => {
        form.reset({
            content: content
        })
    }, [content]);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery
            });
            await axios.patch(url, values);
            form.reset();
            setIsEditing(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="relative group flex items-center p-5 transition w-full">
            <div className={`group flex gap-x-3 items-start w-full ${isOwner ? "flex-row-reverse" : ""}`}>
                <div>
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>
                <div className={`flex flex-col ${isOwner ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-x-2 ${isOwner ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center ${isOwner ? "flex-row-reverse" : ""}`}>
                           
                            {!isOwner && (
                                <p className="text-sm">
                                {member.profile.name}
                            </p>
                            )}
                            {isOwner && (
                                <p className="text-sm">
                                You
                            </p>
                            )}
                            <p className={`${isOwner ? "mr-1" : ""}`}>
                                {roleIconMap[member.role]}
                            </p>
                        </div>
                        <span className="text-xs text-gray-600">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a 
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`relative aspect-square rounded-md mt-2 overflow-hidden border flex ${isOwner ? "flex-row-reverse" : ""} items-center bg-secondary h-48 w-48 `}
                        >
                            <Image
                                src={fileUrl}
                                alt={content}
                                fill
                                className="object-cover"

                            />
                        </a>
                    )}
                    {isPDF && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                        <FileIcon className="h-10 w-10"/>
                        <a 
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`ml-2 text-sm text-black dark:text-white hover:underlin`}
                        > 
                            PDF File
                        </a>
                    </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <div className={`flex ${isOwner ? "flex-row-reverse" : ""}`}>
                            {isLink ? (
                                <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                    {content}
                                </a>
                            ) : (
                                content
                            )}
                            {isUpdated && !deleted && (
                                <span className="text-xs text-gray-600 ml-2 mr-2 mt-2">
                                    edited
                                </span>
                            )}
                        </div>
                        
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className="flex items-center w-full gap-x-2 pt-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2"
                                                        placeholder="Edited message"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} className="md:hidden" size="sm" variant="brain">
                                    Edit
                                </Button>
                                <button disabled={isLoading} onClick={() => {setIsEditing(false)}}>
                                    <X className="text-rose-500 hover:bg-rose-200 rounded-md ml-1"/>
                                </button>
                            </form>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className={`hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 ${isOwner ? "right-5" : "left-5"} border rounded-sm  ${!isOwner ? "flex-row-reverse" : ""}`}>
                    {canEdit && (
                        <Edit onClick={() => setIsEditing(true)} className="cursor-pointer w-4 h-4" />
                    )}
                    {canDeleteMessage && (
                        <Trash onClick={() => onOpen("deleteMessage", {
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery
                        })} className="cursor-pointer w-4 h-4" />
                    )}
                </div>
            )}

        </div>
    )
}