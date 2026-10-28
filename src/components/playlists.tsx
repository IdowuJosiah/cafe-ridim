"use client"
import { useState, useEffect } from "react";
import type { Playlist } from "../lib/links";
import "./playlist.css";

export default function Playlists() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        fetch("/api/playlists")
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
            })
            .then(setPlaylists)
            .catch(err => console.error("Failed to fetch playlists:", err));
    }, []);

    if (playlists.length === 0) return null;

    return (
        <section className="playlists">
            <h2 className="playlists__title">OUR PLAYLISTS</h2>
            <div className="playlists__grid">
                {playlists.map((playlist) => (
                    <iframe
                        key={playlist.id}
                        className="playlists__embed"
                        title={playlist.title}
                        src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
                        loading="lazy"
                    />
                ))}
            </div>
        </section>
    );
}
