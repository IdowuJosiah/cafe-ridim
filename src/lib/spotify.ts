// lib/spotify.ts

const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

export interface Track {
    title: string;
    artist: string;
    cover: string;
    spotify: string;
}

export const getSpotifyToken = async (): Promise<string> => {
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
    console.log("Token response:", data);
    return data.access_token;
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