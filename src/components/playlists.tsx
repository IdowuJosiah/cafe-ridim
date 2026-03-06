import "./playlist.css";

const playlists = [
    {
        id: "37i9dQZF1DZ06evO21rV4I",
        title: "Guilty Pleasures",
    },
    {
        id: "37i9dQZF1E4wl2HLNaYsgY",
        title: "Playlist 2",
    },
    {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        title: "Playlist 3",
    },
];

export default function Playlists() {
    return (
        <section className="playlists">
            <h2 className="playlists__title">OUR PLAYLISTS</h2>
            <div className="playlists__grid">
                {playlists.map((playlist) => (
                    <iframe
                        key={playlist.id}
                        className="playlists__embed"
                        src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
                        loading="lazy"
                    />
                ))}
            </div>
        </section>
    );
}