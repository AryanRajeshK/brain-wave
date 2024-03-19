"use client"

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileUpload } from "../file-upload";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "sonner"

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Description is required"
    })

})

export const CreateExhibitModal = () => {

    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "postExhibit";

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/posts", values);

            form.reset();
            router.push("/virtualexhibits");
            router.refresh();
            onClose();
            toast.success('Success!');
        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open = {isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[rgb(92,41,96)] dark:bg-[#301934] text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Showcase Your Work!!!
                    </DialogTitle>
                    <DialogDescription className="text-center text-white">
                        Fill in the required details
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
                                                endpoint="postImage"
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Description (max 25 characters)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Describe your work!!"
                                            autoComplete="off"
                                            maxLength={25}
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />

                            </div>
                            <DialogFooter className="bg-grey-100 px-6 py-4">
                                <Button disabled={isLoading} variant="brain" className="bg-purple-600 dark:bg-purple-900">
                                    Create
                                </Button>

                            </DialogFooter>
                        </form>
                    </Form>
            </DialogContent>
        </Dialog>
    )
}
