"use client"

import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { db } from "@/lib/db";
import { toast} from "sonner"



export const DeletePostModal = () => {

    const router = useRouter();

    const onClick = async () => {
        try{
            setIsLoading(true)
            await axios.delete(`/api/posts/${post}`);
            onClose();
            toast.success('Post Deleted');
            router.refresh();
            router.push("/virtualexhibits");
            router.refresh();
        } catch(error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    const { onOpen, isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deletePost";

    const {post} = data;

    const [isLoading, setIsLoading] = useState(false);


    return (
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[rgb(92,41,96)] dark:bg-[#301934] text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Post
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Are you sure you want to delete the Post ?
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
