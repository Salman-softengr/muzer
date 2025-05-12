import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "@/app/lib/db";

const YT_REGEX = new RegExp("^https?:\/\/(www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$");

const CreateStreamSchema = z.object({
    createrId: z.string(),
    url: z.string()
})

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if(!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {
                status: 411
            });
        }

        const extractedId = data.url.split("?v=")[1];

        await prismaClient.stream.create({
            data: {
                userId: data.createrId,
                url: data.url,
                extractedId,
                type: "Youtube"
            }
        })
    } catch (e) {
        return NextResponse.json({
            message: "Error while adding a stream",
        }, {
            status: 411
        });
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}