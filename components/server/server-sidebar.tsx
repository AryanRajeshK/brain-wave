import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { ServerSection } from "./server-section";
interface ServerSidebarProps {
    serverId: string
}

export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-white w-full " style={{backgroundColor:"#420266"}} >
            {/* bg-gradient-to-t from-[rgb(53,37,91)] to-[rgb(93,42,96)] */}
            <ScrollArea className="flex-1 px-3">
                <div className="mt-4 mb-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={server.imageUrl} style={{ width: '200px', height: '200px'}} />
                    <div style={{ fontSize: 20, marginTop: '1rem' }}>
                        {server.name}
                    </div>
                </div>

                {!!textChannels?.length &&
                    <div className="mt-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Collab Space"
                        />
                        {textChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                }
                {!!audioChannels?.length &&
                    <div className="mt-2 mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Voice Channels"
                        />
                        {audioChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                }
                {!!videoChannels?.length &&
                    <div className="mt-2 mb-2">
                        <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Video Channels"
                        />
                        {videoChannels.map((channel) => (
                            <ServerChannel
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                            />
                        ))}
                    </div>
                }
                {!!members?.length &&
                    <div className="mt-2 mb-2">
                        <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                        />
                        {members.map((member) => (
                            <ServerMember
                                key={member.id}
                                member={member}
                                server={server}
                            />
                        ))}
                    </div>
                }
            </ScrollArea>
        </div>
    )
}