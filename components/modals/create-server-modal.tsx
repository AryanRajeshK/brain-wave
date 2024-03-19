"use client"

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import * as z from "zod";
import { FileUpload } from "../file-upload";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
//import { Toaster } from "../ui/sonner";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Team name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Team image is required"
    })

})

export const CreateServerModal = () => {

    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "createServer";

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
        toast.success("Team Created!");
    }

    return (
        <Dialog open = {isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[rgb(92,41,96)] dark:bg-[#301934] text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create a Team!
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Give your team a name and image
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-8 px-6">
                                <div className="flex items-center justify-center text-center">
                                    <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                endpoint="serverImage"
                                                value={field.value}
                                                onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Team name (max 28 characters)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Enter name"
                                            {...field}
                                            maxLength={28}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />

                            </div>
                            <DialogFooter className="bg-grey-100 px-6 py-4">
                                <Toaster richColors position="top-right"/>
                                <Button disabled={isLoading} onClick={() => toast.success("Success!")} variant="brain" className="bg-purple-600 dark:bg-purple-900">
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
    )
}
