import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const VirtualExhibits = async ({
    children
}: {children: React.ReactNode}) => {
    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-[135px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[135px] h-full">
                <div className="flex items-center justify-between mt-5">
                    <div className="text-4xl ml-8 mb-6 ">
                        Welcome <strong>{currprofile.name.split(' ')[0]}</strong>!
                    </div>
                </div>
                <Separator className="h-[2px] bg-[#c073bc] rounded-md w-21 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-center py-4">Virtual Exhibits</h1>
            </main>
        </div>
     );
}
 
export default VirtualExhibits;
