import { NextResponse } from "next/server";
import { getLinks } from "../../../lib/links";

export async function GET() {
    try {
        const { playlists } = await getLinks();
        return NextResponse.json(playlists);
    } catch (error) {
        console.error("Failed to fetch playlists:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
