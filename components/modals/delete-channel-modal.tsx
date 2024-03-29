"use client"

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";



export const DeleteChannelModal = () => {

    const router = useRouter();


    const onClick = async () => {
        try{
            setIsLoading(true)
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
            router.refresh();
        } catch(error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const { onOpen, isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteChannel";

    const {server, channel} = data;

    const [copied, setCopied] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    return (
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[rgb(92,41,96)] dark:bg-[#301934] text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Collab Space
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Are you sure you want to "<span className="text-rose-500 font-bold">DELETE {channel?.name.toUpperCase()}</span>" ?
                        <br/>
                        You cannot undo this action!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-[#310a4477] px-6 py-4">
                    <div className="flex items-center justify-end w-full">
                        <Button 
                        disabled={isLoading}
                        variant="destructive"
                        onClick={onClick}>
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
