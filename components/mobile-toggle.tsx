import { MenuIcon } from "lucide-react"
import { NavigationSidebar } from "./navigation/navigation-sidebar"
import { ServerSidebar } from "./server/server-sidebar"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

export const MobileToggle = ({
    serverId
}: {serverId: string}) => {
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-3">
                <div className="w-[250px]">
                    <NavigationSidebar/>
                </div>
                <div className="md:m1-[60px] mt-[80px]">
                    <ServerSidebar
                    serverId={serverId}
                />
                </div>
            </SheetContent>
        </Sheet>
    )
}