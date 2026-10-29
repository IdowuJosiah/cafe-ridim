import type { Track } from "../lib/spotify";
import "./release.scss"

export default function Release({ releases }: { releases: Track[] }) {
    if (releases.length === 0) return <p>Releases are unavailable right now.</p>;

    return (
        <section className="releases">
            <div className="releases__grid">
                {releases.map((track, i) => (
                    <a key={i} href={track.spotify} target="_blank" rel="noreferrer" className="releases__card">
                        <img src={track.cover} alt={track.title} className="releases__cover" decoding="async" />
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
