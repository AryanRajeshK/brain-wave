
import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
// import Editor from "@/components/editor/editor";
// import { Editor } from '@tinymce/tinymce-react';
import Calender from "@/components/calender/calender";
import { UserButton } from "@clerk/nextjs";


const TextEditor = async () => {
    const server = await db.server.findFirst({

    });

    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    if (currprofile.isBanned) {
        return redirect("/banned"); // replace "/banned" with the path to your banned page
    }
    const servers = await db.server.findMany({
    });
    return (
        <>
            <div className="h-full">
                <div className="print-container">
                    <div className="hidden md:flex h-full w-[155px] z-30 flex-col fixed inset-y-0">
                        <NavigationSidebar />
                    </div>
                </div>
                <main className="md:pl-[180px] pr-[20px] h-full">
                    <div className="print-container">
                        <HomeMobileToggle />
                        <div className="flex items-center justify-between mt-5">
                            <div className="text-4xl ml-9">
                                <strong>Calendar</strong>
                                
                            </div>
                            <div id="profile">
                            <UserButton
                                afterSignOutUrl="/sign-in"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-[60px] w-[60px] border-4 border-purple-700 rounded-full",
                                    },
                                }}
                            />
                        </div> 
                        </div>
                        <Separator className="h-[3px] dark:bg-[rgb(92,41,96)] bg-[rgb(56,37,91)] w-full mt-4 mb-6" />
                    </div>

                    <Calender/>
                    

                </main>
            </div>

        </>


    );
}

export default TextEditor;
