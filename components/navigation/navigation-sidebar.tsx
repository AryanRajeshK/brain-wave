import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "../ui/separator";
import Challenges from "./challenges";
import HomeButton from "./home";
import VirtualExhibits from "./virtual-exhibits";
import NavSettings from "./settings-navigation";

export const NavigationSidebar = async () => {
    const profile = await currentProfile();
    if (!profile) {
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

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-white w-[110px] bg-gradient-to-t from-purple-500 to-purple-900 py-3 rounded-r-xl ">
            <img src="/brain.jpg" alt="Brain Wave" width="80" height="80" />
            <Separator className="h-[2px] bg-[#c073bc] rounded-md w-20 mx-auto mb-4" />
            <div className="flex flex-col items-center gap-y-4 h-full">
                <HomeButton />
                <VirtualExhibits />
                <Challenges />
                <NavSettings />
                <div className="mt-auto flex items-center flex-col gap-y-3">
                    <ModeToggle />
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "h-[50px] w-[50px]",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}