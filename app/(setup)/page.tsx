// This is root file

import { InitialModal } from "@/components/modals/initial-modal";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initailProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { AlignVerticalJustifyCenter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MobileToggle } from "@/components/mobile-toggle";
import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { UserButton } from "@clerk/nextjs";

const SetupPage = async () => {
    // Loads the profile of the user
    const profile = await initailProfile();

    // Looking for collabs the user is in
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });
    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // if server/s exist, return home page
    if (server) {
        // return redirect(`/servers/${server.id}`);
        return (
            <div className="h-full">
                <div className="hidden md:flex h-full w-[110px] z-30 flex-col fixed inset-y-0">
                    <NavigationSidebar />
                </div>
                <main className="md:pl-[120px] pr-[20px] h-full">
                    <HomeMobileToggle/>
                    
                    <div className="flex items-center justify-between md:mt-5">
                        
                    <div className="text-4xl ml-8">
                        Welcome <strong>{currprofile.name ? currprofile.name.split(' ')[0] : 'User'}</strong>!
                    </div>
                        <div className="flex items-center">   
                            <NavigationAction/>
                            <div className="mr-2">
                                <div className="md:hidden">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                            avatarBox: "h-[40px] w-[40px]",
                                            },
                                        }}
                                    />
                                </div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="text-1xl ml-9">
                        My Teams
                    </div>
                    <Separator className="h-[3px] bg-[#a733b9] w-full mt-3.5" />
                    <div className="text-zinc-500 mt-3 ml-9">
                        {servers?.length} Team/s
                    </div>
                   <div className="flex items-center flex-wrap gap-10 mt-5 ml-10">
                        {servers.map((server) => (
                            <div key={server.id} className="mb-4">
                                <NavigationItem
                                    id={server.id}
                                    name={server.name}
                                    imageUrl={server.imageUrl}
                                />
                            </div>
                        ))}
                         
                    </div>
                    
                </main>
            </div>
        )
    }

    // else prompt to make a server
    return (
        <InitialModal />
    );
}

export default SetupPage;