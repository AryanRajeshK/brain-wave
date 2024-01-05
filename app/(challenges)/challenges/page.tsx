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
            <div className="hidden md:flex h-full w-[135px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[135px] h-full">
                <div className="flex items-center justify-between mt-5">
                        <div className="text-4xl ml-9">
                        Welcome <strong>{currprofile.name.split(' ')[0]}</strong>!
                        </div>
                </div>
                <div className="text-1xl ml-9 mb-4">
                        Challenges
                </div> 
                <Separator className="h-[2px] bg-[#c073bc] rounded-md w-21 mx-auto mb-4" />
                <div className="flex justify-between">
                    <div className="text-4xl ml-20 ">Challenges</div>
                    <div className="text-4xl mr-20">Prize</div>
                </div>
                <div className="flex items-center flex-wrap gap-10 p-20">
                {challenges.map((challenge) => (
                            <div key={challenge.id} className="mb-2">
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
