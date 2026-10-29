import Home from "../components/home";
import { getLinks, getReleaseTracks } from "../lib/links";

// Rebuilt at most hourly so Spotify artwork stays fresh; admin saves rebuild it straight away
export const revalidate = 3600;

const loadReleases = () =>
    getReleaseTracks().catch(error => {
        console.error("Failed to load releases:", error);
        return [];
    });

const loadPlaylists = () =>
    getLinks()
        .then(links => links.playlists)
        .catch(error => {
            console.error("Failed to load playlists:", error);
            return [];
        });

export default async function Page() {
    // Fetched on the server so the releases and playlists arrive with the page instead of after it
    const [releases, playlists] = await Promise.all([loadReleases(), loadPlaylists()]);
    return <Home releases={releases} playlists={playlists} />;
}
