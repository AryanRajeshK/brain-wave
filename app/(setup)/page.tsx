// This is root file

import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { initailProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";

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
    // if (server) {
    // return redirect(`/servers/${server.id}`);
    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[120px] z-30 flex-col fixed inset-y-0 ">
                <NavigationSidebar />
            </div>
            <main className="pl-[10px] pr-[10px] h-full md:pl-[170px] pr-[40px] h-full">
                <HomeMobileToggle />

                <div className="flex justify-between items-center mt-7">
                    <div className="text-left">
                        <div className="text-4xl ml-4">
                            Welcome <strong>{currprofile.name !== "null" ? currprofile.name.split(' ')[0].toUpperCase() : 'User'}</strong>!
                        </div>
                        <div className="text-1xl ml-5">
                            My Teams
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Bell className="mr-4 mt-4 w-6 h-6" />
                        <UserButton
                            afterSignOutUrl="/sign-in"
                            appearance={{
                                elements: {
                                    avatarBox: "h-[50px] w-[50px]",
                                },
                            }}
                        />
                    </div>
                </div>

                <Separator className="h-[3px] dark:bg-[rgb(92,41,96)] bg-[rgb(56,37,91)] w-full mt-5" />
                <div className="text-zinc-500 mt-3 ml-5">
                    {servers?.length} {servers?.length === 1 ? 'Team' : 'Teams'}
                </div>

                <div className="flex items-center flex-wrap gap-20 mt-8 ml-10">
                    {servers.map((server) => (
                        <div key={server.id} >
                            <NavigationItem
                                id={server.id}
                                name={server.name}
                                imageUrl={server.imageUrl}
                            />
                        </div>
                    ))}
                    <NavigationAction />
                </div>
            </main>
        </div>
    )
}

// // else prompt to make a server
// return (
//     <InitialModal />
// );
// }

export default SetupPage;