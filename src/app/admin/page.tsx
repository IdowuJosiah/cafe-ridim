import type { Metadata } from "next";
import { isAdminConfigured, isLoggedIn } from "../../lib/admin-auth";
import { isStorageConfigured, readLinks } from "../../lib/links";
import { getSpotifyToken, getTrack, Track } from "../../lib/spotify";
import {
    addPlaylist,
    addRelease,
    login,
    logout,
    movePlaylist,
    moveRelease,
    removePlaylist,
    removeRelease,
} from "./actions";
import "./admin.css";

export const metadata: Metadata = {
    title: "Cafe Riddim Admin",
    robots: { index: false, follow: false },
};

const MESSAGES: Record<string, { text: string; error?: boolean }> = {
    "wrong-password": { text: "Wrong password.", error: true },
    "invalid-track": { text: "That doesn't look like a Spotify track link. Use Share → Copy Song Link in Spotify.", error: true },
    "invalid-playlist": { text: "That doesn't look like a Spotify playlist link. Use Share → Copy link to playlist in Spotify.", error: true },
    "missing-title": { text: "Give the playlist a name.", error: true },
    "track-not-found": { text: "Spotify couldn't find that track.", error: true },
    "duplicate": { text: "That's already on the site.", error: true },
    "save-failed": { text: "Couldn't save. Check the storage setup and try again.", error: true },
    "added": { text: "Added. It's live on the site now." },
    "removed": { text: "Removed from the site." },
    "moved": { text: "Order updated." },
};

type PageProps = { searchParams: Promise<{ status?: string }> };

export default async function AdminPage({ searchParams }: PageProps) {
    const { status } = await searchParams;
    const message = status ? MESSAGES[status] : undefined;

    if (!isAdminConfigured()) {
        return (
            <main className="admin">
                <div className="admin__card admin__card--narrow">
                    <h1 className="admin__title">Admin is not set up</h1>
                    <p className="admin__muted">
                        Add an <code>ADMIN_PASSWORD</code> environment variable in Vercel and redeploy.
                    </p>
                </div>
            </main>
        );
    }

    if (!(await isLoggedIn())) {
        return (
            <main className="admin">
                <form action={login} className="admin__card admin__card--narrow">
                    <h1 className="admin__title">Cafe Riddim Admin</h1>
                    {message && <p className={`admin__message ${message.error ? "admin__message--error" : ""}`}>{message.text}</p>}
                    <label className="admin__label" htmlFor="password">Password</label>
                    <input className="admin__input" id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
                    <button className="admin__button" type="submit">Log in</button>
                </form>
            </main>
        );
    }

    const links = await readLinks();
    const tracks = await loadTracks(links.releases);

    return (
        <main className="admin">
            <header className="admin__header">
                <h1 className="admin__title">Cafe Riddim Admin</h1>
                <div className="admin__header-links">
                    <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
                    <form action={logout}>
                        <button className="admin__link-button" type="submit">Log out</button>
                    </form>
                </div>
            </header>

            {!isStorageConfigured() && (
                <p className="admin__message admin__message--error">
                    Storage isn&apos;t connected, so changes can&apos;t be saved yet. Add an Upstash Redis database
                    to this project in Vercel (Storage → Create Database), then redeploy.
                </p>
            )}
            {message && <p className={`admin__message ${message.error ? "admin__message--error" : ""}`}>{message.text}</p>}

            <section className="admin__card">
                <h2 className="admin__section-title">Releases</h2>
                <p className="admin__muted">Paste a Spotify song link. New releases go to the top.</p>
                <form action={addRelease} className="admin__add">
                    <input className="admin__input" name="link" placeholder="https://open.spotify.com/track/..." required />
                    <button className="admin__button" type="submit">Add release</button>
                </form>

                {links.releases.length === 0 && <p className="admin__muted">No releases yet.</p>}
                <ul className="admin__list">
                    {links.releases.map((id, i) => {
                        const track = tracks.get(id);
                        return (
                            <li key={id} className="admin__row">
                                {track ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={track.cover} alt="" className="admin__cover" />
                                ) : (
                                    <div className="admin__cover admin__cover--empty" />
                                )}
                                <div className="admin__row-text">
                                    <a href={`https://open.spotify.com/track/${id}`} target="_blank" rel="noreferrer">
                                        {track?.title ?? id}
                                    </a>
                                    <span className="admin__muted">{track?.artist ?? "Couldn't load details from Spotify"}</span>
                                </div>
                                <RowControls id={id} index={i} count={links.releases.length} move={moveRelease} remove={removeRelease} />
                            </li>
                        );
                    })}
                </ul>
            </section>

            <section className="admin__card">
                <h2 className="admin__section-title">Playlists</h2>
                <p className="admin__muted">Paste a Spotify playlist link and give it a name.</p>
                <form action={addPlaylist} className="admin__add">
                    <input className="admin__input" name="link" placeholder="https://open.spotify.com/playlist/..." required />
                    <input className="admin__input admin__input--short" name="title" placeholder="Playlist name" maxLength={100} required />
                    <button className="admin__button" type="submit">Add playlist</button>
                </form>

                {links.playlists.length === 0 && <p className="admin__muted">No playlists yet.</p>}
                <ul className="admin__list">
                    {links.playlists.map((playlist, i) => (
                        <li key={playlist.id} className="admin__row">
                            <div className="admin__row-text">
                                <a href={`https://open.spotify.com/playlist/${playlist.id}`} target="_blank" rel="noreferrer">
                                    {playlist.title}
                                </a>
                                <span className="admin__muted">{playlist.id}</span>
                            </div>
                            <RowControls id={playlist.id} index={i} count={links.playlists.length} move={movePlaylist} remove={removePlaylist} />
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}

function RowControls({ id, index, count, move, remove }: {
    id: string;
    index: number;
    count: number;
    move: (formData: FormData) => Promise<void>;
    remove: (formData: FormData) => Promise<void>;
}) {
    return (
        <div className="admin__controls">
            <form action={move}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="direction" value="up" />
                <button className="admin__icon-button" type="submit" disabled={index === 0} aria-label="Move up">↑</button>
            </form>
            <form action={move}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="direction" value="down" />
                <button className="admin__icon-button" type="submit" disabled={index === count - 1} aria-label="Move down">↓</button>
            </form>
            <form action={remove}>
                <input type="hidden" name="id" value={id} />
                <button className="admin__button admin__button--danger" type="submit">Remove</button>
            </form>
        </div>
    );
}

async function loadTracks(ids: string[]) {
    const tracks = new Map<string, Track>();
    try {
        const token = await getSpotifyToken();
        const results = await Promise.allSettled(ids.map(id => getTrack(id, token)));
        results.forEach((r, i) => {
            if (r.status === "fulfilled") tracks.set(ids[i], r.value);
        });
    } catch (error) {
        console.error("Failed to load track details:", error);
    }
    return tracks;
}
