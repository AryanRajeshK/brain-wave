import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
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
            <div className="hidden md:flex h-full w-[110px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[120px] pr-[20px] h-full">
            <HomeMobileToggle/>
                <div className="flex items-center justify-between mt-5">
                    <div className="text-4xl ml-8 mb-6 ">
                        Welcome <strong>{currprofile.name.split(' ')[0]}</strong>!
                    </div>
                </div>
                <Separator className="h-[3px] bg-[#a733b9] w-full mt-2" />
                <h1 className="text-4xl font-bold text-center py-4">Virtual Exhibits</h1>
            </main>
        </div>
     );
}
 
export default VirtualExhibits;