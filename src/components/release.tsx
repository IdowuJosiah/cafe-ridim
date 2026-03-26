"use client"
import { useState, useEffect } from "react";
import { Track, getSpotifyToken, getTrack } from "../lib/spotify";
import "./release.scss"
const TRACK_IDS = [
    "6UhI1tdJO089lpNTIiF31d",
    "4qmUlH3j4yGfS73t18vug9",
    "1UUBVecT2fh0Mn0XPGoWtm",
    // "3JN8aItsGqTWapuekI8vxM",
];

export default function Release() {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState<Track[]>([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const token = await getSpotifyToken();
                const tracks = await Promise.all(
                    TRACK_IDS.map(id => getTrack(id, token))
                );
                setReleases(tracks);
            } catch (err) {
                console.error("Failed to fetch tracks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <section className="releases">
            <div className="releases__grid">
                {releases.map((track, i) => (
                    <a key={i} href={track.spotify} target="_blank" rel="noreferrer" className="releases__card">
                        <img src={track.cover} alt={track.title} className="releases__cover" />
                        <div className="releases__info">
                            <p className="releases__song">{track.title}</p>
                            <p className="releases__artist">{track.artist}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}