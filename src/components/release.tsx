"use client"
import { useState, useEffect } from "react";
import type { Track } from "../lib/spotify";
import "./release.scss"

export default function Release() {
    const [loading, setLoading] = useState(true);
    const [releases, setReleases] = useState<Track[]>([]);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const res = await fetch("/api/releases");
                if (!res.ok) throw new Error(`Status ${res.status}`);
                setReleases(await res.json());
            } catch (err) {
                console.error("Failed to fetch tracks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (releases.length === 0) return <p>Releases are unavailable right now.</p>;

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