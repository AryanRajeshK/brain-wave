import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationAction } from "@/components/navigation/navigation-action2";
import { NavigationItem } from "@/components/navigation/navigation-item2";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSearch } from "@/components/server/server-main_search";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";


const Challenges = async ({
    children
}: { children: React.ReactNode }) => {
    const server = await db.server.findMany({
        select: { id: true }
    });
    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    const challenges = await db.challenge.findMany({
    });

    const prof = await db.server.findMany({});

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-[155px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="pl-[10px] pr-[10px] h-full md:pl-[170px] pr-[40px] h-full">
                <HomeMobileToggle />
                <div className="flex flex-row items-center justify-between mt-5">
  <div className="text-4xl ml-9 mb-5">
    <strong>CHALLENGES</strong>
  </div>

  <ServerSearch 
    data={[
      {
        label: "Challenges", 
        type: "challenge", 
        data: challenges.map(challenge => ({ 
          id: challenge.id,
          name: challenge.name,                            
        }))
      }
    ]}
  />
</div>

                <Separator className="h-[3px] dark:bg-[rgb(92,41,96)] bg-[rgb(56,37,91)] w-full mt-2" />
                {/* <div className="flex justify-between">
                    <div className="text-4xl font-bold text-center py-4 ml-9 ">Name</div>
                    <div className="text-4xl font-bold text-center py-4 ml-[270px]">Prize</div>
                    <div className="text-4xl font-bold text-center py-4  mr-12">Duration</div>
                </div> */}
                <div className="flex items-center flex-wrap gap-3 p-9"> 
                    {challenges.filter(challenge => server.some(server => server.id === challenge.serverId))
                        .map((challenge) => (
                            <div key={challenge.id} className="mb-1 w-full">
                                <NavigationItem
                                    id={challenge.id}
                                    name={challenge.name}
                                    prize={challenge.prize}
                                    duration={challenge.duration}
                                    by = {challenge.objective}
                                    img= {challenge.id}
                                />
                            </div>
                        ))}
                </div>
                <div className="flex items-center">
                    <NavigationAction />
                </div>
            </main>
        </div>
    );
}

export default Challenges;
