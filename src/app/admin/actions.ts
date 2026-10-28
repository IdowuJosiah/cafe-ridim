"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { checkPassword, createSession, destroySession, isLoggedIn } from "../../lib/admin-auth";
import { LINKS_CACHE_TAG, parseSpotifyId, readLinks, SpotifyLinks, writeLinks } from "../../lib/links";
import { getSpotifyToken, getTrack } from "../../lib/spotify";

// Status codes are mapped to messages on the page, so no user input is echoed back
const done = (status: string): never => redirect(`/admin?status=${status}`);

const requireAdmin = async () => {
    if (!(await isLoggedIn())) redirect("/admin");
};

const save = async (links: SpotifyLinks) => {
    try {
        await writeLinks(links);
    } catch (error) {
        console.error("Failed to save links:", error);
        done("save-failed");
    }
    updateTag(LINKS_CACHE_TAG);
};

const move = <T,>(items: T[], index: number, direction: string) => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= items.length) return items;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
};

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

export async function login(formData: FormData) {
    if (!checkPassword(field(formData, "password"))) {
        // Slow down password guessing
        await new Promise(resolve => setTimeout(resolve, 1000));
        done("wrong-password");
    }
    await createSession();
    redirect("/admin");
}

export async function logout() {
    await destroySession();
    redirect("/admin");
}

export async function addRelease(formData: FormData) {
    await requireAdmin();
    const id = parseSpotifyId(field(formData, "link"), "track");
    if (!id) return done("invalid-track");

    const links = await readLinks();
    if (links.releases.includes(id)) return done("duplicate");

    try {
        await getTrack(id, await getSpotifyToken());
    } catch {
        return done("track-not-found");
    }

    // Newest releases go first
    await save({ ...links, releases: [id, ...links.releases] });
    done("added");
}

export async function removeRelease(formData: FormData) {
    await requireAdmin();
    const id = field(formData, "id");
    const links = await readLinks();
    await save({ ...links, releases: links.releases.filter(r => r !== id) });
    done("removed");
}

export async function moveRelease(formData: FormData) {
    await requireAdmin();
    const links = await readLinks();
    const index = links.releases.indexOf(field(formData, "id"));
    await save({ ...links, releases: move(links.releases, index, field(formData, "direction")) });
    done("moved");
}

export async function addPlaylist(formData: FormData) {
    await requireAdmin();
    const id = parseSpotifyId(field(formData, "link"), "playlist");
    if (!id) return done("invalid-playlist");
    const title = field(formData, "title").slice(0, 100);
    if (!title) return done("missing-title");

    const links = await readLinks();
    if (links.playlists.some(p => p.id === id)) return done("duplicate");

    await save({ ...links, playlists: [...links.playlists, { id, title }] });
    done("added");
}

export async function removePlaylist(formData: FormData) {
    await requireAdmin();
    const id = field(formData, "id");
    const links = await readLinks();
    await save({ ...links, playlists: links.playlists.filter(p => p.id !== id) });
    done("removed");
}

export async function movePlaylist(formData: FormData) {
    await requireAdmin();
    const links = await readLinks();
    const index = links.playlists.findIndex(p => p.id === field(formData, "id"));
    await save({ ...links, playlists: move(links.playlists, index, field(formData, "direction")) });
    done("moved");
}
