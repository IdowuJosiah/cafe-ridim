import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import { getSpotifyToken, getTrack, Track } from "./spotify";

export interface Playlist {
    id: string;
    title: string;
}

export interface SpotifyLinks {
    releases: string[]; // Spotify track IDs, in display order
    playlists: Playlist[];
}

export const LINKS_CACHE_TAG = "spotify-links";
const REDIS_KEY = "spotify-links";

// Shown until the admin page saves something for the first time
const DEFAULT_LINKS: SpotifyLinks = {
    releases: [
        "6UhI1tdJO089lpNTIiF31d",
        "4qmUlH3j4yGfS73t18vug9",
        "1UUBVecT2fh0Mn0XPGoWtm",
        "7kXsXClRjn2rFhbDqdYy2P",
        "304DMW8WccDX2tzhkWQcsI",
    ],
    playlists: [
        { id: "37i9dQZF1E4vPyrvVnZeyH", title: "Guilty Pleasures" },
        { id: "016aj4GM4dkUFS68JmsG0Z", title: "Playlist 2" },
        { id: "6IKGONJaYnsQSLmlSkSyTc", title: "Playlist 3" },
    ],
};

export const isStorageConfigured = () =>
    Boolean(
        (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
        (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
    );

const getRedis = () => {
    if (!isStorageConfigured()) {
        throw new Error("Storage is not configured. Add an Upstash Redis database to the Vercel project.");
    }
    return Redis.fromEnv();
};

// Uncached read, used by the admin page so it always shows the latest saved state
export const readLinks = async (): Promise<SpotifyLinks> => {
    if (!isStorageConfigured()) return DEFAULT_LINKS;
    const stored = await getRedis().get<SpotifyLinks>(REDIS_KEY);
    return stored ?? DEFAULT_LINKS;
};

export const writeLinks = async (links: SpotifyLinks) => {
    await getRedis().set(REDIS_KEY, links);
};

// Cached reads for the public site; the admin actions clear these with updateTag
export const getLinks = unstable_cache(readLinks, ["spotify-links"], {
    tags: [LINKS_CACHE_TAG],
});

export const getReleaseTracks = unstable_cache(
    async (): Promise<Track[]> => {
        const { releases } = await readLinks();
        const token = await getSpotifyToken();
        const results = await Promise.allSettled(releases.map(id => getTrack(id, token)));
        return results.flatMap(r => {
            if (r.status === "fulfilled") return [r.value];
            console.error("Failed to fetch track:", r.reason);
            return [];
        });
    },
    ["release-tracks"],
    { tags: [LINKS_CACHE_TAG], revalidate: 3600 }
);

// Accepts a share link (https://open.spotify.com/track/...), a spotify: URI or a bare ID
export const parseSpotifyId = (input: string, type: "track" | "playlist"): string | null => {
    const value = input.trim();
    if (/^[A-Za-z0-9]{22}$/.test(value)) return value;

    const urlMatch = value.match(
        /open\.spotify\.com\/(?:intl-[a-z-]+\/)?(?:embed\/)?(track|playlist|album)\/([A-Za-z0-9]{22})/i
    );
    const uriMatch = value.match(/^spotify:(track|playlist|album):([A-Za-z0-9]{22})$/i);
    const match = urlMatch ?? uriMatch;
    if (!match || match[1].toLowerCase() !== type) return null;
    return match[2];
};
