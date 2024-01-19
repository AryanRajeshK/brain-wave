import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ChallengePageProps {
    params: {
        challengeId: string;
    }
}

const ChallengePage = async ({
    params
}: ChallengePageProps) => {

    const profile = await currentProfile();
    if (!profile){
        return redirectToSignIn()
    }

    const challenge = await db.challenge.findUnique({
        where: {
            id: params.challengeId
        }
    });

    if (!challenge) {
        redirect("/challenges")
    }

    const server = await db.server.findUnique({
        where: {
            id: challenge.serverId
        }
    });

    const alreadyJoined = await db.server.findUnique({
        where: {
            id: challenge.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    let link  = '#';
    if(alreadyJoined) {
        link = `/servers/${server?.id}`;
    } else if(server?.inviteCode) {
        link = `/invite/${server?.inviteCode}`;
    }

    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-[135px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[135px] h-full">

            <div className="flex items-center justify-between mt-5">
                        <div className="text-4xl ml-9 mb-4">
                Welcome to challenge <strong>{challenge.name}</strong>!
                        </div>
                </div>
                <Separator className="h-[2px] bg-[#c073bc] rounded-md w-21 mx-auto mb-10" />
                <div className="text-1xl ml-9 mb-3">
                        <strong>Objective:</strong><br/> {challenge.objective}
                </div>
                <div className="text-1xl ml-9 mb-3">
                        <strong>Duration:</strong><br/> {challenge.duration}
                </div>
                <div className="text-1xl ml-9 mb-3">
                        <strong>Prize:</strong><br/> {challenge.prize}
                </div>
                <div className="text-1xl ml-9 mb-3">
                        <strong>Terms & Conditions:</strong><br/> {challenge.terms}
                </div>
                
                <a href={link} className="group relative flex flex-col items-right gap-y-3 w-[220px] ml-9 mt-10">
                    <div className="flex h-[70px] w-[200px] rounded-[18px]  transition-all overflow-hidden items-center justify-center bg-[#a733b9] group-hover:bg-[#b539cb]">
                        <div className="text-white">{alreadyJoined ? "Go to challenge": "Join this challenge"}</div>
                    </div>
                </a>
            </main>
        </div>
     );
}
 
export default ChallengePage;