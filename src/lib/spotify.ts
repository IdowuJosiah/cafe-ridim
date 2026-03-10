
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

export interface Track {
    title: string;
    artist: string;
    cover: string;
    spotify: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export const getSpotifyToken = async (): Promise<string> => {
    // Return cached token if still valid
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encoded = Buffer.from(credentials).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${encoded}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await res.json();

    // Cache the token — expire 1 minute early to avoid edge cases
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

    return cachedToken as string;
};
export interface Artist {
    name: string;
    image: string;
    spotify: string;
}

export const getArtist = async (artistId: string, token: string): Promise<Artist> => {
    const res = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Artist response:", data); // add this to debug
    return {
        name: data.name,
        image: data.images?.[0]?.url || "/artist.png", // fallback to local image
        spotify: data.external_urls?.spotify || "#",
    };
};
export const getTrack = async (trackId: string, token: string): Promise<Track> => {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    const data = await res.json();
    return {
        title: data.name,
        artist: data.artists.map((a: { name: string }) => a.name).join(", "),
        cover: data.album.images[0].url,
        spotify: data.external_urls.spotify,
    };
};