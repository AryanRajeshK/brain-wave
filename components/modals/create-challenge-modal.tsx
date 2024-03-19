"use client"

import { useModal } from "@/hooks/use-modal-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { TextArea } from "../ui/textarea";
import { FileUpload } from "../file-upload";
import { toast} from "sonner"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Challenge name is required"
    }),
    prize: z.string().min(1, {
        message: "Challenge prize is required"
    }),
    imageUrl: z.string().min(1, {
        message: "Challenge image is required"
    }),
    objective: z.string().min(1, {
        message: "Challenge objective is required"
    }),
    duration: z.string().min(1, {
        message: "Challenge duration is required"
    }),
    terms: z.string().min(1, {
        message: "Challenge T&Cs are required"
    }).max(350, {
        message: "Challenge T&Cs max length is 350"
    }),

})

export const CreateChallengeModal = () => {

    const { isOpen, onClose, type } = useModal();

    const isModalOpen = isOpen && type === "createChallenge";

    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            prize: "",
            imageUrl: "",
            objective:"",
            duration: "",
            terms:"",
        }
    });
    

    const isLoading = form.formState.isSubmitting;

    // const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //     try {
    //         await axios.post("/api/challenges", values);
    //         form.reset();
    //         router.refresh();
    //         onClose();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const onSubmit = async (values: z.infer<typeof formSchema>)  => {
        try {
            // First, create the server entry and get the server id
            const serverResponse = await axios.post("/api/servers", {
                name: values.name,
                imageUrl: values.imageUrl // Make sure this is the uploaded image URL
            });
            
            const serverId = serverResponse.data.id; // Assuming the server's ID is returned in the response
    
            // Now, create the challenge entry with the serverId
            await axios.post("/api/challenges", {
                ...values,
                serverId: serverId // Use the obtained serverId here
            });
    
            form.reset();
            router.refresh();
            onClose();
            toast.success("Success!")
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
                <DialogHeader className="pt-8 px-6 ">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create a Challenge!
                    </DialogTitle>
                    <DialogDescription className="text-center text-white ">
                        Fill in the neccesary details and image
                    </DialogDescription>
                </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="flex flex-col gap-8 px-6">
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
                                <div className="flex gap-8">
                                <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Challenge name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Enter name"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="prize"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Challenge prize
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Enter prize"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                </div>
                                <div className="flex gap-8">
                                <FormField
                                control={form.control}
                                name="objective"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Challenge objective
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Describe the objective"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Challenge duration
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Enter the duration"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                                </div>
                                <FormField
                                control={form.control}
                                name="terms"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="uppercase text-xs font-bold text-white dark:text-white ">
                                            Challenge Terms & Conditions
                                        </FormLabel>
                                        <FormControl>
                                            <TextArea
                                            rows={1}
                                            disabled={isLoading}
                                            className="bg-white border-0 focus-visible:ring-0 text-zinc-500 focus-visible:ring-offset-0"
                                            placeholder="Describe the Terms & Conditions"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                                />
                            <div className="flex justify-end">
                            <DialogFooter className="bg-grey-100 px-6 py-4 mt-2">
                                <Button disabled={isLoading}  variant="brain" className="bg-purple-600 dark:bg-purple-900">
                                    Create
                                </Button>
                            </DialogFooter>
                            </div>
                        </div> 
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
