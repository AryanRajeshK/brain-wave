import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import Canvas from "@/components/canvascomp/canvas";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

const Whiteboard = async ({
    children
}: {children: React.ReactNode}) => {
    const server = await db.server.findFirst({

    });
    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    const servers = await db.server.findMany({
    });
    return ( 
      <>
        <div className="h-full">
            <div className="hidden md:flex h-full w-[120px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div> 
            <main className="md:pl-[120px] pr-[20px] h-full">
            <div className="flex items-center justify-between mt-5">
                <div className="text-4xl ml-9">
                    Welcome <strong>{currprofile.name.split(' ')[0]}</strong>!
                </div>
            </div>
            <div className="text-1xl ml-9">
            {currprofile.name.split(' ')[0]}'s Whiteboard
            </div>
            <Separator className="h-[3px] bg-[#a733b9] w-full mt-2" />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80 vh' }}>
                <Canvas/>
            </div>
            </main>          
        </div>
          
      </>
     );
}
 
export default Whiteboard;