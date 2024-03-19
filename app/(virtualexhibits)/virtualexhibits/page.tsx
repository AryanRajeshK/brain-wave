import { HomeMobileToggle } from "@/components/home-mobile-toggle";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { PostButton } from "@/components/navigation/postButton";
import { PostItems } from "@/components/navigation/postItems";
import { db } from "@/lib/db";
import { toast } from 'sonner'

const VirtualExhibits = async ({
    children
}: {children: React.ReactNode}) => {
    const posts = await db.post.findMany({
        include: {
            profile: {
                select: { id:true,name: true ,imageUrl: true, userId:true }
            }
}});

    const currprofile = await currentProfile();
    if (!currprofile) {
        return redirect("/")
    }

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-[155px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="pl-[10px] md:pl-[170px] pr-[40px] h-full">
            <HomeMobileToggle/>
                <div className="flex items-center justify-between mt-5">
                    <div className="text-4xl ml-9 mb-5 ">
                        <strong>VIRTUAL EXHIBITS</strong>
                    </div>
                </div>
                <Separator className="h-[3px] dark:bg-[rgb(92,41,96)] bg-[rgb(56,37,91)] w-full mt-2 mb-6" />
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '25px', marginTop: '8px' }}>
                    {posts.map((post) => (
                        <div 
                            key={post.id} 
                            style={{
                                flex: '1 0 100%',
                                maxWidth: '300px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <PostItems
                                id = {post.id}
                                pfp = {post.profile.imageUrl}
                                name = {post.profile.name}
                                imageURL={post.imageURL}
                                description={post.description}    
                                currUser={currprofile.userId}
                                postUser={post.profile.userId}    
                                post={post.id}        
                                liked={post.liked}                                                   
                            />
                        </div>
                    ))}
                </div>
                
                <div className="flex items-center">
                    <PostButton/>
                </div>  
                
                <div className="pb-[20px]" />
            </main>
        </div>
     );
}
 
export default VirtualExhibits;