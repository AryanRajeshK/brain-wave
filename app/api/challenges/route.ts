import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Posting to prisma
export async function POST(req: Request) {
    try {
        const { name, prize, objective, description,duration, terms, serverId, imageUrl } = await req.json();
        const { searchParams } = new URL(req.url);
        const profile = await currentProfile();


        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        }
        const challenge = await db.challenge.create({
            data: {
                name,
                prize,
                objective,
                imgUrl: imageUrl,
                duration,
                description,
                terms,
                serverId,
                startDate: new Date(),
                endDate: new Date()

            }
        }
        );

        return NextResponse.json(challenge);

    } catch (error) {
        console.log("[CHALLENGES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


