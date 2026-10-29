import type { Playlist } from "../lib/links";
import "./playlist.css";

export default function Playlists({ playlists }: { playlists: Playlist[] }) {
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
