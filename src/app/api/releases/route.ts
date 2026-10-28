import { NextResponse } from "next/server";
import { getReleaseTracks } from "../../../lib/links";

export async function GET() {
    try {
        // Cached server-side; the admin page clears the cache when releases change
        return NextResponse.json(await getReleaseTracks());
    } catch (error) {
        console.error("Failed to fetch releases:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
