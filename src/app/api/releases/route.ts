import { NextResponse } from "next/server";
import { getSpotifyToken, getTrack } from "../../../lib/spotify";

const TRACK_IDS = [
    "6UhI1tdJO089lpNTIiF31d",
    "4qmUlH3j4yGfS73t18vug9",
    "1UUBVecT2fh0Mn0XPGoWtm",
    "7kXsXClRjn2rFhbDqdYy2P",
    "304DMW8WccDX2tzhkWQcsI",
    // "3JN8aItsGqTWapuekI8vxM",
];

export async function GET() {
    try {
        const token = await getSpotifyToken();
        const results = await Promise.allSettled(
            TRACK_IDS.map(id => getTrack(id, token))
        );
        const tracks = results.flatMap(r => {
            if (r.status === "fulfilled") return [r.value];
            console.error("Failed to fetch track:", r.reason);
            return [];
        });
        // Let the CDN cache this for an hour so we don't hit Spotify on every page view
        return NextResponse.json(tracks, {
            headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
        });
    } catch (error) {
        console.error("Failed to fetch releases:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
