import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action2";
import { NavigationItem } from "@/components/navigation/navigation-item2";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const Challenges = async ({
    children
}: {children: React.ReactNode}) => {
    const challenge = await db.challenge.findFirst({

    });
    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    const challenges = await db.challenge.findMany({
    });
    
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-[110px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[120px] pr-[20px] h-full">
                <HomeMobileToggle/>
                <div className="flex items-center justify-between mt-5">
                        <div className="text-4xl ml-9 mb-7">
                        Welcome <strong>{currprofile.name.split(' ')[0]}</strong>!
                        </div>
                </div>
                <Separator className="h-[3px] bg-[#a733b9] w-full mt-2" />
                <div className="flex justify-between">
                    <div className="text-4xl font-bold text-center py-4 ml-9 ">Challenges</div>
                    <div className="text-4xl font-bold text-center py-4 mr-12">Prize</div>
                </div>
                <div className="flex items-center flex-wrap gap-3 p-9">
                {challenges.map((challenge) => (
                            <div key={challenge.id} className="mb-2 w-full">
                                <NavigationItem
                                    id={challenge.id}
                                    name={challenge.name}
                                    prize={challenge.prize}                                                                        
                                />
                            </div>
                        ))}
                </div>
                <div className="text-1xl ml-9 mb-1">
                        More coming soon
                </div> 
                <div className="flex items-center">
                            <NavigationAction />
                </div>               
            </main>
        </div>
     );
}
 
export default Challenges;
